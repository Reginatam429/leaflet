// Search species button
document.getElementById('search-species-btn').addEventListener('click', function () {
    const query = document.getElementById('id_species').value.trim();
    if (!query) return;

    fetch(`/plants/search-plants/?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById('plant-dropdown');
            dropdown.innerHTML = '';
            const results = data.data || [];

            if (results.length === 0) {
                const option = document.createElement('option');
                option.textContent = 'No results found';
                option.disabled = true;
                dropdown.appendChild(option);
            } else {
                results.forEach(plant => {
                    const option = document.createElement('option');
                    option.value = plant.id;
                    option.textContent = `${plant.common_name || 'No common name'} (${plant.scientific_name})`;
                    dropdown.appendChild(option);
                });
            }

            dropdown.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
});

// When user selects a plant
document.getElementById('plant-dropdown').addEventListener('change', function () {
    const selectedId = this.value;
    if (!selectedId) return;

    fetch(`/plants/plant-details/${selectedId}/`)
        .then(response => response.json())
        .then(plant => {
            console.log('🌱 Full plant details response:', plant);
            const queryFallback = document.getElementById('id_species').value.trim();
            const species = (Array.isArray(plant.scientific_name) ? plant.scientific_name[0] : plant.scientific_name) || queryFallback || '';
            const commonName = plant.common_name || '';
            const otherNames = Array.isArray(plant.other_name) ? plant.other_name.join(', ') : '';

            document.getElementById('id_species').value = species;
            document.getElementById('id_common_name').value = commonName;
            document.getElementById('id_other_names').value = otherNames;

            // Watering dropdown match
            const wateringField = document.getElementById('id_watering');
            if (wateringField && plant.watering) {
                const normalized = plant.watering.toLowerCase();
                const match = wateringField.querySelector(`option[value="${normalized}"]`);
                if (match) wateringField.value = normalized;

                // Assign water interval
                const intervalField = document.getElementById('id_water_interval');
                const wateringIntervalMap = {
                    "frequent": 3,
                    "average": 7,
                    "minimum": 14
                };
                if (intervalField && wateringIntervalMap[normalized]) {
                    intervalField.value = wateringIntervalMap[normalized];
                    intervalField.readOnly = true;
                }
            }

            // Sunlight dropdown match
            const sunlightField = document.getElementById('id_sunlight');
            if (sunlightField && Array.isArray(plant.sunlight) && plant.sunlight.length > 0) {
                const normalized = plant.sunlight[0].replace(/\s+/g, '_').toLowerCase();
                const match = sunlightField.querySelector(`option[value="${normalized}"]`);
                if (match) sunlightField.value = normalized;
            }

            // Summary field with poison logic
            const summaryField = document.getElementById('id_info_summary');
            if (summaryField) {
                const cycle = plant.cycle ? `It is a ${plant.cycle} plant.` : '';
                const edible = plant.edible ? 'It is edible.' : 'It is not edible.';

                let poisonNote = 'It is not poisonous.';
                if (plant.poisonous_to_humans && plant.poisonous_to_pets) {
                    poisonNote = 'Be careful, it is poisonous to humans and pets.';
                } else if (plant.poisonous_to_humans) {
                    poisonNote = 'Be careful, it is poisonous to humans.';
                } else if (plant.poisonous_to_pets) {
                    poisonNote = 'Be careful, it is poisonous to pets.';
                }

                const summary = `${species} also known as ${commonName || 'this plant'} — ${edible} ${poisonNote} ${cycle}`;
                summaryField.value = summary.trim();
            }

            // Show image preview from API if no file is selected
            const preview = document.getElementById('plant-preview');
            const fileInput = document.getElementById('id_image');
            if (preview && fileInput && !fileInput.value) {
                const apiImage = plant.default_image?.medium_url || plant.default_image?.regular_url;
                if (apiImage) {
                    preview.src = apiImage;
                } else {
                    preview.src = '/media/plant_images/default.jpg';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching plant details:', error);
        });
});

// Let user override water interval
document.getElementById('override_water_interval')?.addEventListener('change', function () {
    const field = document.getElementById('id_water_interval');
    if (field) field.readOnly = !this.checked;
});

// User image preview override
document.getElementById('id_image')?.addEventListener('change', function (e) {
    const preview = document.getElementById('plant-preview');
    const file = e.target.files[0];
    if (file && preview) {
        preview.src = URL.createObjectURL(file);
    }
});

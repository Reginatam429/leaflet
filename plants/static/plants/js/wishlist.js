function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.slice(name.length + 1));
        }
    }
    return '';
}

document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('wishlist-search-btn');
    const searchInput = document.getElementById('wishlist-search-input');
    const dropdown = document.getElementById('wishlist-search-dropdown');
    const modal = document.getElementById('wishlist-modal');
    const addBtn = document.getElementById('add-to-wishlist-btn');
    const addToMyPlantsBtn = document.getElementById('add-to-my-plants-btn');
    const deleteBtn = document.getElementById('delete-from-wishlist-btn');

    // Search for plants
    searchBtn.addEventListener('click', function () {
        const query = searchInput.value.trim();
        if (!query) return;

        fetch(`/plants/search-plants/?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
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
                console.error('Error searching plants:', error);
            });
    });

    // Show plant info from dropdown
    dropdown.addEventListener('change', function () {
        const selectedId = this.value;
        if (!selectedId) return;

        fetch(`/plants/plant-details/${selectedId}/`)
            .then(response => response.json())
            .then(plant => {
                const species = Array.isArray(plant.scientific_name) ? plant.scientific_name[0] : plant.scientific_name || '';
                const commonName = plant.common_name || '';
                const otherNames = Array.isArray(plant.other_name) ? plant.other_name.join(', ') : '';
                const imageUrl = plant.default_image?.regular_url || '/media/plant_images/default.png';
                const watering = plant.watering || '';
                const sunlight = Array.isArray(plant.sunlight) ? plant.sunlight.join(', ') : '';
                const summary = plant.cycle ? `It is a ${plant.cycle} plant.` : '';

                document.getElementById('modal-plant-name').textContent = `${commonName} (${species})`;
                document.getElementById('modal-species').textContent = species;
                document.getElementById('modal-other-names').textContent = otherNames;
                document.getElementById('modal-watering').textContent = watering;
                document.getElementById('modal-sunlight').textContent = sunlight;
                document.getElementById('modal-info-summary').textContent = summary;

                const imageEl = document.getElementById('modal-plant-img');
                imageEl.src = imageUrl;
                imageEl.alt = `${commonName} image`;

                // Update dataset for add-to-wishlist
                addBtn.dataset.perenualId = plant.id;
                addBtn.dataset.species = species;
                addBtn.dataset.commonName = commonName;
                addBtn.dataset.otherNames = otherNames;
                addBtn.dataset.watering = watering.toLowerCase();
                addBtn.dataset.sunlight = Array.isArray(plant.sunlight) ? plant.sunlight[0].toLowerCase().replace(/\s+/g, '_') : '';
                addBtn.dataset.summary = summary;
                addBtn.dataset.imageUrl = imageUrl;

                // Show wishlist button, hide others
                addBtn.style.display = 'inline-block';
                addToMyPlantsBtn.style.display = 'none';
                deleteBtn.style.display = 'none';

                modal.style.display = 'flex';
            })
            .catch(error => {
                console.error('Error fetching plant details:', error);
            });
    });

    // Add to wishlist
    addBtn.addEventListener('click', function () {
        const payload = {
            perenual_id: this.dataset.perenualId,
            species: this.dataset.species,
            common_name: this.dataset.commonName,
            other_names: this.dataset.otherNames.split(',').map(name => name.trim()).filter(Boolean),
            watering: this.dataset.watering,
            sunlight: this.dataset.sunlight,
            info_summary: this.dataset.summary,
            image_url: this.dataset.imageUrl
        };

        fetch('/plants/add-to-wishlist/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to add to wishlist');
            return response.json();
        })
        .then(data => {
            console.log('✅ Added to wishlist:', data);
            modal.style.display = 'none';
            location.reload();
        })
        .catch(error => {
            console.error('Error adding to wishlist:', error);
        });
    });

    // Close modal
    document.getElementById('wishlist-modal-close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
});

// Handle click on saved wishlist cards
document.querySelectorAll('.wishlist-item').forEach(item => {
    item.addEventListener('click', function () {
        const commonName = this.dataset.commonName;
        const species = this.dataset.species;
        const otherNames = this.dataset.otherNames;
        const watering = this.dataset.watering;
        const sunlight = this.dataset.sunlight;
        const info = this.dataset.info;
        const imageUrl = this.dataset.imageUrl || '/media/plant_images/default.png';

        document.getElementById('modal-plant-name').textContent = `${commonName} (${species})`;
        document.getElementById('modal-species').textContent = species;
        document.getElementById('modal-other-names').textContent = otherNames;
        document.getElementById('modal-watering').textContent = watering;
        document.getElementById('modal-sunlight').textContent = sunlight;
        document.getElementById('modal-info-summary').textContent = info;
        document.getElementById('modal-plant-img').src = imageUrl;
        document.getElementById('modal-plant-img').alt = commonName;

        // Set wishlist ID for backend
        const wishlistId = this.dataset.id;
        const alreadyAdded = this.dataset.added === 'true';

        const addToMyPlantsBtn = document.getElementById('add-to-my-plants-btn');
        const deleteBtn = document.getElementById('delete-from-wishlist-btn');
        const addToWishlistBtn = document.getElementById('add-to-wishlist-btn');

        // Hide search-only button
        addToWishlistBtn.style.display = 'none';

        // Set button actions
        addToMyPlantsBtn.dataset.wishlistId = wishlistId;
        deleteBtn.dataset.wishlistId = wishlistId;

        if (alreadyAdded) {
            addToMyPlantsBtn.textContent = '🌿 View My Plants';
            addToMyPlantsBtn.onclick = () => {
                window.location.href = '/my-plants/';
            };
        } else {
            addToMyPlantsBtn.textContent = '🌿 Add to My Plants';
            addToMyPlantsBtn.onclick = function () {
                fetch('/plants/add-from-wishlist-to-myplants/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken()
                    },
                    body: JSON.stringify({ wishlist_id: wishlistId })
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to add plant');
                    return response.json();
                })
                .then(data => {
                    alert(`🌱 Plant added to your collection!\n\nView it here: http://127.0.0.1:8000/my-plants/`);
                    document.getElementById('wishlist-modal').style.display = 'none';
                    location.reload();
                })                
                .catch(error => {
                    console.error('Error adding to my plants:', error);
                });
            };
        }

        // Show correct buttons
        addToMyPlantsBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'inline-block';

        document.getElementById('wishlist-modal').style.display = 'flex';
    });
});


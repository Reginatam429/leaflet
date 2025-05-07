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

    // 🌱 Search for plants
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

    // 📋 Show plant info in modal
    dropdown.addEventListener('change', function () {
        const selectedId = this.value;
        if (!selectedId) return;

        fetch(`/plants/plant-details/${selectedId}/`)
            .then(response => response.json())
            .then(plant => {
                console.log('🪴 Wishlist Plant Details:', plant);

                const species = Array.isArray(plant.scientific_name) ? plant.scientific_name[0] : plant.scientific_name || '';
                const commonName = plant.common_name || '';
                const otherNames = Array.isArray(plant.other_name) ? plant.other_name.join(', ') : '';
                const imageUrl = plant.default_image?.regular_url || '';
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
                if (imageUrl) {
                    imageEl.src = imageUrl;
                    imageEl.alt = `${commonName} image`;
                }

                addBtn.dataset.perenualId = plant.id;
                addBtn.dataset.species = species;
                addBtn.dataset.commonName = commonName;
                addBtn.dataset.otherNames = otherNames;
                addBtn.dataset.watering = watering;
                addBtn.dataset.sunlight = Array.isArray(plant.sunlight) ? plant.sunlight[0] : '';
                addBtn.dataset.summary = summary;
                addBtn.dataset.imageUrl = imageUrl;

                modal.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching plant details:', error);
            });
    });

    // 💾 Add to wishlist
    addBtn.addEventListener('click', function () {
        const payload = {
            perenual_id: this.dataset.perenualId,
            species: this.dataset.species,
            common_name: this.dataset.commonName,
            other_names: this.dataset.otherNames.split(',').map(name => name.trim()).filter(Boolean),
            watering: this.dataset.watering.toLowerCase(),
            sunlight: this.dataset.sunlight.replace(/\s+/g, '_').toLowerCase(),
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
                document.getElementById('wishlist-modal').style.display = 'none';
            
                // Show feedback message
                const feedback = document.getElementById('wishlist-feedback');
                feedback.style.display = 'block';
                feedback.textContent = '✅ Plant added to wishlist!';
            
                // Hide the message after 3 seconds
                setTimeout(() => {
                    feedback.style.display = 'none';
                }, 3000);
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

    // 🔐 CSRF token helper
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
});

document.querySelectorAll('.wishlist-item').forEach(item => {
    item.addEventListener('click', function () {
        document.getElementById('modal-plant-name').textContent =
            `${this.dataset.commonName} (${this.dataset.species})`;
        document.getElementById('modal-other-names').textContent = this.dataset.otherNames;
        document.getElementById('modal-watering').textContent = this.dataset.watering;
        document.getElementById('modal-sunlight').textContent = this.dataset.sunlight;
        document.getElementById('modal-info-summary').textContent = this.dataset.info;
        document.getElementById('modal-plant-img').src = this.dataset.imageUrl;
        document.getElementById('modal-plant-img').alt = this.dataset.commonName;

        // Set modal buttons for follow-up actions
        const deleteBtn = document.getElementById('delete-from-wishlist-btn');
        deleteBtn.dataset.wishlistId = this.dataset.id;

        const addToMyPlantsBtn = document.getElementById('add-to-my-plants-btn');
        addToMyPlantsBtn.dataset.wishlistId = this.dataset.id;

        document.getElementById('wishlist-modal').style.display = 'block';
    });
});

document.getElementById('delete-from-wishlist-btn').addEventListener('click', function () {
    const wishlistId = this.dataset.wishlistId;

    fetch(`/plants/delete-from-wishlist/${wishlistId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to delete from wishlist');
        alert('❌ Plant removed from wishlist.');
        location.reload();
    })
    .catch(error => {
        console.error('Error removing from wishlist:', error);
    });
});

document.getElementById('add-to-my-plants-btn').addEventListener('click', function () {
    const payload = {
        wishlist_id: this.dataset.wishlistId
    };

    fetch('/plants/add-from-wishlist-to-myplants/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add plant');
        return response.json();
    })
    .then(data => {
        alert(`🌱 Plant added to your collection!\n\nView it here: http://127.0.0.1:8000/my-plants/`);
        document.getElementById('wishlist-modal').style.display = 'none';
    })
    .catch(error => {
        console.error('Error adding to my plants:', error);
    });
});



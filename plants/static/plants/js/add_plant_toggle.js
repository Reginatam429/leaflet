function toggleAddPlantForm() {
    const form = document.getElementById('add-plant-form');
    const toggleBtn = document.getElementById('toggle-add-plant-btn');

    const isHidden = form.style.display === 'none' || form.style.display === '';

    form.style.display = isHidden ? 'block' : 'none';
    toggleBtn.textContent = isHidden ? 'Close' : 'Add Plant';
}

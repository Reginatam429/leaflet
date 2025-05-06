function openModal(plantId) {
    document.getElementById(`modal-${plantId}`).style.display = 'block';
    document.getElementById(`plant-details-${plantId}`).style.display = 'block';
    document.getElementById(`edit-form-${plantId}`).style.display = 'none';
}

function closeModal(plantId) {
    document.getElementById(`modal-${plantId}`).style.display = 'none';
}

function showEditForm(plantId) {
    document.getElementById(`plant-details-${plantId}`).style.display = 'none';
    document.getElementById(`edit-form-${plantId}`).style.display = 'block';
}

window.onclick = function(event) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

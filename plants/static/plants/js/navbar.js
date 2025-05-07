document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.dropbtn');
    const menu = document.querySelector('.dropdown-content');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();  // prevents bubbling to body click
        menu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        menu.classList.remove('show');
    });
});

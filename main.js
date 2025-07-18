document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const overlay = document.getElementById('overlay');
    const closeMenu = document.getElementById('closeMenu');
    const links = menu.querySelectorAll('a');

    function openMenu() {
        menu.classList.add('active');
        overlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenuFn() {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        expanded ? closeMenuFn() : openMenu();
    });

    closeMenu.addEventListener('click', closeMenuFn);
    overlay.addEventListener('click', closeMenuFn);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenuFn();
    });

    const sectionsClaires = document.querySelectorAll('[data-clair]');

    const observerClair = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                menuToggle.classList.add('clair');
            } else {
                menuToggle.classList.remove('clair');
            }
        });
    }, { threshold: 0.5 });

    sectionsClaires.forEach(section => observerClair.observe(section));
    sectionsClaires.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (
            rect.top < window.innerHeight * 0.5 &&
            rect.bottom > window.innerHeight * 0.5
        ) {
            menuToggle.classList.add('clair');
        }
    });

    // Fermer le menu au clic sur une ancre
    links.forEach(link => {
        link.addEventListener('click', closeMenuFn);
    });

    // Animation d’apparition simple

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.carte-projet').forEach(carte => {
        observer.observe(carte);
    });
});
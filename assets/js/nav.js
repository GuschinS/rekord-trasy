/* Menu mobilne */
(function () {
    'use strict';
    var nav = document.getElementById('nav'), toggle = document.getElementById('navToggle');
    if (!nav || !toggle) return;
    toggle.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', nav.classList.toggle('open'));
    });
    nav.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
    });
})();

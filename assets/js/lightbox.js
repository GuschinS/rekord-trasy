/* Galeria: powiększenie zdjęcia po kliknięciu miniatury */
(function () {
    'use strict';
    var $ = function (id) { return document.getElementById(id); };
    if (!$('gallery') || !$('lightbox')) return;
    var close = function () { $('lightbox').hidden = true; $('lightboxImg').removeAttribute('src'); };
    $('gallery').addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (!a) return;
        e.preventDefault();
        $('lightboxImg').src = a.href;
        $('lightboxImg').alt = a.dataset.title;
        $('lightboxCap').textContent = a.dataset.title;
        $('lightbox').hidden = false;
    });
    $('lightbox').addEventListener('click', function (e) { if (e.target !== $('lightboxImg')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

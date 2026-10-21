/* Galeria: przeglądarka zdjęć — powiększenie, poprzednie/następne, klawiatura i gest przesunięcia */
(function () {
    'use strict';
    var $ = function (id) { return document.getElementById(id); };
    var gallery = $('gallery'), box = $('lightbox');
    if (!gallery || !box) return;

    var LABELS = {
        pl: ['Poprzednie zdjęcie', 'Następne zdjęcie'],
        en: ['Previous photo', 'Next photo'],
        de: ['Vorheriges Foto', 'Nächstes Foto']
    };
    var labels = LABELS[document.documentElement.lang] || LABELS.pl;
    var closeBtn = $('lightboxClose');
    var btnClass = closeBtn ? closeBtn.className : '';
    var mkBtn = function (cls, text, label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = btnClass + ' ' + cls;
        b.textContent = text;
        b.setAttribute('aria-label', label);
        box.appendChild(b);
        return b;
    };
    var prev = mkBtn('lb-prev', '‹', labels[0]);
    var next = mkBtn('lb-next', '›', labels[1]);

    var items = [].slice.call(gallery.querySelectorAll('a'));
    var idx = 0;

    var show = function (i) {
        idx = (i + items.length) % items.length;
        var a = items[idx];
        $('lightboxImg').src = a.href;
        $('lightboxImg').alt = a.dataset.title;
        $('lightboxCap').textContent = a.dataset.title + ' · ' + (idx + 1) + ' / ' + items.length;
        // Wczytaj z wyprzedzeniem sąsiednie zdjęcia
        [idx - 1, idx + 1].forEach(function (j) {
            new Image().src = items[(j + items.length) % items.length].href;
        });
    };
    var open = function (i) { show(i); box.hidden = false; };
    var close = function () { box.hidden = true; $('lightboxImg').removeAttribute('src'); };

    gallery.addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (!a) return;
        e.preventDefault();
        open(items.indexOf(a));
    });
    prev.addEventListener('click', function () { show(idx - 1); });
    next.addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) {
        if (e.target === box || e.target === closeBtn) close();
    });
    document.addEventListener('keydown', function (e) {
        if (box.hidden) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(idx - 1);
        else if (e.key === 'ArrowRight') show(idx + 1);
    });

    // Gest przesunięcia na ekranach dotykowych
    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        startX = null;
        if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    });
})();

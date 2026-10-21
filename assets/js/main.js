/* Strona główna: wykaz rekordzistów, wykres i mapa trasy */
(function () {
    'use strict';

    // Teksty interfejsu zależnie od języka strony (<html lang>)
    var I18N = {
        pl: { cats: ['Jednokadłubowce', 'Wielokadłubowce', 'Opale', 'Samotnicy', 'Double‑Handed'], all: 'Wszystkie', current: 'Aktualny', beaten: 'Pobity', ref: 'Czas porównawczy', capt: 'kpt.', crew: 'załoga', line: 'Linia startu/mety', chart: 'Wykres czasów rekordowych w latach 1983–2009', terms: {} },
        en: { cats: ['Monohulls', 'Multihulls', 'Opal class', 'Single‑handed', 'Double‑handed'], all: 'All', current: 'Current', beaten: 'Beaten', ref: 'Reference time', capt: 'Capt.', crew: 'crew', line: 'Start/finish line', chart: 'Chart of record times, 1983–2009', terms: { 'maxi katamaran': 'maxi catamaran', 'katamaran F‑40': 'F‑40 catamaran', 'katamaran': 'catamaran', 'trimaran kl. Exploder 25': 'Exploder 25 class trimaran', 'jednokadłubowiec': 'monohull', 'Własność prywatna': 'Privately owned' } },
        de: { cats: ['Einrumpfboote', 'Mehrrumpfboote', 'Opal‑Klasse', 'Einhand', 'Double‑Handed'], all: 'Alle', current: 'Aktuell', beaten: 'Gebrochen', ref: 'Vergleichszeit', capt: 'Skipper', crew: 'Crew', line: 'Start-/Ziellinie', chart: 'Diagramm der Rekordzeiten 1983–2009', terms: { 'maxi katamaran': 'Maxi‑Katamaran', 'katamaran F‑40': 'Katamaran F‑40', 'katamaran': 'Katamaran', 'trimaran kl. Exploder 25': 'Trimaran, Klasse Exploder 25', 'jednokadłubowiec': 'Einrumpfboot', 'Własność prywatna': 'Privatbesitz' } }
    };
    var T = I18N[document.documentElement.lang] || I18N.pl;
    var tr = function (s) { return T.terms[s] || s; };

    var CATEGORIES = {
        mono:  { label: T.cats[0], color: 'var(--mono)' },
        multi: { label: T.cats[1], color: 'var(--multi)' },
        opal:  { label: T.cats[2], color: 'var(--opal)' },
        solo:  { label: T.cats[3], color: 'var(--solo)' },
        double: { label: T.cats[4], color: 'var(--double)' }
    };

    // Źródło: https://www.rekord-trasy.info/pl/rekordzisci.html (time w minutach)
    var RECORDS = [
        { cat: 'mono',  date: '1983-09-02', yacht: 'Hetman',            type: '',                          skipper: 'Jan Pinkiewicz',             crew: 9,  club: 'JKMW Kotwica',              time: 41 * 60 + 17 },
        { cat: 'mono',  date: '1983-09-20', yacht: 'Wojewoda Pomorski', type: '',                          skipper: 'Janusz Nadolny‑Zawadowicz',  crew: 10, club: 'AKM Gdańsk',                time: 30 * 60 + 35 },
        { cat: 'mono',  date: '1984-07-15', yacht: 'Kneź',              type: '',                          skipper: 'Władysław Beyer',            crew: 10, club: 'YKP Gdynia',                time: 25 * 60 + 53 },
        { cat: 'mono',  date: '1987-08-02', yacht: 'Kneź',              type: '',                          skipper: 'Władysław Beyer',            crew: 5,  club: 'YKP Gdynia',                time: 23 * 60 + 12 },
        { cat: 'mono',  date: '2003-07-28', yacht: 'Łódka Bols',        type: '',                          skipper: 'Jarosław Kaczorowski',       crew: 17, club: 'RORC',                      time: 16 * 60 },
        { cat: 'multi', date: '1984-07-24', yacht: 'Almatur III',       type: 'katamaran',                 skipper: 'Wojciech Kaliski',           crew: 5,  club: 'Własność prywatna',         time: 19 * 60 + 42 },
        { cat: 'multi', date: '1999',       yacht: 'Alkaprim',          type: 'katamaran F‑40',            skipper: 'Roman Paszke',               crew: 5,  club: 'Polfarma Starogard Gdański', time: 13 * 60 + 50 },
        { cat: 'multi', date: '2007-08-16', yacht: 'Insgraf',           type: 'trimaran kl. Exploder 25',  skipper: 'Wojciech Kaliski',           crew: 3,  club: 'Insgraf Warszawa',          time: 13 * 60 + 32 },
        { cat: 'multi', date: '2009-08-30', yacht: 'Gemini 3',          type: 'maxi katamaran',            skipper: 'Roman Paszke',               crew: 10, club: 'Race‑2000',                 time: 13 * 60 + 7 },
        { cat: 'multi', date: '2009-10-25', yacht: 'Gemini 3',          type: 'maxi katamaran',            skipper: 'Roman Paszke',               crew: 9,  club: 'Race‑2000',                 time: 8 * 60 + 55 },
        { cat: 'opal',  date: '1984-09-03', yacht: 'Portowiec Gdański', type: '',                          skipper: 'Mariusz Pycz‑Pyczewski',     crew: 9,  club: 'TKKF Portowiec Gdański',    time: 30 * 60 + 39 },
        { cat: 'opal',  date: '1984-08-29', yacht: 'Dunajec',           type: '',                          skipper: 'Mirosław Peszkowski',        crew: 10, club: 'Nowosądecki OZŻ',           time: 28 * 60 + 6 },
        { cat: 'opal',  date: '1985-06-16', yacht: 'Komandor II',       type: '',                          skipper: 'Kazimierz Klugman',          crew: 8,  club: 'JKMW Kotwica',              time: 27 * 60 + 38 },
        { cat: 'solo',  date: '2003-09-03', yacht: 'Morka',             type: 'jednokadłubowiec',          skipper: 'Zbigniew Szafranowicz',      crew: 1,  club: 'Własność prywatna',         time: 28 * 60 + 6 },
        { cat: 'double', date: '2026-10-19', yacht: 'Lara Jane',         type: '',                          skipper: 'Roman Paszke, Aleksander Pieciukiewicz', crew: 2, club: '—',                time: 27 * 60, sec: 54, ref: true }
    ];

    var $ = function (id) { return document.getElementById(id); };
    var esc = function (s) {
        return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
    };
    var fmtTime = function (min) {
        var m = min % 60;
        return Math.floor(min / 60) + ' h ' + (m < 10 ? '0' : '') + m + ' min';
    };
    // Czas wpisu; sekundy tylko tam, gdzie zostały podane
    var fmtRec = function (r) {
        return fmtTime(r.time) + (r.sec ? ' ' + (r.sec < 10 ? '0' : '') + r.sec + ' s' : '');
    };
    var fmtDate = function (d) {
        var p = d.split('-');
        return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : d;
    };
    var yearFrac = function (d) {
        var p = d.split('-');
        return +p[0] + (p.length === 3 ? ((+p[1] - 1) * 30.4 + +p[2]) / 365 : 0.5);
    };

    // Aktualny rekord kategorii = najlepszy czas
    var best = {};
    RECORDS.forEach(function (r) {
        if (!best[r.cat] || r.time < best[r.cat].time) best[r.cat] = r;
    });
    var isCurrent = function (r) { return best[r.cat] === r; };

    $('statCount').textContent = RECORDS.length;

    /* Aktualne rekordy */
    $('current').innerHTML = Object.keys(CATEGORIES).map(function (key) {
        var r = best[key], c = CATEGORIES[key];
        return '<button type="button" class="card" data-cat="' + key + '" aria-pressed="false" style="--cat:' + c.color + '"><div class="card-body">' +
            '<div class="subheader">' + c.label + '</div>' +
            '<div class="current-time num">' + fmtRec(r) + '</div>' +
            '<div class="current-yacht">' + esc(r.yacht) + '</div>' +
            '<div class="muted">' + T.capt + ' ' + esc(r.skipper) + ' · ' + fmtDate(r.date) + '</div>' +
            '</div></button>';
    }).join('');

    /* Wykaz rekordzistów */
    var state = { cat: 'all', q: '', view: 'list' };
    var drawChart = null;

    $('catFilter').innerHTML = [['all', T.all]].concat(Object.keys(CATEGORIES).map(function (k) {
        return [k, CATEGORIES[k].label];
    })).map(function (c) {
        return '<button type="button" class="btn" data-cat="' + c[0] + '">' + c[1] + '</button>';
    }).join('');

    var statusBadge = function (r) {
        if (r.ref) return '<span class="badge badge-primary">' + T.ref + '</span>';
        return isCurrent(r)
            ? '<span class="badge badge-success">' + T.current + '</span>'
            : '<span class="badge">' + T.beaten + '</span>';
    };
    var catBadge = function (r) {
        var c = CATEGORIES[r.cat];
        return '<span class="badge">' + c.label + '</span>';
    };
    // Kolor kategorii jako znacznik na początku wiersza / karty
    var mark = function (r) { return ' style="--cat:' + CATEGORIES[r.cat].color + '"'; };

    function render() {
        var q = state.q.trim().toLowerCase();
        var list = RECORDS.filter(function (r) {
            if (state.cat !== 'all' && r.cat !== state.cat) return false;
            if (!q) return true;
            return [r.yacht, r.type, r.skipper, r.club, r.date, CATEGORIES[r.cat].label].join(' ').toLowerCase().indexOf(q) !== -1;
        }).sort(function (a, b) { return a.time - b.time; });

        $('rows').innerHTML = list.map(function (r) {
            return '<tr' + mark(r) + '>' +
                '<td class="num" style="white-space:nowrap">' + fmtDate(r.date) + '</td>' +
                '<td><div class="yacht">' + esc(r.yacht) + '</div>' + (r.type ? '<div class="muted">' + esc(tr(r.type)) + '</div>' : '') + '</td>' +
                '<td>' + esc(r.skipper) + '</td>' +
                '<td class="num">' + r.crew + '</td>' +
                '<td>' + esc(tr(r.club)) + '</td>' +
                '<td>' + catBadge(r) + '</td>' +
                '<td class="time-cell"><strong class="num">' + fmtRec(r) + '</strong> ' + statusBadge(r) + '</td>' +
                '</tr>';
        }).join('');

        $('cards').innerHTML = list.map(function (r) {
            return '<div class="card"' + mark(r) + '><div class="card-body">' +
                '<div class="row">' + catBadge(r) + statusBadge(r) + '</div>' +
                '<div class="current-time num">' + fmtRec(r) + '</div>' +
                '<div class="yacht" style="margin-top:6px">' + esc(r.yacht) + (r.type ? ' <span class="muted" style="font-weight:400">· ' + esc(tr(r.type)) + '</span>' : '') + '</div>' +
                '<div>' + T.capt + ' ' + esc(r.skipper) + '</div>' +
                '<div class="muted">' + fmtDate(r.date) + ' · ' + T.crew + ': ' + r.crew + ' · ' + esc(tr(r.club)) + '</div>' +
                '</div></div>';
        }).join('');

        $('emptyList').hidden = $('emptyCards').hidden = list.length > 0;
        $('listView').hidden = state.view !== 'list';
        $('cardsView').hidden = state.view !== 'cards';

        [].forEach.call($('catFilter').children, function (b) {
            b.className = 'btn ' + (b.dataset.cat === state.cat ? 'btn-primary' : 'btn-outline');
        });
        [].forEach.call($('current').children, function (b) {
            var on = b.dataset.cat === state.cat;
            b.classList.toggle('active', on);
            b.classList.toggle('dimmed', state.cat !== 'all' && !on);
            b.setAttribute('aria-pressed', on);
        });
        $('showAll').hidden = state.cat === 'all';
        if (drawChart) drawChart();
        [].forEach.call($('viewToggle').children, function (b) {
            b.className = 'btn ' + (b.dataset.view === state.view ? 'btn-primary' : 'btn-outline');
        });
    }

    $('catFilter').addEventListener('click', function (e) {
        var b = e.target.closest('[data-cat]');
        if (b) { state.cat = b.dataset.cat; render(); }
    });
    // Karty aktualnych rekordów filtrują wykaz; ponowne kliknięcie wyłącza filtr
    $('current').addEventListener('click', function (e) {
        var b = e.target.closest('[data-cat]');
        if (!b) return;
        state.cat = state.cat === b.dataset.cat ? 'all' : b.dataset.cat;
        render();
        if (state.cat !== 'all') $('toolbar').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('showAll').addEventListener('click', function () { state.cat = 'all'; render(); });
    $('viewToggle').addEventListener('click', function (e) {
        var b = e.target.closest('[data-view]');
        if (b) { state.view = b.dataset.view; render(); }
    });
    $('search').addEventListener('input', function (e) { state.q = e.target.value; render(); });
    render();

    /* Wykres: rekord w czasie */
    drawChart = function () {
        var W = 1000, H = 300, L = 48, R = 16, T = 12, B = 30;
        var x0 = 1982, x1 = 2028, y1 = 45;
        var X = function (y) { return L + (y - x0) / (x1 - x0) * (W - L - R); };
        var Y = function (h) { return T + (1 - h / y1) * (H - T - B); };
        var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + T.chart + '">';
        for (var h = 0; h <= 40; h += 10) {
            s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(h) + '" y2="' + Y(h) + '" stroke="#e5e7eb"/>' +
                 '<text x="' + (L - 8) + '" y="' + (Y(h) + 4) + '" text-anchor="end" font-size="12" fill="#6b7280">' + h + ' h</text>';
        }
        for (var y = 1985; y <= 2025; y += 5) {
            s += '<text x="' + X(y) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="12" fill="#6b7280">' + y + '</text>';
        }
        Object.keys(CATEGORIES).forEach(function (key) {
            var color = CATEGORIES[key].color;
            s += '<g opacity="' + (state.cat === 'all' || state.cat === key ? 1 : 0.18) + '">';
            var pts = RECORDS.filter(function (r) { return r.cat === key; })
                .sort(function (a, b) { return yearFrac(a.date) - yearFrac(b.date); });
            // Linia schodkowa: rekord obowiązuje do następnej poprawy
            var d = '', cur = Infinity;
            pts.forEach(function (r) {
                if (r.time >= cur) return;
                var px = X(yearFrac(r.date)), py = Y(r.time / 60);
                d += d ? ' H' + px.toFixed(1) + ' V' + py.toFixed(1) : 'M' + px.toFixed(1) + ' ' + py.toFixed(1);
                cur = r.time;
            });
            d += ' H' + X(x1 - 0.5).toFixed(1);
            s += '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" style="stroke:' + color + '"/>';
            pts.forEach(function (r) {
                s += '<circle cx="' + X(yearFrac(r.date)).toFixed(1) + '" cy="' + Y(r.time / 60).toFixed(1) + '" r="5" fill="#fff" stroke-width="2" style="stroke:' + color + '" tabindex="0" data-i="' + RECORDS.indexOf(r) + '"/>';
            });
            s += '</g>';
        });
        s += '</svg><div class="chart-tip" id="chartTip" hidden></div>';
        $('chart').innerHTML = s;
        $('legend').innerHTML = Object.keys(CATEGORIES).map(function (k) {
            return '<span><i class="dot" style="background:' + CATEGORIES[k].color + '"></i>' + CATEGORIES[k].label + '</span>';
        }).join('');
    };
    drawChart();

    // Podpowiedź na wykresie: kto, na czym i kiedy ustanowił rekord
    var showTip = function (el) {
        var r = RECORDS[el.dataset.i], tip = $('chartTip');
        if (!r || !tip) return;
        tip.innerHTML = '<div class="t num">' + fmtRec(r) + '</div>' +
            '<div><b>' + esc(r.yacht) + '</b>' + (r.type ? ' · ' + esc(tr(r.type)) : '') + '</div>' +
            '<div>' + T.capt + ' ' + esc(r.skipper) + '</div>' +
            '<div class="muted">' + fmtDate(r.date) + ' · ' + CATEGORIES[r.cat].label + (r.ref ? ' · ' + T.ref.toLowerCase() : isCurrent(r) ? ' · ' + T.current.toLowerCase() : '') + '</div>';
        tip.hidden = false;
        var box = $('chart').getBoundingClientRect(), c = el.getBoundingClientRect();
        var x = c.left + c.width / 2 - box.left, half = tip.offsetWidth / 2;
        tip.style.left = Math.max(half + 4, Math.min(box.width - half - 4, x)) + 'px';
        var y = c.top - box.top;
        // Za mało miejsca nad punktem: pokaż pod nim
        tip.style.transform = y < tip.offsetHeight + 16 ? 'translate(-50%, 22px)' : '';
        tip.style.top = y + 'px';
    };
    var hideTip = function () { var t = $('chartTip'); if (t) t.hidden = true; };
    ['mouseover', 'focusin', 'click'].forEach(function (ev) {
        $('chart').addEventListener(ev, function (e) {
            if (e.target.dataset && e.target.dataset.i !== undefined) showTip(e.target);
        });
    });
    $('chart').addEventListener('mouseout', function (e) { if (e.target.tagName === 'circle') hideTip(); });
    $('chart').addEventListener('focusout', hideTip);

    /* Mapa (przebieg poglądowy) */
    if (window.L) {
        var LINE_SWI = [[53.931689, 14.277739], [53.944289, 14.273803]];
        var LINE_GDY = [[54.517111, 18.561733], [54.512201, 18.561733]];
        var mid = function (l) { return [(l[0][0] + l[1][0]) / 2, (l[0][1] + l[1][1]) / 2]; };
        var route = [
            mid(LINE_SWI), [54.020, 14.330], [54.230, 15.300], [54.420, 16.100], [54.650, 16.800],
            [54.800, 17.500], [54.880, 18.050], [54.860, 18.400], [54.720, 18.720], [54.580, 18.850],
            [54.550, 18.700], mid(LINE_GDY)
        ];
        var map = L.map('map', { scrollWheelZoom: false, attributionControl: true });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 16,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        var line = L.polyline(route, { color: '#045282', weight: 3, dashArray: '8 6' }).addTo(map);
        var pin = function (ll, label, dir) {
            L.circleMarker(ll, { radius: 7, color: '#045282', weight: 2, fillColor: '#fff', fillOpacity: 1 })
                .addTo(map).bindTooltip(label, { permanent: true, direction: dir, offset: [0, dir === 'top' ? -8 : 8] });
        };
        [LINE_SWI, LINE_GDY].forEach(function (l) {
            L.polyline(l, { color: '#d63939', weight: 4 }).addTo(map).bindTooltip(T.line);
        });
        pin(route[0], 'Świnoujście', 'bottom');
        pin(route[route.length - 1], 'Gdynia', 'bottom');
        var fit = function () {
            map.invalidateSize();
            map.fitBounds(line.getBounds(), { padding: [28, 28] });
        };
        fit();
        // Kontener zmienia rozmiar po załadowaniu układu i przy zmianie szerokości okna
        if (window.ResizeObserver) new ResizeObserver(fit).observe($('map'));
        else window.addEventListener('resize', fit);
    } else {
        $('map').style.display = 'none';
    }
})();

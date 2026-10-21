# Rekord Trasy Świnoujście – Gdynia – Świnoujście

Nowa interpretacja serwisu [rekord-trasy.info](https://www.rekord-trasy.info/) — strony Żeglarskiego Rekordu Trasy wzdłuż polskiego wybrzeża.

Serwis ma dwie wersje zbudowane na tej samej, nowej technologii (statyczny HTML, CSS i JavaScript, bez frameworków i bez etapu budowania):

- **Wersja klasyczna** — główna strona serwisu. Wygląda jak dotychczasowa strona z 2010 roku (szablon Joomla „bluepulse”), działa pod dotychczasowymi adresami i jest uzupełniona o politykę prywatności, nowy regulamin, informację o śledzeniu prób na żywo (OMNI REGATTA) i nową kategorię Double‑Handed.
- **Nowa wersja** — nowoczesna strona w stylu serwisu [Omni Regatta](https://regatta.osgps.pl/) pod adresem `/nowa/`, z mapą trasy, wykresem rekordów i wersjami po angielsku i niemiecku.

Między wersjami przechodzi się **wyłącznie** przyciskami: „Nowa wersja strony” w wersji klasycznej i „Wersja klasyczna” w nowej. Żadne inne odnośniki nie prowadzą z jednej wersji do drugiej — każda ma własny regulamin, politykę prywatności i menu.

## Co zawiera

**Wersja klasyczna**

- `index.html` — strona główna: śledzenie rekordu na żywo, czas porównawczy w kategorii Double‑Handed, artykuł o rekordzie Gemini 3.
- `pl/rekordzisci.html`, `pl/historia.html`, `pl/regulamin.html`, `pl/media.html`, `pl/linki.html`, `pl/kontakt.html` — podstrony pod dotychczasowymi adresami.
- `pl/polityka-prywatnosci.html` — polityka prywatności (RODO) przekazana przez administratora.
- `dokumenty/formularz-zgloszenia-proby.pdf` — formularz zgłoszenia próby bicia rekordu.
- `en.html` i `en/` — wersja angielska pod tymi samymi adresami co na dawnej stronie: `en/record-holders.html`, `en/history.html`, `en/rules.html`, `en/media.html`, `en/links.html`, `en/contact.html`, `en/privacy-policy.html`. Regulamin i polityka prywatności po angielsku są tłumaczeniem informacyjnym, wiąże tekst polski.
- Historia ma rozwijane wpisy: krótki opis roku, a po kliknięciu — szczegóły.
- `404.html`.

**Nowa wersja**

- `nowa/index.html` — aktualny rekord, mapa trasy z liniami startu i mety, wykaz rekordzistów z filtrem kategorii, wyszukiwarką i wykresem, historia, regulamin w skrócie, galeria, kontakt.
- `nowa/en/index.html`, `nowa/de/index.html` — tłumaczenia strony głównej nowej wersji.
- `nowa/regulamin.html`, `nowa/polityka-prywatnosci.html`, `nowa/en/privacy-policy.html` — regulamin i polityka prywatności w wyglądzie nowej wersji.

## Struktura

```
index.html, pl/, 404.html   wersja klasyczna (polska)
en.html, en/                wersja klasyczna (angielska)
nowa/                       nowa wersja (nowa/en/, nowa/de/ — tłumaczenia)
dokumenty/                  dokumenty do pobrania (PDF)
assets/classic/             arkusz stylów i grafika wersji klasycznej
assets/style.css            arkusz stylów nowej wersji
assets/js/                  main.js (nowa wersja: dane rekordów, wykres, mapa), nav.js (menu), lightbox.js (galeria)
assets/img/                 logo i zdjęcia; assets/img/thumb/ — miniatury galerii
assets/fonts/               czcionka Inter (woff2)
assets/vendor/              Leaflet 1.9.4
.htaccess                   przekierowania i nagłówki (Apache)
sitemap.xml, robots.txt
```

## Podgląd lokalny

Odnośniki i zasoby są adresowane od katalogu głównego (`/assets/...`, `/pl/...`), dlatego stronę trzeba otwierać przez serwer, a nie bezpośrednio z pliku:

```bash
python3 -m http.server 8765
```

Strona będzie dostępna pod adresem `http://localhost:8765/`.

## Wdrożenie

- Pliki z gałęzi `main` należy umieścić w **katalogu głównym domeny** `https://www.rekord-trasy.info`. Ten adres jest wpisany w znacznikach canonical, w `sitemap.xml` i w `.htaccess`.
- `.htaccess` działa tylko na serwerze **Apache**. Wymusza `https://www.`, przekierowuje stare adresy Joomla (wersje do druku, `/pl.html`, `/en.html`, dawne ścieżki zdjęć i logo) na nowe odpowiedniki oraz ustawia kompresję i pamięć podręczną. Na innym serwerze reguły trzeba przenieść do jego konfiguracji.
- Po publikacji warto zgłosić `sitemap.xml` w Google Search Console i przez kilka tygodni sprawdzać raport błędów 404.

### Gałęzie

| Gałąź | Przeznaczenie |
| --- | --- |
| `main` | wersja produkcyjna |
| `gh-pages` | podgląd na GitHub Pages pod adresem `https://guschins.github.io/rekord-trasy/` |

Gałąź `gh-pages` różni się od `main`: ścieżki mają przedrostek `/rekord-trasy/`, strony są oznaczone `noindex`, a `.htaccess` i `sitemap.xml` są usunięte. Nie aktualizuje się sama — zmiany z `main` trafiają do niej przez gałąź `preview-update` i pull request.

## Pamięć podręczna przeglądarki

Arkusze stylów i skrypty są dołączane z parametrem wersji, np. `/assets/style.css?v=20261021`. Po każdej zmianie pliku CSS lub JS trzeba zmienić tę wartość we wszystkich plikach HTML — inaczej przeglądarki odwiedzających mogą jeszcze przez jakiś czas pokazywać starą wersję.

## Aktualizacja rekordów

Dane rekordów są zapisane w kilku miejscach i przy nowym wpisie trzeba poprawić wszystkie:

1. tablica `RECORDS` w `assets/js/main.js` — z niej powstają wykres, filtry i tabela nowej wersji;
2. statyczne wiersze tabeli (`<tbody id="rows">`) i karty aktualnych rekordów (`id="current"`) w `nowa/index.html`, `nowa/en/index.html` i `nowa/de/index.html` — wersja widoczna dla wyszukiwarek, zanim uruchomi się skrypt;
3. tabele w `pl/rekordzisci.html` i `en/record-holders.html` (wersja klasyczna).

Jeśli zmienia się rekord absolutny, należy też zaktualizować obrazek `assets/classic/pl-plaktualnyRekord.png` w nagłówku wersji klasycznej, blok na górze nowej wersji, sekcję „Rekord w liczbach” oraz opisy w znacznikach `<meta name="description">`.

Wpis z polem `ref: true` w `RECORDS` to czas porównawczy (np. Double‑Handed, „Lara Jane”, 2026) — jest oznaczany osobno, nie jako rekord ratyfikowany.

## Wersje językowe

Wersja klasyczna jest po polsku i angielsku (flagi w prawym górnym rogu przełączają między odpowiadającymi sobie stronami). Strony `nowa/en/index.html` i `nowa/de/index.html` to przetłumaczone kopie `nowa/index.html` — nie powstają automatycznie. Po zmianie treści trzeba poprawić także obie kopie. Teksty generowane przez skrypt (kategorie, etykiety, podpowiedzi) są w słowniku `I18N` w `assets/js/main.js` i dobierają się według atrybutu `<html lang>`.

## Prywatność

Serwis nie zapisuje plików cookie, nie korzysta z pamięci przeglądarki i nie zawiera narzędzi analitycznych. Wersja klasyczna nie pobiera żadnych zasobów zewnętrznych. W nowej wersji jedynym zasobem zewnętrznym jest podkład mapy pobierany z serwerów OpenStreetMap.

## Do uzupełnienia przed publikacją

- **Pełne teksty.** Artykuł „Czy Paszke ustanowił rekord nie do pobicia?” jest podany w skróconym omówieniu, a rozwijane wpisy historii — we własnym, rozszerzonym omówieniu opracowania Mariana Kuli. Oryginalne teksty można wkleić w miejsca oznaczone komentarzami `<!-- PEŁNY TEKST ... -->` lub w rozwijane wpisy.
- **Regulamin, pkt 10.** Z przekazanego tekstu usunięto roboczą uwagę „mamy oficjalny Certyfikat?” — do potwierdzenia przez Komitet.
- **Regulamin, pkt 5.** Regulamin odsyła do „dedykowanej zakładki” z instrukcją aplikacji OMNI REGATTA RACE RECORDER — takiej strony jeszcze nie ma.
- **Adres e‑mail.** Strona „Kontakt” podaje dawny adres `rekordtrasy@gmail.com`, a regulamin i polityka prywatności — `komitet@rekord-trasy.info`.
- **Mapa w nowej wersji.** Polityka prywatności mówi o w pełni anonimowej wizycie, a mapa w `/nowa/` przekazuje adres IP serwerom OpenStreetMap.
- **Tłumaczenia** nie były sprawdzane przez native speakera.
- **Przebieg trasy na mapie** jest poglądowy; dokładne są tylko współrzędne linii startu i mety.

## Prawa autorskie i licencje

- Treści i zdjęcia: © Marian Kula 2010, źródło: rekord-trasy.info. Wywiad: Krzysztof Olejnik, magazyn „Wiatr”.
- Grafika wersji klasycznej pochodzi z dotychczasowego szablonu strony.
- [Leaflet](https://leafletjs.com/) — licencja BSD 2-Clause.
- Czcionka [Inter](https://rsms.me/inter/) — SIL Open Font License 1.1.
- Podkład mapy: © autorzy [OpenStreetMap](https://www.openstreetmap.org/copyright).

## Kontakt

Komitet Rekordu Trasy — komitet@rekord-trasy.info, tel. (+48) 609 458 350

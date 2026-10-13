# Rekord Trasy Świnoujście – Gdynia – Świnoujście

Nowa odsłona serwisu [rekord-trasy.info](https://www.rekord-trasy.info/) — strony Żeglarskiego Rekordu Trasy wzdłuż polskiego wybrzeża. Treść pochodzi z dotychczasowej strony (Joomla, 2010), a wygląd nawiązuje do serwisu [Omni Regatta](https://regatta.osgps.pl/).

To statyczna strona: czysty HTML, CSS i JavaScript, bez frameworków i bez etapu budowania.

## Co zawiera

- **Strona główna** — aktualny rekord, mapa trasy z liniami startu i mety, wykaz rekordzistów z filtrem kategorii, wyszukiwarką i wykresem, historia, regulamin w skrócie, galeria, kontakt.
- **Podstrony pod dotychczasowymi adresami** — `pl/rekordzisci.html`, `pl/historia.html`, `pl/regulamin.html`, `pl/media.html`, `pl/linki.html`, `pl/kontakt.html`.
- **Strony informacyjne** — `rodo.html`, `cookies.html`, `404.html`.
- **Wersje językowe** — `en/index.html` (angielska) i `de/index.html` (niemiecka): tłumaczenie samej strony głównej. Podstrony, RODO i pliki cookie są tylko po polsku.

## Struktura

```
index.html            strona główna
pl/                   podstrony pod starymi adresami
en/, de/              strona główna po angielsku i niemiecku
rodo.html, cookies.html, 404.html
assets/style.css      wspólny arkusz stylów
assets/js/            skrypty: main.js (strona główna, dane rekordów), nav.js (menu), lightbox.js (galeria)
assets/img/           logo i zdjęcia; assets/img/thumb/ — miniatury galerii
assets/fonts/         czcionka Inter (woff2)
assets/vendor/        Leaflet 1.9.4
.htaccess             przekierowania i nagłówki (Apache)
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
- `.htaccess` działa tylko na serwerze **Apache**. Wymusza `https://www.`, przekierowuje stare adresy Joomla (wersje do druku, `/pl.html`, dawne ścieżki zdjęć i logo) na nowe odpowiedniki oraz ustawia kompresję i pamięć podręczną. Na innym serwerze reguły trzeba przenieść do jego konfiguracji.
- Po publikacji warto zgłosić `sitemap.xml` w Google Search Console i przez kilka tygodni sprawdzać raport błędów 404.

### Gałęzie

| Gałąź | Przeznaczenie |
| --- | --- |
| `main` | wersja produkcyjna |
| `gh-pages` | podgląd na GitHub Pages pod adresem `https://guschins.github.io/rekord-trasy/` |

Gałąź `gh-pages` różni się od `main`: ścieżki mają przedrostek `/rekord-trasy/`, strony są oznaczone `noindex`, a `.htaccess` i `sitemap.xml` są usunięte. Nie aktualizuje się sama — po zmianach w `main` trzeba ją odświeżyć osobno.

## Aktualizacja rekordów

Dane rekordów są zapisane w trzech miejscach i przy nowym rekordzie trzeba poprawić wszystkie:

1. tablica `RECORDS` w `assets/js/main.js` — z niej powstają wykres, filtry i tabela;
2. statyczne wiersze tabeli (`<tbody id="rows">`) i karty aktualnych rekordów (`id="current"`) w `index.html` — wersja widoczna dla wyszukiwarek, zanim uruchomi się skrypt;
3. tabele w `pl/rekordzisci.html`.

Jeśli zmienia się rekord absolutny, należy też zaktualizować blok na górze strony głównej, sekcję „Rekord w liczbach” oraz opisy w znacznikach `<meta name="description">`.

## Wersje językowe

Strony `en/index.html` i `de/index.html` to przetłumaczone kopie `index.html` — nie powstają automatycznie. Po zmianie treści strony głównej trzeba poprawić także obie kopie. Teksty generowane przez skrypt (kategorie, etykiety, podpowiedzi) są w słowniku `I18N` w `assets/js/main.js` i dobierają się według atrybutu `<html lang>`.

## Prywatność

Strona nie zapisuje plików cookie, nie korzysta z pamięci przeglądarki i nie zawiera narzędzi analitycznych. Czcionka, zdjęcia i skrypty są serwowane lokalnie. Jedyny zasób zewnętrzny to podkład mapy pobierany z serwerów OpenStreetMap.

## Do uzupełnienia przed publikacją

- **Pełne teksty.** Historia, wywiad z Romanem Paszke i regulamin są podane w skróconym omówieniu. W `pl/historia.html` i `pl/regulamin.html` miejsca na oryginalne teksty oznaczono komentarzami `<!-- PEŁNY TEKST ... -->`.
- **Administrator danych.** W `rodo.html` jako administratora wskazano Komitet Rekordu Trasy; dane (podmiot, adres, okresy przechowywania) wymagają potwierdzenia.
- **Tłumaczenia.** Wersje angielska i niemiecka obejmują tylko stronę główną i nie były sprawdzane przez native speakera. Stare adresy `/en...` są kierowane (301) na `/en/`.
- **Przebieg trasy na mapie** jest poglądowy; dokładne są tylko współrzędne linii startu i mety.

## Prawa autorskie i licencje

- Treści i zdjęcia: © Marian Kula 2010, źródło: rekord-trasy.info. Wywiad: Krzysztof Olejnik, magazyn „Wiatr”.
- [Leaflet](https://leafletjs.com/) — licencja BSD 2-Clause.
- Czcionka [Inter](https://rsms.me/inter/) — SIL Open Font License 1.1.
- Podkład mapy: © autorzy [OpenStreetMap](https://www.openstreetmap.org/copyright).

## Kontakt

Komitet Rekordu Trasy — rekordtrasy@gmail.com

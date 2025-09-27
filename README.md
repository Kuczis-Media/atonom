# Atonom - instrukcja tworzenia nazw

Ten przewodnik porzadkuje zasady budowania nazw zwiazkow, ktore rozpoznaje parser `iupac` wykorzystywany przez aplikacje Atonom. Wszystkie przyklady korzystaja z finskiej transkrypcji rdzeni (`met`, `heks`, `metyyli` itd.).

## Co potrafi parser
- rozpoznaje lancuchy glowne od 1 do 50 atomow wegla,
- obsluguje pierscienie (`cyclo`) oraz prefiksy `spiro` i `bicyclo`,
- pozwala stosowac podstawienia `metyyli`, `etyyli`, `propyyli`, `butyyli` wraz z mnoznikami (`di`, `tri`, `iso`, `bis`, `tris`, `tetrakis`),
- rozroznia wiazania pojedyncze (`aani`/`an`), podwojne (`eeni`) i potrojne (`yyni`) oraz dopuszcza wiele wiazan tego samego typu,
- dodaje przyrostek alkoholowy `oli` (z liczbami lokujacymi lub bez nich).

## Szybki start
1. Wybierz dlugosc lancucha glownego (np. `heks`).
2. Opcjonalnie dodaj infix (`cyclo`, `spiro`, `bicyclo`).
3. Ustal typ wiazan (`aani`, `eeni`, `yyni`) i podaj lokanty, jesli wiazania sa wielokrotne.
4. Dodaj przyrostek `oli`, jezeli koncowy wezel ma zawierac grupe -OH.
5. Wstaw prefiksy boczne w formie `[lokanty]-[mnoznik opcjonalny][nazwa]`, laczac je myslnikami.

Powstala nazwa wpisz w aplikacji lub wybierz z listy przykladow w interfejsie.

## Kolejnosc segmentow

```
[prefiksy] [infix] [rdzen] [przyrostek podstawowy] [przyrostek wtorny]
```

Kazdy element poza rdzeniem i przyrostkiem podstawowym jest opcjonalny, ale jezeli wystepuje, musi zachowac powyzsza kolejnosc.

## Rdzen lancucha glownego

| liczba atomow C | token | liczba atomow C | token |
|-----------------|-------|-----------------|-------|
| 1               | `met` | 11              | `undek` |
| 2               | `et`  | 12              | `dodek` |
| 3               | `prop`| 13              | `tridek` |
| 4               | `but` | 14              | `tetradek` |
| 5               | `pent`| 15              | `pentadek` |
| 6               | `heks`| 20              | `eikos` |
| 7               | `hept`| 30              | `triakont` |
| 8               | `okt` | 40              | `tetrakont` |
| 9               | `non` | 50              | `pentakont` |
| 10              | `dek` |                 |         |

## Infix (ksztalt lancucha)
- `cyclo` - zamyka lancuch tworzac pierscien,
- `spiro` - przygotowuje strukture spiro (w implementacji traktowane tak, jak `cyclo` z dodatkowymi wezami),
- `bicyclo` - analogicznie do `spiro` (parser przyjmuje token, dalsze laczenia sa uproszczone).

## Przyrostki podstawowe (typ wiazan C-C)
- `aani` lub `an` - tylko wiazania pojedyncze,
- `eeni` - co najmniej jedno wiazanie podwojne; rodzaj i lokanty zapisujemy jako `-2,4-eeni`,
- `yyni` - co najmniej jedno wiazanie potrojne; zapis jak wyzej, np. `-3,5-yyni`.

### Kilka wiazan podwojnych
Podaj wszystkie lokanty w formacie `-x,y,z-eeni`. Przyklady:
- `heks-1,3,5-eeni`
- `non-2,4,6-eeni`
- `cycloheks-1,3,5-eeni` (model pierscienia z trzema wiazaniami podwojnymi)

### Kilka wiazan potrojnych
Analogicznie stosujemy zapis `-x,y,z-yyni`. Przyklady:
- `hept-1,4-yyni`
- `dek-2,5,8-yyni`
- `cyclohept-1,3-yyni`

### Czy mozna laczyc wiazania podwojne i potrojne?
Aktualna gramatyka dopuszcza tylko jeden przyrostek podstawowy na koncu nazwy, wiec nie da sie polaczyc `eeni` i `yyni` w jednej nazwie. Aby opisac lancuch z wiazaniami podwojnymi i potrojnymi jednoczesnie, nalezaloby rozszerzyc parser.

## Przyrostek wtorny (alkohole)
- `oli` - mozna uzyc bez lokantu (`oktaanioli`) lub z lokantem (`hexan-2-oli`).
- Wariant z liczbami ma postac `-x-oli`, np. `butan-2-oli`.

## Prefiksy (podstawienia boczne)

Format pojedynczego prefiksu:

```
[lokanty]-[mnoznik opcjonalny][nazwa podstawnika]
```

- **lokanty** - liczby rozdzielone przecinkami (`3`, `3,5`),
- **mnozniki proste** - `di`, `tri`, `iso`,
- **mnozniki nawiasowe** - `bis`, `tris`, `tetrakis` (umieszczane przed nawiasem z lista kolejnych prefiksow),
- **nazwy podstawnika** - `metyyli`, `etyyli`, `propyyli`, `butyyli`.

### Jak odczytywac i laczyc mnozniki
- `di` (pol. *bis-*, "dwa razy") powielone podstawienie tego samego fragmentu na wskazanych lokantach: `3,5-dimetyyliheptaani` - heptan z dwiema grupami metylowymi w pozycjach 3 i 5 (pol. 3,5-dimetylheptan).
- `tri` (pol. *tris-*, "trzy razy") - trzy takie same podstawienia: `2,3,3-trimetyyliheksaani` - heksan z trzema metylami (w tym dwa na pozycji 3), czyli 2,3,3-trimetylheksan.
- `iso` (pol. *izo-*) - informuje, ze podstawnik ma budowe izopropylowa; np. `4-isopropyylinonan` - nonan z podstawnikiem izopropylowym w pozycji 4 (pol. 4-izopropylnonan).

### Kiedy stosowac mnozniki nawiasowe
- `bis`, `tris`, `tetrakis` (pol. "bis-", "tris-", "tetrakis-") wprowadzamy, gdy ta sama grupa w nawiasie pojawia sie wielokrotnie lub gdy prefiks sam zawiera myslniki/przecinki.
  - `6-bis(1,2-dimetyyli)undekaani` - undekan z dwiema identycznymi grupami `1,2-dimetyyli` (pol. 6-bis(1,2-dimetyl)undekan).
  - `4-tris(2-metyyli)okt-1-eeni` - okt-1-en z trzema grupami `2-metyyli` (pol. 4-tris(2-metyl)okt-1-en).

### Dostepne podstawniki i ich polskie odpowiedniki
- `metyyli` - metyl (pol. *metylowy*, -CH3),
- `etyyli` - etyl (pol. *etylowy*, -CH2CH3),
- `propyyli` - propyl (pol. *propylowy*, -CH2CH2CH3),
- `butyyli` - butyl (pol. *butylowy*, -CH2CH2CH2CH3).

Przyklad laczacy wszystko: `3,5-dimetyyli-4-butyylinon-2-eeni` - non-2-en z dwoma metylami (3,5) i butylem (4); polski odpowiednik: 3,5-dimetyl-4-butylon-2-en.

Przyklady skladania:
- `2-metyyliheksaani`
- `3,5-dimetyyliheptaani`
- `4-etyyli-6-propyyliokt-2-eeni`
- `5-(1,2-dimetyylipropyyli)eikosaani`
- `6-bis(1,2-dimetyyli)undekaani`

Prefiksy laczymy myslnikami i ustawiamy przed rdzeniem: `3,5-dimetyyli-4-etyyli-eikosaani`.

## Rozszerzona lista przykladow
- Alkan: `pentadekaani` - pentadekan
- Alkohol: `pentan-2-oli` - pentan-2-ol
- Cykliczny alkan: `cyclopentaani` - cyklopentan
- Pierscien z wiazaniami podwojnymi (model benzenu): `cycloheks-1,3,5-eeni` - cykloheksen-1,3,5 (odpowiednik szkieletu benzenowego)
- Alkohol z wiazaniami podwojnymi: `heks-2-eeni-1-oli` - heksen-2-en-1-ol
- Alkohol z wiazaniami potrojnymi: `heks-3-yyni-1-oli` - heksen-3-yn-1-ol
- Lancuch z wieloma podwojnymi: `okt-1,3,5-eeni` - okta-1,3,5-trien
- Lancuch z wieloma potrojnymi: `non-1,3,6-yyni` - nona-1,3,6-triyn
- Prefiksy mieszane: `2,3,3-trimetyyliheksaani` - 2,3,3-trimetylheksan
- Prefiks w nawiasie: `4-etyyli-1,6-dibutyyli-5-(1,2-dimetyylipropyyli)eikosaani`
- Infix spiro/bicyclo: `spiroheptaani`, `bicyclookt-2-eeni`

## Ograniczenia
- Brak obslugi innych funkcjonalnych grup (halogeny, ketony, kwasy itp.), chociaz czesc tokenow jest przygotowana w `scanner.js`.
- Wymagana jest dokladna pisownia tokenow (litery, myslniki, przecinki).
- Parser nie rozroznia aromatow; struktury pokrewne (np. benzen) trzeba budowac jako pierscienie z wiazaniami podwojnymi (`cycloheks-1,3,5-eeni`).
- Obsluga `spiro` i `bicyclo` jest uproszczona do samego tokenu, bez pelnego modelowania mostkow.

## Dalsze kroki
- Skorzystaj z gotowej listy `ExampleNames` w `scripts/main.js`, aby zobaczyc dodatkowe poprawne nazwy.
- Rozszerz gramatyke `iupac.jison`, jezeli potrzebujesz kolejnych funkcjonalnosci (np. mozliwosci laczenia `eeni` i `yyni`).

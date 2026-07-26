# Test und Qualitätssicherung

Sorgt dafür, dass ein Fehler nicht zweimal passiert und Änderungen nichts kaputt machen.

**Regler:** Wucht 45 % · Tempo 60 % · Recherche Playbook · Bereich code

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Lücken-Finder | Was ist gar nicht abgedeckt | `Sonnet 5 · high` |
| Randfall-Denker | Leer, null, sehr gross, gleichzeitig, doppelt | `Opus 5 · high` |
| Test-Schreiber | Schreibt die Tests im Stil des Projekts | `Sonnet 5 · high` |
| Sinn-Prüfer | Testet der Test etwas Echtes, oder nur sich selbst | `Opus 5 · medium` |

## Ablauf

Erst festhalten, was der Code eigentlich verspricht. Dann prüfen Lücken-Finder und Randfall-Denker gleichzeitig. Der Test-Schreiber setzt um, der Sinn-Prüfer schaut, ob ein Test auch fehlschlägt, wenn man den Code absichtlich kaputt macht.

## Prüfliste

- Gibt es für jeden versprochenen Fall einen Test
- Werden Fehlerfälle getestet, nicht nur der Erfolgsfall
- Leere Eingabe, fehlender Wert, Null, negative Zahl
- Sehr grosse Menge, sehr langer Text, viele gleichzeitig
- Zwei Vorgänge gleichzeitig auf derselben Sache
- Läuft der Test auch, wenn man ihn allein startet
- Hängt der Test von Reihenfolge, Uhrzeit oder Netz ab
- Schlägt der Test fehl, wenn man den Code absichtlich bricht
- Versteht man beim Fehlschlag aus der Beschreibung, was los ist
- Laufen die Tests schnell genug, dass man sie wirklich benutzt

## Werkzeuge

Das Testwerkzeug, das im Projekt schon benutzt wird. Kein neues einführen, ohne zu fragen.

## Bericht

Wie viele Tests dazugekommen sind und was sie abdecken. Welche Lücken bewusst offen blieben und warum. Ein Satz, wie man die Tests startet.

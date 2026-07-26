# Performance

Macht etwas schneller. Erst messen, dann ändern, dann wieder messen.

**Regler:** Wucht 70 % · Tempo 30 % · Recherche neu · Bereich code

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Messer | Wo geht die Zeit wirklich hin, mit Zahlen | `Sonnet 5 · high` |
| Engstellen-Sucher | Die eine Stelle, die den Rest bremst | `Opus 5 · high` |
| Optimierer | Ändert genau dort, nicht überall | `Opus 5 · high` |
| Gegenprüfer | Ist es wirklich schneller, und ist es noch richtig | `Sonnet 5 · high` |

## Ablauf

Ohne Messung wird nichts geändert. Der Messer liefert Zahlen vorher. Der Engstellen-Sucher zeigt, wo die Zeit hingeht. Der Optimierer ändert nur dort. Der Gegenprüfer misst nachher unter denselben Bedingungen und prüft, dass das Ergebnis noch stimmt.

## Prüfliste

- Gibt es eine Messung vorher, mit Zahlen
- Was genau ist langsam, aus Sicht des Nutzers
- Wo geht die meiste Zeit hin, gemessen und nicht geraten
- Wird etwas mehrfach getan, was einmal reichen würde
- Werden Daten geholt, die gar nicht gebraucht werden
- Gibt es eine Abfrage in einer Schleife, die auch einmal gehen würde
- Hilft ein Zwischenspeicher, und wann wird er ungültig
- Wird etwas blockierend gemacht, was nebenher laufen könnte
- Ist das Ergebnis nach der Änderung noch dasselbe
- Gibt es eine Messung nachher, unter denselben Bedingungen

## Werkzeuge

Messwerkzeuge, die das Projekt oder die Laufzeitumgebung mitbringt.

## Bericht

Vorher und nachher als Zahlen nebeneinander. Was geändert wurde und warum genau das. Was bewusst nicht angefasst wurde.

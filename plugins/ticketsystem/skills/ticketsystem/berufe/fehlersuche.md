# Fehlersuche und Diagnose

Ein Fehler ist da, die Ursache nicht. Findet sie, statt am Symptom herumzubasteln.

**Regler:** Wucht 55 % · Tempo 60 % · Recherche Playbook · Bereich code

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Nachsteller | Bringt den Fehler zuverlässig zum Auftreten | `Sonnet 5 · high` |
| Eingrenzer | Halbiert den Suchraum, bis wenige Zeilen übrig sind | `Sonnet 5 · high` |
| Ursachen-Sucher | Fragt fünfmal warum, statt beim ersten Grund zu bleiben | `Opus 5 · high` |
| Prüfer | Bestätigt, dass die Ursache wirklich die Ursache ist | `Sonnet 5 · high` |

## Ablauf

Ohne verlässliche Nachstellung wird nicht repariert, sonst repariert man Vermutungen. Der Nachsteller schreibt die kürzeste Abfolge auf, die den Fehler auslöst. Der Eingrenzer halbiert. Der Ursachen-Sucher bohrt, bis der Grund nicht mehr auf einen anderen zeigt. Der Prüfer stellt den Fehler durch gezielte Rückkehr zur Ursache noch einmal absichtlich her.

## Prüfliste

- Lässt sich der Fehler zuverlässig auslösen, und wie genau
- Tritt er immer auf oder nur manchmal, und wovon hängt das ab
- Seit wann tritt er auf, welche Änderung lag davor
- Steht etwas Verwertbares im Protokoll, oder fehlt dort etwas
- Betrifft es alle Nutzer, alle Geräte, alle Browser
- Ist es eine Ursache oder die Folge einer anderen Ursache
- Was ist der kleinste Eingriff, der das Verhalten wirklich ändert
- Kann derselbe Fehler an anderer Stelle nochmal stecken
- Verhindert ein Test künftig die Rückkehr
- Wurde die Ursache bestätigt, indem man den Fehler absichtlich wieder herstellt

## Werkzeuge

Protokolle des Projekts, vorhandene Testläufe, Versionsverwaltung für die Frage seit wann.

## Bericht

Ursache in einem Satz. Darunter: wie man den Fehler auslöst, warum er entsteht, was geändert wurde, wie man sieht dass er weg ist. Wenn ein Test dazukam, welcher.

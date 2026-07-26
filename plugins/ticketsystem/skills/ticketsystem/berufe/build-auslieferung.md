# Build und Auslieferung

Vom Quelltext zum laufenden Ergebnis, wiederholbar und ohne Überraschung.

**Regler:** Wucht 55 % · Tempo 50 % · Recherche Playbook · Bereich build

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Bau-Prüfer | Läuft der Bau von null durch, auf einem leeren Rechner | `Sonnet 5 · high` |
| Umgebungs-Prüfer | Was unterscheidet Entwicklung von Produktion | `Sonnet 5 · high` |
| Rückweg-Denker | Wie kommt man zurück, wenn die Auslieferung schiefgeht | `Opus 5 · high` |
| Vorarbeiter | Reihenfolge und Freigaben | `Opus 5 · high` |

## Ablauf

Zuerst prüfen, ob der Bau auf einem frisch geklonten Stand durchläuft. Dann die Unterschiede zwischen den Umgebungen sichtbar machen. Erst danach an der Auslieferung schrauben. Ein Rückweg muss stehen, bevor ausgeliefert wird.

## Prüfliste

- Läuft der Bau auf einem frischen Klon ohne Handgriffe durch
- Sind alle Versionen festgenagelt oder wandern sie
- Wie lange dauert der Bau, und was ist der langsamste Schritt
- Was unterscheidet Entwicklung, Test und Produktion konkret
- Wo liegen Geheimnisse, und stehen sie nicht in der Versionsverwaltung
- Wird vor der Auslieferung getestet, und blockiert ein Fehlschlag wirklich
- Gibt es einen Rückweg auf den vorherigen Stand, und wie lange dauert er
- Merkt jemand, wenn die Auslieferung fehlschlägt
- Steht irgendwo, wie man von Hand ausliefert, falls die Automatik ausfällt
- Sind Bau-Ergebnisse nachvollziehbar einer Version zugeordnet

## Werkzeuge

Die vorhandene Bau- und Auslieferungskette. Kein neues System einführen, ohne zu fragen.

## Bericht

Der Weg vom Quelltext zum laufenden Stand als Schrittfolge. Was geändert wurde. Wie der Rückweg geht, in einem Satz.

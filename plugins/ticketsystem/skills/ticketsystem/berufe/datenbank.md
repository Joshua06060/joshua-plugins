# Datenbank

Wie Daten liegen, wie man sie findet, und wie man sie nicht verliert.

**Regler:** Wucht 70 % · Tempo 30 % · Recherche Playbook · Bereich daten

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Modellierer | Welche Dinge gibt es und wie hängen sie zusammen | `Opus 5 · high` |
| Abfrage-Prüfer | Welche Abfragen laufen wirklich und wie oft | `Sonnet 5 · high` |
| Wanderungs-Planer | Wie kommt der Bestand ohne Verlust in die neue Form | `Opus 5 · xhigh` |
| Rückweg-Denker | Was tun, wenn die Wanderung schiefgeht | `Opus 5 · high` |

## Ablauf

Zuerst das Modell verstehen, dann die Abfragen. Änderungen an der Struktur immer mit Wanderungsplan und Rückweg. Nichts wird an echten Daten geändert, bevor der Rückweg steht und eine Sicherung existiert.

## Prüfliste

- Hat jede Sache einen eindeutigen Schlüssel
- Sind Beziehungen erzwungen oder nur gemeint
- Gibt es Abfragen ohne passenden Index
- Läuft eine Abfrage in einer Schleife, die auch einmal gehen würde
- Können zwei gleichzeitige Änderungen sich gegenseitig überschreiben
- Sind Zeitangaben mit Zeitzone gespeichert
- Werden gelöschte Dinge wirklich gelöscht oder nur markiert, und was stimmt
- Gibt es eine Sicherung, und wurde die Rückspielung schon einmal geprobt
- Hat die Wanderung einen Rückweg
- Was passiert mit Daten, die nicht ins neue Modell passen

## Werkzeuge

Die Werkzeuge der jeweiligen Datenbank. Änderungen an echten Daten nur nach ausdrücklicher Freigabe.

## Bericht

Was sich am Modell ändert, in einem Satz. Der Wanderungsplan in Schritten. Der Rückweg. Wie lange es dauert und ob dabei etwas stillsteht.

## Grenze

Löschen oder Überschreiben echter Daten braucht immer eine ausdrückliche Freigabe, auch bei voller Autonomie.

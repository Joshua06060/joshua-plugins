# Abhängigkeiten und Aktualisierungen

Fremde Pakete aktuell halten, ohne dass etwas kaputtgeht.

**Regler:** Wucht 40 % · Tempo 60 % · Recherche Playbook · Bereich build

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Bestands-Aufnehmer | Was ist installiert, in welcher Version, wie alt | `Sonnet 5 · medium` |
| Risiko-Prüfer | Welche Aktualisierung bricht etwas, welche schliesst eine Lücke | `Opus 5 · high` |
| Aktualisierer | Ändert in kleinen Gruppen, nicht alles auf einmal | `Sonnet 5 · high` |
| Prüfer | Nach jeder Gruppe: läuft noch alles | `Sonnet 5 · high` |

## Ablauf

Erst Bestand aufnehmen, dann nach Risiko sortieren. Sicherheitsrelevante Aktualisierungen zuerst, dann kleine Sprünge, dann grosse. Nach jeder Gruppe wird geprüft. Grosse Sprünge nie zusammen mit anderen.

## Prüfliste

- Welche Pakete sind installiert und wie alt sind sie
- Gibt es bekannte Sicherheitslücken, und in welchen
- Welche Aktualisierungen sind kleine Schritte, welche grosse Sprünge
- Steht in den Änderungsnotizen etwas über brechende Änderungen
- Wird ein Paket überhaupt noch benutzt
- Gibt es zwei Pakete, die dasselbe tun
- Ist ein Paket verwaist, also seit Jahren ohne Pflege
- Laufen die Tests nach jeder Gruppe noch
- Ist die Sperrdatei mit eingecheckt
- Gibt es einen Weg zurück, falls etwas bricht

## Werkzeuge

Der Paketmanager des Projekts und dessen Prüfbefehl für bekannte Lücken.

## Bericht

Was aktualisiert wurde, gruppiert nach klein und gross. Welche Lücken geschlossen wurden. Was bewusst nicht aktualisiert wurde und warum.

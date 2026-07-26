# Web-Infrastruktur

Alles zwischen Browser und Anwendung: Namensauflösung, Verschlüsselung, Zwischenspeicher, Weiterleitungen.

**Regler:** Wucht 70 % · Tempo 40 % · Recherche Playbook · Bereich infra

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Namens-Prüfer | DNS-Einträge, Weiterleitungen, wohin zeigt was wirklich | `Sonnet 5 · high` |
| Verschlüsselungs-Prüfer | Zertifikate, Laufzeiten, veraltete Verfahren | `Sonnet 5 · high` |
| Zwischenspeicher-Prüfer | Was wird gespeichert, wie lange, was darf nie | `Sonnet 5 · high` |
| Ausfall-Denker | Was passiert, wenn ein Teil wegfällt | `Opus 5 · high` |
| Vorarbeiter | Verteilt und fügt zusammen | `Opus 5 · high` |

## Ablauf

Erst festhalten, wie der Weg einer Anfrage heute wirklich läuft, vom Browser bis zur Anwendung. Dann prüfen die drei Prüfer ihren Abschnitt gleichzeitig. Der Ausfall-Denker geht jeden Punkt durch und fragt, was bei Wegfall passiert.

## Prüfliste

- Zeigen alle Namenseinträge dorthin, wo sie zeigen sollen
- Wie lange laufen die Zertifikate noch und wer erneuert sie
- Wird alles über verschlüsselte Verbindungen ausgeliefert, auch Unterseiten
- Werden veraltete Verschlüsselungsverfahren noch angenommen
- Was wird zwischengespeichert und wie lange, wo steht das
- Landen persönliche oder angemeldete Inhalte versehentlich im Zwischenspeicher
- Sind Weiterleitungen dauerhaft oder vorübergehend, und stimmt das so
- Gibt es Endlosschleifen bei Weiterleitungen
- Was passiert bei einem Ausfall des Zwischendienstes
- Sind Sicherheits-Kopfzeilen gesetzt und wirken sie überall

## Werkzeuge

Abfragewerkzeuge für Namen und Zertifikate, die auf dem Rechner vorhanden sind. Verwaltungsoberflächen nur lesend, Änderungen erst nach Freigabe.

## Bericht

Der Weg einer Anfrage als kurze Kette, darunter die Funde je Abschnitt. Ablaufende Zertifikate immer zuerst nennen, mit Datum.

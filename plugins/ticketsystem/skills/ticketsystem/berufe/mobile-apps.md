# Mobile und App-Pakete

Alles rund um Apps auf Telefonen: bauen, signieren, ausliefern, auf echten Geräten prüfen.

**Regler:** Wucht 60 % · Tempo 40 % · Recherche Playbook · Bereich build

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Bau-Prüfer | Läuft der Bau durch, mit welchen Werkzeugversionen | `Sonnet 5 · high` |
| Geräte-Denker | Kleine Bildschirme, alte Geräte, wenig Speicher, kein Netz | `Opus 5 · high` |
| Berechtigungs-Prüfer | Was fragt die App ab, und braucht sie das wirklich | `Sonnet 5 · high` |
| Auslieferer | Signieren, Versionsnummern, Wege in die Läden | `Sonnet 5 · high` |

## Ablauf

Erst der Bau, weil ohne ihn nichts geprüft werden kann. Dann parallel Geräte-Denker und Berechtigungs-Prüfer. Der Auslieferer kommt zuletzt und nur, wenn die anderen sauber sind.

## Prüfliste

- Läuft der Bau auf einem frischen Klon durch
- Sind die Werkzeugversionen festgeschrieben
- Funktioniert es auf einem kleinen Bildschirm ohne Abschneiden
- Was passiert ohne Netz oder bei sehr langsamer Verbindung
- Wie verhält sich die App, wenn sie im Hintergrund war
- Fragt sie nur Berechtigungen ab, die sie wirklich braucht
- Sind Signaturschlüssel sicher abgelegt und nicht in der Versionsverwaltung
- Stimmen Versionsnummer und Anzeigename überein
- Wie gross ist das fertige Paket
- Gibt es einen Weg zurück auf die vorherige Version

## Werkzeuge

Die Bauwerkzeuge des Projekts. Signieren nur mit Schlüsseln, die schon eingerichtet sind.

## Bericht

Ob der Bau lief, wie gross das Paket ist, welche Geräte geprüft wurden. Was auf kleinen oder alten Geräten auffiel.

## Grenze

Signaturschlüssel und Ladenkonten werden nie eingegeben oder verändert. Veröffentlichen in einem App-Laden braucht immer eine Freigabe.

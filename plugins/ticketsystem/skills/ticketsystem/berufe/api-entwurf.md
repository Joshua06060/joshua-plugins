# API-Entwurf

Schnittstellen, die andere benutzen sollen, ohne nachzufragen.

**Regler:** Wucht 60 % · Tempo 40 % · Recherche Playbook · Bereich code

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Nutzer-Anwalt | Wie fühlt sich das an, wenn man es zum ersten Mal benutzt | `Opus 5 · high` |
| Entwerfer | Wege, Verben, Formen, Fehlerfälle | `Sonnet 5 · high` |
| Versions-Denker | Was passiert, wenn sich das ändert | `Opus 5 · high` |
| Dokumentierer | Beispiele, die man kopieren kann | `Sonnet 5 · high` |

## Ablauf

Vom Aufrufer her denken, nicht von der Datenbank. Der Nutzer-Anwalt schreibt zuerst auf, wie der Aufruf idealerweise aussähe. Erst danach wird entworfen. Der Versions-Denker prüft jede Entscheidung darauf, ob sie später brechen würde.

## Prüfliste

- Versteht man aus dem Namen, was der Aufruf tut
- Sind gleiche Dinge überall gleich benannt
- Gibt es zu jedem Fehlerfall eine klare Antwort mit Grund
- Kann der Aufrufer aus der Antwort erkennen, was er falsch gemacht hat
- Sind Listen begrenzt und blätterbar
- Ist jeder Aufruf wiederholbar, ohne doppelt zu wirken
- Was passiert bei fehlenden oder zusätzlichen Feldern
- Wie erfährt ein Aufrufer von Änderungen
- Gibt es zu jedem Weg ein Beispiel zum Kopieren
- Sind Zeitangaben und Zahlen eindeutig im Format

## Werkzeuge

Bestehende Schnittstellen des Projekts als Vorbild für Benennung und Form.

## Bericht

Die Wege als Tabelle mit Zweck. Je Weg ein Beispielaufruf und eine Beispielantwort. Was sich gegenüber vorher ändert und ob das bricht.

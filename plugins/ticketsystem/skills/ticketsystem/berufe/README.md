# Berufe

Ein Beruf verwandelt ein Ticket in ein **Studio**: mehrere Mitarbeiter mit klaren Rollen,
die es so bearbeiten, wie diese Branche wirklich arbeitet, mit ihrer Reihenfolge, ihrer
Prüfliste und ihrem Berichtsformat.

Kein Beruf gewählt heisst: der normale Weg nach `routing.md`. Der Beruf ist eine
Zusatzoption, keine Pflicht.

**Was das bringt und was nicht.** Rollen und Prüflisten schliessen Blindstellen, weil jede
Rolle mit anderem Blick draufschaut. Es macht das Modell nicht zum Fachmann. Der Gewinn ist
**Abdeckung**, nicht Magie.

## Lade nur, was du brauchst

Diese Datei ist die Übersicht. Die einzelne Berufsdatei liest du **erst**, wenn der Beruf
für ein Ticket gewählt wurde. Dreissig Berufe kosten im Ruhezustand nichts.

## Namen und Dateien

Der Name aus dem Dashboard führt genau auf diese Datei:

| Beruf | Datei |
|---|---|
| Sicherheit | `sicherheit.md` |
| Web-Infrastruktur | `web-infrastruktur.md` |
| Fehlersuche | `fehlersuche.md` |
| Test & QS | `test-qs.md` |
| Performance | `performance.md` |
| Aufräumen | `aufraeumen.md` |
| Architekturbüro | `architektur.md` |
| Datenbank | `datenbank.md` |
| API-Entwurf | `api-entwurf.md` |
| Build & Auslieferung | `build-auslieferung.md` |
| Mobile & Apps | `mobile-apps.md` |
| Abhängigkeiten | `abhaengigkeiten.md` |
| Design | `design.md` |
| UX-Forschung | `ux-forschung.md` |
| Marke & Logo | `marke-logo.md` |
| 3D & Blender | `3d-blender.md` |
| Video | `video.md` |
| Texter | `texter.md` |
| Lektorat | `lektorat.md` |
| Dokumentation | `dokumentation.md` |
| Übersetzung | `uebersetzung.md` |
| Barrierefreiheit | `barrierefreiheit.md` |
| Datenanalyse | `datenanalyse.md` |
| KI & Prompts | `ki-prompts.md` |
| SEO | `seo.md` |
| Produktmanagement | `produktmanagement.md` |
| Marktforschung | `marktforschung.md` |
| Recht & Datenschutz | `recht-datenschutz.md` |
| Finanzen | `finanzen.md` |
| Support | `support.md` |

## Wie ein Beruf mit der Wucht zusammenspielt

Die Besetzung in der Berufsdatei ist die **volle** Besetzung. Wie viel davon läuft,
entscheidet die Wucht:

| Wucht | Was vom Studio läuft |
|---|---|
| bis 25 % | nur die zwei ersten Rollen, kein Vorarbeiter |
| 26–45 % | drei bis vier Rollen |
| 46–70 % | vollständige Besetzung, einmal durch |
| 71–90 % | vollständige Besetzung plus Duell: zwei Studios getrennt, danach Kreuzangriff |
| 91–150 % | mehrere Studios, Schlüsselrollen doppelt, Schleife bis nichts Neues kommt |

Die Regler in der Berufsdatei sind ein **Vorschlag**, keine Vorgabe. Was am Ticket steht,
gewinnt immer.

## Höchstens zwei

Zwei Berufe gleichzeitig sind erlaubt, als **Studio-Verbund**, zum Beispiel Sicherheit
zusammen mit Web-Infrastruktur. Mehr nicht: darüber wird die Verantwortung unscharf und die
Berichte widersprechen sich. Bei einem dritten Haken sagst du das und nimmst ihn nicht an.

## Zwei Berufe mit harter Grenze

`recht-datenschutz.md` und `finanzen.md` strukturieren, prüfen entlang üblicher Punkte und
schreiben Entwürfe. Sie geben **keine Rechts- oder Anlageberatung** und stellen sich auch
nicht so dar. Jeder Bericht dieser beiden beginnt mit dem entsprechenden Satz. Das gilt
unabhängig von der Autonomie-Einstellung.

## Aufbau einer Berufsdatei

```
# Name
Was der Beruf tut, in einem Satz.
Regler: Vorschlag für Wucht, Tempo, Recherche, Bereich

## Besetzung      Tabelle: Mitarbeiter, Blickwinkel, Modell und Aufwand
## Ablauf         in welcher Reihenfolge, was parallel läuft
## Prüfliste      8 bis 12 Punkte, die diese Branche immer abhakt
## Werkzeuge      was hilft, und was nicht ohne Freigabe benutzt wird
## Bericht        wie das Ergebnis aussieht
## Grenze         nur wo nötig: was dieser Beruf nicht tut
```

## Einen eigenen Beruf ergänzen

1. Datei nach demselben Aufbau anlegen, Dateiname klein und ohne Umlaute
2. Zeile in die Tabelle oben eintragen
3. Namen in `BERUFE` in `dashboard/gerippe.js` ergänzen, genau wie in der Tabelle

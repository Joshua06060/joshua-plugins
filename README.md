# joshua-plugins

Ein Plugin-Marktplatz für [Claude Code](https://claude.com/claude-code), auf Deutsch.

## Installieren

```
/plugin marketplace add Joshua06060/joshua-plugins
/plugin install ticketsystem@joshua-plugins
/reload-plugins
```

Danach im Chat `/ticketsystem` eingeben.

---

## ticketsystem

Arbeit als Tickets führen, statt sie im Chat zu verhandeln. Du schreibst hin, was ansteht,
Claude arbeitet es ab, du nimmst das Ergebnis ab. Ein Dashboard im Browser zeigt den Stand.

### Wie es funktioniert

**Claude ist der Motor. Die Dateien sind die Wahrheit. Das Dashboard ist die Anzeige.**

```
Du schreibst in 1-EINGANG.md  oder sagst es Claude im Chat
        ↓
Claude bemerkt es und arbeitet
        ↓
Claude schreibt .tickets/T-0042.md          ← die Wahrheit
        ↓
Claude schreibt dashboard/daten.js neu      ← nur die Daten
        ↓
Die offene Seite lädt daten.js alle 5 Sekunden nach und zeichnet neu
```

Es läuft **kein Hintergrundprogramm**, kein Server, kein Port, kein Netz. Nur Dateien.
Node.js wird nicht gebraucht.

### Was das Dashboard kann und was nicht

**Es zeigt** deine echten Tickets: was läuft, mit welchem Fortschritt, welche Fragen offen
sind, was zur Abnahme bereitliegt, was im Archiv liegt. Immer aktuell, ohne Neuladen.

**Es kann nichts auslösen.** Eine Seite, die per Doppelklick geöffnet wird, darf aus
Sicherheitsgründen nicht auf die Festplatte schreiben. Deshalb legt jeder Knopf den
passenden Befehl in die **Zwischenablage**, den du im Chat einfügst. Klick auf
`Abschliessen` bei T-3 kopiert `!abschliessen T-3`. Ein Einfügen statt null, dafür ehrlich.

**Der Balken bewegt sich nur, wenn Claude etwas schreibt.** Claude arbeitet in Schüben. Der
Balken springt also, statt zu kriechen. Zwischen den Schüben steht er still. Nur Laufzeit
und Frist zählen selbständig weiter, weil die aus echten Zeitstempeln kommen.

**Ein Dashboard pro Projekt.** Jede Session hat ihr eigenes Ticketsystem im eigenen Ordner.

### Was entsteht

```
DEIN-PROJEKT/
  TICKETSYSTEM/
    1-EINGANG.md      hier schreibst du rein
    2-FRAGEN.md       Claude fragt zurück
    3-REVIEW.md       fertig zur Abnahme
    4-IN-ARBEIT.md
    5-ARCHIV.md
    config.md
    .tickets/T-0001.md …    die Wahrheit, ein Ticket je Datei
    .state/zaehler.txt
    dashboard/              einmal kopiert, daten.js von Claude gepflegt
```

`/ticketsystem` fragt zuerst, **wo** der Ordner hin soll, dann nach Isolation und
Autonomie. Bei mehreren Projekten unter einem Dach gehört er ins einzelne Projekt.

### Befehle

Im Chat, oder aus dem Dashboard kopiert:

| Befehl | Wirkung |
|---|---|
| `!abschliessen T-3` | abnehmen, ins Archiv |
| `!verwerfen T-3` | Änderungen zurücknehmen, ins Archiv |
| `!nachbessern T-3 <text>` | zurück in Arbeit mit neuer Anforderung |
| `!antwort T-2 <text>` | eine offene Frage beantworten |
| `!warum T-3` | Einstufung im Klartext |
| `!stufe T-3 6` · `!mehr T-3` · `!max T-3` | Aufwand ändern |
| `!duell T-3 3` | drei Lösungsansätze parallel, danach Kreuzangriff |
| `!timer T-3 20` | Frist von 20 Minuten |
| `!pause T-3` · `!stop T-3` | anhalten, abbrechen |
| `!nur T-3` | vorziehen |
| `!dazu T-3 <text>` | Text ans laufende Ticket anhängen |

---

## Die fünfzehn Designs

| | Name | Charakter |
|---|---|---|
| e1 | Apple | Schwarz, Titan-Verläufe, viel Luft |
| e2 | Raycast | Farbnebel, Glaskarten, Mono-Etiketten |
| e3 | Diktavo | Grosse fette Grotesk, Elektroblau |
| e4 | Roblox | Klotzkanten, kräftiges Rot und Blau |
| e5 | Arcane | Gold gegen Magenta, Korn und Vignette |
| e6 | Claude | Warmes Dunkel, Serifen, ruhig |
| e7 | ChatGPT | Grautöne, dünne Linien, fast keine Farbe |
| e8 | Joshua | Neongrün, feines Cyan-Raster |
| e9 | Minecraft | Pixelkanten, Stein und Erde |
| e10 | **Linear** | Blaugrau, ein Violett, streng. Fürs tägliche Arbeiten |
| e11 | Terminal | Phosphorgrün, alles Mono, Zeilenraster |
| e12 | Blueprint | Konstruktionsplan, Cyan auf Marineblau |
| e13 | Synthwave | Magenta gegen Cyan, laut und neon |
| e14 | Brutalist | Schwarzweiss, ein Rot, Plakatschrift |
| e15 | Nord | Arktisch gedämpft, das ruhigste von allen |

Alle dunkel. Umschalten unten links unter `Einstellungen` oder mit der Taste `D`.

**Es gibt bewusst nur zwei Einstellungen**, Design und Schriftgrösse. Alles andere wird am
einzelnen Ticket entschieden.

### Tastatur

| Taste | Wirkung |
|---|---|
| `D` | nächstes Design |
| `Esc` | zurück zur Übersicht |
| `Strg+V` | Bild einfügen, in jedem Textfeld |

---

## Aufbau

```
.claude-plugin/marketplace.json      der Katalog
plugins/ticketsystem/
  .claude-plugin/plugin.json         das Plugin
  skills/ticketsystem/SKILL.md       was Claude tut, wortgenau
  dashboard/
    index.html                       lädt alles
    gerippe.js                       Anzeige, liest window.TICKETDATEN
    stil/basis.css                   Aufbau und Abstände, ohne Farben
    stil/vorschau.css                Farbstreifen der Design-Kacheln
    stil/e1..e15.css                 je ein Design
```

`basis.css` legt die Struktur fest, die Designs färben nur. Jedes Design ist in
`html[data-stil="eN"] { … }` eingefasst. Umschalten heisst, ein Attribut am `<html>` zu
setzen.

### Ein eigenes Design ergänzen

1. `stil/e16-meins.css` nach dem Muster von `stil/e15-nord.css` anlegen
2. `<link>`-Zeile in `index.html` ergänzen
3. Eintrag in `DESIGNS` in `gerippe.js` hinzufügen
4. Drei Farben in `stil/vorschau.css` setzen

Wichtig: bei `.tblock` **kein eigenes `background`**, sonst überschreibt es die
Gruppen-Tönung. Statt dessen `--ton-arbeit`, `--ton-fragen`, `--ton-review` belegen.

---

## Modell und Aufwand

Am einzelnen Ticket wählbar, sonst automatisch nach Stufe:

| Stufe | Modell | Aufwand |
|---|---|---|
| 1 bis 2 | Haiku 4.5 | low |
| 3 bis 4 | Sonnet 5 | high |
| 5 | Opus 5 | high |
| 6 | Opus 5 | xhigh |
| 7 | Opus 5 | max |

Die Liste steht in `gerippe.js` an einer Stelle (`var MODELL`) und muss gepflegt werden,
wenn neue Modelle erscheinen. `Fable 5` ist wählbar, wird von der Automatik aber nicht
vergeben, weil es dafür keine belastbare Grundlage gibt.

---

## Stand

Funktioniert:

- Dashboard zeigt echte Tickets aus den Dateien, aktualisiert sich ohne Neuladen
- Fortschritt, Laufzeit und Fristen kommen aus den Dateien, nichts wird erfunden
- Ehrlicher leerer Zustand, wenn noch nichts da ist
- Alle Knöpfe erzeugen echte Befehle mit richtiger Ticketnummer
- Fünfzehn Designs, geprüft mit echten Daten
- Bilder per `Strg+V` in jedem Textfeld
- Dreissig Berufe: Sicherheit, Fehlersuche, Design, 3D, Recht, Finanzen und mehr.
  Jeder mit Besetzung, Ablauf, Prüfliste und Berichtsformat
- Sieben Stufen mit gewichteter Punkte-Rubrik und Hartregeln
- Duell ab Stufe 6: getrennte Stränge, Kreuzangriff, Synthese
- Datei-Sperren, damit parallele Tickets sich nicht in die Quere kommen
- Playbook-Cache, damit Recherche einmal pro Themengebiet bezahlt wird
- Verhalten bei Fehlern: dreizehn benannte Fälle, vom fehlenden Ordner bis zum hängenden Ticket

Noch nicht gebaut:

- Eingefügte Bilder werden angezeigt, aber nicht gespeichert
- Ein Duell braucht Git für getrennte Arbeitsbereiche. Ohne Git laufen die Stränge über
  Snapshot-Ordner, das ist geprüft, aber langsamer

---

## Lizenz

MIT. Nimm es, ändere es, mach damit was du willst.

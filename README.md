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

Arbeit als Tickets führen, statt sie im Chat zu verhandeln. Ein Ticket anlegen, eine Frage
beantworten, ein Ergebnis abnehmen — alles im Dashboard, kein Wechsel in den Chat nötig.

### Wie es funktioniert

**Claude ist der Motor. Die Dateien sind die Wahrheit. Das Dashboard liest und schreibt sie
direkt.**

```
Du legst im Dashboard ein Ticket an, oder schreibst in 1-EINGANG.md
        ↓
Das Dashboard schreibt .tickets/T-0042.md sofort selbst        ← direkt, kein Umweg
        ↓
Claude bemerkt die neue Datei (Monitor auf dem ganzen Ordner) und arbeitet
        ↓
Claude schreibt den Fortschritt in dieselbe Datei
        ↓
Das Dashboard liest den Ordner alle 2 Sekunden neu und zeigt den Stand
        ↓
Du klickst Abschliessen — das Dashboard hängt den Befehl an .state/befehle.jsonl an
        ↓
Claude sieht die Zeile, führt sie aus
```

Es läuft **kein Hintergrundprogramm**, kein Server, kein Port, kein Netz. Nur Dateien.
Node.js wird nicht gebraucht. Das Dashboard bekommt die Erlaubnis, den Ordner zu lesen und
zu schreiben, über einen einzigen Klick beim ersten Öffnen — dieselbe Art Erlaubnis, die
jede Website-Downloadfunktion auch braucht.

### Welcher Browser

Lesen und Schreiben direkt aus dem Dashboard braucht die File-System-Access-API. Die gibt
es in jedem Chromium-Browser:

**Chrome, Edge, Brave, Arc, Opera** — voll bedienbar, alles oben beschrieben.
**Firefox, Safari** — die API fehlt komplett. Das Dashboard fällt automatisch auf reine
Anzeige über `daten.js` zurück, die Claude weiterhin mitschreibt. Ein Band oben im
Dashboard sagt das ehrlich, keine toten Knöpfe, kein Vortäuschen.

Edge ist auf jedem Windows-PC vorinstalliert, das trifft also kaum jemanden.

### Was das Dashboard kann

**Ticket anlegen, direkt im Dashboard.** Text schreiben, Screenshots hineinziehen
(beliebig viele auf einmal, mit echter Vorschau), Dringlichkeit und Gründlichkeit wählen,
Beruf und Modell — „Ticket anlegen" schreibt die Datei sofort. Nichts zum Einfügen.

**Jeder Knopf löst wirklich etwas aus.** Abschliessen, Verwerfen, Nachbessern, eine Frage
beantworten: das hängt einen Befehl an eine Warteschlange an, die Claude abarbeitet. Der
Knopf zeigt „wird ausgelöst…", dann eine Bestätigung.

**Alles einstellbar, nichts versteckt.** Modell, Aufwand, Isolation, Freigabe, Timer, Stufe:
immer sichtbar, mit Schiebereglern wo es eine Skala ist. Jedes Feld hat **automatisch** als
erste Stellung — das ist der Normalmodus, der ohne ein einziges Anfassen genau den
ursprünglich geplanten Weg läuft (gewichtete Einstufung, Modell nach Stufe, Duell ab der
eingestellten Schwelle). Ein Knopf setzt alles zurück.

**Ergebnis, Dateien, Verlauf — alles lesbar im Dashboard.** Claudes Bericht erscheint als
gezeichnetes Markdown, nicht als Rohtext. Geänderte Dateien lassen sich aufklappen und
direkt lesen. Kein Editor, kein zweites Fenster nötig.

**Vorgaben für neue Tickets** stehen unter Einstellungen: Isolation, Autonomie,
Gründlichkeit, Modell, Aufwand, Duell-Schwelle. Gilt für jedes neue Ticket, solange am
Ticket selbst nichts anderes gewählt wird.

**Der Balken bewegt sich nur, wenn Claude etwas schreibt.** Claude arbeitet in Schüben. Der
Balken springt also, statt zu kriechen. Laufzeit und Frist zählen selbständig weiter, weil
die aus echten Zeitstempeln kommen.

**Ein Dashboard pro Projekt**, mit dem echten Namen der Session, die es führt.

### Was entsteht

```
DEIN-PROJEKT/
  TICKETSYSTEM/
    1-EINGANG.md      hier kannst du auch von Hand reinschreiben
    2-FRAGEN.md       Claude fragt zurück
    3-REVIEW.md       fertig zur Abnahme
    4-IN-ARBEIT.md
    5-ARCHIV.md
    config.md         Vorgaben, vom Dashboard und von Claude gelesen und geschrieben
    .tickets/T-0001.md …    die Wahrheit, ein Ticket je Datei
    .state/zaehler.txt
    .state/befehle.jsonl    Warteschlange, Dashboard hängt an, Claude arbeitet ab
    .state/session.json     der echte Sitzungsname
    .state/anhaenge/        Bilder aus dem Dashboard
    dashboard/               einmal kopiert, daten.js von Claude als Rückfalloption gepflegt
```

`/ticketsystem` fragt zuerst, **wo** der Ordner hin soll, dann nach Isolation und
Autonomie. Bei mehreren Projekten unter einem Dach gehört er ins einzelne Projekt.

### Befehle im Chat

Alles geht auch im Chat, falls kein Dashboard offen ist:

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

**Design und Schriftgrösse** sind die einzigen reinen Anzeige-Einstellungen. Alles andere —
Vorgaben für neue Tickets, Modell, Aufwand — steht ebenfalls unter Einstellungen, wirkt aber
auf die Arbeit, nicht nur die Anzeige.

### Tastatur

| Taste | Wirkung |
|---|---|
| `D` | nächstes Design |
| `Esc` | zurück zur Übersicht |
| `Strg+V` | Bild einfügen, in jedem Textfeld, beliebig oft |

---

## Aufbau

```
.claude-plugin/marketplace.json      der Katalog
plugins/ticketsystem/
  .claude-plugin/plugin.json         das Plugin
  skills/ticketsystem/SKILL.md       was Claude tut, wortgenau
  skills/ticketsystem/routing.md     Einstufen, Duell, Sperren, Playbooks
  skills/ticketsystem/berufe/        dreissig Berufsdateien, lazy geladen
  dashboard/
    index.html                       lädt alles
    ordner.js                        File-System-Access: verbinden, lesen, schreiben
    ticketdatei.js                   YAML-Kopf einer Ticket-Datei lesen und schreiben
    anzeigen.js                      Markdown zeichnen, Dateien und Bilder inline
    gerippe.js                       Anzeige und Bedienung, verbindet die drei obigen
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

Neuere Bedienelemente (Schieberegler, Verbindungsband, Markdown-Ansicht, Datei-Ansicht)
sind bewusst **nicht** je Design gestylt, sondern in `basis.css` mit den immer vorhandenen
Variablen `--line`, `--panel2`, `--tief`, `--fokus`, `--rot`, `--live` gebaut. Jedes Design
färbt sie automatisch mit, ohne fünfzehn Mal dieselbe Regel zu brauchen.

---

## Modell und Aufwand

Am einzelnen Ticket wählbar, sonst aus `config.md` (Einstellungen im Dashboard), sonst
automatisch nach Stufe:

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

- Dashboard liest `.tickets/*.md` direkt vom Ordner, aktualisiert sich alle 2 Sekunden
- Ticket anlegen, Abschliessen, Verwerfen, Nachbessern, Fragen beantworten: alles im
  Dashboard, kein Kopieren in den Chat mehr nötig, in jedem Chromium-Browser
- Fortschritt, Laufzeit und Fristen kommen aus den Dateien, nichts wird erfunden
- Ehrlicher leerer Zustand, wenn noch nichts da ist, ehrliches Band ohne verbundenen Ordner
- Bilder anhängen: Einfügen, Hineinziehen oder Dateiauswahl, beliebig viele auf einmal, mit
  echter Vorschau, werden als echte Dateien in `.state/anhaenge/` gespeichert
- Alle Einstellungen immer sichtbar, mit Schiebereglern, Automatik als Normalmodus,
  Ein-Klick-Rücksetzung
- Vorgaben für neue Tickets in `config.md`, im Dashboard editierbar
- Claudes Bericht als gezeichnetes Markdown, geänderte Dateien inline lesbar im Dashboard
- Firefox/Safari-Rückfall auf reine Anzeige über `daten.js`, ehrlich benannt
- Fünfzehn Designs, geprüft mit echten Daten
- Dreissig Berufe: Sicherheit, Fehlersuche, Design, 3D, Recht, Finanzen und mehr.
  Jeder mit Besetzung, Ablauf, Prüfliste und Berichtsformat
- Sieben Stufen mit gewichteter Punkte-Rubrik und Hartregeln
- Duell ab konfigurierbarer Stufe: getrennte Stränge, Kreuzangriff, Synthese
- Datei-Sperren, damit parallele Tickets sich nicht in die Quere kommen
- Playbook-Cache, damit Recherche einmal pro Themengebiet bezahlt wird
- Verhalten bei Fehlern: benannte Fälle, vom fehlenden Ordner bis zur kaputten Warteschlangen-Zeile

Noch nicht gebaut:

- Ein Duell braucht Git für getrennte Arbeitsbereiche. Ohne Git laufen die Stränge über
  Snapshot-Ordner, das ist geprüft, aber langsamer
- Playbooks und Beruf-Besetzung erscheinen nicht als eigene Ansicht im Dashboard, nur als
  Kurzangabe am Ticket

---

## Lizenz

MIT. Nimm es, ändere es, mach damit was du willst.

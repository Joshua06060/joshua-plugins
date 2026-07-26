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

## Enthaltene Plugins

### ticketsystem

Arbeit als Tickets führen, statt sie im Chat zu verhandeln. Hinschreiben was ansteht,
autonom abarbeiten lassen, das Ergebnis abnehmen. Dazu ein Live-Dashboard im Browser.

**Was der Skill macht**

- Legt `TICKETSYSTEM/` im Projekt an: Eingang, Fragen, Review, In Arbeit, Archiv
- Fragt einmal pro Projekt drei Dinge: Isolation, Autonomie, Browser
- Stuft jede Eingabe nach einer gewichteten Punkte-Tabelle in sieben Stufen ein
- Ab Stufe 6 Duell: drei Stränge mit festen Strategien, danach Kreuzangriff und Synthese
- Startet das Dashboard und beobachtet die Dateien, im Ruhezustand ohne Tokenkosten
- Hält harte Grenzen ein: Zugangsdaten, Geld, Veröffentlichen, Löschen und
  Systemeinstellungen brauchen immer eine Freigabe

**Das Dashboard**

Links die Sessions, in der Mitte was gerade läuft, gruppiert nach *In Arbeit*,
*Fragen an dich*, *Review* und *Archiv*, jede Gruppe leicht eigen getönt. Klick auf eine
Kachel öffnet das Ticket, dort steht je nach Zustand genau eine Sache.

Neues Ticket in drei Schritten: beschreiben, einstufen, Beruf wählen. Unter den Reglern
rechnet eine Zeile mit, was das bedeutet: `Stufe 5 · 12 Agenten · Opus 5 high · ~19 Min`.

Bilder lassen sich überall mit `Strg+V` einfügen: im Eingang, in der Antwort auf eine
Frage und in der Nachbesserung eines Reviews.

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

Alle sind dunkel. Umschalten unten links unter `Einstellungen`, oder mit der Taste `D`.

**Es gibt bewusst nur zwei Einstellungen**, Design und Schriftgrösse. Alles andere wird
am einzelnen Ticket entschieden oder einmal beim Einrichten des Skills. Eine Oberfläche,
die man einmal einstellt und nie wieder anfasst, braucht keine Schalter.

---

## Tastatur

| Taste | Wirkung |
|---|---|
| `1` bis `4` | Session wechseln |
| `D` | nächstes Design |
| `Esc` | zurück zur Übersicht |
| `Strg+V` | Bild einfügen, in jedem Textfeld |

---

## Dashboard einzeln starten

Ohne Claude Code, nur zum Anschauen:

```bash
node plugins/ticketsystem/dashboard/server.js
```

Dann `http://localhost:4322` öffnen. Oder
`plugins/ticketsystem/dashboard/index.html` direkt im Browser öffnen, geht genauso.

Gebraucht wird ein Browser auf Chromium-Basis (Chrome, Brave, Edge) oder Firefox 117 und
neuer. Keine Abhängigkeiten, kein Netzzugriff, kein Build.

---

## Aufbau

```
.claude-plugin/marketplace.json      der Katalog
plugins/ticketsystem/
  .claude-plugin/plugin.json         das Plugin
  skills/ticketsystem/SKILL.md       was Claude tut
  dashboard/
    index.html                       lädt alles
    gerippe.js                       Daten, Ansichten, Zustand
    server.js                        winziger Dateiserver
    stil/basis.css                   Aufbau und Abstände, ohne Farben
    stil/vorschau.css                Farbstreifen der Design-Kacheln
    stil/e1..e15.css                 je ein Design
```

Der Trick: **`basis.css` legt die Struktur fest, die Designs färben nur.** Jedes Design
ist in `html[data-stil="eN"] { … }` eingefasst und nutzt verschachteltes CSS. Umschalten
heisst, ein Attribut am `<html>` zu setzen. Kein Neuladen, kein Flackern.

### Ein eigenes Design ergänzen

1. `stil/e16-meins.css` nach dem Muster von `stil/e15-nord.css` anlegen
2. `<link>`-Zeile in `index.html` ergänzen
3. Eintrag in `DESIGNS` in `gerippe.js` hinzufügen
4. Drei Farben in `stil/vorschau.css` für die Vorschaukachel setzen

Ein Design ist vollständig, wenn es diese Klassen bedient:

```
sidebar proj topbar crumbs pill card compose-zu plus schritt-kopf schritt-nr
wahl-knopf beruf haken chip pop pop-item tblock bar strand tag tid zeit pct
q-answer rev-preview rev-art rev-label btn live-punkt live-flaeche anhang
side-knopf design-kachel einst-hilfe track over arow rechnung hinweis gruppe
mehr leer back badge psub side-foot schreib-hilfe
```

Wichtig: bei `.tblock` **kein eigenes `background`** setzen, sonst überschreibt es die
Gruppen-Tönung. Statt dessen `--ton-arbeit`, `--ton-fragen` und `--ton-review` belegen.

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

Die Liste steht in `gerippe.js` an einer Stelle (`var MODELL`). Sie aktualisiert sich
nicht von selbst, sie muss gepflegt werden. `Fable 5` ist wählbar, wird von der Automatik
aber nicht vergeben, weil es keine belastbare Grundlage dafür gibt, wofür es die beste
Wahl wäre.

---

## Was ehrlich noch fehlt

- Das Dashboard zeigt Beispieldaten und ist noch nicht an die echten Ticket-Dateien
  angebunden. Der Ablauf läuft über die Dateien in `TICKETSYSTEM/`.
- Eingefügte Bilder werden angezeigt, aber nicht gespeichert.
- Abschliessen, Verwerfen, Pause und Stop schliessen die Ansicht, lösen aber noch keine
  Aktion aus.
- Restzeiten sind Schätzungen und mit `~` gekennzeichnet. Nur beim Timer-Ticket ist es
  eine echte Frist.

---

## Lizenz

MIT. Nimm es, ändere es, mach damit was du willst.

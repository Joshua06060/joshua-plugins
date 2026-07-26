# Ticketsystem-Dashboard

Eine Oberfläche, um KI-Arbeit als Tickets zu führen: hinschreiben was ansteht, zusehen wie
daran gearbeitet wird, das Ergebnis abnehmen. Zehn umschaltbare Designs, elf Einstellungen,
keine Abhängigkeiten, kein Netzzugriff.

Dies ist der **Oberflächen-Entwurf**. Die Daten sind Beispieldaten, damit man den Ablauf
wirklich durchklicken kann. Die Anbindung an ein echtes Ticketsystem ist noch nicht drin.

---

## Starten

Zwei Wege, beide ohne Installation:

```bash
node server.js
```
Dann `http://localhost:4322` öffnen.

Oder `index.html` einfach im Browser öffnen. Funktioniert genauso, weil nichts nachgeladen
wird, was einen Server bräuchte.

Gebraucht wird nur ein aktueller Browser auf Chromium-Basis (Chrome, Brave, Edge) oder
Firefox 117 und neuer. Für den Server zusätzlich Node.js.

---

## Wie es sich bedient

**Links** stehen immer die Sessions, also die Projekte, in denen gerade gearbeitet wird.
Ein Klick wechselt, die Tasten `1` bis `4` auch.

**In der Mitte** steht, was gerade läuft, gruppiert und farblich leicht getrennt:

| Gruppe | Was drinsteht |
|---|---|
| In Arbeit | läuft gerade, mit Balken, Prozent und Restzeit |
| Fragen an dich | das System kommt nicht weiter und braucht eine Antwort |
| Review, fertig zur Abnahme | fertige Arbeit, wartet auf dein Ja |
| Archiv | erledigt, eingeklappt |

**Ein Klick auf eine Kachel** öffnet das Ticket. Je nach Zustand steht dort genau eine
Sache: die Frage mit Antwortfeld, das fertige Ergebnis mit Abnahme-Knöpfen, oder der
Fortschritt mit einem Knopf `Anpassen`. Regler erscheinen erst, wenn man sie anfordert.

**Neues Ticket** läuft in drei Schritten: erst beschreiben, dann einstufen
(wie dringend, wie gründlich), dann optional einen Beruf anhaken. Unter den Reglern steht
in Klartext mit, was das bedeutet: `Stufe 5 · 12 Agenten · ~19 Min`.

**Bilder** lassen sich überall mit `Strg+V` einfügen, im Eingabefeld, in der Antwort auf
eine Frage und in der Nachbesserung eines Reviews.

### Tastatur

| Taste | Wirkung |
|---|---|
| `1` bis `4` | Session wechseln |
| `D` | nächstes Design |
| `Esc` | zurück zur Übersicht |

---

## Die zehn Designs

| Kürzel | Name | Charakter |
|---|---|---|
| `e1` | Apple | Schwarz, Titan-Verläufe, viel Luft |
| `e2` | Raycast | Farbnebel, Glaskarten, Mono-Etiketten |
| `e3` | Diktavo | Grosse fette Grotesk, Elektroblau |
| `e4` | Roblox | Klotzkanten, kräftiges Rot und Blau |
| `e5` | Arcane | Gold gegen Magenta, Korn und Vignette |
| `e6` | Claude | Warmes Dunkel, Serifen, ruhig |
| `e7` | ChatGPT | Grautöne, dünne Linien, fast keine Farbe |
| `e8` | Joshua | Neongrün, feines Cyan-Raster |
| `e9` | Minecraft | Pixelkanten, Stein und Erde |
| `e10` | **Linear** | Blaugrau, ein Violett, streng. Empfehlung fürs tägliche Arbeiten |

Alle sind dunkel. Umschalten über `Einstellungen` unten links oder die Taste `D`.

---

## Einstellungen

Unten links. Alles wird im Browser gemerkt und ist beim nächsten Öffnen wieder da.

| Einstellung | Auswahl |
|---|---|
| Design | zehn Stile |
| Schriftgrösse | 100, 120, 140 Prozent |
| Autonomie | fragen, selbst entscheiden |
| Höchste Wucht | Stufe 4 bis 7, oder 150 Prozent |
| Standard-Modell | automatisch, Haiku 4.5, Sonnet 5, Opus 5, Fable 5 |
| Standard-Aufwand | automatisch, low, medium, high, xhigh, max |
| Gleichzeitig | 1, 2, 3 oder 5 Tickets |
| Isolation | automatisch, Branch, Snapshot |
| Hinweise | an, aus |
| Chat-Meldungen | nur Wichtiges, alles, still |
| Bewegung | normal, reduziert |
| Kacheln je Reihe | automatisch, 2, 3, 4 |
| Archiv behalten | 7, 30, 90 Tage |

`Höchste Wucht` wirkt sofort: stellt man ein Ticket auf `maximal`, während der Deckel bei
Stufe 4 steht, rechnet die Klartextzeile herunter und schreibt `durch Einstellung
gedeckelt` dazu.

`Bewegung: reduziert` schaltet Pulsieren und weiche Übergänge ab. Die Systemeinstellung
`prefers-reduced-motion` wirkt zusätzlich, auch ohne hier etwas umzustellen.

---

## Modell und Aufwand

An drei Stellen einstellbar, mit klarer Rangfolge:

```
Wahl am einzelnen Ticket   schlägt
Standard aus Einstellungen schlägt
Automatik nach Stufe
```

**Automatik** wählt passend zur Stufe:

| Stufe | Modell | Aufwand |
|---|---|---|
| 1 bis 2 | Haiku 4.5 | low |
| 3 bis 4 | Sonnet 5 | high |
| 5 | Opus 5 | high |
| 6 | Opus 5 | xhigh |
| 7 | Opus 5 | max |

**Am einzelnen Ticket** überschreibbar: beim Anlegen unter `Feineinstellung`, an einem
laufenden Ticket unter `Anpassen`.

**Sichtbar ohne Klick:** die Klartextzeile beim Anlegen zeigt es mit an
(`Stufe 5 · 12 Agenten · Opus 5 high · ~19 Min`), ein laufendes Ticket zeigt es im
Live-Bereich, und die Kopfzeile zeigt den eingestellten Standard.

Die Modell-Liste steht in `gerippe.js` an genau einer Stelle:

```js
var MODELL  = ['automatisch', 'Haiku 4.5', 'Sonnet 5', 'Opus 5', 'Fable 5'];
var AUFWAND = ['automatisch', 'low', 'medium', 'high', 'xhigh', 'max'];
```

Kommt ein neues Modell dazu, wird nur diese Zeile geändert, dann steht es überall zur
Auswahl. Die Liste aktualisiert sich **nicht** von selbst, sie muss gepflegt werden.
Welche Modelle die Automatik wählt, steht direkt darunter in `modellFuer()`.

`Fable 5` ist auswählbar, wird von der Automatik aber nicht vergeben. Grund: es gibt
keine belastbare Grundlage dafür, wofür es die beste Wahl wäre. Wer es einsetzen will,
wählt es bewusst.

---

## Aufbau

```
index.html            lädt alles
gerippe.js            Daten, Ansichten, Einstellungen, Zustand
server.js             winziger Dateiserver, keine Abhängigkeiten
stil/basis.css        Aufbau und Abstände, ohne Farben
stil/vorschau.css     Farbstreifen der Design-Kacheln
stil/e1..e10.css      je ein Design
```

Der Trick: **`basis.css` legt die Struktur fest, die Designs färben nur.** Jedes Design
ist in `html[data-stil="eN"] { … }` eingefasst und nutzt verschachteltes CSS, damit nicht
jede Zeile ein Präfix braucht. Umschalten heisst, ein Attribut am `<html>` zu setzen.
Kein Neuladen, kein Flackern.

### Ein eigenes Design ergänzen

1. `stil/e11-meins.css` anlegen, nach dem Muster von `stil/e10-linear.css`.
2. In `index.html` eine `<link>`-Zeile ergänzen.
3. In `gerippe.js` einen Eintrag in `DESIGNS` hinzufügen.
4. In `stil/vorschau.css` drei Farben für die Vorschaukachel setzen.

Damit ein Design vollständig ist, muss es diese Klassen bedienen:

```
sidebar proj topbar crumbs pill card compose-zu plus schritt-kopf schritt-nr
wahl-knopf beruf haken chip pop pop-item tblock bar strand tag tid zeit pct
q-answer rev-preview rev-art rev-label btn live-punkt live-flaeche anhang
side-knopf design-kachel einst-hilfe track over arow rechnung hinweis gruppe
mehr leer back badge psub side-foot schreib-hilfe
```

Wichtig: bei `.tblock` **kein eigenes `background`** setzen, sonst überschreibt es die
Gruppen-Tönung. Statt dessen die drei Variablen `--ton-arbeit`, `--ton-fragen`,
`--ton-review` belegen.

---

## Was ehrlich noch fehlt

- Keine Anbindung an echte Daten, alles sind Beispieldaten im `gerippe.js`.
- Eingefügte Bilder werden als Anhang angezeigt, aber nicht gespeichert oder hochgeladen.
- Die Knöpfe `Abschliessen`, `Verwerfen`, `Pause`, `Stop` schliessen die Ansicht, lösen
  aber noch keine Aktion aus.
- Restzeiten sind Schätzungen und mit `~` gekennzeichnet. Nur beim Timer-Ticket ist es
  eine echte Frist.

---

## Lizenz

MIT. Nimm es, ändere es, mach damit was du willst.

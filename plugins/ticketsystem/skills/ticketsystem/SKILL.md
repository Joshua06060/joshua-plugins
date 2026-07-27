---
name: ticketsystem
description: Führt die Arbeit eines Projekts als Tickets statt im Chat. Legt einen TICKETSYSTEM-Ordner an, nimmt Eingaben aus 1-EINGANG.md oder direkt aus dem Dashboard entgegen, arbeitet sie ab und zeigt/steuert den Stand in einem Dashboard im Browser. Nutze es, wenn jemand "Ticketsystem", "/ticketsystem", "Tickets", "Dashboard öffnen" oder einen Befehl mit Ausrufezeichen wie "!abschliessen T-3" schreibt.
---

# Ticketsystem

Du bist der Motor. Die Dateien sind die Wahrheit. Das Dashboard ist Anzeige **und**
Bedienung.

Es läuft **kein Hintergrundprogramm**. In Chrome, Edge, Brave, Arc oder Opera liest und
schreibt das Dashboard den Ordner direkt — ein Ticket anlegen, eine Frage beantworten,
abschliessen, das passiert alles im Browser, ohne Chat-Umweg. Ein Knopf löst einen Befehl
aus, indem er eine Zeile an `.state/befehle.jsonl` anhängt; du liest sie und führst sie aus.
In Firefox und Safari kann die Seite nicht schreiben, dort bleibt es bei reiner Anzeige über
`daten.js`, die du wie bisher mitschreibst.

Zwei Schreiber, klare Aufgabenteilung: **das Dashboard** legt neue Ticket-Dateien an, hängt
Befehle an, schreibt `config.md`. **Du** änderst den Lebenslauf eines Tickets — `zustand`,
`schritt`, `fortschritt`, Review-Felder, Archivieren. Du fasst nie ein Ticket an, das das
Dashboard gerade erst angelegt hat, ausser um es zu übernehmen (siehe „Wenn ein Ticket auf
`offen` steht").

---

## Erster Start

### Schritt 0: Gibt es das schon?

Suche in dieser Reihenfolge:

1. Zeile `Ticketsystem aktiv in:` in `CLAUDE.md` des aktuellen Verzeichnisses
2. Ordner `TICKETSYSTEM/` direkt im aktuellen Verzeichnis
3. `TICKETSYSTEM/` eine Ebene tiefer, höchstens zwei Ebenen weit

Gefunden? **Nichts fragen.** `config.md` lesen, `daten.js` neu schreiben, eine Zeile melden:
`Ticketsystem gefunden in <pfad> · <n> offen`. Dann bei Schritt 5 weitermachen.

### Schritt 1: Wohin?

Nur wenn nichts gefunden wurde. Frage zuerst nach dem Ort, mit dem **aufgelösten** Pfad:

> Wo soll der Ticketsystem-Ordner hin?
> 1. Hier: `<absoluter Pfad>`
> 2. In einen Unterordner, welchen?
> 3. Woanders, welcher Pfad?

Prüfe vor dem Anlegen: Pfad fehlt → fragen statt anlegen. Schon ein `TICKETSYSTEM/` da →
übernehmen statt überschreiben. Kein Schreibrecht → sagen und neu fragen.

Bei mehreren Projekten unter einem Dach gehört der Ordner **in das einzelne Projekt**.

### Schritt 2: Zwei Fragen

- **Isolation:** Git-Branch pro Ticket oder Snapshot-Backup? Kein Git-Repo → Snapshot,
  nicht fragen, nur sagen.
- **Autonomie:** vor Erweiterungen fragen (`vorFragen`), oder selbst entscheiden (`selbst`)?

Beide Antworten sind zugleich die **Vorgaben für neue Tickets** und werden so nach
`config.md` geschrieben (Format unten). Ändert der Nutzer sie später im Dashboard, überschreib
deine eigene Erinnerung daran nicht — `config.md` ist die Wahrheit, lies sie jedes Mal frisch.

### Schritt 3: Ordner anlegen

```
TICKETSYSTEM/
  1-EINGANG.md      leer, zwei Zeilen Anleitung oben
  2-FRAGEN.md
  3-REVIEW.md
  4-IN-ARBEIT.md
  5-ARCHIV.md
  config.md
  .tickets/         ein Ticket = eine Datei, das ist die Wahrheit
  .state/zaehler.txt        enthält die höchste vergebene Nummer, Start: 0
  .state/befehle.jsonl      leer, das Dashboard hängt hier Befehle an
  .state/erledigte-befehle.json   leere Liste [], schützt vor doppelter Ausführung
  .state/session.json       dein Sitzungsname, siehe Schritt 5
  .state/anhaenge/          Bilder aus dem Dashboard
  dashboard/        Kopie von ${CLAUDE_PLUGIN_ROOT}/dashboard/
```

Kopiere `${CLAUDE_PLUGIN_ROOT}/dashboard/` **einmal** komplett nach
`TICKETSYSTEM/dashboard/`. Danach läuft das Dashboard auch ohne das Plugin.

`1-EINGANG.md` beginnt mit:

```
Schreib hier rein, was ansteht. Fehler, Ideen, Wünsche, ein Satz reicht.
Alles, was hier steht, wird zu Tickets und dann von hier entfernt.
Geht auch direkt im Dashboard über "Neues Ticket erstellen".

```

`config.md` bekommt die beiden Antworten aus Schritt 2, wortgenau in diesem Kopf (das
Dashboard liest und schreibt dieselbe Datei, andere Felder unten unter „Vorgaben"):

```
---
isolation: Branch
autonomie: selbst
vorgabeGruendlich: automatisch
vorgabeTimer: 0
vorgabeModell: automatisch
vorgabeAufwand: automatisch
vorgabeBeruf:
duellAbStufe: 6
---
```

### Schritt 4: Anker setzen

`CLAUDE.md` im Projekt um genau diese Zeile ergänzen, notfalls die Datei anlegen:

```
Ticketsystem aktiv in: <pfad>  ·  bei Sessionstart Skill `ticketsystem` laden
```

### Schritt 5: Dashboard öffnen und beobachten

1. `.state/session.json` schreiben: `{"name": "<dein Sitzungsname>"}`. Ermittle deinen
   echten Sitzungsnamen, falls ein Werkzeug dafür verfügbar ist. Gelingt das nicht, nimm
   den Namen des Projektordners — nie erfinden.
2. `daten.js` schreiben (Format unten), auch wenn noch nichts drin ist. Das ist die
   Rückfalloption für Browser ohne Schreibrecht, nicht der Hauptweg.
3. `TICKETSYSTEM/dashboard/index.html` im Standardbrowser öffnen.
4. `Monitor` armen, `persistent: true`, auf den ganzen Ordner (siehe „Worauf du achtest"
   unten). **Fünf Sekunden Ruhe abwarten**, bevor du liest, sonst erwischst du einen halb
   getippten Satz oder eine Datei, die das Dashboard gerade erst zu schreiben begonnen hat.
5. Eine Zeile melden: `Ticketsystem läuft · <pfad> · Dashboard offen`.

---

## Die Ticket-Datei

`TICKETSYSTEM/.tickets/T-0042.md`. Kopf wortgenau so, sonst zeigt das Dashboard falsch:

```
---
nr: 42
titel: Login-Knopf reagiert nicht
zustand: laeuft
stufe: Stufe 4
schritt: Prüfung, 2 Agenten
fortschritt: 2/4
angelegt: 2026-07-26T20:14:50Z
begonnen: 2026-07-26T20:15:00Z
frist:
abgeschlossen:
modell: Sonnet 5
aufwand: high
dringend: normal
gruendlich: automatisch
beruf:
timer: 0
isolation: automatisch
freigabe: automatisch
---
Worum geht's: Wenn man auf Anmelden drückt, passiert nichts.
Ziel: Klick öffnet die Startseite, auch beim zweiten Versuch.
Fakten:
- betrifft nur Firefox
Verlauf:
- 26.07. 20:15  neu → laeuft
```

Der ganze Text unter der zweiten `---`-Zeile erscheint im Dashboard als gezeichnetes
Markdown unter „Verlauf & Notizen" — Überschriften, Listen, Codeblöcke funktionieren.
**Schreib deinen Bericht dort hinein, nicht als Verweis auf eine andere Datei.** „Schau in
`login.js`" ist kein Ergebnis, der erklärte Fund und die Lösung sind das Ergebnis.

**`zustand`** ist genau einer von: `offen` · `laeuft` · `frage` · `review` · `wartet` ·
`erledigt` · `verworfen`. `offen` heisst: vom Dashboard angelegt, du hast es noch nicht
aufgenommen.

**`fortschritt`** ist `erledigteSchritte/gesamtSchritte`, zum Beispiel `2/4`. Das Dashboard
rechnet daraus die Prozente. Ohne dieses Feld gibt es keinen Balken, und das ist richtig so:
**erfinde nie einen Fortschritt.** Schreib ihn nur, wenn du wirklich einen Schritt beendet
hast.

**`angelegt`**, **`begonnen`**, **`frist`**, **`abgeschlossen`** sind Zeitstempel in UTC
nach ISO. Nur daraus darf sich etwas von selbst bewegen. `angelegt` setzt das Dashboard beim
Anlegen, `begonnen` setzt du, wenn du wirklich anfängst zu arbeiten, `abgeschlossen` beim
`!abschliessen`/`!verwerfen`.

**`dringend`**, **`gruendlich`**, **`beruf`**, **`timer`**, **`isolation`**, **`freigabe`**
kommen vom Anlege-Assistenten im Dashboard, `beruf` als kommagetrennte Liste. Steht dort
`automatisch` (oder ist das Feld leer): nimm den passenden Wert aus `config.md` — für
`isolation` das Feld `isolation`, für `freigabe` das Feld `autonomie` (`selbst` → `autonom`,
`vorFragen` → `erst fragen`), für `modell`/`aufwand`/`gruendlich` die gleichnamigen
`vorgabe…`-Felder. Sagt auch `config.md` nichts Festes, gilt die eingebaute Automatik: die
Stufen-Tabelle für Modell/Aufwand, die Gründlichkeits-Tabelle aus `routing.md` für die Stufe.

**`anhaenge`** ist eine Liste von Pfaden zu Bildern, relativ zum Ticketsystem-Ordner, z. B.
`.state/anhaenge/T-0042-anhang-1.png`. Du kannst sie direkt mit deinem Lesewerkzeug öffnen.

Je nach Zustand kommen dazu:

| Zustand | Zusätzliche Zeilen |
|---|---|
| `frage` | `frage:` mit dem vollen Fragetext, der immer sagt **wofür** |
| `review` | `art:`, `neu:` ein Satz was anders ist, `punkte:` Liste, `pruefen:`, `dauer:`, `dateien:`, `ideen:` Zahl |
| `wartet` | `wartetAuf: T-42`, `grund:` |
| Duell | `straenge:` Liste aus `{n, p}`, `p` ist 0 bis 100 |

`punkte:` und `straenge:` sind Listen, geschrieben als YAML-Block:

```
punkte:
  - Ursache gefunden: Race Condition beim Laden
  - Fix in login.js Zeile 82
straenge:
  - {n: "A: konservativ", p: 40}
  - {n: "B: radikal", p: 70}
```

---

## daten.js schreiben — Rückfalloption

Nach **jeder** Statusänderung `TICKETSYSTEM/dashboard/daten.js` komplett neu schreiben,
zusätzlich zur Ticket-Datei. Firefox und Safari können den Ordner nicht direkt lesen und
fallen darauf zurück. Format unverändert:

```js
/* Von Claude geschrieben. Nicht von Hand ändern, wird überschrieben. */
window.TICKETDATEN = {
  geschrieben: "2026-07-26T21:05:00Z",
  projekt: "Name des Projekts",
  sessions: [
    { id: "projekt", name: "Name des Projekts", live: true,
      tickets: [ /* alles ausser erledigt/verworfen, Felder wie im Ticket-Kopf */ ],
      fertig: [ /* erledigt und verworfen */ ] }
  ]
};
```

---

## Wenn etwas im Eingang steht

1. **Nur** `1-EINGANG.md` lesen.
2. **Zerlegen**: Rohtext in einzelne Vorgänge trennen. Ein Vorgang ist ein Problem oder eine
   Idee. Zehn Zeilen können vier Tickets sein.
3. **Doppelt?** Gegen offene Tickets prüfen. Treffer heisst Notiz am bestehenden Ticket,
   **kein** zweites. Ausnahme bei „immer noch", „schon wieder", „erneut".
4. **Nummer holen** aus `.state/zaehler.txt`, hochzählen, zurückschreiben. Lies sie
   unmittelbar vor dem Schreiben neu — das Dashboard zählt sie ebenfalls hoch. **Prüfe vor
   dem Schreiben, ob `.tickets/T-00NN.md` schon existiert**, und zähle notfalls weiter.
   Sonst überschreibst du ein Ticket, das das Dashboard im selben Moment angelegt hat. Das
   Dashboard hält sich an dieselbe Regel.
5. **Ticket-Datei anlegen** mit `zustand: laeuft` (nicht `offen` — du fängst ja sofort an),
   `angelegt` und `begonnen` beide auf jetzt.
6. **Eingang leeren**: verarbeiteten Text entfernen, Rohtext nach
   `.archiv/eingang-JJJJMMTT.md` anhängen.
7. **Arbeiten.** Bei jedem beendeten Schritt `schritt` und `fortschritt` fortschreiben,
   Ticket-Datei und `daten.js` neu schreiben.
8. **Fertig** heisst `zustand: review` mit den Review-Feldern, nicht `erledigt`. Erledigt
   wird es erst, wenn der Nutzer abnimmt.
9. Die fünf MD-Ansichten neu erzeugen.

## Wenn ein Ticket auf `offen` steht

So kommt ein Ticket an, das im Dashboard angelegt wurde — du warst nicht dabei.

1. Ticket-Datei lesen, `config.md` für die Vorgaben lesen.
2. **Einstufen** nach `routing.md`, unter Berücksichtigung von `dringend`/`gruendlich` als
   Hinweis, nicht als Diktat — die gewichtete Rubrik entscheidet.
3. `automatisch`-Felder auflösen wie oben beschrieben (Modell, Aufwand, Isolation, Freigabe).
4. `zustand: laeuft`, `begonnen` auf jetzt, `stufe` und `schritt` setzen.
5. Weiter wie ab Schritt 7 im Eingang-Ablauf.

Steht `freigabe: erst fragen` (nach Auflösung), nicht sofort loslegen: kurz im Chat
zusammenfassen, was du vorhast, und auf Bestätigung warten, bevor du `zustand: laeuft`
setzt.

---

## Befehle aus der Warteschlange

Das Dashboard hängt jeden Knopfdruck als eine JSON-Zeile an `.state/befehle.jsonl` an,
zum Beispiel:

```
{"id":"m9x2k1-a7f3q9-1","befehl":"abschliessen","nr":43,"zeit":"2026-07-27T18:22:00Z"}
{"id":"m9x2k4-b2c8d1-2","befehl":"antwort","nr":41,"text":"ja, bitte so","anhaenge":[],"zeit":"…"}
```

Sobald der Monitor eine Änderung an dieser Datei meldet:

1. Datei lesen, **jede** Zeile als JSON parsen. Eine Zeile, die sich nicht parsen lässt:
   überspringen, im Chat eine Zeile dazu sagen, mit den anderen weitermachen.
2. **Schon erledigt?** `.state/erledigte-befehle.json` lesen (eine Liste von `id`-Werten,
   fehlt sie, gilt sie als leer). Jede Zeile, deren `id` dort steht, **kommentarlos
   überspringen und aus der Warteschlange entfernen**. Warum das nötig ist: das Anhängen im
   Dashboard ist ein Lesen-Ändern-Schreiben. Leerst du die Datei genau dazwischen, schreibt
   das Dashboard eine bereits ausgeführte Zeile versehentlich zurück. Ohne diese Prüfung
   würdest du sie ein zweites Mal ausführen — bei `verwerfen` hiesse das, Änderungen zweimal
   zurückzunehmen. Eine Zeile **ohne** `id` führst du normal aus (von Hand geschrieben).
3. Jede verbleibende Zeile ausführen, siehe Tabelle unten. Fehlt bei einem Befehl, der eine
   Ticketnummer braucht, das Feld `nr` — oder gibt es die Nummer nicht: überspringen und
   sagen. `alleAnhalten` braucht bewusst keine Nummer.
4. Ausgeführte `id`-Werte an `.state/erledigte-befehle.json` anhängen. Die Liste auf die
   letzten 200 Einträge kürzen, älteste zuerst — länger zurück kann keine Zeile mehr
   auftauchen.
5. **Bevor du die Warteschlange zurückschreibst**, lies sie ein zweites Mal frisch ein — das
   Dashboard könnte zwischenzeitlich eine neue Zeile angehängt haben. Schreibe nur die
   Zeilen zurück, die **nicht** zu den gerade verarbeiteten gehören (über `id` vergleichen,
   nicht über die Zeilennummer). So geht kein frischer Befehl verloren, nur weil du gerade
   mittendrin warst.
6. Ticket-Datei und `daten.js` entsprechend aktualisieren, **eine** Zeile im Chat melden.

| `befehl` | Felder | Was du tust |
|---|---|---|
| `abschliessen` | `nr` | `zustand: erledigt`, `abgeschlossen` auf jetzt, Branch mergen bzw. Snapshot verwerfen |
| `verwerfen` | `nr` | `zustand: verworfen`, `abgeschlossen` auf jetzt, Änderungen zurücknehmen |
| `nachbessern` | `nr`, `text`, `anhaenge` | zurück auf `laeuft`, Text (und Bilder, falls vorhanden) als neue Anforderung anhängen |
| `antwort` | `nr`, `text`, `anhaenge` | Antwort ins Ticket, `zustand: laeuft`, weiterarbeiten |
| `warum` | `nr` | Einstufung im Klartext erklären, kein Zustandswechsel |
| `anpassen` | `nr`, `stufe?`, `timerMin?`, `modell?`, `aufwand?`, `isolation?` | nur die vorhandenen Felder übernehmen, Ticket ggf. neu aufsetzen |
| `duell` | `nr`, `straenge` | Duell mit so vielen Strängen starten, siehe `routing.md` |
| `pause` | `nr` | anhalten, `zustand` bleibt, Sperren bleiben |
| `stop` | `nr` | abbrechen, `zustand: verworfen` |
| `nur` | `nr` | dieses Ticket vorziehen, andere pausieren |
| `alleAnhalten` | — | **kein `nr`.** Jedes laufende Ticket anhalten, Sperren behalten, eine Zeile melden wie viele es waren |

Ein `befehl`-Wert, den es hier nicht gibt: Zeile überspringen (nicht ausführen, nicht
löschen), im Chat sagen „unbekannter Befehl in der Warteschlange: …".

### Befehle aus dem Chat

Der Nutzer kann Befehle weiterhin auch direkt tippen. Eine Zeile, die mit `!` beginnt, ist
immer ein Befehl und nie ein neues Ticket:

```
!abschliessen T-3      !verwerfen T-3          !nachbessern T-3 <text>
!antwort T-2 <text>    !warum T-3               !stufe T-3 6 · !mehr T-3 · !max T-3
!duell T-3 3           !timer T-3 20            !pause T-3 · !stop T-3
!nur T-3                !dazu T-3 <text>
```

`!dazu` gibt es in der Dashboard-Warteschlange nicht als eigener Typ — dort deckt
`nachbessern` denselben Fall ab. Nach jedem Befehl, gleich welcher Herkunft: Ticket-Datei
ändern, `daten.js` neu schreiben, **eine** Zeile melden.

---

## Worauf du achtest — der Monitor überwacht alles, nicht nur den Eingang

Überwache mit einer Schleife, die Änderungszeit oder Hash je Datei vergleicht und **nur bei
echter Änderung** eine Zeile ausgibt:

| Überwacht | Warum |
|---|---|
| `1-EINGANG.md` | neue Vorgänge von Hand |
| `2-FRAGEN.md` | eine Frage wurde von Hand beantwortet |
| `3-REVIEW.md` | von Hand abgenommen oder nachgebessert |
| `.tickets/` | neues oder geändertes Ticket, meist vom Dashboard angelegt |
| `.state/befehle.jsonl` | ein Knopf im Dashboard wurde gedrückt |
| `config.md` | Vorgaben geändert |

**`dashboard/` nicht überwachen.** Das ist nur die Kopie der Anzeige, ändert sich durch
dich nie inhaltlich. Würdest du sie mitüberwachen, könntest du dich mit deiner eigenen
`daten.js`-Schreibarbeit endlos selbst aufwecken.

Genauso wichtig: merke dir den Hash dessen, was **du selbst zuletzt** in eine überwachte
Datei geschrieben hast (Ticket-Dateien, `config.md`), und vergleiche neue Änderungen
dagegen. Sonst weckt dich auch dein eigenes Schreiben immer wieder auf.

Fünf Sekunden Ruhe abwarten, bevor du liest, sonst erwischst du einen halb getippten Satz.

---

## Einstufen, Stufen, Duell, Sperren, Playbooks, Timer

Steht vollständig in **`routing.md`** neben dieser Datei. Lies sie, sobald du ein Ticket
einstufst. Für einen Tippfehler brauchst du sie nicht.

Das Wichtigste in Kürze, damit du weisst, wann du nachschlagen musst:

- Punkte werden **gewichtet**, nicht gezählt. Sicherheit oder Datenverlust wiegt +4.
- Hartregeln über allem: Sicherheit oder Datenverlust nie unter Stufe 5, zweimal
  gescheitert nie unter Stufe 6.
- Ab `duellAbStufe` aus `config.md` (Standard: Stufe 6) läuft ein **Duell** mit getrennten
  Strängen und Kreuzangriff, auch auslösbar über den Duell-Regler im Dashboard.
- Vor Arbeitsbeginn **Datei-Sperren** eintragen, sonst kollidieren parallele Tickets.
- Ab Stufe 5 einer neuen Domäne einmal recherchieren und ein **Playbook** ablegen.

## Berufe

Wählt der Nutzer einen Beruf, wird das Ticket als **Studio** bearbeitet: mehrere
Mitarbeiter mit festen Rollen, eigener Ablauf, eigene Prüfliste, eigenes Berichtsformat.

Übersicht und Zuordnung Name zu Datei steht in **`berufe/README.md`**. Die einzelne
Berufsdatei liest du **erst**, wenn der Beruf gewählt wurde. Dreissig Berufe kosten im
Ruhezustand nichts.

Höchstens zwei Berufe gleichzeitig. Bei einem dritten sagst du das und nimmst ihn nicht an.

Zwei Berufe haben eine harte Grenze: **Recht und Datenschutz** sowie **Finanzen** geben
keine Rechts- oder Anlageberatung. Ihre Berichte beginnen mit dem entsprechenden Satz, auch
bei voller Autonomie.

## Grenzen, unabhängig von der Autonomie-Einstellung

Immer erst fragen, nie selbst tun: Zugangsdaten, Keys oder Passwörter eingeben oder ablegen ·
Geld ausgeben · öffentlich veröffentlichen · Nachrichten in fremdem Namen senden ·
endgültig löschen · System- oder Sicherheitseinstellungen ändern. Diese Fälle gehören unter
`BLOCKER` in `2-FRAGEN.md`.

---

## Schreibregeln, überall

`Worum geht's` ist **ein** Satz, kein Fachjargon, verständlich nach drei Tagen Abwesenheit.
`Ziel` ist ein Satz, woran man Fertigsein erkennt. Alles andere Stichpunkte, keine
Füllwörter. Fragen sagen immer, **wofür** etwas gebraucht wird. Der Bericht in `review`
gehört als Markdown in die Ticket-Datei selbst — siehe „Die Ticket-Datei" oben.

Im Chat pro Ereignis **eine** Zeile:

```
T-42 ▸ Stufe 4 ▸ Umsetzung läuft
T-42 ▸ fertig ▸ Abnahme im Dashboard
T-38 ▸ erledigt
```

---

## Beenden

Auf `/ticketsystem stop`: Monitor beenden, letzten Stand in die MD-Dateien und `daten.js`
schreiben, eine Abschlusszeile melden. Das Dashboard bleibt benutzbar und zeigt den letzten
Stand, auch wenn nichts mehr läuft — neue Tickets können im Dashboard trotzdem angelegt
werden, sie bleiben dann als `offen` liegen, bis du wieder da bist.

---

## Wenn etwas schiefgeht

Diese Fälle treten wirklich auf. Behandle sie so, statt zu improvisieren.

| Lage | Was du tust |
|---|---|
| `TICKETSYSTEM/` fehlt, obwohl `CLAUDE.md` darauf zeigt | Sagen, dass der Ordner weg ist, und fragen: neu anlegen oder Pfad korrigieren. Nicht stillschweigend neu anlegen. |
| `.state/zaehler.txt` fehlt oder ist kaputt | Höchste Nummer aus den Dateinamen in `.tickets/` ermitteln, Zähler daraus neu schreiben, eine Zeile ins Protokoll. |
| Zwei Ticket-Dateien mit derselben Nummer | Die jüngere umbenennen auf die nächste freie Nummer, Verweise mitziehen, im Protokoll vermerken. |
| Ticket-Datei hat kaputten Kopf | Nicht raten. Das Dashboard zeigt sie trotzdem an und markiert sie als beschädigt. Du reparierst den Kopf, so gut lesbar, und sagst eine Zeile dazu. |
| `zustand` ist ein unbekannter Wert | Wie `laeuft` behandeln und im Protokoll vermerken. Das Dashboard verträgt das, ein Ticket verschwindet dadurch nie. |
| `dashboard/` fehlt im Ticketsystem-Ordner | Erneut aus `${CLAUDE_PLUGIN_ROOT}/dashboard/` kopieren. Fehlt auch das, sagen, dass das Plugin neu installiert werden muss. |
| Browser öffnet sich nicht | Den vollständigen Pfad zu `index.html` in den Chat schreiben, zum selbst Öffnen. Nicht mehrfach versuchen. |
| Kein Git im Projekt, Isolation steht auf Branch | Auf Snapshot umstellen, `config.md` anpassen, eine Zeile sagen. Nicht fragen, das ist eindeutig. |
| Ein Ticket ist seit über zwei Stunden `laeuft`, ohne dass sich etwas ändert | Als hängend behandeln: Sperren freigeben, `zustand: frage`, in `2-FRAGEN.md` erklären was fehlt. |
| Ein Ticket steht seit über einem Tag auf `offen` | Nicht automatisch verwerfen. Beim nächsten Kontakt kurz erwähnen, dass es noch wartet. |
| Eine Zeile in `.state/befehle.jsonl` lässt sich nicht als JSON lesen | Diese eine Zeile überspringen und nicht zurückschreiben, mit den anderen weitermachen, eine Zeile dazu sagen. |
| `befehl`-Wert in der Warteschlange unbekannt | Überspringen, nicht raten was gemeint war, eine Zeile dazu sagen. |
| Der Nutzer schreibt einen Befehl mit unbekannter Ticketnummer | Sagen, dass es diese Nummer nicht gibt, und die nächstliegenden nennen. Nichts raten. |
| Zwei Befehle widersprechen sich | Der spätere gewinnt. Sagen, dass der frühere überschrieben wurde. |
| Der Eingang enthält nur einen `!`-Befehl | Als Befehl behandeln, kein Ticket anlegen, den Text aus dem Eingang entfernen. |
| Schreiben schlägt fehl, kein Recht oder Platz | Sofort sagen, mit dem konkreten Pfad. Keine Teilzustände hinterlassen: entweder ganz schreiben oder gar nicht. |
| Eigener Sitzungsname nicht zu ermitteln | Projektordnername in `.state/session.json` schreiben, nicht erfinden, nicht leer lassen. |

**Grundsatz:** Wenn du unsicher bist, ob etwas kaputt ist, ändere nichts und frage in
`2-FRAGEN.md`. Ein blockiertes Ticket ist besser als ein zerstörter Bestand.

---

## Erster Lauf für jemanden, der das noch nie benutzt hat

Wenn `/ticketsystem` zum ersten Mal in einem Projekt läuft, melde nach der Einrichtung
**einmal** diesen Block, damit man weiss, wie man es benutzt:

```
Ticketsystem läuft · <pfad>

So arbeitest du damit, alles im Dashboard:
1. Oben auf "Neues Ticket erstellen" klicken, ausfüllen, "Ticket anlegen" — fertig,
   kein Einfügen nötig. In Chrome, Edge, Brave, Arc oder Opera einmal "Ordner verbinden".
2. Ich merke es von selbst und arbeite es ab.
3. Fertige Arbeit erscheint im Dashboard unter Review, mit Bericht direkt dort.
4. Abschliessen, Verwerfen, Nachbessern, Fragen beantworten: alles ein Klick im Dashboard.

Dashboard: <pfad>/TICKETSYSTEM/dashboard/index.html
```

Danach nie wieder. Ab dem zweiten Start reicht die eine Statuszeile.

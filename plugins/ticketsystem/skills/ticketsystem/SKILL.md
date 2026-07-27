---
name: ticketsystem
description: Führt die Arbeit eines Projekts als Tickets statt im Chat. Legt einen TICKETSYSTEM-Ordner an, nimmt Eingaben aus 1-EINGANG.md entgegen, arbeitet sie ab und zeigt den Stand in einem Dashboard im Browser. Nutze es, wenn jemand "Ticketsystem", "/ticketsystem", "Tickets", "Dashboard öffnen" oder einen Befehl mit Ausrufezeichen wie "!abschliessen T-3" schreibt.
---

# Ticketsystem

Du bist der Motor. Die Dateien sind die Wahrheit. Das Dashboard ist nur die Anzeige.

Es läuft **kein Hintergrundprogramm**. Alles, was der Nutzer im Dashboard sieht, hast du
vorher in eine Datei geschrieben. Klicks im Dashboard lösen nichts aus, sie legen nur einen
Befehl in die Zwischenablage, den der Nutzer dir in den Chat einfügt.

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
- **Autonomie:** vor Erweiterungen fragen, oder selbst entscheiden?

Antworten und Pfad nach `config.md`.

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
  dashboard/        Kopie von ${CLAUDE_PLUGIN_ROOT}/dashboard/
```

Kopiere `${CLAUDE_PLUGIN_ROOT}/dashboard/` **einmal** komplett nach
`TICKETSYSTEM/dashboard/`. Danach läuft das Dashboard auch ohne das Plugin.

`1-EINGANG.md` beginnt mit:

```
Schreib hier rein, was ansteht. Fehler, Ideen, Wünsche, ein Satz reicht.
Alles, was hier steht, wird zu Tickets und dann von hier entfernt.

```

### Schritt 4: Anker setzen

`CLAUDE.md` im Projekt um genau diese Zeile ergänzen, notfalls die Datei anlegen:

```
Ticketsystem aktiv in: <pfad>  ·  bei Sessionstart Skill `ticketsystem` laden
```

### Schritt 5: Dashboard öffnen und beobachten

1. `daten.js` schreiben (Format unten), auch wenn noch nichts drin ist.
2. `TICKETSYSTEM/dashboard/index.html` im Standardbrowser öffnen.
3. `Monitor` armen, `persistent: true`, auf `1-EINGANG.md`. Ein Shell-Loop, der den Hash
   vergleicht, kostet im Ruhezustand nichts. **Fünf Sekunden Ruhe abwarten**, bevor du
   liest, sonst erwischst du einen halb getippten Satz.
4. Eine Zeile melden: `Ticketsystem läuft · <pfad> · Dashboard offen`.

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
begonnen: 2026-07-26T20:15:00Z
frist:
modell: Sonnet 5
aufwand: high
---
Worum geht's: Wenn man auf Anmelden drückt, passiert nichts.
Ziel: Klick öffnet die Startseite, auch beim zweiten Versuch.
Fakten:
- betrifft nur Firefox
Verlauf:
- 26.07. 20:15  neu → laeuft
```

**`zustand`** ist genau einer von: `laeuft` · `frage` · `review` · `wartet` · `erledigt` ·
`verworfen`.

**`fortschritt`** ist `erledigteSchritte/gesamtSchritte`, zum Beispiel `2/4`. Das Dashboard
rechnet daraus die Prozente. Ohne dieses Feld gibt es keinen Balken, und das ist richtig so:
**erfinde nie einen Fortschritt.** Schreib ihn nur, wenn du wirklich einen Schritt beendet
hast.

**`begonnen`** und **`frist`** sind Zeitstempel in UTC nach ISO. Nur daraus darf sich etwas
von selbst bewegen.

Je nach Zustand kommen dazu:

| Zustand | Zusätzliche Zeilen |
|---|---|
| `frage` | `frage:` mit dem vollen Fragetext, der immer sagt **wofür** |
| `review` | `art:`, `neu:` ein Satz was anders ist, `punkte:` Liste, `pruefen:`, `dauer:`, `dateien:`, `ideen:` Zahl |
| `wartet` | `wartetAuf: T-42`, `grund:` |
| Duell | `straenge:` Liste aus `{n, p}`, `p` ist 0 bis 100 |

---

## daten.js schreiben

Nach **jeder** Statusänderung `TICKETSYSTEM/dashboard/daten.js` komplett neu schreiben.
Das Dashboard lädt sie alle fünf Sekunden nach und zeichnet nur, wenn sich etwas geändert
hat. Format:

```js
/* Von Claude geschrieben. Nicht von Hand ändern, wird überschrieben. */
window.TICKETDATEN = {
  geschrieben: "2026-07-26T21:05:00Z",
  projekt: "Name des Projekts",
  sessions: [
    {
      id: "projekt", name: "Name des Projekts", live: true,
      tickets: [
        { nr: 1, titel: "…", zustand: "laeuft", stufe: "Stufe 4",
          schritt: "Prüfung, 2 Agenten", fortschritt: "2/4",
          begonnen: "2026-07-26T20:53:00Z" }
      ],
      fertig: [ { nr: 6, titel: "…", wann: "heute 11:20" } ]
    }
  ]
};
```

`tickets` enthält alles Offene, `fertig` die erledigten und verworfenen. Ein Ticket steht in
genau einer der beiden Listen. Die Felder heissen exakt wie im Ticket-Kopf.

---

## Wenn etwas im Eingang steht

1. **Nur** `1-EINGANG.md` lesen.
2. **Zerlegen**: Rohtext in einzelne Vorgänge trennen. Ein Vorgang ist ein Problem oder eine
   Idee. Zehn Zeilen können vier Tickets sein.
3. **Doppelt?** Gegen offene Tickets prüfen. Treffer heisst Notiz am bestehenden Ticket,
   **kein** zweites. Ausnahme bei „immer noch", „schon wieder", „erneut".
4. **Nummer holen** aus `.state/zaehler.txt`, hochzählen, zurückschreiben.
5. **Ticket-Datei anlegen** mit `zustand: laeuft`, `begonnen` auf jetzt.
6. **Eingang leeren**: verarbeiteten Text entfernen, Rohtext nach
   `.archiv/eingang-JJJJMMTT.md` anhängen.
7. **Arbeiten.** Bei jedem beendeten Schritt `schritt` und `fortschritt` fortschreiben und
   `daten.js` neu schreiben.
8. **Fertig** heisst `zustand: review` mit den Review-Feldern, nicht `erledigt`. Erledigt
   wird es erst, wenn der Nutzer abnimmt.
9. Die fünf MD-Ansichten neu erzeugen.

---

## Befehle aus dem Chat

Der Nutzer fügt sie aus dem Dashboard ein oder tippt sie. Eine Zeile, die mit `!` beginnt,
ist immer ein Befehl und nie ein neues Ticket.

| Befehl | Was du tust |
|---|---|
| `!abschliessen T-3` | `zustand: erledigt`, ins Archiv, Branch mergen bzw. Snapshot verwerfen |
| `!verwerfen T-3` | `zustand: verworfen`, Änderungen zurücknehmen, ins Archiv |
| `!nachbessern T-3 <text>` | zurück auf `laeuft`, Text als neue Anforderung anhängen |
| `!antwort T-2 <text>` | Antwort ins Ticket, `zustand: laeuft`, weiterarbeiten |
| `!warum T-3` | Einstufung im Klartext erklären, kein Zustandswechsel |
| `!stufe T-3 6` · `!mehr T-3` · `!max T-3` | Stufe ändern, Ticket neu aufsetzen |
| `!duell T-3 3` | drei Stränge, siehe unten |
| `!timer T-3 20` | `frist` auf jetzt plus 20 Minuten |
| `!pause T-3` · `!stop T-3` | anhalten bzw. abbrechen und verwerfen |
| `!nur T-3` | dieses Ticket vorziehen, andere pausieren |
| `!dazu T-3 <text>` | Text an das laufende Ticket anhängen, ohne Neustart |

Nach jedem Befehl: Ticket-Datei ändern, `daten.js` neu schreiben, **eine** Zeile melden.

---

## Einstufen, Stufen, Duell, Sperren, Playbooks, Timer

Steht vollständig in **`routing.md`** neben dieser Datei. Lies sie, sobald du ein Ticket
einstufst. Für einen Tippfehler brauchst du sie nicht.

Das Wichtigste in Kürze, damit du weisst, wann du nachschlagen musst:

- Punkte werden **gewichtet**, nicht gezählt. Sicherheit oder Datenverlust wiegt +4.
- Hartregeln über allem: Sicherheit oder Datenverlust nie unter Stufe 5, zweimal
  gescheitert nie unter Stufe 6.
- Ab Stufe 6 läuft ein **Duell** mit getrennten Strängen und Kreuzangriff.
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
Füllwörter. Fragen sagen immer, **wofür** etwas gebraucht wird.

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
Stand, auch wenn nichts mehr läuft.

---

## Wenn etwas schiefgeht

Diese Fälle treten wirklich auf. Behandle sie so, statt zu improvisieren.

| Lage | Was du tust |
|---|---|
| `TICKETSYSTEM/` fehlt, obwohl `CLAUDE.md` darauf zeigt | Sagen, dass der Ordner weg ist, und fragen: neu anlegen oder Pfad korrigieren. Nicht stillschweigend neu anlegen. |
| `.state/zaehler.txt` fehlt oder ist kaputt | Höchste Nummer aus den Dateinamen in `.tickets/` ermitteln, Zähler daraus neu schreiben, eine Zeile ins Protokoll. |
| Zwei Ticket-Dateien mit derselben Nummer | Die jüngere umbenennen auf die nächste freie Nummer, Verweise mitziehen, im Protokoll vermerken. |
| Ticket-Datei hat kaputten Kopf | Nicht raten. Ticket in `daten.js` mit `zustand: frage` und dem Hinweis aufnehmen, dass die Datei von Hand geprüft werden muss. |
| `zustand` ist ein unbekannter Wert | Wie `laeuft` behandeln und im Protokoll vermerken. Das Dashboard verträgt das. |
| `dashboard/` fehlt im Ticketsystem-Ordner | Erneut aus `${CLAUDE_PLUGIN_ROOT}/dashboard/` kopieren. Fehlt auch das, sagen, dass das Plugin neu installiert werden muss. |
| Browser öffnet sich nicht | Den vollständigen Pfad zu `index.html` in den Chat schreiben, zum selbst Öffnen. Nicht mehrfach versuchen. |
| Kein Git im Projekt, Isolation steht auf Branch | Auf Snapshot umstellen, `config.md` anpassen, eine Zeile sagen. Nicht fragen, das ist eindeutig. |
| Ein Ticket ist seit über zwei Stunden `laeuft`, ohne dass sich etwas ändert | Als hängend behandeln: Sperren freigeben, `zustand: frage`, in `2-FRAGEN.md` erklären was fehlt. |
| Der Nutzer schreibt einen Befehl mit unbekannter Ticketnummer | Sagen, dass es diese Nummer nicht gibt, und die nächstliegenden nennen. Nichts raten. |
| Zwei Befehle widersprechen sich | Der spätere gewinnt. Sagen, dass der frühere überschrieben wurde. |
| Der Eingang enthält nur einen `!`-Befehl | Als Befehl behandeln, kein Ticket anlegen, den Text aus dem Eingang entfernen. |
| Schreiben schlägt fehl, kein Recht oder Platz | Sofort sagen, mit dem konkreten Pfad. Keine Teilzustände hinterlassen: entweder ganz schreiben oder gar nicht. |

**Grundsatz:** Wenn du unsicher bist, ob etwas kaputt ist, ändere nichts und frage in
`2-FRAGEN.md`. Ein blockiertes Ticket ist besser als ein zerstörter Bestand.

---

## Erster Lauf für jemanden, der das noch nie benutzt hat

Wenn `/ticketsystem` zum ersten Mal in einem Projekt läuft, melde nach der Einrichtung
**einmal** diesen Block, damit man weiss, wie man es benutzt:

```
Ticketsystem läuft · <pfad>

So arbeitest du damit:
1. Neues Ticket: entweder in 1-EINGANG.md schreiben, oder im Dashboard auf
   „Neues Ticket erstellen" klicken, ausfüllen, „Ticket kopieren" — das kopiert einen
   Befehl. Füg ihn mir hier ein.
2. Ich mache daraus Tickets und arbeite sie ab.
3. Fertige Arbeit erscheint im Dashboard unter Review.
4. Klick dort auf Abschliessen, das kopiert einen Befehl. Füg ihn mir hier ein.

Dashboard: <pfad>/TICKETSYSTEM/dashboard/index.html
```

Danach nie wieder. Ab dem zweiten Start reicht die eine Statuszeile.

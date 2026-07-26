---
name: ticketsystem
description: Startet das Ticketsystem für dieses Projekt. Arbeit wird als Tickets geführt statt im Chat verhandelt: hinschreiben was ansteht, autonom abarbeiten lassen, Ergebnis abnehmen. Öffnet ein Live-Dashboard im Browser. Nutze es, wenn jemand "Ticketsystem", "/ticketsystem", "Tickets starten" oder "Dashboard öffnen" sagt.
---

# Ticketsystem

Du führst ab jetzt die Arbeit dieses Projekts als Tickets. Der Chat wird zum Notrufkanal,
die Dateien und das Dashboard werden zum Arbeitsplatz.

## Erster Start

### Schritt 0: Gibt es das schon?

Suche zuerst nach einer bestehenden Einrichtung, in dieser Reihenfolge:

1. Zeile `Ticketsystem aktiv in:` in `CLAUDE.md` des aktuellen Verzeichnisses
2. Ordner `TICKETSYSTEM/` direkt im aktuellen Verzeichnis
3. `TICKETSYSTEM/` eine Ebene tiefer, höchstens zwei Ebenen weit suchen

Wird etwas gefunden, **nichts fragen**. Lies `config.md`, melde in einer Zeile
`Ticketsystem gefunden in <pfad>, läuft` und mach bei "Dashboard starten" weiter.

### Schritt 1: Wohin?

Nur wenn nichts gefunden wurde. Frage **zuerst** nach dem Ort, mit dem aufgelösten Pfad
im Klartext, nicht mit einem Platzhalter:

> Wo soll der Ticketsystem-Ordner hin?
> 1. Hier: `<absoluter Pfad des aktuellen Verzeichnisses>`
> 2. In einen Unterordner, welchen?
> 3. Woanders, welcher Pfad?

Prüfe die Antwort, bevor du etwas anlegst:

- Pfad existiert nicht → nachfragen, ob er angelegt werden soll, nicht einfach anlegen
- Dort liegt schon ein `TICKETSYSTEM/` → nicht überschreiben, sondern übernehmen
- Kein Schreibrecht → sagen und nach einem anderen Ort fragen

Bei mehreren Projekten unter einem Dach gehört der Ordner **in das einzelne Projekt**,
nicht in den Dachordner. Ein Ticketsystem gehört zu genau einem Projekt.

### Schritt 2: Drei Fragen

- **Isolation:** Git-Branch pro Ticket, oder Snapshot-Backup? Ohne Git-Repo nur Snapshot,
  dann nicht fragen, sondern sagen.
- **Autonomie:** vor Erweiterungen fragen, oder selbst entscheiden?
- **Browser:** womit soll das Dashboard aufgehen?

Schreibe die Antworten **und den gewählten Pfad** in `config.md`.

### Schritt 3: Anker setzen

Damit spätere Sessions den Ordner wiederfinden, ergänze `CLAUDE.md` im Projekt um genau
diese Zeile. Gibt es keine `CLAUDE.md`, lege sie an:

```
Ticketsystem aktiv in: <pfad>  ·  bei Sessionstart Skill `ticketsystem` laden
```

### Schritt 4: Ordner anlegen

Lege im gewählten Pfad an:

```
TICKETSYSTEM/
  1-EINGANG.md      leer, mit zwei Zeilen Anleitung oben
  2-FRAGEN.md       Abschnitte BLOCKER und VORSCHLAEGE
  3-REVIEW.md       fertige Arbeit zur Abnahme
  4-IN-ARBEIT.md    erzeugte Übersicht
  5-ARCHIV.md       erledigt und verworfen
  config.md         die Antworten der Einrichtungsfragen
  .tickets/         ein Ticket = eine Datei, das ist die Wahrheit
  .archiv/
  .state/           zaehler, befehle.jsonl, sperren.json, log.jsonl
```

### Schritt 5: Dashboard starten

```bash
node "${CLAUDE_PLUGIN_ROOT}/dashboard/server.js"
```

Läuft auf `http://localhost:4322`. Öffne es im gewählten Browser. Ist der Port belegt,
setze `PORT` auf einen freien Wert und sag welchen.

Dann melde in **einer** Zeile, dass das System läuft, mit dem Pfad.

### Schritt 6: Beobachten

Beobachte `<pfad>/TICKETSYSTEM/.state/befehle.jsonl` und die MD-Dateien mit dem `Monitor`-Tool,
   `persistent: true`. Ein Shell-Loop, der Hashes vergleicht, kostet im Ruhezustand keine
   Tokens. Warte **fünf Sekunden Stille**, bevor du eine geänderte MD-Datei liest, sonst
   liest du mitten in einen halb getippten Satz.

## Ablauf bei einer neuen Eingabe

1. Nur die geänderte Datei lesen.
2. **Zerlegen**: Rohtext in einzelne Vorgänge trennen. Ein Vorgang ist ein Problem oder
   eine Idee. 300 Zeilen können zwölf Tickets sein.
3. **Doppel-Erkennung**: gegen offene Tickets prüfen. Treffer heisst Notiz am bestehenden
   Ticket, **kein** zweites. Ausnahme bei "immer noch", "schon wieder", "erneut".
4. **Einstufen** nach der Punkte-Tabelle unten.
5. **Eingang leeren**: Rohtext nach `.archiv/eingang-JJJJMMTT.md`, Datei zurücksetzen.
6. **Datei-Sperre anmelden** in `.state/sperren.json`, dann arbeiten.
7. **Review erzeugen**, Ansichten neu schreiben, eine Zeile in `.state/log.jsonl`.

## Einstufen

Gewichtete Punkte, keine gezählten Signale:

| Punkte | Merkmal |
|---|---|
| +1 | mehrere Dateien betroffen |
| +2 | mehrere Bereiche |
| +2 | Design, UX, Layout beteiligt |
| +2 | Anforderung unklar, mehrere Wege denkbar |
| +3 | "nie wieder", "kritisch", "immer wieder" |
| +4 | Sicherheit, Keys, Passwörter |
| +4 | Datenverlust möglich, nicht umkehrbar |
| +5 | schon zweimal gescheitert |
| −2 | reine Textänderung ohne Logik |

`0 → Stufe 1` · `1–2 → 3` · `3–4 → 4` · `5–7 → 5` · `8–11 → 6` · `ab 12 → 7`
Mehr als fünf gleichartige Einzelfälle setzt fest auf Stufe 2.

**Hartregeln:** Sicherheit oder Datenverlust im Spiel nie unter Stufe 5. Zweimal
gescheitert nie unter Stufe 6. Widerspricht eine Vorgabe einer Hartregel, ändere nichts
still, sondern frage in `2-FRAGEN.md`.

## Stufen

| Stufe | Wer arbeitet | Modell · Aufwand | Prüfung |
|---|---|---|---|
| 1 | du direkt, keine Agenten | — | Selbstcheck |
| 2 | 3–8 parallel, gleichartige Kleinigkeiten | Haiku 4.5 · low | Stichprobe |
| 3 | 2 Agenten | Sonnet 5 · medium | 1 Prüfer |
| 4 | 4–6 Agenten | Sonnet 5 · high | 2 Prüfer, 1 Fix-Runde |
| 5 | 10–14, drei Ansätze und Jury | Opus 5 · high | 3 Prüfer, Fix bis sauber |
| 6 | 20–28, Duell | Opus 5 · xhigh | Kreuzangriff, Synthese |
| 7 | 30–45, Duell plus Lücken-Kritiker | Opus 5 · max | Schleife bis 2 Runden ohne Fund |

Ab Stufe 6 melde vorher **eine** Zeile im Chat mit geschätzter Agentenzahl, warte zwei
Minuten auf Widerspruch, dann starte. Nachts ohne Antwort läuft es trotzdem.

## Duell, ab Stufe 6

Drei Stränge, feste Strategien, jeder in einem eigenen Git-Worktree:

- **A, kleinster Eingriff** — nichts anfassen, was läuft
- **B, Ursache statt Symptom** — darf sauber neu bauen
- **C, Risiko zuerst** — fragt erst, was kaputtgehen kann

Während der Arbeit sehen sie einander **nicht**. Danach **Kreuzangriff**: jeder bekommt
die fremden Ergebnisse mit dem Auftrag, sie zu widerlegen, nicht zu loben. Dann Synthese:
Sieger nehmen, beste Einzelideen der Verlierer einpflanzen. Übrige Funde als Sammelliste
mit Kästchen unter das Review, nicht als eigene Tickets.

## Ticket-Datei

```yaml
---
id: T-0042
titel: Login-Knopf reagiert nicht
typ: FEHLER | IDEE | FRAGE | NACHTRAG
stufe: 4
status: NEU | PLANUNG | UMSETZUNG | PRUEFUNG | REVIEW | WARTET | ERLEDIGT | VERWORFEN
schritt: Prüfung läuft
fortschritt: 2/4
modell: Sonnet 5
aufwand: high
kennung: login knopf klick keine reaktion
isolation: branch ticket/T-0042
---
Worum geht's: Wenn man auf Anmelden drückt, passiert nichts.
Ziel: Klick öffnet die Startseite, auch beim zweiten Versuch.
Fakten:
- nur Firefox
Verlauf:
- 26.07. 14:03  NEU → PLANUNG (4 Punkte)
```

**Harte Schreibregeln, überall:** `Worum geht's` ist **ein** Satz, kein Fachjargon,
verständlich nach drei Tagen Abwesenheit. `Ziel` ist ein Satz, woran man Fertigsein
erkennt. Alles andere Stichpunkte, keine Füllwörter. Fragen sagen immer, **wofür** etwas
gebraucht wird.

## Grenzen, unabhängig von der Autonomie-Einstellung

Immer erst fragen, nie selbst tun: Zugangsdaten, Keys oder Passwörter eingeben oder
ablegen · Geld ausgeben · öffentlich veröffentlichen · Nachrichten in fremdem Namen
senden · endgültig löschen · System- oder Sicherheitseinstellungen ändern. Diese Fälle
gehören unter `BLOCKER` in `2-FRAGEN.md`.

## Chat-Disziplin

Pro Ereignis **eine** Zeile, sonst nichts:

```
T-42 ▸ Stufe 4 ▸ Umsetzung läuft
R-42 ▸ fertig ▸ Abnahme?
T-38 ▸ erledigt
```

Alles Ausführliche steht in den Dateien und im Dashboard.

## Befehle im Eingang

Eine Zeile, die mit `!` beginnt, ist ein Befehl und wird kein Ticket:

`!stufe T-42 6` · `!mehr T-42` · `!duell T-42 3` · `!dazu T-42 <text>` ·
`!timer T-42 20` · `!warum T-42` · `!prio T-42 1` · `!pause T-42` · `!stop T-42` ·
`!nur T-42`

## Beenden

Auf `/ticketsystem stop`: Monitor beenden, Server beenden, Stand in die MD-Dateien
schreiben, eine Abschlusszeile melden.

## Was noch nicht gebaut ist

Sag es ehrlich, wenn danach gefragt wird: Das Dashboard zeigt derzeit Beispieldaten und
ist noch nicht an die echten Ticket-Dateien angebunden. Eingefügte Bilder werden angezeigt,
aber nicht gespeichert. Die Knöpfe Abschliessen, Verwerfen, Pause und Stop schliessen die
Ansicht, lösen aber noch keine Aktion aus. Der Ablauf oben funktioniert über die Dateien.

# Routing

Wie ein Ticket eingestuft wird, wer daran arbeitet, wie das Duell läuft, wie sich zwei
Tickets nicht in die Quere kommen, und wie Recherche nur einmal bezahlt wird.

Diese Datei liest du, sobald du ein Ticket einstufst. Für einen Tippfehler brauchst du sie
nicht.

---

## Einstufen

Gewichtete Punkte, keine gezählten Signale. Ein Passwort-Thema wiegt schwerer als
„zwei Dateien".

| Punkte | Merkmal |
|---|---|
| +1 | mehrere Dateien betroffen |
| +2 | mehrere Bereiche oder Subsysteme |
| +2 | Design, UX oder Layout beteiligt |
| +2 | Anforderung unklar, mehrere Lösungswege denkbar |
| +3 | „nie wieder", „kritisch", „immer wieder", „ganz wichtig" |
| +4 | Sicherheit, Keys, Passwörter, Zugangsdaten |
| +4 | Datenverlust möglich, nicht umkehrbar |
| +5 | dieses Ticket ist schon zweimal gescheitert |
| −2 | reine Textänderung ohne Logik |

Summe → Stufe:

`0 → 1` · `1–2 → 3` · `3–4 → 4` · `5–7 → 5` · `8–11 → 6` · `ab 12 → 7`

**Sonderfall:** mehr als fünf gleichartige Einzelfälle setzt fest auf **Stufe 2**, egal
welche Punktzahl. Vierzig Textstellen sind kein Grossprojekt.

### Hartregeln, über allem

- Sicherheit oder Datenverlust im Spiel → **nie unter Stufe 5**
- Zweimal gescheitert → **nie unter Stufe 6**
- Prüfer findet nach den Fix-Runden noch Mängel → Stufe **+1**, Ticket läuft neu

Widerspricht eine Vorgabe des Nutzers einer Hartregel, ändere **nichts still**. Setze das
Ticket auf `wartet` und stelle die Frage in `2-FRAGEN.md`, mit beiden Möglichkeiten.

### Wenn der Nutzer die Stufe selbst setzt

`!stufe T-42 6` oder eine Vorgabe beim Anlegen gewinnt über die Punkterechnung, aber nicht
über die Hartregeln.

---

## Die sieben Stufen

| Stufe | Wer arbeitet | Agenten | Modell · Aufwand | Prüfung |
|---|---|---|---|---|
| **1** Winzig | du direkt | 0 | — | Selbstcheck |
| **2** Masse | viele gleichartige Kleinigkeiten parallel | 3–8 | `Haiku 4.5` · low | Stichprobe 10 % |
| **3** Klein | eine Datei, Weg klar | 2 | `Sonnet 5` · medium | 1 Prüfer |
| **4** Normal | mehrere Dateien, ein Bereich | 4–6 | `Sonnet 5` · high | 2 Prüfer, 1 Fix-Runde |
| **5** Gross | Design, Architektur, unklare Anforderung | 10–14 | `Opus 5` · high, Jury xhigh | 3 Ansätze → Jury → Umsetzung → 3 Prüfer |
| **6** Duell | kritisch, „nie wieder", Sicherheit, Datenverlust | 20–28 | `Opus 5` · xhigh | zwei bis drei Stränge, Kreuzangriff, Synthese |
| **7** Maximum | `!max`, oder zweimal gescheitert | 30–45 | `Opus 5` · max | drei Stränge, Lücken-Kritiker, Schleife |

**Ab Stufe 6:** eine Zeile im Chat melden mit geschätzter Agentenzahl, zwei Minuten auf
Widerspruch warten, dann starten. Ohne Antwort läuft es weiter, auch nachts.

**Recherche:** Stufe 1 bis 3 nur vorhandene Skills, keine Recherche. Ab Stufe 4 Playbook
lesen, falls vorhanden. Ab Stufe 5 ein Recherche-Pass, wenn kein Playbook existiert, und
danach ein Playbook schreiben.

### Ehrlich zur Agentenzahl

Gleichzeitig laufen etwa zehn bis sechzehn Agenten, der Rest wartet in der Schlange. Dreissig
Agenten sind also nicht dreissigmal schneller, sondern gründlicher und langsamer. Sag das,
wenn jemand Stufe 7 auf eine Kleinigkeit legt.

---

## Duell, ab Stufe 6

Der Punkt ist, dass die Stränge **verschieden** arbeiten, nicht dass sie viele sind.

| Strang | Strategie |
|---|---|
| **A** | **Kleinster Eingriff.** Nichts anfassen, was läuft. Minimal reparieren. |
| **B** | **Ursache statt Symptom.** Darf sauber neu bauen, wenn die Wurzel es verlangt. |
| **C** | **Risiko zuerst.** Fragt erst, was kaputtgehen kann, und baut darum herum. |

Bei Wucht über 90 % zusätzlich:

| Strang | Strategie |
|---|---|
| **D** | **Nur Bestand prüfen.** Ändert nichts, sucht nur, was schon falsch ist. |
| **E** | **Radikal neu denken.** Ignoriert den bisherigen Ansatz vollständig. |

### Regeln

1. **Jeder Strang ein eigener Git-Worktree.** Ohne Git: je ein eigener Snapshot-Ordner.
   Sonst zerschiessen sie sich gegenseitig.
2. **Während der Arbeit sehen sie einander nicht.** Sonst gleichen sie sich an und das Duell
   ist wertlos.
3. **Kreuzangriff.** Danach bekommt jeder Strang die Ergebnisse der anderen mit dem
   ausdrücklichen Auftrag, sie zu **widerlegen**, nicht zu loben. Wer nichts findet, sagt
   das, statt höflich zuzustimmen.
4. **Synthese.** Sieger nehmen, beste Einzelideen der Verlierer einpflanzen, Widersprüche
   auflisten. Bei Wucht über 90 % prüft eine zweite unabhängige Instanz, ob die Synthese
   wirklich das Beste genommen hat.
5. **Verlierer-Funde** kommen als Kästchenliste unter das Review, **nicht** als eigene
   Tickets. Sonst mauert ein Duell die Liste mit zehn Nebenideen zu. Angekreuztes wird
   Ticket, der Rest wandert ins Archiv.

### Fortschritt anzeigen

Schreibe in die Ticket-Datei:

```
straenge:
  - n: A · kleinster Eingriff
    p: 100
  - n: B · Ursache
    p: 70
  - n: C · Risiko zuerst
    p: 45
```

`p` ist 0 bis 100. Das Dashboard zeigt daraus drei Balken. Setze `p` nur an echten
Schrittgrenzen, nicht laufend.

### Stufe 7 zusätzlich

Ein **Lücken-Kritiker** am Ende: „Was wurde nicht geprüft, welche Quelle nicht gelesen,
welche Behauptung nicht belegt?" Was er findet, ist die nächste Runde. Ende nach zwei Runden
ohne neuen Fund, bei Wucht über 90 % nach drei.

---

## Datei-Sperren

Ohne das fassen zwei parallele Tickets dieselbe Datei an, und der Konflikt fällt erst beim
Zusammenführen auf. Dann ist die Arbeit schon bezahlt.

### Ablauf

1. **Vor Arbeitsbeginn** meldet jedes Ticket an, welche Dateien es anfassen wird. Eintrag in
   `.state/sperren.json`:

```json
{
  "T-42": { "dateien": ["src/login.js", "src/api.js"], "seit": "2026-07-26T20:15:00Z" },
  "T-45": { "dateien": ["src/menu.css"], "seit": "2026-07-26T20:22:00Z" }
}
```

2. **Überschneidung** mit einem laufenden Ticket → das zweite Ticket bekommt
   `zustand: wartet`, `wartetAuf: T-42`, `grund: dieselbe Datei ist noch belegt`. Es startet
   von selbst, sobald frei.
3. **Duell-Stränge** sind untereinander ausgenommen, weil jeder in einem eigenen Worktree
   arbeitet. Die Sperre greift erst beim Zusammenführen des Siegers.
4. **Unterwegs eine ungemeldete Datei gebraucht** → Sperre nachziehen. Ist sie belegt, geht
   das Ticket auf `wartet`, statt zu überschreiben.
5. **Am Ende** die Einträge des Tickets aus `sperren.json` entfernen. Auch bei Abbruch.

### Verwaiste Sperren

Ein Eintrag, der älter als zwei Stunden ist und dessen Ticket nicht mehr `laeuft`, ist
verwaist. Entferne ihn und schreib eine Zeile ins Protokoll. Sonst blockiert ein
abgestürzter Lauf das Projekt für immer.

### Wie viele gleichzeitig

Es gibt kein festes Limit. Die Sperren regeln, was sich in die Quere kommt. Was
unabhängig ist, darf gleichzeitig laufen. Ein Duell zählt als **ein** Ticket.

---

## Playbook-Cache

Der grösste Hebel gegen unnötige Kosten. Ohne ihn bezahlt jedes Design-Ticket dieselbe
Recherche neu.

### Wann

Beim **ersten** Ticket ab Stufe 5 einer Domäne recherchierst du einmal, wie man in diesem
Gebiet mit Claude das Beste herausholt. Das Ergebnis kommt nach
`.state/playbooks/<domain>.md`. Jedes weitere Ticket derselben Domäne **liest** nur noch.

### Aufbau

```
domain: design
stand: 2026-07-26

## Bester Weg
Kurz, wie man hier vorgeht.

## Werkzeuge und Skills
Was konkret hilft.

## Typische Fallen
Was regelmässig schiefgeht.

## Prüfkriterien
Woran man ein gutes Ergebnis erkennt.
```

Höchstens vierzig Zeilen. Ein Playbook, das man nicht in einer Minute liest, wird nicht
gelesen.

### Veralten

Nach neunzig Tagen gilt ein Playbook als „zu prüfen". Beim nächsten Ticket der Domäne einmal
gegenlesen und `stand` erneuern, statt blind zu vertrauen.

Bei Wucht über 90 % wird bewusst **neu** recherchiert, statt das Playbook zu lesen. Das ist
einer der Gründe, warum diese Stufe teuer ist.

---

## Timer

Setzt der Nutzer `!timer T-42 20`, planst du rückwärts vom Abgabezeitpunkt.

Zeitbudget aufteilen: **15 % Verstehen · 55 % Umsetzen · 25 % Prüfen · 5 % Puffer.**

Nach jeder Phase Restzeit prüfen. Zu wenig übrig → **Tiefe** kürzen: weniger Prüfer, weniger
Fix-Runden. Niemals heimlich den Umfang kürzen.

Bei **T minus 2 Minuten** harter Schnitt: bester Stand geht ins Review, mit einer Liste
„nicht mehr geprüft: …". Schreibe `frist` als Zeitstempel in die Ticket-Datei, dann zeigt das
Dashboard einen echten Countdown.

**Ehrlich:** Laufzeiten von Agenten sind nicht exakt vorhersagbar. Zugesagt ist **pünktliche
Abgabe**, nicht Fertigstellung. Sag das, wenn jemand einen knappen Timer auf eine grosse
Sache legt.

---

## Modell und Aufwand

Am Ticket wählbar, sonst automatisch nach Stufe:

| Stufe | Modell | Aufwand |
|---|---|---|
| 1 bis 2 | Haiku 4.5 | low |
| 3 bis 4 | Sonnet 5 | high |
| 5 | Opus 5 | high |
| 6 | Opus 5 | xhigh |
| 7 | Opus 5 | max |

Steht `modell` oder `aufwand` in der Ticket-Datei, gewinnt das. Schreibe beide Felder immer
mit, damit das Dashboard zeigen kann, womit wirklich gearbeitet wird.

`Fable 5` ist wählbar, wird von der Automatik aber nicht vergeben, weil es keine belastbare
Grundlage dafür gibt, wofür es die beste Wahl wäre.

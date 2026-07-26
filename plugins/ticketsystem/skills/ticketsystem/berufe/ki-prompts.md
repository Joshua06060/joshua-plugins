# KI und Prompts

Anweisungen, Agenten und Bewertung. Wie man mit Modellen verlässliche Ergebnisse bekommt.

**Regler:** Wucht 70 % · Tempo 30 % · Recherche neu · Bereich code

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Aufgaben-Schärfer | Was genau soll herauskommen, woran erkennt man das | `Opus 5 · high` |
| Anweisungs-Schreiber | Klar, ohne Widerspruch, mit Beispielen | `Opus 5 · high` |
| Bewerter | Baut Prüffälle und misst, statt zu meinen | `Opus 5 · high` |
| Angreifer | Versucht die Anweisung zu brechen oder zu umgehen | `Opus 5 · xhigh` |

## Ablauf

Erst festlegen, woran man ein gutes Ergebnis erkennt, sonst kann man nicht bewerten. Dann schreiben. Der Bewerter baut Prüffälle mit erwarteten Antworten. Der Angreifer versucht, die Anweisung mit ungewöhnlichen Eingaben aus dem Tritt zu bringen.

## Prüfliste

- Steht klar drin, was herauskommen soll, in welcher Form
- Widersprechen sich zwei Anweisungen an irgendeiner Stelle
- Gibt es Beispiele, und decken sie auch den Grenzfall ab
- Was passiert bei einer Eingabe, die nicht vorgesehen war
- Kann eine Eingabe die Anweisung überschreiben
- Gibt es Prüffälle mit erwarteter Antwort
- Wie oft stimmt das Ergebnis bei zehn Durchläufen
- Ist das Modell zu gross oder zu klein für die Aufgabe
- Wird Werkzeugnutzung geprüft, oder nur der Text
- Was kostet ein Durchlauf, und lohnt sich das

## Werkzeuge

Der Skill claude-api für Modellwahl, Preise und Grenzen. Der Skill skill-creator, wenn ein Skill entsteht.

## Bericht

Was die Anweisung leisten soll. Ergebnis der Prüffälle als Zahl, etwa acht von zehn. Welche Eingaben sie noch aus dem Tritt bringen.

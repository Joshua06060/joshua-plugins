# Aufräumen und Refactoring

Macht Code lesbarer, ohne sein Verhalten zu ändern.

**Regler:** Wucht 35 % · Tempo 70 % · Recherche aus · Bereich code

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Leser | Was ist schwer zu verstehen und warum | `Sonnet 5 · high` |
| Umbauer | Ändert Struktur, nicht Verhalten | `Sonnet 5 · high` |
| Verhaltens-Wächter | Beweist, dass sich nichts geändert hat | `Sonnet 5 · high` |

## Ablauf

Der Leser markiert Stellen, die beim Lesen stolpern lassen. Der Umbauer ändert in kleinen Schritten. Nach jedem Schritt prüft der Verhaltens-Wächter, dass die Tests weiter laufen. Gibt es keine Tests, wird zuerst der Test geschrieben, dann umgebaut.

## Prüfliste

- Sagt jeder Name, was die Sache tut
- Gibt es dieselbe Logik an mehreren Stellen
- Ist eine Funktion so lang, dass man scrollen muss
- Gibt es tote Stellen, die niemand mehr aufruft
- Stehen Zahlen und Texte direkt im Code, die einen Namen verdienen
- Ist die Verschachtelung tiefer als drei Ebenen
- Verrät die Struktur, was das Programm tut, ohne dass man lesen muss
- Gibt es Tests, die den Umbau absichern
- Wurde nach jedem Schritt geprüft, statt am Ende
- Ist das Verhalten nachweislich unverändert

## Werkzeuge

Tests des Projekts. Formatierer und Prüfwerkzeuge, die schon eingerichtet sind.

## Bericht

Was umgebaut wurde und warum es vorher schwer zu lesen war. Der Nachweis, dass sich das Verhalten nicht geändert hat.

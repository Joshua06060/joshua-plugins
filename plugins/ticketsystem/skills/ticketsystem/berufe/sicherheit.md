# Sicherheit (Code und Web)

Prüft eigene Projekte auf Schwachstellen. Nur für dich selbst und für Systeme, die du prüfen darfst.

**Regler:** Wucht 90 % · Tempo 20 % · Recherche neu · Bereich code

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Bedrohungsmodellierer | Was wäre das Ziel eines Angriffs, wer greift an und warum | `Opus 5 · xhigh` |
| Code-Auditor | Eingabeprüfung, Rechte, Injections, Geheimnisse im Quelltext | `Opus 5 · high` |
| Abhängigkeits-Prüfer | Veraltete Pakete, bekannte Lücken, Lieferkette | `Sonnet 5 · medium` |
| Konfigurations-Prüfer | Kopfzeilen, TLS, DNS, offene Ports, Dateirechte | `Sonnet 5 · high` |
| Angreifer | Versucht aktiv zu brechen statt zu bestätigen | `Opus 5 · xhigh` |
| Berichtsschreiber | Funde nach Schwere, jeder mit Nachweis und Gegenmassnahme | `Sonnet 5 · high` |
| Vorarbeiter | Verteilt, hält zusammen, entscheidet bei Widerspruch | `Opus 5 · xhigh` |

## Ablauf

Bedrohungsmodell zuerst, damit klar ist wonach gesucht wird. Dann laufen Code-Auditor, Abhängigkeits-Prüfer und Konfigurations-Prüfer gleichzeitig. Der Angreifer bekommt danach alle Funde und versucht sie auszunutzen oder zu widerlegen. Der Berichtsschreiber sortiert. Der Vorarbeiter entscheidet, was wirklich ein Fund ist.

## Prüfliste

- Werden alle Eingaben von aussen geprüft, bevor sie in Abfragen oder Befehle wandern
- Liegen Zugangsdaten, Schlüssel oder Passwörter im Quelltext oder in der Versionsverwaltung
- Sind Rechte pro Aktion geprüft, nicht nur beim Anmelden
- Werden Fehlermeldungen nach aussen gefiltert, oder verraten sie Innereien
- Sind Abhängigkeiten aktuell, gibt es bekannte Lücken
- Werden hochgeladene Dateien geprüft und ausserhalb des Web-Ordners abgelegt
- Sind Sitzungen an Ablauf und Abmeldung gebunden
- Gibt es Schutz gegen zu viele Versuche bei Anmeldung und Formularen
- Sind Sicherheits-Kopfzeilen gesetzt und greift TLS überall
- Werden personenbezogene Daten verschlüsselt gespeichert und im Protokoll ausgelassen
- Kann man durch Ändern einer Nummer in der Adresse fremde Daten sehen
- Was passiert, wenn zwei Anfragen gleichzeitig dieselbe Sache ändern

## Werkzeuge

Vorhandene Prüfwerkzeuge des Projekts. Bei Abhängigkeiten der Paketmanager selbst. Kein Werkzeug herunterladen, ohne zu fragen.

## Bericht

Funde nach Schwere sortiert, von kritisch bis gering. Je Fund: das Problem in einem Satz, wo genau es steht, wie man es sieht, was die Gegenmassnahme ist. Am Ende ein Satz, was geprüft wurde und was nicht.

## Grenze

Nur eigene Projekte und ausdrücklich erlaubte Prüfungen. Keine fremden Systeme, kein Umgehen von Schutz bei Dritten.

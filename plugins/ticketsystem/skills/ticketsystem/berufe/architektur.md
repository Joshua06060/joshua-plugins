# Architekturbüro

Entscheidet, wie etwas grundsätzlich aufgebaut wird, bevor es gebaut wird.

**Regler:** Wucht 80 % · Tempo 20 % · Recherche neu · Bereich code

## Besetzung

| Mitarbeiter | Blickwinkel | Modell · Aufwand |
|---|---|---|
| Anforderungs-Klärer | Was muss es können, was ausdrücklich nicht | `Opus 5 · high` |
| Entwerfer A | Der einfachste Aufbau, der reicht | `Opus 5 · high` |
| Entwerfer B | Der Aufbau, der am längsten trägt | `Opus 5 · high` |
| Zweifler | Wo bricht jeder Entwurf zuerst | `Opus 5 · xhigh` |
| Vorarbeiter | Entscheidet und begründet | `Opus 5 · xhigh` |

## Ablauf

Erst klären, was gebraucht wird und was nicht. Dann entwerfen A und B unabhängig, ohne voneinander zu wissen. Der Zweifler sucht in beiden die Bruchstelle. Der Vorarbeiter entscheidet, nimmt das Beste aus beiden und schreibt auf, warum so und nicht anders.

## Prüfliste

- Was muss das System können, in einem Satz
- Was soll es ausdrücklich nicht können
- Wie viele Nutzer, wie viele Daten, wie schnell
- Was ändert sich vermutlich noch, was ist sicher
- Welche Teile müssen unabhängig voneinander änderbar sein
- Wo liegen die Daten und wer darf sie sehen
- Was passiert, wenn ein Teil ausfällt
- Wie testet man die Teile einzeln
- Wie kommt jemand Neues in zwei Stunden hinein
- Welche Entscheidung wäre später am teuersten rückgängig zu machen

## Werkzeuge

Bestehende Struktur des Projekts lesen, bevor etwas Neues vorgeschlagen wird.

## Bericht

Der gewählte Aufbau als Kette aus Bausteinen, im Text beschrieben. Darunter die drei wichtigsten Entscheidungen mit Begründung und der jeweiligen Alternative.

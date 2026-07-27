/* Liest und schreibt eine Ticket-Datei: ein YAML-artiger Kopf zwischen zwei "---"-Zeilen,
   darunter freier Text. Kein allgemeiner YAML-Parser — nur genau das Teilstück, das
   SKILL.md als Format vorschreibt. Absichtlich streng beim Schreiben (immer dasselbe
   Format), grosszügig beim Lesen (bricht nie ab, auch bei einem kaputten Kopf).

   Unterstützte Kopfzeilen:
     schluessel: wert            einfacher Wert, leer erlaubt (z. B. "frist:")
     schluessel:
       - text                    Liste aus Text, z. B. punkte:
       - {n: "A", p: 40}         Liste aus Zahl-Paaren, nur für straenge: gebraucht

   Alles, was hier nicht als bekanntes Feld geführt wird, bleibt beim Schreiben trotzdem
   erhalten — nichts geht verloren, was Claude oder eine spätere Version dazuschreibt. */
(function () {
'use strict';

/* Reihenfolge beim Schreiben, wortgenau wie in SKILL.md vorgegeben. Alles, was ein
   Ticket hat und hier nicht steht, wird nach dieser Liste angehängt statt verworfen. */
var FELD_REIHENFOLGE = [
  'nr', 'titel', 'zustand', 'stufe', 'schritt', 'fortschritt', 'begonnen', 'frist', 'abgeschlossen',
  'modell', 'aufwand', 'dringend', 'gruendlich', 'beruf', 'timer', 'isolation', 'freigabe',
  'frage', 'art', 'neu', 'pruefen', 'dauer', 'dateien', 'ideen',
  'wartetAuf', 'grund',
  'punkte', 'straenge', 'anhaenge'
];
var LISTEN_FELDER = { punkte: 'text', straenge: 'paar', anhaenge: 'text' };

function parse(inhalt) {
  var text = String(inhalt || '').replace(/^\uFEFF/, '');
  var zeilen = text.split(/\r\n|\r|\n/);
  var i = 0;
  while (i < zeilen.length && zeilen[i].trim() === '') i++;
  if (zeilen[i] !== '---') return { kopf: {}, koerper: text.trim(), kaputt: text.trim() !== '' };
  i++;
  var kopfZeilen = [];
  while (i < zeilen.length && zeilen[i] !== '---') { kopfZeilen.push(zeilen[i]); i++; }
  var kaputt = zeilen[i] !== '---'; /* zweites "---" fehlt: Kopf trotzdem nehmen, nur melden */
  if (!kaputt) i++;
  var koerper = zeilen.slice(i).join('\n').replace(/^\n+/, '');

  var kopf = {};
  var k = 0;
  while (k < kopfZeilen.length) {
    var zeile = kopfZeilen[k];
    var treffer = /^([A-Za-zÄÖÜäöüß_]+):[ \t]?(.*)$/.exec(zeile);
    if (!treffer) { k++; continue; }
    var name = treffer[1], rest = treffer[2].trim();
    if (rest !== '') { kopf[name] = wertLesen(rest); k++; continue; }
    /* Kein Wert auf der Zeile: prüfen, ob eine Liste folgt */
    var liste = [], j = k + 1;
    while (j < kopfZeilen.length && /^\s*-\s?/.test(kopfZeilen[j])) {
      var eintrag = kopfZeilen[j].replace(/^\s*-\s?/, '').trim();
      liste.push(eintrag[0] === '{' ? paarLesen(eintrag) : wertLesen(eintrag));
      j++;
    }
    if (liste.length) { kopf[name] = liste; k = j; }
    else { kopf[name] = ''; k++; }
  }
  if (typeof kopf.nr === 'string' && /^\d+$/.test(kopf.nr)) kopf.nr = parseInt(kopf.nr, 10);
  if (typeof kopf.ideen === 'string' && /^\d+$/.test(kopf.ideen)) kopf.ideen = parseInt(kopf.ideen, 10);
  return { kopf: kopf, koerper: koerper, kaputt: kaputt };
}

/* Anführungszeichen um einen Wert nur entfernen, wenn beide Enden welche haben */
function wertLesen(s) {
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') return s.slice(1, -1);
  return s;
}
/* Nur die eine Form {n: "...", p: NN}, mehr braucht straenge: nicht */
function paarLesen(s) {
  var n = /n:\s*"([^"]*)"/.exec(s);
  var p = /p:\s*(-?\d+(?:\.\d+)?)/.exec(s);
  return { n: n ? n[1] : '', p: p ? Number(p[1]) : 0 };
}

function wertSchreiben(v) {
  var s = String(v);
  return /[:#]/.test(s) || s !== s.trim() ? '"' + s.replace(/"/g, '\\"') + '"' : s;
}

function stringify(kopf, koerper) {
  var zeilen = ['---'];
  var gesehen = {};
  function zeileFuer(name) {
    gesehen[name] = true;
    var wert = kopf[name];
    if (wert == null) { zeilen.push(name + ':'); return; }
    if (Array.isArray(wert)) {
      if (!wert.length) { zeilen.push(name + ':'); return; }
      zeilen.push(name + ':');
      wert.forEach(function (e) {
        if (e && typeof e === 'object') zeilen.push('  - {n: "' + String(e.n || '').replace(/"/g, '\\"') + '", p: ' + (Number(e.p) || 0) + '}');
        else zeilen.push('  - ' + wertSchreiben(e));
      });
      return;
    }
    zeilen.push(name + ': ' + (wert === '' ? '' : wertSchreiben(wert)));
  }
  FELD_REIHENFOLGE.forEach(function (name) { if (name in kopf) zeileFuer(name); });
  /* Unbekannte Felder nicht verschweigen, sondern ans Ende hängen */
  Object.keys(kopf).forEach(function (name) { if (!gesehen[name]) zeileFuer(name); });
  zeilen.push('---');
  var kopfText = zeilen.join('\n');
  var koerperText = String(koerper || '').replace(/^\n+/, '').replace(/\s+$/, '');
  return kopfText + '\n' + (koerperText ? koerperText + '\n' : '');
}

window.Ticketdatei = { parse: parse, stringify: stringify, LISTEN_FELDER: LISTEN_FELDER };
})();

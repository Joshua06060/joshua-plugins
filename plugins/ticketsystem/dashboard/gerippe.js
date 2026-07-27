/* Ticketsystem-Dashboard
   Liest und schreibt den TICKETSYSTEM-Ordner direkt (File System Access API, nur
   Chromium-Browser). Ohne verbundenen Ordner: reine Anzeige über die alte daten.js, die
   Claude als Rückfalloption weiterschreibt. Fünfzehn Designs, umschaltbar zur Laufzeit.
   Kein Netzzugriff, keine Abhängigkeiten. */
(function () {
'use strict';

/* ---------- Designs ---------- */
var DESIGNS = [
  { id: 'e1',  name: 'Apple',     kurz: 'Schwarz, Titan, viel Luft' },
  { id: 'e2',  name: 'Raycast',   kurz: 'Farbnebel, Glaskarten' },
  { id: 'e3',  name: 'Diktavo',   kurz: 'Grosse Grotesk, Elektroblau' },
  { id: 'e4',  name: 'Roblox',    kurz: 'Klotzkanten, Rot und Blau' },
  { id: 'e5',  name: 'Arcane',    kurz: 'Gold gegen Magenta, Korn' },
  { id: 'e6',  name: 'Claude',    kurz: 'Warmes Dunkel, Serifen' },
  { id: 'e7',  name: 'ChatGPT',   kurz: 'Grau, dünne Linien, ruhig' },
  { id: 'e8',  name: 'Joshua',    kurz: 'Neongrün, Cyan-Raster' },
  { id: 'e9',  name: 'Minecraft', kurz: 'Pixelkanten, Stein und Erde' },
  { id: 'e10', name: 'Linear',    kurz: 'Blaugrau, ein Violett, streng' },
  { id: 'e11', name: 'Terminal',  kurz: 'Phosphorgrün, Mono, Zeilenraster' },
  { id: 'e12', name: 'Blueprint', kurz: 'Konstruktionsplan, Cyan auf Marine' },
  { id: 'e13', name: 'Synthwave', kurz: 'Magenta gegen Cyan, laut und neon' },
  { id: 'e14', name: 'Brutalist', kurz: 'Schwarzweiss, ein Rot, Plakatschrift' },
  { id: 'e15', name: 'Nord',      kurz: 'Arktisch gedämpft, ruhigstes von allen' }
];

/* ---------- Modelle und Aufwand ----------
   Die Modelle von Claude Code. Kommt ein neues dazu, nur diese eine Liste ändern,
   dann steht es überall zur Auswahl: im Anlegen, am laufenden Ticket und als Standard. */
var MODELL  = ['automatisch', 'Haiku 4.5', 'Sonnet 5', 'Opus 5', 'Fable 5'];
var AUFWAND = ['automatisch', 'low', 'medium', 'high', 'xhigh', 'max'];

/* Was "automatisch" je Stufe wählt, wenn auch die Vorgaben nichts Festes sagen */
function modellFuer(stufe) {
  if (stufe <= 2) return { m: 'Haiku 4.5', a: 'low' };
  if (stufe <= 4) return { m: 'Sonnet 5', a: 'high' };
  if (stufe === 5) return { m: 'Opus 5', a: 'high' };
  if (stufe === 6) return { m: 'Opus 5', a: 'xhigh' };
  return { m: 'Opus 5', a: 'max' };
}

var DRINGEND  = ['beiläufig', 'normal', 'wichtig', 'brennt'];
var GRUENDL   = ['automatisch', 'schnell', 'gründlich', 'maximal'];
var BERUFE = [
  'Sicherheit', 'Web-Infrastruktur', 'Fehlersuche', 'Test & QS', 'Performance', 'Aufräumen',
  'Architekturbüro', 'Datenbank', 'API-Entwurf', 'Build & Auslieferung', 'Mobile & Apps', 'Abhängigkeiten',
  'Design', 'UX-Forschung', 'Marke & Logo', '3D & Blender', 'Video', 'Texter',
  'Lektorat', 'Dokumentation', 'Übersetzung', 'Barrierefreiheit',
  'Datenanalyse', 'KI & Prompts', 'SEO', 'Produktmanagement', 'Marktforschung',
  'Recht & Datenschutz', 'Finanzen', 'Support'
];
var ISOLATION = ['automatisch', 'Branch', 'Snapshot'];
var FREIGABE  = ['automatisch', 'autonom', 'erst fragen'];

/* ---------- Einstellungen der Seite selbst (Design, Grösse) ---------- */
var EINST = [
  { key: 'design', titel: 'Design', art: 'design' },
  { key: 'skala',  titel: 'Schriftgrösse', werte: ['100 %', '120 %', '140 %'],
    hilfe: 'Vergrössert alles, nicht nur die Schrift.' }
];
var konf = { design: 7, skala: 1 };
function konfLaden() {
  try {
    var roh = localStorage.getItem('ticketsystem-konf');
    if (roh) { var g = JSON.parse(roh); Object.keys(konf).forEach(function (k) { if (typeof g[k] === 'number') konf[k] = g[k]; }); }
  } catch (e) {}
}
function konfSichern() { try { localStorage.setItem('ticketsystem-konf', JSON.stringify(konf)); } catch (e) {} }
function konfAnwenden() {
  var h = document.documentElement;
  h.setAttribute('data-stil', DESIGNS[konf.design].id);
  h.style.setProperty('--skala', [1, 1.2, 1.4][konf.skala]);
}

/* ---------- Vorgaben für neue Tickets, in config.md ----------
   "automatisch" an einem Ticket heisst: nimm das hier, wenn gesetzt, sonst die
   eingebaute Automatik (modellFuer, Stufen-Tabelle). Claude liest dieselbe Datei. */
var VORGABEN_STANDARD = {
  isolation: 'Branch', autonomie: 'selbst',
  vorgabeGruendlich: 'automatisch', vorgabeTimer: '0',
  vorgabeModell: 'automatisch', vorgabeAufwand: 'automatisch',
  vorgabeBeruf: '', duellAbStufe: '6'
};
var vorgaben = Object.assign({}, VORGABEN_STANDARD);

function vorgabenLaden() {
  return Ordner.leseDatei('config.md').then(function (roh) {
    if (roh == null) return;
    var kopf = Ticketdatei.parse(roh).kopf;
    vorgaben = Object.assign({}, VORGABEN_STANDARD);
    Object.keys(VORGABEN_STANDARD).forEach(function (k) { if (kopf[k]) vorgaben[k] = kopf[k]; });
  }).catch(function () {});
}
function vorgabenSichern() {
  var kopf = {};
  Object.keys(VORGABEN_STANDARD).forEach(function (k) { kopf[k] = vorgaben[k]; });
  return Ordner.schreibeDatei('config.md', Ticketdatei.stringify(kopf, ''));
}

/* ---------- Verbindung zum Ordner ---------- */
/* status: lädt · nicht-unterstuetzt · nicht-verbunden · erlaubnis-noetig · verbunden */
var verbindung = { status: 'lädt', handle: null, fehler: null };

/* ---------- Daten ---------- */
var ticketDaten = { projekt: null, tickets: [], fertig: [] };
var sitzungsName = null;
function offenAnzahl() { return ticketDaten.tickets.length; }

/* Aus einem gelesenen Ticketkopf + Dateiname ein Anzeige-Ticket machen. Fehlt "nr" im
   Kopf, wird sie aus dem Dateinamen geraten, damit selbst ein kaputter Kopf sichtbar
   bleibt statt zu verschwinden. */
function ausDatei(dateiname, roh) {
  var g = Ticketdatei.parse(roh);
  var t = g.kopf;
  t._kaputt = g.kaputt;
  t._koerper = g.koerper;
  t._datei = dateiname;
  if (!t.nr && t.nr !== 0) { var m = /T-0*(\d+)/i.exec(dateiname); t.nr = m ? parseInt(m[1], 10) : dateiname; }
  if (!t.titel) t.titel = t._kaputt ? '(Kopf beschädigt) ' + dateiname : dateiname;
  if (!t.zustand) t.zustand = 'offen';
  return t;
}

var ordnerLesenLaeuft = false, ordnerLesenErneut = false, letzterOrdnerStand = '';
function ordnerLesen(erstesMal) {
  if (!Ordner.verbunden()) { if (erstesMal) zeichne(); return; }
  if (ordnerLesenLaeuft) { ordnerLesenErneut = true; return; }
  ordnerLesenLaeuft = true;
  Promise.all([
    Ordner.listeOrdner('.tickets'),
    Ordner.leseDatei('.state/session.json'),
    Ordner.leseDatei('config.md')
  ]).then(function (r) {
    var dateinamen = r[0].filter(function (n) { return /\.md$/i.test(n); }).sort();
    return Promise.all(dateinamen.map(function (n) {
      return Ordner.leseDatei('.tickets/' + n).then(function (roh) { return roh == null ? null : ausDatei(n, roh); });
    })).then(function (tickets) { return { tickets: tickets.filter(Boolean), sessionRoh: r[1], configRoh: r[2] }; });
  }).then(function (res) {
    var neu = JSON.stringify(res);
    var geaendert = neu !== letzterOrdnerStand || erstesMal;
    letzterOrdnerStand = neu;
    if (!geaendert) return;
    var offen = [], fertig = [];
    res.tickets.forEach(function (t) {
      if (t.zustand === 'erledigt' || t.zustand === 'verworfen') fertig.push(t); else offen.push(t);
    });
    ticketDaten.tickets = offen;
    ticketDaten.fertig = fertig;
    if (res.sessionRoh) { try { sitzungsName = JSON.parse(res.sessionRoh).name || null; } catch (e) {} }
    if (res.configRoh) {
      var kopf = Ticketdatei.parse(res.configRoh).kopf;
      Object.keys(VORGABEN_STANDARD).forEach(function (k) { if (kopf[k]) vorgaben[k] = kopf[k]; });
    }
    var tippt = document.activeElement && /TEXTAREA|INPUT/.test(document.activeElement.tagName);
    var listeOffen = document.querySelector('.chip-wrap.is-open');
    if (!tippt && !listeOffen) zeichne();
  }).catch(function () { verbindung.status = 'nicht-verbunden'; zeichne(); })
    .then(function () {
      ordnerLesenLaeuft = false;
      if (ordnerLesenErneut) { ordnerLesenErneut = false; ordnerLesen(false); }
    });
}

/* ---------- Rückfalloption ohne verbundenen Ordner: alte daten.js, nur Anzeige ----------
   Claude schreibt sie bei jeder Statusänderung weiter mit, für Firefox und Safari. */
var letzterDatenStand = '';
function datenNachladenFallback(erstesMal) {
  var s = document.createElement('script');
  s.src = 'daten.js?t=' + Date.now();
  s.onload = function () {
    s.remove();
    var d = window.TICKETDATEN;
    var neu = JSON.stringify(d || null);
    if (neu === letzterDatenStand && !erstesMal) return;
    letzterDatenStand = neu;
    if (d && Array.isArray(d.sessions) && d.sessions[0]) {
      ticketDaten.tickets = d.sessions[0].tickets || [];
      ticketDaten.fertig = d.sessions[0].fertig || [];
      ticketDaten.projekt = d.projekt || d.sessions[0].name || null;
    } else { ticketDaten.tickets = []; ticketDaten.fertig = []; }
    var tippt = document.activeElement && /TEXTAREA|INPUT/.test(document.activeElement.tagName);
    if (!tippt) zeichne();
  };
  s.onerror = function () { s.remove(); if (erstesMal) zeichne(); };
  document.head.appendChild(s);
}

/* ---------- Zustand der Bedienfläche ---------- */
var st = { ticket: null, offen: false, einst: false, schritt: 1,
           anpassen: false, fertigAuf: false, archivSuche: '',
           berufe: [], hinweis: '', anhaenge: [],
           text: '',
           frageText: '', frageAnhaenge: [],
           nachbesserOffen: false, nachbesserText: '', nachbesserAnhaenge: [],
           wahl: { dring: 1, grund: 0, timerMin: 0, modell: 0, aufwand: 0, iso: 0, frei: 0,
                    stufeUeb: 0, straenge: 3 } };

/* ---------- Helfer ---------- */
function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }
function farbe(nr) { return 'hsl(' + ((nr * 47) % 360) + ',var(--tc-s,68%),var(--tc-l,58%))'; }
function mmss(s) { var m = Math.floor(s / 60); return m + ':' + String(s % 60).padStart(2, '0'); }

function minutenSeit(iso) {
  if (!iso) return 0;
  var d = new Date(iso); if (isNaN(d)) return 0;
  return Math.max(0, Math.round((Date.now() - d) / 60000));
}
function prozent(t) {
  if (!t.fortschritt) return null;
  var p = String(t.fortschritt).split('/');
  var a = parseFloat(p[0]), b = parseFloat(p[1]);
  if (!(b > 0) || isNaN(a)) return null;
  return Math.max(0, Math.min(100, Math.round(a / b * 100)));
}
function restText(t) {
  if (t.frist) {
    var rest = Math.max(0, Math.round((new Date(t.frist) - Date.now()) / 1000));
    return rest > 0 ? 'Frist ' + mmss(rest) : 'Frist abgelaufen';
  }
  return t.rest ? 'noch ~' + t.rest + ' min' : '';
}

function findT(nr) {
  var alle = ticketDaten.tickets.concat(ticketDaten.fertig);
  for (var i = 0; i < alle.length; i++) if (alle[i].nr === nr) return alle[i];
  return null;
}

function detailZuruecksetzen() {
  st.anpassen = false;
  st.nachbesserOffen = false; st.nachbesserText = ''; st.nachbesserAnhaenge = [];
  st.frageText = ''; st.frageAnhaenge = [];
  st.wahl.stufeUeb = 0; st.wahl.straenge = 3;
}
function allesZu() { st.ticket = null; st.offen = false; st.einst = false; st.schritt = 1; detailZuruecksetzen(); }

/* ---------- Bilder: Einfügen, Hineinziehen, Auswählen, beliebig viele ---------- */
function bilderNehmen(dateien, arr) {
  var bilddateien = [];
  for (var i = 0; i < dateien.length; i++) {
    if (dateien[i] && dateien[i].type && dateien[i].type.indexOf('image/') === 0) bilddateien.push(dateien[i]);
  }
  if (!bilddateien.length) return;
  var offen = bilddateien.length;
  bilddateien.forEach(function (datei) {
    var lese = new FileReader();
    lese.onload = function () {
      arr.push({ name: datei.name || 'Screenshot', groesse: Math.round(datei.size / 1024) + ' kB', url: lese.result });
      if (--offen === 0) zeichne();
    };
    lese.readAsDataURL(datei);
  });
}
function bilder(ta, arr) {
  ta.onpaste = function (ev) {
    var items = (ev.clipboardData && ev.clipboardData.items) || [];
    var dateien = [];
    for (var i = 0; i < items.length; i++) { var d = items[i].getAsFile && items[i].getAsFile(); if (d) dateien.push(d); }
    if (dateien.length) { ev.preventDefault(); bilderNehmen(dateien, arr); }
  };
  ta.ondragover = function (ev) { ev.preventDefault(); ta.classList.add('is-ueber'); };
  ta.ondragleave = function () { ta.classList.remove('is-ueber'); };
  ta.ondrop = function (ev) { ev.preventDefault(); ta.classList.remove('is-ueber'); bilderNehmen((ev.dataTransfer && ev.dataTransfer.files) || [], arr); };
}
function bilderKnopf(arr) {
  var label = el('label', 'anhang-waehlen', 'Bilder auswählen');
  var eingabe = document.createElement('input');
  eingabe.type = 'file'; eingabe.accept = 'image/*'; eingabe.multiple = true;
  eingabe.onclick = function (ev) { ev.stopPropagation(); };
  eingabe.onchange = function () { bilderNehmen(eingabe.files, arr); eingabe.value = ''; };
  label.appendChild(eingabe);
  return label;
}
function anhangGrid(arr) {
  var liste = (arr || []).filter(Boolean);
  if (!liste.length) return null;
  var w = el('div', 'anhang-wrap');
  w.appendChild(el('div', 'anhang-zahl', liste.length + (liste.length === 1 ? ' Bild' : ' Bilder')));
  var g = el('div', 'anhang-grid');
  liste.forEach(function (a) {
    var k = el('div', 'anhang-kachel');
    k.title = a.name + ' · ' + a.groesse;
    var bild = document.createElement('img');
    bild.src = a.url; bild.alt = a.name;
    k.appendChild(bild);
    var weg = el('button', 'anhang-weg', '✕');
    weg.onclick = function (ev) { ev.stopPropagation(); arr.splice(arr.indexOf(a), 1); zeichne(); };
    k.appendChild(weg);
    g.appendChild(k);
  });
  w.appendChild(g);
  return w;
}
function ticketPfad(nr) { return '.tickets/T-' + String(nr).padStart(4, '0') + '.md'; }

/* Anhänge als echte Dateien im Ordner ablegen, für ein bestimmtes Ticket.
   Der Zeitstempel im Namen muss sein: sonst überschreibt die zweite Nachbesserung
   am selben Ticket die Bilder der ersten, weil beide bei -1 anfangen. */
function speichereAnhaenge(nr, praefix, liste) {
  if (!liste.length) return Promise.resolve([]);
  var marke = Date.now().toString(36);
  return Promise.all(liste.map(function (a, i) {
    var endung = (/\.(\w+)$/.exec(a.name || '') || [])[1] || (/^data:image\/(\w+)/.exec(a.url) || [])[1] || 'png';
    var pfad = '.state/anhaenge/T-' + String(nr).padStart(4, '0') + '-' + praefix + '-' + marke + '-' + (i + 1) + '.' + endung;
    return Ordner.schreibeBinaer(pfad, a.url).then(function () { return pfad; });
  }));
}

/* ---------- Befehle auslösen: Zeile in .state/befehle.jsonl, Claude arbeitet sie ab ---------- */
/* Eindeutig auch bei zwei Klicks in derselben Millisekunde und über mehrere offene
   Dashboards hinweg: Zeit + Zufall + laufende Nummer. */
var befehlZaehler = 0;
function neueBefehlId() {
  befehlZaehler++;
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) + '-' + befehlZaehler;
}

function befehlAusloesen(befehl, knopf) {
  var alt = knopf.textContent;
  knopf.disabled = true; knopf.classList.remove('kopiert', 'fehler'); knopf.classList.add('sendet');
  knopf.textContent = 'wird ausgelöst…';
  /* Jede Zeile bekommt eine eindeutige id. Das Anhängen ist ein Lesen-Ändern-Schreiben:
     leert Claude die Datei genau dazwischen, schreibt das Dashboard eine bereits
     ausgeführte Zeile versehentlich zurück. Ohne id würde Claude sie ein zweites Mal
     ausführen — bei "verwerfen" hiesse das, Änderungen zweimal zurückzunehmen. Mit id
     erkennt Claude die Wiederholung und überspringt sie. */
  var zeile = JSON.stringify(Object.assign(
    { id: neueBefehlId(), zeit: new Date().toISOString() }, befehl));
  Ordner.anhaengen('.state/befehle.jsonl', zeile).then(function () {
    knopf.classList.remove('sendet'); knopf.classList.add('kopiert');
    knopf.textContent = 'ausgelöst';
    setTimeout(function () { knopf.disabled = false; knopf.textContent = alt; knopf.classList.remove('kopiert'); }, 2200);
  }, function () {
    knopf.disabled = false; knopf.classList.remove('sendet'); knopf.classList.add('fehler');
    knopf.textContent = 'Fehler, nochmal?';
    setTimeout(function () { knopf.textContent = alt; knopf.classList.remove('fehler'); }, 3000);
  });
}
function befehlKnopf(text, befehl, extra) {
  var b = el('button', 'btn' + (extra ? ' ' + extra : ''), text);
  b.title = 'Löst "' + befehl.befehl + '" für T-' + befehl.nr + ' aus.';
  b.onclick = function (ev) { ev.stopPropagation(); befehlAusloesen(befehl, b); };
  return b;
}

/* Klartextzeile: was die Einstellung bedeutet */
function rechnung() {
  var g = st.wahl.grund === 0 && vorgaben.vorgabeGruendlich !== 'automatisch' ? GRUENDL.indexOf(vorgaben.vorgabeGruendlich) : st.wahl.grund;
  if (g < 0) g = 0;
  var stufe = [4, 2, 5, 7][g], agenten = [5, 2, 12, 38][g], min = [9, 3, 19, 55][g];
  st.berufe.forEach(function () { stufe = Math.max(stufe, 5); agenten += 4; min += 6; });
  var w = modellWahl(stufe);
  var t = 'Stufe ' + stufe + ' · ' + agenten + ' Agenten · ' + w.m + ' ' + w.a + ' · ~' + min + ' Min';
  if (st.wahl.timerMin > 0) t += ' · Frist ' + st.wahl.timerMin + ' Min';
  return t;
}
function modellWahl(stufe) {
  var auto = modellFuer(stufe);
  var vm = vorgaben.vorgabeModell && vorgaben.vorgabeModell !== 'automatisch' ? vorgaben.vorgabeModell : null;
  var va = vorgaben.vorgabeAufwand && vorgaben.vorgabeAufwand !== 'automatisch' ? vorgaben.vorgabeAufwand : null;
  return {
    m: st.wahl.modell > 0 ? MODELL[st.wahl.modell] : (vm || auto.m),
    a: st.wahl.aufwand > 0 ? AUFWAND[st.wahl.aufwand] : (va || auto.a)
  };
}

function chip(label, liste, key) {
  var wrap = el('span', 'chip-wrap');
  var b = el('button', 'chip', label + ': ' + liste[st.wahl[key]] + ' ▾');
  var pop = el('div', 'pop');
  liste.forEach(function (v, i) {
    var o = el('button', 'pop-item' + (i === st.wahl[key] ? ' is-on' : ''), v);
    o.onclick = function (ev) { ev.stopPropagation(); st.wahl[key] = i; zeichne(); };
    pop.appendChild(o);
  });
  b.onclick = function (ev) { ev.stopPropagation(); wrap.classList.toggle('is-open'); };
  wrap.appendChild(b); wrap.appendChild(pop);
  return wrap;
}

/* Echter Schieberegler (Tastatur, Touch, Maus), Text daneben klartext */
function schieberegler(label, min, max, step, wert, textFn, onInput) {
  var r = el('div', 'srow');
  r.appendChild(el('label', null, label));
  var input = document.createElement('input');
  input.type = 'range'; input.className = 'regler-input';
  input.min = min; input.max = max; input.step = step; input.value = wert;
  var out = el('output', null, textFn(wert));
  input.oninput = function (ev) { ev.stopPropagation(); var v = +input.value; out.textContent = textFn(v); onInput(v); };
  input.onclick = function (ev) { ev.stopPropagation(); };
  r.appendChild(input); r.appendChild(out);
  return r;
}

/* ---------- Seitenleiste ---------- */
function seite() {
  var a = el('aside', 'sidebar');
  var h = el('div', 'side-head'); h.appendChild(el('span', 'logo', 'Ticketsystem')); a.appendChild(h);
  a.appendChild(el('div', 'side-label', 'Projekt'));
  var live = verbindung.status === 'verbunden' || verbindung.status === 'nicht-unterstuetzt';
  var d = el('div', 'proj is-active' + (verbindung.status === 'verbunden' ? '' : ' is-dead'));
  d.appendChild(el('span', 'dot' + (verbindung.status === 'verbunden' ? ' on' : '')));
  d.appendChild(el('span', 'pname', sitzungsName || ticketDaten.projekt || 'Ticketsystem'));
  var unterzeile = 'nicht verbunden';
  if (verbindung.status === 'verbunden') unterzeile = offenAnzahl() + ' offen';
  else if (verbindung.status === 'nicht-unterstuetzt') unterzeile = 'nur Anzeige';
  else if (verbindung.status === 'erlaubnis-noetig') unterzeile = 'Erlaubnis nötig';
  d.appendChild(el('span', 'psub', unterzeile));
  a.appendChild(d);

  var f = el('div', 'side-fuss');
  var e = el('button', 'side-knopf' + (st.einst ? ' is-active' : ''));
  e.appendChild(el('span', 'side-symbol', '⚙'));
  e.appendChild(el('span', null, 'Einstellungen'));
  e.appendChild(el('span', 'spacer'));
  e.appendChild(el('span', 'side-wert', DESIGNS[konf.design].name));
  e.onclick = function () { var an = !st.einst; allesZu(); st.einst = an; zeichne(); };
  f.appendChild(e);
  f.appendChild(el('div', 'side-foot', 'D wechselt das Design · Esc zurück'));
  a.appendChild(f);
  return a;
}

/* ---------- Kopfzeile ---------- */
function kopf() {
  var h = el('header', 'topbar');
  var c = el('nav', 'crumbs');
  function zurueck() { allesZu(); zeichne(); }

  if (st.ticket || st.offen || st.einst) {
    var zur = el('button', 'back', '←');
    zur.onclick = zurueck; h.appendChild(zur);
    var b1 = el('button', 'crumb', st.einst ? 'Ticketsystem' : (sitzungsName || ticketDaten.projekt || 'Ticketsystem'));
    b1.onclick = zurueck;
    c.appendChild(b1); c.appendChild(el('i', null, '›'));
    c.appendChild(el('b', null,
      st.einst ? 'Einstellungen'
               : (st.ticket ? 'T-' + st.ticket : 'Neues Ticket, Schritt ' + st.schritt + ' von 3')));
  } else {
    c.appendChild(el('b', null, sitzungsName || ticketDaten.projekt || 'Ticketsystem'));
  }
  h.appendChild(c);
  h.appendChild(el('span', 'spacer'));
  /* Hält jedes laufende Ticket an. Ohne verbundenen Ordner gibt es keinen Weg, das
     auszulösen — dann steht der Knopf abgeschaltet da, statt so zu tun als ginge es. */
  var stopAlle = el('button', 'pill danger', 'Alles anhalten');
  if (Ordner.verbunden()) {
    stopAlle.title = 'Setzt alle laufenden Tickets auf Pause.';
    stopAlle.onclick = function (ev) {
      ev.stopPropagation();
      befehlAusloesen({ befehl: 'alleAnhalten' }, stopAlle);
    };
  } else {
    stopAlle.disabled = true;
    stopAlle.title = 'Erst den Ordner verbinden, dann kann das Dashboard etwas auslösen.';
  }
  h.appendChild(stopAlle);
  return h;
}

/* ---------- Verbindungsband ---------- */
function verbindungBand() {
  if (verbindung.status === 'lädt' || verbindung.status === 'verbunden') return null;
  var b = el('div', 'connect-band');
  if (verbindung.status === 'nicht-unterstuetzt') {
    b.appendChild(el('span', null, 'Nur Anzeige: dieser Browser kann keine Dateien schreiben.'));
    b.appendChild(el('span', 'connect-hilfe', 'Zum Bedienen in Chrome, Edge, Brave, Arc oder Opera öffnen.'));
    return b;
  }
  if (verbindung.status === 'erlaubnis-noetig') {
    b.appendChild(el('span', null, 'Ordner bekannt, Erlaubnis ist abgelaufen.'));
    var kn = el('button', 'btn primary', 'Ordner wieder erlauben');
    kn.onclick = function () {
      Ordner.erneutErlauben(verbindung.handle).then(function () {
        verbindung.status = 'verbunden'; vorgabenLaden(); ordnerLesen(true); zeichne();
      }, function () { zeichne(); });
    };
    b.appendChild(kn);
    return b;
  }
  b.appendChild(el('span', null, 'Nur Anzeige, solange kein Ordner verbunden ist.'));
  var kn2 = el('button', 'btn primary', 'Ordner verbinden');
  kn2.onclick = function () {
    verbindung.fehler = null;
    Ordner.verbinden().then(function () {
      verbindung.status = 'verbunden'; vorgabenLaden(); ordnerLesen(true); zeichne();
    }, function (e) {
      if (e && e.code === 'falscher-ordner') verbindung.fehler = 'Kein TICKETSYSTEM-Ordner. Bitte den Ordner "TICKETSYSTEM" wählen, eine Ebene über diesem Dashboard.';
      else if (!(e && e.name === 'AbortError')) verbindung.fehler = 'Verbinden hat nicht geklappt.';
      zeichne();
    });
  };
  b.appendChild(kn2);
  if (verbindung.fehler) b.appendChild(el('p', 'connect-fehler', verbindung.fehler));
  return b;
}

/* ---------- Ebene: Einstellungen ---------- */
function einstellungen() {
  var w = el('div', 'views nur-schreiben');

  EINST.forEach(function (e) {
    var c = el('div', 'card einst');
    var k = el('div', 'einst-kopf');
    k.appendChild(el('b', 'einst-titel', e.titel));
    if (e.hilfe) { k.appendChild(el('span', 'spacer')); k.appendChild(el('span', 'einst-hilfe', e.hilfe)); }
    c.appendChild(k);

    if (e.art === 'design') {
      var g = el('div', 'design-grid');
      DESIGNS.forEach(function (d, i) {
        var b = el('button', 'design-kachel' + (i === konf.design ? ' is-on' : ''));
        b.setAttribute('data-vorschau', d.id);
        var streifen = el('span', 'design-streifen');
        streifen.appendChild(el('i', 'ds ds1')); streifen.appendChild(el('i', 'ds ds2')); streifen.appendChild(el('i', 'ds ds3'));
        b.appendChild(streifen);
        b.appendChild(el('span', 'design-name', d.name));
        b.appendChild(el('span', 'design-kurz', d.kurz));
        b.onclick = function () { konf.design = i; konfSichern(); konfAnwenden(); zeichne(); };
        g.appendChild(b);
      });
      c.appendChild(g);
    } else {
      var reihe = el('div', 'wahl-reihe');
      e.werte.forEach(function (v, i) {
        var b = el('button', 'wahl-knopf' + (i === konf[e.key] ? ' is-on' : ''), v);
        b.onclick = function () { konf[e.key] = i; konfSichern(); konfAnwenden(); zeichne(); };
        reihe.appendChild(b);
      });
      c.appendChild(reihe);
    }
    w.appendChild(c);
  });

  /* Vorgaben für neue Tickets: der Normalmodus, den jedes Ticket ohne Anfassen läuft */
  var vc = el('div', 'card einst');
  var vk = el('div', 'einst-kopf');
  vk.appendChild(el('b', 'einst-titel', 'Vorgaben für neue Tickets'));
  vk.appendChild(el('span', 'spacer'));
  vk.appendChild(el('span', 'einst-hilfe', 'Gilt, solange am Ticket nichts anderes gewählt wird.'));
  vc.appendChild(vk);
  if (!Ordner.verbunden()) {
    vc.appendChild(el('p', 'einst-hilfe', 'Ordner verbinden, um Vorgaben zu ändern.'));
  } else {
    function vorgabeReihe(label, key, liste) {
      var g = el('div', 'wahl');
      g.appendChild(el('div', 'wahl-label', label));
      var reihe = el('div', 'wahl-reihe');
      liste.forEach(function (v) {
        var b = el('button', 'wahl-knopf' + (vorgaben[key] === v ? ' is-on' : ''), v);
        b.onclick = function () { vorgaben[key] = v; vorgabenSichern(); zeichne(); };
        reihe.appendChild(b);
      });
      g.appendChild(reihe);
      return g;
    }
    vc.appendChild(vorgabeReihe('Isolation', 'isolation', ['Branch', 'Snapshot']));
    vc.appendChild(vorgabeReihe('Autonomie', 'autonomie', ['selbst', 'vorFragen']));
    vc.appendChild(vorgabeReihe('Gründlichkeit', 'vorgabeGruendlich', GRUENDL));
    vc.appendChild(vorgabeReihe('Modell', 'vorgabeModell', MODELL));
    vc.appendChild(vorgabeReihe('Aufwand', 'vorgabeAufwand', AUFWAND));
    var ds = el('div', 'wahl');
    ds.appendChild(el('div', 'wahl-label', 'Duell ab Stufe'));
    ds.appendChild(schieberegler('', 4, 7, 1, parseInt(vorgaben.duellAbStufe, 10) || 6,
      function (v) { return String(v); },
      function (v) { vorgaben.duellAbStufe = String(v); vorgabenSichern(); }));
    vc.appendChild(ds);
    var reset = el('button', 'btn', 'Vorgaben auf Standard zurücksetzen');
    reset.onclick = function () { vorgaben = Object.assign({}, VORGABEN_STANDARD); vorgabenSichern(); zeichne(); };
    vc.appendChild(reset);
  }
  w.appendChild(vc);

  var fuss = el('div', 'card einst');
  fuss.appendChild(el('p', 'einst-hilfe', 'Design und Schriftgrösse werden auf diesem Rechner gemerkt.'));
  var zur = el('button', 'btn', 'Design auf Standard zurücksetzen');
  zur.onclick = function () { konf = { design: 7, skala: 1 }; konfSichern(); konfAnwenden(); zeichne(); };
  fuss.appendChild(zur);
  if (Ordner.verbunden()) {
    var trennen = el('button', 'btn ghost', 'Ordner trennen');
    trennen.onclick = function () { Ordner.verbindungTrennen().then(function () { verbindung.status = 'nicht-verbunden'; zeichne(); }); };
    fuss.appendChild(trennen);
  }
  w.appendChild(fuss);
  return w;
}

/* ---------- Schreibleiste: neues Ticket, schreibt beim Anlegen sofort in die Datei ---------- */
function schreiben() {
  var c = el('div', 'card compose' + (st.offen ? ' is-open' : ''));
  if (!st.offen) {
    var zeile = el('button', 'compose-zu');
    zeile.appendChild(el('span', 'plus', '+'));
    zeile.appendChild(el('span', 'plus-text', 'Neues Ticket erstellen'));
    zeile.onclick = function () { st.offen = true; zeichne(); };
    c.appendChild(zeile);
    return c;
  }
  var namen = ['Beschreiben', 'Einstufen', 'Beruf & Vorgaben'];
  var kopfz = el('div', 'schritt-kopf');
  namen.forEach(function (name, i) {
    var n = i + 1;
    var s = el('button', 'schritt' + (n === st.schritt ? ' is-on' : '') + (n < st.schritt ? ' is-fertig' : ''));
    s.appendChild(el('span', 'schritt-nr', n < st.schritt ? '✓' : String(n)));
    s.appendChild(el('span', null, name));
    s.onclick = function (ev) { ev.stopPropagation(); if (n < st.schritt) { st.schritt = n; zeichne(); } };
    kopfz.appendChild(s);
  });
  c.appendChild(kopfz);

  function fussZeile(zurueck, text, tun) {
    var f = el('div', 'compose-fuss');
    var ab = el('button', 'btn ghost', zurueck ? 'Zurück' : 'Abbrechen');
    ab.onclick = function (ev) {
      ev.stopPropagation();
      if (zurueck) st.schritt--; else { st.offen = false; st.schritt = 1; st.anhaenge = []; st.text = ''; }
      zeichne();
    };
    f.appendChild(ab);
    f.appendChild(el('span', 'spacer'));
    var w = el('button', 'btn primary', text);
    w.onclick = function (ev) { ev.stopPropagation(); tun(w); };
    f.appendChild(w);
    return f;
  }
  function wahlGruppe(label, liste, key) {
    var g = el('div', 'wahl');
    g.appendChild(el('div', 'wahl-label', label));
    var reihe = el('div', 'wahl-reihe');
    liste.forEach(function (v, i) {
      var b = el('button', 'wahl-knopf' + (i === st.wahl[key] ? ' is-on' : ''), v);
      b.onclick = function (ev) { ev.stopPropagation(); st.wahl[key] = i; zeichne(); };
      reihe.appendChild(b);
    });
    g.appendChild(reihe);
    return g;
  }

  if (st.schritt === 1) {
    c.appendChild(el('h2', 'schreib-titel', 'Was ist los?'));
    var ta = el('textarea'); ta.rows = 6;
    ta.placeholder = 'Fehler, Idee, Wunsch. Einfach hinschreiben.';
    ta.value = st.text;
    ta.oninput = function () { st.text = ta.value; };
    bilder(ta, st.anhaenge);
    c.appendChild(ta);
    var ea = anhangGrid(st.anhaenge);
    if (ea) c.appendChild(ea);
    var hz = el('div', 'anhang-hilfe-zeile');
    hz.appendChild(el('p', 'schreib-hilfe', 'Screenshots hier hineinziehen oder mit Strg+V einfügen, beliebig viele auf einmal.'));
    hz.appendChild(bilderKnopf(st.anhaenge));
    c.appendChild(hz);
    c.appendChild(fussZeile(false, 'Weiter', function () {
      if (!(st.text || '').trim()) { st.hinweis = 'Erst kurz schreiben, was los ist.'; zeichne(); return; }
      st.hinweis = ''; st.schritt = 2; zeichne();
    }));
    setTimeout(function () { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }, 0);
    return c;
  }

  if (st.schritt === 2) {
    c.appendChild(el('h2', 'schreib-titel', 'Wie soll das laufen?'));
    c.appendChild(wahlGruppe('Wie dringend', DRINGEND, 'dring'));
    c.appendChild(wahlGruppe('Wie gründlich', GRUENDL, 'grund'));
    c.appendChild(schieberegler('Timer', 0, 90, 5, st.wahl.timerMin,
      function (v) { return v === 0 ? 'kein Zeitdruck' : v + ' Min'; },
      function (v) { st.wahl.timerMin = v; }));
    c.appendChild(el('div', 'rechnung', rechnung()));
    c.appendChild(fussZeile(true, 'Weiter', function () { st.schritt = 3; zeichne(); }));
    return c;
  }

  /* Schritt 3: Beruf, plus alles andere immer sichtbar, kein Wegklappen mehr */
  c.appendChild(el('h2', 'schreib-titel', 'Wer soll das machen?'));
  c.appendChild(el('p', 'schreib-hilfe', 'Nichts anhaken ist auch gut, dann läuft der normale Weg. Höchstens zwei.'));
  var grid = el('div', 'beruf-grid');
  BERUFE.forEach(function (name, i) {
    var an = st.berufe.indexOf(i) > -1;
    var b = el('button', 'beruf' + (an ? ' is-on' : ''));
    b.appendChild(el('span', 'haken', an ? '✓' : ''));
    b.appendChild(el('span', 'beruf-name', name));
    b.onclick = function (ev) {
      ev.stopPropagation();
      var p = st.berufe.indexOf(i);
      if (p > -1) { st.berufe.splice(p, 1); st.hinweis = ''; }
      else if (st.berufe.length >= 2) { st.hinweis = 'Höchstens zwei. Bei mehr widersprechen sich die Berichte.'; }
      else { st.berufe.push(i); st.hinweis = ''; }
      zeichne();
    };
    grid.appendChild(b);
  });
  c.appendChild(grid);
  if (st.hinweis) c.appendChild(el('p', 'hinweis', st.hinweis));

  var r2 = el('div', 'chips chips-mehr');
  r2.appendChild(chip('Modell', MODELL, 'modell'));
  r2.appendChild(chip('Aufwand', AUFWAND, 'aufwand'));
  r2.appendChild(chip('Isolation', ISOLATION, 'iso'));
  r2.appendChild(chip('Freigabe', FREIGABE, 'frei'));
  c.appendChild(r2);
  var reset = el('button', 'mehr', 'Alles auf automatisch');
  reset.onclick = function (ev) {
    ev.stopPropagation();
    st.wahl.dring = 1; st.wahl.grund = 0; st.wahl.timerMin = 0;
    st.wahl.modell = 0; st.wahl.aufwand = 0; st.wahl.iso = 0; st.wahl.frei = 0; st.berufe = [];
    zeichne();
  };
  c.appendChild(reset);
  c.appendChild(el('div', 'rechnung', rechnung()));

  if (!Ordner.verbunden()) {
    c.appendChild(el('p', 'hinweis', 'Kein Ordner verbunden — dieses Ticket kann noch nicht angelegt werden.'));
    c.appendChild(fussZeile(true, 'Ticket anlegen', function () {}));
    return c;
  }

  c.appendChild(fussZeile(true, 'Ticket anlegen', function (knopf) { ticketAnlegen(knopf); }));
  return c;
}

/* Schreibt sofort .tickets/T-00NN.md, keine Zwischenablage mehr */
function ticketAnlegen(knopf) {
  var alt = knopf.textContent;
  knopf.disabled = true; knopf.textContent = 'wird angelegt…';
  /* Freie Nummer suchen statt blind hochzählen. Claude zählt denselben Zähler hoch, und
     schreibeDatei würde eine bestehende Ticket-Datei stillschweigend überschreiben. Also
     erst prüfen, ob T-00NN.md schon da ist, und notfalls weiterzählen. */
  function freieNummer(nr, versuche) {
    if (versuche > 50) return Promise.reject(new Error('keine freie Ticketnummer gefunden'));
    return Ordner.leseDatei(ticketPfad(nr)).then(function (vorhanden) {
      return vorhanden == null ? nr : freieNummer(nr + 1, versuche + 1);
    });
  }
  Ordner.leseDatei('.state/zaehler.txt').then(function (roh) {
    return freieNummer((parseInt(String(roh || '0').trim(), 10) || 0) + 1, 0);
  }).then(function (nr) {
    return Ordner.schreibeDatei('.state/zaehler.txt', String(nr)).then(function () { return nr; });
  }).then(function (nr) {
    return speichereAnhaenge(nr, 'anhang', st.anhaenge).then(function (pfade) { return { nr: nr, pfade: pfade }; });
  }).then(function (r) {
    var erste = (st.text || '').trim().split('\n')[0];
    var titel = erste.length > 70 ? erste.slice(0, 69) + '…' : erste;
    var kopf = {
      nr: r.nr, titel: titel || 'Ohne Titel', zustand: 'offen',
      angelegt: new Date().toISOString(),
      dringend: DRINGEND[st.wahl.dring], gruendlich: GRUENDL[st.wahl.grund],
      beruf: st.berufe.map(function (i) { return BERUFE[i]; }).join(', '),
      timer: st.wahl.timerMin || 0,
      modell: MODELL[st.wahl.modell], aufwand: AUFWAND[st.wahl.aufwand],
      isolation: ISOLATION[st.wahl.iso], freigabe: FREIGABE[st.wahl.frei],
      anhaenge: r.pfade
    };
    var koerper = "Worum geht's: " + (st.text || '').trim();
    return Ordner.schreibeDatei(ticketPfad(r.nr), Ticketdatei.stringify(kopf, koerper));
  }).then(function () {
    knopf.textContent = 'angelegt';
    setTimeout(function () {
      st.offen = false; st.schritt = 1; st.text = ''; st.anhaenge = []; st.berufe = []; st.hinweis = '';
      st.wahl.dring = 1; st.wahl.grund = 0; st.wahl.timerMin = 0;
      st.wahl.modell = 0; st.wahl.aufwand = 0; st.wahl.iso = 0; st.wahl.frei = 0;
      ordnerLesen(true); zeichne();
    }, 500);
  }).catch(function (e) {
    knopf.disabled = false; knopf.textContent = 'Fehler, nochmal?';
    st.hinweis = 'Anlegen fehlgeschlagen: ' + (e && e.message ? e.message : 'unbekannter Fehler');
    setTimeout(function () { knopf.textContent = alt; }, 2600);
    zeichne();
  });
}

/* ---------- Fortschrittsblock, in Kachel und Detail gleich ---------- */
function fortschritt(t) {
  var fz = el('div', 'fortschritt');
  var p = prozent(t);
  if (p !== null) {
    var bar = el('div', 'bar'); var sp = el('span'); sp.style.width = p + '%';
    sp.dataset.bar = t.nr; bar.appendChild(sp); fz.appendChild(bar);
  }
  var meta = el('div', 'tb-meta'); meta.dataset.meta = t.nr;
  meta.appendChild(el('span', 'pct', p !== null ? p + ' %' : (t.fortschritt || 'läuft')));
  meta.appendChild(el('span', 'spacer'));
  meta.appendChild(el('span', 'zeit', t.begonnen ? 'läuft ' + minutenSeit(t.begonnen) + ' min' : ''));
  meta.appendChild(el('span', t.frist ? 'zeit frist' : 'zeit', restText(t)));
  fz.appendChild(meta);
  return fz;
}
function straenge(t) {
  var s = el('div', 'strands');
  (t.straenge || []).forEach(function (x) {
    var p = Math.max(0, Math.min(100, Number(x.p) || 0));
    var one = el('div', 'strand');
    one.appendChild(el('span', null, x.n || 'Strang'));
    var b = el('div', 'bar' + (p >= 100 ? ' done' : '')); var sp = el('span');
    sp.style.width = p + '%';
    b.appendChild(sp); one.appendChild(b); s.appendChild(one);
  });
  return s;
}

/* ---------- Eine Kachel ---------- */
function block(t) {
  var d = el('div', 'tblock z-' + t.zustand);
  d.style.setProperty('--tc', farbe(t.nr));

  var k = el('div', 'tb-kopf');
  k.appendChild(el('span', 'tid', 'T-' + t.nr));
  k.appendChild(el('b', null, t.titel));
  k.appendChild(el('span', 'tag' + (t.zustand === 'wartet' ? ' wait' : (t.straenge ? ' hot' : '')), t.stufe || '–'));
  d.appendChild(k);

  if (t.zustand === 'offen') {
    d.appendChild(el('p', 'tb-zeile', 'Wartet, bis Claude anfängt'));
  } else if (t.zustand === 'frage') {
    d.appendChild(el('p', 'tb-zeile', 'Wartet auf deine Antwort'));
  } else if (t.zustand === 'review') {
    d.appendChild(el('p', 'tb-zeile', t.neu || 'Fertig, schau drüber'));
    var vz = el('div', 'tb-meta');
    vz.appendChild(el('span', 'pct', 'fertig'));
    vz.appendChild(el('span', 'spacer'));
    vz.appendChild(el('span', 'zeit', t.dauer || ''));
    d.appendChild(vz);
  } else if (t.zustand === 'wartet') {
    d.appendChild(el('p', 'tb-zeile', 'Wartet auf ' + (t.wartetAuf || 'ein anderes Ticket') + (t.grund ? ' · ' + t.grund : '')));
  } else {
    d.appendChild(el('p', 'schritt-zeile', t.schritt || 'läuft'));
    var fz = fortschritt(t);
    if (t.straenge && t.straenge.length) fz.appendChild(straenge(t));
    d.appendChild(fz);
  }
  d.onclick = function () { st.ticket = t.nr; detailZuruecksetzen(); zeichne(); };
  return d;
}

/* ---------- Ebene 1: Übersicht ---------- */
function uebersicht() {
  var w = el('div', 'views');
  w.appendChild(schreiben());
  if (st.offen) { w.className = 'views nur-schreiben'; return w; }

  var neu = ticketDaten.tickets.filter(function (t) { return t.zustand === 'offen'; });
  var warte = ticketDaten.tickets.filter(function (t) { return t.zustand === 'frage'; });
  var review = ticketDaten.tickets.filter(function (t) { return t.zustand === 'review'; });
  /* Alles andere landet unter In Arbeit, auch ein unbekannter Zustand.
     Ein Ticket darf nie stillschweigend verschwinden. */
  var laeuft = ticketDaten.tickets.filter(function (t) { return t.zustand !== 'frage' && t.zustand !== 'review' && t.zustand !== 'offen'; });

  if (verbindung.status !== 'verbunden' && verbindung.status !== 'nicht-unterstuetzt' && !ticketDaten.tickets.length && !ticketDaten.fertig.length) {
    var wk = el('div', 'card einst');
    wk.appendChild(el('b', 'einst-titel', 'Noch nicht verbunden'));
    wk.appendChild(el('p', 'einst-hilfe', 'Verbinde oben den TICKETSYSTEM-Ordner, um Tickets zu sehen und anzulegen.'));
    w.appendChild(wk);
    return w;
  }
  if (!ticketDaten.tickets.length && !ticketDaten.fertig.length) {
    w.appendChild(el('p', 'leer', 'Noch nichts hier. Oben ein Ticket anlegen, oder in 1-EINGANG.md schreiben.'));
    return w;
  }

  function raster(liste, ton) {
    var g = el('div', 'tliste ton-' + ton);
    liste.forEach(function (t) { g.appendChild(block(t)); });
    return g;
  }
  if (warte.length) { w.appendChild(el('h2', 'gruppe warn gr-fragen', 'Fragen an dich · ' + warte.length)); w.appendChild(raster(warte, 'fragen')); }
  if (review.length) { w.appendChild(el('h2', 'gruppe warn gr-review', 'Review, fertig zur Abnahme · ' + review.length)); w.appendChild(raster(review, 'review')); }
  if (neu.length) { w.appendChild(el('h2', 'gruppe gr-neu', 'Neu, wartet auf Claude · ' + neu.length)); w.appendChild(raster(neu, 'neu')); }
  if (laeuft.length) { w.appendChild(el('h2', 'gruppe gr-arbeit', 'In Arbeit · ' + laeuft.length)); w.appendChild(raster(laeuft, 'arbeit')); }
  if (!warte.length && !review.length && !neu.length && !laeuft.length) w.appendChild(el('p', 'leer', 'Alles erledigt. Oben ein neues Ticket anlegen.'));

  if (ticketDaten.fertig.length) {
    var h = el('button', 'gruppe klapp gr-archiv', (st.fertigAuf ? '▾' : '▸') + ' Archiv · ' + ticketDaten.fertig.length);
    h.onclick = function () { st.fertigAuf = !st.fertigAuf; zeichne(); };
    w.appendChild(h);
    if (st.fertigAuf) {
      var l = el('div', 'card arch');
      var such = el('input', 'archiv-suche'); such.placeholder = 'Archiv durchsuchen…'; such.value = st.archivSuche;
      such.oninput = function () { st.archivSuche = such.value; zeichne(); };
      l.appendChild(such);
      var suche = st.archivSuche.trim().toLowerCase();
      var treffer = ticketDaten.fertig.filter(function (f) {
        return !suche || String(f.nr).indexOf(suche) > -1 || (f.titel || '').toLowerCase().indexOf(suche) > -1;
      });
      treffer.forEach(function (f) {
        var r = el('div', 'arow');
        r.appendChild(el('span', 'tid', 'T-' + f.nr));
        r.appendChild(el('span', null, f.titel));
        r.appendChild(el('span', 'spacer'));
        r.appendChild(el('span', 'zeit', (f.zustand === 'verworfen' ? 'verworfen' : 'erledigt') + (f.abgeschlossen ? ' · ' + minutenSeit(f.abgeschlossen) + ' min her' : '')));
        r.onclick = function () { st.ticket = f.nr; detailZuruecksetzen(); zeichne(); };
        l.appendChild(r);
      });
      if (!treffer.length) l.appendChild(el('p', 'leer', 'Nichts gefunden.'));
      w.appendChild(l);
    }
  }
  return w;
}

/* Lazy: eine im Kopf genannte Datei erst laden, wenn man sie aufklappt */
function dateienAbschnitt(namenListe) {
  var w = el('div', 'dateien-abschnitt');
  var kn = el('button', 'mehr', '▸ ' + namenListe.length + ' geänderte ' + (namenListe.length === 1 ? 'Datei' : 'Dateien') + ' ansehen');
  var inhalt = el('div', 'dateien-inhalt'); inhalt.style.display = 'none';
  var geladen = false;
  kn.onclick = function (ev) {
    ev.stopPropagation();
    var auf = inhalt.style.display === 'none';
    inhalt.style.display = auf ? '' : 'none';
    kn.textContent = (auf ? '▾ ' : '▸ ') + namenListe.length + ' geänderte ' + (namenListe.length === 1 ? 'Datei' : 'Dateien') + ' ansehen';
    if (auf && !geladen && Ordner.verbunden()) {
      geladen = true;
      namenListe.forEach(function (pfad) {
        Ordner.leseDatei(pfad).then(function (text) { inhalt.appendChild(Anzeigen.dateiAnsicht(pfad, text)); });
      });
    } else if (auf && !Ordner.verbunden()) {
      inhalt.appendChild(el('p', 'leer', 'Ordner nicht verbunden, Inhalt kann nicht gelesen werden.'));
    }
  };
  w.appendChild(kn); w.appendChild(inhalt);
  return w;
}

/* Angehängte Bilder als Bilder zeigen, nicht als Text. Ein PNG durch die Datei-Ansicht
   zu jagen ergäbe nur Zeichensalat. Nicht-Bilder landen weiter in der Datei-Ansicht. */
function istBild(pfad) { return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(pfad); }

function bilderAbschnitt(pfade) {
  var w = el('div', 'dateien-abschnitt');
  var kn = el('button', 'mehr', '▸ ' + pfade.length + (pfade.length === 1 ? ' Bild' : ' Bilder') + ' ansehen');
  var inhalt = el('div', 'anhang-grid'); inhalt.style.display = 'none';
  var geladen = false;
  kn.onclick = function (ev) {
    ev.stopPropagation();
    var auf = inhalt.style.display === 'none';
    inhalt.style.display = auf ? '' : 'none';
    kn.textContent = (auf ? '▾ ' : '▸ ') + pfade.length + (pfade.length === 1 ? ' Bild' : ' Bilder') + ' ansehen';
    if (!auf || geladen) return;
    geladen = true;
    if (!Ordner.verbunden()) {
      inhalt.appendChild(el('p', 'leer', 'Ordner nicht verbunden, Bilder können nicht gelesen werden.'));
      return;
    }
    pfade.forEach(function (pfad) {
      Ordner.leseBildUrl(pfad).then(function (url) {
        var k = el('div', 'anhang-kachel');
        k.title = pfad;
        if (url) {
          var bild = document.createElement('img');
          bild.src = url; bild.alt = pfad;
          k.appendChild(bild);
        } else {
          k.appendChild(el('span', 'anhang-fehlt', '?'));
          k.title = pfad + ' — Datei nicht gefunden';
        }
        inhalt.appendChild(k);
      });
    });
  };
  w.appendChild(kn); w.appendChild(inhalt);
  return w;
}

/* Was beim Anlegen gewählt wurde, bleibt am Ticket sichtbar. "automatisch" wird
   weggelassen, sonst steht überall dasselbe Wort und man sieht das Besondere nicht. */
function gewaehltZeile(t) {
  var teile = [];
  function nimm(label, wert) {
    if (!wert && wert !== 0) return;
    var s = String(wert).trim();
    if (!s || s === 'automatisch' || s === '0') return;
    teile.push(label + ': ' + s);
  }
  nimm('Dringlichkeit', t.dringend);
  nimm('Gründlichkeit', t.gruendlich);
  nimm('Beruf', t.beruf);
  if (t.timer && String(t.timer) !== '0') teile.push('Timer: ' + t.timer + ' Min');
  nimm('Isolation', t.isolation);
  nimm('Freigabe', t.freigabe);
  if (!teile.length) return null;
  var d = el('div', 'gewaehlt');
  d.appendChild(el('span', 'gewaehlt-label', 'Gewählt'));
  teile.forEach(function (s) { d.appendChild(el('span', 'gewaehlt-wert', s)); });
  return d;
}

/* ---------- Ebene 2: ein Ticket ---------- */
function detail() {
  var t = findT(st.ticket);
  var w = el('div', 'views');
  if (!t) { w.appendChild(el('p', 'leer', 'Dieses Ticket gibt es hier nicht mehr.')); return w; }
  var c = el('div', 'card ticket z-' + t.zustand);
  c.style.setProperty('--tc', farbe(t.nr));

  var k = el('div', 'tb-kopf');
  k.appendChild(el('span', 'tid', 'T-' + t.nr));
  k.appendChild(el('b', null, t.titel));
  k.appendChild(el('span', 'tag', t.stufe || '–'));
  c.appendChild(k);
  if (t._kaputt) c.appendChild(el('p', 'hinweis', 'Der Kopf dieser Ticket-Datei ist beschädigt. Angezeigt wird, was lesbar war.'));

  if (t.zustand === 'offen') {
    c.appendChild(el('p', 'q-what', 'Angelegt, wartet noch darauf, dass Claude anfängt.'));
    var ob = el('div', 'btns');
    ob.appendChild(befehlKnopf('Vordrängeln', { befehl: 'nur', nr: t.nr }, 'primary'));
    ob.appendChild(befehlKnopf('Verwerfen', { befehl: 'verwerfen', nr: t.nr }));
    c.appendChild(ob);

  } else if (t.zustand === 'frage') {
    c.appendChild(el('p', 'q-what', t.frage || 'Claude braucht eine Antwort.'));
    var ta = el('textarea', 'q-answer'); ta.rows = 3;
    ta.placeholder = 'Antworten, oder Bilder einfügen';
    ta.value = st.frageText;
    ta.oninput = function () { st.frageText = ta.value; };
    bilder(ta, st.frageAnhaenge);
    c.appendChild(ta);
    var af = anhangGrid(st.frageAnhaenge);
    if (af) c.appendChild(af);
    c.appendChild(bilderKnopf(st.frageAnhaenge));

    var qb = el('div', 'btns');
    qb.appendChild(befehlKnopf('Ja', { befehl: 'antwort', nr: t.nr, text: 'ja' }));
    qb.appendChild(befehlKnopf('Nein', { befehl: 'antwort', nr: t.nr, text: 'nein' }));
    qb.appendChild(befehlKnopf('Warum?', { befehl: 'warum', nr: t.nr }));
    qb.appendChild(el('span', 'spacer'));
    var senden = el('button', 'btn primary', 'Antwort senden');
    senden.onclick = function (ev) {
      ev.stopPropagation();
      var txt = (st.frageText || '').trim();
      speichereAnhaenge(t.nr, 'antwort', st.frageAnhaenge).then(function (pfade) {
        befehlAusloesen({ befehl: 'antwort', nr: t.nr, text: txt, anhaenge: pfade }, senden);
        st.frageText = ''; st.frageAnhaenge = [];
      });
    };
    qb.appendChild(senden);
    c.appendChild(qb);

  } else if (t.zustand === 'review') {
    c.appendChild(el('p', 'rev-satz', t.neu || 'Fertig zur Abnahme.'));
    var vor = el('div', 'rev-preview');
    vor.appendChild(el('span', 'rev-art', t.art || 'Ergebnis'));
    vor.appendChild(el('span', 'rev-hint', 'Das fertige Ergebnis, direkt hier'));
    c.appendChild(vor);

    var sp2 = el('div', 'rev-spalten');
    var li = el('div', 'rev-spalte');
    li.appendChild(el('div', 'rev-label', 'Was gemacht wurde'));
    var ul = el('ul', 'rev-liste');
    (Array.isArray(t.punkte) ? t.punkte : []).forEach(function (p) { ul.appendChild(el('li', null, p)); });
    li.appendChild(ul);
    sp2.appendChild(li);
    var re = el('div', 'rev-spalte');
    re.appendChild(el('div', 'rev-label', 'Schau dir das an'));
    re.appendChild(el('p', 'rev-pruefen', t.pruefen || 'Schau, ob es so passt.'));
    re.appendChild(el('div', 'rev-fakten', [t.dauer].filter(Boolean).join(' · ')));
    sp2.appendChild(re);
    c.appendChild(sp2);
    if (t.dateien) c.appendChild(dateienAbschnitt(String(t.dateien).split(',').map(function (s) { return s.trim(); }).filter(Boolean)));

    var rb = el('div', 'btns');
    rb.appendChild(befehlKnopf('Abschliessen', { befehl: 'abschliessen', nr: t.nr }, 'ok'));
    var nbKnopf = el('button', 'btn' + (st.nachbesserOffen ? ' primary' : ''), st.nachbesserOffen ? 'Nachbessern schliessen' : 'Nachbessern');
    nbKnopf.onclick = function () { st.nachbesserOffen = !st.nachbesserOffen; zeichne(); };
    rb.appendChild(nbKnopf);
    rb.appendChild(befehlKnopf('Verwerfen', { befehl: 'verwerfen', nr: t.nr }));
    rb.appendChild(el('span', 'spacer'));
    if (t.ideen) rb.appendChild(el('span', 'ideas', 'Nebenideen: ' + t.ideen + ' zum Anhaken'));
    c.appendChild(rb);

    if (st.nachbesserOffen) {
      var nb = el('div', 'nachbesser');
      nb.appendChild(el('div', 'wahl-label', 'Was soll noch angepasst werden?'));
      var nta = el('textarea', 'q-answer'); nta.rows = 4;
      nta.placeholder = 'Beschreiben, oder Bilder einfügen';
      nta.value = st.nachbesserText;
      nta.oninput = function () { st.nachbesserText = nta.value; };
      bilder(nta, st.nachbesserAnhaenge);
      nb.appendChild(nta);
      var na = anhangGrid(st.nachbesserAnhaenge);
      if (na) nb.appendChild(na);
      nb.appendChild(bilderKnopf(st.nachbesserAnhaenge));

      var nf = el('div', 'btns');
      var nab = el('button', 'btn ghost', 'Abbrechen');
      nab.onclick = function () { st.nachbesserOffen = false; st.nachbesserText = ''; st.nachbesserAnhaenge = []; zeichne(); };
      nf.appendChild(nab);
      nf.appendChild(el('span', 'spacer'));
      var nsend = el('button', 'btn primary', 'Nachbesserung senden');
      nsend.onclick = function (ev) {
        ev.stopPropagation();
        var txt = (st.nachbesserText || '').trim();
        speichereAnhaenge(t.nr, 'nachbessern', st.nachbesserAnhaenge).then(function (pfade) {
          befehlAusloesen({ befehl: 'nachbessern', nr: t.nr, text: txt, anhaenge: pfade }, nsend);
          st.nachbesserText = ''; st.nachbesserAnhaenge = [];
        });
      };
      nf.appendChild(nsend);
      nb.appendChild(nf);
      c.appendChild(nb);
    }

  } else if (t.zustand === 'wartet') {
    c.appendChild(el('p', 'q-what', 'Wartet auf ' + (t.wartetAuf || 'ein anderes Ticket') + (t.grund ? ', weil ' + t.grund : '') + '. Startet von selbst, sobald frei.'));
    var wb = el('div', 'btns');
    wb.appendChild(befehlKnopf('Vordrängeln', { befehl: 'nur', nr: t.nr }, 'primary'));
    c.appendChild(wb);

  } else {
    c.appendChild(el('p', 'schritt-zeile', t.schritt || 'läuft'));
    c.appendChild(fortschritt(t));
    if (t.straenge && t.straenge.length) c.appendChild(straenge(t));

    var lv = el('div', 'live');
    var lk = el('div', 'live-kopf');
    lk.appendChild(el('span', 'live-punkt'));
    lk.appendChild(el('span', 'live-label', 'Läuft gerade'));
    var stufeNr = parseInt((String(t.stufe || '').match(/\d+/) || [4])[0], 10);
    var auto = modellFuer(stufeNr);
    lk.appendChild(el('span', 'tag', (t.modell && t.modell !== 'automatisch' ? t.modell : auto.m) + ' · ' + (t.aufwand && t.aufwand !== 'automatisch' ? t.aufwand : auto.a)));
    lk.appendChild(el('span', 'spacer'));
    lk.appendChild(el('span', 'zeit', t.schritt || ''));
    lv.appendChild(lk);
    lv.appendChild(el('div', 'live-flaeche', 'Der aktuelle Stand erscheint hier, während gearbeitet wird'));
    c.appendChild(lv);

    var ab = el('div', 'btns');
    var an = el('button', 'btn' + (st.anpassen ? ' primary' : ''), st.anpassen ? 'fertig' : 'Anpassen');
    an.onclick = function (ev) { ev.stopPropagation(); st.anpassen = !st.anpassen; zeichne(); };
    ab.appendChild(an);
    ab.appendChild(befehlKnopf('warum diese Stufe?', { befehl: 'warum', nr: t.nr }));
    ab.appendChild(befehlKnopf('Pause', { befehl: 'pause', nr: t.nr }));
    ab.appendChild(befehlKnopf('Stop', { befehl: 'stop', nr: t.nr }, 'stop'));
    c.appendChild(ab);

    if (st.anpassen) {
      var p = el('div', 'anpassen');
      p.appendChild(schieberegler('Stufe', 0, 7, 1, st.wahl.stufeUeb,
        function (v) { return v === 0 ? 'automatisch' : String(v); },
        function (v) { st.wahl.stufeUeb = v; }));
      p.appendChild(schieberegler('Timer', 0, 90, 5, st.wahl.timerMin,
        function (v) { return v === 0 ? 'kein Zeitdruck' : v + ' Min'; },
        function (v) { st.wahl.timerMin = v; }));
      var ch = el('div', 'chips');
      ch.appendChild(chip('Modell', MODELL, 'modell'));
      ch.appendChild(chip('Aufwand', AUFWAND, 'aufwand'));
      ch.appendChild(chip('Isolation', ISOLATION, 'iso'));
      p.appendChild(ch);
      p.appendChild(el('div', 'rechnung', rechnung()));
      var uebernehmen = el('button', 'btn primary', 'Übernehmen');
      uebernehmen.onclick = function (ev) {
        ev.stopPropagation();
        var befehl = { befehl: 'anpassen', nr: t.nr };
        if (st.wahl.stufeUeb > 0) befehl.stufe = st.wahl.stufeUeb;
        if (st.wahl.timerMin > 0) befehl.timerMin = st.wahl.timerMin;
        if (st.wahl.modell > 0) befehl.modell = MODELL[st.wahl.modell];
        if (st.wahl.aufwand > 0) befehl.aufwand = AUFWAND[st.wahl.aufwand];
        if (st.wahl.iso > 0) befehl.isolation = ISOLATION[st.wahl.iso];
        befehlAusloesen(befehl, uebernehmen);
      };
      p.appendChild(uebernehmen);

      var dz = el('div', 'duell-zeile');
      dz.appendChild(schieberegler('Duell-Stränge', 2, 5, 1, st.wahl.straenge, function (v) { return String(v); }, function (v) { st.wahl.straenge = v; }));
      var starten = el('button', 'btn', 'Duell starten');
      starten.onclick = function (ev) { ev.stopPropagation(); befehlAusloesen({ befehl: 'duell', nr: t.nr, straenge: st.wahl.straenge || 3 }, starten); };
      dz.appendChild(starten);
      p.appendChild(dz);
      c.appendChild(p);
    }
  }

  /* Verlauf, Fakten, alles was Claude in den Freitext geschrieben hat — als Markdown,
     nicht als Rohtext. Immer da, ausklappbar, egal in welchem Zustand das Ticket ist. */
  if (t._koerper && t._koerper.trim()) {
    var vAuf = false;
    var vKnopf = el('button', 'mehr', '▸ Verlauf & Notizen');
    var vInhalt = Anzeigen.zeichneMarkdown(t._koerper);
    vInhalt.style.display = 'none';
    vKnopf.onclick = function (ev) {
      ev.stopPropagation(); vAuf = !vAuf;
      vInhalt.style.display = vAuf ? '' : 'none';
      vKnopf.textContent = (vAuf ? '▾' : '▸') + ' Verlauf & Notizen';
    };
    c.appendChild(vKnopf); c.appendChild(vInhalt);
  }
  if (Array.isArray(t.anhaenge) && t.anhaenge.length) {
    var bildPfade = t.anhaenge.filter(istBild);
    var restPfade = t.anhaenge.filter(function (p) { return !istBild(p); });
    if (bildPfade.length) c.appendChild(bilderAbschnitt(bildPfade));
    if (restPfade.length) c.appendChild(dateienAbschnitt(restPfade));
  }
  var gz = gewaehltZeile(t);
  if (gz) c.appendChild(gz);

  w.appendChild(c);
  return w;
}

/* ---------- Zeichnen ---------- */
function zeichne() {
  var app = el('div', 'app');
  app.appendChild(seite());
  var m = el('main', 'main');
  var band = verbindungBand();
  if (band) m.appendChild(band);
  m.appendChild(kopf());
  m.appendChild(st.einst ? einstellungen() : (st.ticket ? detail() : uebersicht()));
  app.appendChild(m);
  var w = document.getElementById('wurzel') || document.body;
  w.innerHTML = '';
  w.appendChild(app);
}

/* ---------- Leben: Balken bewegen sich ---------- */
function takt() {
  document.querySelectorAll('[data-meta]').forEach(function (m) {
    var t = findT(+m.dataset.meta); if (!t) return;
    var z = m.querySelectorAll('.zeit');
    if (z[0] && t.begonnen) z[0].textContent = 'läuft ' + minutenSeit(t.begonnen) + ' min';
    if (z[1] && t.frist) {
      var rest = Math.max(0, Math.round((new Date(t.frist) - Date.now()) / 1000));
      z[1].textContent = rest > 0 ? 'Frist ' + mmss(rest) : 'Frist abgelaufen';
    }
  });
}

function start() {
  konfLaden();
  konfAnwenden();
  zeichne();
  Ordner.stillVersuchen().then(function (r) {
    verbindung.status = r.status; verbindung.handle = r.handle || null;
    if (r.status === 'verbunden') {
      vorgabenLaden().then(function () { ordnerLesen(true); });
      setInterval(function () { ordnerLesen(false); }, 2000);
    } else {
      datenNachladenFallback(true);
      setInterval(function () { datenNachladenFallback(false); }, 5000);
    }
    zeichne();
  });
  setInterval(takt, 1000);
  document.addEventListener('click', function () {
    var o = document.querySelector('.chip-wrap.is-open');
    if (o) o.classList.remove('is-open');
  });
  document.addEventListener('keydown', function (e) {
    var tippt = document.activeElement && document.activeElement.tagName === 'TEXTAREA';
    if (e.key === 'Escape') { allesZu(); zeichne(); return; }
    if (tippt) return;
    if (e.key === 'd' || e.key === 'D') {
      konf.design = (konf.design + 1) % DESIGNS.length;
      konfSichern(); konfAnwenden(); zeichne();
    }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
})();

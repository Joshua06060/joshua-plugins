/* Ticketsystem-Dashboard
   Seitenleiste = Sessions, fest. Hauptfläche = Übersicht, ein Ticket oder Einstellungen.
   Zehn Designs, umschaltbar zur Laufzeit. Kein Netzzugriff, keine Abhängigkeiten. */
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
  { id: 'e10', name: 'Linear',    kurz: 'Blaugrau, ein Violett, streng' }
];

/* ---------- Modelle und Aufwand ----------
   Die Modelle von Claude Code. Kommt ein neues dazu, nur diese eine Liste ändern,
   dann steht es überall zur Auswahl: im Anlegen, am laufenden Ticket und als Standard. */
var MODELL  = ['automatisch', 'Haiku 4.5', 'Sonnet 5', 'Opus 5', 'Fable 5'];
/* Denkaufwand, wie in Claude Code benannt */
var AUFWAND = ['automatisch', 'low', 'medium', 'high', 'xhigh', 'max'];

/* Was "automatisch" je Stufe wählt. Steht hier, damit die Anzeige nicht rät. */
function modellFuer(stufe) {
  if (stufe <= 2) return { m: 'Haiku 4.5', a: 'low' };
  if (stufe <= 4) return { m: 'Sonnet 5', a: 'high' };
  if (stufe === 5) return { m: 'Opus 5', a: 'high' };
  if (stufe === 6) return { m: 'Opus 5', a: 'xhigh' };
  return { m: 'Opus 5', a: 'max' };
}

/* ---------- Einstellungen ---------- */
var EINST = [
  { key: 'design',   titel: 'Design',            art: 'design' },
  { key: 'skala',    titel: 'Schriftgrösse',     werte: ['100 %', '120 %', '140 %'],
    hilfe: 'Vergrössert alles, nicht nur die Schrift.' },
  { key: 'autonomie', titel: 'Autonomie',        werte: ['fragen', 'selbst entscheiden'],
    hilfe: 'Ob vor Erweiterungen wie neuen Werkzeugen gefragt wird.' },
  { key: 'maxWucht', titel: 'Höchste Wucht',     werte: ['Stufe 4', 'Stufe 5', 'Stufe 6', 'Stufe 7', '150 %'],
    hilfe: 'Deckel gegen versehentliche Grosseinsätze.' },
  { key: 'stdModell', titel: 'Standard-Modell',  werte: MODELL,
    hilfe: 'Gilt für alle neuen Tickets. Automatisch heisst: passend zur Stufe. Am einzelnen Ticket überschreibbar.' },
  { key: 'stdAufwand', titel: 'Standard-Aufwand', werte: AUFWAND,
    hilfe: 'Wie lange das Modell nachdenkt, von low bis max. Automatisch richtet sich nach der Stufe.' },
  { key: 'parallel', titel: 'Gleichzeitig',      werte: ['1 Ticket', '2 Tickets', '3 Tickets', '5 Tickets'],
    hilfe: 'Wie viele Tickets nebeneinander laufen dürfen.' },
  { key: 'isolation', titel: 'Isolation',        werte: ['automatisch', 'Branch', 'Snapshot'],
    hilfe: 'Wo gearbeitet wird, bevor du abnimmst.' },
  { key: 'hinweise', titel: 'Hinweise',          werte: ['an', 'aus'],
    hilfe: 'Meldung auf dem Bildschirm, wenn ein Review fertig ist.' },
  { key: 'chat',     titel: 'Chat-Meldungen',    werte: ['nur Wichtiges', 'alles', 'still'],
    hilfe: 'Wie viel nebenher im Chat gemeldet wird.' },
  { key: 'bewegung', titel: 'Bewegung',          werte: ['normal', 'reduziert'],
    hilfe: 'Schaltet Pulsieren und weiche Übergänge ab.' },
  { key: 'spalten',  titel: 'Kacheln je Reihe',  werte: ['automatisch', '2', '3', '4'],
    hilfe: 'Dichte der Übersicht.' },
  { key: 'archiv',   titel: 'Archiv behalten',   werte: ['7 Tage', '30 Tage', '90 Tage'],
    hilfe: 'Wann Erledigtes aus der Liste verschwindet.' }
];

var konf = { design: 7, skala: 1, autonomie: 1, maxWucht: 4, stdModell: 0, stdAufwand: 0,
             parallel: 2, isolation: 0, hinweise: 0, chat: 0, bewegung: 0, spalten: 0, archiv: 1 };

function konfLaden() {
  try {
    var roh = localStorage.getItem('ticketsystem-konf');
    if (roh) { var g = JSON.parse(roh); Object.keys(konf).forEach(function (k) { if (typeof g[k] === 'number') konf[k] = g[k]; }); }
  } catch (e) { /* ohne Speicher läuft es mit den Standardwerten weiter */ }
}
function konfSichern() {
  try { localStorage.setItem('ticketsystem-konf', JSON.stringify(konf)); } catch (e) {}
}
/* Design, Grösse, Bewegung und Dichte wirken direkt am Wurzelelement */
function konfAnwenden() {
  var h = document.documentElement;
  h.setAttribute('data-stil', DESIGNS[konf.design].id);
  h.setAttribute('data-bewegung', konf.bewegung === 1 ? 'reduziert' : 'normal');
  h.style.setProperty('--skala', [1, 1.2, 1.4][konf.skala]);
  h.style.setProperty('--spalten', konf.spalten === 0 ? 'repeat(auto-fill,minmax(252px,1fr))'
                                                      : 'repeat(' + [0, 2, 3, 4][konf.spalten] + ',1fr)');
}

/* ---------- Daten ---------- */
var sessions = [
  { id: 'justdont', name: 'JustDont', live: true, tickets: [
    { nr: 46, titel: 'Login-Test braucht Zugang', zustand: 'frage', stufe: 'Stufe 4',
      frage: 'Der Login-Test braucht einen API-Key, um sich am Testserver anzumelden. Wo liegt der?' },
    { nr: 38, titel: 'Ladebalken beim Start', zustand: 'review', stufe: 'Stufe 4', art: 'Oberfläche',
      neu: 'Der Balken läuft flüssig und springt nicht mehr auf 100 zurück.',
      punkte: ['Sprung auf 100 entfernt', 'Bewegung an die echte Ladezeit gekoppelt',
               'Bei Abbruch bleibt der Balken stehen statt zu verschwinden'],
      pruefen: 'Einmal laden und einmal mitten drin abbrechen.',
      dauer: '9 Min · 5 Agenten', dateien: '2 Dateien geändert', ideen: 4 },
    { nr: 41, titel: 'Fusszeile neu geordnet', zustand: 'review', stufe: 'Stufe 5 · Design', art: 'Entwurf',
      neu: 'Die Links stehen jetzt in drei Spalten statt in einer langen Reihe.',
      punkte: ['Drei Spalten statt einer Reihe', 'Kontakt nach oben gezogen',
               'Auf dem Handy klappen die Spalten untereinander'],
      pruefen: 'Ob die Reihenfolge der Spalten für dich stimmt.',
      dauer: '21 Min · 12 Agenten', dateien: '4 Dateien geändert', ideen: 2 },
    { nr: 44, titel: 'Design der Startseite neu', zustand: 'laeuft', stufe: 'Stufe 6 · Duell',
      pct: 62, seit: 12, rest: 7, schritt: 'Kreuzangriff, Strang B',
      straenge: [ { n: 'A · kleinster Eingriff', p: 100 }, { n: 'B · Ursache', p: 70 }, { n: 'C · Risiko zuerst', p: 45 } ] },
    { nr: 42, titel: 'Login-Knopf reagiert nicht', zustand: 'laeuft', stufe: 'Stufe 4',
      pct: 38, seit: 12, rest: 9, schritt: 'Prüfung, 2 Agenten' },
    { nr: 47, titel: 'Texte im Menü kürzen', zustand: 'laeuft', stufe: 'Stufe 2 · Timer',
      pct: 55, seit: 4, frist: 372, schritt: 'Umsetzung' },
    { nr: 45, titel: 'Schriftgrösse im Menü', zustand: 'wartet', stufe: 'Stufe 3',
      wartetAuf: 'T-42', grund: 'dieselbe Datei ist noch belegt' }
  ], fertig: [
    { nr: 36, titel: 'Zweiter Anmeldeweg', wann: 'heute 11:20' },
    { nr: 31, titel: 'Fusszeile aufgeräumt', wann: 'heute 09:04' }
  ]},
  { id: 'designgen', name: 'Design Generator', live: true, tickets: [
    { nr: 12, titel: 'Farbpalette überarbeiten', zustand: 'laeuft', stufe: 'Stufe 5',
      pct: 24, seit: 3, rest: 14, schritt: 'Drei Ansätze' }
  ], fertig: [] },
  { id: 'discord', name: 'Discord AI Server', live: true, tickets: [], fertig: [] },
  { id: 'aoshi', name: 'Aoshi', live: false, tickets: [], fertig: [] }
];

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
var TEMPO     = ['automatisch', 'eilig', 'zügig', 'Zeit egal'];
var TIMER     = ['kein Zeitdruck', '10 Min', '25 Min', '60 Min'];
var ISOLATION = ['wie eingestellt', 'Branch', 'Snapshot'];
var FREIGABE  = ['autonom', 'erst fragen'];

/* ---------- Zustand ---------- */
var st = { sess: 0, ticket: null, offen: false, einst: false, schritt: 1, mehr: false,
           anpassen: false, fertigAuf: false,
           berufe: [], hinweis: '', anhang: null,
           text: 'Startseite wirkt unruhig, niemand findet den Anmelde-Knopf.',
           frageText: '', frageAnhang: null,
           nachbesserOffen: false, nachbesserText: '', nachbesserAnhang: null,
           wahl: { dring: 1, grund: 0, beruf: 0, tempo: 0, timer: 0, modell: 0, aufwand: 0, iso: 0, frei: 0 } };

/* ---------- Helfer ---------- */
function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }
function farbe(nr) { return 'hsl(' + ((nr * 47) % 360) + ',var(--tc-s,68%),var(--tc-l,58%))'; }
function mmss(s) { var m = Math.floor(s / 60); return m + ':' + String(s % 60).padStart(2, '0'); }
function sess() { return sessions[st.sess]; }
/* Wert einer Einstellung nach Schlüssel, damit die Reihenfolge in EINST frei bleibt */
function einstWert(key) {
  for (var i = 0; i < EINST.length; i++) if (EINST[i].key === key) return EINST[i].werte[konf[key]];
  return '';
}
function findT(nr) { var l = sess().tickets; for (var i = 0; i < l.length; i++) if (l[i].nr === nr) return l[i]; return null; }

/* Beim Verlassen oder Wechseln des Tickets: alle Zwischenstände der Detailansicht leeren */
function detailZuruecksetzen() {
  st.anpassen = false;
  st.nachbesserOffen = false; st.nachbesserText = ''; st.nachbesserAnhang = null;
  st.frageText = ''; st.frageAnhang = null;
}
function allesZu() { st.ticket = null; st.offen = false; st.einst = false; st.schritt = 1; st.mehr = false; detailZuruecksetzen(); }

/* Bild aus der Zwischenablage einfügen, z. B. ein Screenshot */
function pasteBild(ta, setzen) {
  ta.onpaste = function (ev) {
    var dateien = (ev.clipboardData && ev.clipboardData.items) || [];
    for (var i = 0; i < dateien.length; i++) {
      if (dateien[i].type.indexOf('image/') === 0) {
        ev.preventDefault();
        var datei = dateien[i].getAsFile();
        setzen({ name: datei.name || 'Screenshot', groesse: Math.round(datei.size / 1024) + ' kB' });
        zeichne();
        return;
      }
    }
  };
}

function anhangZeile(anhang, entfernen) {
  if (!anhang) return null;
  var anh = el('div', 'anhang');
  anh.appendChild(el('span', 'anhang-symbol', '🖼'));
  anh.appendChild(el('span', 'anhang-name', anhang.name + ' · ' + anhang.groesse));
  var weg = el('button', 'anhang-weg', '✕');
  weg.onclick = function (ev) { ev.stopPropagation(); entfernen(); zeichne(); };
  anh.appendChild(weg);
  return anh;
}

/* Klartextzeile: was die Einstellung bedeutet, gedeckelt durch die höchste erlaubte Wucht */
function rechnung() {
  var g = st.wahl.grund;
  var stufe = [4, 2, 5, 7][g], agenten = [5, 2, 12, 38][g], min = [9, 3, 19, 55][g];
  st.berufe.forEach(function () { stufe = Math.max(stufe, 5); agenten += 4; min += 6; });
  var deckel = [4, 5, 6, 7, 7][konf.maxWucht];
  var gedeckelt = stufe > deckel;
  if (gedeckelt) {
    stufe = deckel;
    agenten = Math.min(agenten, [5, 12, 24, 38, 38][konf.maxWucht]);
    min = Math.min(min, [9, 19, 34, 55, 55][konf.maxWucht]);
  }
  var w = modellWahl(stufe);
  var t = 'Stufe ' + stufe + ' · ' + agenten + ' Agenten · ' + w.m + ' ' + w.a + ' · ~' + min + ' Min';
  if (st.wahl.timer > 0) t += ' · Frist ' + TIMER[st.wahl.timer];
  if (gedeckelt) t += ' · durch Einstellung gedeckelt';
  return t;
}

/* Welches Modell und welcher Aufwand gelten wirklich:
   Wahl am Ticket schlägt Standard aus den Einstellungen, der schlägt die Automatik. */
function modellWahl(stufe) {
  var auto = modellFuer(stufe);
  var m = st.wahl.modell > 0 ? MODELL[st.wahl.modell]
        : (konf.stdModell > 0 ? MODELL[konf.stdModell] : auto.m);
  var a = st.wahl.aufwand > 0 ? AUFWAND[st.wahl.aufwand]
        : (konf.stdAufwand > 0 ? AUFWAND[konf.stdAufwand] : auto.a);
  return { m: m, a: a };
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

function regler(name, wert) {
  var r = el('div', 'srow');
  r.appendChild(el('label', null, name));
  var tr = el('div', 'track'); var sp = el('span'); sp.style.width = wert + '%';
  var kn = el('i'); kn.style.left = wert + '%';
  tr.appendChild(sp); tr.appendChild(kn); r.appendChild(tr);
  r.appendChild(el('output', null, wert + ' %'));
  return r;
}

/* ---------- Seitenleiste ---------- */
function seite() {
  var a = el('aside', 'sidebar');
  var h = el('div', 'side-head'); h.appendChild(el('span', 'logo', 'Ticketsystem')); a.appendChild(h);
  a.appendChild(el('div', 'side-label', 'Sessions'));
  sessions.forEach(function (s, i) {
    var warte = s.tickets.filter(function (t) { return t.zustand === 'frage' || t.zustand === 'review'; }).length;
    var laeuft = s.tickets.filter(function (t) { return t.zustand === 'laeuft'; }).length;
    var d = el('div', 'proj' + (i === st.sess && !st.einst ? ' is-active' : '') + (s.live ? '' : ' is-dead'));
    d.appendChild(el('span', 'dot' + (s.live ? ' on' : '')));
    d.appendChild(el('span', 'pname', s.name));
    if (warte) d.appendChild(el('span', 'badge', String(warte)));
    d.appendChild(el('span', 'psub', s.live ? (laeuft ? laeuft + ' läuft' : 'ruhig') : 'gestoppt · Übernehmen'));
    d.onclick = function () { st.sess = i; allesZu(); zeichne(); };
    a.appendChild(d);
  });

  /* Fuss: Design-Wechsel und Einstellungen */
  var f = el('div', 'side-fuss');
  var e = el('button', 'side-knopf' + (st.einst ? ' is-active' : ''));
  e.appendChild(el('span', 'side-symbol', '⚙'));
  e.appendChild(el('span', null, 'Einstellungen'));
  e.appendChild(el('span', 'spacer'));
  e.appendChild(el('span', 'side-wert', DESIGNS[konf.design].name));
  e.onclick = function () { var an = !st.einst; allesZu(); st.einst = an; zeichne(); };
  f.appendChild(e);
  f.appendChild(el('div', 'side-foot', 'Taste 1 bis 4 wechselt · D wechselt das Design'));
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
    var b1 = el('button', 'crumb', st.einst ? 'Ticketsystem' : sess().name);
    b1.onclick = zurueck;
    c.appendChild(b1); c.appendChild(el('i', null, '›'));
    c.appendChild(el('b', null,
      st.einst ? 'Einstellungen'
               : (st.ticket ? 'T-' + st.ticket : 'Neues Ticket, Schritt ' + st.schritt + ' von 3')));
  } else {
    c.appendChild(el('b', null, sess().name));
  }
  h.appendChild(c);
  h.appendChild(el('span', 'spacer'));
  h.appendChild(el('span', 'pill', konf.autonomie === 0 ? 'fragt nach' : 'autonom'));
  h.appendChild(el('span', 'pill', 'max ' + einstWert('maxWucht')));
  h.appendChild(el('span', 'pill', konf.stdModell > 0
    ? MODELL[konf.stdModell] + ' ' + (konf.stdAufwand > 0 ? AUFWAND[konf.stdAufwand] : 'auto')
    : 'Modell automatisch'));
  h.appendChild(el('button', 'pill danger', 'Alles anhalten'));
  return h;
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
        streifen.appendChild(el('i', 'ds ds1'));
        streifen.appendChild(el('i', 'ds ds2'));
        streifen.appendChild(el('i', 'ds ds3'));
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

  var fuss = el('div', 'card einst');
  fuss.appendChild(el('p', 'einst-hilfe',
    'Alles wird auf diesem Rechner gemerkt und ist beim nächsten Öffnen wieder da.'));
  var zur = el('button', 'btn', 'Auf Standard zurücksetzen');
  zur.onclick = function () {
    konf = { design: 7, skala: 1, autonomie: 1, maxWucht: 4, stdModell: 0, stdAufwand: 0,
             parallel: 2, isolation: 0, hinweise: 0, chat: 0, bewegung: 0, spalten: 0, archiv: 1 };
    konfSichern(); konfAnwenden(); zeichne();
  };
  fuss.appendChild(zur);
  w.appendChild(fuss);
  return w;
}

/* ---------- Schreibleiste ---------- */
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
  var namen = ['Beschreiben', 'Einstufen', 'Beruf'];
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
      if (zurueck) st.schritt--; else { st.offen = false; st.schritt = 1; st.anhang = null; }
      zeichne();
    };
    f.appendChild(ab);
    f.appendChild(el('span', 'spacer'));
    var w = el('button', 'btn primary', text);
    w.onclick = function (ev) { ev.stopPropagation(); tun(); };
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

  /* Schritt 1: nur beschreiben */
  if (st.schritt === 1) {
    c.appendChild(el('h2', 'schreib-titel', 'Was ist los?'));
    var ta = el('textarea'); ta.rows = 6;
    ta.placeholder = 'Fehler, Idee, Wunsch. Einfach hinschreiben.';
    ta.value = st.text;
    ta.oninput = function () { st.text = ta.value; };
    pasteBild(ta, function (a) { st.anhang = a; });
    c.appendChild(ta);
    var ea = anhangZeile(st.anhang, function () { st.anhang = null; });
    if (ea) c.appendChild(ea);
    c.appendChild(el('p', 'schreib-hilfe',
      'Screenshot oder Datei hier hineinziehen, oder mit Strg+V einfügen.'));
    c.appendChild(fussZeile(false, 'Weiter', function () { st.schritt = 2; zeichne(); }));
    setTimeout(function () { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }, 0);
    return c;
  }

  /* Schritt 2: einstufen */
  if (st.schritt === 2) {
    c.appendChild(el('h2', 'schreib-titel', 'Wie soll das laufen?'));
    c.appendChild(wahlGruppe('Wie dringend', DRINGEND, 'dring'));
    c.appendChild(wahlGruppe('Wie gründlich', GRUENDL, 'grund'));
    c.appendChild(el('div', 'rechnung', rechnung()));
    c.appendChild(fussZeile(true, 'Weiter', function () { st.schritt = 3; zeichne(); }));
    return c;
  }

  /* Schritt 3: Beruf, mehrere anhakbar */
  c.appendChild(el('h2', 'schreib-titel', 'Wer soll das machen?'));
  c.appendChild(el('p', 'schreib-hilfe',
    'Nichts anhaken ist auch gut, dann läuft der normale Weg. Höchstens zwei.'));
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

  var mehr = el('button', 'mehr', st.mehr ? 'Feineinstellung ausblenden' : 'Feineinstellung');
  mehr.onclick = function (ev) { ev.stopPropagation(); st.mehr = !st.mehr; zeichne(); };
  c.appendChild(mehr);
  if (st.mehr) {
    var r2 = el('div', 'chips chips-mehr');
    r2.appendChild(chip('Timer', TIMER, 'timer'));
    r2.appendChild(chip('Tempo', TEMPO, 'tempo'));
    r2.appendChild(chip('Modell', MODELL, 'modell'));
    r2.appendChild(chip('Aufwand', AUFWAND, 'aufwand'));
    r2.appendChild(chip('Isolation', ISOLATION, 'iso'));
    r2.appendChild(chip('Freigabe', FREIGABE, 'frei'));
    c.appendChild(r2);
  }
  c.appendChild(el('div', 'rechnung', rechnung()));
  c.appendChild(fussZeile(true, 'Ticket starten', function () {
    st.offen = false; st.schritt = 1; st.mehr = false; st.anhang = null; zeichne();
  }));
  return c;
}

/* ---------- Fortschrittsblock, in Kachel und Detail gleich ---------- */
function fortschritt(t) {
  var fz = el('div', 'fortschritt');
  var bar = el('div', 'bar'); var sp = el('span'); sp.style.width = t.pct + '%';
  sp.dataset.bar = t.nr; bar.appendChild(sp); fz.appendChild(bar);
  var meta = el('div', 'tb-meta'); meta.dataset.meta = t.nr;
  meta.appendChild(el('span', 'pct', Math.round(t.pct) + ' %'));
  meta.appendChild(el('span', 'spacer'));
  meta.appendChild(el('span', 'zeit', 'läuft ' + t.seit + ' min'));
  meta.appendChild(el('span', t.frist != null ? 'zeit frist' : 'zeit',
    t.frist != null ? 'Frist ' + mmss(t.frist) : 'noch ~' + t.rest + ' min'));
  fz.appendChild(meta);
  return fz;
}
function straenge(t) {
  var s = el('div', 'strands');
  t.straenge.forEach(function (x) {
    var one = el('div', 'strand');
    one.appendChild(el('span', null, x.n));
    var b = el('div', 'bar' + (x.p >= 100 ? ' done' : '')); var sp = el('span');
    sp.style.width = x.p + '%'; sp.dataset.strang = t.nr + ':' + x.n;
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
  k.appendChild(el('span', 'tag' + (t.zustand === 'wartet' ? ' wait' : (t.straenge ? ' hot' : '')), t.stufe));
  d.appendChild(k);

  if (t.zustand === 'frage') {
    d.appendChild(el('p', 'tb-zeile', 'Wartet auf deine Antwort'));
  } else if (t.zustand === 'review') {
    d.appendChild(el('p', 'tb-zeile', t.neu));
    var vz = el('div', 'tb-meta');
    vz.appendChild(el('span', 'pct', 'fertig'));
    vz.appendChild(el('span', 'spacer'));
    vz.appendChild(el('span', 'zeit', t.dauer));
    d.appendChild(vz);
  } else if (t.zustand === 'wartet') {
    d.appendChild(el('p', 'tb-zeile', 'Wartet auf ' + t.wartetAuf + ' · ' + t.grund));
  } else {
    d.appendChild(el('p', 'schritt-zeile', t.schritt));
    var fz = fortschritt(t);
    if (t.straenge) fz.appendChild(straenge(t));
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

  var s = sess();
  var warte = s.tickets.filter(function (t) { return t.zustand === 'frage'; });
  var review = s.tickets.filter(function (t) { return t.zustand === 'review'; });
  var laeuft = s.tickets.filter(function (t) { return t.zustand === 'laeuft' || t.zustand === 'wartet'; });

  if (!s.live) { w.appendChild(el('p', 'leer', 'Diese Session ist gestoppt. Übernehmen, um weiterzuarbeiten.')); return w; }
  if (!s.tickets.length) { w.appendChild(el('p', 'leer', 'Nichts läuft gerade. Schreib oben rein, was ansteht.')); return w; }

  function raster(liste, ton) {
    var g = el('div', 'tliste ton-' + ton);
    liste.forEach(function (t) { g.appendChild(block(t)); });
    return g;
  }
  if (laeuft.length) {
    w.appendChild(el('h2', 'gruppe gr-arbeit', 'In Arbeit · ' + laeuft.length));
    w.appendChild(raster(laeuft, 'arbeit'));
  }
  if (warte.length) {
    w.appendChild(el('h2', 'gruppe warn gr-fragen', 'Fragen an dich · ' + warte.length));
    w.appendChild(raster(warte, 'fragen'));
  }
  if (review.length) {
    w.appendChild(el('h2', 'gruppe warn gr-review', 'Review, fertig zur Abnahme · ' + review.length));
    w.appendChild(raster(review, 'review'));
  }
  if (s.fertig.length) {
    var h = el('button', 'gruppe klapp gr-archiv', (st.fertigAuf ? '▾' : '▸') + ' Archiv · ' + s.fertig.length);
    h.onclick = function () { st.fertigAuf = !st.fertigAuf; zeichne(); };
    w.appendChild(h);
    if (st.fertigAuf) {
      var l = el('div', 'card arch');
      s.fertig.forEach(function (f) {
        var r = el('div', 'arow');
        r.appendChild(el('span', 'tid', 'T-' + f.nr));
        r.appendChild(el('span', null, f.titel));
        r.appendChild(el('span', 'spacer'));
        r.appendChild(el('span', 'zeit', f.wann + ' · erledigt'));
        l.appendChild(r);
      });
      w.appendChild(l);
    }
  }
  return w;
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
  k.appendChild(el('span', 'tag', t.stufe));
  c.appendChild(k);

  if (t.zustand === 'frage') {
    c.appendChild(el('p', 'q-what', t.frage));
    var ta = el('textarea', 'q-answer'); ta.rows = 3;
    ta.placeholder = 'Antworten, oder ein Bild einfügen';
    ta.value = st.frageText;
    ta.oninput = function () { st.frageText = ta.value; };
    pasteBild(ta, function (a) { st.frageAnhang = a; });
    c.appendChild(ta);
    var af = anhangZeile(st.frageAnhang, function () { st.frageAnhang = null; });
    if (af) c.appendChild(af);

    var qb = el('div', 'btns');
    ['Ja', 'Nein', 'Warum?'].forEach(function (x, i) { qb.appendChild(el('button', 'btn' + (i === 0 ? ' primary' : ''), x)); });
    qb.appendChild(el('span', 'spacer'));
    var senden = el('button', 'btn primary', 'Antwort senden');
    senden.onclick = function () { st.ticket = null; detailZuruecksetzen(); zeichne(); };
    qb.appendChild(senden);
    c.appendChild(qb);

  } else if (t.zustand === 'review') {
    c.appendChild(el('p', 'rev-satz', t.neu));
    var vor = el('div', 'rev-preview');
    vor.appendChild(el('span', 'rev-art', t.art));
    vor.appendChild(el('span', 'rev-hint', 'Das fertige Ergebnis, direkt hier'));
    c.appendChild(vor);

    var sp2 = el('div', 'rev-spalten');
    var li = el('div', 'rev-spalte');
    li.appendChild(el('div', 'rev-label', 'Was gemacht wurde'));
    var ul = el('ul', 'rev-liste');
    t.punkte.forEach(function (p) { ul.appendChild(el('li', null, p)); });
    li.appendChild(ul);
    sp2.appendChild(li);
    var re = el('div', 'rev-spalte');
    re.appendChild(el('div', 'rev-label', 'Schau dir das an'));
    re.appendChild(el('p', 'rev-pruefen', t.pruefen));
    re.appendChild(el('div', 'rev-fakten', t.dauer + ' · ' + t.dateien));
    sp2.appendChild(re);
    c.appendChild(sp2);

    var rb = el('div', 'btns');
    rb.appendChild(el('button', 'btn ok', 'Abschliessen'));
    var nbKnopf = el('button', 'btn' + (st.nachbesserOffen ? ' primary' : ''),
      st.nachbesserOffen ? 'Nachbessern schliessen' : 'Nachbessern');
    nbKnopf.onclick = function () { st.nachbesserOffen = !st.nachbesserOffen; zeichne(); };
    rb.appendChild(nbKnopf);
    rb.appendChild(el('button', 'btn', 'Verwerfen'));
    rb.appendChild(el('span', 'spacer'));
    rb.appendChild(el('span', 'ideas', 'Nebenideen: ' + t.ideen + ' zum Anhaken'));
    c.appendChild(rb);

    if (st.nachbesserOffen) {
      var nb = el('div', 'nachbesser');
      nb.appendChild(el('div', 'wahl-label', 'Was soll noch angepasst werden?'));
      var nta = el('textarea', 'q-answer'); nta.rows = 4;
      nta.placeholder = 'Beschreiben, oder ein Bild einfügen';
      nta.value = st.nachbesserText;
      nta.oninput = function () { st.nachbesserText = nta.value; };
      pasteBild(nta, function (a) { st.nachbesserAnhang = a; });
      nb.appendChild(nta);
      var na = anhangZeile(st.nachbesserAnhang, function () { st.nachbesserAnhang = null; });
      if (na) nb.appendChild(na);

      var nf = el('div', 'btns');
      var nab = el('button', 'btn ghost', 'Abbrechen');
      nab.onclick = function () { st.nachbesserOffen = false; st.nachbesserText = ''; st.nachbesserAnhang = null; zeichne(); };
      nf.appendChild(nab);
      nf.appendChild(el('span', 'spacer'));
      var nsend = el('button', 'btn primary', 'Nachbesserung senden');
      nsend.onclick = function () { st.ticket = null; detailZuruecksetzen(); zeichne(); };
      nf.appendChild(nsend);
      nb.appendChild(nf);
      c.appendChild(nb);
    }

  } else if (t.zustand === 'wartet') {
    c.appendChild(el('p', 'q-what', 'Wartet auf ' + t.wartetAuf + ', weil ' + t.grund + '. Startet von selbst, sobald frei.'));
    var wb = el('div', 'btns');
    wb.appendChild(el('button', 'btn primary', 'Vordrängeln'));
    c.appendChild(wb);

  } else {
    c.appendChild(el('p', 'schritt-zeile', t.schritt));
    c.appendChild(fortschritt(t));
    if (t.straenge) c.appendChild(straenge(t));

    var lv = el('div', 'live');
    var lk = el('div', 'live-kopf');
    lk.appendChild(el('span', 'live-punkt'));
    lk.appendChild(el('span', 'live-label', 'Läuft gerade'));
    /* womit gearbeitet wird, ohne dass man erst Anpassen öffnen muss */
    var stufeNr = parseInt((t.stufe.match(/\d+/) || [4])[0], 10);
    var mw = modellWahl(stufeNr);
    lk.appendChild(el('span', 'tag', mw.m + ' · ' + mw.a));
    lk.appendChild(el('span', 'spacer'));
    lk.appendChild(el('span', 'zeit', t.schritt));
    lv.appendChild(lk);
    lv.appendChild(el('div', 'live-flaeche', 'Der aktuelle Stand erscheint hier, während gearbeitet wird'));
    c.appendChild(lv);

    var ab = el('div', 'btns');
    var an = el('button', 'btn' + (st.anpassen ? ' primary' : ''), st.anpassen ? 'fertig' : 'Anpassen');
    an.onclick = function (ev) { ev.stopPropagation(); st.anpassen = !st.anpassen; zeichne(); };
    ab.appendChild(an);
    ab.appendChild(el('button', 'btn', 'warum diese Stufe?'));
    ab.appendChild(el('button', 'btn', 'Pause'));
    ab.appendChild(el('button', 'btn stop', 'Stop'));
    c.appendChild(ab);

    if (st.anpassen) {
      var p = el('div', 'anpassen');
      var rw = regler('Wucht', 65);
      rw.appendChild(el('button', 'over', '150 %'));
      p.appendChild(rw);
      p.appendChild(regler('Tempo', 40));
      p.appendChild(regler('Wichtigkeit', 80));
      var ch = el('div', 'chips');
      ch.appendChild(chip('Timer', TIMER, 'timer'));
      ch.appendChild(chip('Modell', MODELL, 'modell'));
      ch.appendChild(chip('Aufwand', AUFWAND, 'aufwand'));
      p.appendChild(ch);
      p.appendChild(el('div', 'rechnung', rechnung()));
      c.appendChild(p);
    }
  }
  w.appendChild(c);
  return w;
}

/* ---------- Zeichnen ---------- */
function zeichne() {
  var app = el('div', 'app');
  app.appendChild(seite());
  var m = el('main', 'main');
  m.appendChild(kopf());
  m.appendChild(st.einst ? einstellungen() : (st.ticket ? detail() : uebersicht()));
  app.appendChild(m);
  var w = document.getElementById('wurzel') || document.body;
  w.innerHTML = '';
  w.appendChild(app);
}

/* ---------- Leben: Balken bewegen sich ---------- */
function takt() {
  sessions.forEach(function (s) {
    s.tickets.forEach(function (t) {
      if (t.zustand !== 'laeuft') return;
      if (t.pct < 99) t.pct = Math.min(99, t.pct + (t.straenge ? 0.09 : 0.14));
      if (t.frist != null) t.frist = Math.max(0, t.frist - 1);
      if (t.straenge) t.straenge.forEach(function (x) { if (x.p < 100) x.p = Math.min(100, x.p + 0.11); });
    });
  });
  /* nur Zahlen und Breiten anfassen, damit Tippen und offene Listen bleiben */
  document.querySelectorAll('[data-bar]').forEach(function (sp) {
    var t = findT(+sp.dataset.bar); if (t) sp.style.width = t.pct + '%';
  });
  document.querySelectorAll('[data-strang]').forEach(function (sp) {
    var teile = sp.dataset.strang.split(':');
    var t = findT(+teile[0]); if (!t || !t.straenge) return;
    t.straenge.forEach(function (x) {
      if (x.n === teile[1]) {
        sp.style.width = x.p + '%';
        if (x.p >= 100) sp.parentNode.classList.add('done');
      }
    });
  });
  document.querySelectorAll('[data-meta]').forEach(function (m) {
    var t = findT(+m.dataset.meta); if (!t || t.pct == null) return;
    var p = m.querySelector('.pct'); if (p) p.textContent = Math.round(t.pct) + ' %';
    if (t.frist != null) {
      var z = m.querySelectorAll('.zeit');
      if (z[1]) z[1].textContent = 'Frist ' + mmss(t.frist);
    }
  });
}

function start() {
  konfLaden();
  konfAnwenden();
  zeichne();
  setInterval(takt, 1000);
  document.addEventListener('click', function () {
    var o = document.querySelector('.chip-wrap.is-open');
    if (o) o.classList.remove('is-open');
  });
  document.addEventListener('keydown', function (e) {
    var tippt = document.activeElement && document.activeElement.tagName === 'TEXTAREA';
    if (e.key === 'Escape') { allesZu(); zeichne(); return; }
    if (tippt) return;
    if (/^[1-4]$/.test(e.key)) { st.sess = +e.key - 1; allesZu(); zeichne(); }
    /* D schaltet das Design eins weiter, ohne den Umweg über die Einstellungen */
    if (e.key === 'd' || e.key === 'D') {
      konf.design = (konf.design + 1) % DESIGNS.length;
      konfSichern(); konfAnwenden(); zeichne();
    }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
})();

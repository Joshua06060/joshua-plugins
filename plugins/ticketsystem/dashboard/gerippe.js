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
/* Bewusst nur zwei: alles andere gehört ans einzelne Ticket oder in die Skill-Einrichtung,
   nicht in eine Oberfläche, die man einmal einstellt und nie wieder anfasst. */
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
  } catch (e) { /* ohne Speicher läuft es mit den Standardwerten weiter */ }
}
function konfSichern() {
  try { localStorage.setItem('ticketsystem-konf', JSON.stringify(konf)); } catch (e) {}
}
/* Design, Grösse, Bewegung und Dichte wirken direkt am Wurzelelement */
function konfAnwenden() {
  var h = document.documentElement;
  h.setAttribute('data-stil', DESIGNS[konf.design].id);
  h.style.setProperty('--skala', [1, 1.2, 1.4][konf.skala]);
}

/* ---------- Daten ---------- */
/* Echte Daten. Claude schreibt daneben eine daten.js und setzt darin window.TICKETDATEN.
   Ohne diese Datei bleibt alles leer, es wird nichts erfunden. */
var sessions = [];
var stand = { geschrieben: null, projekt: null };

function datenUebernehmen() {
  var d = window.TICKETDATEN;
  if (!d || !Array.isArray(d.sessions)) { sessions = []; return false; }
  sessions = d.sessions;
  stand.geschrieben = d.geschrieben || null;
  stand.projekt = d.projekt || null;
  if (st.sess >= sessions.length) st.sess = 0;
  return true;
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

/* Minuten seit einem Zeitstempel aus der Ticket-Datei */
function minutenSeit(iso) {
  if (!iso) return 0;
  var d = new Date(iso); if (isNaN(d)) return 0;
  return Math.max(0, Math.round((Date.now() - d) / 60000));
}
/* Fortschritt steht als "2/4" in der Datei. Fehlt er, gibt es keinen Balken. */
function prozent(t) {
  if (!t.fortschritt) return null;
  var p = String(t.fortschritt).split('/');
  var a = parseFloat(p[0]), b = parseFloat(p[1]);
  if (!(b > 0) || isNaN(a)) return null;
  return Math.max(0, Math.min(100, Math.round(a / b * 100)));
}
/* Text für die Zeitangabe rechts am Balken */
function restText(t) {
  if (t.frist) {
    var rest = Math.max(0, Math.round((new Date(t.frist) - Date.now()) / 1000));
    return rest > 0 ? 'Frist ' + mmss(rest) : 'Frist abgelaufen';
  }
  return t.rest ? 'noch ~' + t.rest + ' min' : '';
}

/* Befehl in die Zwischenablage legen, weil eine Seite ohne Hintergrundprogramm
   nicht auf die Platte schreiben darf. Der Nutzer fügt ihn im Chat ein. */
function befehlKopieren(befehl, knopf) {
  function melden(ok) {
    var alt = knopf.textContent;
    knopf.textContent = ok ? 'kopiert, im Chat einfügen' : befehl;
    knopf.classList.add('kopiert');
    setTimeout(function () { knopf.textContent = alt; knopf.classList.remove('kopiert'); }, 2600);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(befehl).then(function () { melden(true); }, function () { melden(false); });
  } else {
    var h = document.createElement('textarea');
    h.value = befehl; document.body.appendChild(h); h.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(h); melden(ok);
  }
}
/* Knopf, der einen Befehl kopiert statt so zu tun, als würde er etwas auslösen */
function befehlKnopf(text, befehl, extra) {
  var b = el('button', 'btn' + (extra ? ' ' + extra : ''), text);
  b.title = 'Legt "' + befehl + '" in die Zwischenablage. Im Chat einfügen.';
  b.onclick = function (ev) { ev.stopPropagation(); befehlKopieren(befehl, b); };
  return b;
}
/* Nie abstürzen, wenn noch keine Daten da sind */
var LEER = { id: 'leer', name: 'Kein Projekt', live: false, tickets: [], fertig: [] };
function sess() { return sessions[st.sess] || LEER; }
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
  var w = modellWahl(stufe);
  var t = 'Stufe ' + stufe + ' · ' + agenten + ' Agenten · ' + w.m + ' ' + w.a + ' · ~' + min + ' Min';
  if (st.wahl.timer > 0) t += ' · Frist ' + TIMER[st.wahl.timer];
  return t;
}

/* Modell und Aufwand: Wahl am Ticket schlägt die Automatik nach Stufe. Mehr Ebenen gibt es nicht. */
function modellWahl(stufe) {
  var auto = modellFuer(stufe);
  return {
    m: st.wahl.modell > 0 ? MODELL[st.wahl.modell] : auto.m,
    a: st.wahl.aufwand > 0 ? AUFWAND[st.wahl.aufwand] : auto.a
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
    konf = { design: 7, skala: 1 };
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
  c.appendChild(fussZeile(true, 'Ticket kopieren', function () {
    /* Alles Eingestellte in eine Zeile, die Claude versteht */
    var teile = [(st.text || '').trim()];
    if (st.wahl.dring !== 1) teile.push('[dringend: ' + DRINGEND[st.wahl.dring] + ']');
    if (st.wahl.grund !== 0) teile.push('[gründlich: ' + GRUENDL[st.wahl.grund] + ']');
    if (st.berufe.length) teile.push('[Beruf: ' + st.berufe.map(function (i) { return BERUFE[i]; }).join(', ') + ']');
    if (st.wahl.timer !== 0) teile.push('[Timer: ' + TIMER[st.wahl.timer] + ']');
    if (st.wahl.modell !== 0) teile.push('[Modell: ' + MODELL[st.wahl.modell] + ']');
    if (st.wahl.aufwand !== 0) teile.push('[Aufwand: ' + AUFWAND[st.wahl.aufwand] + ']');
    if (st.anhang) teile.push('[Anhang: ' + st.anhang.name + ']');
    befehlKopieren(teile.filter(Boolean).join(' '), document.querySelector('.compose-fuss .btn.primary'));
  }));
  return c;
}

/* ---------- Fortschrittsblock, in Kachel und Detail gleich ---------- */
function fortschritt(t) {
  var fz = el('div', 'fortschritt');
  var p = prozent(t);
  /* Balken nur, wenn ein Fortschritt in der Datei steht. Sonst keiner. */
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
  k.appendChild(el('span', 'tag' + (t.zustand === 'wartet' ? ' wait' : (t.straenge ? ' hot' : '')), t.stufe));
  d.appendChild(k);

  if (t.zustand === 'frage') {
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
  /* Alles, was nicht Frage oder Review ist, landet unter In Arbeit. Auch ein unbekannter
     Zustand. Ein Ticket darf nie stillschweigend verschwinden. */
  var laeuft = s.tickets.filter(function (t) { return t.zustand !== 'frage' && t.zustand !== 'review'; });

  /* Noch gar keine Daten: ehrlich sagen woran es liegt, statt Beispieldaten zu zeigen */
  if (!sessions.length) {
    var k = el('div', 'card einst');
    k.appendChild(el('b', 'einst-titel', 'Noch keine Daten'));
    k.appendChild(el('p', 'einst-hilfe',
      'Claude hat noch nichts geschrieben. Sobald ein Ticket entsteht, steht es hier. ' +
      'Schreib in die Datei 1-EINGANG.md im Ticketsystem-Ordner, oder sag es Claude im Chat.'));
    w.appendChild(k);
    return w;
  }
  if (!s.live) { w.appendChild(el('p', 'leer', 'Diese Session ist gestoppt.')); return w; }
  if (!s.tickets.length && !s.fertig.length) {
    w.appendChild(el('p', 'leer', 'Nichts läuft gerade. Schreib oben rein, was ansteht.'));
    return w;
  }

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
    c.appendChild(el('p', 'q-what', t.frage || 'Claude braucht eine Antwort.'));
    var ta = el('textarea', 'q-answer'); ta.rows = 3;
    ta.placeholder = 'Antworten, oder ein Bild einfügen';
    ta.value = st.frageText;
    ta.oninput = function () { st.frageText = ta.value; };
    pasteBild(ta, function (a) { st.frageAnhang = a; });
    c.appendChild(ta);
    var af = anhangZeile(st.frageAnhang, function () { st.frageAnhang = null; });
    if (af) c.appendChild(af);

    var qb = el('div', 'btns');
    qb.appendChild(befehlKnopf('Ja', '!antwort T-' + t.nr + ' ja'));
    qb.appendChild(befehlKnopf('Nein', '!antwort T-' + t.nr + ' nein'));
    qb.appendChild(befehlKnopf('Warum?', '!warum T-' + t.nr));
    qb.appendChild(el('span', 'spacer'));
    /* Der getippte Text wandert mit in die Zwischenablage */
    var senden = el('button', 'btn primary', 'Antwort kopieren');
    senden.title = 'Legt die Antwort in die Zwischenablage. Im Chat einfügen.';
    senden.onclick = function (ev) {
      ev.stopPropagation();
      var txt = (st.frageText || '').trim();
      befehlKopieren('!antwort T-' + t.nr + (txt ? ' ' + txt : ''), senden);
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
    (t.punkte || []).forEach(function (p) { ul.appendChild(el('li', null, p)); });
    li.appendChild(ul);
    sp2.appendChild(li);
    var re = el('div', 'rev-spalte');
    re.appendChild(el('div', 'rev-label', 'Schau dir das an'));
    re.appendChild(el('p', 'rev-pruefen', t.pruefen || 'Schau, ob es so passt.'));
    re.appendChild(el('div', 'rev-fakten', [t.dauer, t.dateien].filter(Boolean).join(' · ')));
    sp2.appendChild(re);
    c.appendChild(sp2);

    var rb = el('div', 'btns');
    rb.appendChild(befehlKnopf('Abschliessen', '!abschliessen T-' + t.nr, 'ok'));
    var nbKnopf = el('button', 'btn' + (st.nachbesserOffen ? ' primary' : ''),
      st.nachbesserOffen ? 'Nachbessern schliessen' : 'Nachbessern');
    nbKnopf.onclick = function () { st.nachbesserOffen = !st.nachbesserOffen; zeichne(); };
    rb.appendChild(nbKnopf);
    rb.appendChild(befehlKnopf('Verwerfen', '!verwerfen T-' + t.nr));
    rb.appendChild(el('span', 'spacer'));
    if (t.ideen) rb.appendChild(el('span', 'ideas', 'Nebenideen: ' + t.ideen + ' zum Anhaken'));
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
      var nsend = el('button', 'btn primary', 'Nachbesserung kopieren');
      nsend.title = 'Legt den Text in die Zwischenablage. Im Chat einfügen.';
      nsend.onclick = function (ev) {
        ev.stopPropagation();
        var txt = (st.nachbesserText || '').trim();
        befehlKopieren('!nachbessern T-' + t.nr + (txt ? ' ' + txt : ''), nsend);
      };
      nf.appendChild(nsend);
      nb.appendChild(nf);
      c.appendChild(nb);
    }

  } else if (t.zustand === 'wartet') {
    c.appendChild(el('p', 'q-what', 'Wartet auf ' + (t.wartetAuf || 'ein anderes Ticket') + (t.grund ? ', weil ' + t.grund : '') + '. Startet von selbst, sobald frei.'));
    var wb = el('div', 'btns');
    wb.appendChild(befehlKnopf('Vordrängeln', '!nur T-' + t.nr, 'primary'));
    c.appendChild(wb);

  } else {
    c.appendChild(el('p', 'schritt-zeile', t.schritt));
    c.appendChild(fortschritt(t));
    if (t.straenge) c.appendChild(straenge(t));

    var lv = el('div', 'live');
    var lk = el('div', 'live-kopf');
    lk.appendChild(el('span', 'live-punkt'));
    lk.appendChild(el('span', 'live-label', 'Läuft gerade'));
    /* Womit wirklich gearbeitet wird: steht im Ticket. Nur wenn dort nichts steht,
       zeigen wir, was die Automatik für diese Stufe wählen würde. */
    var stufeNr = parseInt((String(t.stufe || '').match(/\d+/) || [4])[0], 10);
    var auto = modellFuer(stufeNr);
    lk.appendChild(el('span', 'tag', (t.modell || auto.m) + ' · ' + (t.aufwand || auto.a)));
    lk.appendChild(el('span', 'spacer'));
    lk.appendChild(el('span', 'zeit', t.schritt));
    lv.appendChild(lk);
    lv.appendChild(el('div', 'live-flaeche', 'Der aktuelle Stand erscheint hier, während gearbeitet wird'));
    c.appendChild(lv);

    var ab = el('div', 'btns');
    var an = el('button', 'btn' + (st.anpassen ? ' primary' : ''), st.anpassen ? 'fertig' : 'Anpassen');
    an.onclick = function (ev) { ev.stopPropagation(); st.anpassen = !st.anpassen; zeichne(); };
    ab.appendChild(an);
    ab.appendChild(befehlKnopf('warum diese Stufe?', '!warum T-' + t.nr));
    ab.appendChild(befehlKnopf('Pause', '!pause T-' + t.nr));
    ab.appendChild(befehlKnopf('Stop', '!stop T-' + t.nr, 'stop'));
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
/* Der Takt erfindet nichts. Er rechnet nur die beiden Werte weiter, die sich aus einem
   echten Zeitstempel ergeben: wie lange etwas schon läuft und wie viel Frist noch bleibt.
   Prozent und Schritt stehen in der Ticket-Datei und ändern sich nur, wenn Claude schreibt. */
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

/* ---------- Daten nachladen ----------
   Claude schreibt daten.js neben diese Seite. Wir hängen sie alle paar Sekunden neu ein.
   Der Zeitstempel umgeht den Zwischenspeicher, so sieht man Änderungen ohne Neuladen.
   Gezeichnet wird nur, wenn sich wirklich etwas geändert hat, sonst würde jeder
   halb getippte Text und jede offene Liste alle 5 Sekunden verschwinden. */
var letzterStand = '';
function datenNachladen(erstesMal) {
  var s = document.createElement('script');
  s.src = 'daten.js?t=' + Date.now();
  s.onload = function () {
    s.remove();
    var neu = JSON.stringify(window.TICKETDATEN || null);
    if (neu === letzterStand && !erstesMal) return;
    letzterStand = neu;
    datenUebernehmen();
    /* Nicht neu zeichnen, während jemand tippt oder eine Liste offen ist */
    var tippt = document.activeElement && /TEXTAREA|INPUT/.test(document.activeElement.tagName);
    var listeOffen = document.querySelector('.chip-wrap.is-open');
    if (tippt || listeOffen) return;
    zeichne();
  };
  s.onerror = function () {
    s.remove();
    /* daten.js fehlt noch. Beim ersten Mal einmal zeichnen, damit der leere
       Zustand erscheint statt einer weissen Seite. */
    if (erstesMal) zeichne();
  };
  document.head.appendChild(s);
}

function start() {
  konfLaden();
  konfAnwenden();
  zeichne();
  datenNachladen(true);
  setInterval(function () { datenNachladen(false); }, 5000);
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

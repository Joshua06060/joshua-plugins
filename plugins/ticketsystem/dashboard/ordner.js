/* Ordner-Anbindung: das Dashboard liest und schreibt den TICKETSYSTEM-Ordner direkt,
   über die File System Access API. Kein Server, kein Hintergrundprogramm — nur ein
   einmaliger Klick, der die Erlaubnis für diesen Ordner erteilt.

   Nur Chrome, Edge, Brave, Arc, Opera können das (jeder Chromium-Browser). In Firefox
   und Safari fehlt die API komplett, das prüft unterstuetzt() als Erstes.

   Das Handle wird in IndexedDB gemerkt. Beim nächsten Öffnen wird die Erlaubnis erneut
   geprüft: oft ist sie noch gültig (kein Klick nötig), sonst reicht ein Klick auf
   "Ordner wieder erlauben" statt die Ordnerauswahl erneut durchzuklicken. */
(function () {
'use strict';

var DB_NAME = 'ticketsystem', DB_STORE = 'ordner', DB_KEY = 'wurzel';
var wurzel = null; /* FileSystemDirectoryHandle, sobald verbunden */
var warteschlangen = {}; /* pro Dateipfad: eine Promise-Kette, damit Anhängen nie kollidiert */

function unterstuetzt() {
  return typeof window.showDirectoryPicker === 'function';
}

/* ---------- IndexedDB: nur zum Aufbewahren des einen Handles ---------- */
function dbOeffnen() {
  return new Promise(function (resolve, reject) {
    var req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = function () { req.result.createObjectStore(DB_STORE); };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
}
function handleMerken(handle) {
  return dbOeffnen().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).put(handle, DB_KEY);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}
function handleHolen() {
  return dbOeffnen().then(function (db) {
    return new Promise(function (resolve) {
      var tx = db.transaction(DB_STORE, 'readonly');
      var req = tx.objectStore(DB_STORE).get(DB_KEY);
      req.onsuccess = function () { resolve(req.result || null); };
      req.onerror = function () { resolve(null); };
    });
  });
}

/* Prüft, ob das wirklich ein TICKETSYSTEM-Ordner ist. Ein frisch angelegter, noch
   leerer Ordner zählt auch als gültig — dann fehlt nur .tickets/ noch. */
function pruefeOrdner(handle) {
  return handle.getDirectoryHandle('.tickets', { create: false }).then(
    function () { return true; },
    function () { return handle.getDirectoryHandle('.state', { create: false }).then(
      function () { return true; }, function () { return false; }); }
  );
}

/* ---------- Verbinden ---------- */
/* Braucht einen echten Klick (Nutzergeste), das ist eine Browser-Regel und lässt sich
   nicht umgehen. Darum nur aus einem onclick-Handler aufrufen. */
function verbinden() {
  if (!unterstuetzt()) return Promise.reject(neuerFehler('nicht-unterstuetzt'));
  return window.showDirectoryPicker({ id: 'ticketsystem', mode: 'readwrite' }).then(function (handle) {
    return pruefeOrdner(handle).then(function (ok) {
      if (!ok) throw neuerFehler('falscher-ordner');
      wurzel = handle;
      return handleMerken(handle).then(function () { return handle; });
    });
  });
}

/* Beim Start: gemerktes Handle holen und die Rechte prüfen, ohne zu fragen.
   'granted' → sofort einsatzbereit. 'prompt' → ein Klick ist nötig, siehe erneutErlauben.
   Kein gemerktes Handle → ganz normal 'nicht-verbunden'. */
function stillVersuchen() {
  if (!unterstuetzt()) return Promise.resolve({ status: 'nicht-unterstuetzt' });
  return handleHolen().then(function (handle) {
    if (!handle) return { status: 'nicht-verbunden' };
    return handle.queryPermission({ mode: 'readwrite' }).then(function (recht) {
      if (recht === 'granted') { wurzel = handle; return { status: 'verbunden', handle: handle }; }
      return { status: 'erlaubnis-noetig', handle: handle };
    }, function () { return { status: 'nicht-verbunden' }; });
  });
}

/* Der eine Klick auf "Ordner wieder erlauben". Auch das ist eine Nutzergeste. */
function erneutErlauben(handle) {
  return handle.requestPermission({ mode: 'readwrite' }).then(function (recht) {
    if (recht !== 'granted') throw neuerFehler('erlaubnis-verweigert');
    wurzel = handle;
    return handle;
  });
}

function verbindungTrennen() {
  wurzel = null;
  return dbOeffnen().then(function (db) {
    return new Promise(function (resolve) {
      var tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).delete(DB_KEY);
      tx.oncomplete = function () { resolve(); };
    });
  });
}

function verbundenListe() { return !!wurzel; }

function neuerFehler(code) { var e = new Error(code); e.code = code; return e; }

/* ---------- Pfade auflösen ----------
   Pfad immer mit "/" getrennt, relativ zum TICKETSYSTEM-Ordner, z. B. ".tickets/T-0043.md" */
function teile(pfad) { return pfad.split('/').filter(Boolean); }

function ordnerHandle(segmente, anlegen) {
  var h = wurzel;
  var i = 0;
  function weiter() {
    if (i >= segmente.length) return Promise.resolve(h);
    var name = segmente[i++];
    return h.getDirectoryHandle(name, { create: !!anlegen }).then(function (n) { h = n; return weiter(); });
  }
  return weiter();
}

/* ---------- Lesen ---------- */
function leseDatei(pfad) {
  if (!wurzel) return Promise.reject(neuerFehler('nicht-verbunden'));
  var seg = teile(pfad), name = seg.pop();
  return ordnerHandle(seg, false).then(function (ord) {
    return ord.getFileHandle(name, { create: false });
  }).then(function (fh) {
    return fh.getFile();
  }).then(function (f) {
    return f.text();
  }).catch(function (e) {
    if (e && (e.name === 'NotFoundError' || e.code === 'nicht-verbunden')) return null;
    throw e;
  });
}

/* Eine Binärdatei als anzeigbare URL holen, z. B. ein Bild aus .state/anhaenge/.
   Der Aufrufer sollte die URL nach Gebrauch mit URL.revokeObjectURL wieder freigeben. */
function leseBildUrl(pfad) {
  if (!wurzel) return Promise.reject(neuerFehler('nicht-verbunden'));
  var seg = teile(pfad), name = seg.pop();
  return ordnerHandle(seg, false).then(function (ord) {
    return ord.getFileHandle(name, { create: false });
  }).then(function (fh) {
    return fh.getFile();
  }).then(function (f) {
    return URL.createObjectURL(f);
  }).catch(function (e) {
    if (e && e.name === 'NotFoundError') return null;
    throw e;
  });
}

/* Alle Dateinamen in einem Unterordner, z. B. ".tickets". Fehlt der Ordner, leere Liste. */
function listeOrdner(unterpfad) {
  if (!wurzel) return Promise.reject(neuerFehler('nicht-verbunden'));
  return ordnerHandle(teile(unterpfad), false).then(function (ord) {
    var namen = [];
    var it = ord.values();
    function weiter() {
      return it.next().then(function (r) {
        if (r.done) return namen;
        if (r.value.kind === 'file') namen.push(r.value.name);
        return weiter();
      });
    }
    return weiter();
  }).catch(function (e) {
    if (e && e.name === 'NotFoundError') return [];
    throw e;
  });
}

/* ---------- Schreiben ---------- */
function schreibeDatei(pfad, inhalt) {
  if (!wurzel) return Promise.reject(neuerFehler('nicht-verbunden'));
  var seg = teile(pfad), name = seg.pop();
  return ordnerHandle(seg, true).then(function (ord) {
    return ord.getFileHandle(name, { create: true });
  }).then(function (fh) {
    return fh.createWritable();
  }).then(function (w) {
    return w.write(inhalt).then(function () { return w.close(); });
  });
}

/* Bild oder andere Binärdatei schreiben, z. B. aus einem Anhang */
function schreibeBinaer(pfad, blobOderDataUrl) {
  if (typeof blobOderDataUrl === 'string') {
    return fetch(blobOderDataUrl).then(function (r) { return r.blob(); }).then(function (blob) {
      return schreibeDatei(pfad, blob);
    });
  }
  return schreibeDatei(pfad, blobOderDataUrl);
}

/* Zeile ans Ende einer Datei anhängen, z. B. .state/befehle.jsonl. Lesen-Ändern-Schreiben
   ist die einzige Möglichkeit mit dieser API, darum pro Pfad nacheinander statt
   gleichzeitig, sonst könnten zwei schnelle Klicks sich gegenseitig überschreiben. */
function anhaengen(pfad, zeile) {
  var kette = warteschlangen[pfad] || Promise.resolve();
  var neu = kette.then(function () {
    return leseDatei(pfad).then(function (alt) {
      var text = (alt || '') + zeile.replace(/\n$/, '') + '\n';
      return schreibeDatei(pfad, text);
    });
  });
  warteschlangen[pfad] = neu.catch(function () {}); /* ein Fehler blockiert nicht die nächste Zeile */
  return neu;
}

window.Ordner = {
  unterstuetzt: unterstuetzt,
  verbinden: verbinden,
  stillVersuchen: stillVersuchen,
  erneutErlauben: erneutErlauben,
  verbindungTrennen: verbindungTrennen,
  verbunden: verbundenListe,
  leseDatei: leseDatei,
  leseBildUrl: leseBildUrl,
  listeOrdner: listeOrdner,
  schreibeDatei: schreibeDatei,
  schreibeBinaer: schreibeBinaer,
  anhaengen: anhaengen
};
})();

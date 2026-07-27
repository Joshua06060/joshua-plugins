/* Zeigt Inhalte, die früher eine externe Datei oder Webseite gebraucht hätten, direkt im
   Dashboard: Claudes Bericht als gezeichnetes Markdown, geänderte Dateien inline, Bilder
   aus Anhängen. Kein Netzzugriff erlaubt, darum ein eigener kleiner Markdown-Zeichner statt
   einer Fremdbibliothek — nur die Teilmenge, die Claudes Berichte tatsächlich brauchen:
   Überschriften, Absätze, Listen, Fett/Kursiv, Inline-Code, Codeblöcke, Links. */
(function () {
'use strict';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* Inline-Formatierung innerhalb einer Zeile: Code zuerst, damit sein Inhalt nicht
   nochmal als Fett/Kursiv gelesen wird. Absichtlich einfach, kein Verschachteln. */
function inline(text) {
  var stuecke = [];
  var rest = escapeHtml(text);
  rest = rest.replace(/`([^`]+)`/g, function (_, code) { return '' + (stuecke.push('<code>' + code + '</code>') - 1) + ''; });
  rest = rest.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, txt, href) {
    var sicher = /^https?:\/\//.test(href) ? href : '#';
    return '' + (stuecke.push('<a href="' + escapeHtml(sicher) + '" target="_blank" rel="noopener">' + txt + '</a>') - 1) + '';
  });
  rest = rest.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  rest = rest.replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>');
  rest = rest.replace(/(\d+)/g, function (_, i) { return stuecke[+i]; });
  return rest;
}

/* Ganzer Text -> HTML. Zeilenweise, mit einfachem Zustand für Listen und Codeblöcke. */
function zuHtml(text) {
  var zeilen = String(text || '').replace(/\r\n/g, '\n').split('\n');
  var html = [], i = 0, inListe = false, inCode = false, codeZeilen = [];
  function listeSchliessen() { if (inListe) { html.push('</ul>'); inListe = false; } }
  while (i < zeilen.length) {
    var z = zeilen[i];
    if (/^```/.test(z)) {
      if (!inCode) { inCode = true; codeZeilen = []; }
      else { inCode = false; html.push('<pre><code>' + escapeHtml(codeZeilen.join('\n')) + '</code></pre>'); }
      i++; continue;
    }
    if (inCode) { codeZeilen.push(z); i++; continue; }
    if (/^\s*$/.test(z)) { listeSchliessen(); i++; continue; }
    var ueberschrift = /^(#{1,4})\s+(.*)$/.exec(z);
    if (ueberschrift) { listeSchliessen(); html.push('<h' + (ueberschrift[1].length + 2) + '>' + inline(ueberschrift[2]) + '</h' + (ueberschrift[1].length + 2) + '>'); i++; continue; }
    var listenpunkt = /^\s*[-*]\s+(.*)$/.exec(z);
    if (listenpunkt) {
      if (!inListe) { html.push('<ul>'); inListe = true; }
      html.push('<li>' + inline(listenpunkt[1]) + '</li>');
      i++; continue;
    }
    listeSchliessen();
    /* Ein Absatz nimmt alle folgenden Nicht-Leerzeilen mit, die keine neue Struktur beginnen */
    var absatz = [z];
    while (i + 1 < zeilen.length && zeilen[i + 1].trim() !== '' &&
           !/^```/.test(zeilen[i + 1]) && !/^\s*[-*]\s+/.test(zeilen[i + 1]) && !/^#{1,4}\s+/.test(zeilen[i + 1])) {
      i++; absatz.push(zeilen[i]);
    }
    html.push('<p>' + inline(absatz.join(' ')) + '</p>');
    i++;
  }
  listeSchliessen();
  if (inCode && codeZeilen.length) html.push('<pre><code>' + escapeHtml(codeZeilen.join('\n')) + '</code></pre>');
  return html.join('\n');
}

/* Baut ein DOM-Element mit dem gezeichneten Markdown. innerHTML ist hier sicher, weil
   zuHtml() jeden Rohtext vorher durch escapeHtml() geschickt hat. */
function zeichneMarkdown(text, klasse) {
  var div = document.createElement('div');
  div.className = 'md' + (klasse ? ' ' + klasse : '');
  div.innerHTML = zuHtml(text);
  return div;
}

/* Eine Datei inline zeigen: Dateiname als Kopf, Inhalt in einem Codeblock. Fehlt die
   Datei oder ist der Ordner nicht verbunden, wird das gesagt statt nichts zu zeigen. */
function dateiAnsicht(pfad, inhaltOderNull) {
  var w = document.createElement('div');
  w.className = 'datei-ansicht';
  var kopf = document.createElement('div'); kopf.className = 'datei-kopf';
  kopf.textContent = pfad;
  w.appendChild(kopf);
  var pre = document.createElement('pre'); pre.className = 'datei-inhalt';
  var code = document.createElement('code');
  code.textContent = inhaltOderNull == null ? '(nicht lesbar, Ordner verbunden?)' : inhaltOderNull;
  pre.appendChild(code); w.appendChild(pre);
  return w;
}

window.Anzeigen = { zuHtml: zuHtml, zeichneMarkdown: zeichneMarkdown, dateiAnsicht: dateiAnsicht, escapeHtml: escapeHtml };
})();

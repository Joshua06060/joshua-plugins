/* Winziger Dateiserver zum Anschauen. Keine Abhängigkeiten.
   Start: node server.js    Dann http://localhost:4322 öffnen. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const WURZEL = __dirname;
const PORT = Number(process.env.PORT) || 4322;
const TYP = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const ziel = path.join(WURZEL, p);
  /* nichts ausserhalb des Ordners ausliefern */
  if (!ziel.startsWith(WURZEL)) { res.writeHead(403).end('nicht erlaubt'); return; }
  fs.readFile(ziel, (err, buf) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('nicht gefunden: ' + p); return; }
    res.writeHead(200, {
      'content-type': TYP[path.extname(ziel)] || 'application/octet-stream',
      'cache-control': 'no-store'
    });
    res.end(buf);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log('Ticketsystem laeuft auf http://localhost:' + PORT);
});

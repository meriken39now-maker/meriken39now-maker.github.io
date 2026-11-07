// 編集用のローカルサーバー（一時的なもの）
// 使い方: このフォルダで「node edit-server.js」→ ブラウザで http://localhost:8080 を開く
// キャラページの下に出る「保存」で characters/(フォルダ)/profile.txt の
// 背景色・[性格]・[性格チャート] を書き換えます。公開ページには影響しません。
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8080;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml", ".ico": "image/x-icon"
};

// [見出し] の中身を body で置き換える(# のメモ行は残す)。見出しが無ければ末尾に足す
function replaceSection(L, title, body) {
  const s = L.findIndex(l => l.trim() === `[${title}]`);
  if (s < 0) { L.push("", `[${title}]`, ...body); return; }
  let e = s + 1;
  while (e < L.length && !/^\[.+\]$/.test(L[e].trim())) e++;
  const memos = L.slice(s + 1, e).filter(l => /^\s*#/.test(l));
  L.splice(s + 1, e - s - 1, ...memos, ...body, "");
}

function save({ id, text, chart, bg }) {
  if (!/^[A-Za-z0-9_-]+$/.test(id || "")) throw new Error("フォルダ名が不正です");
  bg = String(bg || "").trim();
  if (bg && !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(bg)) throw new Error("カラーコードは #ffccdd の形で入力してください");
  const file = path.join(ROOT, "characters", id, "profile.txt");
  const raw = fs.readFileSync(file, "utf8");
  const nl = raw.includes("\r\n") ? "\r\n" : "\n";
  const L = raw.replace(/\r/g, "").split("\n");

  const bi = L.findIndex(l => /^背景色\s*[:：]/.test(l));
  if (bi >= 0) L[bi] = `背景色: ${bg}`;
  else L.splice(L.findIndex(l => /^システム\s*[:：]/.test(l)) + 1, 0, `背景色: ${bg}`);

  // 性格: 行頭の # や [ はメモ・見出し扱いになってしまうので全角に置き換える
  const textLines = String(text || "").replace(/\r/g, "").split("\n")
    .map(l => l.replace(/\s+$/, "").replace(/^(\s*)#/, "$1＃").replace(/^(\s*)\[/, "$1［"));
  while (textLines.length && !textLines[textLines.length - 1]) textLines.pop();
  while (textLines.length && !textLines[0]) textLines.shift();
  replaceSection(L, "性格", textLines);

  const chartLines = Object.entries(chart || {})
    .filter(([k, v]) => /^[^:\n]+:[^:\n]+$/.test(k) && Number.isInteger(v) && v >= 1 && v <= 5)
    .map(([k, v]) => `${k}: ${v}`);
  replaceSection(L, "性格チャート", chartLines);

  fs.writeFileSync(file, L.join(nl).replace(/(\r?\n){3,}/g, nl + nl));
}

http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/__save") {
    let body = "";
    req.on("data", d => { body += d; if (body.length > 1e6) req.destroy(); });
    req.on("end", () => {
      try {
        save(JSON.parse(body));
        res.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":true}');
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" }).end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }
  if (req.url === "/__edit") return res.writeHead(200, { "Content-Type": "text/plain" }).end("ok");
  let p;
  try { p = decodeURIComponent(req.url.split("?")[0]); } catch { return res.writeHead(400).end(); }
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT + path.sep) || /[\\/]\./.test(file.slice(ROOT.length))) return res.writeHead(403).end();
  fs.readFile(file, (err, data) => {
    if (err) return res.writeHead(404).end("not found");
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" }).end(data);
  });
}).listen(PORT, "127.0.0.1", () => console.log(`編集モード: http://localhost:${PORT} を開いてください（終了は Ctrl+C）`));

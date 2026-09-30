// Optional dependency-free local preview. GitHub Pages serves the static files directly.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const valueFor = (name, fallback) => {
  const index = args.indexOf(name);
  return index < 0 ? fallback : args[index + 1];
};
const host = valueFor("--host", "127.0.0.1");
const port = Number(valueFor("--port", "4173"));
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid preview port");
const root = resolve(import.meta.dirname, "..");
const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/script.js", ["script.js", "text/javascript; charset=utf-8"]],
  ["/404.html", ["404.html", "text/html; charset=utf-8"]],
  ["/robots.txt", ["robots.txt", "text/plain; charset=utf-8"]],
  ["/sitemap.xml", ["sitemap.xml", "application/xml; charset=utf-8"]]
]);

const server = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end();
      return;
    }
    const path = new URL(request.url, "http://localhost").pathname;
    const entry = files.get(path);
    const [filename, type] = entry || files.get("/404.html");
    const body = await readFile(resolve(root, filename));
    response.writeHead(entry ? 200 : 404, { "Content-Type": type, "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Preview file unavailable");
  }
});
server.on("error", error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, host, () => console.log(`Portfolio preview ready on ${host}:${port}`));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close());

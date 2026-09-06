// Shared helpers for the free-audit functions.
const { getStore, connectLambda } = require("@netlify/blobs");

const ALLOWED_ORIGIN = /^https:\/\/(www\.)?flintdigital\.ai$|^https:\/\/([a-z0-9-]+--)?flint-digital\.netlify\.app$|^http:\/\/localhost(:\d+)?$/;

function json(statusCode, body, extraHeaders) {
  return {
    statusCode,
    headers: Object.assign({ "Content-Type": "application/json", "Cache-Control": "no-store" }, extraHeaders || {}),
    body: JSON.stringify(body),
  };
}

function originAllowed(event) {
  const origin = event.headers.origin || event.headers.Origin || "";
  return ALLOWED_ORIGIN.test(origin);
}

function clientIp(event) {
  return (
    event.headers["x-nf-client-connection-ip"] ||
    (event.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown"
  );
}

// Normalise a user-typed site into { url, domain } or return null when it is not a public http(s) host.
function normalizeSite(raw) {
  if (typeof raw !== "string") return null;
  let s = raw.trim();
  if (!s || s.length > 200) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  let u;
  try { u = new URL(s); } catch (e) { return null; }
  if (!/^https?:$/.test(u.protocol)) return null;
  const host = u.hostname.toLowerCase();
  if (!host.includes(".")) return null;
  if (/^(localhost|.*\.local|.*\.internal)$/.test(host)) return null;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":")) return null; // no raw IPs
  return { url: u.origin + (u.pathname === "/" ? "" : u.pathname), domain: host.replace(/^www\./, "") };
}

// Default (eventual) consistency: strong reads are not available to legacy handlers. The page waits
// a few seconds before its first poll and keeps polling on "unknown", so this is fine in practice.
const audits = () => getStore("audits");
const limits = () => getStore("audit-limits");

// Best-effort rate limiting persisted in Blobs: per IP per hour, and a global daily cap.
async function checkLimits(ip, perIpPerHour, perDay) {
  const store = limits();
  const now = Date.now();
  const hourKey = "ip:" + ip.replace(/[^a-z0-9.:]/gi, "_");
  const dayKey = "day:" + new Date(now).toISOString().slice(0, 10);

  const ipRec = (await store.get(hourKey, { type: "json" })) || { start: now, count: 0 };
  if (now - ipRec.start > 3600e3) { ipRec.start = now; ipRec.count = 0; }
  if (ipRec.count >= perIpPerHour) return "ip";

  const dayRec = (await store.get(dayKey, { type: "json" })) || { count: 0 };
  if (dayRec.count >= perDay) return "day";

  ipRec.count += 1; dayRec.count += 1;
  await store.setJSON(hourKey, ipRec);
  await store.setJSON(dayKey, dayRec);
  return null;
}

function randomToken() {
  return require("crypto").randomBytes(16).toString("hex");
}

// Legacy (exports.handler) functions must attach the Blobs context from the event before getStore().
function connect(event) { try { connectLambda(event); } catch (e) { console.error("blobs connect failed", e && e.message); } }

function safe(handler) {
  return async (event) => {
    try { return await handler(event); }
    catch (err) { console.error("unhandled", err && err.message); return json(500, { error: "internal" }); }
  };
}

module.exports = { safe, connect, json, originAllowed, clientIp, normalizeSite, audits, checkLimits, randomToken };

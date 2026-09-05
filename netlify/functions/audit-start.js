// POST /api/audit  { id, url, name, email, phone }
// Validates the request, records a pending job, and kicks off the background audit.
const { connect, json, originAllowed, clientIp, normalizeSite, audits, checkLimits, randomToken } = require("./lib/shared");

const PER_IP_PER_HOUR = 3;
const PER_DAY = 60;

exports.handler = async (event) => {
  connect(event);
  if (event.httpMethod !== "POST") return json(405, { error: "method_not_allowed" });
  if (!originAllowed(event)) return json(403, { error: "forbidden" });

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "bad_json" }); }

  const id = typeof body.id === "string" && /^[a-z0-9-]{8,64}$/i.test(body.id) ? body.id : null;
  const site = normalizeSite(body.website || body.url);
  if (!id || !site) return json(400, { error: "invalid_input" });

  const ip = clientIp(event);
  const limited = await checkLimits(ip, PER_IP_PER_HOUR, PER_DAY);
  if (limited) return json(429, { error: "rate_limited", scope: limited });

  const token = randomToken();
  const store = audits();
  if (await store.get(id)) return json(409, { error: "duplicate_id" });
  await store.setJSON(id, {
    status: "pending",
    token,
    url: site.url,
    domain: site.domain,
    lead: {
      name: String(body.name || "").slice(0, 120),
      email: String(body.email || "").slice(0, 200),
      phone: String(body.phone || "").slice(0, 40),
    },
    ip,
    createdAt: new Date().toISOString(),
  });

  // Fire the background worker. Netlify answers 202 immediately; the worker has up to 15 minutes.
  // Dispatch to the same deploy that received this request (deploy previews have their own host),
  // never to process.env.URL, which always points at production.
  const host = event.headers["x-forwarded-host"] || event.headers.host || "www.flintdigital.ai";
  let dispatch;
  try {
    dispatch = await fetch("https://" + host + "/.netlify/functions/audit-run-background", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, token }),
    });
  } catch (e) {
    dispatch = { status: 0 };
  }
  if (dispatch.status !== 202 && dispatch.status !== 200) {
    await store.setJSON(id, { status: "error", error: "dispatch_" + dispatch.status, createdAt: new Date().toISOString() });
    return json(502, { error: "dispatch_failed", status: dispatch.status });
  }

  return json(202, { id, status: "pending" });
};

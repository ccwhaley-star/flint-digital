// GET /api/audit-result?id=...   -> { status: pending|running|done|error, result? }
const { connect, json, originAllowed, audits } = require("./lib/shared");

exports.handler = async (event) => {
  connect(event);
  if (event.httpMethod !== "GET") return json(405, { error: "method_not_allowed" });
  // Same-origin fetches from the page carry no Origin header; cross-site ones do.
  if (event.headers.origin && !originAllowed(event)) return json(403, { error: "forbidden" });

  const id = (event.queryStringParameters || {}).id || "";
  if (!/^[a-z0-9-]{8,64}$/i.test(id)) return json(400, { error: "invalid_id" });

  const rec = await audits().get(id, { type: "json" });
  if (!rec) return json(404, { status: "unknown" });

  // Never leak the dispatch token or the lead's contact details back to the browser.
  const out = { status: rec.status, domain: rec.domain };
  if (rec.status === "done") out.result = rec.result;
  if (rec.status === "error") out.error = rec.error || "failed";
  return json(200, out);
};

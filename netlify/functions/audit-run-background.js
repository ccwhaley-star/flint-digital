// Background worker (the "-background" suffix gives it a 15-minute limit and an immediate 202).
// Runs the Claude web-search audit for one job and stores the parsed result in Blobs.
const Anthropic = require("@anthropic-ai/sdk");
const { audits } = require("./lib/shared");

const MODEL = "claude-opus-5";
const MAX_SEARCHES = 6;

function buildPrompt(url, domain) {
  return [
    "You are a website auditor for Flint Digital, an AI-first digital agency in Kansas City.",
    "",
    "Audit the website: " + url + " (domain: " + domain + ")",
    "",
    "Use web search to research it. Suggested searches:",
    "1. " + domain,
    "2. The business name plus its city, to identify local competitors",
    "3. " + domain + " reviews",
    "",
    "Be specific and honest. Scores are 0-100. Findings are short, concrete sentences a business owner can act on.",
    "If you cannot determine something, say so in the finding rather than inventing it.",
    "",
    "After researching, respond with ONLY a valid JSON object. No explanation, no markdown fences. Just raw JSON with this exact structure:",
    '{"business_name":"string","domain":"' + domain + '","business_type":"string","location":"string","overall_score":0,"summary":"string",' +
      '"technical":{"platform":"string","ssl":true,"title_tag":"string","title_quality":"good","meta_quality":"good","schema_markup":false,"schema_types":[],"rich_results":false,"pages_indexed":"string","mobile_friendly":true,"score":0,"findings":["string"]},' +
      '"seo":{"score":0,"primary_keyword":"string","estimated_rank":"string","findings":["string"]},' +
      '"local_search":{"score":0,"google_reviews":"string","findings":["string"]},' +
      '"aeo":{"score":0,"ai_ready":false,"findings":["string"]},' +
      '"content":{"score":0,"findings":["string"]},' +
      '"reputation":{"score":0,"findings":["string"]},' +
      '"competitors":[{"name":"string","advantage":"string"}],' +
      '"top_3_fixes":["string","string","string"]}',
  ].join("\n");
}

function extractJSON(text) {
  try { return JSON.parse(text); } catch (e) {}
  const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  try { return JSON.parse(clean); } catch (e) {}
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
  return null;
}

async function runAudit(client, url, domain) {
  const messages = [{ role: "user", content: buildPrompt(url, domain) }];
  let response;
  for (let turn = 0; turn < 4; turn++) {
    response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: "medium" },
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_SEARCHES }],
      messages,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });
    if (response.stop_reason !== "pause_turn") break;
    // Long server-tool turn paused; hand the partial turn back and continue.
    messages.push({ role: "assistant", content: response.content });
  }
  if (response.stop_reason === "refusal") throw new Error("refused");
  const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const parsed = extractJSON(text);
  if (!parsed || !(parsed.business_name || parsed.overall_score)) throw new Error("no_json");
  return { parsed, usage: response.usage };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };
  let body;
  try { body = JSON.parse(event.body || "{}"); } catch (e) { return { statusCode: 400, body: "" }; }

  const store = audits();
  const rec = body.id ? await store.get(body.id, { type: "json" }) : null;
  if (!rec || rec.status !== "pending" || !body.token || body.token !== rec.token) {
    return { statusCode: 403, body: "" };
  }

  await store.setJSON(body.id, Object.assign({}, rec, { status: "running", startedAt: new Date().toISOString() }));

  try {
    const client = new Anthropic(); // ANTHROPIC_API_KEY from the site's environment
    const { parsed, usage } = await runAudit(client, rec.url, rec.domain);
    await store.setJSON(body.id, Object.assign({}, rec, {
      status: "done",
      result: parsed,
      usage: { input: usage && usage.input_tokens, output: usage && usage.output_tokens },
      finishedAt: new Date().toISOString(),
    }));
  } catch (err) {
    console.error("audit failed", body.id, rec.domain, err && err.message);
    await store.setJSON(body.id, Object.assign({}, rec, {
      status: "error",
      error: (err && err.message) || "failed",
      finishedAt: new Date().toISOString(),
    }));
  }
  return { statusCode: 200, body: "" };
};

/* Flint Digital — tools.js (deferred)
   The live Ask-AI / AI Visibility widget. Calls the Netlify Function proxy
   so the API key stays server-side. Nothing fetches until the user submits. */
(function(){
  "use strict";

  async function callClaude(prompt, useSearch){
    const r = await fetch("/.netlify/functions/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt, search: !!useSearch })
    });
    if(!r.ok) throw new Error(r.status);
    const d = await r.json();
    return (d.text || "").trim();
  }

  function fmt(t){
    const L = t.split("\n"); let h = "", inL = false;
    for(let raw of L){
      let l = raw.trim();
      if(!l){ if(inL){ h += "</ul>"; inL = false; } continue; }
      l = l.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if(/^[-•*]\s+/.test(l)){
        if(!inL){ h += "<ul>"; inL = true; }
        h += "<li>" + l.replace(/^[-•*]\s+/, "") + "</li>";
      } else {
        if(inL){ h += "</ul>"; inL = false; }
        h += "<p>" + l + "</p>";
      }
    }
    if(inL) h += "</ul>";
    return h;
  }

  function spin(btn, label){
    btn.disabled = true;
    btn.dataset.t = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> ' + label;
  }
  function unspin(btn){
    btn.disabled = false;
    btn.innerHTML = btn.dataset.t;
  }

  async function askAI(){
    const name = document.getElementById("q-name").value.trim();
    const city = document.getElementById("q-city").value.trim();
    const out = document.getElementById("q-out");
    const btn = document.getElementById("q-btn");
    if(!name){
      out.innerHTML = '<span class="placeholder">&#9612; Enter your business name first&hellip;</span>';
      return;
    }
    spin(btn, "Asking…");
    out.innerHTML = '<div class="ai-label"><span class="dot"></span>AI is looking you up…</div>';
    const prompt = `Search the web for the business "${name}"${city?(" in "+city):""}. Then answer honestly, as if a customer asked an AI assistant "tell me about ${name}${city?(" in "+city):""} — should I use them?". Use markdown:
**What AI can say about you** — 2-3 bullets of what you actually found (site, reviews, listings). If little, say so plainly.
**Why this matters** — one short sentence: what's missing to be recommended by AI, and that whichever competitor IS visible wins that customer instead.
Under 110 words. Plain-spoken. Never invent facts.`;
    try {
      const r = await callClaude(prompt, true);
      out.innerHTML =
        '<div class="ai-label"><span class="dot"></span>AI answer · live</div>' +
        (fmt(r) || "<p>Almost nothing came back — which is exactly the gap we close.</p>") +
        '<p class="ask-disclaimer">Live AI lookup — not a guarantee. We never invent results.</p>';
    } catch(e){
      out.innerHTML = '<div class="ai-label">Connection hiccup</div><p>Couldn\'t complete the live lookup — try again in a moment.</p>';
    }
    unspin(btn);
  }

  // Wire up — runs only on user interaction
  var btn = document.getElementById("q-btn");
  if(btn){
    btn.addEventListener("click", askAI);
    ["q-name","q-city"].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.addEventListener("keydown", function(e){ if(e.key === "Enter") askAI(); });
    });
  }
})();

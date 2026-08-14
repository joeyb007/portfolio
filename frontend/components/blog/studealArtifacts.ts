// Raw HTML for the four interactive Studeal diagrams, injected verbatim by
// ArtifactEmbed. Each block is self-contained (scoped CSS + SVG + an IIFE
// keyed by ids unique to that block) and themes itself from the CSS custom
// properties --ink / --muted / --accent set on the wrapper. Each block
// degrades to a legible static diagram when its script doesn't run.

const architecture = `
<div class="sd-arch" id="sd-arch">
<style>
  .sd-arch { --i: var(--ink, #1b1a19); --m: var(--muted, #75746e); --a: var(--accent, #46608f); max-width: 720px; margin: 2rem auto; font-family: inherit; }
  .sd-arch svg { display: block; width: 100%; height: auto; }
  .sd-arch text { font-family: inherit; fill: var(--i); }
  .sd-arch .sd-t { font-size: 14px; font-weight: 500; }
  .sd-arch .sd-s { font-size: 12px; fill: var(--m); }
  .sd-arch .sd-node rect { fill: transparent; stroke: var(--i); stroke-width: 1; }
  .sd-arch .sd-ext rect { stroke: var(--m); stroke-width: 0.75; }
  .sd-arch .sd-ext text { fill: var(--m); }
  .sd-arch .sd-redis rect { stroke-dasharray: 5 4; }
  .sd-arch .sd-edge { stroke: var(--m); stroke-width: 1; fill: none; opacity: 0.55; }
  .sd-arch .sd-node { cursor: default; outline: none; }
  .sd-arch .sd-node, .sd-arch .sd-edge { transition: opacity 0.18s ease; }
  .sd-arch.sd-active .sd-node, .sd-arch.sd-active .sd-edge { opacity: 0.22; }
  .sd-arch.sd-active .sd-lit { opacity: 1; }
  .sd-arch.sd-active .sd-edge.sd-lit { stroke: var(--a); stroke-width: 1.5; }
  .sd-arch.sd-active .sd-node.sd-lit rect { stroke: var(--a); stroke-width: 1.5; }
  .sd-arch .sd-node:focus-visible rect { stroke: var(--a); stroke-width: 2; }
  .sd-arch .sd-cap { min-height: 2.6em; margin-top: 0.35rem; font-size: 0.85rem; color: var(--m); text-align: center; line-height: 1.45; }
  .sd-arch .sd-cap strong { color: var(--i); font-weight: 500; }
</style>
<svg viewBox="0 0 680 372" role="img" aria-labelledby="sd-title sd-desc">
  <title id="sd-title">Studeal architecture</title>
  <desc id="sd-desc">Four processes in one codebase: Next.js frontend, FastAPI request path, Celery worker, and one beat process. Postgres with pgvector holds durable truth; Redis holds losable coordination. External services: Stripe, Resend, Browserbase, Bedrock.</desc>
  <defs>
    <marker id="sd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <path class="sd-edge" data-link="fastapi stripe" d="M255 128 L120 56" marker-end="url(#sd-arrow)"/>
  <path class="sd-edge" data-link="worker resend" d="M395 128 L278 56" marker-end="url(#sd-arrow)"/>
  <path class="sd-edge" data-link="worker browserbase" d="M412 128 L416 58" marker-end="url(#sd-arrow)"/>
  <path class="sd-edge" data-link="worker bedrock" d="M445 128 L556 56" marker-end="url(#sd-arrow)"/>
  <path class="sd-edge" data-link="next fastapi" d="M177 158 L191 158" marker-end="url(#sd-arrow)"/>
  <path class="sd-edge" data-link="fastapi postgres" d="M250 188 L212 286" marker-end="url(#sd-arrow)"/>
  <path class="sd-edge" data-link="fastapi redis" d="M288 188 L438 286" marker-end="url(#sd-arrow)"/>
  <path class="sd-edge" data-link="worker postgres" d="M400 188 L268 286" marker-end="url(#sd-arrow)"/>
  <path class="sd-edge" data-link="worker redis" d="M434 188 L478 286" marker-end="url(#sd-arrow)"/>
  <path class="sd-edge" data-link="beat redis" d="M560 188 L522 286" marker-end="url(#sd-arrow)"/>

  <g class="sd-node sd-ext" data-id="stripe" tabindex="0">
    <rect x="40" y="20" width="135" height="34" rx="17"/>
    <text class="sd-s" x="107.5" y="37" text-anchor="middle" dominant-baseline="central">Stripe</text>
  </g>
  <g class="sd-node sd-ext" data-id="resend" tabindex="0">
    <rect x="195" y="20" width="135" height="34" rx="17"/>
    <text class="sd-s" x="262.5" y="37" text-anchor="middle" dominant-baseline="central">Resend</text>
  </g>
  <g class="sd-node sd-ext" data-id="browserbase" tabindex="0">
    <rect x="350" y="20" width="135" height="34" rx="17"/>
    <text class="sd-s" x="417.5" y="37" text-anchor="middle" dominant-baseline="central">Browserbase</text>
  </g>
  <g class="sd-node sd-ext" data-id="bedrock" tabindex="0">
    <rect x="505" y="20" width="135" height="34" rx="17"/>
    <text class="sd-s" x="572.5" y="37" text-anchor="middle" dominant-baseline="central">Bedrock</text>
  </g>

  <g class="sd-node" data-id="next" tabindex="0">
    <rect x="40" y="130" width="135" height="58" rx="8"/>
    <text class="sd-t" x="107.5" y="152" text-anchor="middle" dominant-baseline="central">Next.js</text>
    <text class="sd-s" x="107.5" y="171" text-anchor="middle" dominant-baseline="central">frontend</text>
  </g>
  <g class="sd-node" data-id="fastapi" tabindex="0">
    <rect x="195" y="130" width="135" height="58" rx="8"/>
    <text class="sd-t" x="262.5" y="152" text-anchor="middle" dominant-baseline="central">FastAPI</text>
    <text class="sd-s" x="262.5" y="171" text-anchor="middle" dominant-baseline="central">request path</text>
  </g>
  <g class="sd-node" data-id="worker" tabindex="0">
    <rect x="350" y="130" width="135" height="58" rx="8"/>
    <text class="sd-t" x="417.5" y="152" text-anchor="middle" dominant-baseline="central">Celery worker</text>
    <text class="sd-s" x="417.5" y="171" text-anchor="middle" dominant-baseline="central">work path</text>
  </g>
  <g class="sd-node" data-id="beat" tabindex="0">
    <rect x="505" y="130" width="135" height="58" rx="8"/>
    <text class="sd-t" x="572.5" y="152" text-anchor="middle" dominant-baseline="central">Beat</text>
    <text class="sd-s" x="572.5" y="171" text-anchor="middle" dominant-baseline="central">the clock, exactly one</text>
  </g>

  <g class="sd-node" data-id="postgres" tabindex="0">
    <rect x="120" y="288" width="200" height="58" rx="8"/>
    <text class="sd-t" x="220" y="310" text-anchor="middle" dominant-baseline="central">Postgres + pgvector</text>
    <text class="sd-s" x="220" y="329" text-anchor="middle" dominant-baseline="central">durable truth</text>
  </g>
  <g class="sd-node sd-redis" data-id="redis" tabindex="0">
    <rect x="380" y="288" width="200" height="58" rx="8"/>
    <text class="sd-t" x="480" y="310" text-anchor="middle" dominant-baseline="central">Redis</text>
    <text class="sd-s" x="480" y="329" text-anchor="middle" dominant-baseline="central">losable coordination</text>
  </g>
</svg>
<div class="sd-cap" id="sd-cap">Hover a component. Solid borders are durable; the dashed one is losable: wipe it and nothing a user cares about is gone.</div>
<script>
(function () {
  var root = document.getElementById('sd-arch');
  var cap = document.getElementById('sd-cap');
  var idle = cap.innerHTML;
  var captions = {
    next: '<strong>Next.js.</strong> The face. httpOnly cookie outside, bearer JWT inside; browser JS never touches a credential.',
    fastapi: '<strong>FastAPI.</strong> Answers in milliseconds. Anything slow gets pushed onto the queue instead of the request path.',
    worker: '<strong>Celery worker.</strong> Where hunts actually run: browsing, extraction, embeddings, ranking, alerts.',
    beat: '<strong>Beat.</strong> Exactly one, forever. Two beats double every cron; zero beats is the silent death of everything time-driven.',
    postgres: '<strong>Postgres + pgvector.</strong> Listings, hunts, intent vectors, rankings. If it matters tomorrow, it lives here.',
    redis: '<strong>Redis.</strong> Losable by design: task queues, the fleet governor, daily spend ledgers, live event pub/sub. Wipe it and no durable state is lost; queues refill, governors reset, and everything else rebuilds from Postgres.',
    bedrock: '<strong>Bedrock.</strong> Sonnet for judgment, Haiku for mechanical work, Titan multimodal for embeddings.',
    browserbase: '<strong>Browserbase.</strong> Remote Chrome over CDP with rotating proxies. No Chromium ships in the image.',
    stripe: '<strong>Stripe.</strong> Subscriptions, billing portal, signature-verified webhooks driving the Pro flag.',
    resend: '<strong>Resend.</strong> Alert emails, price-drop pings, the daily digest.'
  };
  var nodes = root.querySelectorAll('.sd-node');
  var edges = root.querySelectorAll('.sd-edge');
  function lit(id) {
    root.classList.add('sd-active');
    nodes.forEach(function (n) {
      var hit = n.dataset.id === id;
      edges.forEach(function (e) {
        var ids = e.dataset.link.split(' ');
        if (ids.indexOf(id) > -1) {
          e.classList.add('sd-lit');
          if (ids.indexOf(n.dataset.id) > -1) hit = true;
        }
      });
      n.classList.toggle('sd-lit', hit);
    });
    cap.innerHTML = captions[id] || idle;
  }
  function reset() {
    root.classList.remove('sd-active');
    nodes.forEach(function (n) { n.classList.remove('sd-lit'); });
    edges.forEach(function (e) { e.classList.remove('sd-lit'); });
    cap.innerHTML = idle;
  }
  nodes.forEach(function (n) {
    n.addEventListener('mouseenter', function () { lit(n.dataset.id); });
    n.addEventListener('focus', function () { lit(n.dataset.id); });
    n.addEventListener('mouseleave', reset);
    n.addEventListener('blur', reset);
  });
})();
</script>
</div>`

const conversationFsm = `
<div class="sd-cv" id="sd-cv">
<style>
  .sd-cv { --i: var(--ink, #1b1a19); --m: var(--muted, #75746e); --a: var(--accent, #46608f); max-width: 720px; margin: 2rem auto; font-family: inherit; color: var(--i); }
  .sd-cv svg { display: block; width: 100%; height: auto; }
  .sd-cv text { font-family: inherit; fill: var(--i); }
  .sd-cv .cv-t { font-size: 14px; font-weight: 500; }
  .sd-cv .cv-s { font-size: 12px; fill: var(--m); }
  .sd-cv .cv-lbl { font-size: 11px; fill: var(--m); }
  .sd-cv .cv-node rect { fill: transparent; stroke: var(--i); stroke-width: 1; }
  .sd-cv .cv-term rect { stroke: var(--m); stroke-width: 0.75; stroke-dasharray: 5 4; }
  .sd-cv .cv-term text { fill: var(--m); }
  .sd-cv .cv-edge { stroke: var(--m); stroke-width: 1; fill: none; opacity: 0.55; }
  .sd-cv .cv-node { cursor: default; outline: none; }
  .sd-cv .cv-node, .sd-cv .cv-edge, .sd-cv .cv-lbl { transition: opacity 0.18s ease; }
  .sd-cv.cv-active .cv-node, .sd-cv.cv-active .cv-edge, .sd-cv.cv-active .cv-lbl { opacity: 0.22; }
  .sd-cv.cv-active .cv-lit { opacity: 1; }
  .sd-cv.cv-active .cv-edge.cv-lit { stroke: var(--a); stroke-width: 1.5; }
  .sd-cv.cv-active .cv-node.cv-lit rect { stroke: var(--a); stroke-width: 1.5; }
  .sd-cv .cv-node:focus-visible rect { stroke: var(--a); stroke-width: 2; }
  .sd-cv .cv-cap { min-height: 2.6em; margin-top: 0.35rem; font-size: 0.85rem; color: var(--m); text-align: center; line-height: 1.45; }
  .sd-cv .cv-cap strong { color: var(--i); font-weight: 500; }
</style>

<div id="cv-view-diagram">
<svg viewBox="0 0 680 460" role="img" aria-labelledby="cv-title cv-desc">
  <title id="cv-title">Scout's conversation flow</title>
  <desc id="cv-desc">Scout re-reads the conversation every turn. If it doesn't know enough, it asks one question and waits for the answer. Once it knows the product plus one real constraint, it runs a few one-time follow-ups, locks in the spec, and the hunt begins. Off-topic input ends the chat; running out of turns forces a wrap-up.</desc>
  <defs>
    <marker id="cv-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <path class="cv-edge" data-link="gate ask" d="M280 92 L280 120 L135 120 L135 146" marker-end="url(#cv-arrow)"/>
  <path class="cv-edge" data-link="ask gate" d="M135 210 L135 240 L20 240 L20 61 L228 61" marker-end="url(#cv-arrow)"/>
  <path class="cv-edge" data-link="gate beats" d="M340 92 L340 188" marker-end="url(#cv-arrow)"/>
  <path class="cv-edge" data-link="beats" d="M450 207 C 505 202 505 240 452 235" marker-end="url(#cv-arrow)"/>
  <path class="cv-edge" data-link="beats close" d="M340 252 L340 298" marker-end="url(#cv-arrow)"/>
  <path class="cv-edge" data-link="gate aborted" d="M450 52 L518 52" marker-end="url(#cv-arrow)"/>
  <path class="cv-edge" data-link="gate close" d="M450 88 L630 88 L630 331 L442 331" marker-end="url(#cv-arrow)"/>
  <path class="cv-edge" data-link="close complete" d="M340 362 L340 394" marker-end="url(#cv-arrow)"/>

  <text class="cv-lbl" x="207" y="112" text-anchor="middle">missing something</text>
  <text class="cv-lbl" x="124" y="51" text-anchor="middle">the user answers</text>
  <text class="cv-lbl" x="348" y="145" text-anchor="start">knows enough</text>
  <text class="cv-lbl" x="510" y="226" text-anchor="start">one follow-up per turn</text>
  <text class="cv-lbl" x="348" y="280" text-anchor="start">nothing left to ask</text>
  <text class="cv-lbl" x="540" y="102" text-anchor="middle">out of turns: wrap up anyway</text>

  <g class="cv-node" data-id="gate" tabindex="0">
    <rect x="230" y="30" width="220" height="62" rx="8"/>
    <text class="cv-t" x="340" y="53" text-anchor="middle" dominant-baseline="central">Does Scout know enough?</text>
    <text class="cv-s" x="340" y="72" text-anchor="middle" dominant-baseline="central">the WHAT, plus one real constraint</text>
  </g>
  <g class="cv-node" data-id="ask" tabindex="0">
    <rect x="40" y="148" width="190" height="62" rx="8"/>
    <text class="cv-t" x="135" y="171" text-anchor="middle" dominant-baseline="central">Ask one question</text>
    <text class="cv-s" x="135" y="190" text-anchor="middle" dominant-baseline="central">react like a friend first</text>
  </g>
  <g class="cv-node" data-id="beats" tabindex="0">
    <rect x="230" y="190" width="220" height="62" rx="8"/>
    <text class="cv-t" x="340" y="213" text-anchor="middle" dominant-baseline="central">Quick follow-ups</text>
    <text class="cv-s" x="340" y="232" text-anchor="middle" dominant-baseline="central">looks · condition · must-haves</text>
  </g>
  <g class="cv-node" data-id="close" tabindex="0">
    <rect x="240" y="300" width="200" height="62" rx="8"/>
    <text class="cv-t" x="340" y="323" text-anchor="middle" dominant-baseline="central">Lock in the spec</text>
    <text class="cv-s" x="340" y="342" text-anchor="middle" dominant-baseline="central">good enough beats complete</text>
  </g>
  <g class="cv-node cv-term" data-id="complete" tabindex="0">
    <rect x="262" y="396" width="156" height="46" rx="23"/>
    <text class="cv-s" x="340" y="419" text-anchor="middle" dominant-baseline="central">The hunt begins</text>
  </g>
  <g class="cv-node cv-term" data-id="aborted" tabindex="0">
    <rect x="520" y="28" width="140" height="48" rx="24"/>
    <text class="cv-s" x="590" y="45" text-anchor="middle" dominant-baseline="central">Walk away</text>
    <text class="cv-lbl" x="590" y="62" text-anchor="middle" dominant-baseline="central">off-topic or hostile</text>
  </g>
</svg>
</div>

<div class="cv-cap" id="cv-cap">Hover a step. Every turn, Scout re-reads the whole chat and either asks one question or gets on with the hunt.</div>
<script>
(function () {
  var root = document.getElementById('sd-cv');
  var cap = document.getElementById('cv-cap');
  var idle = cap.innerHTML;
  var captions = {
    gate: '<strong>Does Scout know enough?</strong> Scout has no memory of its own: it re-reads the entire conversation every turn, then checks one thing before writing a word — do I know WHAT they want, plus ONE real constraint (a budget, a brand, a condition)?',
    ask: '<strong>Ask one question.</strong> React like a friend first, then ask the single most valuable question. "What\\'s driving the upgrade?" beats an intake form — the answer comes back with budgets and pain points attached.',
    beats: '<strong>Quick follow-ups.</strong> What it should look like, how picky you are about wear, any must-haves ("you right-handed? full set with a bag?"). Each fires at most once — a chat, not an interrogation.',
    close: '<strong>Lock in the spec.</strong> The conversation doesn\\'t need to be complete, just sufficient: validators clean up anything the model got wrong, and the ranker resolves the rest downstream.',
    complete: '<strong>The hunt begins.</strong> The finished spec becomes a plain-English paragraph, gets embedded as a vector, and the browser fleet goes to work.',
    aborted: '<strong>Walk away.</strong> Gibberish, hostile, or non-shopping input ends the chat — judged conservatively: anything that could be a real answer to Scout\\'s question is never treated as an abort.'
  };
  var nodes = root.querySelectorAll('.cv-node');
  var edges = root.querySelectorAll('.cv-edge');
  function lit(id) {
    root.classList.add('cv-active');
    nodes.forEach(function (n) {
      var hit = n.dataset.id === id;
      edges.forEach(function (e) {
        var ids = e.dataset.link.split(' ');
        if (ids.indexOf(id) > -1) {
          e.classList.add('cv-lit');
          if (ids.indexOf(n.dataset.id) > -1) hit = true;
        }
      });
      n.classList.toggle('cv-lit', hit);
    });
    cap.innerHTML = captions[id] || idle;
  }
  function reset() {
    root.classList.remove('cv-active');
    nodes.forEach(function (n) { n.classList.remove('cv-lit'); });
    edges.forEach(function (e) { e.classList.remove('cv-lit'); });
    cap.innerHTML = idle;
  }
  nodes.forEach(function (n) {
    n.addEventListener('mouseenter', function () { lit(n.dataset.id); });
    n.addEventListener('focus', function () { lit(n.dataset.id); });
    n.addEventListener('mouseleave', reset);
    n.addEventListener('blur', reset);
  });
})();
</script>
</div>`

const axTree = `
<div class="sd-ax" id="sd-ax">
<style>
  .sd-ax { --i: var(--ink, #1b1a19); --m: var(--muted, #75746e); --a: var(--accent, #46608f); max-width: 720px; margin: 2rem auto; font-family: inherit; color: var(--i); }
  .sd-ax .ax-panes { display: flex; gap: 14px; align-items: stretch; }
  .sd-ax .ax-pane { flex: 1 1 0; border: 1px solid var(--m); border-radius: 10px; padding: 12px; min-width: 0; }
  .sd-ax .ax-pane h4 { margin: 0 0 10px; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--m); }
  @media (max-width: 560px) { .sd-ax .ax-panes { flex-direction: column; } }

  /* mock page */
  .sd-ax .pg-head { font-size: 0.72rem; color: var(--m); margin-bottom: 8px; }
  .sd-ax .pg-search { display: flex; gap: 6px; margin-bottom: 10px; }
  .sd-ax .pg-input { flex: 1; border: 1px solid var(--m); border-radius: 6px; padding: 5px 8px; font-size: 0.78rem; color: var(--m); }
  .sd-ax .pg-btn { border: 1px solid var(--i); border-radius: 6px; padding: 5px 10px; font-size: 0.78rem; }
  .sd-ax .pg-card { display: flex; gap: 8px; align-items: center; border: 1px solid color-mix(in srgb, var(--m) 45%, transparent); border-radius: 8px; padding: 7px; margin-bottom: 7px; }
  .sd-ax .pg-thumb { width: 34px; height: 34px; border-radius: 6px; background: color-mix(in srgb, var(--m) 25%, transparent); flex: none; }
  .sd-ax .pg-title { font-size: 0.78rem; line-height: 1.25; }
  .sd-ax .pg-price { font-size: 0.74rem; color: var(--m); }
  .sd-ax .pg-next { display: inline-block; margin-top: 2px; font-size: 0.78rem; text-decoration: underline; text-underline-offset: 2px; }

  /* tree */
  .sd-ax .ax-tree { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 0.7rem; line-height: 1.75; white-space: nowrap; overflow-x: auto; }
  .sd-ax .ax-line { border-radius: 4px; padding: 0 4px; }
  .sd-ax .ax-line .b { color: var(--a); }
  .sd-ax .ax-mut { color: var(--m); }

  /* interaction */
  .sd-ax [data-ref] { cursor: default; outline: none; transition: opacity 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
  .sd-ax.ax-active [data-ref], .sd-ax.ax-active .ax-mut { opacity: 0.3; }
  .sd-ax.ax-active [data-ref].ax-lit { opacity: 1; }
  .sd-ax.ax-active .pg-card.ax-lit, .sd-ax.ax-active .pg-input.ax-lit, .sd-ax.ax-active .pg-btn.ax-lit, .sd-ax.ax-active .pg-next.ax-lit { border-color: var(--a); box-shadow: 0 0 0 1px var(--a); }
  .sd-ax.ax-active .ax-line.ax-lit { background: color-mix(in srgb, var(--a) 14%, transparent); }
  .sd-ax [data-ref]:focus-visible { box-shadow: 0 0 0 2px var(--a); }

  .sd-ax .ax-cap { min-height: 3.2em; margin-top: 0.6rem; font-size: 0.85rem; color: var(--m); text-align: center; line-height: 1.5; }
  .sd-ax .ax-cap strong { color: var(--i); font-weight: 500; }
  .sd-ax .ax-cap code { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 0.78em; border: 1px solid var(--m); border-radius: 999px; padding: 0.1em 0.6em; white-space: nowrap; }
</style>

<div class="ax-panes">
  <div class="ax-pane">
    <h4>The page, as rendered</h4>
    <div class="pg-head">kijiji.ca · results for "golf clubs"</div>
    <div class="pg-search">
      <div class="pg-input" data-ref="17" tabindex="0">golf clubs</div>
      <div class="pg-btn" data-ref="21" tabindex="0">Search</div>
    </div>
    <div class="pg-card" data-ref="51" tabindex="0">
      <div class="pg-thumb"></div>
      <div><div class="pg-title">TaylorMade M4 Driver</div><div class="pg-price">$180 · Mississauga</div></div>
    </div>
    <div class="pg-card" data-ref="64" tabindex="0">
      <div class="pg-thumb"></div>
      <div><div class="pg-title">Callaway Left Hand Driver (NEW)</div><div class="pg-price">$150 · Toronto</div></div>
    </div>
    <div class="pg-card" data-ref="77" tabindex="0">
      <div class="pg-thumb"></div>
      <div><div class="pg-title">Golf club set with bag</div><div class="pg-price">$220 · Oakville</div></div>
    </div>
    <span class="pg-next" data-ref="43" tabindex="0">Next ›</span>
  </div>

  <div class="ax-pane">
    <h4>The page, as the agent reads it</h4>
    <div class="ax-tree">
      <div class="ax-line ax-mut">RootWebArea "Kijiji: golf clubs"</div>
      <div class="ax-line" data-ref="17" tabindex="0">&nbsp;&nbsp;<span class="b">[17]</span>&lt;input type="text"/&gt; "golf clubs"</div>
      <div class="ax-line" data-ref="21" tabindex="0">&nbsp;&nbsp;<span class="b">[21]</span>&lt;button&gt; "Search"</div>
      <div class="ax-line ax-mut">&nbsp;&nbsp;grid "results"</div>
      <div class="ax-line" data-ref="51" tabindex="0">&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">[51]</span>&lt;a&gt; "TaylorMade M4 Driver $180"</div>
      <div class="ax-line" data-ref="64" tabindex="0">&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">[64]</span>&lt;a&gt; "Callaway Left Hand Driver (NEW) $150"</div>
      <div class="ax-line" data-ref="77" tabindex="0">&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">[77]</span>&lt;a&gt; "Golf club set with bag $220"</div>
      <div class="ax-line" data-ref="43" tabindex="0">&nbsp;&nbsp;<span class="b">[43]</span>&lt;a&gt; "Next"</div>
    </div>
  </div>
</div>

<div class="ax-cap" id="ax-cap">Hover anything on either side. Interactive elements get an <strong>[id]</strong>; the agent's entire action space is those ids. No pixels, no selectors: brackets and text.</div>

<script>
(function () {
  var root = document.getElementById('sd-ax');
  var cap = document.getElementById('ax-cap');
  var idle = cap.innerHTML;
  var captions = {
    "17": '<strong>The search box.</strong> Same element, same id, both sides. <code>{"action":"type","id":17,"text":"golf clubs"}</code>',
    "21": '<strong>Submit.</strong> One JSON action per turn, nothing else. <code>{"action":"click","id":21}</code>',
    "51": '<strong>A listing card.</strong> The explorer rarely clicks these: the whole page is snapshotted to the extractor queue instead. <code>{"action":"click","id":51}</code>',
    "64": '<strong>The Callaway.</strong> Title never says golf; the embedding section deals with that. <code>{"action":"click","id":64}</code>',
    "77": '<strong>Another card.</strong> Cards are recognized by anchor + price density, not by any Kijiji-specific selector. <code>{"action":"click","id":77}</code>',
    "43": '<strong>Pagination.</strong> Coverage is the explorer\\'s whole job. <code>{"action":"click","id":43}</code>'
  };
  var all = root.querySelectorAll('[data-ref]');
  function lit(ref) {
    root.classList.add('ax-active');
    all.forEach(function (n) { n.classList.toggle('ax-lit', n.dataset.ref === ref); });
    cap.innerHTML = captions[ref] || idle;
  }
  function reset() {
    root.classList.remove('ax-active');
    all.forEach(function (n) { n.classList.remove('ax-lit'); });
    cap.innerHTML = idle;
  }
  all.forEach(function (n) {
    n.addEventListener('mouseenter', function () { lit(n.dataset.ref); });
    n.addEventListener('focus', function () { lit(n.dataset.ref); });
    n.addEventListener('mouseleave', reset);
    n.addEventListener('blur', reset);
  });
})();
</script>
</div>`

const chunking = `
<div class="sd-ck" id="sd-ck">
<style>
  .sd-ck { --i: var(--ink, #1b1a19); --m: var(--muted, #75746e); --a: var(--accent, #46608f); max-width: 720px; margin: 2rem auto; font-family: inherit; color: var(--i); }
  .sd-ck svg { display: block; width: 100%; height: auto; }
  .sd-ck text { font-family: inherit; fill: var(--i); }
  .sd-ck .ck-t { font-size: 13px; font-weight: 500; }
  .sd-ck .ck-s { font-size: 11px; fill: var(--m); }
  .sd-ck .ck-page { fill: none; stroke: var(--i); stroke-width: 1; }
  .sd-ck .ck-chrome { fill: var(--m); opacity: 0.18; }
  .sd-ck .ck-card { fill: var(--m); opacity: 0.35; }
  .sd-ck .ck-win { fill: var(--a); opacity: 0.14; stroke: var(--a); stroke-width: 1.5; stroke-dasharray: 6 4; }
  .sd-ck .ck-chunk { fill: var(--a); opacity: 0.10; stroke: var(--a); stroke-width: 1; }
  .sd-ck .ck-res { font-size: 13px; font-weight: 500; }
  .sd-ck .ck-hot { cursor: default; outline: none; transition: opacity 0.15s ease; }
  .sd-ck.ck-active .ck-hot, .sd-ck.ck-active .ck-dim { opacity: 0.25; }
  .sd-ck.ck-active .ck-lit { opacity: 1; }
  .sd-ck.ck-active rect.ck-lit.ck-win { opacity: 0.22; }
  .sd-ck.ck-active rect.ck-lit.ck-chunk { opacity: 0.2; }
  .sd-ck .ck-hot:focus-visible { outline: 2px solid var(--a); }
  .sd-ck .ck-cap { min-height: 2.6em; margin-top: 0.35rem; font-size: 0.85rem; color: var(--m); text-align: center; line-height: 1.45; }
  .sd-ck .ck-cap strong { color: var(--i); font-weight: 500; }
</style>
<svg viewBox="0 0 680 460" role="img" aria-labelledby="ck-title ck-desc">
  <title id="ck-title">One page, two ways to read it</title>
  <desc id="ck-desc">A 137,000-character page snapshot read with a single 18k window yields 13 offers; read with overlapping 9k enumeration-sized chunks it yields 106.</desc>

  <text class="ck-t" x="225" y="34" text-anchor="middle">Single 18k window</text>
  <text class="ck-t" x="495" y="34" text-anchor="middle">Overlapped 9k chunks</text>

  <g class="ck-hot ck-ruler" tabindex="0">
    <path d="M120 50 L108 50 L108 380 L120 380" fill="none" stroke="var(--m)" stroke-width="1"/>
    <text class="ck-s" x="100" y="215" text-anchor="middle" transform="rotate(-90 100 215)">137,000 characters</text>
  </g>

  <!-- left page -->
  <g class="ck-dim">
    <rect class="ck-page" x="150" y="50" width="150" height="330" rx="6"/>
  </g>
  <g class="ck-hot ck-chrome-l" tabindex="0">
    <rect class="ck-chrome" x="151" y="51" width="148" height="44" rx="5"/>
    <text class="ck-s" x="225" y="76" text-anchor="middle">nav · filters · footer</text>
  </g>
  <g class="ck-dim">
    <rect class="ck-card" x="162" y="106" width="38" height="24" rx="3"/><rect class="ck-card" x="206" y="106" width="38" height="24" rx="3"/><rect class="ck-card" x="250" y="106" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="162" y="140" width="38" height="24" rx="3"/><rect class="ck-card" x="206" y="140" width="38" height="24" rx="3"/><rect class="ck-card" x="250" y="140" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="162" y="174" width="38" height="24" rx="3"/><rect class="ck-card" x="206" y="174" width="38" height="24" rx="3"/><rect class="ck-card" x="250" y="174" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="162" y="208" width="38" height="24" rx="3"/><rect class="ck-card" x="206" y="208" width="38" height="24" rx="3"/><rect class="ck-card" x="250" y="208" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="162" y="242" width="38" height="24" rx="3"/><rect class="ck-card" x="206" y="242" width="38" height="24" rx="3"/><rect class="ck-card" x="250" y="242" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="162" y="276" width="38" height="24" rx="3"/><rect class="ck-card" x="206" y="276" width="38" height="24" rx="3"/><rect class="ck-card" x="250" y="276" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="162" y="310" width="38" height="24" rx="3"/><rect class="ck-card" x="206" y="310" width="38" height="24" rx="3"/><rect class="ck-card" x="250" y="310" width="38" height="24" rx="3"/>
  </g>
  <g class="ck-hot ck-window" tabindex="0">
    <rect class="ck-win" x="146" y="46" width="158" height="56" rx="6"/>
    <text class="ck-s" x="312" y="60" text-anchor="start" fill="var(--a)">the whole prompt</text>
  </g>
  <g class="ck-hot ck-res13" tabindex="0">
    <text class="ck-res" x="225" y="412" text-anchor="middle">13 offers</text>
  </g>

  <!-- right page -->
  <g class="ck-dim">
    <rect class="ck-page" x="420" y="50" width="150" height="330" rx="6"/>
    <rect class="ck-chrome" x="421" y="51" width="148" height="44" rx="5"/>
    <text class="ck-s" x="495" y="76" text-anchor="middle">nav · filters · footer</text>
    <rect class="ck-card" x="432" y="106" width="38" height="24" rx="3"/><rect class="ck-card" x="476" y="106" width="38" height="24" rx="3"/><rect class="ck-card" x="520" y="106" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="432" y="140" width="38" height="24" rx="3"/><rect class="ck-card" x="476" y="140" width="38" height="24" rx="3"/><rect class="ck-card" x="520" y="140" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="432" y="174" width="38" height="24" rx="3"/><rect class="ck-card" x="476" y="174" width="38" height="24" rx="3"/><rect class="ck-card" x="520" y="174" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="432" y="208" width="38" height="24" rx="3"/><rect class="ck-card" x="476" y="208" width="38" height="24" rx="3"/><rect class="ck-card" x="520" y="208" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="432" y="242" width="38" height="24" rx="3"/><rect class="ck-card" x="476" y="242" width="38" height="24" rx="3"/><rect class="ck-card" x="520" y="242" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="432" y="276" width="38" height="24" rx="3"/><rect class="ck-card" x="476" y="276" width="38" height="24" rx="3"/><rect class="ck-card" x="520" y="276" width="38" height="24" rx="3"/>
    <rect class="ck-card" x="432" y="310" width="38" height="24" rx="3"/><rect class="ck-card" x="476" y="310" width="38" height="24" rx="3"/><rect class="ck-card" x="520" y="310" width="38" height="24" rx="3"/>
  </g>
  <g class="ck-hot ck-chunks" tabindex="0">
    <rect class="ck-chunk" x="414" y="46" width="162" height="68" rx="6"/>
    <rect class="ck-chunk" x="424" y="102" width="162" height="68" rx="6"/>
    <rect class="ck-chunk" x="414" y="158" width="162" height="68" rx="6"/>
    <rect class="ck-chunk" x="424" y="214" width="162" height="68" rx="6"/>
    <rect class="ck-chunk" x="414" y="270" width="162" height="68" rx="6"/>
    <rect class="ck-chunk" x="424" y="326" width="162" height="60" rx="6"/>
    <text class="ck-s" x="590" y="140" text-anchor="start" fill="var(--a)">overlaps</text>
  </g>
  <g class="ck-hot ck-res106" tabindex="0">
    <text class="ck-res" x="495" y="412" text-anchor="middle">106 offers</text>
  </g>

  <text class="ck-s" x="360" y="215" text-anchor="middle">same page,</text>
  <text class="ck-s" x="360" y="230" text-anchor="middle">same model</text>
</svg>
<div class="ck-cap" id="ck-cap">The same Facebook results page, read two ways. Hover a region. (Not to scale: at true scale there'd be ~15 chunks.)</div>
<script>
(function () {
  var root = document.getElementById('sd-ck');
  var cap = document.getElementById('ck-cap');
  var idle = cap.innerHTML;
  var map = [
    ['ck-ruler', '<strong>The snapshot.</strong> One eBay results page serializes to 137,000 characters of accessibility tree.'],
    ['ck-chrome-l', '<strong>Chrome.</strong> The first ~18,000 characters are nav, filters, and footer boilerplate: zero listings.'],
    ['ck-window', '<strong>The single window.</strong> Truncate to 18k and the prompt is mostly chrome. The grid below never enters the model. It isn\\'t confused; it\\'s blind.'],
    ['ck-res13', '<strong>13 offers.</strong> Not a model failure: the listings were simply never in the prompt.'],
    ['ck-chunks', '<strong>Overlapped 9k chunks.</strong> Each carries the page head so it knows what page it\\'s reading; the overlap means no listing card straddles a boundary. Sized for reliable enumeration, not the context limit.'],
    ['ck-res106', '<strong>106 offers.</strong> Same page, same model. Duplicates across chunk boundaries are free: persistence dedupes on canonical URL.']
  ];
  var caps = {};
  map.forEach(function (p) { caps[p[0]] = p[1]; });
  var hots = root.querySelectorAll('.ck-hot');
  function keyOf(n) { var k = null; n.classList.forEach(function (c) { if (caps[c]) k = c; }); return k; }
  function lit(n) {
    root.classList.add('ck-active');
    hots.forEach(function (h) { h.classList.toggle('ck-lit', h === n); });
    cap.innerHTML = caps[keyOf(n)] || idle;
  }
  function reset() {
    root.classList.remove('ck-active');
    hots.forEach(function (h) { h.classList.remove('ck-lit'); });
    cap.innerHTML = idle;
  }
  hots.forEach(function (n) {
    n.addEventListener('mouseenter', function () { lit(n); });
    n.addEventListener('focus', function () { lit(n); });
    n.addEventListener('mouseleave', reset);
    n.addEventListener('blur', reset);
  });
})();
</script>
</div>`

export const STUDEAL_ARTIFACTS = {
  architecture,
  conversationFsm,
  axTree,
  chunking,
} as const

export type StudealArtifactName = keyof typeof STUDEAL_ARTIFACTS

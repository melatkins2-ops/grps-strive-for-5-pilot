/* Strive for Less Than 5 — app layer (Nov 2026 rebuild).
   Uses the content and engine in engine.js (rolePathways, resources, matcherNeeds,
   interventionMap, communityLinks, tierFromPct, scenarios, renderScenario,
   renderResources, openDetail, downloadPlan). Everything a person enters stays in
   this browser (localStorage); nothing is sent anywhere. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { toast('Could not save in this browser (storage is blocked or full).'); return false; } }
  };
  let toastTimer;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); }

  /* ---------- dates: school days ---------- */
  const iso = (d) => d.toISOString().slice(0, 10);
  const parseDay = (s) => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d, 12); };
  const today = () => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; };
  function addSchoolDays(start, n) { const d = parseDay(start); let added = 0; while (added < n) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w !== 0 && w !== 6) added++; } return iso(d); }
  function schoolDaysBetween(a, b) { const s = parseDay(a), e = parseDay(b); if (e <= s) return 0; let n = 0; const d = new Date(s); while (d < e) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w !== 0 && w !== 6) n++; } return n; }
  const nice = (s) => parseDay(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  /* ---------- tiers ---------- */
  function tierInfo(pct) {
    const t = tierFromPct(Number(pct));
    if (!t) return null;
    return Object.assign({ cls: t.tier === 'Tier 1' ? 't1' : t.tier === 'Tier 2' ? 't2' : 't3' }, t);
  }
  const tierPill = (pct) => { const t = tierInfo(pct); return t ? `<span class="tier ${t.cls}">${t.tier} · ${Number(pct).toFixed(1).replace(/\.0$/, '')}%</span>` : ''; };

  /* ---------- roles ---------- */
  const ROLE_ACTIONS = {
    'Principal / School Leader': ['data', 'cases', 'team', 'support', 'practice', 'library'],
    'Teacher': ['support', 'library', 'practice', 'cases', 'team', 'data'],
    'Family Support Specialist': ['cases', 'support', 'library', 'practice', 'data', 'team'],
    'KSSN Coordinator': ['cases', 'support', 'library', 'practice', 'team', 'data'],
    'Secretary / Attendance Staff': ['data', 'support', 'library', 'cases', 'practice', 'team'],
    'Social Worker / Counselor': ['support', 'cases', 'practice', 'library', 'team', 'data'],
    'Attendance Team': ['cases', 'data', 'team', 'support', 'library', 'practice'],
    'District/Department Staff': ['data', 'team', 'library', 'practice', 'support', 'cases'],
    'Other': ['support', 'library', 'team', 'practice', 'cases', 'data']
  };
  const ACTIONS = {
    support: { ico: '✚', title: 'Support a scholar', text: 'Guided steps from attendance level to a matched plan.', href: '#support' },
    cases: { ico: '☰', title: 'Cases & reviews', text: 'Active plans and 10/20/30-day checkpoints.', href: '#cases' },
    data: { ico: '▤', title: 'School attendance picture', text: 'Upload an export to see tiers, patterns and who needs follow-up.', href: '#data' },
    library: { ico: '⌕', title: 'Find a resource', text: 'Describe the situation in everyday words.', href: '#library' },
    practice: { ico: '◎', title: 'Practice a case', text: 'Make the call, then compare with the team response.', href: '#practice' },
    team: { ico: '✦', title: 'Attendance Team tools', text: 'Workflow, tiers, decisions, partners and downloads.', href: '#team' }
  };
  const COMMON_NEEDS = ['No ride to school', 'Anxious about coming to school', 'Missing one class', 'Misses every Monday', 'Absences are excused so they do not count', 'Family was evicted', 'Keeps coming late'];
  const getRole = () => store.get('s5_role', null);

  const ROLE_SHORT = {
    'Principal / School Leader': 'Schoolwide conditions and the Attendance Team',
    'Teacher': 'Daily attendance, outreach and belonging',
    'Family Support Specialist': 'Family barriers, home visits and resources',
    'KSSN Coordinator': 'Wraparound and community resources',
    'Secretary / Attendance Staff': 'Records and unverified absences',
    'Social Worker / Counselor': 'Avoidance, safety and connection',
    'Attendance Team': 'Tier 2 plans and reviews; Tier 3 with FSS',
    'District/Department Staff': 'Districtwide guidance and data',
    'Other': 'Start with the basics'
  };
  function renderRoleGrid() {
    const cur = getRole();
    $('#roleGrid').innerHTML = rolePathways.map((r) => `<button type="button" class="role-opt" data-role="${esc(r.role)}" aria-pressed="${cur === r.role}"><strong>${esc(r.role)}</strong><span>${esc(ROLE_SHORT[r.role] || '')}</span></button>`).join('');
  }
  function setRole(role) { store.set('s5_role', role); renderChrome(); renderHome(); toast('Showing next steps for ' + role); }

  function renderChrome() {
    const due = dueCases().length;
    const b = $('#dueBadge'); b.hidden = !due; b.textContent = due;
  }
  function renderHome() { if (window.PB) PB.render('home'); }

  /* ---------- guided support flow ---------- */
  const STEPS = ['Attendance', 'Why', 'Need', 'Details', 'Plan'];
  const ROOTS = {
    Barrier: ['Something prevents the scholar from getting to school.', 'Transportation, health, housing, caregiving, late arrival'],
    Aversion: ['Something about the school experience causes avoidance.', 'Anxiety, a class, safety or peers, discipline or climate'],
    Disengagement: ['The scholar lacks connection, relevance, or motivation.', 'Weak adult connection, boredom, credits, work'],
    Misconception: ['The scholar or family misunderstands attendance expectations or impact.', 'Excused absences, "only two days a month," illness guidance']
  };
  let flow = freshFlow();
  function freshFlow() { return { step: 0, pct: '', daysAbs: '', daysEnr: '', root: '', need: '', unsure: false, kssn: 'No', localId: '', school: '', start: iso(today()), owner: '', goal: '', voice: '', picks: null }; }
  function flowPct() {
    if (flow.daysAbs !== '' && flow.daysEnr !== '' && Number(flow.daysEnr) > 0) return Math.round((Number(flow.daysAbs) / Number(flow.daysEnr)) * 1000) / 10;
    return flow.pct === '' ? NaN : Number(flow.pct);
  }
  function recsFor(pct, need, kssn) {
    let recs = (interventionMap[need] || []).slice();
    if (kssn === 'Yes' && (pct >= 20 || ['Transportation', 'Basic needs / housing', 'Health / wellness'].includes(need))) recs = [...recs, { name: 'KSSN Wraparound / Community Resource Coordination', owner: 'KSSN + FSS + Attendance Team', evidence: 'Successful resource connection; barrier stabilization; attendance response' }];
    return recs;
  }
  const reviewText = (pct) => pct < 10 ? 'Continue universal prevention and monitor for emerging patterns.' : pct < 20 ? 'Use Day 0, 10, 20, and 30 checkpoints for an active plan. Escalate if the scholar crosses 20% or earlier if severity requires it.' : 'Review the active plan at least every 10 school days; use multidisciplinary review as needed and step down only after sustained improvement/barrier stabilization.';

  function canEnter(i) { const p = flowPct(); if (i >= 1 && !(p >= 0)) return false; if (i >= 2 && !flow.root) return false; if (i >= 3 && !flow.need) return false; return true; }
  function goStep(i) { if (!canEnter(i)) return; flow.step = i; renderFlow(); const h = $('#stepHost'); h.focus({ preventScroll: true }); if (window.innerWidth < 900) h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function renderFlow() {
    $('#stepper').innerHTML = STEPS.map((s, i) => `<button type="button" role="listitem" data-step="${i}" class="${i === flow.step ? 'now' : i < flow.step ? 'done' : ''}" ${canEnter(i) ? '' : 'disabled'} aria-current="${i === flow.step ? 'step' : 'false'}">${i + 1}. ${s}</button>`).join('');
    const p = flowPct(), t = tierInfo(p);
    $('#flowSummary').innerHTML = [
      ['Absence', p >= 0 ? tierPill(p) : '—'], ['Owner', t ? esc(t.owner) : '—'], ['Root cause', esc(flow.root || '—')], ['Need', esc(flow.need || '—')], ['Local ID', esc(flow.localId || '—')]
    ].map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
    const host = $('#stepHost');
    const nav = (back, next, nextLabel = 'Next →', nextOk = true) => `<div class="flow-nav">${back ? `<button class="btn secondary" type="button" data-go="${flow.step - 1}">← Back</button>` : '<span></span>'}${next ? `<button class="btn orange" type="button" data-go="${flow.step + 1}" ${nextOk ? '' : 'disabled'}>${nextLabel}</button>` : ''}</div>`;
    if (flow.step === 0) {
      const ok = p >= 0 && p <= 100;
      const daysLine = flow.daysAbs !== '' ? (Number(flow.daysAbs) < 5 ? `<span class="tier goal">${flow.daysAbs} days absent · on track for fewer than 5</span>` : `<span class="tier t2">${flow.daysAbs} days absent · above the fewer-than-5 goal</span>`) : '';
      host.innerHTML = `<h2>How much school has the scholar missed?</h2><p class="muted">Enter the absence percentage, or days absent and days enrolled. The level sets who owns the support and how often to review.</p>
        <div class="pct-row" style="margin-top:14px"><div><label class="field" for="fPct">Absence %</label><input class="input" id="fPct" type="number" inputmode="decimal" min="0" max="100" step="0.1" value="${esc(flow.daysAbs !== '' && flow.daysEnr !== '' ? '' : flow.pct)}" placeholder="e.g., 14"></div>
        <div><span class="field">or calculate from days</span><div class="row" style="flex-wrap:nowrap"><input class="input" id="fAbs" type="number" min="0" inputmode="numeric" aria-label="Days absent" placeholder="Days absent" value="${esc(flow.daysAbs)}"><input class="input" id="fEnr" type="number" min="1" inputmode="numeric" aria-label="Days enrolled" placeholder="Days enrolled" value="${esc(flow.daysEnr)}"></div></div></div>
        <div class="meter" aria-hidden="true"><i style="left:calc(${Math.min(Math.max(ok ? p : 0, 0), 30) / 30 * 100}% - 2px)"></i></div><div class="meter-labels"><span>Tier 1 · 0–9%</span><span>Tier 2 · 10–19%</span><span>Tier 3 · 20%+</span></div>
        <div style="margin-top:16px" aria-live="polite">${ok ? `<div class="row"><span class="big-pct">${p}%</span>${tierPill(p)} ${daysLine}</div><p style="margin:10px 0 0"><b>Primary ownership:</b> ${esc(t.owner)}<br><b>Monitoring:</b> ${esc(t.monitor || reviewText(p))}</p>` : '<p class="muted">Enter attendance to see the tier and owner.</p>'}</div>
        <p class="hint">Don't have the number? <a href="#data">Look it up from a school export</a>.</p>${nav(false, true, 'Next: why →', ok)}`;
      const upd = () => { flow.pct = $('#fPct').value; flow.daysAbs = $('#fAbs').value; flow.daysEnr = $('#fEnr').value; if (flow.pct !== '' && document.activeElement && document.activeElement.id === 'fPct') { flow.daysAbs = ''; flow.daysEnr = ''; } const keep = document.activeElement && document.activeElement.id; const pos = document.activeElement && document.activeElement.selectionStart; renderFlow(); if (keep) { const el = document.getElementById(keep); el.focus(); try { el.setSelectionRange(pos, pos); } catch (e) { /* number inputs */ } } };
      ['#fPct', '#fAbs', '#fEnr'].forEach((s) => $(s).addEventListener('input', upd));
    } else if (flow.step === 1) {
      host.innerHTML = `<h2>Why is the scholar missing school?</h2><p class="muted">Choose the pathway your evidence supports: scholar voice, family voice, the attendance pattern. If you don't know yet, that's the next step.</p>
        <div class="choice-grid">${Object.entries(ROOTS).map(([k, v]) => `<button type="button" class="choice" data-root="${k}" aria-pressed="${flow.root === k}"><strong>${k}</strong><span>${esc(v[0])}</span><span class="small" style="color:#7a8894">${esc(v[1])}</span></button>`).join('')}
        <button type="button" class="choice unsure" data-root="" aria-pressed="${flow.unsure}"><strong>Not sure yet</strong><span>Find out before choosing an intervention.</span></button></div>
        <div id="unsureBox">${flow.unsure ? unsureHtml() : ''}</div>${nav(true, true, 'Next: specific need →', !!flow.root)}`;
    } else if (flow.step === 2) {
      host.innerHTML = `<h2>What specifically is getting in the way?</h2><p class="muted">${esc(flow.root)}: ${esc(ROOTS[flow.root][0])}</p>
        <div class="choice-grid">${(matcherNeeds[flow.root] || []).map((n) => `<button type="button" class="choice" data-need="${esc(n)}" aria-pressed="${flow.need === n}"><strong>${esc(n)}</strong><span>${esc((interventionMap[n] || [])[0] ? 'e.g., ' + interventionMap[n][0].name : '')}</span></button>`).join('')}</div>${nav(true, true, 'Next: details →', !!flow.need)}`;
    } else if (flow.step === 3) {
      host.innerHTML = `<h2>A few details for the plan</h2><p class="muted">All optional. They make the plan and the case easier to follow.</p>
        <div class="grid g2" style="margin-top:12px">
          <div><label class="field" for="fId">Scholar local ID or initials</label><input class="input" id="fId" value="${esc(flow.localId)}" placeholder="e.g., 204511 or J.R."><p class="hint">No names. This stays on this device.</p></div>
          <div><label class="field" for="fSchool">School</label><input class="input" id="fSchool" value="${esc(flow.school)}" placeholder="Optional"></div>
          <div><label class="field" for="fStart">Plan start date (Day 0)</label><input class="input" id="fStart" type="date" value="${esc(flow.start)}"></div>
          <div><span class="field">KSSN partner school?</span><div class="seg" role="radiogroup" aria-label="KSSN partner school"><label><input type="radio" name="fK" value="No" ${flow.kssn === 'No' ? 'checked' : ''}><span>No / not sure</span></label><label><input type="radio" name="fK" value="Yes" ${flow.kssn === 'Yes' ? 'checked' : ''}><span>Yes</span></label></div></div>
          <div style="grid-column:1/-1"><label class="field" for="fGoal">Measurable goal</label><input class="input" id="fGoal" value="${esc(flow.goal)}" placeholder="e.g., Attend 9 of the next 10 school days; on time 4 of 5 mornings"></div>
          <div style="grid-column:1/-1"><label class="field" for="fVoice">Scholar / family voice</label><textarea class="input" id="fVoice" placeholder="What did the scholar and family say is getting in the way?">${esc(flow.voice)}</textarea></div>
        </div>${nav(true, true, 'See matched plan →')}`;
      const sync = () => { flow.localId = $('#fId').value.trim(); flow.school = $('#fSchool').value.trim(); flow.start = $('#fStart').value || iso(today()); flow.goal = $('#fGoal').value.trim(); flow.voice = $('#fVoice').value.trim(); flow.kssn = ($('input[name=fK]:checked') || {}).value || 'No'; $('#flowSummary dd:last-child').textContent = flow.localId || '—'; };
      $$('#stepHost input, #stepHost textarea').forEach((el) => el.addEventListener('input', sync)); $$('input[name=fK]').forEach((el) => el.addEventListener('change', sync));
    } else {
      const recs = recsFor(p, flow.need, flow.kssn);
      if (!flow.picks || flow.picks.length === 0) flow.picks = recs.length ? [recs[0].name] : [];
      const links = communityLinks[flow.need] || [];
      host.innerHTML = `<div class="spread"><div><p class="eyebrow">Matched plan</p><h2>${esc(flow.root)} → ${esc(flow.need)}</h2></div>${tierPill(p)}</div>
        <p><b>Primary ownership:</b> ${esc(t.owner)}</p>
        <h3 style="margin-top:16px">Choose the intervention(s) you'll implement</h3><p class="muted small">Start with one primary intervention. Add another only if it addresses a different part of the same barrier.</p>
        <div class="grid" id="recList">${recs.map((r, i) => `<label class="rec ${flow.picks.includes(r.name) ? 'picked' : ''}"><input type="checkbox" value="${esc(r.name)}" ${flow.picks.includes(r.name) ? 'checked' : ''}><div><h4>${esc(r.name)}${i === 0 ? ' <span class="tag">Suggested primary</span>' : ''}</h4><small><b>Owner:</b> ${esc(r.owner)}<br><b>Evidence of progress:</b> ${esc(r.evidence)}</small></div></label>`).join('')}</div>
        ${links.length ? `<div class="callout"><b>Possible partner connections.</b> Opening a link or making a referral is an <b>action</b>; the intervention is the plan you implement and monitor.<div class="row" style="margin-top:8px">${links.map((x) => `<a class="btn secondary small" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.label)} ↗</a>`).join('')}</div></div>` : ''}
        <p><b>Monitoring:</b> ${esc(reviewText(p))}</p>
        <p><b>Goal:</b> ${esc(flow.goal || 'Set a measurable attendance/barrier-reduction goal before implementation.')}</p>
        ${p < 10 ? '<div class="callout green">Tier 1: universal prevention and early outreach usually come first. Save a case if you want to track an individual plan anyway.</div>' : ''}
        <div class="flow-nav no-print"><button class="btn secondary" type="button" data-go="3">← Back</button><div class="row"><button class="btn secondary" type="button" id="dlPlan">Download plan</button><button class="btn secondary" type="button" onclick="window.print()">Print</button><button class="btn orange" type="button" id="savePlan">Save as a plan</button></div></div>
        <p class="hint">Saving creates review checkpoints at Day 10, 20 and 30 (school days) from ${esc(nice(flow.start))}.</p>`;
      $$('#recList input').forEach((cb) => cb.addEventListener('change', () => { flow.picks = $$('#recList input:checked').map((x) => x.value); $$('#recList .rec').forEach((l) => l.classList.toggle('picked', l.querySelector('input').checked)); }));
      $('#dlPlan').onclick = () => downloadPlan({ id: flow.localId, pct: p, t: tierFromPct(p), root: flow.root, n: flow.need, kssn: flow.kssn, voice: flow.voice, goal: flow.goal, recs: recs.filter((r) => flow.picks.includes(r.name)).length ? recs.filter((r) => flow.picks.includes(r.name)) : recs, review: reviewText(p) });
      $('#savePlan').onclick = () => { const c = createCaseFromFlow(recs); flow = freshFlow(); location.hash = '#case/' + c.id; toast('Plan saved. Day 10 review: ' + nice(c.reviews[0].due)); };
    }
  }
  function unsureHtml() {
    return `<div class="callout orange"><b>Find the reason before choosing an intervention.</b> A pattern tells you when, not why.
      <ol style="margin:8px 0 0 18px;padding:0"><li>Have a caring conversation with the scholar and family: share the pattern, ask what's getting in the way, listen.</li><li>Check the pattern in Synergy (days, periods, after weekends).</li><li>Bring what you learn back here and choose the pathway it supports.</li></ol>
      <div class="row" style="margin-top:10px"><a class="btn secondary small" href="tools/Caring_Conversation_Guide.md" download>Caring conversation guide</a><a class="btn secondary small" href="tools/Root_Cause_Interview_Guide.md" download>Root-cause interview guide</a><button class="btn secondary small" type="button" data-open-res="Possible Root Causes to Explore">Possible root causes →</button></div></div>
      <label class="field" for="fDescribe" style="margin-top:12px">Or describe what you know in your own words</label><div class="row" style="flex-wrap:nowrap"><input class="input" id="fDescribe" placeholder="e.g., caregiver says sick a lot but scholar mentions being picked on"><button class="btn" type="button" id="fDescribeGo">Interpret</button></div><p class="hint">Opens the library, which explains what it understood and what to do first.</p>`;
  }

  /* ---------- cases ---------- */
  const allCases = () => store.get('s5_cases_v1', []);
  const saveCases = (list) => store.set('s5_cases_v1', list);
  const getCase = (id) => allCases().find((c) => c.id === id);
  function putCase(c) { const l = allCases(); const i = l.findIndex((x) => x.id === c.id); if (i >= 0) l[i] = c; else l.unshift(c); saveCases(l); renderChrome(); }
  function createCaseFromFlow(recs) {
    const p = flowPct(), t = tierInfo(p);
    const chosen = recs.filter((r) => flow.picks.includes(r.name)); const use = chosen.length ? chosen : recs.slice(0, 1);
    const c = {
      id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), created: new Date().toISOString(), status: 'active',
      localId: flow.localId, school: flow.school, start: flow.start, baselinePct: p, currentPct: p, tier: t.tier, root: flow.root, need: flow.need, kssn: flow.kssn,
      interventions: use.map((r) => ({ name: r.name, owner: r.owner, evidence: r.evidence })), owner: use[0] ? use[0].owner : t.owner, goal: flow.goal, voice: flow.voice,
      reviews: [10, 20, 30].map((d) => ({ day: d, due: addSchoolDays(flow.start, d), result: null }))
    };
    putCase(c); return c;
  }
  function reviewStatus(r) { if (r.result) return 'done'; const due = parseDay(r.due), now = today(); if (due < now) return 'overdue'; const days = schoolDaysBetween(iso(now), r.due); return days <= 3 ? 'soon' : 'later'; }
  function statusText(st, due) { return st === 'overdue' ? 'Overdue · ' + nice(due) : st === 'soon' ? 'Due ' + nice(due) : st === 'done' ? 'Done' : nice(due); }
  const nextReview = (c) => c.reviews.find((r) => !r.result);
  function upcomingReviews() { return allCases().filter((c) => c.status === 'active').map((c) => { const r = nextReview(c); return r ? { c, r, st: reviewStatus(r) } : null; }).filter(Boolean).sort((a, b) => a.r.due.localeCompare(b.r.due)); }
  const dueCases = () => upcomingReviews().filter((u) => u.st === 'overdue' || u.st === 'soon');

  function renderCases() {
    const f = $('#caseFilter').value, q = $('#caseSearch').value.trim().toLowerCase();
    let list = allCases();
    if (f === 'active') list = list.filter((c) => c.status === 'active');
    if (f === 'closed') list = list.filter((c) => c.status !== 'active');
    if (f === 'due') { const ids = new Set(dueCases().map((u) => u.c.id)); list = list.filter((c) => ids.has(c.id)); }
    if (q) list = list.filter((c) => [c.localId, c.need, c.root, c.owner, c.school].join(' ').toLowerCase().includes(q));
    list.sort((a, b) => { const ra = nextReview(a), rb = nextReview(b); return (ra ? ra.due : '9') .localeCompare(rb ? rb.due : '9'); });
    $('#caseRows').innerHTML = list.length ? list.map((c) => { const r = nextReview(c); const st = r ? reviewStatus(r) : 'done';
      return `<a class="case-row" href="#case/${c.id}"><span><strong>${esc(c.localId || 'Unlabeled case')}</strong> ${tierPill(c.currentPct)}<br><span class="meta">${esc(c.root)} → ${esc(c.need)} · ${esc(c.interventions[0] ? c.interventions[0].name : '')}${c.school ? ' · ' + esc(c.school) : ''}</span></span>
        <span class="status ${c.status === 'active' ? st : 'done'}">${c.status !== 'active' ? 'Closed' : r ? 'Day ' + r.day + ' · ' + statusText(st, r.due) : 'All reviews done'}</span></a>`; }).join('')
      : `<div class="empty">${allCases().length ? 'No cases match.' : 'No cases yet.'}<br><a class="btn orange" style="margin-top:12px" href="#support">Start with Support a scholar</a></div>`;
  }

  const DECISIONS = {
    delivery: ['Improve delivery', 'The plan was not carried out consistently. Fix ownership, frequency, or follow-through before deciding the intervention failed.'],
    adjust: ['Adjust the intervention', 'The plan happened, but the barrier remains. Revisit the scholar and family perspective and change the strategy to address what is still in the way.'],
    continue: ['Continue or gradually reduce', 'The barrier is improving and attendance is increasing. Continue, recognize progress, and consider reducing support when improvement is sustained.'],
    intensify: ['Intensify and coordinate', 'The need is new, more serious, or not responding. Bring the appropriate team and partners together and consider additional assessment.']
  };
  function suggestDecision(delivered, barrier, pct, prevPct) {
    if (!delivered || !barrier) return null;
    const worse = pct !== '' && Number(pct) > Number(prevPct) + 0.5; const crossed = pct !== '' && tierInfo(pct) && tierInfo(prevPct) && tierInfo(pct).tier > tierInfo(prevPct).tier;
    if (crossed || (delivered === 'yes' && barrier === 'worse')) return 'intensify';
    if (delivered !== 'yes') return 'delivery';
    if (barrier === 'same' || worse) return 'adjust';
    return 'continue';
  }
  function renderCaseDetail(id) {
    const c = getCase(id); const host = $('#caseDetail');
    if (!c) { host.innerHTML = '<div class="empty">That case is not on this device. <a href="#cases">Back to cases</a></div>'; return; }
    const next = nextReview(c);
    const tl = [`<div class="tl done"><b>Day 0</b><span>Started ${nice(c.start)}</span></div>`].concat(c.reviews.map((r) => { const st = reviewStatus(r); return `<button type="button" class="tl ${st === 'done' ? 'done' : st === 'overdue' ? 'overdue' : r === next ? 'next' : ''}" data-review="${r.day}"><b>Day ${r.day}</b><span>${st === 'done' ? DECISIONS[r.result.decision] ? DECISIONS[r.result.decision][0] : 'Reviewed' : statusText(st, r.due)}</span></button>`; })).join('');
    const prev = c.reviews.filter((r) => r.result).slice(-1)[0];
    const prevPct = prev && prev.result.pct !== '' ? prev.result.pct : c.baselinePct;
    host.innerHTML = `<p class="no-print"><a href="#cases">← All cases</a></p>
      <div class="spread"><div><p class="eyebrow">${c.status === 'active' ? 'Active case' : 'Closed case'}${c.school ? ' · ' + esc(c.school) : ''}</p><h1>${esc(c.localId || 'Unlabeled case')}</h1><p class="lead" style="margin-bottom:8px">${esc(c.root)} → ${esc(c.need)}</p></div>
        <div class="row">${tierPill(c.currentPct)}${c.currentPct !== c.baselinePct ? `<span class="muted small">baseline ${c.baselinePct}%</span>` : ''}</div></div>
      <div class="timeline">${tl}</div>
      <div class="grid g2">
        <div class="card"><h2>Plan</h2>${c.interventions.map((r) => `<div class="rec" style="margin-bottom:8px"><div><h4>${esc(r.name)}</h4><small><b>Owner:</b> ${esc(r.owner)}<br><b>Evidence:</b> ${esc(r.evidence)}</small></div></div>`).join('')}
          <p><b>Goal:</b> ${esc(c.goal || 'Not set yet. Add one at the next review.')}</p>${c.voice ? `<p><b>Scholar / family voice:</b> ${esc(c.voice)}</p>` : ''}<p class="muted small">KSSN partner school: ${esc(c.kssn)} · Started ${nice(c.start)}</p></div>
        <div class="card" id="reviewCard">${next && c.status === 'active' ? reviewFormHtml(c, next, prevPct) : `<h2>Reviews</h2><p class="muted">${c.status === 'active' ? 'All scheduled reviews are complete.' : 'This case is closed.'}</p>`}
          ${c.reviews.some((r) => r.result) ? `<h3 style="margin-top:16px">Review history</h3><div class="review-log">${c.reviews.filter((r) => r.result).map((r) => `<div><b>Day ${r.day}</b> · ${nice(r.result.date)} · ${esc((DECISIONS[r.result.decision] || ['Closed'])[0])}<br><span class="small muted">Delivered: ${esc(r.result.delivered)} · Barrier: ${esc(r.result.barrier)}${r.result.pct !== '' ? ' · Absence ' + esc(r.result.pct) + '%' : ''}${r.result.notes ? ' · ' + esc(r.result.notes) : ''}</span></div>`).join('')}</div>` : ''}</div>
      </div>
      <div class="row no-print section"><button class="btn secondary" type="button" id="caseDl">Download case summary</button><button class="btn secondary" type="button" onclick="window.print()">Print</button>
        <button class="btn secondary" type="button" id="caseToggle">${c.status === 'active' ? 'Close case' : 'Reopen case'}</button><button class="btn ghost" type="button" id="caseDel">Delete</button></div>`;
    $('#caseDl').onclick = () => downloadCase(c);
    $('#caseToggle').onclick = () => { c.status = c.status === 'active' ? 'closed' : 'active'; putCase(c); renderCaseDetail(c.id); toast(c.status === 'active' ? 'Case reopened' : 'Case closed'); };
    $('#caseDel').onclick = () => { if (confirm('Delete this case from this device? This cannot be undone.')) { saveCases(allCases().filter((x) => x.id !== c.id)); renderChrome(); location.hash = '#cases'; toast('Case deleted'); } };
    const form = $('#reviewForm'); if (form) wireReviewForm(c, next, prevPct);
  }
  function reviewFormHtml(c, r, prevPct) {
    const seg = (name, opts) => `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}"><span>${l}</span></label>`).join('')}</div>`;
    return `<form id="reviewForm"><h2>Day ${r.day} review</h2><p class="muted small">${reviewStatus(r) === 'overdue' ? '<b style="color:var(--t3)">Overdue.</b> ' : ''}Scheduled ${nice(r.due)}. Answer three questions, then decide.</p>
      <p class="field" style="margin-top:12px">1. Was the intervention delivered as planned?</p>${seg('rDel', [['yes', 'Yes'], ['partly', 'Partly'], ['no', 'No']])}
      <p class="field" style="margin-top:12px">2. Did the barrier change?</p>${seg('rBar', [['better', 'Improved'], ['same', 'About the same'], ['worse', 'Worse']])}
      <label class="field" for="rPct" style="margin-top:12px">3. Current absence %</label><input class="input" id="rPct" type="number" min="0" max="100" step="0.1" placeholder="Was ${prevPct}%" style="max-width:200px">
      <div id="rSuggest" aria-live="polite"></div>
      <p class="field" style="margin-top:12px">Decision</p>${seg('rDec', [['delivery', 'Improve delivery'], ['adjust', 'Adjust'], ['continue', 'Continue / reduce'], ['intensify', 'Intensify'], ['close', 'Close case']])}
      <label class="field" for="rNotes" style="margin-top:12px">Notes and next step owner</label><textarea class="input" id="rNotes" placeholder="What changes, who owns it, by when"></textarea>
      <div class="row" style="margin-top:12px"><button class="btn orange" type="submit">Save Day ${r.day} review</button></div></form>`;
  }
  function wireReviewForm(c, r, prevPct) {
    const form = $('#reviewForm');
    const val = (n) => (form.querySelector(`input[name=${n}]:checked`) || {}).value;
    const update = () => {
      const s = suggestDecision(val('rDel'), val('rBar'), $('#rPct').value, prevPct);
      const pct = $('#rPct').value; const tierNote = pct !== '' && tierInfo(pct) && tierInfo(pct).tier !== tierInfo(prevPct).tier ? `<div class="callout">${tierInfo(pct).tier} now (was ${tierInfo(prevPct).tier}). Ownership: ${esc(tierInfo(pct).owner)}.</div>` : '';
      $('#rSuggest').innerHTML = tierNote + (s ? `<div class="callout orange"><b>Suggested: ${DECISIONS[s][0]}.</b> ${DECISIONS[s][1]}</div>` : '');
      if (s && !val('rDec')) { const el = form.querySelector(`input[name=rDec][value=${s}]`); if (el) el.checked = true; }
    };
    form.addEventListener('change', update); $('#rPct').addEventListener('input', update);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const dec = val('rDec'); if (!val('rDel') || !val('rBar') || !dec) { toast('Answer the questions and choose a decision.'); return; }
      const pct = $('#rPct').value;
      r.result = { date: iso(today()), delivered: val('rDel'), barrier: val('rBar'), pct, decision: dec, notes: $('#rNotes').value.trim() };
      if (pct !== '') { c.currentPct = Number(pct); c.tier = tierInfo(pct).tier; }
      if (dec === 'close') c.status = 'closed';
      else if (!nextReview(c)) { const last = c.reviews[c.reviews.length - 1]; c.reviews.push({ day: last.day + 10, due: addSchoolDays(last.due, 10), result: null }); }
      putCase(c); renderCaseDetail(c.id); toast('Day ' + r.day + ' review saved');
    });
  }
  function caseText(c) {
    return `GRPS STRIVE FOR LESS THAN 5 — CASE SUMMARY\nLocal ID: ${c.localId || 'Not entered'}\nSchool: ${c.school || '—'}\nStatus: ${c.status}\nStarted: ${c.start}\nBaseline absence: ${c.baselinePct}%  Current: ${c.currentPct}% (${c.tier})\nRoot cause: ${c.root} → ${c.need}\nKSSN partner school: ${c.kssn}\nGoal: ${c.goal || 'To be set'}\nScholar/family voice: ${c.voice || '—'}\n\nINTERVENTIONS\n${c.interventions.map((r, i) => `${i + 1}. ${r.name}\n   Owner: ${r.owner}\n   Evidence: ${r.evidence}`).join('\n')}\n\nREVIEWS\n${c.reviews.map((r) => `Day ${r.day} (due ${r.due}): ${r.result ? `${r.result.date} · delivered ${r.result.delivered} · barrier ${r.result.barrier}${r.result.pct !== '' ? ' · absence ' + r.result.pct + '%' : ''} · decision: ${(DECISIONS[r.result.decision] || ['Close case'])[0]}${r.result.notes ? ' · ' + r.result.notes : ''}` : 'not yet reviewed'}`).join('\n')}\n`;
  }
  function download(name, text, type = 'text/plain') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
  const downloadCase = (c) => download(`Strive5_Case_${(c.localId || c.id).replace(/[^\w-]+/g, '_')}.txt`, caseText(c));
  const csvCell = (v) => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };

  /* ---------- school data dashboard ---------- */
  let dataset = null; // {headers, rows}
  let mapping = null; let dashState = { group: '', tier: 'all', q: '', sort: 'pct', dir: -1 };
  function parseCSV(text) {
    const delim = (text.split('\n')[0].match(/\t/g) || []).length > (text.split('\n')[0].match(/,/g) || []).length ? '\t' : ',';
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
      else if (ch === '"') q = true; else if (ch === delim) { row.push(cell); cell = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); if (row.some((x) => x.trim() !== '')) rows.push(row); row = []; cell = ''; } else cell += ch;
    }
    row.push(cell); if (row.some((x) => x.trim() !== '')) rows.push(row);
    const headers = (rows.shift() || []).map((h) => h.trim());
    return { headers, rows: rows.map((r) => headers.map((_, i) => (r[i] || '').trim())) };
  }
  const FIELDS = [['id', 'Scholar ID'], ['name', 'Name (shown as initials)'], ['grade', 'Grade'], ['school', 'School'], ['absPct', 'Absence %'], ['attPct', 'Attendance %'], ['daysAbs', 'Days absent'], ['daysEnr', 'Days enrolled'], ['group', 'Extra group (e.g., subgroup)']];
  function detectMapping(h) {
    const find = (re, not) => h.findIndex((x) => re.test(x) && !(not && not.test(x)));
    return {
      id: find(/(^|\b)(student|scholar|perm|local)?\s*(id|number|#)\b|perm/i, /grade|school/i), name: find(/name/i), grade: find(/grade|^gr\b/i), school: find(/school|building|site/i),
      absPct: find(/(absen|absence|chronic).*(%|pct|percent|rate)|^%\s*absent/i), attPct: find(/(attend|ada).*(%|pct|percent|rate)|^%\s*attend|^ada$/i),
      daysAbs: find(/(days?\s*absent|absences|abs\w*\s*days|total\s*abs)/i, /%|pct|percent|rate/i), daysEnr: find(/(enroll|membership|member|possible|days\s*in)/i), group: -1
    };
  }
  function rowPct(r, m, scale) {
    const num = (i) => { if (i < 0) return NaN; const v = parseFloat(String(r[i]).replace(/[%,]/g, '')); return v; };
    let p = num(m.absPct);
    if (Number.isNaN(p)) { const a = num(m.attPct); if (!Number.isNaN(a)) p = (scale.att ? a * 100 : a) >= 0 ? 100 - (scale.att ? a * 100 : a) : NaN; }
    else if (scale.abs) p = p * 100;
    if (Number.isNaN(p)) { const d = num(m.daysAbs), e = num(m.daysEnr); if (!Number.isNaN(d) && e > 0) p = (d / e) * 100; }
    return Number.isNaN(p) ? NaN : Math.round(p * 10) / 10;
  }
  function loadData(text, label) {
    const d = parseCSV(text);
    if (!d.headers.length || !d.rows.length) { toast('No rows found. Include a header row.'); return; }
    dataset = Object.assign(d, { label }); mapping = detectMapping(d.headers);
    const ok = mapping.absPct >= 0 || mapping.attPct >= 0 || (mapping.daysAbs >= 0 && mapping.daysEnr >= 0);
    renderMap(!ok); if (ok) buildDash();
  }
  function renderMap(open) {
    const h = dataset.headers;
    $('#dataMap').hidden = false;
    $('#dataMap').innerHTML = `<details class="drawer" ${open ? 'open' : ''}><summary>Columns: ${esc(dataset.label)} · ${dataset.rows.length} rows</summary><div>
      <p class="muted small">Check how columns were read. Change any that are wrong, then update.</p>
      <div class="map-grid">${FIELDS.map(([k, l]) => `<div><label class="field small" for="map_${k}">${l}</label><select class="input" id="map_${k}"><option value="-1">—</option>${h.map((x, i) => `<option value="${i}" ${mapping[k] === i ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></div>`).join('')}</div>
      <div class="row" style="margin-top:12px"><button class="btn" type="button" id="mapGo">Update dashboard</button><button class="btn ghost" type="button" id="dataReset">Use different data</button></div></div></details>`;
    $('#mapGo').onclick = () => { FIELDS.forEach(([k]) => { mapping[k] = Number($('#map_' + k).value); }); buildDash(); };
    $('#dataReset').onclick = () => { dataset = null; $('#dataMap').hidden = true; $('#dataDash').hidden = true; $('#dataIntake').hidden = false; };
    $('#dataIntake').hidden = true;
  }
  let scholars = [];
  function buildDash() {
    const m = mapping;
    const colMax = (i) => i < 0 ? NaN : Math.max(...dataset.rows.map((r) => parseFloat(String(r[i]).replace(/[%,]/g, ''))).filter((x) => !Number.isNaN(x)));
    const scale = { abs: colMax(m.absPct) <= 1, att: colMax(m.attPct) <= 1 };
    const initials = (n) => String(n).split(/[\s,]+/).filter(Boolean).map((p) => p[0].toUpperCase()).join('').slice(0, 3);
    scholars = dataset.rows.map((r, i) => {
      const pct = rowPct(r, m, scale);
      const label = m.id >= 0 && r[m.id] ? r[m.id] : m.name >= 0 && r[m.name] ? initials(r[m.name]) + '-' + (i + 1) : 'Row ' + (i + 1);
      return { label, grade: m.grade >= 0 ? r[m.grade] : '', school: m.school >= 0 ? r[m.school] : '', group: m.group >= 0 ? r[m.group] : '', pct, daysAbs: m.daysAbs >= 0 ? parseFloat(r[m.daysAbs]) : NaN };
    }).filter((s) => !Number.isNaN(s.pct));
    if (!scholars.length) { renderMap(true); toast('Could not find attendance numbers. Check the column choices.'); return; }
    if (!dashState.group) dashState.group = m.grade >= 0 ? 'grade' : m.school >= 0 ? 'school' : '';
    $('#dataDash').hidden = false; renderDash(); if (window.PB) PB.challenge(scholars);
    $('#dataDash').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function renderDash() {
    const n = scholars.length;
    const t1 = scholars.filter((s) => s.pct < 10), t2 = scholars.filter((s) => s.pct >= 10 && s.pct < 20), t3 = scholars.filter((s) => s.pct >= 20);
    const near = t1.filter((s) => s.pct >= 8).length;
    const hasDays = scholars.some((s) => !Number.isNaN(s.daysAbs));
    const onTrack = hasDays ? scholars.filter((s) => s.daysAbs < 5).length : null;
    const pc = (x) => n ? Math.round((x / n) * 1000) / 10 : 0;
    const caseIds = new Set(allCases().filter((c) => c.status === 'active').map((c) => String(c.localId).trim()));
    const groups = {};
    if (dashState.group) scholars.forEach((s) => { const k = s[dashState.group] || '—'; (groups[k] = groups[k] || []).push(s); });
    const gkeys = Object.keys(groups).sort((a, b) => { const na = parseFloat(a.replace(/^k$/i, '0')), nb = parseFloat(b.replace(/^k$/i, '0')); return !Number.isNaN(na) && !Number.isNaN(nb) ? na - nb : a.localeCompare(b); });
    let rows = scholars.slice();
    if (dashState.tier !== 'all') rows = rows.filter((s) => (dashState.tier === 't1' ? s.pct < 10 : dashState.tier === 't2' ? s.pct >= 10 && s.pct < 20 : dashState.tier === 'near' ? s.pct >= 8 && s.pct < 10 : s.pct >= 20));
    if (dashState.q) rows = rows.filter((s) => [s.label, s.grade, s.school, s.group].join(' ').toLowerCase().includes(dashState.q.toLowerCase()));
    rows.sort((a, b) => { const k = dashState.sort; const av = a[k], bv = b[k]; return (typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv), undefined, { numeric: true })) * dashState.dir; });
    const groupOpts = [['', 'No grouping']].concat([['grade', 'Grade'], ['school', 'School'], ['group', 'Extra group']].filter(([k]) => scholars.some((s) => s[k])));
    $('#dataDash').innerHTML = `<div class="grid g4 section" style="margin-top:20px">
        <div class="kpi"><b>${n}</b><span>scholars</span></div>
        <div class="kpi k3"><b>${pc(t2.length + t3.length)}%</b><span>chronically absent (${t2.length + t3.length} at 10%+)</span></div>
        <div class="kpi"><b>${t3.length}</b><span>Tier 3 · 20%+ absent</span></div>
        <div class="kpi k1"><b>${onTrack == null ? near : onTrack}</b><span>${onTrack == null ? 'near the line · 8–9.9%' : 'on track · fewer than 5 days absent'}</span></div></div>
      <div class="card"><h2>Tiers</h2><div class="stack" role="img" aria-label="Tier 1 ${pc(t1.length)}%, Tier 2 ${pc(t2.length)}%, Tier 3 ${pc(t3.length)}%"><i style="width:${pc(t1.length)}%;background:#7cc49a"></i><i style="width:${pc(t2.length)}%;background:#f0b44c"></i><i style="width:${pc(t3.length)}%;background:#e0685e"></i></div>
        <div class="legend"><span><i style="background:#7cc49a"></i>Tier 1 · ${t1.length} (${pc(t1.length)}%)</span><span><i style="background:#f0b44c"></i>Tier 2 · ${t2.length} (${pc(t2.length)}%)</span><span><i style="background:#e0685e"></i>Tier 3 · ${t3.length} (${pc(t3.length)}%)</span>${onTrack != null ? `<span>· ${near} near the line (8–9.9%)</span>` : ''}</div>
        <div class="spread" style="margin-top:16px"><h3>Chronic absence by group</h3><select class="input" id="dashGroup" style="max-width:200px" aria-label="Group by">${groupOpts.map(([k, l]) => `<option value="${k}" ${dashState.group === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        ${dashState.group ? `<div class="bars">${gkeys.map((k) => { const g = groups[k], gn = g.length, g2 = g.filter((s) => s.pct >= 10 && s.pct < 20).length, g3 = g.filter((s) => s.pct >= 20).length; return `<div class="bar-row"><span>${esc(k)} <span class="muted small">(${gn})</span></span><span class="track" role="img" aria-label="${esc(k)}: ${Math.round((g2 + g3) / gn * 100)}% chronically absent"><i style="width:${g2 / gn * 100}%;background:#f0b44c"></i><i style="width:${g3 / gn * 100}%;background:#e0685e"></i></span><b>${Math.round((g2 + g3) / gn * 100)}%</b></div>`; }).join('')}</div>` : '<p class="muted small">Choose a grouping to compare.</p>'}
        <p class="hint">Patterns show where to look, not why. Use scholar and family voice to find the root cause before choosing interventions.</p></div>
      <div class="card section"><div class="spread"><h2>Who needs follow-up</h2><div class="row"><button class="btn secondary small" type="button" id="dashExport">Export Tier 2–3 list</button></div></div>
        <div class="row" style="margin:6px 0 12px"><select class="input" id="dashTier" style="max-width:220px" aria-label="Filter tier">${[['all', 'All scholars'], ['t3', 'Tier 3 (20%+)'], ['t2', 'Tier 2 (10–19%)'], ['near', 'Near the line (8–9.9%)'], ['t1', 'Tier 1 (under 10%)']].map(([k, l]) => `<option value="${k}" ${dashState.tier === k ? 'selected' : ''}>${l}</option>`).join('')}</select><input class="input" id="dashQ" style="max-width:240px" placeholder="Search ID or grade" value="${esc(dashState.q)}" aria-label="Search scholars"></div>
        <div class="table-wrap"><table class="data"><thead><tr>${[['label', 'Scholar'], ['grade', 'Grade'], ['school', 'School'], ['pct', 'Absence'], ['daysAbs', 'Days absent']].filter(([k]) => k === 'label' || k === 'pct' || scholars.some((s) => k === 'daysAbs' ? !Number.isNaN(s.daysAbs) : s[k])).map(([k, l]) => `<th data-sort="${k}" aria-sort="${dashState.sort === k ? (dashState.dir > 0 ? 'ascending' : 'descending') : 'none'}">${l}${dashState.sort === k ? (dashState.dir > 0 ? ' ▲' : ' ▼') : ''}</th>`).join('')}<th>Next step</th></tr></thead>
        <tbody>${rows.slice(0, 400).map((s) => `<tr><td>${esc(s.label)}</td>${scholars.some((x) => x.grade) ? `<td>${esc(s.grade)}</td>` : ''}${scholars.some((x) => x.school) ? `<td>${esc(s.school)}</td>` : ''}<td>${tierPill(s.pct)}</td>${scholars.some((x) => !Number.isNaN(x.daysAbs)) ? `<td>${Number.isNaN(s.daysAbs) ? '' : s.daysAbs}</td>` : ''}<td>${caseIds.has(String(s.label).trim()) ? '<span class="status done">Has a plan</span>' : s.pct >= 10 ? `<button class="btn small secondary" type="button" data-start="${esc(s.label)}" data-pct="${s.pct}" data-school="${esc(s.school)}">Start a plan</button>` : '<span class="muted small">Universal supports</span>'}</td></tr>`).join('')}</tbody></table></div>
        ${rows.length > 400 ? `<p class="hint">Showing the first 400 of ${rows.length}. Filter or search to narrow.</p>` : `<p class="hint">${rows.length} shown.</p>`}</div>`;
    $('#dashGroup').onchange = (e) => { dashState.group = e.target.value; renderDash(); };
    $('#dashTier').onchange = (e) => { dashState.tier = e.target.value; renderDash(); };
    $('#dashQ').oninput = (e) => { dashState.q = e.target.value; const pos = e.target.selectionStart; renderDash(); const el = $('#dashQ'); el.focus(); el.setSelectionRange(pos, pos); };
    $$('#dataDash th[data-sort]').forEach((th) => th.onclick = () => { const k = th.dataset.sort; dashState.dir = dashState.sort === k ? -dashState.dir : (k === 'pct' || k === 'daysAbs' ? -1 : 1); dashState.sort = k; renderDash(); });
    $('#dashExport').onclick = () => { const list = scholars.filter((s) => s.pct >= 10).sort((a, b) => b.pct - a.pct); download('Strive5_Follow_Up_List.csv', ['Scholar,Grade,School,Absence %,Tier,Days absent'].concat(list.map((s) => [s.label, s.grade, s.school, s.pct, tierInfo(s.pct).tier, Number.isNaN(s.daysAbs) ? '' : s.daysAbs].map(csvCell).join(','))).join('\n'), 'text/csv'); };
  }
  function sampleCSV() {
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const lines = ['Local ID,Grade,Days Absent,Days Enrolled,Group'];
    const grades = ['K', '1', '2', '3', '4', '5'];
    for (let i = 0; i < 132; i++) { const enr = 52 + Math.floor(rnd() * 4); const r = rnd(); const abs = Math.round(r < 0.55 ? rnd() * 4 : r < 0.78 ? 3 + rnd() * 4 : r < 0.92 ? 6 + rnd() * 5 : 11 + rnd() * 9); lines.push(['S' + (2400 + i * 7), grades[i % 6], abs, enr, rnd() < 0.3 ? 'Program A' : 'Program B'].join(',')); }
    return lines.join('\n');
  }

  /* ---------- practice ---------- */
  const SCEN = [
    { key: 'transport', role: 'Teacher / FSS', title: 'Morning transportation breakdown', desc: 'A scholar has missed 12% of days. The family reports an unreliable ride after a work-schedule change.' },
    { key: 'academic', role: 'Teacher / Counselor', title: 'Specific-class avoidance', desc: 'A scholar is present most mornings but repeatedly misses first-hour math and now has 15% absence.' },
    { key: 'nonresponse', role: 'Attendance Team', title: 'Support is not changing attendance', desc: 'A Tier 2 scholar has had a mentor for 20 school days, but attendance remains flat and the barrier is still unclear.' },
    { key: 'housing', role: 'Family Support Specialist', title: 'Housing instability and routines', desc: 'A scholar has missed 24% of days. The family is moving between relatives and mornings are unpredictable.' },
    { key: 'safety', role: 'Counselor / Social Worker', title: 'Peer conflict and school avoidance', desc: 'A scholar has missed 16% of days. The caregiver says the scholar is often sick, but the scholar reports avoiding school after repeated peer threats.' },
    { key: 'tardy', role: 'Secretary / Attendance Staff', title: 'Late arrival pattern', desc: 'A scholar is late three mornings per week. Staff can see the pattern, but the reason has not been confirmed.' },
    { key: 'systems', role: 'Principal / School Leader', title: 'Schoolwide Monday absence spike', desc: 'Multiple grade levels have higher Monday absences. Different staff are responding inconsistently, and active plans have no clear owner.' },
    { key: 'kssn', role: 'KSSN Coordinator', title: 'Multiple basic-needs barriers', desc: 'At a KSSN partner school, a scholar has missed 22% of days. The family reports food insecurity, difficulty accessing appointments, and unreliable transportation.' },
    { key: 'day10', role: 'Attendance Team', title: 'Day 10: Plan not delivered', desc: 'A Tier 2 scholar has a transportation plan, but the backup ride was never arranged. Attendance is unchanged at Day 10.' },
    { key: 'day20', role: 'Attendance Team', title: 'Day 20: Barrier remains', desc: "A Tier 2 scholar's check-in plan was delivered consistently for 20 school days. The scholar still avoids a class because of unresolved academic difficulty." },
    { key: 'day30', role: 'Attendance Team', title: 'Day 30: Attendance improving', desc: "A Tier 2 scholar's transportation barrier has reduced, and attendance has improved steadily through the Day 30 review." },
    { key: 'district', role: 'District / Department Staff', title: 'Recurring transportation barriers', desc: 'Several schools report the same transportation access problem, but each is creating separate temporary solutions.' }
  ];
  const roleMatch = (scenRole, role) => { if (!role) return false; const a = scenRole.toLowerCase(), b = role.toLowerCase(); if (b.includes('family support') && /fss|family support/.test(a)) return true; if (b.includes('counselor') && /counselor/.test(a)) return true; if (b.includes('district') && /district/.test(a)) return true; return a.includes(b.split(' ')[0].replace('/', '')); };
  function renderPractice() {
    const role = getRole();
    const list = SCEN.slice().sort((a, b) => roleMatch(b.role, role) - roleMatch(a.role, role));
    $('#scenarioCards').innerHTML = list.map((s) => `<article class="scen ${roleMatch(s.role, role) ? 'mine' : ''}"><span class="tag">${esc(s.role)}</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><button class="btn secondary small" type="button" data-scen="${s.key}">Work through it →</button></article>`).join('');
    $('#actionPairs').innerHTML = `<table class="big-table"><thead><tr><th>Action</th><th>Intervention</th></tr></thead><tbody>${[
      ['Sent an attendance letter.', 'After identifying a misconception, created an attendance goal/habit plan with progress feedback and review.'],
      ['Called the caregiver about transportation.', 'Created a primary and backup transportation plan, completed a warm handoff, and monitored arrival.'],
      ['Referred the scholar to FSS.', 'FSS identified the family-facing barrier, implemented the matched plan, coordinated resources, and monitored barrier reduction.'],
      ['Shared a counseling resource.', 'Implemented a predictable re-entry/check-in plan while completing the behavioral-health connection and monitoring avoidance.'],
      ['Held an attendance conference.', 'Used the conference findings to create a specific barrier-removal plan with an owner, dosage, goal, and review date.'],
      ['Gave an incentive.', 'The barrier-matched support remains the intervention; an incentive is only a documented component when appropriate.']
    ].map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table>`;
  }

  /* ---------- team room ---------- */
  function renderTeam() { if (window.PB) { PB.render('team'); PB.challenge(scholars); } }

  /* ---------- router ---------- */
  const VIEWS = ['home', 'ch', 'support', 'cases', 'library', 'practice', 'team', 'families'];
  function route() {
    const h = location.hash.replace(/^#/, '');
    if (h.startsWith('resource=')) { if (!$('.view.active')) showView('library'); return; } // detail modal opens over the current view
    const parts = h.split('/');
    let view = parts[0] || 'home';
    if (view === 'data') view = 'team';
    if (view === 'case') { showView('cases'); $('#casesList').hidden = true; $('#caseDetail').hidden = false; renderCaseDetail(parts[1]); return; }
    if (!VIEWS.includes(view)) view = 'home';
    showView(view, parts.slice(1));
  }
  function showView(v, arg) {
    $$('.view').forEach((el) => el.classList.toggle('active', el.id === 'view-' + v));
    const tab = { cases: 'support', practice: 'support' }[v] || v;
    $$('.tabs a').forEach((a) => { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (v === 'home') renderHome();
    if (v === 'support') renderFlow();
    if (v === 'cases') { $('#casesList').hidden = false; $('#caseDetail').hidden = true; renderCases(); }
    if (v === 'practice') renderPractice();
    if (v === 'team') renderTeam();
    if (v === 'ch' || v === 'families') PB.render(v, arg);
    const titles = { home: 'GRPS Attendance Playbook', ch: 'Playbook', support: 'Support a scholar', cases: 'My plans', library: 'Search', practice: 'Practice cases', team: 'Team Room', families: 'Families' };
    document.title = (titles[v] || 'GRPS Attendance Playbook') + ' | Strive for Less Than 5';
    if (!(v === 'ch' && arg && arg[1])) window.scrollTo(0, 0);
    renderChrome();
  }

  /* ---------- global events ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-role],[data-go],[data-step],[data-root],[data-need],[data-q],[data-scen],[data-start],[data-pathway],[data-open-res],[data-review],#fDescribeGo');
    if (!t) return;
    if (t.dataset.go !== undefined) { goStep(Number(t.dataset.go)); return; }
    if (t.dataset.step !== undefined) { goStep(Number(t.dataset.step)); return; }
    if (t.dataset.root !== undefined && t.classList.contains('choice')) { if (t.dataset.root) { if (flow.root !== t.dataset.root) { flow.need = ''; flow.picks = null; } flow.root = t.dataset.root; flow.unsure = false; goStep(2); } else { flow.unsure = true; flow.root = ''; renderFlow(); } return; }
    if (t.dataset.need !== undefined) { flow.need = t.dataset.need; flow.picks = null; goStep(3); return; }
    if (t.id === 'fDescribeGo') { const v = $('#fDescribe').value.trim(); searchLibrary(v || ''); return; }
    if (t.dataset.q !== undefined) { searchLibrary(t.dataset.q); return; }
    if (t.dataset.scen !== undefined) { renderScenario(t.dataset.scen); return; }
    if (t.dataset.start !== undefined) { S5.startSupport({ pct: t.dataset.pct, localId: t.dataset.start, school: t.dataset.school }); return; }
    if (t.dataset.pathway !== undefined) { S5.startSupport({ root: t.dataset.pathway }); return; }
    if (t.dataset.openRes !== undefined) { openDetail(t.dataset.openRes); return; }
    if (t.dataset.review !== undefined) { const el = $('#reviewCard'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  function searchLibrary(text) { location.hash = '#library'; const qi = document.getElementById('q'); qi.value = text; renderResources(); pbHits(); qi.focus(); }

  window.S5 = {
    startSupport(o) {
      flow = freshFlow();
      if (o.pct !== undefined && o.pct !== '') flow.pct = String(o.pct);
      if (o.localId) flow.localId = o.localId; if (o.school) flow.school = o.school;
      if (o.root) flow.root = o.root; if (o.need) { flow.need = o.need; }
      flow.step = flow.need && flow.pct !== '' ? 3 : flow.root && flow.pct !== '' ? 2 : flow.pct !== '' ? 1 : 0;
      if (location.hash !== '#support') location.hash = '#support'; else renderFlow();
    },
    loadScenario(key) { const x = scenarios[key]; if (!x || !x.matcher) return; S5.startSupport({ pct: x.matcher.pct, root: x.matcher.root, need: x.matcher.need }); toast('Practice case loaded into Support a scholar'); },
    toast,
    dueCount: () => dueCases().length,
    activeCount: () => allCases().filter((c) => c.status === 'active').length,
    dueList: () => dueCases().map((u) => Object.assign({ when: statusText(u.st, u.r.due) }, u))
  };

  /* intake events */
  $('#csvFile').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) f.text().then((t) => loadData(t, f.name)); e.target.value = ''; });
  const dz = $('#dropZone');
  ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('over'); }));
  dz.addEventListener('drop', (e) => { const f = e.dataTransfer.files[0]; if (f) f.text().then((t) => loadData(t, f.name)); });
  $('#pasteToggle').onclick = () => { $('#pasteBox').hidden = !$('#pasteBox').hidden; if (!$('#pasteBox').hidden) $('#pasteArea').focus(); };
  $('#pasteGo').onclick = () => loadData($('#pasteArea').value, 'Pasted data');
  $('#sampleData').onclick = () => loadData(sampleCSV(), 'Sample data (fictional scholars)');
  $('#caseFilter').onchange = renderCases; $('#caseSearch').oninput = renderCases;
  $('#exportJson').onclick = () => download('Strive5_Cases_' + iso(today()) + '.json', JSON.stringify({ app: 'strive5', version: 1, exported: new Date().toISOString(), cases: allCases() }, null, 1), 'application/json');
  $('#exportCsv').onclick = () => download('Strive5_Cases_' + iso(today()) + '.csv', ['Local ID,School,Status,Start,Baseline %,Current %,Tier,Root cause,Need,Primary intervention,Owner,Next review,Next due'].concat(allCases().map((c) => { const r = nextReview(c); return [c.localId, c.school, c.status, c.start, c.baselinePct, c.currentPct, c.tier, c.root, c.need, (c.interventions[0] || {}).name, c.owner, r ? 'Day ' + r.day : '', r ? r.due : ''].map(csvCell).join(','); })).join('\n'), 'text/csv');
  $('#importJson').addEventListener('change', (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { try { const d = JSON.parse(t); const inc = Array.isArray(d) ? d : d.cases; if (!Array.isArray(inc)) throw 0; const l = allCases(); let added = 0; inc.forEach((c) => { if (c && c.id && c.reviews && !l.some((x) => x.id === c.id)) { l.push(c); added++; } }); saveCases(l); renderChrome(); renderCases(); toast(added + ' case' + (added === 1 ? '' : 's') + ' imported'); } catch (err) { toast('That file is not a Strive for 5 case export.'); } }); e.target.value = ''; });
  $('#libChips').innerHTML = COMMON_NEEDS.map((n) => `<button class="chip" type="button" data-q="${esc(n)}">${esc(n)}</button>`).join('');

  /* search: also show matching Playbook sections and links */
  function pbHits() {
    const q = document.getElementById('q').value; const host = $('#pbHits'); if (!window.PB) return;
    const secs = PB.searchChapters(q), lk = PB.searchLinks(q);
    host.innerHTML = secs.length || lk.length ? `<div class="callout"><b>In the Playbook:</b> ${secs.map((x) => `<a href="#ch/${x.c.n}/${x.s.id}">${esc(x.s.t)}</a> <span class="small muted">(ch. ${x.c.n})</span>`).join(' · ')}${lk.length ? `<div class="readmore">${lk.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>` : ''}</div>` : '';
  }
  document.getElementById('q').addEventListener('input', pbHits);
  document.getElementById('reset').addEventListener('click', () => { $('#pbHits').innerHTML = ''; });

  window.addEventListener('hashchange', route);
  route();
})();

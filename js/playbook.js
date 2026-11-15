/* GRPS Attendance Playbook — interactive edition.
   Content follows the GRPS Attendance Playbook (PDF in this repo), the Strive for 5 Attendance Toolkit,
   and the GRPS Attendance Support & Escalation Framework (April 2026). Rendered by window.PB. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } } };
  const PDF = 'Strive_for_Less_Than_5_Playbook.pdf';
  const pg = (n) => `${PDF}#page=${n}`;
  const L = (label, url) => ({ label, url });
  const links = (arr) => arr && arr.length ? `<div class="readmore">${arr.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>` : '';

  /* ---------- levels (Playbook categories + GRPS framework tiers) ---------- */
  function level(pct) {
    if (!(pct >= 0)) return null;
    if (pct < 5) return { key: 'sat', name: 'Satisfactory', tier: 'Tier 1', cls: 't1', owner: 'All school staff' };
    if (pct < 10) return { key: 'risk', name: 'At risk', tier: 'Tier 1', cls: 't1', owner: 'All school staff; Attendance Team monitors' };
    if (pct < 20) return { key: 'mod', name: 'Moderate chronic', tier: 'Tier 2', cls: 't2', owner: 'Building Attendance Team' };
    return { key: 'sev', name: 'Severe chronic', tier: 'Tier 3', cls: 't3', owner: 'FSS + Attendance Team' };
  }

  /* ---------- chapters ---------- */
  const CH = [
    { n: 1, slug: 'why', title: 'Why attendance matters', try: 'Try: the days calculator', pages: '3–10', secs: [
      { id: 'matters', t: 'Why does attendance matter?', p: 4, html: `<p>Research shows that <b>chronic absence (missing 10% of the school year, excused or unexcused)</b> can hinder elementary scholars' reading by third grade and raises the chance older scholars drop out. Absence also becomes a habit: scholars who are chronically absent in elementary school often stay that way in middle and high school.</p><p>When scholars miss school it disrupts the whole class. Widespread absence makes it harder for teachers to teach and for every scholar to learn. Tackling absenteeism is central to closing the achievement gap.</p>` },
      { id: 'metrics', t: 'Misleading metrics', p: 5, w: 'metrics', html: `<div class="cols2"><div><h4>Average Daily Attendance (ADA)</h4><p>Used in state and federal reporting: total attendance divided by instructional days. Because it doesn't count individual scholars' repeated absences, it can hide how much chronic absence there is.</p></div><div><h4>Truancy</h4><p>10 unexcused absences in a school year. It only counts unexcused days, so it misses scholars whose absences are excused but still add up.</p></div></div>`, links: [L('Chronic absence & truancy (Attendance Works)', 'https://www.attendanceworks.org/whats-the-difference-between-chronic-absence-and-truancy/')] },
      { id: 'categories', t: 'Categories of chronic absenteeism', p: 5, w: 'days', html: `<p><b>Chronic absenteeism</b> is missing 10% or more of school days, including excused absences, unexcused absences and suspensions.</p>` },
      { id: 'solvable', t: 'Chronic absence is solvable', p: 6, w: 'abcd', html: `<p>Every absence has a reason. The Playbook groups them into four root causes. Tap one to see examples.</p>` },
      { id: 'plan', t: 'GRPS and Attendance Works strategic plan', p: 7, html: `<p>Chronic absence stems from the ongoing challenges of poverty and unequal access to learning opportunities, and it disproportionately affects Latino and Black scholars. It is both a cause and a consequence of harsh discipline; absence in kindergarten can predict suspensions in middle school.</p><p>Improving attendance connects to every GRPS strategic theme:</p><ol><li>Meet holistic scholar needs</li><li>Optimize and value all school options</li><li>Ensure equitable access and outcomes</li><li>Enhance curriculum and program opportunities</li><li>Cultivate an engaged, impactful, more diverse workforce</li><li>Create a culture of trust, collaboration and stewardship</li></ol>`, links: [L('GRPS & Attendance Works strategic plan', 'https://drive.google.com/file/d/1ZmDGBl0g6whzpTR10c5wGvrksXbJBrJu/view')] },
      { id: 'conditions', t: 'Positive conditions for learning', p: 8, html: `<p>Reducing chronic absence goes hand in hand with positive conditions for learning. When schools are engaging, supportive, welcoming and culturally responsive, families help their children get to school and scholars want to attend, even when there are hurdles. And when scholars attend consistently, supportive relationships and meaningful learning are more likely to happen.</p>`, links: [L('Using chronic absence data to improve conditions for learning', 'https://drive.google.com/file/d/1c0zjfUzVlD9OFdudHQ8DcVxpTMUSZmKA/view'), L('Positive conditions: strategies & barriers', 'https://docs.google.com/presentation/d/1sEFCsZSZtVnaiOrCDr1nMUK2ERnaKxQ4/edit')] },
      { id: 'strive', t: 'Strive for Less Than 5', p: 10, html: `<p><b>"Strive for Less Than 5"</b> is the goal of every scholar missing fewer than five days of school. Schools should run a building-level challenge between grade levels to see who has the best attendance each month. <a href="#team">Run the challenge in the Team Room →</a></p><h4>Background</h4><p>In 2006, six GRPS schools piloted an attendance program with Kent School Services Network (KSSN), the district's first programmatic focus on attendance. "Make Every Day Count" went district-wide in fall 2013, coordinating planning across district, school and community. The next year it returned as "Challenge 5," with the tagline "Strive for Less than 5." Today it is simply <b>Strive for Less than 5</b>.</p>`, links: [L('Order Strive for Less Than 5 merchandise', 'https://drive.google.com/file/d/13G6vKtC-s870xmIABvXW4S5SP-Tz-9FI/view')] }
    ] },
    { n: 2, slug: 'universal', title: 'Universal & proactive strategies', try: 'Try: explore MTSS', pages: '11–18', secs: [
      { id: 'five', t: 'Universal strategies', p: 12, w: 'five', html: `<p>Five strategies from Attendance Works that every school uses for every scholar. Tap each one.</p>` },
      { id: 'sel', t: 'Social & emotional learning', p: 13, html: `<p>GRPS educates the whole child, including social and emotional learning (SEL) for scholars and adults, by explicitly teaching and modeling the skills to:</p><ul><li>Recognize and manage emotions</li><li>Show caring and concern for others</li><li>Build positive relationships</li><li>Make responsible decisions</li><li>Handle challenging social situations constructively</li></ul><p><b>SEL and attendance.</b> When scholars build self-regulation, relationship skills and emotional awareness, they feel more connected to school. That connection reduces the isolation and disengagement behind many absences, and helps scholars handle personal challenges with resilience.</p>`, links: [L('GRPS SEL webpage', 'https://grps.org/departments/sel/'), L('The CASEL 5 framework', 'https://casel.org/fundamentals-of-sel/what-is-the-casel-framework/')] },
      { id: 'restorative', t: 'Restorative practices', p: 15, html: `<p>An intentional, respectful approach to behavior that prioritizes relationships and repair. Techniques prevent relationship-damaging incidents and repair them when they happen, and they strengthen the five SEL skills: self-awareness, self-management, relationship skills, social awareness and responsible decision-making.</p>`, links: [L('Proactive circles', 'https://drive.google.com/file/d/12Tp5IihKAF9IBtj6_F7PDREo6dGZuNtK/view'), L('Shared agreements', 'https://drive.google.com/file/d/1TQueGnfExwKUoRKnWv5qWT1AwOwWWWJY/view'), L('Community building circles', 'https://drive.google.com/file/d/18x_WMW3faQ44wx_XOuRpPNSTfPkByLOz/view')] },
      { id: 'mtss', t: 'Multi-tiered system of supports (MTSS)', p: 16, w: 'mtss', html: `<p>MTSS removes systemic barriers, uses evidence-based practices and data-driven decisions, and makes support consistent across the district. The district team provides vision, resources and professional learning; the building team collects and evaluates data, plans, and coordinates staffing, time and school-level teams.</p>`, links: [L('What is MTSS?', 'https://www.panoramaed.com/blog/mtss-comprehensive-guide#tiered-interventions'), L('Quick guide: MTSS at the building level', 'https://drive.google.com/file/d/1KAGk0OwWRuMa4Wtr9SQ8hPYuuBLmnlNK/view'), L('MTSS definitions & references', 'https://drive.google.com/file/d/1__V3v-di_-3u4pAMrDsogfYua_XNQkFC/view')] }
    ] },
    { n: 3, slug: 'health', title: 'Health & wellness', try: 'Try: stay home or go?', pages: '19–22', secs: [
      { id: 'health', t: 'Health and attendance', p: 20, html: `<p>School nurses protect and promote scholar health and academic success. Chronic disease and lack of health or dental care are real barriers to GRPS attendance, and addressing them has a powerful effect on learning and well-being.</p><p>Illness is more common in winter. Keep communicating with caregivers and offer support to overcome these challenges.</p>`, links: [L('Healthy Schools Campaign toolkit', 'https://healthyschoolscampaign.org/wp-content/uploads/2017/02/Addressing_Health-Related_Chronic_Absenteeism_Toolkit_for_Action_Full.pdf'), L('Healthy and Ready to Learn', 'https://hrl.nyc/node/hbl-links'), L('Health handouts for families (Attendance Works)', 'https://www.attendanceworks.org/resources/health-handouts-for-families/'), L('Winter attendance tips for parents', 'https://drive.google.com/file/d/1i59SOWDSp3yOVfgJ9vqKBPkq8CRUAhOs/view')] },
      { id: 'stayhome', t: 'When should a scholar stay home?', p: 20, w: 'stayhome', html: `<p>This is the same check families see on the <a href="#families">Families page</a>.</p>` },
      { id: 'mental', t: 'Mental health and attendance', p: 21, html: `<p>Scholar voice matters. Scholars build the social and emotional skills to manage mental health challenges, and when they weigh in on decisions made on their behalf, those decisions get more support and leaders get a clear picture of scholar needs. The schoolwide student voice self-assessment helps schools formalize and strengthen student voice practices.</p><p><b>Why focus on mental health?</b> Mentally healthy scholars are more likely to come to school ready to learn, engage, build caring connections and add to positive school culture. Schools are a safe, non-stigmatizing place for prevention, early intervention and treatment.</p><p><b>Did you know?</b> Our Mental Health Collective offers culturally responsive and affirming care for Black, African, Asian, Indigenous, Latine and other marginalized communities.</p>`, links: [L('Tap into student voice', 'https://thoughtexchange.com/blog/student-voice-enhances-edu-quality/'), L('Student voice schoolwide self-assessment', 'https://drive.google.com/file/d/1TVllN-9vmDeuHnvsdrg79ZnGUDkrZ7x4/view'), L('GRPS school-based mental health services', 'https://grps.org/departments/school-based-mental-health-services/'), L('Our Mental Health Collective', 'https://ourmhc.org/'), L('NAMI: mental health in schools', 'https://www.nami.org/advocacy/policy-priorities/improving-health/mental-health-in-schools/')] }
    ] },
    { n: 4, slug: 'families', title: 'Families & community', try: 'Try: plan a family event', pages: '23–25', secs: [
      { id: 'face', t: 'Family & Community Engagement (FACE)', p: 24, html: `<p>FACE builds a cooperative link between home, school and community. Its plan has four goals:</p><ol><li>Build the capacity of staff and families to work as partners</li><li>Develop two-way communication between staff and parents</li><li>Create joint decision-making opportunities</li><li>Ensure equitable distribution of family engagement resources</li></ol><p><b>Did you know?</b> Findhelp lists free or reduced-cost food, housing, financial help, health care and more.</p>`, links: [L('Findhelp', 'https://findhelp.org/'), L('Parent University', 'https://parents.grps.org/'), L('FACE section of the Title I handbook', 'https://drive.google.com/file/d/1Z0qOx9rqi5E8ObQmQ-EzUBWb9D689Hd3/view'), L('Volunteer at GRPS', 'https://grps.org/departments/css/volunteer/')] },
      { id: 'ideas', t: 'Expanding on FACE', p: 25, w: 'ideas', html: `<p>FACE builds school-based community (parent organizations, Parent University workshops, volunteering, tutoring, conferences, two-way contact with teachers) and supports families with instruction, engagement and resources.</p>` }
    ] },
    { n: 5, slug: 'data', title: 'Data & analytics', try: 'Try: which Synergy report?', pages: '26–28', secs: [
      { id: 'synergy', t: 'Synergy Analytics', p: 27, w: 'synergy', html: `<p>Synergy is the GRPS scholar information system. The best way to find scholars with chronic absence is the attendance data the district already collects: see which and how many scholars are missing 10% or more, and watch trends over time by grade and subgroup.</p>`, links: [L('Attendance report guide', 'https://drive.google.com/file/d/1QEwsX-Ac8NuTk_9O0v0Y-kGQggnZVEWn/view'), L('Synergy Analytics dashboard catalog', 'https://docs.google.com/document/d/1HHGuB9pJl2tNw50jkkS1B8ctIvIxEj6q-lIlKvVUJNw/edit'), L('Additional attendance Synergy reports (GRPS staff)', 'https://grpublicschools.sharepoint.com/:b:/s/AtkinsShare/EcUKeMYdOulLkESzIHQB4UcBgG5rd-aFzW4-RbXr_LVUeQ?e=i6hWkm')] },
      { id: 'panorama', t: 'SEL data: Panorama', p: 28, html: `<p>Panorama surveys measure belonging, self-efficacy, and positive and challenging feelings. Scholars take it twice a year; staff and caregivers once. Panorama's Playbook gives GRPS staff hundreds of interventions across academics, behavior and life skills, including a playlist of evidence-based strategies for chronic absenteeism.</p>`, links: [L('Responding to Panorama survey results', 'https://docs.google.com/presentation/d/1i8ldUnb-gckgXwUdoETEvfFLD1Ey5Z7CjO_-KG-dgl4/edit'), L('Playlist: interventions for chronic absenteeism', 'https://docs.google.com/spreadsheets/d/1snQRg5QdLiK-AhtXpVO0iav3bgHV2FFo/edit'), L('Panorama Playbook (sign in)', 'https://playbook.panoramaed.com')] },
      { id: 'yourdata', t: 'Look at your own school', p: 27, html: `<p>Export Synergy <b>U-CHRON 027</b> (Chronic Student Detail by School) and load it in the Team Room. You'll see the four absence levels, the grade-level challenge, and scholars on the cusp of moving up a tier. The file stays on your device.</p><a class="btn orange" href="#team">Open the Team Room →</a>` }
    ] },
    { n: 6, slug: 'barriers', title: 'Barriers & supports', try: 'Try: sort the reasons', pages: '29–36', secs: [
      { id: 'equity', t: 'Addressing barriers and aversions', p: 30, html: `<p>Equitable learning environments respond to the diversity of a school community, create rich opportunities for scholar action and reflection, attend to how young people experience learning, and build their sense of competence, connectedness and purpose. SEL both depends on and contributes to an environment where everyone feels respected, supported and engaged.</p><p><b>Theory of change.</b> Mindset (the five SEL skills, adult SEL) + actionable data (Synergy, Panorama) + capacity (community of practice, professional development) + strategies (scholar and parent engagement, monitoring, evaluating impact) lead to the outcome.</p>`, links: [L('SEL reflection tool', 'https://docs.google.com/document/d/1lpgTVwlBQwgdJTVYdF1eOJjg9B_zsCUj/edit'), L('Toolbox: adult learning about SEL', 'https://docs.google.com/presentation/d/1vtBavtj_hzOxGBs7vHWPwJdaIDc1TmCet6gAovpfSig/present')] },
      { id: 'roots', t: 'Root causes of absences', p: 32, w: 'sorter', html: `<p>Sort real reasons scholars miss school into the four root causes. Tap a reason, then tap where it belongs (or drag it on a computer).</p>` },
      { id: 'align', t: 'Align interventions to reasons for absence', p: 33, w: 'align', html: `<p>Pick a reason to see possible interventions and partners.</p><div class="callout orange"><b>Actions vs. interventions.</b> An <b>action</b> is something that was done, like sending a letter or making a phone call. It is <u>not</u> an intervention. An <b>intervention</b> is designed to remove a barrier that keeps a scholar from attending, change a behavior, or address the situation.</div>` },
      { id: 'quiz', t: 'Action or intervention?', p: 33, w: 'actquiz', html: `<p>Six quick ones. Decide, then check.</p>` },
      { id: 'team', t: 'Building and leading an effective Attendance Team', p: 34, w: 'steps', html: '', links: [L('GRPS Attendance Support & Escalation Framework', 'https://drive.google.com/file/d/1F-wNamt2IWeF1FkubeOC7-vZ2T1Elltc/view'), L('Sample Attendance Team agenda', 'https://docs.google.com/document/d/1Lj5PQn7NOtlNpvXPDNYD_FQ0jGoF0FGdbzVRx7MP4pA/edit'), L('Attendance Works self-assessments', 'https://www.attendanceworks.org/resources/self-assessment/')] },
      { id: 'handouts', t: 'Handouts & tips for Attendance Teams', p: 35, html: `<div class="cols2"><div><h4>Communication tools & scripts</h4><p class="small muted">Phone and robocall scripts, letters and messaging.</p></div><div><h4>Scholar & family support</h4><p class="small muted">Success plans and attendance tips for K–5 and 6–12.</p></div></div>`, links: [L('Phone call scripts', 'https://drive.google.com/file/d/10csNmw6Jk6imqUhQyjwgJI5HV5RpfySD/view'), L('Robocall script', 'https://drive.google.com/file/d/1ovJDrZJnd7O3kUrF7DcY9JrxiYoI54Gs/view'), L('Script for Tier II', 'https://drive.google.com/file/d/1oChZkNGgm8356GYjHxZ44ZB22RiEEtVT/view'), L('"Over 10 days or 5 in a row" letter', 'https://drive.google.com/file/d/1J2AaSOxpfirDoZHMWPt1J784af0fr3HY/view'), L('GRPS break letters', 'https://drive.google.com/drive/folders/1oGadjP_ptnrLB5fbD7iIqitSX1Xfq1Ar'), L('Welcome students to school (Attendance Works)', 'https://www.attendanceworks.org/resources/welcome-students-to-school/'), L('Showing Up Matters for R.E.A.L.', 'https://www.attendanceworks.org/resources/toolkits/showing-up-matters-for-real/'), L('Student attendance success plans', 'https://www.attendanceworks.org/resources/student-attendance-success-plans/'), L('K–5 attendance tips handout', 'https://drive.google.com/file/d/1YjBbAqap5u7RN-4EayWhiVp9rwKQczzn/view'), L('6–12 attendance tips handout', 'https://drive.google.com/file/d/12YPW9UZ1AJrDj-0idnBp1cgqZRyikPTh/view'), L('Where everybody knows your name (Harvard Ed.)', 'https://www.gse.harvard.edu/ideas/ed-magazine/24/05/um-where-everybody')] },
      { id: 'fss', t: 'Family Support Specialists (FSS)', p: 36, html: `<p>FSS reduce chronic absenteeism by identifying and removing the barriers that keep scholars from school, working directly with families through home visits and other contacts.</p><p><b>FSS home visits</b> are voluntary, scheduled visits to a home (or a neutral place) to meet with a family, strengthen the school-family relationship, and focus on the family's strengths and hopes for their child. Ideally families get several visits that build trust over time.</p><ul><li><b>Caring conversations:</b> strengths-based conversations that build relationships</li><li><b>Relationship mapping:</b> making sure every scholar has a positive connection to at least one caring adult</li><li><b>Scholar voice:</b> the scholar's own perspective on learning and school</li></ul>`, links: [L('FSS + KSSN: how we work together', 'https://melatkins2-ops.github.io/grps-fss-kssn-integration-test/'), L('Family Support Specialist overview', 'https://drive.google.com/file/d/1cC7onuuS8GkBDJguCNOMftWqGMpmkZO3/view'), L('Relationship mapping (Harvard)', 'https://mcc.gse.harvard.edu/educators-relationship-mapping'), L('Elevating student voice', 'https://www.americanprogress.org/article/elevating-student-voice-education/')] }
    ] },
    { n: 7, slug: 'resources', title: 'Additional resources', try: 'Search every link', pages: '37–39', secs: [
      { id: 'all', t: 'Every resource in the Playbook', p: 38, w: 'alllinks', html: `<p>All of the Playbook's links in one place. Filter by typing.</p>` },
      { id: 'previous', t: 'Previous GRPS attendance resources', p: 39, html: '', links: [L('Disruptive strategies for change making (8 pp.)', 'https://drive.google.com/file/d/1CSEhfbqdyjOAbeOYtUUUShUBvbxRO1-F/view'), L('Successful attendance strategies (16 pp.)', 'https://drive.google.com/file/d/1no51ZcvBdclLVxj8BNyzBNuDuYwy8vCU/view'), L('Attendance success toolkit (43 pp.)', 'https://drive.google.com/file/d/1wTjxtTEaHfmbEKI3rtMurPw0iEOOb73P/view'), L('Attendance toolkit (56 pp.)', 'https://drive.google.com/file/d/1UvciawVD0sCPWwMg1sOnO260Budb7G7N/view'), L('Strive for 5 Attendance Toolkit (updated links)', 'https://drive.google.com/file/d/1IB-b8hYlut-umaXb30QopKNXi3C6P_ii/view')] }
    ] }
  ];
  const EXTRA_LINKS = [
    { ch: 2, sec: 'five', l: [L('Handouts for families', 'https://www.attendanceworks.org/resources/handouts-for-families-2/'), L('Create a welcoming environment', 'https://www.attendanceworks.org/resources/toolkits/teaching-attendance-2-0/create-a-welcoming-environment-that-engages-students-and-families/'), L('Develop staff capacity', 'https://www.attendanceworks.org/resources/toolkits/for-principals-leading-attendance/develop-staff-capacity-to-adopt-effective-attendance-practice/'), L('Tiered absence intervention strategies', 'https://docs.google.com/document/d/1dHTYdTj5wu_pVKyzuigMOx2SI_NOdzFlegYNIWn_l-o/edit'), L('The Power of Positive Connections toolkit', 'https://www.attendanceworks.org/resources/toolkits/the-power-of-positive-connections-toolkit/')] },
    { ch: 7, sec: 'all', l: [L('Attendance in alternative schools', 'https://drive.google.com/file/d/1q4dZjlBJeixLP8Qpewpd01CMmBGdBaXB/view'), L('Attendance is a family affair (ASCD)', 'https://ascd.org/el/articles/attendance-is-a-family-affair'), L('50 community-building questions for scholars', 'https://drive.google.com/file/d/1qhp4Ccl70sJffmFoECVikOG6yfcSkD4I/view'), L('United Way 2-1-1', 'https://www.hwmuw.org/211'), L('Relationship strategy bank', 'https://www.scoe.net/media/e4olyyjr/sesion_2_relationship_strategy_bank.pdf'), L('Dual Capacity-Building Framework', 'https://www.dualcapacity.org/'), L('National PTA family resources', 'https://www.pta.org/home/family-resources'), L('Attendance Works', 'https://www.attendanceworks.org/')] }
  ];
  EXTRA_LINKS.forEach((x) => { const s = CH[x.ch - 1].secs.find((y) => y.id === x.sec); s.links = (s.links || []).concat(x.l); });
  const ALL_LINKS = [];
  CH.forEach((c) => c.secs.forEach((s) => (s.links || []).forEach((l) => { if (!ALL_LINKS.some((a) => a.url === l.url)) ALL_LINKS.push(Object.assign({ ch: c.n, chTitle: c.title, sec: s.t, page: s.p }, l)); })));

  /* ---------- widget data ---------- */
  const ROOTS = {
    Barriers: { tag: 'Something gets in the way', ex: ['Chronic and acute illness', 'Family responsibilities or home situation', 'Trauma', 'Poor transportation', 'Housing and food insecurity', 'Inequitable access to needed services', 'System involvement', 'Lack of predictable schedules for learning', 'Lack of access to tech', 'Community violence'] },
    Aversion: { tag: 'School feels hard to face', ex: ['Struggling academically and/or behaviorally', 'Unwelcoming school climate', 'Social and peer challenges', 'Anxiety', 'Biased disciplinary and suspension practices', 'Undiagnosed disability and/or disability accommodations', 'Caregivers had negative educational experiences'] },
    Disengagement: { tag: 'No reason to be there', ex: ['Lack of challenging, culturally responsive instruction', 'Bored', 'No meaningful relationships to adults in school', 'Lack of academic and behavioral support', 'Failure to earn credits', 'Need to work conflicts with being in high school'] },
    Misconceptions: { tag: '"It doesn\'t matter"', ex: ['Absences are only a problem if they are unexcused', 'Missing 2 days per month doesn\'t affect learning', 'Lose track and underestimate TOTAL absences', 'Assume scholars must stay home for any symptom of illness', 'Attendance only matters in older grades', 'Suspensions don\'t count as absence'] }
  };
  const SORT_ITEMS = [['Poor transportation', 'Barriers'], ['Housing and food insecurity', 'Barriers'], ['Family responsibilities at home', 'Barriers'], ['Chronic illness', 'Barriers'], ['Community violence', 'Barriers'], ['No access to tech', 'Barriers'], ['Anxiety', 'Aversion'], ['Peer challenges / bullying', 'Aversion'], ['Struggling academically', 'Aversion'], ['Unwelcoming school climate', 'Aversion'], ['Caregiver had a bad school experience', 'Aversion'], ['Bored in class', 'Disengagement'], ['No caring adult at school', 'Disengagement'], ['Behind on credits', 'Disengagement'], ['Needs to work', 'Disengagement'], ['"Excused absences don\'t count"', 'Misconceptions'], ['"Two days a month is no big deal"', 'Misconceptions'], ['Stays home for any symptom', 'Misconceptions'], ['"Attendance only matters later"', 'Misconceptions'], ['"Suspensions aren\'t absences"', 'Misconceptions']];
  const FIVE = [
    ['Recognize good and improved attendance', 'Acknowledge good and improved attendance with incentives like certificates, extra recess or homework passes. Avoid emphasizing perfect attendance so scholars who are improving are included.'],
    ['Engage scholars and parents', 'Build a welcoming environment and positive relationships with families. Promote safety, respect and responsibility, let scholars know they are missed when absent, and help families see how absences affect their children\'s futures.'],
    ['Monitor attendance data and practice', 'Have a team track attendance data and support chronically absent scholars. Use district data to find scholars missing 10% or more and watch trends over time.'],
    ['Provide early, personalized outreach', 'Use data to find families who need support and connect with scholars who are missing school. Address barriers like hunger, health care access or transportation, and prepare resources for families likely to need them.'],
    ['Develop a programmatic response to barriers', 'As needed, start programs (like Parent University) that engage families and reduce chronic absence, and that empower parents to advocate for their children.']
  ];
  const MTSS = {
    3: { name: 'Tier 3', sub: 'Intensive · 1–5%', cols: { Academics: ['Individualized Education Plan', 'Student Success Team', 'Intensive reading or math interventions', 'Alternative learning environment'], Attendance: ['Student Success Team', 'Barrier removal (e.g., housing, transportation)', 'Legal interventions, only as a last resort'], 'Mental health': ['Individual therapy (e.g., play therapy, coping skills)', 'Coordination with primary care, psychiatry or outside counseling', 'Referral for mental health and/or KSSN services', 'Wraparound services (e.g., Family Outreach Center, Arbor Circle)'], 'PBIS with SEL': ['Restorative practices (re-entry circle)'] } },
    2: { name: 'Tier 2', sub: 'Targeted · 10–15%', cols: { Academics: ['Small group instruction', 'Tutoring', 'Push in / pull out', 'Expanded learning opportunities'], Attendance: ['Individualized attendance plan', '1:1 community partnership', 'Mentoring (e.g., Kids Hope, Affinity Mentoring)', 'Restorative practices (conferencing)'], 'Mental health': ['Group therapy', 'TRAILS to Wellness SEL curriculum (CBT and mindfulness)'], 'PBIS with SEL': ['Check-in / check-out', 'Alternatives to suspension', 'Restorative practices (conferencing)'] } },
    1: { name: 'Tier 1', sub: 'Universal · 80–90%', cols: { Academics: ['Universal screening', 'Data-driven decision making', 'Differentiation'], Attendance: ['Recognize good and improved attendance', 'Connection to a caring adult', 'Attendance Team'], 'Mental health': ['Mental health resources', 'Mental Health Awareness Month (May)'], 'PBIS with SEL': ['Teach schoolwide expectations through SEL skills', 'Restorative practices (community building)', 'Schoolwide celebrations and community events', 'Evidence-based explicit SEL curriculum'] } }
  };
  const SYNERGY = [
    ['Which scholars are chronically absent right now?', 'U-CHRON 027', 'Chronic Student Detail by School', 'A list of scholars and their current chronic absenteeism status. This is the file to load in the Team Room.'],
    ['How many scholars are in each absence category in my building?', 'U-CHRON 028', 'Cumulative Chronic Absenteeism Status', 'A count of scholars in each chronic absenteeism category, grouped by their current building.'],
    ['How are we trending, school and district?', 'U-CHRON 031', 'Chronic DATT', 'The Chronic Absenteeism School & District Attendance Tracking Tool.'],
    ['Every absence for one scholar', 'ATD201', 'Daily Attendance Profile', 'One scholar\'s attendance for every day in a time period. Use it to see patterns like Mondays or after breaks.'],
    ['Is a scholar missing one class?', 'ATP201', 'Period Student Attendance Profile', 'One scholar\'s attendance by period. Use it to spot class-specific avoidance.'],
    ['Who has missed the most days this month?', 'ATD401', 'Daily Student Absences Totals', 'A list of scholars with their number of absences in a time period.'],
    ['Why are scholars absent (reason codes)?', 'ATD-402 / ATP-402', 'Daily / Period Student Absence Totals', 'Totals of scholar absences by reason code, by day or by period.']
  ];
  const ALIGN = {
    Anxiety: { i: ['Enlist trusted messengers to talk with families about health and safety', 'Meet with the school counselor, social worker or psychologist', 'Offer small groups that teach calming skills'], p: ['Local pediatricians', 'Cherry Health', 'Behavioral health clinicians'] },
    Disengaged: { i: ['Assign a peer group mentor', 'Create an individualized learning plan', 'Explore afterschool options (art, music, STEM)', 'Offer alternatives for credit recovery'], p: ['MENTOR', 'Parks & Rec programs', 'Boys & Girls Club'] },
    'Health (flu / COVID)': { i: ['Messaging on how to stay healthy', 'School nurse educates on preventing the spread of flu or COVID', 'Make sure hygiene supplies are available (soap, tissues, hand sanitizer)', 'Onsite flu and COVID shots'], p: ['School-based health center', 'Local clinic / pediatrician'] },
    Transportation: { i: ['Walking school bus', 'Free municipal bus passes', 'Carpools'], p: ['Parents', 'AmeriCorps program', 'City government'] }
  };
  const ACTQ = [
    ['Sent an attendance letter home', 'a', 'A letter tells the family there is a problem. It doesn\'t change the reason for the absence.'],
    ['Set up a primary and backup ride plan and checked arrival each morning', 'i', 'It removes the transportation barrier and is monitored.'],
    ['Called the caregiver to report today\'s absence', 'a', 'Useful, but on its own the call doesn\'t address why the scholar is absent.'],
    ['Started a daily check-in with a trusted adult, reviewed every 10 school days', 'i', 'It targets connection and is monitored at checkpoints.'],
    ['Referred the scholar to the FSS', 'a', 'A referral is an action. It becomes an intervention when the FSS puts a matched plan in place.'],
    ['Small-group calming skills sessions twice a week for a scholar with anxiety', 'i', 'Designed to reduce the anxiety that keeps the scholar home.']
  ];
  const IDEAS = { community: ['Join the school\'s parent organization (PTCC)', 'Attend a Parent University workshop', 'Volunteer in classrooms or after school', 'Tutor in a content area', 'Attend open houses and conferences', 'Contact teachers or counselors about your child', 'Join a short-term project (grounds, fundraisers, chaperoning)'], events: ['Math night', 'Parent Action Leaders (PALs)', 'Family science fair', 'Summer make-and-take', 'M-STEP night', 'Coffee with the principal', 'PreK open house', 'Family game night', 'School & classroom newsletters', 'After-school clubs', 'Community bulletin board'] };

  /* ---------- families (EN / ES) ---------- */
  const SYMPTOMS = [
    { k: 'fever', stay: true, en: 'Fever of 100.4 °F or higher, or chills', es: 'Fiebre de 100.4 °F o más, o escalofríos' },
    { k: 'cough', stay: true, en: 'New cough or a change in cough', es: 'Tos nueva o cambio en la tos' },
    { k: 'breath', stay: true, en: 'Shortness of breath or wheezing', es: 'Falta de aire o silbido al respirar' },
    { k: 'throat', stay: true, en: 'Sore throat', es: 'Dolor de garganta' },
    { k: 'stomach', stay: true, en: 'Diarrhea and/or vomiting', es: 'Diarrea o vómitos' },
    { k: 'rash', stay: true, en: 'Sores or rash with pus or liquid drainage', es: 'Llagas o sarpullido que supuran pus o líquido' },
    { k: 'cold', stay: false, en: 'Runny nose or mild cold', es: 'Moqueo o resfriado leve' },
    { k: 'tired', stay: false, en: 'Tired or a mild headache', es: 'Cansancio o dolor de cabeza leve' },
    { k: 'worried', stay: false, worry: true, en: 'Worried or anxious about school', es: 'Preocupación o ansiedad por la escuela' }
  ];
  const T = {
    en: {
      eyebrow: 'Every day counts', h1: 'Should my child go to school today?', lead: 'Check what\'s going on. Most mild colds are fine for school. If you\'re not sure, call your school. We\'re here to help.',
      q: 'What do you see today?', none: 'Choose anything you notice.', goT: 'Go to school', goP: 'These alone are not a reason to stay home. Send tissues and let the teacher know.',
      worryT: 'Go, and tell us', worryP: 'Being at school helps worry get smaller, and staying home can make it grow. Tell the teacher or counselor; they can help your child feel ready.',
      stayT: 'Stay home today', stayP: 'Keep your child home and call the school to report the absence. If you\'re unsure or symptoms are serious, call your doctor or the school nurse.',
      mathH: 'Why every day counts', mathP: 'Missing just 2 days a month adds up to about 18 days in a school year. That\'s chronic absence, and it means missing important learning.', a: '2 days a month', b: '≈ 18 days a year', c: 'chronically absent',
      tipsH: 'Tips that help', tipsP: 'Simple routines make mornings easier: lay out clothes the night before, keep a regular bedtime, and have a backup plan for getting to school.', k5: 'K–5 attendance tips', g612: '6–12 attendance tips',
      helpH: 'Need help?', helpP: 'If something makes it hard to get to school (a ride, housing, food, health or worries), tell your school. Your Family Support Specialist can help. You can also find free help nearby:', pu: 'Parent University', src: 'Based on the GRPS Attendance Playbook. This is general guidance, not medical advice.'
    },
    es: {
      eyebrow: 'Cada día cuenta', h1: '¿Debe ir mi hijo a la escuela hoy?', lead: 'Revise cómo se siente su hijo. La mayoría de los resfriados leves no impiden ir a la escuela. Si no está seguro, llame a la escuela. Estamos aquí para ayudar.',
      q: '¿Qué nota hoy?', none: 'Elija lo que observe.', goT: 'Ir a la escuela', goP: 'Estos síntomas por sí solos no son motivo para quedarse en casa. Mándele pañuelos desechables y avísele al maestro.',
      worryT: 'Que vaya, y avísenos', worryP: 'Estar en la escuela ayuda a que la preocupación disminuya; quedarse en casa puede aumentarla. Hable con el maestro o el consejero escolar; ellos pueden ayudar a su hijo a sentirse preparado.',
      stayT: 'Quedarse en casa hoy', stayP: 'Deje a su hijo en casa y llame a la escuela para avisar de la ausencia. Si tiene dudas o los síntomas son graves, llame a su médico o a la enfermera escolar.',
      mathH: 'Por qué cada día cuenta', mathP: 'Faltar solo 2 días al mes suma unos 18 días en el año escolar. Eso es ausentismo crónico y significa perder aprendizaje importante.', a: '2 días al mes', b: '≈ 18 días al año', c: 'ausentismo crónico',
      tipsH: 'Consejos que ayudan', tipsP: 'Las rutinas sencillas facilitan las mañanas: prepare la ropa la noche anterior, mantenga una hora fija para dormir y tenga un plan de respaldo para llegar a la escuela.', k5: 'Consejos K–5 (inglés)', g612: 'Consejos 6–12 (inglés)',
      helpH: '¿Necesita ayuda?', helpP: 'Si algo dificulta llegar a la escuela (transporte, vivienda, comida, salud o preocupaciones), dígale a la escuela. Su Especialista de Apoyo Familiar puede ayudar. También puede encontrar ayuda gratuita cerca:', pu: 'Parent University', src: 'Basado en el Manual de Asistencia de GRPS. Es orientación general, no consejo médico.'
    }
  };

  /* ---------- Team Room ---------- */
  const AGENDA = [
    { min: 10, t: 'Early warning scholars', d: 'Scholars on the cusp of moving to the next tier: reasons, an intervention, and who will do it.' },
    { min: 25, t: 'Tier 2 intervention strategy', d: 'Common causes and patterns across groups; systemic fixes (e.g., walking school bus); progress on current interventions.' },
    { min: 15, t: 'Tier 1 prevention strategy', d: 'Status and impact of universal strategies, the grade-level challenge, and the year-long calendar.' },
    { min: 5, t: 'Assignments & next steps', d: 'Who does what by when. Check Day 10/20/30 reviews that are due.' },
    { min: 30, t: 'Individual scholar review (if time)', d: 'Tier 1 and 2 scholars: causes, new interventions, progress, community and agency support.', opt: true }
  ];
  const FRAMEWORK = [
    { t: 'Tier 1', n: 'Universal prevention', b: '0–9% · Satisfactory', own: 'All school staff', items: ['Attendance Team: meet regularly, review data, celebrate good and improving attendance in PBIS+', 'Teachers: daily attendance; positive outreach on consecutive absences', 'FSS: preventative outreach and communication', 'KSSN: host CSLT meetings, team support', 'Principal: oversee all tiers; positive conditions for learning', 'Secretary: contact families on unverified absences'], trig: 'Escalate when a scholar crosses 10%' },
    { t: 'Tier 2', n: 'Targeted intervention', b: '10–19% · At risk & moderate chronic', own: 'Building Attendance Team', items: ['Attendance Team: root-cause analysis, design interventions', 'Teachers: implement designed interventions', 'FSS: family communication incl. home visits, attendance improvement plan, warm handoffs', 'KSSN: referrals as needed', 'Support staff: barrier-specific support (e.g., nurse giving medication at school)'], trig: 'Escalate when a scholar crosses 20%' },
    { t: 'Tier 3', n: 'Intensive individualized support', b: '20%+ · Severe chronic', own: 'FSS + Attendance Team', items: ['Attendance Team: coordinate and document interventions, monitor data', 'Teachers: keep implementing designed interventions', 'FSS: home visits, sustained family engagement', 'KSSN: wraparound services and community resources', 'McKinney-Vento: if a housing barrier is identified', 'Family Support & Attendance Outreach Specialist review'], trig: 'Individualized plan · scholar support meetings · full documentation' }
  ];

  /* ---------- renderers ---------- */
  const read = () => store.get('pb_read', []);
  function markRead(n) { const r = read(); if (!r.includes(n)) { r.push(n); store.set('pb_read', r); } }

  function renderHome() {
    const r = read();
    $('#spine').innerHTML = CH.map((c) => `<a class="sp ${r.includes(c.n) ? 'done' : ''}" href="#ch/${c.n}"><span class="n">0${c.n}</span><b>${esc(c.title)}</b><small>${r.includes(c.n) ? '✓ Read' : esc(c.try)}</small></a>`).join('');
    const due = window.S5 && S5.dueCount ? S5.dueCount() : 0, active = window.S5 && S5.activeCount ? S5.activeCount() : 0;
    $('#doorPlans').textContent = active ? `${active} active plan${active === 1 ? '' : 's'}${due ? ' · ' + due + ' due' : ''}` : 'Start a plan with Day 10/20/30 reviews';
    counterUpdate();
  }
  let cDays = store.get('pb_cdays', 7), cEnr = store.get('pb_cenr', 180);
  function counterUpdate() {
    const host = $('#counter'); if (!host) return;
    const max = Math.max(Math.round(cEnr * 0.25), 12, cDays);
    const pct = cEnr > 0 ? Math.round((cDays / cEnr) * 1000) / 10 : 0;
    const lv = level(pct);
    const z = (a, b, cls) => `<i class="${cls}" style="width:${Math.max(0, (Math.min(b, max) - Math.min(a, max)) / max * 100)}%"></i>`;
    const e5 = cEnr * 0.05, e10 = cEnr * 0.10, e20 = cEnr * 0.20;
    $('#cNum').textContent = cDays; $('#cUnit').textContent = cDays === 1 ? 'day missed' : 'days missed';
    $('#cRange').max = max; $('#cRange').value = cDays;
    $('#cTrack').innerHTML = z(0, e5, 'z1') + z(e5, e10, 'z2') + z(e10, e20, 'z3') + z(e20, max, 'z4') + `<span class="goalpin" style="left:${5 / max * 100}%"></span><span class="mark" style="left:${Math.min(cDays, max) / max * 100}%"></span>`;
    $('#cLab').innerHTML = `<span>0</span><span style="color:var(--blue);font-weight:700">┆ goal: fewer than 5</span><span>${Math.round(e10)} = 10%</span><span>${max}</span>`;
    let msg;
    if (cDays < 5) msg = 'On track for <b>Strive for Less Than 5</b>. Keep recognizing good and improved attendance.';
    else if (lv.key === 'sat') msg = 'Past the 5-day goal but still satisfactory. A positive check-in now keeps it that way.';
    else if (lv.key === 'risk') msg = '<b>Early, personalized outreach now</b> keeps this scholar from becoming chronically absent. Find out what\'s getting in the way.';
    else if (lv.key === 'mod') msg = '<b>The Building Attendance Team</b> owns a root-cause analysis and a matched plan, with Day 10/20/30 reviews.';
    else msg = '<b>FSS + Attendance Team</b>: home visits, an individualized plan, and frequent review.';
    const pace = cEnr < 180 && cEnr > 0 ? `<p class="small muted">At this pace: about <b>${Math.round(cDays / cEnr * 180)} days</b> by the end of the school year.</p>` : '';
    $('#cRes').innerHTML = `<div class="lvl" style="color:var(--${lv.cls})">${pct}% · ${lv.name} · ${lv.tier}</div><p>${msg}</p>${pace}${lv.key === 'mod' || lv.key === 'sev' || lv.key === 'risk' ? `<p style="margin-top:8px"><a href="#support" data-cstart="${pct}">Support this scholar →</a></p>` : ''}`;
    store.set('pb_cdays', cDays); store.set('pb_cenr', cEnr);
  }

  function renderChapter(n) {
    n = Math.min(Math.max(Number(n) || 1, 1), CH.length);
    const c = CH[n - 1]; markRead(n);
    $('#chNav').innerHTML = CH.map((x) => `<a href="#ch/${x.n}" ${x.n === n ? 'aria-current="page"' : ''}><b>0${x.n}</b>${esc(x.title)}</a>`).join('');
    $('#chBand').innerHTML = `<div class="stripes"></div><div class="wrap"><p class="eyebrow">Chapter ${n} · Playbook pp. ${c.pages}</p><h1>${esc(c.title)}</h1><p class="lead"><a href="${pg(c.secs[0].p)}" target="_blank" rel="noopener" style="color:#fff">Open these pages in the original Playbook ↗</a></p></div>`;
    $('#chToc').innerHTML = c.secs.map((s) => `<a href="#ch/${n}/${s.id}">${esc(s.t)} <span class="pg">p.${s.p}</span></a>`).join('');
    $('#chBody').innerHTML = c.secs.map((s) => `<section class="sec" id="sec-${s.id}"><a class="pgref" href="${pg(s.p)}" target="_blank" rel="noopener">p. ${s.p} ↗</a><h2>${esc(s.t)}</h2>${s.html}${s.w ? `<div class="try" data-w="${s.w}"></div>` : ''}${links(s.links)}</section>`).join('') +
      `<div class="ch-foot">${n > 1 ? `<a href="#ch/${n - 1}"><small>← Previous</small>${esc(CH[n - 2].title)}</a>` : '<span></span>'}${n < CH.length ? `<a href="#ch/${n + 1}" style="text-align:right"><small>Next chapter →</small>${esc(CH[n].title)}</a>` : '<a href="#home" style="text-align:right"><small>Finished</small>Back to home</a>'}</div>`;
    $$('#chBody .try').forEach((el) => WIDGETS[el.dataset.w] && WIDGETS[el.dataset.w](el));
  }

  /* ---------- widgets ---------- */
  const WIDGETS = {
    days(el) {
      el.innerHTML = `<p class="eyebrow">Try it</p><h3>Where does a scholar fall?</h3><p class="muted small">Enter days missed (based on a 180-day school year).</p><div class="row" style="margin:6px 0 12px"><input class="input" type="number" min="0" max="180" value="12" style="max-width:120px" aria-label="Days missed" data-days><span class="score" data-out></span></div>
        <div class="tbl"><table class="big-table"><thead><tr><th>Category</th><th>% of days</th><th>Days (180)</th><th>GRPS tier</th></tr></thead><tbody>
        <tr data-l="sat"><td>Satisfactory</td><td>Less than 5%</td><td>Fewer than 9</td><td>Tier 1</td></tr><tr data-l="risk"><td>At risk</td><td>5%–9.9%</td><td>9 to 17</td><td>Tier 1</td></tr><tr data-l="mod"><td>Moderate chronic</td><td>10%–19.9%</td><td>18 to 35</td><td>Tier 2</td></tr><tr data-l="sev"><td>Severe chronic</td><td>20% or more</td><td>36 or more</td><td>Tier 3</td></tr></tbody></table></div>
        <p class="hint">The GRPS Attendance Support & Escalation Framework (April 2026) sets tiers at 0–9%, 10–19% and 20%+.</p>`;
      const inp = $('[data-days]', el);
      const upd = () => { const d = Math.max(0, Number(inp.value) || 0), p = Math.round(d / 180 * 1000) / 10, lv = level(p); $('[data-out]', el).textContent = `${p}% · ${lv.name}${d < 5 ? ' · meets the goal' : ''}`; $$('tr[data-l]', el).forEach((tr) => tr.classList.toggle('hit', tr.dataset.l === lv.key)); };
      inp.addEventListener('input', upd); upd();
    },
    metrics(el) {
      el.innerHTML = `<p class="eyebrow">Try it</p><div class="quiz-q"><p>Your school's average daily attendance is 93%. Does that mean chronic absence is low?</p><div class="row"><button class="btn secondary small" data-a="y">Yes</button><button class="btn secondary small" data-a="n">Not necessarily</button></div><div class="fb" aria-live="polite"></div></div>`;
      $$('[data-a]', el).forEach((b) => b.onclick = () => { const ok = b.dataset.a === 'n'; const fb = $('.fb', el); fb.className = 'fb ' + (ok ? 'ok' : 'no'); fb.innerHTML = (ok ? '<b>Right.</b> ' : '<b>Not quite.</b> ') + 'An average hides individuals. A school with high ADA can still have many scholars missing 10% or more, often the same scholars again and again. Look at chronic absence scholar by scholar.'; });
    },
    abcd(el) {
      el.innerHTML = `<p class="eyebrow">Try it</p><div class="abcd">${Object.entries(ROOTS).map(([k, v], i) => `<button type="button" data-r="${k}" aria-pressed="${i === 0}"><b>${k}</b><span>${esc(v.tag)}</span></button>`).join('')}</div><div class="abcd-more" aria-live="polite"></div>`;
      const show = (k) => { $$('[data-r]', el).forEach((b) => b.setAttribute('aria-pressed', b.dataset.r === k)); $('.abcd-more', el).innerHTML = `<b>${k}:</b> ${ROOTS[k].ex.map(esc).join(' · ')}<p class="small" style="margin:8px 0 0"><a href="#ch/6/roots">Practice sorting them →</a></p>`; };
      $$('[data-r]', el).forEach((b) => b.onclick = () => show(b.dataset.r)); show('Barriers');
    },
    five(el) {
      el.innerHTML = `<p class="eyebrow">Try it</p><div class="five">${FIVE.map((f, i) => `<button type="button" data-f="${i}" aria-pressed="${i === 0}"><b>${i + 1}</b><span>${esc(f[0])}</span></button>`).join('')}</div><div class="five-body" aria-live="polite"></div>`;
      const show = (i) => { $$('[data-f]', el).forEach((b) => b.setAttribute('aria-pressed', b.dataset.f == i)); $('.five-body', el).innerHTML = `<h3>${i + 1}. ${esc(FIVE[i][0])}</h3><p style="margin:0">${esc(FIVE[i][1])}</p>`; };
      $$('[data-f]', el).forEach((b) => b.onclick = () => show(b.dataset.f)); show(0);
    },
    mtss(el) {
      el.innerHTML = `<p class="eyebrow">Try it</p><h3>The GRPS MTSS framework</h3><p class="muted small">Pick a tier to see supports in academics, attendance, mental health and PBIS with SEL (Playbook p. 18).</p><div class="mtss"><div class="tiers">${[3, 2, 1].map((t) => `<button type="button" data-t="${t}" aria-pressed="${t === 2}">${MTSS[t].name}<small>${MTSS[t].sub}</small></button>`).join('')}</div><div class="body" aria-live="polite"></div></div>`;
      const show = (t) => { $$('[data-t]', el).forEach((b) => b.setAttribute('aria-pressed', b.dataset.t == t)); $('.body', el).innerHTML = `<div class="grid">${Object.entries(MTSS[t].cols).map(([k, v]) => `<div><h4>${k}</h4><ul>${v.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>`; };
      $$('[data-t]', el).forEach((b) => b.onclick = () => show(b.dataset.t)); show(2);
    },
    stayhome(el) { el.innerHTML = `<p class="eyebrow">Try it</p>${stayHomeHtml('en', 'ch')}`; wireStayHome(el, 'en'); },
    ideas(el) {
      el.innerHTML = `<p class="eyebrow">Try it</p><h3>Plan a family engagement event</h3><p class="muted small">Get an idea from the Playbook's list, then shuffle for another.</p><div class="answer"><div><p class="eyebrow">This month, try</p><p class="code" data-e></p></div><div><p class="eyebrow">And invite families to</p><p data-c style="font-size:18px"></p></div></div><div class="row" style="margin-top:10px"><button class="btn orange small" type="button" data-sh>Shuffle</button><a class="btn secondary small" href="https://parents.grps.org/" target="_blank" rel="noopener">Parent University ↗</a></div>`;
      let i = 0; const sh = () => { i++; $('[data-e]', el).textContent = IDEAS.events[(i * 7) % IDEAS.events.length]; $('[data-c]', el).textContent = IDEAS.community[(i * 3) % IDEAS.community.length]; };
      $('[data-sh]', el).onclick = sh; sh();
    },
    synergy(el) {
      el.innerHTML = `<p class="eyebrow">Try it</p><h3>Which Synergy report do I run?</h3><p class="muted small">Pick what you need to know.</p><div class="picker">${SYNERGY.map((s, i) => `<button type="button" data-s="${i}" aria-pressed="${i === 0}">${esc(s[0])}</button>`).join('')}</div><div class="answer" aria-live="polite"></div>`;
      const show = (i) => { const s = SYNERGY[i]; $$('[data-s]', el).forEach((b) => b.setAttribute('aria-pressed', b.dataset.s == i)); $('.answer', el).innerHTML = `<div><p class="eyebrow">Run</p><p class="code">${esc(s[1])}</p><p style="margin-top:4px">${esc(s[2])}</p></div><div><p class="eyebrow">What you get</p><p>${esc(s[3])}</p>${i === 0 ? '<p style="margin-top:8px"><a href="#team">Load it in the Team Room →</a></p>' : ''}</div>`; };
      $$('[data-s]', el).forEach((b) => b.onclick = () => show(b.dataset.s)); show(0);
    },
    sorter(el) {
      let pool = [], placed = {}, sel = null;
      const newRound = () => { pool = SORT_ITEMS.slice().sort(() => Math.random() - 0.5).slice(0, 10); placed = { Barriers: [], Aversion: [], Disengagement: [], Misconceptions: [] }; sel = null; draw(); };
      const draw = () => {
        const done = Object.values(placed).flat(), right = done.filter((x) => x.ok).length, left = pool.filter((p) => !done.some((d) => d.t === p[0]));
        el.innerHTML = `<p class="eyebrow">Try it</p><div class="spread"><h3>Sort the reasons</h3><span class="score">${done.length}/${pool.length} sorted · ${right} right</span></div>
          <div class="deck">${left.map((p) => `<button type="button" class="chipx" draggable="true" data-c="${esc(p[0])}" aria-pressed="${sel === p[0]}">${esc(p[0])}</button>`).join('') || '<b style="color:var(--t1)">All sorted!</b>'}</div>
          <div class="bins">${Object.keys(ROOTS).map((k) => `<button type="button" class="bin ${sel ? 'ready' : ''}" data-b="${k}"><h4>${k}</h4><p>${esc(ROOTS[k].tag)}</p>${placed[k].map((x) => `<div class="it ${x.ok ? '' : 'no'}">${esc(x.t)}${x.ok ? '' : ` <small>→ ${x.right}</small>`}</div>`).join('')}</button>`).join('')}</div>
          <div class="row" style="margin-top:10px"><button class="btn secondary small" type="button" data-new>New round</button><a class="btn ghost small" href="#ch/6/align">See matching interventions →</a></div>`;
        $$('.chipx', el).forEach((c) => { c.onclick = () => { sel = sel === c.dataset.c ? null : c.dataset.c; draw(); }; c.ondragstart = (e) => { e.dataTransfer.setData('text/plain', c.dataset.c); }; });
        $$('.bin', el).forEach((b) => { b.onclick = () => { if (sel) put(sel, b.dataset.b); }; b.ondragover = (e) => { e.preventDefault(); b.classList.add('drop'); }; b.ondragleave = () => b.classList.remove('drop'); b.ondrop = (e) => { e.preventDefault(); put(e.dataTransfer.getData('text/plain'), b.dataset.b); }; });
        $('[data-new]', el).onclick = newRound;
      };
      const put = (t, bin) => { const item = pool.find((p) => p[0] === t); if (!item) return; placed[bin].push({ t, ok: item[1] === bin, right: item[1] }); sel = null; draw(); };
      newRound();
    },
    align(el) {
      el.innerHTML = `<p class="eyebrow">Try it</p><div class="picker">${Object.keys(ALIGN).map((k, i) => `<button type="button" data-k="${esc(k)}" aria-pressed="${i === 0}">${esc(k)}</button>`).join('')}</div><div class="answer" aria-live="polite"></div>`;
      const show = (k) => { $$('[data-k]', el).forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === k)); $('.answer', el).innerHTML = `<div><p class="eyebrow">Possible interventions</p><ul>${ALIGN[k].i.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div><div><p class="eyebrow">Potential partners</p><ul>${ALIGN[k].p.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><p style="margin-top:12px"><a href="#support">Build a plan for a scholar →</a></p></div>`; };
      $$('[data-k]', el).forEach((b) => b.onclick = () => show(b.dataset.k)); show('Anxiety');
    },
    actquiz(el) {
      el.innerHTML = `<p class="eyebrow">Try it</p>${ACTQ.map((q, i) => `<div class="quiz-q" data-q="${i}"><p>${esc(q[0])}</p><div class="row"><button class="btn secondary small" type="button" data-a="a">Action</button><button class="btn secondary small" type="button" data-a="i">Intervention</button></div><div class="fb" aria-live="polite"></div></div>`).join('')}<p class="score" data-sc></p>`;
      const got = {};
      $$('.quiz-q', el).forEach((qq) => $$('[data-a]', qq).forEach((b) => b.onclick = () => { const q = ACTQ[qq.dataset.q], ok = b.dataset.a === q[1]; got[qq.dataset.q] = ok; const fb = $('.fb', qq); fb.className = 'fb ' + (ok ? 'ok' : 'no'); fb.innerHTML = `<b>${q[1] === 'a' ? 'Action.' : 'Intervention.'}</b> ${esc(q[2])}`; const n = Object.keys(got).length; $('[data-sc]', el).textContent = n === ACTQ.length ? `${Object.values(got).filter(Boolean).length} of ${ACTQ.length} right` : ''; }));
    },
    steps(el) {
      el.innerHTML = `<div class="steps4">
        <div><b>Identify who should be on the team</b><ul><li>Typically: FSS, KSSN coordinator, social worker, principal, secretary</li><li>Principal: oversee, set priorities, accountability</li><li>FSS: coordinate with and directly support families</li><li>Secretary: monitor daily data, flag scholars of concern</li></ul></div>
        <div><b>Use data to find what's common</b><ul><li>Look by grade, demographics and other subgroups</li><li>Times of year with high absence</li><li>Common barriers (transportation, health, family)</li><li>Scholars most affected</li></ul></div>
        <div><b>Identify strategies</b><ul><li>Brainstorm targeted and schoolwide interventions</li><li>Better communication with families</li><li>Incentives for good attendance</li><li>Mental health or social service referrals</li><li>School climate initiatives</li></ul></div>
        <div><b>Evaluate results</b><ul><li>Set measurable goals</li><li>Review attendance data regularly</li><li>Adjust what isn't working</li><li>Share results with the whole school</li></ul></div></div>
        <div class="callout" style="margin-top:18px"><b>Tips for teams:</b> make room for everyone's insights · encourage clarifying questions · reflect on assets, not just problems · keep staff informed · set a regular meeting schedule for the year. <a href="#team">Open the Team Room →</a></div>`;
    },
    alllinks(el) {
      el.innerHTML = `<input class="input" type="search" placeholder="Filter: e.g., letter, health, SEL, Synergy" aria-label="Filter resources" data-f><p class="hint" data-n></p><div class="links-list" data-l></div>`;
      const f = $('[data-f]', el);
      const draw = () => { const q = f.value.trim().toLowerCase(); const hits = ALL_LINKS.filter((l) => !q || (l.label + ' ' + l.sec + ' ' + l.chTitle).toLowerCase().includes(q)); $('[data-n]', el).textContent = `${hits.length} of ${ALL_LINKS.length} resources`; $('[data-l]', el).innerHTML = hits.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener"><b>${esc(l.label)}</b><small>Ch. ${l.ch} · ${esc(l.sec)} · p. ${l.page}</small><span>Open ↗</span></a>`).join(''); };
      f.addEventListener('input', draw); draw();
    }
  };

  /* ---------- stay home (shared) ---------- */
  function stayHomeHtml(lang, ctx) {
    const t = T[lang];
    return `<h3>${esc(t.q)}</h3><div class="sym">${SYMPTOMS.map((s) => `<label><input type="checkbox" value="${s.k}" data-sym>${esc(s[lang])}</label>`).join('')}</div><div class="verdict" data-v aria-live="polite"><b>—</b><p>${esc(t.none)}</p></div>`;
  }
  function wireStayHome(el, lang) {
    const upd = () => {
      const on = $$('[data-sym]:checked', el).map((x) => SYMPTOMS.find((s) => s.k === x.value)); const t = T[lang]; const v = $('[data-v]', el);
      if (!on.length) { v.className = 'verdict'; v.innerHTML = `<b>—</b><p>${esc(t.none)}</p>`; return; }
      if (on.some((s) => s.stay)) { v.className = 'verdict stay'; v.innerHTML = `<b>${esc(t.stayT)}</b><p>${esc(t.stayP)}</p>`; return; }
      if (on.some((s) => s.worry)) { v.className = 'verdict'; v.innerHTML = `<b>${esc(t.worryT)}</b><p>${esc(t.worryP)}</p>`; return; }
      v.className = 'verdict'; v.innerHTML = `<b>${esc(t.goT)}</b><p>${esc(t.goP)}</p>`;
    };
    $$('[data-sym]', el).forEach((c) => c.addEventListener('change', upd));
  }
  let famLang = store.get('pb_lang', 'en');
  function renderFamilies() {
    const t = T[famLang];
    document.documentElement.lang = famLang;
    $('#famBox').innerHTML = `<div class="fam"><div class="l"><div class="stripes"></div><p class="eyebrow">${esc(t.eyebrow)}</p><h1>${esc(t.h1)}</h1><p>${esc(t.lead)}</p></div><div class="r"><div class="spread" style="margin-bottom:12px"><span></span><div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="${famLang === 'en'}">English</button><button type="button" data-lang="es" aria-pressed="${famLang === 'es'}">Español</button></div></div>${stayHomeHtml(famLang)}</div></div>
      <div class="wrap"><div class="fam-more"><div><h3>${esc(t.mathH)}</h3><div class="math"><b>2</b>${esc(t.a)}</div><div class="math"><b>18</b>${esc(t.b.replace('≈ 18 ', ''))}</div><p>${esc(t.mathP)}</p></div>
      <div><h3>${esc(t.tipsH)}</h3><p>${esc(t.tipsP)}</p><div class="readmore"><a href="https://drive.google.com/file/d/1YjBbAqap5u7RN-4EayWhiVp9rwKQczzn/view" target="_blank" rel="noopener">${esc(t.k5)}</a><a href="https://drive.google.com/file/d/12YPW9UZ1AJrDj-0idnBp1cgqZRyikPTh/view" target="_blank" rel="noopener">${esc(t.g612)}</a></div></div>
      <div><h3>${esc(t.helpH)}</h3><p>${esc(t.helpP)}</p><div class="readmore"><a href="https://findhelp.org/" target="_blank" rel="noopener">Findhelp</a><a href="https://www.hwmuw.org/211" target="_blank" rel="noopener">2-1-1</a><a href="https://parents.grps.org/" target="_blank" rel="noopener">${esc(t.pu)}</a></div></div></div>
      <p class="hint" style="padding-bottom:30px">${esc(t.src)}</p></div>`;
    wireStayHome($('#famBox'), famLang);
    $$('[data-lang]', $('#famBox')).forEach((b) => b.onclick = () => { famLang = b.dataset.lang; store.set('pb_lang', famLang); renderFamilies(); });
  }

  /* ---------- Team Room ---------- */
  let ag = { i: 0, left: AGENDA[0].min * 60, run: false, done: [] }, agTimer = null;
  function renderAgenda() {
    const m = Math.floor(ag.left / 60), s = ag.left % 60;
    $('#agTime').innerHTML = `${m}:${String(s).padStart(2, '0')}<small> left · ${esc(AGENDA[ag.i].t)}</small>`;
    $('#agList').innerHTML = AGENDA.map((a, i) => `<button type="button" data-ag="${i}" class="${i === ag.i ? 'on' : ''} ${ag.done.includes(i) ? 'dn' : ''}"><b>${a.min} MIN</b><span>${esc(a.t)}${a.opt ? ' <small style="display:inline">(optional)</small>' : ''}<small>${esc(a.d)}</small></span></button>`).join('');
    $('#agGo').textContent = ag.run ? 'Pause' : (ag.left < AGENDA[ag.i].min * 60 ? 'Resume' : 'Start');
  }
  function agTick() { if (!ag.run) return; ag.left = Math.max(0, ag.left - 1); if (ag.left === 0) { ag.run = false; clearInterval(agTimer); if (window.S5) S5.toast('Time for the next agenda item'); } renderAgenda(); }
  function agGoto(i) { if (!ag.done.includes(ag.i) && i > ag.i) ag.done.push(ag.i); ag.i = i; ag.left = AGENDA[i].min * 60; renderAgenda(); }
  function renderTeam() {
    renderAgenda();
    $('#escBox').innerHTML = FRAMEWORK.map((f) => `<div><span class="band2">${esc(f.b)}</span><h3>${esc(f.t)} · ${esc(f.n)}</h3><div class="own">Owner: ${esc(f.own)}</div><ul>${f.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><div class="trig">${esc(f.trig)}</div></div>`).join('');
    const due = window.S5 && S5.dueList ? S5.dueList() : [];
    $('#teamDue').innerHTML = due.length ? due.map((u) => `<div><span><a href="#case/${u.c.id}" style="color:#fff">${esc(u.c.localId || 'Case')}</a> · ${esc(u.c.need)}</span><em>Day ${u.r.day} · ${esc(u.when)}</em></div>`).join('') : '<p class="hint">No Day 10/20/30 reviews due this week.</p>';
  }
  function challenge(sch) {
    const host = $('#chal'); if (!host) return;
    if (!sch || !sch.length) { host.innerHTML = `<div class="room-empty">Load your school's attendance export below (or try sample data) to see this month's <b>Strive for 5 grade-level challenge</b> and scholars on the cusp.</div>`; return; }
    const hasDays = sch.some((s) => !Number.isNaN(s.daysAbs));
    const key = sch.some((s) => s.grade) ? 'grade' : sch.some((s) => s.school) ? 'school' : null;
    const groups = {}; sch.forEach((s) => { const k = key ? (s[key] || '—') : 'All'; (groups[k] = groups[k] || []).push(s); });
    const ok = (s) => hasDays ? s.daysAbs < 5 : s.pct < 5;
    const rows = Object.entries(groups).map(([k, g]) => ({ k, v: Math.round(g.filter(ok).length / g.length * 100), n: g.length })).sort((a, b) => b.v - a.v);
    const cusp = sch.filter((s) => (s.pct >= 8 && s.pct < 10) || (s.pct >= 18 && s.pct < 20)).sort((a, b) => b.pct - a.pct).slice(0, 8);
    host.innerHTML = `<p class="muted" style="color:#9dbbd4;margin:0 0 10px">Share of scholars ${hasDays ? 'with fewer than 5 days absent' : 'under 5% absent'}, by ${key || 'school'}.</p>${rows.map((r, i) => `<div class="lb-row ${i === 0 ? "top1" : ""}"><span class="gr">${esc(key === 'grade' && /^\d+$/.test(r.k) ? ordinal(r.k) : r.k)}</span><span class="bar"><i style="width:${r.v}%"></i></span><span class="v">${r.v}%</span></div>`).join('')}
      <div class="cusp"><p class="eyebrow">On the cusp · about to move up a tier</p>${cusp.length ? cusp.map((s) => `<div><span>${esc(s.label)}${s.grade ? ' · Grade ' + esc(s.grade) : ''}</span><span><em>${s.pct}%</em> <button class="btn secondary small" type="button" data-start="${esc(s.label)}" data-pct="${s.pct}" data-school="${esc(s.school)}">Start a plan</button></span></div>`).join('') : '<p class="hint">No scholars between 8–9.9% or 18–19.9%.</p>'}</div>`;
  }
  const ordinal = (n) => { n = Number(n); const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-cstep],[data-ag],#agGo,#agNext,#agReset,[data-cstart]');
    if (!t) return;
    if (t.dataset.cstep) { cDays = Math.max(0, cDays + Number(t.dataset.cstep)); counterUpdate(); }
    else if (t.dataset.cstart) { e.preventDefault(); if (window.S5) S5.startSupport({ pct: t.dataset.cstart }); }
    else if (t.dataset.ag !== undefined) { agGoto(Number(t.dataset.ag)); }
    else if (t.id === 'agGo') { ag.run = !ag.run; clearInterval(agTimer); if (ag.run) agTimer = setInterval(agTick, 1000); renderAgenda(); }
    else if (t.id === 'agNext') { if (ag.i < AGENDA.length - 1) agGoto(ag.i + 1); }
    else if (t.id === 'agReset') { ag = { i: 0, left: AGENDA[0].min * 60, run: false, done: [] }; clearInterval(agTimer); renderAgenda(); }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'cRange') { cDays = Number(e.target.value); counterUpdate(); }
    if (e.target.id === 'cEnr') { const v = Number(e.target.value); if (v > 0 && v <= 200) { cEnr = v; counterUpdate(); } }
  });

  window.PB = {
    level, chapters: CH, links: ALL_LINKS,
    render(view, arg) {
      if (view !== 'families') document.documentElement.lang = 'en';
      if (view === 'home') renderHome();
      if (view === 'ch') { renderChapter(arg && arg[0]); if (arg && arg[1]) { const s = document.getElementById('sec-' + arg[1]); if (s) setTimeout(() => s.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); } }
      if (view === 'families') renderFamilies();
      if (view === 'team') renderTeam();
    },
    challenge,
    searchLinks(q) { q = (q || '').trim().toLowerCase(); if (q.length < 3) return []; const words = q.split(/\s+/).filter((w) => w.length > 2); return ALL_LINKS.filter((l) => { const h = (l.label + ' ' + l.sec + ' ' + l.chTitle).toLowerCase(); return words.some((w) => h.includes(w)); }).slice(0, 8); },
    searchChapters(q) { q = (q || '').trim().toLowerCase(); if (q.length < 3) return []; const words = q.split(/\s+/).filter((w) => w.length > 3); const out = []; CH.forEach((c) => c.secs.forEach((s) => { const h = (s.t + ' ' + s.html.replace(/<[^>]+>/g, ' ')).toLowerCase(); const sc = words.filter((w) => h.includes(w)).length; if (sc) out.push({ c, s, sc }); })); return out.sort((a, b) => b.sc - a.sc).slice(0, 5); }
  };
})();

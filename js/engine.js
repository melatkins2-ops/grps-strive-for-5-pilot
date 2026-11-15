/* Strive for Less Than 5 — content and attendance engine.
   Lifted unchanged from the v16 pilot (roles, resources, needs, interventions,
   community links, scenarios, intent search, resource detail, plan download).
   Only the code that drove the old single-page layout was removed; app.js
   builds the new experience on top of these globals.
   The QA Regression Runner (attendance_qa_v2.html) exercises renderResources(). */
const rolePathways=[
 {role:'Principal / School Leader',desc:'Oversee all tiers, ensure the Attendance Team functions, remove implementation barriers, and monitor schoolwide conditions.',first:'Attendance Team Operating Guide'},
 {role:'Teacher',desc:'Take accurate daily attendance, conduct positive outreach, strengthen belonging, and implement designed interventions.',first:'Universal Attendance Practices'},
 {role:'Family Support Specialist',desc:'Lead family-facing barrier identification, caring conversations, home visits, resource navigation, and sustained engagement.',first:'Family Support Specialist Hub'},
 {role:'KSSN Coordinator',desc:'In partner schools, support CSLT/team coordination and connect complex needs to wraparound/community resources.',first:'KSSN & Community Coordination'},
 {role:'Secretary / Attendance Staff',desc:'Maintain accurate attendance records, contact families for unverified absences, and support reliable team workflow.',first:'Synergy Attendance Analytics'},
 {role:'Social Worker / Counselor',desc:'Support mental health, school avoidance, relationships, safety, and targeted connection/skill-building interventions.',first:'Mental Health & Attendance'},
 {role:'Attendance Team',desc:'Own Tier 2 root-cause analysis, intervention design, monitoring, and co-own Tier 3 with FSS.',first:'Attendance Team Operating Guide'},
 {role:'District/Department Staff',desc:'Use districtwide attendance guidance, data, professional learning, and system resources to support schools and aligned departments.',first:'Understanding Chronic Absence'},
 {role:'Other',desc:'Start with the core attendance framework, then navigate by what you need to accomplish rather than by job title.',first:'Understanding Chronic Absence'}
];
const resources=[
 {title:'Understanding Chronic Absence',topic:'Understanding Attendance',roles:['All Staff','Principal / School Leader','Attendance Team'],tags:['chronic absence','10%','attendance bands'],summary:'Know what chronic absence means and why ADA or truancy alone can hide the problem.',when:'Use during onboarding, attendance-team calibration, family messaging, or when staff need a common definition.',steps:['Define chronic absence as missing 10% or more of school days, including excused, unexcused, and suspension days.','Use individual scholar data rather than relying only on average daily attendance.','Distinguish chronic absence from truancy.'],evidence:'Staff use consistent definitions and attendance bands in planning and communication.',downloads:[]},
 {title:'Positive Conditions for Learning',topic:'Universal & Proactive',roles:['All Staff','Principal / School Leader','Teacher'],tags:['belonging','climate','relationships','engagement'],summary:'Strengthen the conditions that make scholars want and are able to attend.',when:'Use as the universal prevention lens before attendance becomes an individual intervention problem.',steps:['Examine physical/emotional health and safety.','Strengthen belonging, connection, and caring adult relationships.','Increase academic challenge, relevance, engagement, and responsive support.','Use scholar voice to identify conditions that need improvement.'],evidence:'Improved belonging/engagement indicators, positive climate evidence, attendance trends.',downloads:[]},
 {title:'Universal Attendance Practices',topic:'Universal & Proactive',roles:['All Staff','Teacher','Principal / School Leader'],tags:['recognition','early outreach','monitor data','families'],summary:'Five universal practices: recognize improvement, engage families, monitor data, personalize outreach, and respond to barriers.',when:'Use schoolwide at Tier 1.',steps:['Recognize good and improved attendance—not just perfect attendance.','Build welcoming relationships and communicate that scholars are missed.','Monitor attendance patterns regularly.','Provide early personalized outreach.','Develop programmatic responses to recurring barriers.'],evidence:'Universal practices visible across classrooms/building; early concerns receive prompt support.',downloads:[]},
 {title:'SEL, Restorative Practices & Attendance',topic:'Universal & Proactive',roles:['Teacher','Social Worker / Counselor','Principal / School Leader'],tags:['SEL','restorative','PBIS','school climate'],summary:'Use SEL, restorative practices, and PBIS+ to strengthen belonging, regulation, relationships, and re-entry.',when:'Use when attendance concerns connect to climate, relationships, behavior, isolation, or re-entry after absence/suspension.',steps:['Identify relationship or climate concern.','Select schoolwide or targeted SEL/restorative practice.','Coordinate with the attendance plan rather than creating a parallel plan.'],evidence:'Connection, climate, engagement, re-entry, and attendance indicators.',downloads:[]},
 {title:'Health & Attendance',topic:'Health & Wellness',roles:['All Staff','Family Support Specialist','Attendance Team'],tags:['health','nurse','illness','wellness'],summary:'Address health-related attendance barriers and clarify when a scholar should stay home.',when:'Use when illness, chronic disease, dental access, or health misconceptions affect attendance.',steps:['Engage school nurse/health supports.','Clarify health guidance with families.','Identify access barriers to care.','Coordinate return-to-school supports when needed.'],evidence:'Health barrier reduced, service connection completed, attendance improves.',downloads:[]},
 {title:'Mental Health & Attendance',topic:'Health & Wellness',roles:['Social Worker / Counselor','Attendance Team','Teacher'],tags:['mental health','anxiety','avoidance','counseling'],summary:'Connect attendance to emotional well-being, anxiety, coping, and school-based mental-health supports.',when:'Use when anxiety, worry, avoidance, emotional distress, or mental-health needs contribute to absence.',steps:['Gather scholar voice about triggers and avoidance.','Coordinate with counselor/social worker or mental-health support.','Pair clinical/support services with a practical attendance/re-entry plan.'],evidence:'Engagement with support, reduced avoidance/barrier severity, attendance trajectory.',downloads:[]},
 {title:'FACE & Family Partnership',topic:'Family & Community Engagement',roles:['Family Support Specialist','Principal / School Leader','All Staff'],tags:['FACE','family partnership','two-way communication'],summary:'Build family capacity, two-way communication, shared decision-making, and equitable access to resources.',when:'Use across all tiers; increase intensity when family-facing complexity grows.',steps:['Lead with strengths and two-way communication.','Invite family voice into root-cause analysis and planning.','Share decision-making and clarify roles.','Connect families with relevant district/community resources.'],evidence:'Family engagement, completed next steps, barrier reduction.',downloads:['tools/Caring_Conversation_Guide.md']},
 {title:'Synergy Attendance Analytics',topic:'Data & Analytics',roles:['Principal / School Leader','Attendance Team','Secretary / Attendance Staff','District/Department Staff'],tags:['Synergy','U-CHRON','ATD201','ATD401','ATP201','data'],summary:'Use official attendance data to identify scholars, patterns, subgroups, and trends.',when:'Use for universal scans, threshold crossing, individual attendance review, and progress monitoring.',steps:['Use U-CHRON 027 for chronic student detail by school.','Use U-CHRON 028 for cumulative chronic absenteeism status.','Use U-CHRON 031 for school/district tracking.','Use ATD/ATP reports for individual daily/period patterns.','Pair official data with scholar/family voice.'],evidence:'Accurate tier identification, clear patterns, documented baseline and response.',downloads:[]},
 {title:'Panorama Context for Attendance',topic:'Data & Analytics',roles:['Attendance Team','Social Worker / Counselor','Principal / School Leader'],tags:['Panorama','SEL data','belonging'],summary:'Use SEL/context data to help explain attendance patterns without replacing official attendance data.',when:'Use when belonging, self-efficacy, feelings, or engagement may explain the pattern.',steps:['Review relevant contextual indicators.','Compare with attendance pattern.','Use scholar voice to test hypotheses.','Select support based on the actual barrier/function.'],evidence:'Better root-cause hypothesis and intervention fit.',downloads:[]},
 {title:'Root Cause: Barrier',topic:'Root Cause & Intervention',roles:['Attendance Team','Family Support Specialist','KSSN Coordinator'],tags:['Barrier','transportation','housing','health','basic needs','caregiving'],summary:'Concrete conditions prevent a scholar from getting to or staying in school.',when:'Use when logistics, health, housing, basic needs, family responsibilities, or service access interfere with attendance.',steps:['Identify the concrete condition.','Determine whether it is episodic or persistent.','Match a barrier-removal intervention.','Assign family-facing/resource ownership.'],evidence:'Barrier is reduced or resolved and attendance improves.',downloads:['tools/Root_Cause_Interview_Guide.md']},
 {title:'Root Cause: Aversion',topic:'Root Cause & Intervention',roles:['Attendance Team','Social Worker / Counselor','Teacher'],tags:['Aversion','anxiety','safety','peer conflict','academic avoidance'],summary:'The scholar is avoiding an experience connected to school.',when:'Use when anxiety, academic struggle, peer conflict, safety, discipline, disability needs, or climate contribute to absence.',steps:['Identify what is being avoided and when.','Gather scholar/staff/family information.','Address safety, academics, relationships, or anxiety directly.','Build a re-entry/connection plan when needed.'],evidence:'Reduced avoidance, improved participation and attendance.',downloads:['tools/Root_Cause_Interview_Guide.md']},
 {title:'Root Cause: Disengagement',topic:'Root Cause & Intervention',roles:['Attendance Team','Teacher','Principal / School Leader'],tags:['Disengagement','relationships','boredom','credits','work'],summary:'Connection, relevance, challenge, or motivation is insufficient.',when:'Use when scholars report weak relationships, boredom, low relevance, credit failure, or work-school conflict.',steps:['Identify the disengagement function.','Strengthen meaningful adult connection.','Adjust academic/re-engagement supports.','Use mentoring, enrichment, tutoring, or credit solutions as appropriate.'],evidence:'Engagement, credit/course progress, attendance trajectory.',downloads:['tools/Root_Cause_Interview_Guide.md']},
 {title:'Root Cause: Misconception',topic:'Root Cause & Intervention',roles:['Attendance Team','Family Support Specialist','Families & Caregivers'],tags:['Misconception','excused absence','2 days per month','illness'],summary:'The scholar or family underestimates the impact of absences or misunderstands expectations.',when:'Use when attendance barriers are primarily knowledge/belief based.',steps:['Share personalized cumulative attendance information.','Explain instructional loss in clear, nonjudgmental language.','Clarify illness and excused-absence misconceptions.','Follow with direct contact if the pattern does not improve.'],evidence:'Understanding improves and attendance pattern changes.',downloads:[]},
 {title:'Action vs. Intervention',topic:'Root Cause & Intervention',roles:['All Staff','Attendance Team'],tags:['action','intervention','phone call','letter','referral'],summary:'Separate outreach/documentation from the support intended to change the attendance pattern.',when:'Use during plan review whenever a call, letter, referral, or conference is listed as “the intervention.”',steps:['Name the action completed.','Ask why the scholar is missing school.','Name the intervention that directly addresses that reason.','Track whether the intervention was delivered and whether it worked.'],evidence:'Plans contain barrier-matched interventions, not only communication actions.',downloads:['tools/Action_vs_Intervention_Quick_Reference.md']},
 {title:'Attendance Team Operating Guide',topic:'Attendance Teams',roles:['Principal / School Leader','District/Department Staff','Attendance Team','Family Support Specialist'],tags:['team','agenda','roles','monitoring','10/20/30'],summary:'A decision-focused cycle for data, root cause, intervention fit, fidelity, ownership, and response.',when:'Use for every regular building Attendance Team meeting.',steps:['Recognize wins.','Scan attendance data and identify threshold crossings.','Review active plans at checkpoints.','Validate root cause and intervention fit.','Review fidelity.','Decide continue/change/intensify/step-down.','Assign owner and next review date.'],evidence:'Clear decisions, owners, review dates, and system-level actions.',downloads:['tools/Attendance_Team_Agenda.csv','tools/10_20_30_Day_Review_Template.csv']},
 {title:'Family Support Specialist Hub',topic:'Roles & Ownership',roles:['Family Support Specialist','Attendance Team','Principal / School Leader'],tags:['FSS','home visits','caring conversations','resource navigation'],summary:'FSS is the core family-facing attendance resource as complexity and intensity increase.',when:'Use for preventative outreach, Tier 2 family engagement, home visits, attendance planning, warm handoffs, and Tier 3 co-ownership.',steps:['Gather family voice and strengths.','Identify family-facing barriers.','Conduct caring conversation/home visit as appropriate.','Support attendance improvement plan.','Coordinate resource navigation and follow-through.','Co-own Tier 3 with Attendance Team.'],evidence:'Family engagement, completed supports, barrier reduction, attendance response.',downloads:['tools/Caring_Conversation_Guide.md','tools/Attendance_Plan_Template.csv']},
 {title:'KSSN & Community Coordination',topic:'Roles & Ownership',roles:['KSSN Coordinator','Family Support Specialist','Attendance Team'],tags:['KSSN','wraparound','community resources','partner schools'],summary:'In KSSN partner schools, connect complex multi-system barriers to coordinated community supports.',when:'Use only in KSSN partner schools; intensity increases for Tier 3 and complex cross-system needs.',steps:['Participate in team/CSLT coordination.','Connect appropriate community resources.','Provide wraparound coordination for complex barriers.','Align community supports with the attendance plan.'],evidence:'Successful connection, barrier stabilization, coordinated plan, attendance response.',downloads:[]},
 {title:'Caring Conversations / Early Outreach',topic:'Early Action & Discovery',roles:['Teacher','Family Support Specialist','Attendance Team','All Staff'],tags:['Caring Conversation','early outreach','relationship'],summary:'Relational outreach to understand what is getting in the way and identify immediate supports.',when:'Tier 1/Tier 2: emerging concern, unclear barrier, or disconnection.',steps:['Connect relationally.','Share the pattern factually.','Ask what is getting in the way.','Listen for strengths and barriers.','Agree on a next step and review date.'],evidence:'Contact completed, barrier identified, next 10 school days attendance.',downloads:['tools/Caring_Conversation_Guide.md']},
 {title:'Arrival Check-In',topic:'Intervention Menu',roles:['Teacher','Attendance Team','Social Worker / Counselor'],tags:['arrival','tardiness','check-in','morning'],summary:'Predictable adult greeting and brief problem-solving for late arrival or weak morning connection.',when:'Tier 1/Tier 2: tardiness, partial-day absence, or need for predictable connection.',steps:['Assign a consistent adult.','Greet by name and briefly check in.','Record arrival/on-time status.','Reinforce improvement and solve immediate barriers.'],evidence:'On-time arrival, tardies, check-in completion.',downloads:[]},
 {title:'Success Mentor / CICO',topic:'Intervention Menu',roles:['Attendance Team','Teacher','Social Worker / Counselor'],tags:['CICO','mentor','belonging','motivation','avoidance'],summary:'Targeted Tier 2 caring-adult connection with goals, daily check-ins, and feedback.',when:'Tier 2: belonging, engagement, motivation, weak adult connection, or avoidance. Not a primary response to transportation/housing/basic needs.',steps:['Assign trained caring adult.','Set attendance/engagement goal.','Use brief daily check-ins and weekly problem-solving.','Review attendance with scholar/family.'],evidence:'Check-in fidelity, attendance trajectory, goal attainment.',downloads:[]},
 {title:'Attendance Success Plan',topic:'Intervention Menu',roles:['Attendance Team','Family Support Specialist','Families & Caregivers'],tags:['Attendance Plan','contract','goal','10/20/30'],summary:'Collaborative plan with measurable goals, matched supports, responsible persons, and review dates.',when:'Tier 2/Tier 3 when explicit shared goals and coordinated ownership are needed.',steps:['Document root cause and baseline.','Select one primary intervention plus complementary supports.','Name owner, dosage, start date, and goal.','Review at 10/20/30 days.'],evidence:'Plan fidelity, barrier reduction, attendance goal progress.',downloads:['tools/Attendance_Plan_Template.csv','tools/10_20_30_Day_Review_Template.csv']},
 {title:'Home / Guardian Visit',topic:'Intervention Menu',roles:['Family Support Specialist','Attendance Team'],tags:['home visit','guardian visit','family engagement'],summary:'Supportive, voluntary family engagement for deeper relationship-building and barrier problem-solving.',when:'Tier 2/Tier 3: repeated unsuccessful outreach, complex family-facing barriers, or need for deeper problem-solving.',steps:['Schedule a voluntary visit/home or neutral location.','Lead with family strengths and aspirations.','Listen for barriers and resources.','Agree on supports and next steps.','Follow through and review response.'],evidence:'Successful engagement, completed action steps, attendance response.',downloads:['tools/Caring_Conversation_Guide.md']},
 {title:'Positive Recognition for Good & Improved Attendance',topic:'Intervention Menu',roles:['All Staff','Attendance Team','Teacher'],tags:['recognition','PBIS','improvement','celebration'],summary:'Reinforce progress and belonging without centering perfect attendance.',when:'Tier 1/Tier 2 as part of universal culture and targeted reinforcement.',steps:['Recognize good and improved attendance.','Use equitable, PBIS+-aligned recognition.','Avoid punishing scholars for barriers outside their control.'],evidence:'Improved attendance, participation, equity review of recognition.',downloads:[]},
 {title:'Transportation Problem-Solving',topic:'Intervention Menu',roles:['Family Support Specialist','Attendance Team','KSSN Coordinator'],tags:['transportation','route','backup plan','bus'],summary:'Create a route/schedule/backup plan and coordinate district/community options when transportation blocks attendance.',when:'Tier 2/Tier 3 transportation barrier.',steps:['Identify the exact transportation failure point.','Create primary and backup arrival plan.','Coordinate district options and family problem-solving.','Use community connection where appropriate/available.'],evidence:'Transportation barrier resolved/reduced; arrival and attendance improve.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'Academic / Class Avoidance Response',topic:'Intervention Menu',roles:['Teacher','Attendance Team','District/Department Staff'],tags:['academic','tutoring','class avoidance','instruction'],summary:'Address academic struggle or specific class avoidance with matched instructional and re-engagement supports.',when:'Tier 2/Tier 3 when absence clusters around academic difficulty, course failure, or avoidance.',steps:['Identify class/time/task pattern.','Assess academic skill/support needs.','Match tutoring, intervention, course problem-solving, or individualized academic plan.','Coordinate with attendance and family plan.'],evidence:'Class participation, course progress, academic support fidelity, attendance pattern.',downloads:[]},
 {title:'Safety / Peer Conflict Response',topic:'Intervention Menu',roles:['Principal / School Leader','Attendance Team','Social Worker / Counselor'],tags:['safety','peer conflict','bullying','re-entry'],summary:'Use a safety/problem-solving plan, adult check-in, restorative response, or multidisciplinary support.',when:'When fear, conflict, bullying, discipline, or safety concerns drive avoidance.',steps:['Clarify safety/peer concern.','Implement immediate safety response.','Assign caring adult/check-in.','Use restorative/re-entry supports where appropriate.','Monitor whether avoidance decreases.'],evidence:'Safety plan fidelity, scholar sense of safety, attendance response.',downloads:[]},
 {title:'Basic Needs / Housing Support',topic:'Intervention Menu',roles:['Family Support Specialist','Attendance Team','KSSN Coordinator'],tags:['housing','basic needs','McKinney-Vento','food'],summary:'Use warm handoffs, resource coordination, and McKinney-Vento process when housing instability is identified or suspected.',when:'Tier 2/Tier 3 basic-needs or housing barrier.',steps:['Screen for housing/basic-needs barrier.','Engage FSS resource navigation.','Follow McKinney-Vento identification/referral process when appropriate.','Coordinate KSSN/community supports in partner schools.'],evidence:'Referral/support completion, barrier stabilization, transportation/basic-needs resolution, attendance.',downloads:[]},
 {title:'10/20/30-Day Review',topic:'Monitoring & Review',roles:['Attendance Team','Family Support Specialist','District/Department Staff'],tags:['10/20/30','fidelity','response','checkpoint'],summary:'Operational checkpoints for active Tier 2/3 plans.',when:'Use for every active individual Tier 2/3 plan.',steps:['Day 0: document baseline, root cause, voice, owner, dosage, goal.','Day 10: review attendance since start, fidelity, family contact.','Day 20: review cumulative/recent attendance, barrier reduction, engagement.','Day 30: determine whether the intervention changed the pattern.'],evidence:'Continue, adjust, intensify, step down, or escalate based on response and fidelity.',downloads:['tools/10_20_30_Day_Review_Template.csv']},
 {title:'Functional Assessment Pathway',topic:'Monitoring & Review',roles:['Attendance Team','Family Support Specialist','Social Worker / Counselor'],tags:['functional assessment','FBAAT','antecedent','function','complex cases'],summary:'Use selectively when the reason remains unclear or matched supports have not worked.',when:'Complex Tier 2 or Tier 3 cases with unclear function, persistent severity, or nonresponse.',steps:['Review existing data.','Gather scholar voice.','Gather family voice.','Gather teacher/staff information.','Observe/track patterns if needed.','Build/revise a function-based plan.'],evidence:'Clearer hypothesis, coherent primary intervention, improved fit and response.',downloads:['tools/Root_Cause_Interview_Guide.md']},
 {title:'Intervention Selection Guardrails',topic:'Monitoring & Review',roles:['Attendance Team','Principal / School Leader','Family Support Specialist'],tags:['guardrails','fit','fidelity','KSSN','FSS'],summary:'Prevent common implementation errors when selecting and reviewing attendance supports.',when:'Use during intervention design and case review.',steps:['Start with root cause, not intervention name.','Recognize improvement rather than only perfect attendance.','Increase FSS involvement with family-facing complexity.','Use KSSN only in partner schools.','Use functional assessment selectively.','Document one coherent plan.','Keep escalation tied to the GRPS framework.'],evidence:'Higher intervention fit, clearer ownership, reduced parallel/uncoordinated services.',downloads:[]}
];

const matcherNeeds={
 Barrier:['Transportation','Health / wellness','Basic needs / housing','Family routines / caregiving','Tardiness / partial-day'],
 Aversion:['Anxiety / worry','Academic / class avoidance','Safety / peer conflict','School climate / discipline'],
 Disengagement:['Weak adult connection','Low motivation / boredom','Credit / course failure','Work-school conflict'],
 Misconception:['Excused absences misunderstood','Two days per month underestimated','Illness guidance confusion','Attendance importance misunderstood']
};
const interventionMap={
 'Transportation':[{name:'Primary + Backup Transportation Plan',owner:'FSS + Attendance Team',evidence:'Documented primary/backup route; on-time arrival; attendance trajectory'},{name:'Warm Handoff to Transportation Resource',owner:'FSS or designated staff',evidence:'Connection completed; barrier reduced; arrival improves'},{name:'Individualized Arrival Support',owner:'Designated school staff + Attendance Team',evidence:'Arrival routine implemented; tardies/absences decline'}],
 'Health / wellness':[{name:'School Health Assessment + Attendance Plan',owner:'Nurse/health staff + Attendance Team',evidence:'Health needs clarified; appropriate stay-home decisions; attendance'},{name:'Warm Handoff to Health Provider',owner:'Nurse/health staff or FSS',evidence:'Service connection completed; barrier reduction; attendance'},{name:'Chronic Health Attendance Support Plan',owner:'School health/support team',evidence:'Supports implemented; missed instructional time reduced'}],
 'Basic needs / housing':[{name:'Basic Needs Stabilization Plan',owner:'FSS + Attendance Team',evidence:'Priority need addressed; barrier reduction; attendance'},{name:'Housing Stability / McKinney-Vento Coordination',owner:'FSS + appropriate district liaison',evidence:'Supports resolved as applicable; school access stabilized'},{name:'Warm Handoff + Follow-Through Plan',owner:'FSS or KSSN where applicable',evidence:'Service connection completed; unmet need reduced; attendance response'}],
 'Family routines / caregiving':[{name:'Morning/Evening Routine Plan',owner:'FSS + family + Attendance Team',evidence:'Routine steps implemented; on-time arrival; attendance'},{name:'Caregiving Contingency Plan',owner:'FSS + family',evidence:'Backup caregiving plan used when needed; missed days decline'},{name:'Family Attendance Success Plan',owner:'FSS + Attendance Team',evidence:'Agreed supports implemented; barrier reduction; attendance'}],
 'Tardiness / partial-day':[{name:'Individualized Arrival Plan',owner:'Designated adult + Attendance Team',evidence:'On-time arrival; tardies decline; plan fidelity'},{name:'Morning Check-In / Entry Routine',owner:'Designated caring adult',evidence:'Check-ins occur; arrival improves'},{name:'Schedule/Transition Problem-Solving',owner:'School leader/counselor + Attendance Team',evidence:'School-controlled obstacle reduced; time in school increases'}],
 'Anxiety / worry':[{name:'Predictable Re-entry + Check-In Plan',owner:'Counselor/Social Worker + Attendance Team',evidence:'Check-ins completed; avoidance reduces; attendance improves'},{name:'Behavioral Health Connection + School Support Plan',owner:'Behavioral health clinician/support staff + Attendance Team',evidence:'Connection completed; supports implemented; attendance response'},{name:'Gradual Attendance / Re-entry Plan',owner:'Attendance Team + appropriate support staff',evidence:'Attendance milestones met; time in school increases'}],
 'Academic / class avoidance':[{name:'Targeted Academic Support + Re-entry Plan',owner:'Teacher + Attendance Team + instructional/support staff as needed',evidence:'Support delivered; class attendance; course progress'},{name:'Missed-Learning Recovery Plan',owner:'Teacher/counselor',evidence:'Manageable recovery steps completed; avoidance declines'},{name:'Class Connection / Schedule Problem-Solving',owner:'School leader/counselor + Attendance Team',evidence:'Identified class condition addressed; period attendance improves'}],
 'Safety / peer conflict':[{name:'Individualized Safety Plan',owner:'Principal/support staff + Attendance Team',evidence:'Safety actions implemented; scholar reports improved safety; attendance'},{name:'Restorative/Conflict Resolution Support',owner:'Trained restorative/support staff',evidence:'Agreements implemented; conflict reduced; attendance'},{name:'Safe Arrival/Transition Plan',owner:'Designated school staff',evidence:'Transitions supported; avoidance decreases'}],
 'School climate / discipline':[{name:'Welcoming Re-entry Plan',owner:'Principal/support staff + Attendance Team',evidence:'Re-entry steps completed; belonging feedback; attendance'},{name:'Restorative Repair Plan',owner:'Trained restorative staff + school leader',evidence:'Repair actions completed; relationship/climate improves'},{name:'School-Controlled Barrier Correction',owner:'Principal + responsible staff',evidence:'Practice/condition changed; scholar access and attendance improve'}],
 'Weak adult connection':[{name:'Success Mentor / Caring Adult',owner:'Attendance Team assigns trained adult',evidence:'Scheduled contacts; belonging; attendance trajectory'},{name:'Check-In / Check-Out',owner:'Trained school staff',evidence:'Daily fidelity; connection/goal progress; attendance'},{name:'Relationship Mapping + Intentional Connection',owner:'School team',evidence:'Named adult connection established; scholar feedback; attendance'}],
 'Low motivation / boredom':[{name:'Success Mentor / Caring Adult Connection',owner:'Attendance Team assigns trained adult',evidence:'Scheduled contacts occur; belonging/engagement improves; attendance'},{name:'Interest-Based Expanded Learning Connection',owner:'School/Extended Learning partner',evidence:'Participation; scholar feedback; attendance response'},{name:'Scholar Goal + Relevance Plan',owner:'Teacher/Counselor + Attendance Team',evidence:'Goal progress; engagement indicators; attendance'}],
 'Credit / course failure':[{name:'Academic Re-engagement Plan',owner:'Counselor/teacher + Attendance Team',evidence:'Course progress; attendance'},{name:'Credit Recovery / Pathway Plan',owner:'Counselor + academic staff',evidence:'Credits attempted/earned; attendance'},{name:'Tutoring / Targeted Academic Support',owner:'Academic staff/provider + Attendance Team',evidence:'Dosage delivered; skill/course progress; attendance'}],
 'Work-school conflict':[{name:'Work-School Schedule Problem-Solving',owner:'Counselor + scholar/family',evidence:'Schedule agreement implemented; attendance'},{name:'Individualized Re-engagement Plan',owner:'Counselor + Attendance Team + FSS',evidence:'Plan implementation; time in school increases'},{name:'Goal/Pathway Alignment Plan',owner:'Counselor + scholar',evidence:'Scholar sees pathway relevance; course participation; attendance'}],
 'Excused absences misunderstood':[{name:'Attendance Understanding + Goal Plan',owner:'School staff + scholar/family',evidence:'Misconception corrected; agreed attendance goal; attendance trajectory'},{name:'Personalized Attendance Feedback + Follow-Through',owner:'Attendance Team/FSS as needed',evidence:'Family can explain cumulative impact; plan actions occur; attendance'}],
 'Two days per month underestimated':[{name:'Cumulative Absence Awareness + Goal Plan',owner:'Teacher/FSS/Attendance Team',evidence:'Scholar/family understanding; measurable goal progress'},{name:'Attendance Habit Plan',owner:'Scholar/family + designated staff',evidence:'Routine/goal implemented; monthly absence pattern changes'}],
 'Illness guidance confusion':[{name:'Individualized Health Attendance Plan',owner:'School nurse/health staff + family',evidence:'Appropriate stay-home decisions; health supports used; attendance'},{name:'Health Guidance + Return-to-School Plan',owner:'School health staff',evidence:'Family understanding; timely return; attendance'}],
 'Attendance importance misunderstood':[{name:'Attendance Goal + Progress Feedback Plan',owner:'Teacher/FSS/Attendance Team',evidence:'Goal reviewed regularly; attendance improves'},{name:'Family/Scholar Attendance Habit Plan',owner:'Scholar/family + designated staff',evidence:'Agreed routines implemented; attendance pattern changes'}]
};

const communityLinks={
 'Transportation':[{label:'Search Findhelp for transportation',url:'https://www.findhelp.org/'},{label:'Open Grand Rapids Area Resource Map',url:'https://www.google.com/maps/d/u/0/viewer?hl=en&mid=1_QxiKRVJOvXj9kWZwxhQnMkDpKtVS5M&ll=42.949338122271186%2C-85.62441883329723&z=15'}],
 'Health / wellness':[{label:'Cherry Health school-based services',url:'https://cherryhealth.org/services/school-based/'},{label:'Search Findhelp for health resources',url:'https://www.findhelp.org/'}],
 'Basic needs / housing':[{label:'Search Findhelp for housing/basic needs',url:'https://www.findhelp.org/'},{label:'Open Grand Rapids Area Resource Map',url:'https://www.google.com/maps/d/u/0/viewer?hl=en&mid=1_QxiKRVJOvXj9kWZwxhQnMkDpKtVS5M&ll=42.949338122271186%2C-85.62441883329723&z=15'}],
 'Family routines / caregiving':[{label:'Search Findhelp for family supports',url:'https://www.findhelp.org/'}],
 'Anxiety / worry':[{label:'Cherry Health behavioral health',url:'https://cherryhealth.org/services/behavioral-health/'},{label:'Search Findhelp for mental health supports',url:'https://www.findhelp.org/'}],
 'Low motivation / boredom':[{label:'Boys & Girls Clubs of Grand Rapids',url:'https://bgcgrandrapids.org/'},{label:'Grand Rapids Parks & Recreation',url:'https://www.grandrapidsmi.gov/departments/parks-recreation/recreation/'}]
};
function tierFromPct(p){if(Number.isNaN(p)) return null; if(p<10) return {tier:'Tier 1',band:'0–9% absent',owner:'All staff; Attendance Team monitors',monitor:'Regular team review'}; if(p<20) return {tier:'Tier 2',band:'10–19% absent',owner:'Building Attendance Team',monitor:'Monthly team monitoring + 10/20/30-day checkpoints for active plans'}; return {tier:'Tier 3',band:'20%+ absent',owner:'FSS + Attendance Team',monitor:'Frequent monitoring; active plans at least every 10 school days'}}


const scenarios={
 transport:{title:'Morning transportation breakdown',tier:'Tier 2 — 12% absent',root:'Barrier → Transportation',decision:'The attendance percentage signals Tier 2 intensity; transportation tells the team what must be solved.',steps:['Confirm the exact failure point: ride availability, timing, route, backup option, or morning routine.','FSS + Attendance Team develop a primary and backup transportation plan; make a warm handoff to any needed resource.','Document owner, start date, and goal. Use Day 10/20/30 checkpoints for the active plan.'],avoid:'Do not respond primarily with letters, attendance education, or mentoring if transportation remains unresolved.',matcher:{pct:12,root:'Barrier',need:'Transportation'}},
 academic:{title:'Specific-class avoidance',tier:'Tier 2 — 15% absent',root:'Aversion → Academic / class avoidance',decision:'The pattern is class-specific, so the team should investigate academic difficulty, instructional mismatch, or a relationship/climate issue before choosing support.',steps:['Review period attendance, course performance, task difficulty, and scholar voice.','Match academic intervention, tutoring/course problem-solving, and a re-entry/check-in support if indicated.','Coordinate the instructional support with the attendance plan and monitor both class participation and attendance.'],avoid:'Do not assume “motivation” is the problem before examining the specific class pattern and academic demands.',matcher:{pct:15,root:'Aversion',need:'Academic / class avoidance'}},
 nonresponse:{title:'Support is not changing attendance',tier:'Tier 2 — active plan at Day 20',root:'Root cause remains unclear',decision:'Before adding more services, determine whether the mentor was implemented with fidelity and whether connection was actually the right hypothesis.',steps:['Check mentor/CICO dosage, completion, relationship quality, and attendance since the plan began.','Gather scholar, family, and teacher voice and review the functional assessment pathway.','Revise to one coherent primary intervention that addresses the best-supported function/barrier; intensify if severity warrants.'],avoid:'Do not stack additional interventions onto a plan without understanding why the current support is not working.',matcher:null}
};
const scenarioPractice={
 transport:{prompt:'What should the team do first?',choices:['Send an attendance warning letter and review again next month.','Ask the family where the ride breaks down and develop a reliable primary and backup transportation plan.','Assign a mentor without addressing the transportation problem.'],correct:1,why:'The reported transportation barrier needs a practical access plan. A letter or mentor alone does not resolve it.',check:'At Day 10, what evidence would show the ride plan was actually used and arrival improved?'},
 academic:{prompt:'What is the strongest next step?',choices:['Assume low motivation and offer an attendance incentive.','Refer the scholar to FSS without examining the class pattern.','Ask the scholar about math, review class-specific attendance and academic data, then plan targeted academic and re-entry support.'],correct:2,why:'A class-specific pattern points to an inquiry about the class experience; do not assign a root cause without scholar voice.',check:'What would you monitor besides overall attendance to see whether the math-class barrier is reducing?'},
 nonresponse:{prompt:'The mentor has met with the scholar for 20 days, but attendance is unchanged. What should the team do?',choices:['Review whether mentoring happened as planned, revisit the root-cause hypothesis with the scholar and family, and adjust the intervention accordingly.','Add two more interventions immediately.','Continue unchanged for another month because the mentor attended meetings.'],correct:0,why:'Fidelity matters, but consistent delivery does not prove the intervention fits the actual attendance barrier.',check:'If fidelity is strong but the barrier has not changed, what specific decision should the team document?'}
};

scenarios["housing"]={"title":"Housing instability and routines","tier":"Tier 3 — 24% absent","root":"Barrier → Housing and family routines","decision":"FSS and Attendance Team co-own a practical housing/routine response; KSSN coordinates when available.","steps":["Ask the family which moves and routines are disrupting attendance and identify immediate supports.","Coordinate housing-stability and morning backup plans with an owner and warm handoff.","Review actual access, implementation and attendance at 10/20/30 school days."],"avoid":"Do not label the referral itself an intervention.","matcher":null};
scenarios["safety"]={"title":"Peer conflict and school avoidance","tier":"Tier 2 — 16% absent","root":"Aversion → Safety / peer conflict","decision":"Prioritize the scholar-reported safety concern and coordinate a safe return.","steps":["Clarify the reported safety concern and act promptly under school safety procedures.","Develop an individualized safety and re-entry plan with trusted-adult support.","Monitor perceived safety, plan implementation and attendance."],"avoid":"Do not assume the caregiver's illness explanation resolves the scholar's safety concern.","matcher":null};
scenarios["tardy"]={"title":"Late arrival pattern","tier":"Pattern identified — root cause unknown","root":"Investigate → Arrival pattern","decision":"Verify accurate records and connect the concern to a caring inquiry before choosing a plan.","steps":["Check attendance entry accuracy and describe the timing pattern.","Route a respectful inquiry to the appropriate staff member and gather scholar/family perspective.","If a barrier is confirmed, match a response and monitor on-time arrival."],"avoid":"Do not assign a transportation root cause from a tardiness pattern alone.","matcher":null};
scenarios["systems"]={"title":"Schoolwide Monday absence spike","tier":"Schoolwide pattern — tier varies by scholar","root":"System inquiry → Multiple possible root causes","decision":"The leader should align attendance team routines, identify system patterns, and remove school-controlled barriers.","steps":["Review school and subgroup patterns without assuming a single cause.","Clarify team ownership, consistent inquiry, and intervention tracking.","Address any confirmed school-level barriers and review results."],"avoid":"Do not launch the same intervention for every scholar because of one shared pattern.","matcher":null};
scenarios["kssn"]={"title":"Multiple basic-needs barriers","tier":"Tier 3 — 22% absent","root":"Barrier → Multiple access needs","decision":"FSS and Attendance Team co-own the attendance plan; KSSN coordinates relevant community supports.","steps":["Agree with the family on the most urgent attendance-disrupting barrier.","Create one coordinated plan with assigned responsibilities and verified warm handoffs.","Monitor whether barriers reduce and attendance improves at 10/20/30 days."],"avoid":"Do not count three referrals as three successful interventions.","matcher":null};
scenarios["day10"]={"title":"Day 10: Plan not delivered","tier":"Tier 2 — Day 10 review","root":"Barrier → Transportation; low fidelity","decision":"Repair implementation before concluding the intervention itself failed.","steps":["Confirm why the backup ride was not arranged and assign a specific owner.","Complete the transportation support and verify the plan can be used.","Review fidelity, arrival and attendance at the next checkpoint."],"avoid":"Do not replace a potentially appropriate intervention that was never delivered.","matcher":null};
scenarios["day20"]={"title":"Day 20: Barrier remains","tier":"Tier 2 — Day 20 review","root":"Aversion → Academic / class avoidance","decision":"Good fidelity plus an unchanged barrier calls for adjusting the intervention.","steps":["Confirm that check-ins occurred and review scholar voice and class data.","Add or replace the ineffective element with targeted academic support and re-entry planning.","Document the changed strategy and monitor class participation and attendance."],"avoid":"Do not equate completed check-ins with improved attendance.","matcher":null};
scenarios["day30"]={"title":"Day 30: Attendance improving","tier":"Tier 2 — Day 30 review","root":"Barrier → Transportation; improving","decision":"Continue what works and consider fading support only when improvement is sustained.","steps":["Confirm reliable arrivals and that the backup plan is still available.","Recognize improvement and agree on criteria for reducing support.","Keep monitoring for renewed barriers or attendance decline."],"avoid":"Do not end a useful plan solely because one checkpoint improved.","matcher":null};
scenarios["district"]={"title":"Recurring transportation barriers","tier":"Cross-school pattern — intensity varies","root":"System barrier → Transportation","decision":"District staff should investigate shared conditions and coordinate a sustainable system response.","steps":["Compare school-level patterns and confirm the recurring access failure.","Coordinate transportation, attendance leaders, and family perspectives to address the shared barrier.","Track system changes and attendance outcomes while schools maintain individual plans."],"avoid":"Do not substitute a district memo for a solution to the access problem.","matcher":null};

scenarioPractice["housing"]={"prompt":"What is the best next decision?","choices":["Send the family a generic resource list.","Wait for stable housing before setting an attendance plan.","Co-develop a workable morning and housing-support plan with FSS/Attendance Team."],"correct":2,"why":"The response must reduce the documented housing/routine barrier and verify that support was received.","check":"What evidence would show the family can carry out the morning plan?"};
scenarioPractice["safety"]={"prompt":"What is the best next decision?","choices":["Create a safety and re-entry response while assessing the reported threats.","Send only an illness guidance flyer.","Offer a perfect-attendance prize."],"correct":0,"why":"The scholar's report of bullying is a safety concern that comes first. The caregiver's illness explanation does not resolve it.","check":"How will the team know the scholar feels safe and the return plan is working?"};
scenarioPractice["tardy"]={"prompt":"What is the best next decision?","choices":["Assume the family is unmotivated.","Check the pattern and ask what happens before arrival.","Immediately escalate to a punitive response."],"correct":1,"why":"A pattern identifies where to investigate, not why it occurs.","check":"What question would you ask without making assumptions?"};
scenarioPractice["systems"]={"prompt":"What is the best next decision?","choices":["Require every scholar to receive the same letter.","Assign each case to whichever staff member is free.","Use the Attendance Team to investigate patterns and align ownership and review."],"correct":2,"why":"Schoolwide patterns require coordinated inquiry and system-level improvement, not a universal guessed root cause.","check":"Which data and staff/family perspectives should the team triangulate?"};
scenarioPractice["kssn"]={"prompt":"What is the best next decision?","choices":["Send three links and close the case.","Let each partner create a separate plan.","Coordinate one barrier-matched plan with FSS, Attendance Team, family, and KSSN."],"correct":2,"why":"Coordination should reduce actual barriers, not just increase referrals.","check":"How will you verify each connection resulted in usable support?"};
scenarioPractice["day10"]={"prompt":"What is the best next decision?","choices":["Fix the missed implementation step and confirm the ride works.","Declare transportation support ineffective.","Add a mentor instead of fixing the ride."],"correct":0,"why":"Low fidelity calls for fixing implementation first.","check":"What proof will the team collect that the backup ride is now in place?"};
scenarioPractice["day20"]={"prompt":"What is the best next decision?","choices":["Continue unchanged because the check-ins happened.","Adjust the response to address academic difficulty and monitor outcomes.","Stop all support immediately."],"correct":1,"why":"An intervention can be delivered well but still miss the root cause.","check":"Which measure would distinguish improved class access from mere check-in completion?"};
scenarioPractice["day30"]={"prompt":"What is the best next decision?","choices":["Stop monitoring immediately.","Intensify to Tier 3 despite sustained improvement.","Continue and consider a gradual fade with a monitoring plan."],"correct":2,"why":"Sustained improvement supports a planned continuation or fade, not abrupt withdrawal.","check":"What evidence and time frame would justify reducing support?"};
scenarioPractice["district"]={"prompt":"What is the best next decision?","choices":["Send every school the same reminder letter.","Build a coordinated response to the confirmed cross-school transportation barrier.","Ask schools to solve the recurring system issue independently."],"correct":1,"why":"A shared structural barrier warrants coordinated system-level action.","check":"How would you distinguish improved transportation access from improved attendance alone?"};
function renderScenario(key){
 const x=scenarios[key],p=scenarioPractice[key],target=document.getElementById('scenarioResult');if(!x||!p)return;
 target.innerHTML=`<div class="scenario-result scenario-workshop" tabindex="-1"><span class="tag">${x.tier}</span><h3>${x.title}</h3><p class="practice-direction">Work through the decision before viewing the suggested response.</p><fieldset class="scenario-question"><legend>1. ${p.prompt}</legend>${p.choices.map((choice,i)=>`<label class="scenario-option"><input type="radio" name="scenario-choice-${key}" value="${i}"><span>${choice}</span></label>`).join('')}</fieldset><button type="button" class="btn orange" id="checkScenario" disabled>Check my decision</button><div id="scenarioFeedback" aria-live="polite"></div><div id="scenarioFollowup" hidden><label class="scenario-reflect" for="scenarioReflection">2. ${p.check}</label><textarea id="scenarioReflection" rows="3" placeholder="Write what you would look for or do next."></textarea><button type="button" class="btn secondary" id="showScenarioGuidance">Compare with suggested guidance</button><div id="scenarioGuidance" hidden></div></div></div>`;
 target.querySelectorAll('input[type="radio"]').forEach(r=>r.addEventListener('change',()=>{document.getElementById('checkScenario').disabled=false}));
 document.getElementById('checkScenario').onclick=()=>{
 const selected=Number(target.querySelector('input[type="radio"]:checked')?.value),correct=selected===p.correct;
 document.getElementById('scenarioFeedback').innerHTML=`<div class="scenario-feedback"><strong>${correct?'Appropriate next step.':'Reconsider the response.'}</strong><p>${p.why}</p></div>`;
 document.getElementById('scenarioFollowup').hidden=false;
 document.getElementById('checkScenario').disabled=true;
 };
 document.getElementById('showScenarioGuidance').onclick=()=>{
 const m=x.matcher?`<button class="btn orange" data-loadscenario="${key}">Load this case into the intervention guide</button>`:'';
 document.getElementById('scenarioGuidance').hidden=false;
 document.getElementById('scenarioGuidance').innerHTML=`<div class="scenario-guidance"><h4>Suggested team response</h4><p><b>Root-cause hypothesis:</b> ${x.root}</p><p>${x.decision}</p><h4>Implementation and review</h4>${x.steps.map((v,i)=>`<div class="next-step"><div class="stepnum">${i+1}</div><div>${v}</div></div>`).join('')}<div class="callout orange"><b>Avoid:</b> ${x.avoid}</div>${m}</div>`;
 document.querySelectorAll('[data-loadscenario]').forEach(b=>b.onclick=()=>loadScenario(b.dataset.loadscenario));
 };
 target.scrollIntoView({behavior:'smooth',block:'start'});target.focus({preventScroll:true});
}
function loadScenario_legacy(key){const x=scenarios[key]; if(!x.matcher)return; document.getElementById('absencePct').value=x.matcher.pct; rootCause.value=x.matcher.root; rootCause.dispatchEvent(new Event('change')); need.value=x.matcher.need; document.getElementById('matcher').scrollIntoView();}
document.querySelectorAll('[data-scenario]').forEach(b=>b.onclick=()=>renderScenario(b.dataset.scenario));

/* [role cards moved to app.js] */
const topicSel=document.getElementById('topic'), roleSel=document.getElementById('role'), q=document.getElementById('q'), grid=document.getElementById('resourceGrid'), meta=document.getElementById('meta');
[...new Set(resources.map(r=>r.topic))].sort().forEach(x=>topicSel.add(new Option(x,x)));
[...new Set(resources.flatMap(r=>r.roles))].sort().forEach(x=>roleSel.add(new Option(x,x)));
if(![...roleSel.options].some(o=>o.value==='District/Department Staff')) roleSel.add(new Option('District/Department Staff','District/Department Staff'));
if(![...roleSel.options].some(o=>o.value==='Other')) roleSel.add(new Option('Other','Other'));


// Concrete matched-intervention cards surfaced by intent-based search.
const intentInterventionResources=[
 {title:'Predictable Re-entry + Check-In Plan',topic:'Intervention Menu',roles:['Social Worker / Counselor','Attendance Team'],tags:['anxiety','worry','re-entry','check-in'],summary:'Create a predictable return-to-school routine with a consistent adult check-in to reduce anxiety-driven avoidance.',when:'Aversion related to anxiety or worry.',steps:['Identify the feared or avoided part of the school day.','Agree on a predictable arrival/re-entry routine.','Assign a consistent adult for brief check-ins.','Monitor avoidance, time in school, and attendance response.'],evidence:'Check-ins completed; avoidance reduces; attendance improves.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'Behavioral Health Connection + School Support Plan',topic:'Intervention Menu',roles:['Social Worker / Counselor','Attendance Team','Family Support Specialist'],tags:['anxiety','behavioral health','mental health','school support'],summary:'Pair a behavioral-health connection with concrete school-based supports so the referral becomes part of an attendance intervention.',when:'Anxiety or behavioral-health needs are contributing to absence.',steps:['Clarify the attendance-related behavioral-health need.','Complete a warm handoff when appropriate.','Name the school-based support that will occur while connection is underway.','Monitor connection, support fidelity, and attendance.'],evidence:'Connection completed; school supports implemented; attendance response.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'Individualized Arrival Plan',topic:'Intervention Menu',roles:['Attendance Team','Family Support Specialist'],tags:['tardy','late','arrival','partial day'],summary:'Build a specific morning arrival plan that addresses the reason for repeated tardiness or partial-day absence.',when:'Repeated tardiness, late arrival, or partial-day attendance.',steps:['Identify the exact point where the morning routine breaks down.','Set a realistic arrival routine and backup step.','Assign support/ownership.','Track on-time arrival and adjust at review.'],evidence:'On-time arrival improves; tardies and partial-day absences decline.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'School Health Assessment + Attendance Plan',topic:'Intervention Menu',roles:['Attendance Team','Family Support Specialist'],tags:['health','illness','medical','sick'],summary:'Clarify health-related barriers and pair appropriate health guidance with a plan to reduce avoidable missed instructional time.',when:'Health or illness is contributing to repeated absence.',steps:['Clarify the health concern and attendance pattern.','Coordinate with school health staff.','Define appropriate stay-home and return-to-school supports.','Monitor health barrier reduction and attendance.'],evidence:'Health needs clarified; appropriate stay-home decisions; attendance improves.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'Work-School Schedule Problem-Solving',topic:'Intervention Menu',roles:['Social Worker / Counselor','Attendance Team'],tags:['work','job','schedule','working late'],summary:'Address work-school conflicts by aligning employment expectations, school schedule, and the scholar’s graduation pathway.',when:'Employment or work hours are interfering with school attendance.',steps:['Map the specific work-school conflict.','Problem-solve schedule options with scholar/family.','Connect the plan to course/credit goals.','Monitor time in school and course participation.'],evidence:'Schedule agreement implemented; time in school and attendance improve.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'Attendance Understanding + Goal Plan',topic:'Intervention Menu',roles:['Attendance Team','Family Support Specialist'],tags:['misconception','excused absence','attendance goal'],summary:'Correct an attendance misconception and convert the conversation into a specific attendance goal with follow-through.',when:'A scholar or family underestimates cumulative absence or believes excused absences do not affect learning.',steps:['Share personalized cumulative attendance information.','Clarify the misconception without blame.','Set a concrete attendance goal.','Review whether the belief and attendance pattern change.'],evidence:'Misconception corrected; goal understood; attendance trajectory improves.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'Housing Stability / McKinney-Vento Coordination',topic:'Intervention Menu',roles:['Family Support Specialist','Attendance Team','KSSN Coordinator'],tags:['housing','eviction','homeless','mckinney-vento'],summary:'Coordinate housing-stability protections and supports when housing instability is disrupting school attendance.',when:'Eviction, homelessness, doubled-up housing, or frequent moves affect attendance.',steps:['Clarify the housing-related attendance barrier.','Connect the family to the appropriate district pathway.','Coordinate transportation/basic-needs supports as applicable.','Monitor whether the housing barrier and attendance improve.'],evidence:'Supports activated; housing-related attendance barrier reduced.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'Individualized Safety Plan',topic:'Intervention Menu',roles:['Social Worker / Counselor','Attendance Team','Principal / School Leader'],tags:['safety','bullying','peer conflict','unsafe'],summary:'Create concrete protections and predictable adult supports when safety or peer conflict is driving school avoidance.',when:'A scholar avoids school because of bullying, peer conflict, or a safety concern.',steps:['Identify the specific safety concern and settings.','Establish immediate protections and safe adult contacts.','Plan arrival, transitions, and response procedures.','Monitor safety perception, implementation, and attendance.'],evidence:'Safety plan implemented; scholar reports improved safety; attendance improves.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'Academic Re-engagement + Targeted Support',topic:'Intervention Menu',roles:['Teacher','Attendance Team','Social Worker / Counselor'],tags:['academic','failing','class avoidance','course failure'],summary:'Pair attendance support with targeted academic problem-solving when difficulty, failure, or missed learning is driving avoidance.',when:'Academic struggle or course failure contributes to class or school avoidance.',steps:['Identify the course/task pattern and missed-learning gap.','Select targeted academic support.','Plan re-entry to the avoided class or work.','Monitor participation, academic progress, and attendance.'],evidence:'Academic participation and course progress improve alongside attendance.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'Community Resource Connection + Follow-Through Plan',topic:'Intervention Menu',roles:['Family Support Specialist','Attendance Team','KSSN Coordinator'],tags:['community resource','warm handoff','findhelp','resource map','basic needs','transportation','housing'],summary:'Turn a resource connection into an attendance intervention by matching it to the barrier, completing a warm handoff, naming an owner, and confirming follow-through.',when:'A concrete community resource is needed to reduce an identified attendance barrier.',steps:['Name the specific attendance barrier the resource is intended to reduce.','Select the GRPS/community resource that matches the barrier.','Complete a warm handoff and confirm the connection.','Name the GRPS owner and review whether the barrier and attendance improve.'],evidence:'Connection completed; resource accessed; barrier reduced; attendance response documented.',downloads:['tools/Attendance_Plan_Template.csv']},
 {title:'Relationship Mapping + Intentional Connection',topic:'Intervention Menu',roles:['Teacher','Attendance Team','Social Worker / Counselor'],tags:['belonging','connection','mentor','disengagement'],summary:'Identify whether the scholar has a trusted adult and intentionally build a consistent school connection when belonging is weak.',when:'Weak adult connection or belonging contributes to disengagement.',steps:['Map current trusted-adult connections.','Assign or strengthen a consistent caring-adult relationship.','Set a simple connection/attendance goal.','Monitor connection quality and attendance response.'],evidence:'Consistent connection occurs; belonging and attendance improve.',downloads:[]}
];
resources.push(...intentInterventionResources);
// Pattern-first guidance: attendance patterns identify WHEN/WHERE the issue occurs, not WHY.
resources.push({title:'Attendance Pattern Review + Root-Cause Inquiry',topic:'Early Action & Discovery',roles:['Attendance Team','Principal / School Leader','School Secretary / Attendance Staff','Family Support Specialist'],tags:['pattern','monday','friday','first period','same day','repeated absence','attendance pattern'],summary:'Use the attendance pattern as evidence, then investigate the reason before selecting an intervention.',when:'Repeated day-of-week, period, arrival, dismissal, or clustered absence patterns are visible but the underlying reason is not yet known.',steps:['Review the pattern in Synergy: day, period, frequency, duration, and recent change.','Ask what is different about the affected day, period, transition, or routine.','Use scholar/family voice and a caring conversation to identify the likely root cause.','Only after the root cause is supported, match the intervention and owner.'],evidence:'Pattern documented; root-cause hypothesis supported by evidence and voice; matched intervention selected.',downloads:['tools/Root_Cause_Interview_Guide.md']});
resources.push({title:'Class-Specific Attendance Pattern Inquiry',topic:'Early Action & Discovery',roles:['Attendance Team','Teacher','Principal / School Leader','Social Worker / Counselor'],tags:['class specific','skips class','misses class','period','math class','specific class'],summary:'Investigate a pattern tied to one class or period before deciding whether the cause is academic, relational, safety-related, motivational, or another factor.',when:'A scholar misses or skips a specific class or period while attending other parts of the school day.',steps:['Confirm the class/period pattern in Synergy.','Gather scholar voice about what is different in that class, time, task, or setting.','Check for academic difficulty, peer/safety concerns, adult relationship, schedule issues, or other contributing factors.','Select a root-cause pathway only after evidence supports it, then match the intervention.'],evidence:'Class-specific pattern documented; likely cause supported by evidence and scholar voice; matched response selected.',downloads:['tools/Root_Cause_Interview_Guide.md']});
resources.push({title:'Context-Linked Attendance Pattern Inquiry',topic:'Early Action & Discovery',roles:['Attendance Team','Teacher','Principal / School Leader','Social Worker / Counselor'],tags:['test days','assessment','specific event','context linked','context pattern'],summary:'Investigate absences that cluster around a specific event, demand, or school context without assuming the reason.',when:'Absences repeatedly occur on test days, presentation days, certain activities, transitions, or other identifiable contexts.',steps:['Confirm the context-linked pattern in attendance and school records.','Gather scholar voice and, when appropriate, caregiver/family perspective about what is different about that context or event.','Develop and test possible explanations—including academic difficulty, anxiety/aversion, peer or safety concerns, disengagement, family barriers, health factors, or misconceptions. Treat these as hypotheses, not conclusions.','Identify the most likely root cause supported by attendance data, scholar/family voice, and other evidence. Then select a matched intervention with an owner, measurable goal, and review date.'],evidence:'Pattern confirmed; root cause supported by evidence and scholar/family voice; matched intervention selected; owner identified; review date established.',downloads:['tools/Root_Cause_Interview_Guide.md']});
resources.push({title:'Possible Root Causes to Explore',topic:'Early Action & Discovery',roles:['All Staff','Attendance Team','Family Support Specialist','Teacher','Social Worker / Counselor'],tags:['root cause inquiry','barrier aversion disengagement misconception','explore'],summary:'Use the four GRPS root-cause pathways as hypotheses to investigate—not diagnoses to select from—when the reason for an attendance pattern is still unknown.',when:'A pattern is visible but the underlying reason has not yet been established.',steps:['Start with scholar/family voice and the observed attendance pattern.','Consider Barrier, Aversion, Disengagement, and Misconception as hypotheses.','Gather evidence that supports or rules out each pathway.','Select one primary root cause only when the evidence is strong enough to guide intervention matching.'],evidence:'One primary root-cause hypothesis is supported by attendance data, context, and scholar/family voice.',downloads:['tools/Root_Cause_Interview_Guide.md']});

const searchIntents=[
 {id:'class_pattern',mode:'pattern',label:'Class-specific attendance pattern identified',guidance:'The scholar is missing a specific class or period while attending other parts of the day. Treat that pattern as evidence, gather scholar voice, and investigate what is different about that class before selecting a root cause or intervention.',phrases:['skips math class','skips class but attends','skips class','misses math class','misses english class','misses one class','attends the rest of the day','cuts class','cutting class','skipping period','misses one period'],titles:['Class-Specific Attendance Pattern Inquiry','Synergy Attendance Analytics','Caring Conversations / Early Outreach','Possible Root Causes to Explore','Academic / Class Avoidance Response']},
 {id:'context_pattern',mode:'pattern',label:'Context-linked attendance pattern identified',guidance:'The absences are linked to a specific context or event. Confirm the pattern and investigate what about that context is contributing before deciding whether the root cause is academic, anxiety-related, safety-related, disengagement, or something else.',phrases:['test days','on test days','only misses school on test days','assessment days','presentation days','on presentation days','specific event','substitute teacher','there is a substitute','when there is a substitute','whenever there is a substitute'],titles:['Context-Linked Attendance Pattern Inquiry','Synergy Attendance Analytics','Caring Conversations / Early Outreach','Possible Root Causes to Explore','Academic Re-engagement + Targeted Support']},
 {id:'pattern',mode:'pattern',label:'Attendance pattern identified',guidance:'A pattern tells us when or where attendance is occurring, not why. Review the attendance pattern and use scholar/family voice to identify the root cause before selecting an intervention.',phrases:['every monday','every friday','every tuesday','every wednesday','every thursday','same day each week','after weekends','after the weekend','first period','misses first period','missing first period','several days in a row','three days in a row','absent a lot','misses school every','absent every','leaves school early every','leaves early every'],titles:['Attendance Pattern Review + Root-Cause Inquiry','Synergy Attendance Analytics','Caring Conversations / Early Outreach','Possible Root Causes to Explore']},
 {id:'clarify_sick',mode:'possible',label:'Reason needs clarification',guidance:'The reported reason and available information do not align. Use scholar/family voice and a caring conversation to determine whether the underlying issue is a misconception, aversion, family barrier, health concern, or another attendance factor before selecting an intervention.',phrases:['calling child in sick but child is not sick','calling scholar in sick but scholar is not sick','says child is sick but child is not sick','says scholar is sick but scholar is not sick','called in sick but not sick','sick but not sick'],titles:['Caring Conversations / Early Outreach','Action vs. Intervention','Root Cause: Misconception','Root Cause: Aversion','Root Cause: Barrier','Health & Attendance']},
 {id:'transportation',mode:'clear',label:'Barrier — transportation / family logistics',guidance:'A transportation or family-logistics condition is interfering with attendance. Clarify the exact failure point and build a reliable primary and backup plan. A caregiver work schedule that affects transportation is part of the family-logistics barrier; it is not evidence that the scholar has a work-school conflict.',phrases:['no ride','need a ride','ride to school','rides to school','bus issue','bus problem','missed bus','transportation','getting to school','get to school','car broke','car broke down','no car','caregiver work schedule',"caregiver's work schedule",'parent work schedule',"parent's work schedule",'guardian work schedule',"guardian's work schedule"],titles:['Transportation Problem-Solving','Community Resource Connection + Follow-Through Plan','Root Cause: Barrier','Attendance Success Plan']},
 {id:'tardy',mode:'clear',label:'Tardiness / partial-day barrier',phrases:['keeps coming late','coming late','always late','tardy','tardies','late to school','late arrival','partial day','leaves early','early dismissal'],titles:['Individualized Arrival Plan','Arrival Check-In','Root Cause: Barrier']},
 {id:'anxiety',mode:'clear',label:'Aversion — anxiety / worry',phrases:['scared to come','scared to go','afraid to come','afraid to go','school anxiety','anxiety','anxious','worry','worried','school avoidance','does not want to come',"doesn't want to come"],titles:['Predictable Re-entry + Check-In Plan','Behavioral Health Connection + School Support Plan','Mental Health & Attendance','Root Cause: Aversion','Caring Conversations / Early Outreach']},
 {id:'peer',mode:'clear',label:'Aversion — safety / peer conflict',phrases:['being bullied','bullied','bullying','peer conflict','fight at school','afraid of someone','unsafe at school','not safe','safety concern'],titles:['Individualized Safety Plan','Safety / Peer Conflict Response','Root Cause: Aversion','Caring Conversations / Early Outreach']},
 {id:'housing',mode:'clear',label:'Barrier — housing / basic needs',phrases:['family was evicted','evicted','eviction','homeless','housing','moving around','unstable housing','basic needs','no food','food insecurity','utilities shut off'],titles:['Housing Stability / McKinney-Vento Coordination','Basic Needs / Housing Support','Community Resource Connection + Follow-Through Plan','Root Cause: Barrier']},
 {id:'health',mode:'clear',label:'Barrier — health / wellness',phrases:['sick a lot','always sick','ill a lot','health issue','health problem','medical','doctor','dental','illness','chronic illness','sick'],titles:['School Health Assessment + Attendance Plan','Health & Attendance','Root Cause: Barrier']},
 {id:'belonging',mode:'possible',label:'Disengagement — explore belonging, relevance, and motivation',guidance:'This is an observation, not a confirmed root cause. Use scholar/family voice to determine whether belonging, relevance, academic frustration, work obligations, peer issues, anxiety, or another factor is contributing before selecting the intervention.',phrases:['does not feel connected',"doesn't feel connected",'no connection','does not belong',"doesn't belong",'lonely','no adult connection','needs a mentor','bored','school is boring','school feels boring','does not care about school',"doesn't care about school",'does not like school',"doesn't like school",'hates school','hate school','does not want to be here',"doesn't want to be here",'does not want to be at school',"doesn't want to be at school",'feels disconnected','nobody cares','no one cares','does not belong',"doesn't belong"],titles:['Relationship Mapping + Intentional Connection','Caring Conversations / Early Outreach','Success Mentor / CICO','Root Cause: Disengagement','Positive Conditions for Learning']},
 {id:'academic',mode:'possible',label:'Academic difficulty / class concern',guidance:'Determine whether academic difficulty is contributing to absences, class avoidance, disengagement, or missed learning before selecting an intervention.',phrases:['failing classes','failing class','failing math','failing english','failing science','failing a class','failing a course','math failure','academic failure','class avoidance','avoids class','skips class','academic struggle','course failure','failing','credit problem','behind in class'],titles:['Academic Re-engagement + Targeted Support','Academic / Class Avoidance Response','Caring Conversations / Early Outreach','Root Cause: Aversion','Root Cause: Disengagement']},
 {id:'work',mode:'clear',label:'Disengagement — scholar work-school conflict',phrases:['scholar works late','scholar is working late','scholar work schedule','scholar job conflict','scholar has to work','scholar working instead of school','student works late','student work schedule','student has to work','i work late','my job conflicts with school'],titles:['Work-School Schedule Problem-Solving','Root Cause: Disengagement']},
 {id:'misconception',mode:'possible',label:'Reported attendance misconception — confirm understanding',phrases:[
'excused days do not count',"excused days don't count",
'excused absences do not count',"excused absences don't count",
'absences are excused so they do not count',"absences are excused so they don't count",
'excused so they do not count',"excused so they don't count",
'because they are excused they do not count',"because they are excused they don't count",
'only unexcused count','only unexcused absences count',
'two days a month','2 days a month',
'attendance does not matter',"attendance doesn't matter"
],titles:['Attendance Understanding + Goal Plan','Root Cause: Misconception','Understanding Chronic Absence','Action vs. Intervention']}
];

function normalizedSearch(v){return v.toLowerCase().replace(/[’]/g,"'").replace(/\s+/g,' ').trim();}
function absenceTierFromPercent(p){
 if(!Number.isFinite(p)||p<0||p>100) return null;
 if(p<10) return {tier:'Tier 1',band:'0–9% absent',owner:'All staff; Attendance Team monitors'};
 if(p<20) return {tier:'Tier 2',band:'10–19% absent',owner:'Building Attendance Team'};
 return {tier:'Tier 3',band:'20%+ absent',owner:'FSS + Attendance Team'};
}
function detectSearchIntent(term){
 const t=normalizedSearch(term);
 if(!t) return null;
 const pctMatch=t.match(/(?:^|\s)(\d{1,3}(?:\.\d+)?)\s*%/);
 const pct=pctMatch?Number(pctMatch[1]):null;
 const pctTier=pct!==null?absenceTierFromPercent(pct):null;
 const caregiverWorkSchedule=/(?:caregiver|parent|guardian|mom|mother|dad|father)[^.!?]{0,70}(?:work schedule|works|working|job)|(?:work schedule|works|working|job)[^.!?]{0,70}(?:caregiver|parent|guardian|mom|mother|dad|father)/.test(t);
 const transportationContext=/(?:transport|ride|bus|car|getting to school|get to school|arrival)/.test(t);


 // Explicit scholar-reported causal evidence must be evaluated before generic factor logic.
 const scholarReport=(
   /\b(?:but\s+)?(?:the\s+)?scholar\s+(?:says|reports|shares|states|tells|said|reported)\b/.test(t)
   ||
   /\b(?:the\s+)?scholar\b[^.!?]{0,90}\b(?:says|reports|shares|states|tells|said|reported)\b/.test(t)
 );
 const attendanceBehavior=/\b(?:stay(?:s|ing)?\s+home|avoid(?:s|ing)?\s+(?:school|class)|miss(?:es|ing)?\s+(?:school|class)|skip(?:s|ping)?\s+(?:school|class)|doesn['’]t\s+come|does\s+not\s+come)\b/.test(t);
 const academicReason=/\b(?:fail(?:ing|ed)?|failing\s+classes?|behind\s+in\s+class|academic(?:ally)?|class(?:es)?|math|credit|course|embarrass(?:ed|ment)?|ashamed|humiliat(?:ed|ion))\b/.test(t);

 // Strong causal evidence means the scholar explicitly links attendance behavior
 // to the academic reason. Match either order:
 //   "stay home because I am failing"
 //   "I am failing, so I stay home"
 const directAcademicCausal =
   /\b(?:stay(?:s|ing)?\s+home|avoid(?:s|ing)?\s+(?:school|class)|miss(?:es|ing)?\s+(?:school|class)|skip(?:s|ping)?\s+(?:school|class)|doesn['’]t\s+come|does\s+not\s+come)\b[^.!?]{0,80}\b(?:because|due to|since)\b[^.!?]{0,120}\b(?:fail(?:ing|ed)?|behind|class|classes|math|academic|embarrass(?:ed|ment)?|ashamed|humiliat(?:ed|ion))\b/.test(t)
   ||
   /\b(?:fail(?:ing|ed)?|behind|class|classes|math|academic|embarrass(?:ed|ment)?|ashamed|humiliat(?:ed|ion))\b[^.!?]{0,120}\b(?:so|therefore|because)\b[^.!?]{0,80}\b(?:stay(?:s|ing)?\s+home|avoid(?:s|ing)?\s+(?:school|class)|miss(?:es|ing)?\s+(?:school|class)|skip(?:s|ping)?\s+(?:school|class)|doesn['’]t\s+come|does\s+not\s+come)\b/.test(t);

 const scholarAcademicCausal=scholarReport && attendanceBehavior && academicReason && directAcademicCausal;

 const independentDisengagementEvidence=/\b(?:school\s+is\s+boring|boring|doesn['’]t\s+care|does\s+not\s+care|unmotivated|no\s+motivation|disconnected|doesn['’]t\s+belong|does\s+not\s+belong|nobody\s+cares|no\s+trusted\s+adult|weak\s+connection|hates?\s+school)\b/.test(t);

 if(pctTier && scholarAcademicCausal){
  const titles=[
    'Caring Conversations / Early Outreach',
    'Root Cause: Aversion',
    'Academic Re-engagement + Targeted Support',
    'Academic / Class Avoidance Response',
    ...(independentDisengagementEvidence ? ['Root Cause: Disengagement'] : []),
    'Attendance Success Plan'
  ];
  return {
    id:'severity_academic_causal',
    mode:'clear',
    hasImmediate:false,
    label:`${pctTier.tier} attendance concern — ${pct}% absent | Scholar-reported reason: academic failure/embarrassment is contributing to school or class avoidance`,
    guidance:`Attendance percentage determines intensity; root cause determines the intervention. ${pctTier.tier} falls in the ${pctTier.band} range, with primary ownership: ${pctTier.owner}. The scholar directly connected staying home or avoiding school to academic difficulty and embarrassment about returning. Treat this as strong causal evidence for an academic/class-avoidance pathway while continuing to clarify the specific academic conditions that are driving avoidance. Prioritize Aversion / Academic-Class Avoidance and matched academic re-engagement supports.${independentDisengagementEvidence?' Separate disengagement evidence is also present, so explore it as a secondary factor.':' Disengagement is not shown because no independent evidence of boredom, low motivation, weak belonging, or disconnection was identified.'} ${pctTier.tier==='Tier 1'?'Monitor whether the identified concern changes and attendance improves; escalate if the pattern persists or worsens.':'Use one coordinated plan with 10/20/30-day checkpoints to review implementation, academic barrier reduction, and attendance response.'}`,
    titles
  };
 }


 
 const directDisengagement=/\b(?:school\s+(?:is|feels)\s+boring|boring|doesn['’]t\s+care\s+about\s+school|does\s+not\s+care\s+about\s+school|hates?\s+school|feels?\s+disconnected|doesn['’]t\s+belong|does\s+not\s+belong)\b/.test(t);
 const concreteCoFactor=/\b(?:no\s+ride|transportation|bus|car\s+broke|failing|failed|math|academic|class\s+avoidance|bullied|bullying|unsafe|health|sick|evicted|housing|tardy|late\s+to\s+school)\b/.test(t);
 if(!pctTier && directDisengagement && !concreteCoFactor){
  return {
   id:'direct_disengagement',mode:'possible',hasImmediate:false,
   label:'Disengagement — explore belonging, relevance, and motivation',
   guidance:'The statement suggests a possible disengagement pattern. Use scholar/family voice to clarify whether belonging, relevance, motivation, academic frustration, or another factor is contributing before confirming the root cause.',
   titles:['Relationship Mapping + Intentional Connection','Success Mentor / CICO','Caring Conversations / Early Outreach','Root Cause: Disengagement','Positive Conditions for Learning']
  };
 }

const explicitNoBarrier=/\b(?:no|without)\s+(?:known\s+)?barriers?\b|\bthere (?:are|is) no (?:known )?barriers?\b|\bno barriers? (?:identified|reported|known)\b/.test(t);

 // Detect multiple meaningful attendance factors before selecting a single pathway.
 // This prevents one concrete keyword (for example, “no ride”) from masking
 // academic, engagement, aversion, health, or other signals in the same statement.
 const matched=[];
 for(const intent of searchIntents){
  if(['pattern','class_pattern','context_pattern','clarify_sick'].includes(intent.id)) continue;
  let longest=0;
  for(const phrase of intent.phrases){
   const p=normalizedSearch(phrase);
   if((t===p || t.includes(p)) && p.length>longest) longest=p.length;
  }
  if(longest) matched.push({intent,longest});
 }
 const factorMatches=matched.filter(x=>['transportation','tardy','anxiety','peer','housing','health','belonging','academic','work','misconception'].includes(x.intent.id) && !(x.intent.id==='work' && caregiverWorkSchedule && transportationContext));
 const distinctFamilies=new Set(factorMatches.map(x=>x.intent.id));

 // Percentage determines intensity, not root cause.
 // Keep severity visible whether the root cause is unknown OR a separate factor is confirmed.
 if(pctTier && (factorMatches.length===0 || explicitNoBarrier)) {
  const familyStatement=explicitNoBarrier?' Family reports no known barriers; treat that as one source of information, not proof that no attendance factor exists.':'';
  return {
   id:'severity_unknown',mode:'possible',hasImmediate:false,
   label:`${pctTier.tier} attendance concern — ${pct}% absent`,
   guidance:`Attendance percentage determines intensity; it does not determine the root cause. ${pctTier.tier} falls in the ${pctTier.band} range, with primary ownership: ${pctTier.owner}.${familyStatement} Review the attendance pattern, gather scholar voice and other relevant evidence, and identify the primary root cause before selecting an intervention.${pctTier.tier==='Tier 1'?' Monitor the attendance response and intensify support if the pattern persists or worsens.':' Use one coordinated plan with 10/20/30-day checkpoints; review implementation fidelity, barrier/root-cause evidence, and attendance response.'}`,
   titles:['Attendance Pattern Review + Root-Cause Inquiry','Synergy Attendance Analytics','Caring Conversations / Early Outreach','Possible Root Causes to Explore',...(pctTier.tier!=='Tier 1'?['Attendance Success Plan']:[])]
  };
 }

// Evidence-priority rule: when the scholar explicitly connects academic difficulty
 // to staying home/avoiding school, treat that as stronger causal evidence than a
 // generic academic keyword match. Explore possible academic/class avoidance (Aversion)
 // and do not elevate Disengagement unless separate motivation/belonging evidence exists.
 if(pctTier && factorMatches.length===1 && !explicitNoBarrier) {
  const fm=factorMatches[0].intent;
  const immediate=['transportation','peer','housing','health'].includes(fm.id);
  const exploratoryFactor=['anxiety','belonging','academic','work','tardy','misconception'].includes(fm.id);
  const factorLabel=fm.id==='transportation'?'Confirmed transportation barrier':
    fm.id==='housing'?'Confirmed housing/basic-needs barrier':
    fm.id==='health'?'Reported health/wellness concern — confirm attendance pathway':
    fm.id==='peer'?'Reported safety/peer concern — confirm attendance pathway':
    fm.id==='anxiety'?'Reported factor: anxiety / worry — explore possible aversion':
    fm.id==='belonging'?'Reported factor: engagement / belonging concern — explore possible disengagement':
    fm.id==='academic'?'Reported factor: academic difficulty — investigate attendance connection':
    fm.id==='work'?'Reported factor: work-school conflict — investigate attendance connection':
    fm.id==='tardy'?'Reported factor: tardiness / partial-day pattern — investigate why':
    fm.id==='misconception'?'Reported factor: belief about excused absences / attendance — explore possible Misconception':
    fm.label;
  const reviewText=pctTier.tier==='Tier 1'
    ? (fm.id==='anxiety'
        ? 'Respond to the identified anxiety/worry concern while continuing to understand what is driving the avoidance. Monitor whether the identified concern changes and whether attendance improves; once the root cause is supported and an intervention is selected, monitor implementation and effectiveness.'
        : fm.id==='misconception'
          ? 'Clarify the attendance belief and continue investigating what is driving the absences. The conversation, letter, or explanation is an action—not the intervention. If a misconception is supported as the primary root cause, use a specific attendance goal/habit plan and monitor whether attendance improves.'
          : exploratoryFactor
            ? 'Respond to the reported factor while continuing to investigate the primary root cause. Monitor whether the identified concern changes and whether attendance improves; once the root cause is supported and an intervention is selected, monitor implementation and effectiveness.'
            : 'Respond to the confirmed barrier now. Monitor whether the barrier is resolved and attendance improves; escalate if the pattern persists or worsens.')
    : (fm.id==='misconception'
        ? 'Clarify the attendance belief while continuing root-cause inquiry. The conversation, letter, or explanation is an action—not the intervention. If Misconception is supported as the primary root cause, build one coordinated attendance goal/habit plan and use 10/20/30-day checkpoints to review implementation and attendance response.'
        : exploratoryFactor
          ? 'Use a coordinated plan with 10/20/30-day checkpoints while continuing to confirm the primary root cause through scholar/family voice and other evidence.'
          : 'Use a coordinated plan with 10/20/30-day checkpoints to review fidelity, barrier reduction, and attendance response.');
  const titles=[...fm.titles];
  if(pctTier.tier!=='Tier 1' && !titles.includes('Attendance Success Plan')) titles.push('Attendance Success Plan');
  return {
   id:`severity_${fm.id}`,
   mode:'clear',
   hasImmediate:immediate,
   label:`${pctTier.tier} attendance concern — ${pct}% absent | ${factorLabel}`,
   guidance:`Attendance percentage determines intensity; root cause determines the intervention. ${pctTier.tier} falls in the ${pctTier.band} range, with primary ownership: ${pctTier.owner}. ${exploratoryFactor ? `The ${fm.label.toLowerCase()} is a reported factor to investigate; do not treat it as a confirmed root cause until supported by scholar/family voice and other evidence.` : `The ${fm.label.toLowerCase()} is the supported factor driving intervention selection.`} ${reviewText}`,
   titles
  };
 }

 
 if(distinctFamilies.size>=2){
  const ids=[...distinctFamilies];

  // Evidence-priority rule: an explicit scholar report that bullying/peer safety is
  // driving avoidance takes priority over a nonspecific caregiver report of illness.
  // The health concern remains visible for investigation, but is not presented as an
  // equally confirmed "address now" intervention unless separate health evidence exists.
  const scholarPeerReport=ids.includes('peer') && /scholar\s+(?:says|reports|shares|states|tells|said|reported)[^.!?]*(?:bull(?:y|ied|ying)|peer conflict|unsafe|afraid|threat)/.test(t);
  const caregiverHealthReport=ids.includes('health') && /(?:caregiver|parent|guardian|family)\s+(?:says|reports|shares|states|tells|said|reported)[^.!?]*(?:sick|ill|health|medical)/.test(t);
  const prioritizePeerOverHealth=scholarPeerReport && caregiverHealthReport;

  if(prioritizePeerOverHealth){
   const titles=['Individualized Safety Plan','Caring Conversations / Early Outreach','Possible Root Causes to Explore','Attendance Success Plan'];
   const severityText=pctTier?` ${pctTier.tier} intensity applies because the scholar is ${pct}% absent (${pctTier.band}); primary ownership: ${pctTier.owner}.`:'';
   const multiLabel=pctTier?`${pctTier.tier} attendance concern — ${pct}% absent | Scholar-reported bullying/safety concern + caregiver-reported illness`:'Scholar-reported bullying/safety concern + caregiver-reported illness';
   return {
    id:'multi_factor_peer_priority',
    mode:'possible',
    hasImmediate:true,
    label:multiLabel,
    guidance:`More than one factor may be contributing.${severityText} Scholar-reported factor: bullying/safety concern linked to school avoidance — address promptly. Caregiver-reported factor: frequent illness — investigate whether it is an independent health barrier, related to the bullying/avoidance, or another contributing factor. Attendance percentage determines intensity; root cause determines the intervention. Prioritize immediate safety while continuing root-cause inquiry. Do not start a separate health attendance intervention unless health evidence supports it. Build one coordinated attendance plan with a primary intervention, complementary supports as needed, an owner, a measurable goal, and a review date.${pctTier && pctTier.tier!=='Tier 1'?' Use 10/20/30-day checkpoints to review implementation, safety/barrier reduction, and attendance response.':''}`,
    titles
   };
  }

  const known=[]; const explore=[];
  for(const x of factorMatches){
   const name=x.intent.id==='transportation'?'transportation barrier':x.intent.id==='housing'?'housing/basic-needs barrier':x.intent.id==='health'?'health/wellness concern':x.intent.id==='academic'?'academic difficulty':x.intent.id==='belonging'?'engagement/belonging concern':x.intent.id==='anxiety'?'anxiety/aversion concern':x.intent.id==='peer'?'safety/peer concern':x.intent.id==='tardy'?'tardiness/partial-day pattern':x.intent.id==='work'?'work-school conflict':x.intent.id==='misconception'?'attendance misconception':x.intent.label;
   (x.intent.mode==='clear'?known:explore).push(name);
  }
  const titles=['Caring Conversations / Early Outreach','Possible Root Causes to Explore'];
  if(ids.includes('transportation')) titles.unshift('Transportation Problem-Solving');
  if(ids.includes('academic')) { titles.push('Academic Re-engagement + Targeted Support'); titles.push('Academic / Class Avoidance Response'); }
  if(ids.includes('belonging')) titles.push('Relationship Mapping + Intentional Connection');
  if(ids.includes('anxiety')) titles.push('Predictable Re-entry + Check-In Plan');
  if(ids.includes('peer')) titles.unshift('Individualized Safety Plan');
  if(ids.includes('housing')) titles.push('Housing Stability / McKinney-Vento Coordination');
  if(ids.includes('health')) titles.push('School Health Assessment + Attendance Plan');
  if(ids.includes('work')) titles.push('Work-School Schedule Problem-Solving');
  if(ids.includes('misconception')) titles.push('Attendance Understanding + Goal Plan');
  titles.push('Attendance Success Plan');
  const knownText=known.length?` Known factor${known.length>1?'s':''}: ${[...new Set(known)].join(', ')}.`:'';
  const exploreText=explore.length?` Factors to investigate: ${[...new Set(explore)].join(', ')}.`:'';
  const severityText=pctTier?` ${pctTier.tier} intensity applies because the scholar is ${pct}% absent (${pctTier.band}); primary ownership: ${pctTier.owner}.`:'';
  const multiLabel=pctTier?`${pctTier.tier} attendance concern — ${pct}% absent | Multiple attendance factors identified`:'Multiple attendance factors identified';
  return {id:'multi_factor',mode:'possible',hasImmediate:ids.some(id=>['transportation','peer','housing','health'].includes(id)),label:multiLabel,guidance:`More than one factor may be contributing.${severityText}${knownText}${exploreText} Attendance percentage determines intensity; root cause determines the intervention. Address any identified access or safety concern promptly while using scholar/family voice and other evidence to identify the primary root cause. Build one coordinated attendance plan with a primary intervention, complementary supports, an owner, a measurable goal, and a review date.${pctTier && pctTier.tier!=='Tier 1'?' Use 10/20/30-day checkpoints to review fidelity, barrier/root-cause reduction, and attendance response.':''}`,titles:[...new Set(titles)]};
 }

 let best=null, bestLen=0;
 for(const intent of searchIntents){
  for(const phrase of intent.phrases){
   const p=normalizedSearch(phrase);
   if((t===p || t.includes(p) || p.includes(t) && t.length>=5) && p.length>bestLen){best=intent;bestLen=p.length;}
  }
 }
 if(best) return best;

 // Generic context/conditional pattern recognition. This intentionally identifies
 // a pattern without inferring the root cause from an unfamiliar school context.
 const attendanceSignal=/(absent|absence|miss(?:es|ing)?|skip(?:s|ping)?|late|tard(?:y|ies)|leave(?:s)? early|leaving early|does not attend|doesn't attend|not attend)/.test(t);
 const conditionalSignal=/(whenever|every time|each time|only when|when there is|when there's|when a|when the|on days when|days when|any time|anytime|if there is|if there's|during|around|after|before)/.test(t);
 const recurringSignal=/(always|repeatedly|regularly|consistently|often)/.test(t);
 if(attendanceSignal && (conditionalSignal || recurringSignal)){
  return {
   id:'generic_context_pattern',mode:'pattern',label:'Context-linked attendance pattern identified',
   guidance:'The attendance concern appears linked to a recurring context or condition. Confirm the pattern and use scholar/family voice to understand what is different about that context before selecting a root cause or intervention.',
   titles:['Context-Linked Attendance Pattern Inquiry','Synergy Attendance Analytics','Caring Conversations / Early Outreach','Possible Root Causes to Explore']
  };
 }
 return null;
}
function genericSearchScore(r,term){
 const t=normalizedSearch(term); if(!t) return 1;
 const title=normalizedSearch(r.title), tags=(r.tags||[]).map(normalizedSearch), topic=normalizedSearch(r.topic), summary=normalizedSearch(r.summary);
 let score=0;
 if(title===t) score+=120; else if(title.includes(t)) score+=80;
 if(tags.some(x=>x===t)) score+=70; else if(tags.some(x=>x.includes(t)||t.includes(x))) score+=45;
 if(topic.includes(t)) score+=25;
 if(summary.includes(t)) score+=12;
 return score;
}
function renderResources(){
 const term=normalizedSearch(q.value), intent=detectSearchIntent(term), topic=topicSel.value, role=(roleSel.value==='Other'?'All Staff':roleSel.value);
 let ranked=[];
 for(const r of resources){
  if(topic && r.topic!==topic) continue;
  if(role && !(r.roles.includes(role)||(role==='District/Department Staff'&&r.roles.includes('All Staff')))) continue;
  let score=1;
  if(term){
   if(intent){
    const idx=intent.titles.indexOf(r.title);
    if(idx<0) continue; // recognized attendance intent: show only intentionally matched resources
    score=200-(idx*20);
   } else {
    score=genericSearchScore(r,term);
    if(score<=0) continue;
   }
  }
  ranked.push({r,score});
 }
 ranked.sort((a,b)=>b.score-a.score || a.r.title.localeCompare(b.r.title));
 const out=ranked.map(x=>x.r);
 if(intent){
  const prefix=intent.mode==='possible' ? 'Possible attendance pathway' : intent.mode==='pattern' ? '' : 'Understood as';
  const guidance=intent.guidance ? `<span style="display:block;margin-top:5px;font-size:.95em;line-height:1.4">${intent.guidance}</span>` : '';
  meta.innerHTML=intent.mode==='pattern'
   ? `<strong>${intent.label}</strong> • ${out.length} resource${out.length===1?'':'s'} shown${guidance}`
   : `<strong>${prefix}:</strong> ${intent.label} • ${out.length} resource${out.length===1?'':'s'} shown${guidance}`;
 } else {
  meta.textContent=`${out.length} resource${out.length===1?'':'s'} shown`;
 }
 const hasImmediate=!!(intent && (intent.hasImmediate || ['transportation','peer','housing','health'].includes(intent.id)));
 const uncertain=!!(intent && (intent.mode==='possible' || intent.mode==='pattern' || (intent.label && (intent.label.includes('Reported factor:') || intent.label.includes('Reported health/wellness concern') || intent.label.includes('Reported safety/peer concern')))));
 const stageFor=(r)=>{
  const t=r.title;
  if(intent && (intent.mode==='possible' || (intent.label && intent.label.includes('Reported factor:'))) && t.startsWith('Root Cause:')) return 'Investigate';
  if(hasImmediate && ['Transportation Problem-Solving','Individualized Safety Plan','Housing Stability / McKinney-Vento Coordination','School Health Assessment + Attendance Plan'].includes(t)) return 'Address now';
  if(['Caring Conversations / Early Outreach','Possible Root Causes to Explore','Attendance Pattern Review + Root-Cause Inquiry','Class-Specific Attendance Pattern Inquiry','Context-Linked Attendance Pattern Inquiry','Synergy Attendance Analytics'].includes(t) || t.startsWith('Root Cause:')) return 'Investigate';
  if(t==='Attendance Success Plan') return 'Build plan';
  if(r.topic==='Monitoring & Review' || t.includes('10/20/30')) return 'Review';
  if(r.topic==='Intervention Menu') return uncertain ? 'Consider if confirmed' : 'Match intervention';
  return 'Use as support';
 };
 if(uncertain){
  const order={'Address now':0,'Investigate':1,'Consider if confirmed':2,'Build plan':3,'Review':4,'Use as support':5};
  out.sort((a,b)=>(order[stageFor(a)]??9)-(order[stageFor(b)]??9));
 }
 const addressClass=hasImmediate?'decision-step active':'decision-step muted';
 const addressText=hasImmediate?'Act promptly on the identified access or safety concern.':'No immediate access or safety concern identified from the information provided.';
 const hierarchy=intent ? `<div class="decision-path" aria-label="Attendance decision sequence">
   <div class="${addressClass}"><strong>1. Address now</strong><span>${addressText}</span></div>
   <div class="decision-step ${uncertain?'active':''}"><strong>2. Investigate</strong><span>Use the pattern, scholar/family voice, and evidence to understand why.</span></div>
   <div class="decision-step"><strong>3. ${uncertain?'Consider options':'Match intervention'}</strong><span>${uncertain?'Consider options only after the root cause is supported.':'Select one primary intervention that addresses the supported root cause.'}</span></div>
   <div class="decision-step"><strong>4. Build plan</strong><span>Name the owner, frequency, measurable goal, and review date.</span></div>
   <div class="decision-step review"><strong>5. Review</strong><span>${intent && intent.label && intent.label.startsWith('Tier 1')
 ? (intent.label.includes('Confirmed transportation barrier') || intent.label.includes('Confirmed housing/basic-needs barrier')
    ? 'Monitor whether the barrier is resolved and attendance improves; escalate if the pattern persists or worsens.'
    : intent.label.includes('Reported factor:') || intent.label.includes('Reported health/wellness concern') || intent.label.includes('Reported safety/peer concern')
      ? 'Monitor whether the identified concern decreases and attendance improves; escalate support if the pattern persists or worsens.'
      : 'Monitor attendance response and adjust support if the pattern persists or worsens.')
 : 'Check fidelity, barrier reduction, and attendance response at 10/20/30 days.'}</span></div>
  </div>` : '';
 grid.innerHTML=hierarchy+(out.map(r=>`<article class="card resource"><div class="resource-main"><span class="stage-label">${stageFor(r)}</span><h3>${(intent && (intent.mode==='possible' || (intent.label && intent.label.includes('Reported factor:'))) && r.title.startsWith('Root Cause:')) ? r.title.replace('Root Cause:','Possible Root Cause:') : r.title}</h3><p>${r.summary}</p><div class="resource-context"><span>${r.topic}</span><span>${r.roles.slice(0,2).join(' · ')}</span></div></div><footer><button data-open="${encodeURIComponent(r.title)}" aria-label="View steps and tools for ${r.title}">View steps &amp; tools</button></footer></article>`).join('') || `<article class="card resource-empty"><h3>No matching resources</h3><p>Try a different phrase or clear the filters.</p></article>`);
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openDetail(decodeURIComponent(b.dataset.open)));
}
function openDetail(title){
 const r=resources.find(x=>x.title===title); if(!r)return;
 document.getElementById('detailTopic').textContent=r.topic; document.getElementById('detailTitle').textContent=r.title;
 const downloads=(r.downloads||[]).map(d=>`<a class="btn secondary" href="${d}" download>${d.split('/').pop().replaceAll('_',' ')}</a>`).join('');
 document.getElementById('detailBody').innerHTML=`
  <div class="detail-section"><h3>Purpose</h3><p>${r.summary}</p></div>
  <div class="detail-section"><h3>When to use</h3><p>${r.when}</p></div>
  <div class="detail-section"><h3>Implementation</h3><ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol></div>
  <div class="detail-section"><h3>Progress evidence</h3><p>${r.evidence}</p></div>
  <div class="detail-section"><h3>What to do next</h3>${nextStepsFor(r).map((x,i)=>`<div class="next-step"><div class="stepnum">${i+1}</div><div>${x}</div></div>`).join('')}</div>
  <div class="detail-section"><div class="callout orange"><b>Common mistake to avoid:</b> ${mistakeFor(r)}</div></div>
  <div class="detail-section"><h3>Who may use this</h3><div class="related">${r.roles.map(x=>`<span class="pill">${x}</span>`).join('')}</div></div>
  ${downloads?`<div class="detail-section"><h3>Related downloads</h3><div class="related">${downloads}</div></div>`:''}`;
 document.getElementById('detail').classList.add('open'); location.hash='resource='+encodeURIComponent(title);
}

function nextStepsFor(r){
 if(r.topic==='Monitoring & Review') return ['Confirm the active plan has a named owner, dosage/frequency, measurable goal, and review date.','Review fidelity before deciding the intervention itself failed.','Use attendance response, barrier reduction, and scholar/family voice to continue, adjust, intensify, or step down.'];
 if(r.topic==='Intervention Menu') return ['Verify that the selected support directly addresses the identified root cause.','Name one primary intervention, its owner, frequency, start date, and measurable goal.','Set the appropriate review checkpoint and document what evidence will show progress.'];
 if(r.topic==='Family & Community') return ['Lead with a caring, strengths-based conversation rather than compliance language.','Document the barrier and family voice, then make a warm connection to the support.','Follow up to verify the connection occurred and whether the barrier was reduced.'];
 if(r.topic==='Data & Analytics') return ['Use official attendance data to identify the pattern and level of concern.','Pair the data with scholar/family voice before selecting an intervention.','Bring the pattern—not just a list of names—to the Attendance Team.'];
 return ['Use this resource to clarify the attendance concern and the most likely root cause.','Translate the guidance into one concrete next action with a named owner.','Review whether the action changed the barrier or attendance pattern.'];
}
function mistakeFor(r){
 const t=(r.title+' '+r.topic).toLowerCase();
 if(t.includes('transport')) return 'Assigning a mentor or sending repeated attendance notices without fixing the transportation failure.';
 if(t.includes('cico')||t.includes('mentor')) return 'Using a connection-based intervention when the primary barrier is transportation, housing, health, or another access issue.';
 if(t.includes('10/20/30')||t.includes('monitor')) return 'Looking only at attendance percentage without checking intervention fidelity and whether the underlying barrier changed.';
 if(t.includes('family')||t.includes('caring')||t.includes('home')) return 'Treating outreach itself as the intervention instead of using the conversation to identify and address the barrier.';
 return 'Selecting a support because it is familiar or available rather than because it matches the reason for absence.';
}
function closeDetail(){document.getElementById('detail').classList.remove('open'); if(location.hash.startsWith('#resource=')) history.replaceState(null,'',location.pathname+location.search)}
document.getElementById('closeDetail').onclick=closeDetail; document.getElementById('detail').onclick=e=>{if(e.target.id==='detail')closeDetail()}; document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDetail()});
[q,topicSel,roleSel].forEach(el=>el.addEventListener(el===q?'input':'change',renderResources)); document.getElementById('reset').onclick=()=>{q.value='';topicSel.value='';roleSel.value='';renderResources()};

document.querySelectorAll('[data-rolepick]').forEach(b=>b.onclick=()=>{
  const picked=b.dataset.rolepick;
  q.value=''; topicSel.value='';
  if(picked==='Other'){
    roleSel.value='All Staff';
  }else if([...roleSel.options].some(o=>o.value===picked)){
    roleSel.value=picked;
  }else{
    roleSel.value='';
  }
  renderResources();
  const target=document.getElementById('resources');
  const top=target.getBoundingClientRect().top+window.scrollY-120;
  window.scrollTo({top,behavior:'smooth'});
});

document.querySelectorAll('[data-search]').forEach(b=>b.onclick=()=>{q.value=b.dataset.search; topicSel.value=''; roleSel.value=''; renderResources(); document.getElementById('resources').scrollIntoView()});
document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{q.value=b.dataset.jump; renderResources(); document.getElementById('resources').scrollIntoView()});
document.querySelectorAll('[data-anchor]').forEach(b=>{
  b.onclick=()=>{
    const target=document.getElementById(b.dataset.anchor);
    if(!target) return;
    history.replaceState(null,'','#'+b.dataset.anchor);
    const top=target.getBoundingClientRect().top+window.scrollY-120;
    window.scrollTo({top,behavior:'smooth'});
    target.setAttribute('tabindex','-1');
    setTimeout(()=>target.focus({preventScroll:true}),450);
  };
});

/* [old matcher form moved to app.js] */
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function downloadPlan(p){
 const text=`GRPS STRIVE FOR LESS THAN 5 — MATCHED ATTENDANCE RESPONSE
Scholar/Local Identifier: ${p.id||'Not entered'}
Current Absence: ${p.pct}%
Tier: ${p.t.tier} (${p.t.band})
Primary Ownership: ${p.t.owner}
Root Cause: ${p.root}
Specific Need: ${p.n}
KSSN Partner School: ${p.kssn}
Scholar/Family Voice: ${p.voice||'Not entered'}
Measurable Goal: ${p.goal||'To be set'}

MATCHED SUPPORTS
${p.recs.map((r,i)=>`${i+1}. ${r.name}\n   Owner: ${r.owner}\n   Evidence: ${r.evidence}`).join('\n')}

MONITORING
${p.review}

Required plan elements: baseline; pattern; root cause; scholar voice; family voice; selected intervention; owner; FSS/KSSN involvement; dosage; start date; measurable goal; reviews; fidelity; response; next action.`;
 const blob=new Blob([text],{type:'text/plain'}), a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='GRPS_Attendance_Matched_Response.txt'; a.click(); URL.revokeObjectURL(a.href);
}
meta.textContent='Choose a common need, search, or select a topic to get started.'; grid.innerHTML='<div class="resource-empty"><strong>Start with a question or need.</strong><p>For example: “No ride to school,” “Missing math class,” or “What should our attendance team review?”</p></div>';
if(location.hash.startsWith('#resource=')){const title=decodeURIComponent(location.hash.slice(10));setTimeout(()=>openDetail(title),0)}
window.loadScenario=function(k){if(window.S5&&S5.loadScenario)S5.loadScenario(k);};

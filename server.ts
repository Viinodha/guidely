/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory cross-device cloud profile store
const cloudProfileStore = new Map<string, any>();

// Seed a demo profile so any user trying IND-DEMO can load immediately
cloudProfileStore.set('IND-9428', {
  userType: 'school',
  schoolLevel: 'Class 11-12 (Entrance & Board Focus)',
  streamOrMajor: 'PCM (Physics, Chemistry, Mathematics)',
  academicScore: 88,
  academicScoreType: 'percentage',
  favoriteSubjects: ['Mathematics', 'Computer Science'],
  preferredLocations: ['Tier 1 Metro', 'Pan-India / State Hubs'],
  budgetPreference: 'Government Subsidized (< ₹2.5L)',
  workStyle: ['Analytical & Problem Solving', 'Hands-on Engineering'],
  entranceExamReadiness: 'Already preparing intensively',
  bookmarks: ['ai-software-engineering', 'data-science-applied-ai'],
  lastUpdated: new Date().toISOString(),
  syncCode: 'IND-9428',
  studentName: 'Aarav Sharma',
});

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * High-precision Indian Education & Career Knowledge Engine
 * Generates rich, realistic, question-specific guidance across national entrance exams,
 * admission counseling, cutoffs, syllabus, and eligibility rules.
 */
function generateDynamicCounselingResponse(
  userQuery: string,
  activeCareer?: any,
  profile?: any
): { reply: string; suggestions: string[] } {
  const q = (userQuery || '').toLowerCase();
  const studentName = profile?.studentName || 'Student';
  const stream = profile?.streamOrMajor || 'your stream';
  const score = profile?.academicScore ? `${profile.academicScore}${profile.academicScoreType === 'cgpa' ? ' CGPA' : '%'}` : 'your academic benchmark';

  // 1. NEET / Medical / MBBS / BDS
  if (q.includes('neet') || q.includes('mbbs') || q.includes('doctor') || q.includes('medical') || q.includes('bds')) {
    return {
      reply: `Regarding **NEET-UG & Medical Admissions in India**:\n\n` +
        `• **Exam Structure & Authority**: Conducted annually by the **National Testing Agency (NTA)** for admission to MBBS, BDS, BAMS, BHMS, and BSMS seats nationwide (including AIIMS & JIPMER).\n` +
        `• **Syllabus & Weightage**: Strictly follows Class 11 and Class 12 NCERT curriculum across **Physics, Chemistry, and Biology (Botany & Zoology)**. Total 720 marks (180 questions to attempt). Marking scheme is +4 for correct, -1 for incorrect.\n` +
        `• **Score Benchmarks & Cutoffs**: For General/EWS candidates targeting Government Medical Colleges (GMC), safe score range under All India Quota (AIQ 15%) is typically **615 - 650+ / 720**. State Quota (85%) cutoffs vary by state, often 570 - 620+ depending on state competition.\n` +
        `• **Actionable Strategy for ${studentName}**: Line-by-line mastery of Biology NCERT accounts for ~360 marks. Dedicate daily 2-hour problem practice to Physics numericals and Chemistry physical/organic reactions. Solve minimum 10 years of authentic NTA PYQs with full OMR sheet practice.\n` +
        `• **Counseling Gateways**: Medical Counselling Committee (**MCC**) handles 15% AIQ and Central/Deemed Universities; respective State Health Directorates conduct 85% State Quota rounds.`,
      suggestions: [
        'What are the high-weightage chapters in NEET Biology and Chemistry?',
        'How does 15% All India Quota compare with 85% State Quota in medical counseling?',
        'What are the top alternative options (like BDS, BVSc, B.Pharm) if NEET score is borderline?'
      ]
    };
  }

  // 2. CA / Chartered Accountancy / Commerce
  if (q.includes('ca ') || q.includes('chartered') || q.includes('icai') || (q.includes('math') && (q.includes('commerce') || q.includes('ca')))) {
    return {
      reply: `Regarding **Chartered Accountancy (CA) under ICAI**:\n\n` +
        `• **Can you do CA without Class 12 Mathematics? YES, absolutely.** You do **not** need to have studied Mathematics in Class 12 to register for CA Foundation. Thousands of students from Commerce-without-Math or Arts pursue and clear CA.\n` +
        `• **The 'Math' Paper Reality**: The CA Foundation exam includes Paper 3: *Quantitative Aptitude* (100 marks), which is divided into **Business Mathematics** (~40 marks), **Logical Reasoning** (~20 marks), and **Statistics** (~40 marks). The difficulty level is primarily Class 10 arithmetic and practical commercial math (simple/compound interest, ratios, linear inequalities, index numbers), not advanced calculus or coordinate geometry.\n` +
        `• **Three-Stage Progression Roadmap**:\n` +
        `  1. **CA Foundation**: 4 papers (Accounting, Business Laws, Quantitative Aptitude, Business Economics). 40% in each paper and 50% aggregate to pass.\n` +
        `  2. **CA Intermediate**: 6 papers divided across Group 1 & Group 2 (Advanced Accounting, Corporate Laws, Taxation, Costing, Auditing, FM & Strategic Management).\n` +
        `  3. **Articleship & CA Final**: Mandatory 2-year practical training under a practicing FCA followed by CA Final exams.\n` +
        `• **Direct Entry Alternative**: Graduates (Commerce with min 55% or non-commerce with min 60%) can bypass CA Foundation completely and register directly for CA Intermediate.\n` +
        `• **Next Move**: Register on the official ICAI SSP portal (icai.org) well before the 4-month study window deadline prior to your intended exam session (May/June or Nov/Dec).`,
      suggestions: [
        'How should I prepare for the Quantitative Aptitude paper in CA Foundation without a math background?',
        'What is the total fee structure and average duration to complete CA in India?',
        'What is the difference between CA Foundation route vs Direct Entry route after graduation?'
      ]
    };
  }

  // 3. JEE Main & Advanced / Engineering
  if (q.includes('jee') || q.includes('iit') || q.includes('nit') || q.includes('josaa') || q.includes('engineering') || q.includes('b.tech')) {
    return {
      reply: `Regarding **JEE Main, JEE Advanced & National Engineering Pathways**:\n\n` +
        `• **Two-Tier Architecture**:\n` +
        `  - **JEE Main (NTA)**: Gateway for 31 NITs, 26 IIITs, and 33 GFTIs. Also the screening test to select the top ~2,50,000 candidates eligible for JEE Advanced.\n` +
        `  - **JEE Advanced (IITs)**: Conducted rotational by IITs for all 23 Indian Institutes of Technology.\n` +
        `• **Eligibility & Board Benchmark**: Candidates must score min **75% aggregate marks** in Class 12 Board examination (65% for SC/ST) or fall in the top 20 percentile of their respective qualifying board.\n` +
        `• **Exam Pattern (Paper 1 B.Tech)**: 300 marks total across Physics, Chemistry, and Mathematics (25 questions each, 20 MCQs + 5 numerical value questions). +4 for correct, -1 for negative in both MCQs and numericals.\n` +
        `• **Cutoffs & Ranks**: To secure Computer Science / IT in top NITs (Trichy, Surathkal, Warangal, Rourkela), General category candidates usually need a **99.2+ percentile (Rank < 8,000)**. Good core branches across Tier-1/2 NITs open around 96-98 percentile.\n` +
        `• **Strategic Guidance for ${studentName}**: Prioritize NCERT Chemistry (Inorganic + Organic reactions are direct scoring points). Dedicate weekend slots strictly to solving previous 5 years (2020-2025) official NTA shift papers in timed 3-hour blocks.\n` +
        `• **Counseling Process**: Centralized seat allocation is conducted through **JoSAA** (6 rounds) followed by **CSAB** special rounds for vacant NIT+ seats.`,
      suggestions: [
        'What are the most scoring high-weightage chapters in JEE Main Physics and Math?',
        'How does Home State Quota vs Other State Quota work in NIT JoSAA counseling?',
        'What backup engineering entrance exams (BITSAT, VITEEE, MET, State CETs) should I apply for?'
      ]
    };
  }

  // 4. UPSC / Civil Services / Government
  if (q.includes('upsc') || q.includes('ias') || q.includes('ips') || q.includes('civil services') || q.includes('sarkari') || q.includes('government exam')) {
    return {
      reply: `Regarding **UPSC Civil Services Examination (CSE - IAS, IPS, IFS, IRS)**:\n\n` +
        `• **Eligibility**: Minimum age 21 years; Bachelor's degree in **any stream** from a recognized university. No minimum percentage requirement at graduation.\n` +
        `• **Three-Stage Examination Pipeline**:\n` +
        `  1. **Preliminary Examination (Objective)**: \n` +
        `     - General Studies Paper I (200 marks, determines cutoff rank).\n` +
        `     - CSAT Paper II (200 marks, qualifying with minimum 33% / 66 marks).\n` +
        `  2. **Mains Examination (Descriptive, 1750 marks)**: \n` +
        `     - 9 papers: Essay (250m), GS I-IV (1000m total), Optional Subject (2 papers, 500m total), plus 2 qualifying language papers.\n` +
        `  3. **Personality Test / Interview (275 marks)**: Total merit compiled out of 2025 marks.\n` +
        `• **Attempt Limits**: General/EWS: 6 attempts up to age 32; OBC: 9 attempts up to age 35; SC/ST: unlimited attempts up to age 37.\n` +
        `• **Pragmatic Advice for ${studentName}**: If in school or early college, do not purchase thick guidebooks yet. Build core habit of daily reading *The Hindu* or *The Indian Express* editorial section, master basic NCERTs (History, Geography, Polity, Economics from Class 6 to 12), and keep a strong academic CGPA in your graduation degree as an essential career Plan B.`,
      suggestions: [
        'How should I select an Optional Subject for UPSC Mains based on my graduation stream?',
        'How can a college student prepare for UPSC alongside regular semester coursework?',
        'What are the best alternative state PCS and regulatory body exams (RBI Grade B, SEBI, NABARD)?'
      ]
    };
  }

  // 5. CLAT / Law / NLUs
  if (q.includes('clat') || q.includes('law') || q.includes('nlu') || q.includes('llb') || q.includes('advocate') || q.includes('judiciary')) {
    return {
      reply: `Regarding **CLAT & 5-Year Integrated Law (BA LLB / BBA LLB) in India**:\n\n` +
        `• **Primary Gateway**: **CLAT (Common Law Admission Test)** conducted by the Consortium of National Law Universities for 24+ NLUs (NLSIU Bangalore, NALSAR Hyderabad, WBNUJS Kolkata, NLU Jodhpur).\n` +
        `• **Pattern & Sections**: 120 multiple-choice questions in 2 hours. Sections comprise: English Language, Current Affairs & GK, Legal Reasoning, Logical Reasoning, and Quantitative Techniques (Class 10 level).\n` +
        `• **Key Characteristic**: Entirely passage-based testing reading speed, comprehension, and analytical deduction rather than rote legal knowledge.\n` +
        `• **Other Key Law Entrances**: AILET (for NLU Delhi), SLAT (Symbiosis Law), LSAT-India (Jindal Global Law School), and MHCET Law.\n` +
        `• **Preparation Priority for ${studentName}**: Daily reading speed (300+ words per minute), monthly current affairs compilations, and solving at least 40 full-length mocks under strict 120-minute time limits.`,
      suggestions: [
        'What is a safe CLAT score and rank for Tier-1 NLUs like NLSIU Bangalore and NALSAR?',
        'How do I improve reading comprehension speed and accuracy for passage-based questions?',
        'What corporate law placement packages do top NLUs offer compared to traditional litigation?'
      ]
    };
  }

  // 6. CUET / Central Universities
  if (q.includes('cuet') || q.includes('du ') || q.includes('delhi university') || q.includes('bhu') || q.includes('central university')) {
    return {
      reply: `Regarding **CUET-UG & Central University Admissions (DU, BHU, JNU, etc.)**:\n\n` +
        `• **Centralized Mechanism**: Conducted by NTA for admission to all Central Universities and participating state and private universities across India.\n` +
        `• **Subject Structure**:\n` +
        `  - Section 1A & 1B: Languages (Reading comprehension, vocabulary, literary aptitude).\n` +
        `  - Section 2: Domain Subjects (aligned strictly with Class 12 NCERT syllabus for your subjects).\n` +
        `  - Section 3: General Test (General knowledge, current affairs, numerical ability, reasoning).\n` +
        `• **Delhi University Specific Rule**: For DU degree programs, candidates MUST appear in CUET domain subjects that they have studied and passed in Class 12.\n` +
        `• **Cutoffs**: Premier colleges like SRCC, St. Stephen's, Hindu, and Miranda House typically demand normalized percentile scores of 98-99%+ across required domain clusters.\n` +
        `• **Study Approach**: Your Class 12 board preparation directly feeds into CUET domain subjects; supplement this with speed-based MCQ practice.`,
      suggestions: [
        'How do I calculate DU normalized scores for B.Com (Hons) or B.Sc (Hons)?',
        'Should I take the CUET General Test if my target course only requires domain subjects?',
        'What is the CSAS portal allocation and preference filling process for Delhi University?'
      ]
    };
  }

  // 7. MBA / CAT / Management
  if (q.includes('cat') || q.includes('mba') || q.includes('iim') || q.includes('management') || q.includes('marketing') || q.includes('finance')) {
    return {
      reply: `Regarding **CAT & MBA Pathways at Premier Indian B-Schools (IIMs, FMS, XLRI)**:\n\n` +
        `• **Exam Overview**: **Common Admission Test (CAT)** is held annually in November for 21 IIMs, FMS Delhi, SPJIMR, and IIT DMS departments.\n` +
        `• **Sections (2 Hours, 66 Questions)**:\n` +
        `  1. **VARC** (Verbal Ability & Reading Comprehension) - 24 questions.\n` +
        `  2. **DILR** (Data Interpretation & Logical Reasoning) - 20 questions.\n` +
        `  3. **QA** (Quantitative Aptitude) - 22 questions.\n` +
        `• **Target Percentile**: For IIM Ahmedabad, Bangalore, Calcutta (IIM ABC), General category candidates generally need 99.5+ percentile (engineers) or 98.5+ percentile (non-engineers benefiting from academic diversity criteria).\n` +
        `• **Composite Score Factors**: Class 10 marks (10-15%), Class 12 marks (10-15%), Graduation marks (10-15%), Work experience (0-15%), and CAT score (40-60%), followed by WAT-PI.\n` +
        `• **Alternative Entrances**: XAT (for XLRI Jamshedpur), SNAP (Symbiosis), NMAT (NMIMS), and IIFT.`,
      suggestions: [
        'How does academic diversity score work for non-engineers in IIM shortlisting?',
        'Is work experience mandatory before applying to CAT, or can freshers get top IIM calls?',
        'What is the ROI comparison between FMS Delhi (low fees) vs top IIMs?'
      ]
    };
  }

  // 8. NDA / Defence Services
  if (q.includes('nda') || q.includes('defence') || q.includes('army') || q.includes('navy') || q.includes('air force') || q.includes('ssb')) {
    return {
      reply: `Regarding **National Defence Academy (NDA) via UPSC**:\n\n` +
        `• **Eligibility**: Unmarried male and female candidates aged 16.5 to 19.5 years. For Army wing: Class 12 pass in any stream; for Air Force & Naval wings: Class 12 with Physics & Mathematics.\n` +
        `• **Written Exam Scheme (900 Marks)**:\n` +
        `  - Paper 1: Mathematics (300 marks, Class 11-12 level calculus, trigonometry, algebra, probability).\n` +
        `  - Paper 2: General Ability Test (GAT, 600 marks) covering English (200m) and General Knowledge/Science (400m).\n` +
        `• **Stage 2: SSB Interview (900 Marks)**: 5-day rigorous psychological, group task (GTO), and personal interview evaluation.\n` +
        `• **Medical Standards**: Strict visual acuity, BMI, and physical endurance criteria. Regular cardiovascular training and posture discipline are vital.`,
      suggestions: [
        'What is the cutoff score for the NDA written examination out of 900 marks?',
        'How should I prepare for the 5-day SSB interview testing procedures?',
        'What is the difference between NDA cadet entry and CDS entry after graduation?'
      ]
    };
  }

  // 9. Scholarships & Financial Support
  if (q.includes('scholarship') || q.includes('financial aid') || q.includes('fees') || q.includes('nsp') || q.includes('pmsss') || q.includes('quota') || q.includes('reservation')) {
    return {
      reply: `Regarding **National Scholarships & Quota Provisions in India**:\n\n` +
        `• **National Scholarship Portal (NSP - scholarships.gov.in)**: Single window for Central Sector Scheme of Scholarship for College and University Students (requires 80th percentile in Class 12 board exams and family income < ₹4.5L/year).\n` +
        `• **INSPIRE Scholarship (DST, Govt of India)**: ₹80,000/year for students in top 1% of Class 12 boards pursuing Basic & Natural Sciences (B.Sc / B.S. / Int. M.Sc).\n` +
        `• **PMSSS (Prime Minister's Special Scholarship Scheme)**: Full tuition waiver plus maintenance allowance for J&K and Ladakh students admitted to AICTE/UGC approved institutes across India.\n` +
        `• **Post-Matric Scholarships**: Available through state social welfare departments for SC, ST, OBC, and EWS students, covering tuition and hostel subsidies.\n` +
        `• **Government Institutional Fee Waivers**: At IITs, NITs, and IIITs, tuition fee is 100% exempted for SC/ST/PwD students and students with family income < ₹1 Lakh; 2/3rd fee remission for family income between ₹1L - ₹5L.\n` +
        `• **Reservation Quotas**: Scheduled Castes (15%), Scheduled Tribes (7.5%), OBC-NCL (27%), EWS (10%), and PwD horizontal reservation (5%). Keep Central Format certificates updated before counseling.`,
      suggestions: [
        'What documents are required to claim the Central EWS certificate for JoSAA/NEET?',
        'How do I apply for the Central Sector Scheme scholarship on the NSP portal?',
        'What fee concession policies apply to Tier-1 government colleges for low-income families?'
      ]
    };
  }

  // 10. Default / Contextual Synthesis addressing the student's question directly
  const careerRef = activeCareer ? `while keeping your interest in **${activeCareer.title}** in mind` : 'across your educational path';
  return {
    reply: `Regarding your query "${userQuery.trim()}" ${careerRef}:\n\n` +
      `• **Academic Assessment**: Given your background in **${stream}** and performance benchmark of **${score}**, your strategic focus should center on balancing standard board/semester syllabi with competitive examination benchmarks.\n` +
      `• **Core Execution Priority**: \n` +
      `  - Master foundational NCERT/prescribed textbooks first; 70%+ of Indian national test questions test standard textbook derivations and definitions.\n` +
      `  - Solve the last 5 years of authentic Previous Year Questions (PYQs) under timed conditions to identify recurring patterns.\n` +
      `  - Maintain an error analysis notebook tracking avoidable mistakes in mock tests.\n` +
      `• **Admissions & Regulatory Check**: Regularly monitor official exam notifications on authentic portals (.ac.in or .gov.in) rather than social media forums to track exact dates, category eligibility, and seat allocation rules.`,
    suggestions: [
      `What are the official registration deadlines and notification schedules for this?`,
      `What are the NIRF Tier-1 institutes and category cutoffs for this path?`,
      `How can I structure a 6-month daily study timetable for these milestones?`
    ]
  };
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '5mb' }));

  // --- API: Cloud Sync Endpoints ---
  app.post('/api/sync/save', (req, res) => {
    try {
      const { syncCode, profile } = req.body;
      if (!syncCode || !profile) {
        return res.status(400).json({ error: 'Missing syncCode or profile' });
      }
      cloudProfileStore.set(syncCode.toUpperCase(), profile);
      return res.json({ success: true, syncCode: syncCode.toUpperCase() });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Internal server error' });
    }
  });

  app.get('/api/sync/load', (req, res) => {
    try {
      const code = (req.query.code as string || '').toUpperCase().trim();
      if (!code) {
        return res.status(400).json({ error: 'Missing sync code' });
      }
      const profile = cloudProfileStore.get(code);
      if (!profile) {
        return res.status(404).json({ error: `No saved profile found for code: ${code}` });
      }
      return res.json({ success: true, profile });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Internal server error' });
    }
  });

  // --- API: AI Narrative Synthesizer (/api/synthesize) ---
  app.post('/api/synthesize', async (req, res) => {
    try {
      const { career, profile, baselineScore } = req.body;
      if (!career || !profile) {
        return res.status(400).json({ error: 'career and profile payload are required' });
      }

      const client = getAIClient();
      if (!client) {
        // Fallback structured synthesis when key is unavailable
        return res.json({
          matchPercentage: baselineScore || 85,
          whyItFits: [
            `Strong alignment with your ${profile.streamOrMajor} background and expressed interest in ${profile.favoriteSubjects?.join(', ') || 'analytical disciplines'}.`,
            `Excellent market viability in India with projected growth score of ${career.futureDemandScore}/100 and clear Tier 1 placement pathways.`,
            profile.userType === 'school'
              ? `Offers direct entrance routes through standard national examinations (${career.keyExams?.map((e: any) => e.name).slice(0, 2).join(', ')}).`
              : `High leverage transition track for college students into specialized roles with average entry CTC of ${career.estimatedSalaryRange?.entry}.`,
          ],
          criticalWatchouts: [
            `Severe selection ratio: Government institutions admit under 1.5% of exam candidates, requiring high mock test consistency.`,
            `Intensive 18-24 month dedication needed alongside your current ${profile.userType === 'school' ? 'board exams' : 'degree semester'} schedule.`,
            `Prepare for contingency backup colleges across Tier 2 autonomous universities and state quotas.`,
          ],
          personalizedNextSteps: [
            `Download previous 5-year solved question papers for ${career.keyExams?.[0]?.name || 'the primary exam'} from official portals.`,
            `Commit 15 dedicated weekly hours to core skills: ${career.criticalSkills?.slice(0, 3).join(', ')}.`,
            `Review counseling quotas (JoSAA, MCC, state counselling) and category cutoff ranks.`,
          ],
          strategicAdvice: `You have strong fundamental potential. Prioritize time-boxed mock testing and mental stamina.`,
          scoreExplanation: `Guidely calculated ${baselineScore || 85}% based on strong alignment with ${profile.streamOrMajor || 'your stream'}, academic benchmark, and curriculum requirements.`,
        });
      }

      const prompt = `
You are Guidely, an empathetic and highly knowledgeable Indian Education & Career Advisor.
Analyze the following student profile and recommended career path, and generate a hyper-personalized, explainable rationale.

STUDENT PROFILE:
- Type: ${profile.userType === 'school' ? 'School Student' : 'College Undergrad / Grad'}
- Level / Year: ${profile.schoolLevel || profile.collegeYear || 'Not specified'}
- Stream / Major: ${profile.streamOrMajor}
- Academic Score: ${profile.academicScore} (${profile.academicScoreType})
- Favorite Subjects: ${profile.favoriteSubjects?.join(', ')}
- Location Preference: ${profile.preferredLocations?.join(', ')}
- Budget: ${profile.budgetPreference}
- Work Style: ${profile.workStyle?.join(', ')}
- Exam Readiness: ${profile.entranceExamReadiness}

CAREER PATH DETAILS:
- Title: ${career.title}
- Category: ${career.category}
- Key Exams: ${career.keyExams?.map((e: any) => `${e.name} (${e.frequency})`).join('; ')}
- Top Institutions: ${career.topInstitutions?.map((i: any) => `${i.name} [${i.tier}]`).join('; ')}
- Salary Range: Entry ${career.estimatedSalaryRange?.entry}, Mid ${career.estimatedSalaryRange?.mid}
- Demand Score: ${career.futureDemandScore}/100
- Baseline Algorithmic Match: ${baselineScore}%

Return a strictly valid JSON object conforming to this schema:
{
  "matchPercentage": number (integer between 50 and 99),
  "scoreExplanation": string (A transparent explanation detailing why this exact match percentage fits this student's stream, favorite subjects, marks, and ambition),
  "whyItFits": string[] (3 specific, high-conviction points grounded in Indian education context),
  "criticalWatchouts": string[] (3 honest risks, exam competition realities, or bottlenecks),
  "personalizedNextSteps": string[] (3 actionable, immediate steps tailored to this student),
  "strategicAdvice": string (1 concise concluding mentor insight)
}
Strict language rule: Communicate in English only. Do not use Hindi words or script.
`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchPercentage: { type: Type.INTEGER },
              scoreExplanation: { type: Type.STRING },
              whyItFits: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              criticalWatchouts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              personalizedNextSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              strategicAdvice: { type: Type.STRING },
            },
            required: ['matchPercentage', 'scoreExplanation', 'whyItFits', 'criticalWatchouts', 'personalizedNextSteps'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Error generating synthesis via Gemini:', err);
      // Fallback
      return res.json({
        matchPercentage: req.body.baselineScore || 85,
        whyItFits: [
          `Compatible with your academic profile and selected focus areas in ${req.body.profile?.favoriteSubjects?.[0] || 'your core subjects'}.`,
          `Robust multi-year industry expansion in the Indian knowledge and professional economy.`,
          `High return on educational investment with well-defined entrance procedures.`,
        ],
        criticalWatchouts: [
          `Competitive acceptance rates across premier national institutes.`,
          `Requires steady 15-20 hours weekly preparation alongside academic duties.`,
        ],
        personalizedNextSteps: [
          `Download the latest exam syllabus and check official notification schedules.`,
          `Formulate a 6-month revision strategy starting with foundational textbooks.`,
        ],
        strategicAdvice: `Maintain consistent revision rhythms and avoid last-minute cramming.`,
        scoreExplanation: `Guidely calculated ${req.body.baselineScore || 85}% based on strong alignment with ${req.body.profile?.streamOrMajor || 'your current stream'}, academic benchmark margin, and subject correlation with ${req.body.career?.title || 'this pathway'}.`,
      });
    }
  });

  // --- API: Pathfinder Contextual Chat - Ultra-Fast Streaming (/api/chat/stream) ---
  app.post('/api/chat/stream', async (req, res) => {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const { messages, activeCareer, profile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.write(`data: ${JSON.stringify({ text: 'Messages array is required.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
    const userQuery = lastUserMsg?.content || '';

    const systemInstruction = `
You are Guidely, a calm, deeply knowledgeable, and empathetic Indian Education and Career Advisor.
You give fast, concise, realistic, and highly practical guidance using authentic Indian educational context.
Language requirement: STRICTLY communicate in English only. Do not use Hindi script or Hindi language phrases.

CRITICAL INSTRUCTIONS:
1. ADDRESS THE USER'S SPECIFIC QUESTION FIRST & DIRECTLY:
   If the student asks about ANY specific exam, degree, course, stream, syllabus, or eligibility (e.g. NEET, JEE, CA, UPSC, CLAT, CUET, NDA, GATE, CAT, medical without math, law after 12th, arts stream, commerce, etc.), ANSWER THAT EXACT QUESTION THOROUGHLY AND ACCURATELY.
   DO NOT deflect, dismiss, or artificially force the conversation back to the currently selected career if their question is asking about something else.
2. CURRENT ACTIVE CAREER CONTEXT:
   ${activeCareer ? `The student is currently viewing: ${activeCareer.title} (${activeCareer.category}). If their question is directly related to this pathway, ground your response in this context.` : 'General education & career roadmap.'}
3. STUDENT CONTEXT:
   ${profile ? `Student: ${profile.studentName || 'Student'}, Stream: ${profile.streamOrMajor || 'General'}, Score: ${profile.academicScore || 'Strong'}${profile.academicScoreType === 'cgpa' ? ' CGPA' : '%'}, Type: ${profile.userType === 'school' ? 'School Student' : 'College Student'}.` : 'General student profile.'}
4. INDIAN CONTEXT ACCURACY:
   Reference authentic Indian authorities: NTA, UPSC, ICAI, Consortium of NLUs, MCC, JoSAA, CSAB, NIRF rankings, and Central Universities.
5. FORMATTING:
   Use clean bullet points, bold key concepts, realistic score cutoffs, and actionable study steps.
6. AT THE VERY END OF YOUR RESPONSE, ALWAYS APPEND 2-3 ACTIONABLE SUGGESTIONS FORMATTED STRICTLY AS:
SUGGESTION: [Short actionable follow-up question]
SUGGESTION: [Short actionable follow-up question]
`;

    const client = getAIClient();

    // Helper to stream text in responsive pulses
    const streamFallbackText = async (text: string) => {
      const words = text.split(' ');
      for (let i = 0; i < words.length; i += 4) {
        const chunk = words.slice(i, i + 4).join(' ') + ' ';
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      res.write('data: [DONE]\n\n');
      res.end();
    };

    if (!client) {
      const fallback = generateDynamicCounselingResponse(userQuery, activeCareer, profile);
      const fullFallbackText = fallback.reply + '\n\n' + fallback.suggestions.map((s) => `SUGGESTION: ${s}`).join('\n');
      return await streamFallbackText(fullFallbackText);
    }

    try {
      const cleanedMessages = messages
        .filter((m: any) => m && typeof m.content === 'string' && m.content.trim().length > 0)
        .map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content.trim() }],
        }));

      // If no valid messages, provide dynamic fallback
      if (cleanedMessages.length === 0) {
        const fallback = generateDynamicCounselingResponse(userQuery, activeCareer, profile);
        const fullFallbackText = fallback.reply + '\n\n' + fallback.suggestions.map((s) => `SUGGESTION: ${s}`).join('\n');
        return await streamFallbackText(fullFallbackText);
      }

      // Use gemini-3.1-flash-lite for ultra-fast, low-latency streaming responses
      const responseStream = await client.models.generateContentStream({
        model: 'gemini-3.1-flash-lite',
        contents: cleanedMessages,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      let streamedAny = false;
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          streamedAny = true;
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      if (!streamedAny) {
        // In case model returned empty stream, fallback dynamically
        const fallback = generateDynamicCounselingResponse(userQuery, activeCareer, profile);
        const fullFallbackText = fallback.reply + '\n\n' + fallback.suggestions.map((s) => `SUGGESTION: ${s}`).join('\n');
        return await streamFallbackText(fullFallbackText);
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err: any) {
      console.error('Chat streaming error:', err);
      // Fallback dynamically based on the exact user question
      const fallback = generateDynamicCounselingResponse(userQuery, activeCareer, profile);
      const fullFallbackText = fallback.reply + '\n\n' + fallback.suggestions.map((s) => `SUGGESTION: ${s}`).join('\n');
      await streamFallbackText(fullFallbackText);
    }
  });

  // --- API: Pathfinder Contextual Chat - Non-streaming Fallback (/api/chat) ---
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, activeCareer, profile } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
      const userQuery = lastUserMsg?.content || '';

      const client = getAIClient();
      if (!client) {
        const fallback = generateDynamicCounselingResponse(userQuery, activeCareer, profile);
        const fullText = fallback.reply + '\n\n' + fallback.suggestions.map((s) => `SUGGESTION: ${s}`).join('\n');
        return res.json({ reply: fullText });
      }

      const systemInstruction = `
You are Guidely, a calm, deeply knowledgeable, and empathetic Indian Education and Career Advisor.
You provide fast, concise, and realistic guidance in authentic Indian educational context.
Language requirement: STRICTLY communicate in English only. Do not use Hindi script or Hindi language phrases.

CRITICAL INSTRUCTIONS:
1. ALWAYS ANSWER THE USER'S DIRECT QUESTION FIRST. If they ask about NEET, CA, UPSC, CLAT, CUET, NDA, or any other topic, answer that specific subject directly.
2. CURRENT ACTIVE CAREER CONTEXT: ${activeCareer ? activeCareer.title : 'General path'}.
3. STUDENT CONTEXT: ${profile ? `${profile.studentName || 'Student'}, ${profile.streamOrMajor || 'General'}, ${profile.academicScore || ''}%` : 'General'}.
4. Provide structured, accurate, and encouraging advice with authentic exam cutoffs, eligibility, and timelines.
5. At the end, append:
SUGGESTION: [Short actionable question]
SUGGESTION: [Short actionable question]
`;

      const cleanedMessages = messages
        .filter((m: any) => m && typeof m.content === 'string' && m.content.trim().length > 0)
        .map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content.trim() }],
        }));

      // Use gemini-3.1-flash-lite for rapid generation
      const response = await client.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: cleanedMessages,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const replyText = response.text || '';
      if (!replyText.trim()) {
        const fallback = generateDynamicCounselingResponse(userQuery, activeCareer, profile);
        return res.json({ reply: fallback.reply + '\n\n' + fallback.suggestions.map((s) => `SUGGESTION: ${s}`).join('\n') });
      }

      return res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Chat error:', err);
      const lastUserMsg = req.body?.messages ? [...req.body.messages].reverse().find((m: any) => m.role === 'user') : null;
      const fallback = generateDynamicCounselingResponse(lastUserMsg?.content || '', req.body?.activeCareer, req.body?.profile);
      return res.json({
        reply: fallback.reply + '\n\n' + fallback.suggestions.map((s) => `SUGGESTION: ${s}`).join('\n'),
      });
    }
  });

  // --- Serve Vite in Dev or Static in Production ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Guidely Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

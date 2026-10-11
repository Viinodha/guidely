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
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
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

      if (!aiClient) {
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
        });
      }

      const prompt = `
You are Guidley, an empathetic and highly knowledgeable Indian Education & Career Advisor.
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

      const response = await aiClient.models.generateContent({
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
        scoreExplanation: `Guidley calculated ${req.body.baselineScore || 85}% based on strong alignment with ${req.body.profile?.streamOrMajor || 'your current stream'}, academic benchmark margin, and subject correlation with ${req.body.career?.title || 'this pathway'}.`,
      });
    }
  });

  // --- API: Pathfinder Contextual Chat - Ultra-Fast Streaming (/api/chat/stream) ---
  app.post('/api/chat/stream', async (req, res) => {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { messages, activeCareer, profile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.write(`data: ${JSON.stringify({ text: 'Messages array is required.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const systemInstruction = `
You are Guidley, a calm, deeply knowledgeable, and empathetic Indian Education and Career Advisor.
You give fast, concise, realistic, and highly practical guidance using authentic Indian educational context.
Language requirement: STRICTLY communicate in English only. Do not use Hindi script or Hindi language phrases.
Reference Indian concepts accurately:
- Boards & Streams: CBSE, ICSE, State Boards, 10+2 Science (PCM/PCB), Commerce, Humanities.
- Entrance Exams: JEE Main/Advanced, NEET-UG/PG, CUET, CLAT, CAT, GATE, UPSC CSE, NID, UCEED, NATA, CA Foundation/Inter.
- Institutions: IITs, NITs, IIITs, AIIMS, IIMs, NLUs, Central Universities (DU, JNU, BHU), NIRF rankings.
- Admissions & Counseling: JoSAA, CSAB, MCC, state counselling quotas, category seat allocations (General, EWS, OBC-NCL, SC, ST), scholarships (NSP, PMSSS, state post-matric, INSPIRE).
- Target audience: ${profile?.userType === 'school' ? 'School student (Class 9-12)' : 'College student / Recent graduate'}.

CURRENT ACTIVE CAREER CONTEXT:
${activeCareer ? JSON.stringify(activeCareer, null, 2) : 'General career guidance'}

STUDENT CONTEXT:
${profile ? JSON.stringify(profile, null, 2) : 'General profile'}

RULES FOR SPEED & VALUE:
1. Provide quick, clear answers without excessive pleasantries.
2. Structure answers with clean bullet points, bold key terms, and explicit actionable takeaways.
3. Always include realistic cutoffs, timelines, or resources.
4. Strictly English only.
5. At the very end of your response, ALWAYS append exactly 2 or 3 quick follow-up questions formatted as:
SUGGESTION: [Short actionable question]
SUGGESTION: [Short actionable question]
`;

    if (!aiClient) {
      const fallbackReply = `Regarding **${activeCareer?.title || 'your chosen pathway'}**:\n\n` +
        `• **Admissions & Exams**: Key gateway is ${activeCareer?.keyExams?.[0]?.name || 'the primary national entrance exam'} with competitive testing cycles.\n` +
        `• **Your Profile Fit**: With your background in **${profile?.streamOrMajor || 'your stream'}** and ${profile?.academicScore || 'strong'}${profile?.academicScoreType === 'cgpa' ? ' CGPA' : '%'}, focus your immediate study sprint on standard NCERT/foundational textbooks and solving at least 5 years of Previous Year Questions (PYQs).\n` +
        `• **Immediate Action**: Download the official information brochure and begin weekly timed mock tests.\n\n` +
        `SUGGESTION: What are the exact category cutoffs and seat quotas?\n` +
        `SUGGESTION: What scholarships (like NSP or PMSSS) apply here?\n` +
        `SUGGESTION: What is the best Plan B if I miss the top cutoff?`;

      // Stream fallback in quick chunks
      const words = fallbackReply.split(' ');
      for (let i = 0; i < words.length; i += 3) {
        const slice = words.slice(i, i + 3).join(' ') + ' ';
        res.write(`data: ${JSON.stringify({ text: slice })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    try {
      const formattedContents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      // Use gemini-3.1-flash-lite for ultra-fast, low-latency streaming responses
      const responseStream = await aiClient.models.generateContentStream({
        model: 'gemini-3.1-flash-lite',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err: any) {
      console.error('Chat streaming error:', err);
      res.write(`data: ${JSON.stringify({ text: `\n\n[Guidley Advisor]: In the Indian admissions landscape, consistency in weekly mock tests and thorough analysis of previous year questions (PYQs) are your highest leverage activities. Feel free to ask about cutoffs, syllabus, or preparation routines.\n\nSUGGESTION: What is the official exam timeline?\nSUGGESTION: What are the top Tier 1 institutes for this track?` })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  });

  // --- API: Pathfinder Contextual Chat - Non-streaming Fallback (/api/chat) ---
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, activeCareer, profile } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      if (!aiClient) {
        return res.json({
          reply: `Regarding **${activeCareer?.title || 'your chosen pathway'}**:\n\n• **Admissions & Exams**: Key gateway is ${activeCareer?.keyExams?.[0]?.name || 'the primary entrance exam'}.\n• **Your Profile Fit**: Given your background in **${profile?.streamOrMajor || 'your stream'}** (${profile?.academicScore || 'strong'}${profile?.academicScoreType === 'cgpa' ? ' CGPA' : '%'}), your highest ROI activity is mastering foundational textbooks and solving 5 years of PYQs.\n\nSUGGESTION: What are the category cutoffs and seat quotas?\nSUGGESTION: What scholarships apply to this program?`,
        });
      }

      const systemInstruction = `
You are Guidley, a calm, deeply knowledgeable, and empathetic Indian Education and Career Advisor.
You provide fast, concise, and realistic guidance in authentic Indian educational context.
Language requirement: STRICTLY communicate in English only. Do not use Hindi script or Hindi language phrases.
Reference Indian concepts accurately:
- Boards & Streams: CBSE, ICSE, State Boards, 10+2 Science (PCM/PCB), Commerce, Humanities.
- Entrance Exams: JEE Main/Advanced, NEET-UG/PG, CUET, CLAT, CAT, GATE, UPSC CSE, NID, UCEED, NATA, CA Foundation/Inter.
- Institutions: IITs, NITs, IIITs, AIIMS, IIMs, NLUs, Central Universities (DU, JNU, BHU), NIRF rankings.
- Admissions & Counseling: JoSAA, CSAB, MCC, state counselling quotas, category seat allocations, scholarships.
- Target audience: ${profile?.userType === 'school' ? 'School student (Class 9-12)' : 'College student / Recent graduate'}.

CURRENT ACTIVE CAREER CONTEXT:
${activeCareer ? JSON.stringify(activeCareer, null, 2) : 'General career guidance'}

STUDENT CONTEXT:
${profile ? JSON.stringify(profile, null, 2) : 'General profile'}

RULES:
1. Provide quick, clear answers without excessive pleasantries.
2. Structure answers with clean bullet points and clear takeaways.
3. Keep answers concise, actionable, and warm.
4. Strictly English only.
5. At the very end, append:
SUGGESTION: [Short actionable question]
SUGGESTION: [Short actionable question]
`;

      const formattedContents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      // Use gemini-3.1-flash-lite for rapid generation
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      return res.json({ reply: response.text || 'I am ready to help you navigate your educational roadmap.' });
    } catch (err: any) {
      console.error('Chat error:', err);
      return res.json({
        reply: `I understand your question about ${req.body.activeCareer?.title || 'this career path'}. In the Indian admissions landscape, consistency in mock tests and deep understanding of official syllabus requirements are your highest priorities.\n\nSUGGESTION: What are the key entrance exam dates?\nSUGGESTION: What are the NIRF Tier 1 colleges for this?`,
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
    console.log(`Guidley Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

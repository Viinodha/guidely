/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlacementResourceKit, HigherEducationKit } from '../types/student';
import { CAREER_PLACEMENT_KITS, CAREER_HIGHER_ED_KITS } from './placementResources';

export interface ExamDetail {
  name: string;
  fullForm: string;
  frequency: string;
  difficulty: 'Moderate' | 'High' | 'Very High';
  timeline: string;
  officialPortal: string;
}

export interface InstitutionDetail {
  name: string;
  location: string;
  type: 'Central / IIT / NIT / AIIMS' | 'State University' | 'Premier Autonomous' | 'Top Private';
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
}

export interface RoadmapMilestone {
  stage: 'immediate' | '6-month' | '2-year';
  title: string;
  description: string;
  actions: string[];
  recommendedResources: string[];
}

export interface CollegeRoadmap {
  placements: RoadmapMilestone[]; // Direct campus hiring & corporate roles
  higherEducation: RoadmapMilestone[]; // GATE, CAT, GRE, Masters research
}

export interface CareerPath {
  id: string;
  title: string;
  category: 'Engineering & Technology' | 'Healthcare & Allied Sciences' | 'Commerce, Finance & CA' | 'Law, Humanities & Civil Services' | 'Design, Media & Architecture' | 'Vocational & Emerging Skills';
  targetAudience: 'both' | 'school' | 'college';
  description: string;
  eligibilityRequirements: {
    minimumPercentage: number;
    streamConstraints: ('PCM' | 'PCB' | 'PCMB' | 'Commerce' | 'Arts' | 'Any')[];
    collegePrerequisites?: string[];
    notes: string;
  };
  keyExams: ExamDetail[];
  topInstitutions: InstitutionDetail[];
  estimatedSalaryRange: {
    entry: string; // e.g. "INR 6 - 12 LPA"
    mid: string;   // e.g. "INR 14 - 26 LPA"
    senior: string; // e.g. "INR 35+ LPA"
  };
  roiIndicator: {
    investmentRating: 'Exceptional ROI' | 'High ROI' | 'Steady Long-term' | 'Prestige & Security';
    estimatedEducationCost: string;
    breakEvenPeriod: string;
  };
  roadmapMilestones: RoadmapMilestone[]; // Standard school / foundational roadmap
  collegeRoadmap?: CollegeRoadmap; // Dedicated college student roadmap
  placementPreparationKit?: PlacementResourceKit;
  higherEducationKit?: HigherEducationKit;
  futureDemandScore: number; // 0 - 100
  workStyleTags: string[];
  budgetFit: 'Government Subsidized (< ₹2.5L)' | 'Moderate (₹3L - ₹10L)' | 'Premium (₹10L - ₹25L+)';
  preferredLocations: ('Tier 1 Metro' | 'Tier 2 Emerging' | 'Pan-India / State Hubs' | 'Remote / Hybrid')[];
  criticalSkills: string[];
}

const BASE_CAREER_DATABASE: CareerPath[] = [
  {
    id: 'ai-software-engineering',
    title: 'Software Systems & AI Engineering',
    category: 'Engineering & Technology',
    targetAudience: 'both',
    description: 'Design and deploy scalable intelligent software systems, cloud distributed microservices, and modern ML/LLM pipelines powering technology companies and global engineering teams.',
    eligibilityRequirements: {
      minimumPercentage: 60,
      streamConstraints: ['PCM', 'PCMB'],
      collegePrerequisites: ['B.Tech / BCA / B.Sc Computer Science / B.Sc IT'],
      notes: 'Requires 10+2 with Physics and Mathematics. For college students: Computer Science, IT, or strong software engineering fundamentals.',
    },
    keyExams: [
      {
        name: 'JEE Main & Advanced',
        fullForm: 'Joint Entrance Examination',
        frequency: 'JEE Main: Twice a year (Jan & Apr); Advanced: Once (May/June)',
        difficulty: 'Very High',
        timeline: 'Class 12th Board year / Drop year',
        officialPortal: 'jeemain.nta.nic.in',
      },
      {
        name: 'GATE (CS/IT)',
        fullForm: 'Graduate Aptitude Test in Engineering',
        frequency: 'Annually in February',
        difficulty: 'Very High',
        timeline: 'Pre-final or final year of B.Tech',
        officialPortal: 'gate.iisc.ac.in',
      },
      {
        name: 'BITSAT / State CETs',
        fullForm: 'Birla Institute & State Common Entrance Tests (MHT CET, KCET, WBJEE)',
        frequency: 'Annual (May - June)',
        difficulty: 'High',
        timeline: 'Class 12th completion',
        officialPortal: 'bitsadmission.com',
      },
    ],
    topInstitutions: [
      { name: 'IIT Madras / IIT Bombay / IIT Delhi', location: 'Chennai / Mumbai / Delhi', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'IIIT Hyderabad & IIIT Bangalore', location: 'Hyderabad / Bengaluru', type: 'Premier Autonomous', tier: 'Tier 1' },
      { name: 'NIT Trichy / NIT Surathkal / NIT Warangal', location: 'Trichy / Surathkal / Warangal', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'BITS Pilani', location: 'Pilani / Goa / Hyderabad', type: 'Top Private', tier: 'Tier 1' },
    ],
    estimatedSalaryRange: {
      entry: '₹8 - ₹20 LPA',
      mid: '₹22 - ₹45 LPA',
      senior: '₹60 - ₹1.2+ Cr PA',
    },
    roiIndicator: {
      investmentRating: 'Exceptional ROI',
      estimatedEducationCost: '₹4.5L - ₹14L (Govt / NIT) to ₹22L (Private)',
      breakEvenPeriod: '1.5 to 2.5 Years post-graduation',
    },
    roadmapMilestones: [
      {
        stage: 'immediate',
        title: 'Foundations & Algorithmic Problem Solving',
        description: 'Master Class 11-12 NCERT Mathematics, Calculus, and Coordinate Geometry alongside Physics Mechanics.',
        actions: [
          'Target 99+ percentile in JEE Main Mathematics & Physics mock tests',
          'Solve 15 years of JEE Main chapter-wise previous year questions (PYQs)',
          'Learn basic Python / C++ syntax for algorithmic reasoning',
        ],
        recommendedResources: ['NCERT Mathematics 11-12', 'NeetCode 150', 'CS50x Harvard'],
      },
      {
        stage: '6-month',
        title: 'Systems & Practical Projects',
        description: 'Complete board preparation and full-length JEE Main / BITSAT mock simulations.',
        actions: [
          'Take 2 full 3-hour timed mocks every week with negative marking analysis',
          'Build an interactive web project using TypeScript or Python',
          'Compete in Hackathons or algorithmic coding contests',
        ],
        recommendedResources: ['JEE Main Official Portal', 'System Design Primer'],
      },
      {
        stage: '2-year',
        title: 'Undergraduate Admission & Placement Launch',
        description: 'Secure admission in Tier 1 NIT/IIT/IIIT through JoSAA counseling and begin core CS coursework.',
        actions: [
          'Participate in JoSAA seat allocation with branch priority optimization',
          'Establish a verified GitHub portfolio with deployed projects',
          'Prepare for first-year competitive programming contests',
        ],
        recommendedResources: ['JoSAA Portal (josaa.nic.in)', 'LeetCode Practice'],
      },
    ],
    collegeRoadmap: {
      placements: [
        {
          stage: 'immediate',
          title: 'ATS Resume Architecture & Core DSA Sprint',
          description: 'Build a single-page LaTeX resume passing industry ATS filters and complete 150 essential LeetCode algorithmic patterns.',
          actions: [
            'Solve NeetCode 150 (Arrays, Two Pointers, Trees, Graphs, Dynamic Programming)',
            'Format single-page ATS-compliant resume with quantifiable metrics (e.g., improved latency by 35%)',
            'Deploy 2 production-grade fullstack web applications with authentication and database schemas',
          ],
          recommendedResources: ['NeetCode 150', 'Jake Resume LaTeX Template', 'Overleaf'],
        },
        {
          stage: '6-month',
          title: 'Mock Technical Rounds & Referral Outreach',
          description: 'Simulate live system design and coding interviews with peers while securing employee referrals on LinkedIn.',
          actions: [
            'Conduct 10+ live peer mock interviews on Pramp / Interviewing.io',
            'Connect with 50+ alumni software engineers on LinkedIn for off-campus job referrals',
            'Master relational database indexing (PostgreSQL), Docker, and REST API architecture',
          ],
          recommendedResources: ['Pramp Free Mock Interviews', 'System Design Primer', 'LinkedIn InMail Templates'],
        },
        {
          stage: '2-year',
          title: 'Full-Time Conversion & Salary Negotiation',
          description: 'Convert summer internship into pre-placement offer (PPO) and negotiate starting compensation packages.',
          actions: [
            'Deliver high-impact features during 6-month product engineering internship',
            'Prepare behavioral answers using STAR method (Situation, Task, Action, Result)',
            'Evaluate multiple offers comparing base CTC, ESOP vesting, and signing bonuses',
          ],
          recommendedResources: ['Levels.fyi India Compensation', 'Cracking the Coding Interview'],
        },
      ],
      higherEducation: [
        {
          stage: 'immediate',
          title: 'GATE CS/IT Syllabus & Discrete Mathematics',
          description: 'Cover standard engineering textbooks for Discrete Mathematics, Algorithms, and Theory of Computation.',
          actions: [
            'Study NPTEL lectures for Algorithms, Operating Systems, and Database Management',
            'Solve 10 years of GATE CS topic-wise previous year questions (PYQs)',
            'Draft research statement of purpose (SOP) focusing on Systems or Machine Learning',
          ],
          recommendedResources: ['GATE Overflow PYQ Bank', 'NPTEL Computer Science Courses'],
        },
        {
          stage: '6-month',
          title: 'Full-Length Proctored Mocks & GRE/TOEFL Prep',
          description: 'Attempt 20+ full-length GATE mock tests and take GRE if targeting global MS in Computer Science.',
          actions: [
            'Score in top 1 percentile across national test series (Made Easy / ACE)',
            'Take GRE General Test (target 320+) and TOEFL/IELTS for global applications',
            'Publish undergraduate paper or co-author technical whitepaper with faculty',
          ],
          recommendedResources: ['GATE Made Easy Test Series', 'ETS Official GRE Guide'],
        },
        {
          stage: '2-year',
          title: 'IISc / IIT M.Tech Admissions & Research Fellowships',
          description: 'Clear COAP (Common Offer Acceptance Portal) counseling and join premier research labs.',
          actions: [
            'Participate in COAP counseling rounds for IISc Bangalore, IIT Bombay, IIT Delhi',
            'Apply for PMRF (Prime Minister’s Research Fellowship) for ₹70k-₹80k/month doctoral funding',
            'Join cutting-edge laboratory working on Distributed Systems or Foundation Models',
          ],
          recommendedResources: ['COAP Portal', 'PMRF Guidelines (pmrf.in)'],
        },
      ],
    },
    futureDemandScore: 98,
    workStyleTags: ['High Analytical', 'Remote & Hybrid Friendly', 'Rapid Growth', 'Continuous Learning'],
    budgetFit: 'Government Subsidized (< ₹2.5L)',
    preferredLocations: ['Tier 1 Metro', 'Tier 2 Emerging', 'Remote / Hybrid'],
    criticalSkills: ['Data Structures & Algorithms', 'Python / TypeScript / C++', 'Distributed Systems', 'Cloud & Docker', 'GenAI & Vector Stores'],
  },
  {
    id: 'chartered-accountancy-finance',
    title: 'Chartered Accountancy & Investment Finance (CA / CFA)',
    category: 'Commerce, Finance & CA',
    targetAudience: 'both',
    description: 'Master statutory audit, Indian taxation, corporate governance, financial modeling, and investment banking for top financial institutions and consulting firms.',
    eligibilityRequirements: {
      minimumPercentage: 50,
      streamConstraints: ['Commerce', 'PCM', 'Arts', 'Any'],
      collegePrerequisites: ['B.Com / BBA / B.Com (Hons) / B.Sc or direct entry route post graduation'],
      notes: 'Commerce with Mathematics is advantageous. Graduates with 55-60% marks can enter CA Intermediate directly.',
    },
    keyExams: [
      {
        name: 'ICAI CA Foundation, Inter & Final',
        fullForm: 'Institute of Chartered Accountants of India Exams',
        frequency: 'Thrice a year (Jan, May, Sept) under new ICAI scheme',
        difficulty: 'Very High',
        timeline: 'Foundation right after Class 12; Inter after 8 months; Final after 2-year articleship',
        officialPortal: 'icai.org',
      },
      {
        name: 'CFA Level 1, 2, 3',
        fullForm: 'Chartered Financial Analyst (CFA Institute USA)',
        frequency: 'Quarterly windows',
        difficulty: 'High',
        timeline: 'Pre-final year of undergraduate degree onwards',
        officialPortal: 'cfainstitute.org',
      },
      {
        name: 'CUET-UG (Commerce)',
        fullForm: 'Common University Entrance Test for SRCC, DU, and Central Universities',
        frequency: 'Annually in May',
        difficulty: 'Moderate',
        timeline: 'Class 12th completion',
        officialPortal: 'cuetug.nta.nic.in',
      },
    ],
    topInstitutions: [
      { name: 'ICAI (Statutory Professional Body)', location: 'Pan-India / New Delhi HQ', type: 'Premier Autonomous', tier: 'Tier 1' },
      { name: 'SRCC (Shri Ram College of Commerce)', location: 'New Delhi (DU)', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'St. Xavier’s College', location: 'Kolkata / Mumbai', type: 'Premier Autonomous', tier: 'Tier 1' },
      { name: 'IIM Ahmedabad / Bangalore (for CA + MBA)', location: 'Ahmedabad / Bengaluru', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
    ],
    estimatedSalaryRange: {
      entry: '₹9 - ₹16 LPA (Big 4 / Corporate Bank)',
      mid: '₹20 - ₹38 LPA',
      senior: '₹50 - ₹1.5+ Cr PA (Partner / CFO)',
    },
    roiIndicator: {
      investmentRating: 'Exceptional ROI',
      estimatedEducationCost: 'Total ICAI exam + tuition fees < ₹1.5L to ₹3L (with monthly stipend during articleship)',
      breakEvenPeriod: 'Under 6 months post qualification',
    },
    roadmapMilestones: [
      {
        stage: 'immediate',
        title: 'Accounting Fundamentals & Commercial Laws',
        description: 'Clear CA Foundation or secure admission in top DU/Central commerce college via CUET-UG.',
        actions: [
          'Master double-entry accounting principles, partnership accounts, and business mathematics',
          'Clear CA Foundation with 60%+ aggregate (ICAI criteria: 40% each subject, 50% overall)',
          'Build strong financial modeling spreadsheets in Microsoft Excel',
        ],
        recommendedResources: ['ICAI Study Material (BoS Portal)', 'Zerodha Varsity (Capital Markets)'],
      },
      {
        stage: '6-month',
        title: 'CA Intermediate & Corporate Law',
        description: 'Comprehensive study of Corporate Accounting, GST, Direct Taxation, and Auditing standards.',
        actions: [
          'Complete both groups of CA Intermediate under revised scheme',
          'Undergo ICAI mandatory IT and soft skills orientation (ICITSS)',
          'Apply for Articleship interviews at Big 4 (PwC, Deloitte, EY, KPMG) or top audit firms',
        ],
        recommendedResources: ['ICAI Revision Test Papers (RTP)', 'Corporate Tax Guru modules'],
      },
      {
        stage: '2-year',
        title: 'Practical Articleship & CA Final',
        description: 'Complete 24 months of industrial/audit training and clear CA Final to obtain ACA membership.',
        actions: [
          'Conduct statutory audits for listed entities and banking sector clients',
          'Specialize in Financial Reporting (Ind AS) and Strategic Financial Management (SFM)',
          'Appear for ICAI campus placement program or pursue equity research roles',
        ],
        recommendedResources: ['ICAI Campus Placement Portal', 'Bloomberg / Capitaline Research Tools'],
      },
    ],
    collegeRoadmap: {
      placements: [
        {
          stage: 'immediate',
          title: 'Financial Modeling & Corporate Valuation Portfolio',
          description: 'Construct 3 integrated 3-statement models, DCF valuations, and LBO models in Microsoft Excel.',
          actions: [
            'Build full DCF valuation for Indian listed company (e.g., Tata Motors or HDFC Bank)',
            'Master Bloomberg Terminal / Capital IQ functions, PitchBook, and Excel shortcuts',
            'Craft finance resume showcasing investment thesis and equity research samples',
          ],
          recommendedResources: ['Aswath Damodaran Valuation Lectures', 'Wall Street Prep / CFI'],
        },
        {
          stage: '6-month',
          title: 'Big 4 & Investment Banking Interview Prep',
          description: 'Prepare for technical accounting questions, M&A pitch cases, and partner interviews.',
          actions: [
            'Study 400 Investment Banking interview questions (DCF, multiples, enterprise value)',
            'Participate in national finance case challenges (CFA Institute Research Challenge)',
            'Network with alumni in private equity, investment banking, and risk management',
          ],
          recommendedResources: ['Mergers & Inquisitions 400 Questions', 'CFA Institute Research Challenge'],
        },
        {
          stage: '2-year',
          title: 'Analyst Induction & Accelerated Promotion',
          description: 'Join corporate finance or private equity team as Financial Analyst / Associate.',
          actions: [
            'Lead statutory reporting or transaction advisory workstreams',
            'Complete CFA Level 2 or 3 exams alongside work for international mobility',
            'Position for senior associate promotion or top-tier MBA transition',
          ],
          recommendedResources: ['CFA Institute Portal', 'Wall Street Oasis'],
        },
      ],
      higherEducation: [
        {
          stage: 'immediate',
          title: 'CAT / GMAT Preparation for Premier MBA',
          description: 'Target 99.5+ percentile for IIM Ahmedabad, Bangalore, Calcutta, or top global business schools.',
          actions: [
            'Take timed sectional tests in Quantitative Aptitude, Data Interpretation, and Verbal Ability',
            'Strengthen profile through extracurricular leadership or certified financial publications',
            'Target top business schools with strong finance tracks (FMS Delhi, XLRI, IIM Calcutta)',
          ],
          recommendedResources: ['Arun Sharma CAT Books', 'Official GMAT Review'],
        },
        {
          stage: '6-month',
          title: 'Written Ability Tests & Business Case Analysis',
          description: 'Master business case interviews and personal interview (PI) defenses for IIM shortlists.',
          actions: [
            'Practice 50+ business case studies on market entry, profitability, and corporate governance',
            'Draft Detailed Application Form (DAF) highlighting finance credentials and CA/CFA merits',
            'Conduct 10+ mock interviews with IIM alumni',
          ],
          recommendedResources: ['Victor Cheng Case Interviewing', 'McKinsey Case Studies'],
        },
        {
          stage: '2-year',
          title: 'B-School Finance Specialization & Summer Associate',
          description: 'Secure summer internship in investment banking or private equity at top IIM.',
          actions: [
            'Join MBA Investment Banking / Consulting cohorts with pre-placement offer focus',
            'Complete international exchange semester at partner European/US business schools',
            'Graduate with dual qualification (CA/CFA + IIM MBA)',
          ],
          recommendedResources: ['IIM Placement Reports', 'Financial Times Global MBA'],
        },
      ],
    },
    futureDemandScore: 94,
    workStyleTags: ['High Detail Orientation', 'Corporate Consulting', 'Autonomous Practice Option', 'High Integrity'],
    budgetFit: 'Government Subsidized (< ₹2.5L)',
    preferredLocations: ['Tier 1 Metro', 'Tier 2 Emerging', 'Pan-India / State Hubs'],
    criticalSkills: ['Indian Tax Laws & GST', 'Ind AS / IFRS Standards', 'Financial Modeling', 'Corporate Governance', 'Statutory Auditing'],
  },
  {
    id: 'mbbs-clinical-medicine',
    title: 'Medicine, Surgery & Clinical Practice (MBBS / MD)',
    category: 'Healthcare & Allied Sciences',
    targetAudience: 'both',
    description: 'Dedicate yourself to patient care, surgery, clinical diagnostics, and public healthcare systems across premier medical colleges and hospitals.',
    eligibilityRequirements: {
      minimumPercentage: 50,
      streamConstraints: ['PCB', 'PCMB'],
      collegePrerequisites: ['B.Sc Nursing / BDS / BAMS / Allied Medical or MBBS Graduate for PG'],
      notes: 'Mandatory 10+2 with Physics, Chemistry, and Biology/Biotechnology. Minimum 17 years of age.',
    },
    keyExams: [
      {
        name: 'NEET-UG',
        fullForm: 'National Eligibility cum Entrance Test (Undergraduate)',
        frequency: 'Annually in May',
        difficulty: 'Very High',
        timeline: 'Class 12th Board Exam year / Gap year',
        officialPortal: 'neet.nta.nic.in',
      },
      {
        name: 'NEET-PG / NExT',
        fullForm: 'National Exit Test / NEET Post Graduate',
        frequency: 'Annual (March - April)',
        difficulty: 'Very High',
        timeline: 'MBBS Internship completion year',
        officialPortal: 'nbe.edu.in',
      },
      {
        name: 'USMLE / PLAB',
        fullForm: 'US Medical Licensing Examination / UK Professional and Linguistic Assessments Board',
        frequency: 'Multiple testing windows',
        difficulty: 'Very High',
        timeline: 'MBBS 3rd year onwards for global residency',
        officialPortal: 'usmle.org',
      },
    ],
    topInstitutions: [
      { name: 'AIIMS New Delhi & AIIMS Hubs', location: 'New Delhi & Pan-India', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'Christian Medical College (CMC)', location: 'Vellore, Tamil Nadu', type: 'Premier Autonomous', tier: 'Tier 1' },
      { name: 'JIPMER', location: 'Puducherry', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'King George’s Medical University (KGMU)', location: 'Lucknow, UP', type: 'State University', tier: 'Tier 1' },
    ],
    estimatedSalaryRange: {
      entry: '₹9 - ₹15 LPA (Junior Resident)',
      mid: '₹18 - ₹35 LPA (Senior Resident / Specialist)',
      senior: '₹45 - ₹90+ LPA (Consultant / Super Specialist)',
    },
    roiIndicator: {
      investmentRating: 'Prestige & Security',
      estimatedEducationCost: '₹10k - ₹1.5L total in Govt AIIMS/State Medical Colleges; Private ₹50L - ₹1Cr+',
      breakEvenPeriod: 'Immediate in Govt colleges; 6-8 years in private colleges',
    },
    roadmapMilestones: [
      {
        stage: 'immediate',
        title: 'NCERT Biology Line-by-Line & Speed Physics',
        description: 'Target 680+ out of 720 marks for top government medical colleges in unreserved quota.',
        actions: [
          'Create mind-maps for all 38 Biology NCERT chapters with diagram labeling',
          'Solve 15 years of NEET past year question papers (PYQs) with timed OMR sheets',
          'Strengthen Organic Chemistry reaction mechanisms and Physics mechanics calculations',
        ],
        recommendedResources: ['NCERT at your Fingertips (Biology)', 'NEETprep Test Series'],
      },
      {
        stage: '6-month',
        title: 'Full-Length Mock Simulations & Error Log Notebook',
        description: 'Train stamina for the single-sitting 3 hours 20 minutes examination.',
        actions: [
          'Attempt 2 full mocks weekly under real afternoon examination hours (2:00 PM to 5:20 PM)',
          'Maintain a strict Error Log notebook analyzing negative marking patterns',
          'Review JoSAA/MCC seat matrix and state quota cutoffs for counseling strategy',
        ],
        recommendedResources: ['Allen / Aakash AIATS', 'MCC.nic.in counseling manuals'],
      },
      {
        stage: '2-year',
        title: 'Clinical Rotations & Specialization Choice',
        description: 'Undergo MBBS clinical postings, rotational internship, and prepare for NExT / NEET PG.',
        actions: [
          'Excel in clinical examinations across Medicine, Surgery, OBG, and Pediatrics',
          'Complete 1-year compulsory rotating medical internship with maximum patient exposure',
          'Identify specialty interest (Cardiology, Radiology, Orthopedics, Oncology)',
        ],
        recommendedResources: ['Marrow / Prepladder Clinical Question Bank', 'Robbins Pathology'],
      },
    ],
    collegeRoadmap: {
      placements: [
        {
          stage: 'immediate',
          title: 'Hospital Clinical Rotations & Core Procedures',
          description: 'Master essential emergency clinical procedures, venipunctures, and case history diagnostics.',
          actions: [
            'Complete clinical postings across emergency trauma, ICU, and outpatient departments',
            'Prepare for Junior Residency interviews at premier central government hospitals',
            'Obtain permanent State Medical Council registration upon internship completion',
          ],
          recommendedResources: ['Oxford Handbook of Clinical Medicine', 'State Medical Council Guidelines'],
        },
        {
          stage: '6-month',
          title: 'Junior Residency & Emergency Medical Officer Roles',
          description: 'Secure Junior Resident / Medical Officer posts in central institutes or corporate hospital chains.',
          actions: [
            'Apply for non-academic Junior Residency vacancies at AIIMS, Safdarjung, or Apollo Hospitals',
            'Earn certifications in BLS (Basic Life Support) and ACLS (Advanced Cardiac Life Support)',
            'Build case portfolio for clinical presentations and departmental audits',
          ],
          recommendedResources: ['AHA ACLS Certification Manual', 'BMJ Case Reports'],
        },
        {
          stage: '2-year',
          title: 'Hospital Consultant / Specialist Career Launch',
          description: 'Transition into specialized clinical practice or hospital administration leadership.',
          actions: [
            'Lead departmental clinical teams as Senior Medical Officer',
            'Explore hospital management (MHA) or health informatics career pathways',
            'Establish private outpatient clinical practice or community healthcare center',
          ],
          recommendedResources: ['NABH Hospital Standards Portal', 'Lancet Regional Health'],
        },
      ],
      higherEducation: [
        {
          stage: 'immediate',
          title: 'NEET-PG / NExT High-Yield Question Bank',
          description: 'Complete 19 medical subjects revision using standard question banks and grand tests.',
          actions: [
            'Solve 15,000+ clinical MCQs on Marrow or Prepladder with detailed explanation reviews',
            'Focus on high-yield subjects: Pathology, Pharmacology, Medicine, and Surgery',
            'Take bi-weekly proctored Grand Tests (GTs) targeting 150+ correct clinical answers',
          ],
          recommendedResources: ['Marrow Question Bank & Grand Tests', 'First Aid for USMLE Step 1'],
        },
        {
          stage: '6-month',
          title: 'Grand Test Percentile Boost & USMLE / PLAB Prep',
          description: 'Achieve 98+ percentile in national mock tests and prepare for licensing overseas if targeting UK/US residency.',
          actions: [
            'Target top 5,000 rank in NEET-PG national test series for clinical specialty seats',
            'Complete USMLE Step 2 CK or PLAB Part 1 for international residency options',
            'Publish clinical case studies in indexed PubMed medical journals',
          ],
          recommendedResources: ['UWorld USMLE Step 2 CK', 'PLABable Online Platform'],
        },
        {
          stage: '2-year',
          title: 'MD / MS Residency Specialization',
          description: 'Join MD / MS clinical residency at top medical college through MCC counseling.',
          actions: [
            'Select clinical branch (General Medicine, Radiology, Orthopedics, Pediatrics, Dermatology)',
            'Undertake thesis research under departmental faculty guide',
            'Prepare for DM / MCh super-specialty entrance examinations',
          ],
          recommendedResources: ['MCC Seat Allotment Portal', 'Harrison’s Principles of Internal Medicine'],
        },
      ],
    },
    futureDemandScore: 96,
    workStyleTags: ['High Public Impact', 'In-Person Clinical', 'High Empathy & Resilience', 'Lifelong Stability'],
    budgetFit: 'Government Subsidized (< ₹2.5L)',
    preferredLocations: ['Pan-India / State Hubs', 'Tier 1 Metro', 'Tier 2 Emerging'],
    criticalSkills: ['Diagnostic Reasoning', 'Pharmacology & Pathology', 'High Stress Composure', 'Patient Empathy', 'Surgical Dexterity'],
  },
  {
    id: 'corporate-litigation-law',
    title: 'Corporate Law, Litigation & Judiciary (BA LLB / LLM)',
    category: 'Law, Humanities & Civil Services',
    targetAudience: 'both',
    description: 'Shape commercial contracts, international arbitration, constitutional advocacy, mergers & acquisitions, and judicial decisions at premier corporate firms and high courts.',
    eligibilityRequirements: {
      minimumPercentage: 45,
      streamConstraints: ['Arts', 'Commerce', 'PCM', 'PCB', 'Any'],
      collegePrerequisites: ['3-Year LLB graduates or 5-Year Integrated Law students'],
      notes: 'Open to all streams. Strong logical reasoning, reading comprehension, and argument clarity are central.',
    },
    keyExams: [
      {
        name: 'CLAT (UG & PG)',
        fullForm: 'Common Law Admission Test (Consortium of National Law Universities)',
        frequency: 'Annually in December',
        difficulty: 'High',
        timeline: 'Class 12th Mid-term / Graduation final year for LLM',
        officialPortal: 'consortiumofnlus.ac.in',
      },
      {
        name: 'AILET',
        fullForm: 'All India Law Entrance Test (NLU Delhi)',
        frequency: 'Annually in December',
        difficulty: 'High',
        timeline: 'Class 12th Mid-term',
        officialPortal: 'nationallawuniversitydelhi.in',
      },
      {
        name: 'Judicial Services Examination (PCS-J)',
        fullForm: 'Provincial Civil Services - Judicial (State High Courts)',
        frequency: 'Annual by respective states',
        difficulty: 'Very High',
        timeline: 'Post LLB degree completion',
        officialPortal: 'State High Court / PSC portals',
      },
    ],
    topInstitutions: [
      { name: 'NLSIU (National Law School of India University)', location: 'Bengaluru, Karnataka', type: 'Premier Autonomous', tier: 'Tier 1' },
      { name: 'NALSAR University of Law', location: 'Hyderabad, Telangana', type: 'Premier Autonomous', tier: 'Tier 1' },
      { name: 'WBNUJS Kolkata', location: 'Kolkata, West Bengal', type: 'Premier Autonomous', tier: 'Tier 1' },
      { name: 'Faculty of Law, University of Delhi', location: 'New Delhi', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
    ],
    estimatedSalaryRange: {
      entry: '₹12 - ₹18 LPA (Tier 1 Law Firms)',
      mid: '₹24 - ₹45 LPA',
      senior: '₹70L - ₹2.5+ Cr PA (Partner / Senior Counsel)',
    },
    roiIndicator: {
      investmentRating: 'High ROI',
      estimatedEducationCost: '₹12L - ₹18L (NLU 5-year integrated course with hostel)',
      breakEvenPeriod: '1.5 to 2.5 Years at top corporate firms',
    },
    roadmapMilestones: [
      {
        stage: 'immediate',
        title: 'Speed Reading & Legal Aptitude Comprehension',
        description: 'CLAT tests 120 passage-based questions in 120 minutes across Legal Reasoning, English, and Current Affairs.',
        actions: [
          'Read daily editorials from The Hindu or Indian Express to achieve 250+ wpm reading speed',
          'Master Constitutional provisions, Law of Torts, Contracts, and Criminal Law basics',
          'Attempt 40+ full-length CLAT mock tests with percentile analysis',
        ],
        recommendedResources: ['LiveLaw / Bar and Bench', 'The Hindu Editorials', 'LegalEdge Mock Series'],
      },
      {
        stage: '6-month',
        title: 'Moot Courts, Legal Research & Case Briefs',
        description: 'Participate in national mock court competitions and build legal drafting abilities.',
        actions: [
          'Master research databases like Manupatra, SCC Online, and HeinOnline',
          'Complete winter internship under trial court advocates or High Court chambers',
          'Draft arbitration petitions, non-disclosure agreements, and contract redlines',
        ],
        recommendedResources: ['SCC Online Student Edition', 'Coursera Law & Economics'],
      },
      {
        stage: '2-year',
        title: 'Corporate Firm Articleship & Bar Council Enrollment',
        description: 'Secure pre-placement offers (PPOs) at top corporate firms or clear AIBE for independent practice.',
        actions: [
          'Intern at Tier 1 firms (Cyril Amarchand Mangaldas, Shardul Amarchand, Khaitan & Co)',
          'Specialize in Mergers & Acquisitions, FinTech Regulations, or Intellectual Property Rights (IPR)',
          'Clear AIBE and enroll with the State Bar Council',
        ],
        recommendedResources: ['Bar Council of India Regulations', 'Harvard Law Review'],
      },
    ],
    collegeRoadmap: {
      placements: [
        {
          stage: 'immediate',
          title: 'Tier 1 Corporate Law Firm Internship Applications',
          description: 'Target corporate internships at leading law firms (CAM, SAM, Trilegal, Khaitan & Co, AZB).',
          actions: [
            'Draft targeted legal cover letters with specialized interest in Corporate Transactions or IP',
            'Publish 2 legal commentaries in recognized law reviews or Bar & Bench',
            'Master legal due diligence checklists, corporate restructuring, and contract redlines',
          ],
          recommendedResources: ['Bar & Bench Articles', 'SCC Online Practical Drafting'],
        },
        {
          stage: '6-month',
          title: 'Internship Performance & Assessment Internships',
          description: 'Convert internship stint into an Assessment Internship (call-back for PPO interview).',
          actions: [
            'Excel in partner research assignments with fast turnaround and citation accuracy',
            'Participate in drafting commercial agreements (Shareholders Agreements, Share Purchase Agreements)',
            'Prepare for technical interview questions on Companies Act 2013 and SEBI regulations',
          ],
          recommendedResources: ['Companies Act 2013 Bare Act', 'SEBI Regulations Manual'],
        },
        {
          stage: '2-year',
          title: 'Associate Induction & Bar Enrollment',
          description: 'Clear All India Bar Examination (AIBE) and join corporate law firm as Associate.',
          actions: [
            'Clear AIBE and register with State Bar Council for court representation license',
            'Begin first-year corporate associate responsibilities in transaction advisory',
            'Develop cross-border commercial arbitration competencies',
          ],
          recommendedResources: ['AIBE Official Portal', 'ICC Arbitration Rules'],
        },
      ],
      higherEducation: [
        {
          stage: 'immediate',
          title: 'Judicial Services Examination (PCS-J) Syllabus',
          description: 'Systematic study of substantive and procedural laws for State Judicial Service Preliminary & Mains exams.',
          actions: [
            'Master Civil Procedure Code (CPC), Criminal Procedure Code (CrPC), and Indian Evidence Act',
            'Practice daily judgment writing and charge framing exercises',
            'Solve 10 years of state judicial service previous year question papers',
          ],
          recommendedResources: ['Bare Acts with Case Law', 'Rahul’s IAS Judicial Question Bank'],
        },
        {
          stage: '6-month',
          title: 'Mains Answer Writing & Local State Laws',
          description: 'Complete preparation for local state rent acts, land revenue codes, and language papers.',
          actions: [
            'Write 2 full-length Mains answers daily with citation of Supreme Court precedents',
            'Master official regional language translation paper mandatory in PCS-J',
            'Attempt full-length proctored state judicial mock examinations',
          ],
          recommendedResources: ['LiveLaw Supreme Court Digest', 'State Judicial Services Test Series'],
        },
        {
          stage: '2-year',
          title: 'Civil Judge (Junior Division) Selection & Judicial Academy',
          description: 'Clear high-stakes judicial interview board and undergo training at State Judicial Academy.',
          actions: [
            'Clear interview personality test defending constitutional principles',
            'Complete 1-year induction training at State Judicial Academy',
            'Take charge as Civil Judge / Judicial Magistrate First Class (JMFC)',
          ],
          recommendedResources: ['National Judicial Academy India (nja.gov.in)'],
        },
      ],
    },
    futureDemandScore: 90,
    workStyleTags: ['High Verbal Aptitude', 'Negotiation Heavy', 'Intellectual Rigor', 'Prestige & Advocacy'],
    budgetFit: 'Moderate (₹3L - ₹10L)',
    preferredLocations: ['Tier 1 Metro', 'Pan-India / State Hubs'],
    criticalSkills: ['Legal Drafting & Case Briefing', 'Critical Logical Reasoning', 'Oral Advocacy', 'Commercial Contract Negotiation', 'Statutory Interpretation'],
  },
  {
    id: 'civil-services-governance',
    title: 'Civil Services & Public Administration (UPSC CSE - IAS/IPS/IFS)',
    category: 'Law, Humanities & Civil Services',
    targetAudience: 'both',
    description: 'Lead district administration, public policing, foreign diplomacy, policy implementation, and socio-economic transformation across India’s government apparatus.',
    eligibilityRequirements: {
      minimumPercentage: 40,
      streamConstraints: ['Arts', 'Commerce', 'PCM', 'PCB', 'Any'],
      collegePrerequisites: ['Any recognized Bachelor’s degree in any discipline (B.A., B.Sc., B.Tech, MBBS, B.Com)'],
      notes: 'Age 21-32 years (general category, relaxations apply). Minimum qualification is any recognized graduation degree.',
    },
    keyExams: [
      {
        name: 'UPSC Civil Services Examination (CSE)',
        fullForm: 'Union Public Service Commission Civil Services Examination',
        frequency: 'Annually (Prelims: May/June; Mains: Sept; Interviews: Jan-April)',
        difficulty: 'Very High',
        timeline: 'Graduation final year onwards',
        officialPortal: 'upsc.gov.in',
      },
      {
        name: 'State PSC Exams',
        fullForm: 'State Public Service Commission Administrative Services (UPPSC, BPSC, MPSC, KPSC)',
        frequency: 'Annual / Biennial',
        difficulty: 'Very High',
        timeline: 'Post graduation',
        officialPortal: 'State PSC portals',
      },
    ],
    topInstitutions: [
      { name: 'LBSNAA (Lal Bahadur Shastri National Academy of Administration)', location: 'Mussoorie, Uttarakhand (Post Selection)', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'Any recognized UGC university / Central University', location: 'Pan-India', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
    ],
    estimatedSalaryRange: {
      entry: '₹9 - ₹14 LPA (Pay Band 10 + Govt Housing, Transport & Allowances)',
      mid: '₹18 - ₹28 LPA (Joint Secretary / District Magistrate)',
      senior: '₹30 - ₹36 LPA (Cabinet Secretary / Chief Secretary - Apex Scale)',
    },
    roiIndicator: {
      investmentRating: 'Prestige & Security',
      estimatedEducationCost: 'Undergraduate degree cost + ₹50k - ₹1.5L UPSC study materials',
      breakEvenPeriod: 'Immediate upon selection with lifelong sovereign pension and administrative authority',
    },
    roadmapMilestones: [
      {
        stage: 'immediate',
        title: 'Core NCERT Foundation & General Studies Mapping',
        description: 'Cover Classes 6-12 NCERTs across History, Polity, Geography, and Economics.',
        actions: [
          'Cover Indian Polity by M. Laxmikanth and Modern Indian History by Spectrum',
          'Practice answering 2 mains-format questions daily (150 words each) with clear diagrams',
          'Study UPSC syllabus thoroughly and pick an optional subject aligning with your undergrad degree',
        ],
        recommendedResources: ['UPSC Official Previous Year Papers', 'PIB Releases', 'Yojana Magazine'],
      },
      {
        stage: '6-month',
        title: 'Prelims Mock Drilling & Optional Subject Mastery',
        description: 'Attempt 60+ Prelims GS Papers and CSAT mock tests to eliminate negative marking risks.',
        actions: [
          'Complete 100% syllabus of the chosen Optional Subject (500 marks in Mains)',
          'Develop strong ethics case-study answers for General Studies Paper 4',
          'Solve previous 10 years Prelims questions with detailed option-elimination strategies',
        ],
        recommendedResources: ['VisionIAS / ForumIAS All India Mocks', 'PRS Legislative Research summaries'],
      },
      {
        stage: '2-year',
        title: 'Mains Answer Writing & Personality Test Simulation',
        description: 'Score 750+ in Mains written exam and prepare for the 275-mark UPSC Personality Test interview board.',
        actions: [
          'Enroll in intensive Mains answer evaluation test series',
          'Participate in mock interviews focusing on Detailed Application Form (DAF) defense',
          'Maintain Plan-B readiness with State PSC exams or RBI Grade B banking exams',
        ],
        recommendedResources: ['LBSNAA Foundation Course Curriculum', 'Economic Survey of India'],
      },
    ],
    collegeRoadmap: {
      placements: [
        {
          stage: 'immediate',
          title: 'Public Policy Analysis & Consulting Case Sprint',
          description: 'Master quantitative policy evaluation, stakeholder mapping, and legislative briefing formats.',
          actions: [
            'Analyze 3 public welfare schemes (e.g. Ayushman Bharat, PM Gati Shakti) using measurable impact metrics',
            'Format single-page consulting resume highlighting policy research, econometric analysis, and communication',
            'Apply for policy research internships at think tanks (PRS Legislative Research, CPR, Quality Council of India)',
          ],
          recommendedResources: ['PRS Legislative Research Briefs', 'NITI Aayog Policy Papers', 'Overleaf Policy Resume'],
        },
        {
          stage: '6-month',
          title: 'Think Tank & Corporate Government Advisory Hiring',
          description: 'Interview for Associate / Policy Analyst roles at consulting firms and corporate public affairs teams.',
          actions: [
            'Prepare for case interviews focused on regulatory compliance, ESG governance, and public-private partnerships (PPP)',
            'Interview with government advisory divisions (EY Parthenon, PwC Gov Advisory, Albright Stonebridge, Chase India)',
            'Present policy research whitepaper at national governance conferences',
          ],
          recommendedResources: ['World Bank Policy Reports', 'Economic Survey of India Summary'],
        },
        {
          stage: '2-year',
          title: 'Senior Policy Specialist & Strategic Leadership',
          description: 'Lead government engagement workstreams, regulatory risk audits, and bilateral development missions.',
          actions: [
            'Lead state-level project management units (PMUs) for developmental transformation',
            'Advise multinational technology firms on emerging Indian regulatory compliance (DPDP Act, AI guidelines)',
            'Transition into multilateral agencies (UNDP, Asian Development Bank, World Bank India)',
          ],
          recommendedResources: ['UNDP India Knowledge Hub', 'NITI Aayog Aspirational Districts Portal'],
        },
      ],
      higherEducation: [
        {
          stage: 'immediate',
          title: 'UPSC CSE / Master of Public Policy (MPP) Blueprint',
          description: 'Begin structured general studies revision alongside postgraduate entrance applications.',
          actions: [
            'Study standard Indian Polity (M. Laxmikanth) and Modern History (Spectrum)',
            'Target admissions in premier MPP programs (NLSIU Bengaluru, IIM Bangalore PGPPM, TISS Mumbai)',
            'Attempt 15 years of UPSC Prelims previous year questions with negative marking review',
          ],
          recommendedResources: ['NLSIU MPP Official Portal', 'UPSC PYQ Question Bank'],
        },
        {
          stage: '6-month',
          title: 'Mains Answer Writing & Public Policy Proposals',
          description: 'Write daily 150-word and 250-word policy answers with clear diagrams, committee citations, and way-forward frameworks.',
          actions: [
            'Enroll in national Mains answer evaluation test series targeting 450+ in General Studies',
            'Draft Statement of Purpose (SOP) defending governance philosophy for top public policy schools',
            'Clear written tests and personal interview panels for central university policy programs',
          ],
          recommendedResources: ['VisionIAS Mains Test Series', 'Yojana & Kurukshetra Monthly Digests'],
        },
        {
          stage: '2-year',
          title: 'Civil Services Selection / MPP Graduate Fellowships',
          description: 'Clear the 275-mark UPSC Personality Test board or graduate as Fellow in Public Policy.',
          actions: [
            'Defend Detailed Application Form (DAF) before UPSC interview board',
            'Undertake district administration apprenticeship or field immersion project',
            'Join Indian Administrative Service (IAS/IPS/IFS) or lead global policy advisory cohorts',
          ],
          recommendedResources: ['LBSNAA Training Curriculum', 'NLSIU Policy Review'],
        },
      ],
    },
    futureDemandScore: 95,
    workStyleTags: ['High Public Authority', 'Nation Building', 'Field Postings & Policy', 'Unmatched Job Security'],
    budgetFit: 'Government Subsidized (< ₹2.5L)',
    preferredLocations: ['Pan-India / State Hubs', 'Tier 2 Emerging'],
    criticalSkills: ['Administrative Decision Making', 'Constitutional Governance', 'Crisis Management', 'Public Policy Synthesis', 'Clear Written Articulation'],
  },
  {
    id: 'product-design-ui-ux',
    title: 'Product Design & UI/UX Systems',
    category: 'Design, Media & Architecture',
    targetAudience: 'both',
    description: 'Architect intuitive digital applications, design systems, human-centered consumer hardware, and interactive media experiences for modern technology firms.',
    eligibilityRequirements: {
      minimumPercentage: 50,
      streamConstraints: ['Arts', 'Commerce', 'PCM', 'PCB', 'Any'],
      collegePrerequisites: ['B.Des / B.Arch / B.Sc Multimedia or any undergraduate with design portfolio'],
      notes: 'No rigid stream prerequisite. Visual thinking, spatial empathy, and a verified portfolio matter far more than marks.',
    },
    keyExams: [
      {
        name: 'UCEED / CEED',
        fullForm: 'Undergraduate / Common Entrance Examination for Design (IIT Bombay)',
        frequency: 'Annually in January',
        difficulty: 'High',
        timeline: 'Class 12th Board year / Graduation final year for CEED',
        officialPortal: 'uceed.iitb.ac.in',
      },
      {
        name: 'NID DAT (Prelims & Mains)',
        fullForm: 'National Institute of Design - Design Aptitude Test',
        frequency: 'Annually (Prelims: Jan; Mains: April)',
        difficulty: 'High',
        timeline: 'Class 12th or final year degree',
        officialPortal: 'admissions.nid.edu',
      },
    ],
    topInstitutions: [
      { name: 'NID Ahmedabad / Gandhinagar / Bengaluru', location: 'Ahmedabad & Gujarat', type: 'Premier Autonomous', tier: 'Tier 1' },
      { name: 'IDC School of Design, IIT Bombay', location: 'Mumbai, Maharashtra', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'Department of Design, IIT Delhi', location: 'New Delhi', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'Srishti Manipal Institute of Art, Design & Tech', location: 'Bengaluru, Karnataka', type: 'Top Private', tier: 'Tier 2' },
    ],
    estimatedSalaryRange: {
      entry: '₹7 - ₹15 LPA',
      mid: '₹18 - ₹36 LPA',
      senior: '₹45 - ₹95+ LPA (Head of Design)',
    },
    roiIndicator: {
      investmentRating: 'High ROI',
      estimatedEducationCost: '₹8L - ₹14L (NID / IITs) to ₹18L (Top Private)',
      breakEvenPeriod: '1.5 to 2.5 Years post portfolio launch',
    },
    roadmapMilestones: [
      {
        stage: 'immediate',
        title: 'Design Foundations & Observational Sketching',
        description: 'Build observational sketching, color theory, typography hierarchy, and master Figma.',
        actions: [
          'Design 3 full end-to-end mobile/web case studies addressing genuine Indian user challenges',
          'Practice 2D/3D visualization and perspective sketching for UCEED/NID DAT Prelims',
          'Publish case studies with user research synthesis on Behance and personal domain',
        ],
        recommendedResources: ['Laws of UX (lawsofux.com)', 'Refactoring UI', 'NID DAT Past Question Papers'],
      },
      {
        stage: '6-month',
        title: 'User Research & Micro-Interaction Craftsmanship',
        description: 'Conduct qualitative user interviews, usability testing, and dynamic motion prototyping.',
        actions: [
          'Learn modern design systems token architecture and component libraries in Figma',
          'Prototype advanced micro-interactions using Protopie, Framer, or Rive',
          'Participate in design hackathons and international design challenges',
        ],
        recommendedResources: ['Nielsen Norman Group Research Articles', 'Mobbin UI Library'],
      },
      {
        stage: '2-year',
        title: 'Product Leadership & Design System Architect',
        description: 'Lead product design sprints, collaborate with engineering teams, and deliver business metrics.',
        actions: [
          'Secure design internship at top Indian startups (Swiggy, Razorpay, CRED, Zerodha)',
          'Build strong cross-functional empathy by understanding frontend code (React, CSS, Tailwind)',
          'Present design rationale to founders and product managers with actionable metrics',
        ],
        recommendedResources: ['Design Systems by Alla Kholmatova', 'Smashing Magazine Design'],
      },
    ],
    collegeRoadmap: {
      placements: [
        {
          stage: 'immediate',
          title: 'Production UI/UX Portfolio & Case Study Polish',
          description: 'Construct 3 in-depth product design case studies highlighting business conversion, user journeys, and Figma prototypes.',
          actions: [
            'Create personal portfolio website on Framer or Webflow showcasing user research methodologies',
            'Conduct usability audits on existing consumer apps with redesigned solutions',
            'Participate in Dribbble / Behance design sprints and seek feedback from design leads',
          ],
          recommendedResources: ['Framer Design Templates', 'Mobbin Design System Patterns'],
        },
        {
          stage: '6-month',
          title: 'Design Sprints & Startup Internship Drives',
          description: 'Interview for product design associate roles at high-growth tech companies.',
          actions: [
            'Complete live whiteboard challenge simulations with senior product designers',
            'Master design handoff documentation (tokens, responsive breakpoints, auto-layout)',
            'Apply directly to startup founders and heads of design via cold portfolio pitches',
          ],
          recommendedResources: ['Whiteboard Challenge Frameworks', 'Solving Product Design Exercises'],
        },
        {
          stage: '2-year',
          title: 'Design System Lead & Product Ownership',
          description: 'Transition into Senior Product Designer or UX Specialist managing enterprise product suites.',
          actions: [
            'Lead design system governance across multi-platform consumer applications',
            'Drive quantitative A/B testing user validation sprints alongside product managers',
            'Mentor junior designers and speak at design conferences',
          ],
          recommendedResources: ['Refactoring UI Book', 'NN/g UX Certification'],
        },
      ],
      higherEducation: [
        {
          stage: 'immediate',
          title: 'CEED & Master of Design (M.Des) Preparation',
          description: 'Prepare for CEED (Common Entrance Examination for Design) conducted by IIT Bombay.',
          actions: [
            'Practice Part A visual reasoning, design perception, and environmental awareness questions',
            'Solve Part B creative problem solving and narrative sketching under timed constraints',
            'Curate physical and digital studio portfolio for IIT interview panels',
          ],
          recommendedResources: ['CEED Official Past Papers', 'IIT IDC Studio Projects'],
        },
        {
          stage: '6-month',
          title: 'Studio Tests & Faculty Interview Defenses',
          description: 'Clear studio test modeling rounds and portfolio presentations at IIT Bombay, IIT Delhi, or IISc.',
          actions: [
            'Construct 3D material prototypes using clay, paper, and wire in studio test simulations',
            'Articulate design philosophies and research theses before university panels',
            'Submit applications to international design schools (RCA London, Politecnico di Milano)',
          ],
          recommendedResources: ['IIT Bombay IDC Admission Guidelines', 'Core77 Design Awards'],
        },
        {
          stage: '2-year',
          title: 'M.Des Thesis & Advanced Interaction Research',
          description: 'Complete Master of Design and publish research in HCI (Human-Computer Interaction).',
          actions: [
            'Author graduate thesis on Spatial Computing or Vernacular Accessibility Interfaces',
            'Partner with industry R&D laboratories for sponsored design research projects',
            'Graduate into Principal Design Strategist or design research director roles',
          ],
          recommendedResources: ['ACM CHI Conference Proceedings', 'Interaction Design Foundation'],
        },
      ],
    },
    futureDemandScore: 91,
    workStyleTags: ['Highly Creative', 'User Empathy Centric', 'Remote Friendly', 'Visual Problem Solving'],
    budgetFit: 'Moderate (₹3L - ₹10L)',
    preferredLocations: ['Tier 1 Metro', 'Remote / Hybrid'],
    criticalSkills: ['Figma & Prototyping', 'Design Systems', 'User Research & Usability Audits', 'Typography & Visual Hierarchy', 'Product Thinking'],
  },
  {
    id: 'management-consulting-mba',
    title: 'Management Consulting & Strategic Leadership (MBA)',
    category: 'Commerce, Finance & CA',
    targetAudience: 'college',
    description: 'Advise Fortune 500 CEOs, private equity funds, and public policy leaders on corporate transformation, market entry, operational excellence, and high-stakes turnarounds.',
    eligibilityRequirements: {
      minimumPercentage: 50,
      streamConstraints: ['Commerce', 'PCM', 'Arts', 'PCB', 'Any'],
      collegePrerequisites: ['Any recognized undergraduate degree with minimum 50% aggregate'],
      notes: 'College students and working professionals. Academic consistency (10th, 12th, graduation marks) matters for top business schools.',
    },
    keyExams: [
      {
        name: 'CAT (Common Admission Test)',
        fullForm: 'Common Admission Test for 21 Indian Institutes of Management',
        frequency: 'Annually on last Sunday of November',
        difficulty: 'Very High',
        timeline: 'Graduation final year / 1-3 years of work experience',
        officialPortal: 'iimcat.ac.in',
      },
      {
        name: 'XAT & GMAT',
        fullForm: 'Xavier Aptitude Test (XLRI) & Graduate Management Admission Test',
        frequency: 'XAT in January; GMAT year-round',
        difficulty: 'High',
        timeline: 'Pre-application window for top business schools',
        officialPortal: 'xatonline.in',
      },
    ],
    topInstitutions: [
      { name: 'IIM Ahmedabad / IIM Bangalore / IIM Calcutta', location: 'Ahmedabad / Bengaluru / Kolkata', type: 'Premier Autonomous', tier: 'Tier 1' },
      { name: 'ISB (Indian School of Business)', location: 'Hyderabad & Mohali', type: 'Top Private', tier: 'Tier 1' },
      { name: 'FMS Delhi (Faculty of Management Studies)', location: 'New Delhi', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'XLRI Jamshedpur', location: 'Jamshedpur, Jharkhand', type: 'Premier Autonomous', tier: 'Tier 1' },
    ],
    estimatedSalaryRange: {
      entry: '₹22 - ₹36 LPA (Consultant at McKinsey / BCG / Bain / Big 4)',
      mid: '₹40 - ₹80 LPA (Engagement Manager)',
      senior: '₹1.2 - ₹3.5+ Cr PA (Managing Director / Partner)',
    },
    roiIndicator: {
      investmentRating: 'Exceptional ROI',
      estimatedEducationCost: '₹2L (FMS Delhi) to ₹25L - ₹32L (IIMs/ISB)',
      breakEvenPeriod: 'Under 1 to 2.5 Years post MBA',
    },
    roadmapMilestones: [
      {
        stage: 'immediate',
        title: 'CAT Sectional Mastery (VARC, DILR, QA)',
        description: 'Target 99.5+ percentile with daily timed practice in Verbal Ability, Data Interpretation, and Quantitative Aptitude.',
        actions: [
          'Solve 2 DILR puzzle sets and 3 Reading Comprehension passages daily',
          'Attempt 30+ proctored mock CAT tests with granular sectional error analysis',
          'Build leadership profile via student council or corporate initiatives',
        ],
        recommendedResources: ['Arun Sharma CAT Prep Books', 'TIME / IMS / Career Launcher All India Mock Tests'],
      },
      {
        stage: '6-month',
        title: 'Case Interviewing & Analytical Frameworks',
        description: 'Master management consulting case frameworks (Profitability, Market Entry, M&A, Pricing).',
        actions: [
          'Conduct 50+ live peer case interviews using Victor Cheng methods',
          'Participate in national corporate case competitions (HUL L.I.M.E., Tata Crucible)',
          'Prepare Written Ability Test (WAT) essays on macroeconomic and geopolitical trends',
        ],
        recommendedResources: ['Case in Point by Marc Cosentino', 'Victor Cheng Look Over My Shoulder (LOMS)'],
      },
      {
        stage: '2-year',
        title: 'Summer Internship & Strategy Placement',
        description: 'Complete high-impact summer associate stint at Tier 1 consulting firm and secure PPO.',
        actions: [
          'Lead executive presentations for client leadership teams during summer internship',
          'Publish business thought leadership or startup strategy case studies',
          'Join global strategy or private equity portfolio operations teams',
        ],
        recommendedResources: ['Harvard Business Review (HBR)', 'Wall Street Journal'],
      },
    ],
    collegeRoadmap: {
      placements: [
        {
          stage: 'immediate',
          title: 'Management Trainee / Analyst Recruitment Strategy',
          description: 'Prepare for campus management consulting, strategy, and leadership development programs.',
          actions: [
            'Master guesstimates and market-sizing calculations under timed conditions',
            'Complete corporate internship in business strategy, operations, or marketing analytics',
            'Draft high-impact resume highlighting leadership initiatives and quantitative results',
          ],
          recommendedResources: ['Guesstimate Practice Question Bank', 'Crafting Consulting Resumes'],
        },
        {
          stage: '6-month',
          title: 'Corporate Case Competitions & Group Discussions',
          description: 'Compete in national B-School corporate case competitions to win direct Pre-Placement Interviews (PPIs).',
          actions: [
            'Form 3-member interdisciplinary team to solve corporate case briefs',
            'Master structured behavioral interviews and unstructured group discussion moderation',
            'Network with strategy alumni at consulting firms (Accenture Strategy, Kearney, EY-Parthenon)',
          ],
          recommendedResources: ['Unstop Corporate Case Competitions', 'Victor Cheng Case Frameworks'],
        },
        {
          stage: '2-year',
          title: 'Associate Consultant Promotion & Executive Track',
          description: 'Deliver strategic advisory engagements across financial services, consumer goods, and digital transformation.',
          actions: [
            'Lead workstreams on commercial due diligence and operational restructuring',
            'Manage junior business analysts and synthesize client board presentations',
            'Evaluate sponsored corporate MBA or transition into private equity operations',
          ],
          recommendedResources: ['McKinsey Quarterly', 'Bain Insights'],
        },
      ],
      higherEducation: [
        {
          stage: 'immediate',
          title: 'CAT / GMAT Comprehensive Preparation',
          description: 'Execute structured 6-month study plan targeting 99+ percentile in CAT or 730+ in GMAT.',
          actions: [
            'Solve 15 years of CAT previous year question papers under strict exam timer',
            'Maintain detailed error log tracking accuracy in DILR sets and Reading Comprehension',
            'Complete online mock test series from two independent coaching institutes',
          ],
          recommendedResources: ['Cracku CAT Previous Year Papers', 'Official GMAT Practice Exams'],
        },
        {
          stage: '6-month',
          title: 'Written Ability Test (WAT) & Interview Preparation',
          description: 'Prepare for IIM Ahmedabad, Bangalore, Calcutta shortlists and interview rounds.',
          actions: [
            'Write daily 300-word essays on national economic policies, ESG, and technological trends',
            'Defend undergraduate academic choices and domain knowledge during mock faculty interviews',
            'Prepare strong responses on personal ethics, leadership failures, and career vision',
          ],
          recommendedResources: ['Economic Survey of India Summary', 'IIM Interview Experience Compilations'],
        },
        {
          stage: '2-year',
          title: 'Top IIM MBA & Global Consulting Induction',
          description: 'Enroll in flagship 2-year PGP/MBA program and secure placement at MBB (McKinsey, BCG, Bain).',
          actions: [
            'Maintain top 10% academic standing (Director’s Merit List) in first year MBA',
            'Complete 8-week summer associate internship at top consulting firm with PPO conversion',
            'Graduate with premier MBA credential unlocking executive leadership trajectory',
          ],
          recommendedResources: ['IIM Placement Reports', 'Harvard Business School Case Studies'],
        },
      ],
    },
    futureDemandScore: 94,
    workStyleTags: ['High Client Facing', 'Executive Communication', 'Fast-Paced Travel', 'Strategic Impact'],
    budgetFit: 'Premium (₹10L - ₹25L+)',
    preferredLocations: ['Tier 1 Metro', 'Pan-India / State Hubs'],
    criticalSkills: ['Structured Problem Solving', 'Case Analysis & Frameworks', 'Executive Storytelling', 'Financial Statement Analysis', 'Cross-Functional Leadership'],
  },
  {
    id: 'core-engineering-robotics',
    title: 'Core Engineering, Robotics & EV Mobility Systems',
    category: 'Engineering & Technology',
    targetAudience: 'both',
    description: 'Engineer advanced mechatronics, electric vehicle (EV) battery architectures, smart power grids, semiconductor fabrication, and industrial automation across manufacturing giants and aerospace enterprises.',
    eligibilityRequirements: {
      minimumPercentage: 60,
      streamConstraints: ['PCM', 'PCMB'],
      collegePrerequisites: ['B.Tech / B.E in Mechanical, Electrical, Electronics, Mechatronics, or Civil Engineering'],
      notes: 'Strictly requires 10+2 with Physics and Mathematics (PCM). College students must hold or be pursuing a Core Engineering degree.',
    },
    keyExams: [
      {
        name: 'GATE (ME / EE / EC / CE)',
        fullForm: 'Graduate Aptitude Test in Engineering for PSU Recruitments & M.Tech',
        frequency: 'Annually in February',
        difficulty: 'Very High',
        timeline: 'Final year of B.Tech / Pre-final year',
        officialPortal: 'gate.iisc.ac.in',
      },
      {
        name: 'UPSC ESE / IES',
        fullForm: 'Engineering Services Examination (Indian Engineering Services)',
        frequency: 'Annually (Prelims: Feb; Mains: June)',
        difficulty: 'Very High',
        timeline: 'Post B.Tech degree completion',
        officialPortal: 'upsc.gov.in',
      },
      {
        name: 'JEE Main & Advanced',
        fullForm: 'Joint Entrance Examination for IITs, NITs, and CFTIs',
        frequency: 'Annual testing cycles',
        difficulty: 'Very High',
        timeline: 'Class 12th Board Exam year',
        officialPortal: 'jeemain.nta.nic.in',
      },
    ],
    topInstitutions: [
      { name: 'IIT Madras / IIT Roorkee / IIT Kharagpur', location: 'Chennai / Roorkee / Kharagpur', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'NIT Trichy / NIT Surathkal', location: 'Tiruchirappalli / Surathkal', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'BITS Pilani', location: 'Pilani / Goa / Hyderabad', type: 'Top Private', tier: 'Tier 1' },
      { name: 'College of Engineering Pune (COEP)', location: 'Pune, Maharashtra', type: 'Premier Autonomous', tier: 'Tier 1' },
    ],
    estimatedSalaryRange: {
      entry: '₹7 - ₹16 LPA (Core R&D / Automotive / Semiconductor)',
      mid: '₹18 - ₹34 LPA (Senior Systems Architect)',
      senior: '₹40 - ₹85+ LPA (Chief Engineer / Plant Director)',
    },
    roiIndicator: {
      investmentRating: 'High ROI',
      estimatedEducationCost: '₹4L - ₹10L (Government IIT/NIT) to ₹18L (Private)',
      breakEvenPeriod: '2 to 3 Years post-graduation',
    },
    roadmapMilestones: [
      {
        stage: 'immediate',
        title: 'Engineering Physics & Mathematical Mechanics',
        description: 'Build strong intuition in classical mechanics, thermodynamics, and calculus for engineering entrances.',
        actions: [
          'Master rotational dynamics, thermodynamics laws, and electromagnetic induction',
          'Solve 10 years of JEE Main / Advanced Physics & Mathematics questions',
          'Participate in school robotics clubs or physics olympiads',
        ],
        recommendedResources: ['Concepts of Physics by H.C. Verma', 'I.E. Irodov Problems in General Physics'],
      },
      {
        stage: '6-month',
        title: 'Hands-on CAD Modeling & Hardware Prototyping',
        description: 'Learn basic computer-aided design (CAD) software and microcontroller programming.',
        actions: [
          'Model 3D components using Fusion 360 or SolidWorks student edition',
          'Build simple sensor-actuator projects using Arduino or ESP32',
          'Target 98+ percentile in state engineering entrance tests (MHT CET, KCET, WBJEE)',
        ],
        recommendedResources: ['Autodesk Fusion 360 Tutorials', 'Arduino Open-Source Community'],
      },
      {
        stage: '2-year',
        title: 'Core Branch Admission & Formula Student Teams',
        description: 'Secure admission in top NIT/IIT core engineering branches and join practical engineering teams.',
        actions: [
          'Join collegiate automotive teams (Formula Bharat, SAE BAJA, Solar Vehicle)',
          'Complete introductory courses in MATLAB, Simulink, and finite element analysis (FEA)',
          'Secure second-year industrial apprenticeship at manufacturing plants',
        ],
        recommendedResources: ['SAE India Student Portal', 'MathWorks MATLAB Academy'],
      },
    ],
    collegeRoadmap: {
      placements: [
        {
          stage: 'immediate',
          title: 'Core Simulation Software & Hands-on Hardware Projects',
          description: 'Master industry-standard engineering tools: MATLAB/Simulink, Ansys FEA/CFD, and embedded C/C++.',
          actions: [
            'Build 2 verifiable capstone engineering projects (e.g. EV battery thermal management or autonomous drone navigation)',
            'Master MATLAB Simulink for control systems or Ansys for stress/fluid simulation',
            'Craft single-page engineering resume with hardware project links and technical specs',
          ],
          recommendedResources: ['Ansys Student Innovation Courses', 'Simulink Onramp', 'Overleaf Engineering Resume'],
        },
        {
          stage: '6-month',
          title: 'Core Campus Hiring & PSU Recruitment Prep',
          description: 'Prepare for technical assessments from automotive, semiconductor, and industrial conglomerates.',
          actions: [
            'Prepare core mechanical/electrical interview topics (Thermodynamics, Machines, Circuit Theory, Microcontrollers)',
            'Interview with core recruiters (Tata Motors, L&T, Texas Instruments, Schneider, Bosch, Mahindra)',
            'Take PSU technical aptitude tests for Maharatna companies (BHEL, IOCL, ONGC, NTPC)',
          ],
          recommendedResources: ['Made Easy Core Engineering Handbook', 'IndiaBIX Technical Aptitude'],
        },
        {
          stage: '2-year',
          title: 'R&D Engineering Specialist & Project Leadership',
          description: 'Lead production line deployments, EV powertrain design, or semiconductor test validation.',
          actions: [
            'Take charge of multidisciplinary engineering modules (hardware-in-the-loop testing)',
            'File industrial design patents or present research at IEEE conferences',
            'Pursue executive technical leadership or specialized M.Tech/MS sponsorship',
          ],
          recommendedResources: ['IEEE Xplore Digital Library', 'SAE Technical Papers'],
        },
      ],
      higherEducation: [
        {
          stage: 'immediate',
          title: 'GATE Core Branch Syllabus & Previous Question Papers',
          description: 'Master standard textbooks for your engineering discipline and solve 15 years of GATE question papers.',
          actions: [
            'Study core theory from standard references (P.K. Nag for Thermo, Sedra & Smith for Electronics)',
            'Solve 15 years of chapter-wise GATE previous year questions with virtual calculator practice',
            'Identify postgraduate specializations (Robotics, VLSI, Thermal, Structural Dynamics)',
          ],
          recommendedResources: ['GATE Overflow PYQ Series', 'NPTEL Engineering Lectures'],
        },
        {
          stage: '6-month',
          title: 'All-India Grand Tests & Research Statement of Purpose',
          description: 'Achieve top 500 All-India Rank (AIR) in GATE mock tests and prepare for MS / M.Tech admissions.',
          actions: [
            'Enroll in national proctored mock series (Made Easy / ACE Academy) targeting 75+ marks',
            'Draft academic Statement of Purpose (SOP) for IISc Bangalore and top IITs',
            'Prepare for international MS applications (GRE + TOEFL/IELTS) for Germany/US universities',
          ],
          recommendedResources: ['ACE Academy National Mock Series', 'DAAD Germany Study Portal'],
        },
        {
          stage: '2-year',
          title: 'M.Tech / MS at IISc / IITs & Global R&D Labs',
          description: 'Join premier research laboratories and conduct sponsored defense/aerospace research.',
          actions: [
            'Participate in COAP counseling rounds for IISc, IIT Bombay, IIT Madras',
            'Work on national mission projects (DRDO, ISRO, CSIR sponsored laboratories)',
            'Graduate into Principal Systems Engineer or Doctoral Research Scholar',
          ],
          recommendedResources: ['COAP Official Counseling Portal', 'DRDO Young Scientist Labs'],
        },
      ],
    },
    futureDemandScore: 92,
    workStyleTags: ['High Analytical', 'Hardware & Prototyping', 'Field & Laboratory Work', 'Long-term Industrial Impact'],
    budgetFit: 'Government Subsidized (< ₹2.5L)',
    preferredLocations: ['Tier 1 Metro', 'Tier 2 Emerging', 'Pan-India / State Hubs'],
    criticalSkills: ['MATLAB & Simulink', 'CAD (SolidWorks / Fusion 360)', 'Embedded C/C++', 'Finite Element Analysis (FEA)', 'Thermal & Fluid Dynamics'],
  },
  {
    id: 'biotech-clinical-sciences',
    title: 'Biotechnology, Bioinformatics & Life Sciences Research',
    category: 'Healthcare & Allied Sciences',
    targetAudience: 'both',
    description: 'Pioneer recombinant DNA therapeutics, computational genomics, agricultural biotechnology, cancer pharmacology, and molecular diagnostics at biopharma majors and central research institutes.',
    eligibilityRequirements: {
      minimumPercentage: 55,
      streamConstraints: ['PCB', 'PCMB'],
      collegePrerequisites: ['B.Sc / B.Tech in Biotechnology, Microbiology, Genetics, Biochemistry, or Life Sciences'],
      notes: 'Requires 10+2 with Biology and Chemistry (PCB/PCMB). College students must hold or be pursuing a Life Sciences or Allied degree.',
    },
    keyExams: [
      {
        name: 'GAT-B / CUET-PG',
        fullForm: 'Graduate Aptitude Test - Biotechnology & Common University Entrance Test',
        frequency: 'Annually in April - May',
        difficulty: 'High',
        timeline: 'Final semester of Bachelor’s degree',
        officialPortal: 'dbt.nta.ac.in',
      },
      {
        name: 'CSIR-UGC NET (JRF)',
        fullForm: 'Council of Scientific & Industrial Research National Eligibility Test for Junior Research Fellowship',
        frequency: 'Twice a year (June & December)',
        difficulty: 'Very High',
        timeline: 'Final year of M.Sc / B.Tech Biotechnology',
        officialPortal: 'csirnet.nta.nic.in',
      },
      {
        name: 'IIT JAM (Biotechnology)',
        fullForm: 'Joint Admission Test for M.Sc at IITs and IISc',
        frequency: 'Annually in February',
        difficulty: 'High',
        timeline: 'Final year of B.Sc degree',
        officialPortal: 'jam.iitm.ac.in',
      },
    ],
    topInstitutions: [
      { name: 'IISc Bangalore (Division of Biological Sciences)', location: 'Bengaluru, Karnataka', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'Jawaharlal Nehru University (School of Biotechnology)', location: 'New Delhi', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'IIT Delhi & IIT Kharagpur (Dept of Bioscience & Bioengg)', location: 'New Delhi / Kharagpur', type: 'Central / IIT / NIT / AIIMS', tier: 'Tier 1' },
      { name: 'National Centre for Biological Sciences (NCBS)', location: 'Bengaluru, Karnataka', type: 'Premier Autonomous', tier: 'Tier 1' },
    ],
    estimatedSalaryRange: {
      entry: '₹6 - ₹13 LPA (Biopharma R&D / Bio-IT / Clinical Research)',
      mid: '₹16 - ₹32 LPA (Senior Research Scientist)',
      senior: '₹40 - ₹80+ LPA (Director of Discovery / Chief Scientific Officer)',
    },
    roiIndicator: {
      investmentRating: 'High ROI',
      estimatedEducationCost: '₹1.5L - ₹5L (Central Universities / IITs) to ₹12L (Private)',
      breakEvenPeriod: '2 to 3 Years post postgraduate qualification',
    },
    roadmapMilestones: [
      {
        stage: 'immediate',
        title: 'Cell Biology, Genetics & Biochemical Fundamentals',
        description: 'Master molecular genetics, Mendelian inheritance, bioenergetics, and biological chemistry.',
        actions: [
          'Thoroughly study Class 11-12 NCERT Biology chapters on Biotechnology principles and processes',
          'Practice CUET-UG domain subject papers with emphasis on Biology and Chemistry',
          'Learn basic Python for processing DNA/protein sequencing data',
        ],
        recommendedResources: ['NCERT Biology 11-12', 'Rosalind Bio-Informatics Coding Challenges'],
      },
      {
        stage: '6-month',
        title: 'Laboratory Techniques & Entrance Preparation',
        description: 'Familiarize with PCR amplification, gel electrophoresis, ELISA assays, and cell culture.',
        actions: [
          'Solve previous 5-year question papers for CUET-UG and state biotechnology entrances',
          'Explore computational genomics platforms (NCBI BLAST, UniProt, PyMOL)',
          'Apply for Indian Academy of Sciences (IASc) summer research fellowships',
        ],
        recommendedResources: ['NCBI Education Resources', 'NCBS Summer Research Portal'],
      },
      {
        stage: '2-year',
        title: 'Undergraduate Excellence & Wet Lab Experience',
        description: 'Excel in undergraduate lab modules and publish undergraduate review papers.',
        actions: [
          'Master molecular cloning, spectrophotometry, and cell culture techniques',
          'Co-author an academic poster or research paper with faculty mentors',
          'Prepare for IIT JAM or GAT-B for funded postgraduate studies',
        ],
        recommendedResources: ['Molecular Biology of the Cell by Alberts', 'Lehninger Principles of Biochemistry'],
      },
    ],
    collegeRoadmap: {
      placements: [
        {
          stage: 'immediate',
          title: 'Bio-IT Tools, Next-Gen Sequencing & Python / R for Biology',
          description: 'Master computational genomics pipelines, BioPython, and clinical trials data standards (CDISC).',
          actions: [
            'Build 2 computational biology projects using Python / R to analyze public RNA-Seq datasets',
            'Learn Bioconductor packages, PyMOL molecular visualization, and molecular docking (AutoDock)',
            'Prepare resume highlighting wet-lab instrumentation skills (HPLC, PCR, Flow Cytometry) and data analytics',
          ],
          recommendedResources: ['Bioconductor R Library', 'Rosalind Computational Genomics', 'CDISC Standards'],
        },
        {
          stage: '6-month',
          title: 'Clinical Research & Biopharma Industry Drives',
          description: 'Apply for Clinical Research Associate (CRA), Bio-Data Analyst, and Quality Assurance roles.',
          actions: [
            'Interview with leading biopharma & clinical research organizations (Biocon, Dr. Reddy’s, Syngene, IQVIA, Serum Institute)',
            'Earn certifications in Good Clinical Practice (GCP) and Good Laboratory Practice (GLP)',
            'Prepare technical answers on drug discovery pipelines, pharmacokinetics, and regulatory compliance',
          ],
          recommendedResources: ['ICH-GCP Certification Portal', 'Syngene Careers Portal'],
        },
        {
          stage: '2-year',
          title: 'Senior Discovery Scientist & Project Lead',
          description: 'Direct preclinical development pipelines or lead computational drug repurposing teams.',
          actions: [
            'Lead discovery workstreams for biosimilars, monoclonal antibodies, or mRNA vaccines',
            'Manage clinical trial telemetry databases with international regulatory bodies (FDA/EMA/DCGI)',
            'Transition into Regulatory Affairs, Medical Affairs, or Biotechnology Venture Capital',
          ],
          recommendedResources: ['Nature Biotechnology', 'DCGI Regulatory Guidelines (cdsco.gov.in)'],
        },
      ],
      higherEducation: [
        {
          stage: 'immediate',
          title: 'IIT JAM / GAT-B & CSIR-NET Life Sciences Prep',
          description: 'Execute focused study plan covering Biochemistry, Molecular Biology, Immunology, and Genetics.',
          actions: [
            'Study standard references: Lehninger (Biochemistry), Kuby (Immunology), Lodish (Molecular Cell Biology)',
            'Solve 10 years of CSIR-UGC NET Part B & Part C analytical questions',
            'Target top 100 rank in GAT-B for DBT-funded Master’s scholarship with monthly stipend',
          ],
          recommendedResources: ['Pathfinder Life Sciences Reference Books', 'CSIR NET Question Banks'],
        },
        {
          stage: '6-month',
          title: 'Research Statement of Purpose & IISc / IIT Interviews',
          description: 'Clear written tests and defend research proposals before academic selection committees.',
          actions: [
            'Draft comprehensive research proposal focusing on Molecular Therapeutics or Structural Biology',
            'Appear for interview rounds at IISc, TIFR, NCBS, and central IITs',
            'Publish undergraduate research findings in peer-reviewed scientific journals',
          ],
          recommendedResources: ['TIFR GS Examination Guidelines', 'IISc Research Admissions Portal'],
        },
        {
          stage: '2-year',
          title: 'Doctoral Fellowships (JRF / PMRF) & Global Postdoc',
          description: 'Receive full government doctoral stipend (₹37,000 to ₹70,000/month) and complete doctoral research.',
          actions: [
            'Activate CSIR JRF or qualify for Prime Minister’s Research Fellowship (PMRF)',
            'Present thesis discoveries at international microbiology/genomics congresses',
            'Transition into University Faculty Scientist or Principal Biopharma Investigator',
          ],
          recommendedResources: ['PMRF Guidelines (pmrf.in)', 'EMBO Research Fellowships'],
        },
      ],
    },
    futureDemandScore: 95,
    workStyleTags: ['High Scientific Rigor', 'Laboratory & Computational', 'Public Health Impact', 'Intellectual Curiosity'],
    budgetFit: 'Government Subsidized (< ₹2.5L)',
    preferredLocations: ['Tier 1 Metro', 'Pan-India / State Hubs'],
    criticalSkills: ['Molecular Biology & PCR', 'Genomics & Bioinformatics (BioPython / R)', 'Biochemistry & Enzymology', 'Drug Discovery & Docking', 'Clinical Data Analysis'],
  },
];

export const CAREER_DATABASE: CareerPath[] = BASE_CAREER_DATABASE.map((career) => ({
  ...career,
  placementPreparationKit: CAREER_PLACEMENT_KITS[career.id],
  higherEducationKit: CAREER_HIGHER_ED_KITS[career.id],
}));



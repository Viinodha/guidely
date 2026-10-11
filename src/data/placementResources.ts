/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlacementResourceKit, HigherEducationKit } from '../types/student';

export const CAREER_PLACEMENT_KITS: Record<string, PlacementResourceKit> = {
  'ai-software-engineering': {
    trackName: 'Software Engineering & AI Placement Sprint',
    corePracticePatterns: [
      'DSA Pattern: Two Pointers & Sliding Window for subarray and string optimizations',
      'DSA Pattern: Binary Tree Level-Order & Lowest Common Ancestor (LCA)',
      'DSA Pattern: Graph BFS/DFS, Dijkstra & Topological Sort for dependency graphs',
      'DSA Pattern: Dynamic Programming 1D & 2D (Knapsack, Longest Common Subsequence)',
      'System Design: Distributed In-Memory Caching (Redis), DB Indexing & Rate Limiting (Token Bucket)',
      'Database Indexing: B-Tree vs Hash Indexing, N+1 Query Elimination in PostgreSQL',
    ],
    mockInterviewTips: [
      'Clarify constraints and bounds upfront (e.g., maximum array length, time/space limits, null inputs) before coding.',
      'Think out loud: Communicate your initial brute-force approach (time/space) before jumping to optimal algorithms.',
      'Structure behavioral answers using the STAR method (Situation, Task, Action, Result) with quantifiable impact metrics.',
      'Perform manual dry-runs using a custom edge-case test suite on a whiteboard or virtual editor before running code.',
      'Ask insightful questions to interviewers about their team architecture, deployment frequency, and technical debt.',
    ],
    industryPortfolioRequirements: [
      '2 Production-grade full-stack web applications built with TypeScript, React, PostgreSQL/MongoDB, and Docker.',
      'Live cloud deployment (AWS ECS, Google Cloud Run, or Vercel) with custom domains and SSL encryption.',
      'Single-page LaTeX ATS-compliant resume with verifiable GitHub repository links and live project demonstrations.',
      'Clean Git commit history, automated CI/CD pipeline (GitHub Actions), and at least 85%+ unit test code coverage.',
    ],
    recommendedPlatforms: [
      { name: 'NeetCode 150', url: 'https://neetcode.io', description: 'Curated 150 essential LeetCode algorithmic patterns organized by topic.' },
      { name: 'Striver SDE Sheet', url: 'https://takeuforward.org', description: 'Top 190 coding interview questions frequently asked by Indian tech product firms.' },
      { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', description: 'Open-source guide to distributed systems, scalable architectures, and caching.' },
      { name: 'Pramp Free Mocks', url: 'https://www.pramp.com', description: 'Peer-to-peer live technical and behavioral interview practice sessions.' },
    ],
  },

  'chartered-accountancy-finance': {
    trackName: 'Investment Banking & Corporate Finance Placement Sprint',
    corePracticePatterns: [
      '3-Statement Integrated Financial Model linking Income Statement, Balance Sheet, and Cash Flow Statement',
      'Discounted Cash Flow (DCF) Valuation: Unlevered Free Cash Flows, WACC, and sensitivity tables',
      'Comparable Company Analysis (Trading Multiples: EV/EBITDA, P/E, EV/Sales) and Precedent Transactions',
      'Leveraged Buyout (LBO) Model: Debt schedules, IRR, and cash flow waterfall mechanics',
      'Working Capital Diagnostics: Days Sales Outstanding (DSO), Inventory Turnover & Cash Conversion Cycle',
      'Indian Taxation & Ind AS Standards: Deferred tax assets/liabilities and GST reconciliation',
    ],
    mockInterviewTips: [
      'Master the 3 financial statements walk-through: Be ready to explain the step-by-step impact of a ₹10 depreciation increase across all statements.',
      'Defend valuation assumptions using authentic Indian market data: Reference RBI benchmark repo rates, 10-year G-Sec yields, and NSE sector multiples.',
      'Demonstrate high ethical integrity: Structure fit responses around audit objectivity, regulatory compliance, and confidentiality.',
      'Speak concisely in structured bullet points when pitching an investment thesis or stock recommendation.',
    ],
    industryPortfolioRequirements: [
      '3 Comprehensive equity research pitch books or dynamic DCF valuation models of listed Indian companies (e.g. Tata Motors, HDFC Bank).',
      'Excel financial portfolio with automated lookup functions, dynamic scenario toggles, and zero hardcoded mathematical calculations.',
      'Summary briefs on recent SEBI regulations, Ind AS amendments, or corporate restructuring deals in India.',
    ],
    recommendedPlatforms: [
      { name: 'Aswath Damodaran Online', url: 'https://pages.stern.nyu.edu/~adamodar', description: 'Free NYU Stern corporate finance, valuation datasets, and country risk premiums.' },
      { name: 'Wall Street Prep', url: 'https://www.wallstreetprep.com', description: 'Premier financial modeling, DCF, and accounting interview crash courses.' },
      { name: 'Zerodha Varsity', url: 'https://zerodha.com/varsity', description: 'Indian capital markets, technical analysis, and corporate finance modules.' },
      { name: 'Mergers & Inquisitions 400 Q&A', url: 'https://mergersandinquisitions.com', description: 'Top 400 investment banking technical interview questions with worked solutions.' },
    ],
  },

  'core-engineering-robotics': {
    trackName: 'Core Engineering & EV Robotics Placement Sprint',
    corePracticePatterns: [
      'Finite Element Analysis (FEA) & Computational Fluid Dynamics (CFD) meshing and boundary setup',
      'MATLAB & Simulink Stateflow for EV battery thermal management and motor field-oriented control (FOC)',
      'Embedded C/C++ firmware development: Timers, interrupts, ADC sampling, and hardware register manipulation',
      'Industrial Communication Protocols: CAN Bus, I2C, SPI, and Modbus for sensor telemetry',
      'Geometric Dimensioning & Tolerancing (GD&T) according to ASME Y14.5 standards',
      'Closed-Loop Control Systems: PID tuning, Kalman filtering, and state-space observer design',
    ],
    mockInterviewTips: [
      'Be prepared to derive core mechanical/electrical engineering equations from first principles on a whiteboard.',
      'Explain failure mode and effects analysis (FMEA) and safety factors chosen for hardware prototypes.',
      'Highlight cross-disciplinary problem-solving in collegiate automotive teams (SAE BAJA, Formula Bharat, RoboCon).',
      'Discuss thermal dissipation, electromagnetic interference (EMI), and manufacturing tolerances in power circuits.',
    ],
    industryPortfolioRequirements: [
      '3D CAD engineering portfolio on SolidWorks / Autodesk Fusion 360 with exploded assemblies and engineering drawings.',
      'Documented hardware prototype video demonstrating working sensor-actuator loops or autonomous navigation.',
      'Engineering design dossier including bill of materials (BOM), finite element stress plots, and cost optimization calculations.',
    ],
    recommendedPlatforms: [
      { name: 'Ansys Innovation Courses', url: 'https://innovationspace.ansys.com', description: 'Free structural FEA, fluid dynamics, and electromagnetic simulation courses.' },
      { name: 'MathWorks Simulink Onramp', url: 'https://matlabacademy.mathworks.com', description: 'Hands-on interactive simulations for control systems, robotics, and EV modeling.' },
      { name: 'GrabCAD Community', url: 'https://grabcad.com', description: 'Global engineering repository for CAD models, design challenges, and hardware review.' },
      { name: 'IEEE Xplore Digital Library', url: 'https://ieeexplore.ieee.org', description: 'Peer-reviewed research in robotics, power electronics, and embedded systems.' },
    ],
  },

  'product-design-ui-ux': {
    trackName: 'Product Design & UX Systems Placement Sprint',
    corePracticePatterns: [
      'End-to-End User Discovery: Qualitative user interview synthesis, empathy maps & persona definition',
      'Information Architecture (IA): Tree testing, sitemaps, and user journey flowcharts',
      'Figma Token Architecture: Design system color palettes, typography scales, auto-layout 5.0 & component variants',
      'Interactive Micro-interactions: Advanced component state variants and motion prototyping in Framer / ProtoPie',
      'Quantitative Usability Audits: System Usability Scale (SUS) scoring, heuristic evaluations, and A/B test setups',
      'Accessibility Standards: WCAG 2.2 AA compliance, color contrast checks, and screen reader navigation flow',
    ],
    mockInterviewTips: [
      'Lead whiteboard design challenges by framing the user problem and business goals before drawing interfaces.',
      'Articulate design trade-offs: Explain why you rejected alternative concepts and how feedback altered your direction.',
      'Tie visual craftsmanship back to business metrics: Conversion rates, task completion speed, and drop-off reduction.',
      'Demonstrate deep empathy for Indian regional users: Vernacular UX, voice inputs, and low-bandwidth optimizations.',
    ],
    industryPortfolioRequirements: [
      'Personal portfolio website hosted on a custom domain showcasing 3 in-depth end-to-end case studies.',
      'Each case study must document the problem statement, user research, wireframes, iterations, and final interactive prototype.',
      'Figma community component library or live interactive prototype link available for immediate recruiter testing.',
    ],
    recommendedPlatforms: [
      { name: 'Mobbin Design Library', url: 'https://mobbin.com', description: 'World’s largest mobile and web UI flow library for real production apps.' },
      { name: 'Laws of UX', url: 'https://lawsofux.com', description: 'Collection of best practices and psychological principles governing UX design.' },
      { name: 'Nielsen Norman Group', url: 'https://www.nngroup.com', description: 'Evidence-based user experience research articles and benchmark usability guidelines.' },
      { name: 'Refactoring UI', url: 'https://www.refactoringui.com', description: 'Practical visual design techniques for building beautiful modern software interfaces.' },
    ],
  },

  'management-consulting-mba': {
    trackName: 'Management Consulting & Strategy Placement Sprint',
    corePracticePatterns: [
      'Profitability Framework: Disaggregating Revenue (Price × Volume) vs Costs (Fixed vs Variable) into MECE trees',
      'Market Sizing & Guesstimates: Top-down and bottom-up estimation frameworks for Indian consumer demographics',
      'Market Entry Framework: Target market attractiveness, competitive landscape, entry barriers & economic modes',
      'Mergers & Acquisitions (M&A): Strategic rationale, synergy quantification, and post-merger cultural integration',
      'Pricing Strategy Framework: Cost-plus, value-based pricing, dynamic benchmarking, and customer willingness-to-pay',
      'Operational Efficiency: Value chain mapping, bottleneck diagnosis, and working capital optimization',
    ],
    mockInterviewTips: [
      'Take 90 seconds to structure: Never rush into answering. Draw an MECE issue tree and articulate your roadmap.',
      'Synthesize calculations aloud: State assumptions, round numbers intelligently, and immediately tie results back to business takeaways.',
      'Demonstrate coachability: When the interviewer drops a hint or steers you away from a branch, pivot gracefully.',
      'Exude executive presence: Maintain structured bullet-point delivery, calm eye contact, and professional composure.',
    ],
    industryPortfolioRequirements: [
      'Comprehensive slide deck analyzing a real-world corporate dilemma in India (e.g. EV transition, quick commerce logistics).',
      'Detailed log of 40+ solved live peer case interviews with structured feedback ratings from senior mentors.',
      'Verified participation credentials from national corporate case challenges (Unstop, HUL L.I.M.E., Tata Crucible).',
    ],
    recommendedPlatforms: [
      { name: 'Victor Cheng Case Interview Secrets', url: 'https://www.caseinterview.com', description: 'Gold-standard frameworks and audio transcriptions for MBB case interviews.' },
      { name: 'Crafting Cases', url: 'https://www.craftingcases.com', description: 'In-depth issue tree structuring and math drill tools for management consulting.' },
      { name: 'Unstop Corporate Competitions', url: 'https://unstop.com', description: 'National B-School case challenges with direct Pre-Placement Interviews (PPIs).' },
      { name: 'McKinsey & BCG Insights', url: 'https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights', description: 'Macroeconomic and strategic research whitepapers on Indian and global industries.' },
    ],
  },

  'corporate-litigation-law': {
    trackName: 'Corporate Law & Transaction Advisory Placement Sprint',
    corePracticePatterns: [
      'Due Diligence Review: Corporate charter documents, title searches, pending litigation & material contracts',
      'Commercial Contract Drafting: Non-Disclosure Agreements (NDAs), Master Service Agreements (MSAs), and Share Purchase Agreements (SPAs)',
      'Statutory Compliance Audits: Companies Act 2013, SEBI Listing Obligations (LODR), and Foreign Exchange Management Act (FEMA)',
      'Arbitration & Dispute Resolution: Drafting section 9 petitions, section 11 arbitrator appointments, and statement of claims',
      'Insolvency Proceedings: Corporate Insolvency Resolution Process (CIRP) under Insolvency and Bankruptcy Code (IBC)',
      'Intellectual Property Due Diligence: Trademark filings, patent licensing, and copyright enforcement protocols',
    ],
    mockInterviewTips: [
      'Be prepared to defend every legal article, commentary, or moot court argument listed on your CV with recent landmark Supreme Court judgments.',
      'Quote bare acts accurately: Demonstrate meticulous mastery of statutory wording, limitation periods, and jurisdiction thresholds.',
      'Express clear career conviction: Articulate why you want to join transaction advisory vs commercial dispute litigation.',
    ],
    industryPortfolioRequirements: [
      '2 Published legal analytical notes in indexed law reviews, Bar & Bench, or LiveLaw on contemporary legal controversies.',
      'Moot court memorial or drafted commercial agreement redline showing meticulous drafting and definition cross-referencing.',
      'Verified internship performance appraisals from Tier 1 corporate law firms (CAM, SAM, Khaitan, Trilegal) or Senior Advocates.',
    ],
    recommendedPlatforms: [
      { name: 'SCC Online Practical Drafting', url: 'https://www.scconline.com', description: 'Premier legal research platform containing Supreme Court precedents and drafting precedents.' },
      { name: 'LiveLaw Supreme Court Digest', url: 'https://www.livelaw.in', description: 'Real-time updates, analytical judgments, and statutory circulars from Indian courts.' },
      { name: 'Bar & Bench Legal News', url: 'https://www.barandbench.com', description: 'Corporate law firm recruitment updates, deal announcements, and legal columns.' },
      { name: 'Companies Act Bare Act Portal', url: 'https://www.mca.gov.in', description: 'Official Ministry of Corporate Affairs regulations and filing schedules.' },
    ],
  },

  'biotech-clinical-sciences': {
    trackName: 'Biopharma R&D & Clinical Research Placement Sprint',
    corePracticePatterns: [
      'Next-Generation Sequencing (NGS) Data Pipelines: FASTQ quality control, alignment with BWA/Bowtie2 & variant calling',
      'Bioinformatics Data Modeling: BioPython, Bioconductor (R), and DESeq2 differential gene expression analysis',
      'In-Silico Drug Screening: Molecular docking workflows using AutoDock Vina, PyMOL visualization & ligand binding calculations',
      'Clinical Trial Data Standards: CDISC / SDTM domain mapping, study data tabulation, and adverse event coding (MedDRA)',
      'Laboratory Quality Systems: Good Laboratory Practice (GLP), Good Clinical Practice (GCP), and SOP validation',
      'Bioprocess Optimization: Fermentation kinetics, bioreactor parameter monitoring, and chromatography purification',
    ],
    mockInterviewTips: [
      'Walk through the step-by-step mechanism of action of candidate therapeutics and explain target validation workflows.',
      'Demonstrate working familiarity with Indian Central Drugs Standard Control Organization (CDSCO) guidelines.',
      'Emphasize laboratory composure, statistical experimental design (DoE), and meticulous data logging protocols.',
    ],
    industryPortfolioRequirements: [
      'Computational biology GitHub repository analyzing public RNA-Seq or microarray datasets from NCBI GEO.',
      'Laboratory experimental dossier or co-authored academic poster on recombinant protein expression or assay development.',
      'Certified completion of ICH-GCP regulatory certification from recognized clinical research bodies.',
    ],
    recommendedPlatforms: [
      { name: 'Rosalind Bioinformatics Challenges', url: 'https://rosalind.info', description: 'Interactive problem-solving platform for learning computational genomics and BioPython.' },
      { name: 'NCBI GenBank & BLAST', url: 'https://www.ncbi.nlm.nih.gov', description: 'World’s primary molecular biology and genetic sequence database.' },
      { name: 'CDISC Standards Portal', url: 'https://www.cdisc.org', description: 'Global clinical trial data standards required by international and Indian regulatory agencies.' },
      { name: 'Bioconductor R Library', url: 'https://www.bioconductor.org', description: 'Open-source software for analyzing high-throughput genomic data in R.' },
    ],
  },

  'mbbs-clinical-medicine': {
    trackName: 'Clinical Hospital Residency & Diagnostics Placement Sprint',
    corePracticePatterns: [
      'Emergency Clinical Triage: ABCDE assessment, trauma resuscitation & shock management protocols',
      'Differential Diagnostic Reasoning across Internal Medicine, Pediatrics, Surgery, and OBG',
      'Advanced Diagnostic Interpretation: 12-lead ECG rhythm analysis, arterial blood gas (ABG) & chest radiographs',
      'Basic & Advanced Life Support (BLS / ACLS) algorithmic decision trees',
      'Rational Pharmacotherapy: Antimicrobial stewardship, drug interaction checks, and organ-adjusted dosing',
      'Invasive Bedside Procedures: Intravenous cannulation, lumbar puncture, central venous line & endotracheal intubation',
    ],
    mockInterviewTips: [
      'Demonstrate patient-centered empathy, calm verbal de-escalation, and ethical integrity in simulated clinical stations.',
      'Defend emergency interventions sequentially: State vital signs, initial stabilization, diagnostic workup, and definitive care.',
      'Communicate working knowledge of NABH hospital quality protocols and infection control procedures.',
    ],
    industryPortfolioRequirements: [
      'Compulsory rotating medical internship logbook verified and signed by department heads.',
      'Certified BLS & ACLS credential accredited by the American Heart Association (AHA).',
      'Verified clinical case presentation portfolio and mortality/morbidity review audits.',
    ],
    recommendedPlatforms: [
      { name: 'Oxford Handbook of Clinical Medicine', url: 'https://academic.oup.com', description: 'Gold-standard bedside manual for emergency medicine and patient care.' },
      { name: 'Marrow Clinical QBank', url: 'https://www.marrow.com', description: 'India’s premier clinical question bank for NExT, NEET-PG, and hospital residency interviews.' },
      { name: 'UpToDate Clinical Decision Support', url: 'https://www.uptodate.com', description: 'Evidence-based clinical guidelines and treatment protocols used worldwide.' },
    ],
  },

  'civil-services-governance': {
    trackName: 'Public Policy, Governance & Regulatory Advisory Placement Sprint',
    corePracticePatterns: [
      'Public Policy Impact Analysis: Problem definition, stakeholder mapping, cost-benefit trade-offs & policy cycle',
      'Econometric Data Analysis: Evaluating NSSO, NFHS-5, and PLFS government datasets using statistical tools',
      'Legislative Research Briefs: Analyzing bill provisions, committee reports, and statutory amendments',
      'Regulatory Affairs Due Diligence: Assessing market entry risks under Indian administrative guidelines and FDI policies',
      'Government Project Management Units (PMUs): Milestone monitoring for public welfare infrastructure schemes',
      'Public Financial Administration: Budget allocation analysis, outcome-based budgeting & fiscal deficit modeling',
    ],
    mockInterviewTips: [
      'Provide structured, multi-dimensional answers covering socio-economic, constitutional, and technological angles.',
      'Always offer constructive, actionable recommendations rather than purely theoretical criticism.',
      'Speak calmly and articulately, referencing verified data points from the Economic Survey of India or NITI Aayog.',
    ],
    industryPortfolioRequirements: [
      'Policy analysis brief on an ongoing national flagship mission (e.g. Digital India, PM Gati Shakti, Ayushman Bharat).',
      'Econometric evaluation of a state development policy using verifiable public data sources.',
      'Published op-ed or commentary on public governance in a reputable journal or policy portal.',
    ],
    recommendedPlatforms: [
      { name: 'PRS Legislative Research', url: 'https://prsindia.org', description: 'Comprehensive legislative research on Indian parliamentary bills and policy briefs.' },
      { name: 'NITI Aayog Reports', url: 'https://www.niti.gov.in', description: 'Official developmental reports, state indexes, and aspirational district benchmarks.' },
      { name: 'PIB Official Releases', url: 'https://pib.gov.in', description: 'Official government press releases, policy announcements, and ministry circulars.' },
    ],
  },
};

export const CAREER_HIGHER_ED_KITS: Record<string, HigherEducationKit> = {
  'ai-software-engineering': {
    trackName: 'GATE CS / Global MS in Computer Science Track',
    targetEntranceExams: ['GATE (CS/IT)', 'GRE General Test', 'TOEFL / IELTS', 'TIFR GS'],
    diagnosticCheckpoints: [
      'Discrete Mathematics, Algorithms & Data Structures diagnostic test',
      'Theory of Computation (TOC), Compiler Design & Operating Systems review',
      'Database Management Systems (DBMS) and Computer Networks mastery',
    ],
    researchAndSOPMilestones: [
      'Draft research Statement of Purpose (SOP) focusing on Systems, Artificial Intelligence, or Distributed Cloud',
      'Secure 3 strong Letters of Recommendation (LORs) from undergraduate engineering faculty',
      'Publish peer-reviewed workshop or conference paper on algorithmic systems',
    ],
    recommendedPortals: [
      { name: 'GATE Overflow PYQs', url: 'https://gateoverflow.in', description: 'Community-verified solutions for 30 years of GATE Computer Science questions.' },
      { name: 'NPTEL Computer Science', url: 'https://nptel.ac.in', description: 'IIT faculty lectures on advanced algorithms, compilers, and machine learning.' },
    ],
  },

  'chartered-accountancy-finance': {
    trackName: 'IIM CAT / Global Master of Finance (MFin) Track',
    targetEntranceExams: ['CAT (Common Admission Test)', 'GMAT Focus Edition', 'XAT (XLRI)', 'CFA Level 1 & 2'],
    diagnosticCheckpoints: [
      'CAT Quantitative Aptitude (Arithmetic, Algebra, Geometry) diagnostic test',
      'Data Interpretation & Logical Reasoning (DILR) timed sectional sets',
      'Verbal Ability & Reading Comprehension (VARC) speed reading benchmarks',
    ],
    researchAndSOPMilestones: [
      'Draft MBA Detailed Application Form (DAF) and statement of corporate leadership goals',
      'Formulate analytical thesis on Indian capital market liquidity or fintech credit models',
      'Undergo 15+ live personal interview (PI) simulations with IIM alumni',
    ],
    recommendedPortals: [
      { name: 'IIM CAT Official Portal', url: 'https://iimcat.ac.in', description: 'Official registration, syllabus, and counseling information for 21 IIMs.' },
      { name: 'CFA Institute Portal', url: 'https://www.cfainstitute.org', description: 'Global charter examinations in investment analysis and ethical standards.' },
    ],
  },

  'core-engineering-robotics': {
    trackName: 'GATE Mechanical/Electrical / Global MS in Robotics Track',
    targetEntranceExams: ['GATE (ME / EE / EC / CE)', 'GRE General Test', 'DAAD Germany Entrance'],
    diagnosticCheckpoints: [
      'Engineering Mathematics & Applied Mechanics diagnostic mock test',
      'Thermodynamics, Heat Transfer & Fluid Mechanics problem bank',
      'Control Systems, Power Electronics & Microcontrollers mastery',
    ],
    researchAndSOPMilestones: [
      'Author undergraduate research paper on EV battery modeling or autonomous mechatronics',
      'Participate in COAP (Common Offer Acceptance Portal) counseling rounds for IISc and IITs',
      'Submit research proposals for Prime Minister’s Research Fellowship (PMRF)',
    ],
    recommendedPortals: [
      { name: 'COAP Counseling Portal', url: 'https://coap.iitk.ac.in', description: 'Centralized offer acceptance portal for M.Tech admissions at IISc and IITs.' },
      { name: 'PMRF Guidelines', url: 'https://pmrf.in', description: 'Prime Minister’s Research Fellowship offering ₹70,000-₹80,000 monthly doctoral stipend.' },
    ],
  },

  'product-design-ui-ux': {
    trackName: 'CEED / Master of Design (M.Des) Track',
    targetEntranceExams: ['CEED (Common Entrance Exam for Design - IIT Bombay)', 'NID DAT (M.Des)'],
    diagnosticCheckpoints: [
      'CEED Part A Visual Perception, Spatial Reasoning & Environmental Design mock',
      'CEED Part B Creative Problem Solving, Problem Framing & Narrative Sketching',
      'Physical modeling and studio material handling simulations',
    ],
    researchAndSOPMilestones: [
      'Curate physical and digital studio portfolio highlighting human-centered design philosophy',
      'Defend studio thesis before IIT design faculty interview panels',
      'Publish research paper on Human-Computer Interaction (HCI) accessibility',
    ],
    recommendedPortals: [
      { name: 'CEED IIT Bombay Official', url: 'https://www.ceed.iitb.ac.in', description: 'Official entrance portal for M.Des at IIT Bombay, IIT Delhi, and IISc.' },
      { name: 'NID Admissions Portal', url: 'https://admissions.nid.edu', description: 'National Institute of Design Master of Design admission guidelines.' },
    ],
  },

  'management-consulting-mba': {
    trackName: 'CAT / GMAT Premier Business School Track',
    targetEntranceExams: ['CAT', 'XAT', 'GMAT', 'GRE'],
    diagnosticCheckpoints: [
      'Target 99.5+ percentile in CAT sectional mocks (VARC, DILR, QA)',
      'Written Ability Test (WAT) essay drills on macroeconomic and geopolitical affairs',
      'Personal interview defenses on undergraduate academic choices and ethics',
    ],
    researchAndSOPMilestones: [
      'Secure shortlists for top business schools (IIM A/B/C, FMS Delhi, ISB, XLRI)',
      'Participate in IIM CAP (Common Admission Process) interviews',
      'Publish business case study on Indian startup economics',
    ],
    recommendedPortals: [
      { name: 'IIM CAT Portal', url: 'https://iimcat.ac.in', description: 'Common admission test for top Indian business schools.' },
      { name: 'Official GMAT Review', url: 'https://www.mba.com', description: 'Official test preparation portal for global MBA programs.' },
    ],
  },

  'corporate-litigation-law': {
    trackName: 'CLAT PG (LLM) / Judicial Services (PCS-J) Track',
    targetEntranceExams: ['CLAT PG (LLM)', 'AILET PG', 'Judicial Services Examination (PCS-J)'],
    diagnosticCheckpoints: [
      'Constitutional Law, Jurisprudence & Criminal Law diagnostic mocks',
      'Procedural Law mastery: CPC, CrPC, and Indian Evidence Act',
      'Judgment writing and charge framing practical simulations',
    ],
    researchAndSOPMilestones: [
      'Secure LLM admission at NLSIU Bengaluru, NALSAR, or WBNUJS',
      'Complete state judicial academy entrance preparation for Civil Judge post',
      'Publish comparative constitutional research paper in peer-reviewed legal journal',
    ],
    recommendedPortals: [
      { name: 'Consortium of NLUs', url: 'https://consortiumofnlus.ac.in', description: 'Common law admission test for National Law Universities.' },
      { name: 'National Judicial Academy', url: 'https://nja.gov.in', description: 'Apex judicial training institute guidelines.' },
    ],
  },

  'biotech-clinical-sciences': {
    trackName: 'IIT JAM / CSIR-UGC NET Life Sciences Track',
    targetEntranceExams: ['IIT JAM (Biotechnology)', 'GAT-B', 'CSIR-UGC NET (JRF)', 'TIFR GS'],
    diagnosticCheckpoints: [
      'Biochemistry, Molecular Biology & Cell Biology diagnostic test',
      'Genetics, Immunology & Microbial Physiology problem sets',
      'Biophysical chemistry and analytical techniques review',
    ],
    researchAndSOPMilestones: [
      'Qualify CSIR-NET JRF for government doctoral research fellowship stipend',
      'Submit Statement of Purpose for IISc, NCBS, and TIFR doctoral laboratories',
      'Publish undergraduate research findings in indexed PubMed journal',
    ],
    recommendedPortals: [
      { name: 'CSIR HRDG Portal', url: 'https://csirhrdg.res.in', description: 'National eligibility test for Junior Research Fellowships.' },
      { name: 'IIT JAM Official', url: 'https://jam.iitm.ac.in', description: 'M.Sc and integrated Ph.D admissions at IITs and IISc.' },
    ],
  },

  'mbbs-clinical-medicine': {
    trackName: 'NEET-PG / NExT / USMLE Global Residency Track',
    targetEntranceExams: ['NEET-PG / NExT', 'USMLE Step 1 & 2 CK', 'PLAB (UK)', 'INICET (AIIMS)'],
    diagnosticCheckpoints: [
      '19-Subject clinical integrated grand test (GT) targeting 150+ correct items',
      'High-yield pathology, pharmacology, and radiology image-based diagnostics',
      'Clinical vignette problem sets under timed exam conditions',
    ],
    researchAndSOPMilestones: [
      'Secure clinical branch rank in top 5,000 in NEET-PG / INICET',
      'Complete USMLE Step 2 CK with 250+ score for US residency match',
      'Publish clinical audit or case study in PubMed indexed journal',
    ],
    recommendedPortals: [
      { name: 'Medical Counselling Committee (MCC)', url: 'https://mcc.nic.in', description: 'Centralized PG counseling for MD/MS/DNB seats.' },
      { name: 'USMLE Official', url: 'https://www.usmle.org', description: 'United States Medical Licensing Examination guidelines.' },
    ],
  },

  'civil-services-governance': {
    trackName: 'UPSC Civil Services Examination / MPP Track',
    targetEntranceExams: ['UPSC Civil Services Examination (CSE)', 'State PSC Administrative Services', 'NLSIU MPP'],
    diagnosticCheckpoints: [
      'Prelims GS Paper I (History, Polity, Geography, Economy, Environment) mocks',
      'CSAT Paper II analytical reasoning and comprehension accuracy checks',
      'Optional Subject syllabus completion (500 marks in Mains)',
    ],
    researchAndSOPMilestones: [
      'Clear UPSC CSE Prelims and Mains written examinations',
      'Defend Detailed Application Form (DAF) before UPSC interview board',
      'Secure admission to Lal Bahadur Shastri National Academy of Administration (LBSNAA)',
    ],
    recommendedPortals: [
      { name: 'UPSC Official Portal', url: 'https://upsc.gov.in', description: 'Official notification, syllabus, and examination schedules for Indian Civil Services.' },
      { name: 'LBSNAA Official', url: 'https://www.lbsnaa.gov.in', description: 'Premier training academy for IAS officers.' },
    ],
  },
};

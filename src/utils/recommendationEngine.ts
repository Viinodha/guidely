/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CareerPath, CAREER_DATABASE, CollegeRoadmap, RoadmapMilestone } from '../data/careerDatabase';
import { StudentProfile, RecommendationRationale, ExplainableScoreBreakdown, PlacementResourceKit, HigherEducationKit } from '../types/student';

export interface CareerComparisonMetrics {
  interestScore: number; // 0-100
  skillAlignment: number; // 0-100
  demand: number; // 0-100
  overallMatch: number; // 0-100
}

export interface ScoredCareer {
  career: CareerPath;
  score: number;
  isEligible: boolean;
  scoreBreakdown: ExplainableScoreBreakdown;
  rationale: RecommendationRationale;
  comparisonMetrics: CareerComparisonMetrics;
}

/**
 * Deterministically checks stream compatibility and calculates a rule-based match score
 * differentiating between 'Higher Education' and 'Career/Placement' tracks for college users,
 * and appends personalized placement preparation resources (DSA patterns, mock interview tips,
 * industry portfolios) into the student's roadmap.
 */
export function calculateCareerMatches(profile: StudentProfile): ScoredCareer[] {
  const rawStream = (profile.streamOrMajor || '').toLowerCase();
  const userType = profile.userType;
  const favSubjects = (profile.favoriteSubjects || []).map((s) => s.toLowerCase());
  const userWorkStyles = (profile.workStyle || []).map((w) => w.toLowerCase());
  const userPercentage = profile.academicScoreType === 'cgpa' ? profile.academicScore * 9.5 : profile.academicScore;
  const collegeGoal = profile.collegeGoal || 'placements';

  // --- MUTUALLY EXCLUSIVE STREAM CLASSIFICATION ---
  const isCommerce = rawStream.includes('commerce') || rawStream.includes('b.com') || rawStream.includes('bba') || rawStream.includes('finance') || rawStream.includes('accountancy');
  const isArts = rawStream.includes('humanities') || rawStream.includes('arts') || rawStream.includes('social sciences') || rawStream.includes('policy') || rawStream.includes('journalism') || rawStream.includes('law');
  const isDesign = rawStream.includes('design') || rawStream.includes('architecture') || rawStream.includes('b.des') || rawStream.includes('b.arch');
  const isLifeSciences = (rawStream.includes('life sciences') || rawStream.includes('pure sciences') || rawStream.includes('b.sc') || rawStream.includes('botany') || rawStream.includes('zoology')) && !rawStream.includes('computer');
  const isPCMB = rawStream.includes('pcmb');
  const isPCB = (rawStream.includes('pcb') || rawStream.includes('biology') || rawStream.includes('medical')) && !rawStream.includes('pcm') && !rawStream.includes('commerce');
  const isCoreEng = rawStream.includes('mechanical') || rawStream.includes('civil') || rawStream.includes('eee') || rawStream.includes('ece') || rawStream.includes('core engineering');
  const isPCM = !isCommerce && !isArts && !isPCB && (rawStream.includes('pcm') || rawStream.includes('computer science') || rawStream.includes('cse') || rawStream.includes('it') || rawStream.includes('data & ai') || rawStream.includes('bca') || isPCMB);

  const scored: ScoredCareer[] = CAREER_DATABASE.map((originalCareer) => {
    let isEligible = true;
    let streamPts = 0;
    let streamRationale = '';

    // Clone career so we can safely augment roadmaps per user
    const career: CareerPath = JSON.parse(JSON.stringify(originalCareer));

    // ==========================================
    // 1. STREAM PREREQUISITE & COMPATIBILITY (Max 35 pts)
    // ==========================================
    if (career.id === 'ai-software-engineering') {
      if (isPCM) {
        streamPts = 35;
        streamRationale = 'Full alignment: Physics & Mathematics background directly satisfies national engineering entrance criteria (JEE / State CETs).';
      } else if (isCoreEng) {
        streamPts = 26;
        streamRationale = 'Eligible transition: Core engineering foundation allows specialization in computational systems, embedded software, and software development.';
      } else if (isCommerce) {
        streamPts = -35;
        isEligible = false;
        streamRationale = 'Strict Ineligibility: In India, undergraduate B.Tech Software Engineering admissions mandate 10+2 Physics & Mathematics (PCM). Commerce students cannot appear for JEE or B.Tech admissions.';
      } else if (isPCB && !isPCMB) {
        streamPts = -35;
        isEligible = false;
        streamRationale = 'Strict Ineligibility: Engineering admissions mandate 10+2 Mathematics. Medical PCB candidates without Mathematics cannot apply for B.Tech engineering programs.';
      } else if (isArts) {
        streamPts = -35;
        isEligible = false;
        streamRationale = 'Strict Ineligibility: Software engineering B.Tech programs legally require 10+2 Mathematics and Physics under AICTE regulations.';
      } else {
        streamPts = -25;
        isEligible = false;
        streamRationale = 'Prerequisite mismatch: Requires formal qualification in Mathematics and Physical Sciences.';
      }
    } else if (career.id === 'chartered-accountancy-finance') {
      if (isCommerce) {
        streamPts = 35;
        streamRationale = 'Direct stream match: Commerce curriculum is the natural foundation for ICAI Foundation, Intermediate, statutory audit, and corporate finance.';
      } else if (isPCM || isCoreEng) {
        streamPts = 26;
        streamRationale = 'Strong mathematical logic: Quantitative problem solving provides high leverage in investment banking, financial modeling, and risk analytics.';
      } else if (isArts) {
        streamPts = 22;
        streamRationale = 'Eligible under ICAI open guidelines; requires picking up foundational financial accounting principles.';
      } else {
        streamPts = 18;
        streamRationale = 'Open eligibility under ICAI regulations with bridging preparation in double-entry bookkeeping.';
      }
    } else if (career.id === 'mbbs-clinical-medicine') {
      if (isPCB || isPCMB) {
        streamPts = 35;
        streamRationale = 'Full prerequisite match: 10+2 Biology, Chemistry, and Physics strictly satisfy National Eligibility cum Entrance Test (NEET-UG) criteria.';
      } else {
        streamPts = -45;
        isEligible = false;
        streamRationale = 'Strict Ineligibility: Medical practice and MBBS admissions legally mandate 10+2 Biology (PCB). Non-biology candidates cannot sit for NEET-UG.';
      }
    } else if (career.id === 'core-engineering-robotics') {
      if (isCoreEng) {
        streamPts = 35;
        streamRationale = 'Direct major alignment: Core engineering disciplines (Mechanical/EEE/ECE/Civil) form the bedrock for robotics, EV powertrains, and hardware systems.';
      } else if (isPCM) {
        streamPts = 34;
        streamRationale = 'Full prerequisite match: 10+2 Physics and Mathematics directly satisfy engineering entrance criteria (JEE Main/Advanced).';
      } else {
        streamPts = -35;
        isEligible = false;
        streamRationale = 'Strict Ineligibility: Core engineering requires 10+2 Physics and Mathematics (PCM).';
      }
    } else if (career.id === 'biotech-clinical-sciences') {
      if (isLifeSciences || isPCB || isPCMB) {
        streamPts = 35;
        streamRationale = 'Direct discipline match: Biological Sciences foundation directly feeds into recombinant DNA research, bioinformatics, and biopharma discoveries.';
      } else if (isPCM) {
        streamPts = 22;
        streamRationale = 'Viable cross-discipline route into computational biology, biophysics, and genomic data modeling.';
      } else {
        streamPts = -30;
        isEligible = false;
        streamRationale = 'Prerequisite gap: Laboratory biotechnology and genomics require formal background in biological sciences and chemistry.';
      }
    } else if (career.id === 'corporate-litigation-law') {
      if (isArts) {
        streamPts = 35;
        streamRationale = 'Natural synergy: Humanities reading comprehension, political theory, and legal reasoning strongly align with CLAT and judicial analysis.';
      } else if (isCommerce) {
        streamPts = 34;
        streamRationale = 'High commercial leverage: Corporate law, mergers & acquisitions, GST taxation, and corporate governance pair exceptionally well with Commerce.';
      } else if (isPCM || isCoreEng) {
        streamPts = 28;
        streamRationale = 'Analytical advantage: Rigorous logical structuring aids intellectual property (IPR), techno-legal policy, and cross-border arbitration.';
      } else {
        streamPts = 26;
        streamRationale = 'Open eligibility: CLAT and law degree admissions are open to all academic disciplines.';
      }
    } else if (career.id === 'civil-services-governance') {
      if (isArts) {
        streamPts = 35;
        streamRationale = 'Direct curriculum overlap: UPSC General Studies syllabus directly draws from History, Political Science, Geography, and Indian Economy.';
      } else if (isCommerce) {
        streamPts = 32;
        streamRationale = 'Substantive expertise in Indian public finance, fiscal administration, and economic governance for civil services.';
      } else if (isPCM || isCoreEng) {
        streamPts = 30;
        streamRationale = 'Analytical mindset aids CSAT Paper II, quantitative decision making, and engineering optional subjects in UPSC CSE.';
      } else if (isPCB || isLifeSciences) {
        streamPts = 29;
        streamRationale = 'Scientific rigor aids Public Health administration and science optional subjects in UPSC.';
      } else {
        streamPts = 25;
        streamRationale = 'Open eligibility: UPSC Civil Services Examination requires any recognized undergraduate degree.';
      }
    } else if (career.id === 'product-design-ui-ux') {
      if (isDesign) {
        streamPts = 35;
        streamRationale = 'Direct vocational alignment: Creative studio portfolio and design perception match UCEED / NID DAT criteria.';
      } else if (isArts) {
        streamPts = 33;
        streamRationale = 'High qualitative empathy: Human psychology, visual storytelling, and cultural anthropology strongly enhance user experience design.';
      } else if (isCommerce || isPCM) {
        streamPts = 28;
        streamRationale = 'Valuable cross-discipline perspective: Digital product design increasingly prizes logical information architecture and business impact.';
      } else {
        streamPts = 24;
        streamRationale = 'Design entrance examinations evaluate creative aptitude, observational sketching, and lateral problem solving rather than formal stream.';
      }
    } else if (career.id === 'management-consulting-mba') {
      if (isCommerce && userType === 'college') {
        streamPts = 35;
        streamRationale = 'Direct business alignment: Financial accounting, corporate strategy, and marketing management directly feed into premier MBA programs.';
      } else if ((isCoreEng || isPCM) && userType === 'college') {
        streamPts = 33;
        streamRationale = 'High consulting demand: Top strategy consulting firms (McKinsey, BCG, Bain) recruit heavily from quantitative and analytical engineering backgrounds.';
      } else if (isArts) {
        streamPts = 32;
        streamRationale = 'Academic diversity advantage: Premier Indian Institutes of Management (IIMs) award explicit diversity rating points to non-engineering candidates.';
      } else {
        streamPts = 26;
        streamRationale = 'Open eligibility: Top national MBA entrance examinations (CAT / XAT / GMAT) welcome graduates from all academic disciplines.';
      }
    } else {
      streamPts = 20;
      streamRationale = 'General academic baseline evaluation.';
    }

    // ==========================================
    // 2. SUBJECT AFFINITY OVERLAP (Max 25 pts)
    // ==========================================
    let subjectPts = 0;
    const matchingSubjects: string[] = [];
    const careerText = (career.title + ' ' + career.description + ' ' + career.criticalSkills.join(' ')).toLowerCase();

    for (const subj of favSubjects) {
      if ((subj.includes('math') || subj.includes('calculus')) && (careerText.includes('math') || careerText.includes('algorithm') || careerText.includes('quant') || careerText.includes('mechanics') || careerText.includes('modeling') || career.category === 'Engineering & Technology')) {
        subjectPts += 10;
        matchingSubjects.push('Mathematics');
      }
      if (subj.includes('computer') && (careerText.includes('software') || careerText.includes('code') || careerText.includes('cloud') || careerText.includes('data') || careerText.includes('systems') || careerText.includes('embedded'))) {
        subjectPts += 10;
        matchingSubjects.push('Computer Science');
      }
      if (subj.includes('biology') && (careerText.includes('medicine') || careerText.includes('clinical') || careerText.includes('genomics') || careerText.includes('biotech') || careerText.includes('dna'))) {
        subjectPts += 12;
        matchingSubjects.push('Biology & Life Sciences');
      }
      if (subj.includes('economics') && (careerText.includes('finance') || careerText.includes('consulting') || careerText.includes('policy') || careerText.includes('macro') || careerText.includes('mba'))) {
        subjectPts += 11;
        matchingSubjects.push('Economics & Finance');
      }
      if (subj.includes('accountancy') && (careerText.includes('audit') || careerText.includes('tax') || careerText.includes('accounting') || careerText.includes('financial statement'))) {
        subjectPts += 12;
        matchingSubjects.push('Accountancy & Auditing');
      }
      if (subj.includes('business') && (careerText.includes('consulting') || careerText.includes('mba') || careerText.includes('management') || careerText.includes('corporate'))) {
        subjectPts += 10;
        matchingSubjects.push('Business Management');
      }
      if ((subj.includes('polity') || subj.includes('legal') || subj.includes('history')) && (careerText.includes('law') || careerText.includes('judiciary') || careerText.includes('civil') || careerText.includes('governance') || careerText.includes('policy'))) {
        subjectPts += 12;
        matchingSubjects.push('Polity & Legal Reasoning');
      }
      if ((subj.includes('design') || subj.includes('art') || subj.includes('creative')) && (careerText.includes('design') || careerText.includes('ui') || careerText.includes('creative') || careerText.includes('prototyping'))) {
        subjectPts += 12;
        matchingSubjects.push('Design & Aesthetics');
      }
      if ((subj.includes('physics') || subj.includes('mechanics')) && (careerText.includes('engineering') || careerText.includes('robotics') || careerText.includes('physics') || careerText.includes('hardware'))) {
        subjectPts += 10;
        matchingSubjects.push('Physics & Engineering');
      }
    }
    const finalSubjectScore = Math.min(Math.max(subjectPts, 6), 25);
    const subjectRationale = matchingSubjects.length > 0
      ? `Direct synergy (+${finalSubjectScore} pts) with your favorite subject areas: ${matchingSubjects.join(' & ')}.`
      : 'Baseline cognitive correlation with foundational domain requirements.';

    // ==========================================
    // 3. ACADEMIC PERFORMANCE (Max 15 pts)
    // ==========================================
    const minRequired = career.eligibilityRequirements.minimumPercentage;
    let academicPts = 0;
    let academicRationale = '';

    if (userPercentage >= minRequired + 25) {
      academicPts = 15;
      academicRationale = `Strong safety margin (+15 pts): Your benchmark of ${profile.academicScore}${profile.academicScoreType === 'cgpa' ? ' CGPA' : '%'} exceeds the minimum cutoff (${minRequired}%) by +${Math.round(userPercentage - minRequired)}%.`;
    } else if (userPercentage >= minRequired + 10) {
      academicPts = 12;
      academicRationale = `Comfortable buffer (+12 pts): Your academic score safely satisfies the eligibility threshold (${minRequired}%).`;
    } else if (userPercentage >= minRequired) {
      academicPts = 8;
      academicRationale = `Meets minimum threshold (+8 pts): Meets the ${minRequired}% cutoff, but will require high percentile in entrance exams.`;
    } else {
      academicPts = 0;
      isEligible = false;
      academicRationale = `Below cutoff (0 pts): Does not satisfy the minimum qualifying threshold of ${minRequired}%.`;
    }

    // ==========================================
    // 4. WORK STYLE & BEHAVIORAL FIT (Max 15 pts)
    // ==========================================
    let workStylePts = 0;
    const matchingStyles: string[] = [];

    for (const tag of career.workStyleTags) {
      const tagWords = tag.toLowerCase().split(/[\s,&-]+/);
      for (const uStyle of userWorkStyles) {
        const uWords = uStyle.toLowerCase().split(/[\s,&-]+/);
        const hasOverlap = tagWords.some((tw) => tw.length >= 4 && uWords.some((uw) => uw.includes(tw) || tw.includes(uw)));
        if (hasOverlap) {
          workStylePts += 5;
          matchingStyles.push(tag);
          break;
        }
      }
    }
    const finalWorkStyleScore = Math.min(Math.max(workStylePts, 6), 15);
    const workStyleRationale = matchingStyles.length > 0
      ? `Strong behavioral fit (+${finalWorkStyleScore} pts): Aligns with your preferred work traits: ${matchingStyles.slice(0, 2).join(', ')}.`
      : 'General operational compatibility with day-to-day career demands.';

    // ==========================================
    // 5. BUDGET, AUDIENCE & CAREER/HIGHER ED TRACK FIT (Max 10 pts)
    // ==========================================
    let budgetGoalPts = 5;
    let budgetGoalRationale = 'Matches target location hubs and general preferences.';

    if (career.targetAudience === userType || career.targetAudience === 'both') {
      budgetGoalPts += 2;
    }

    // DIFFERENTIATION BETWEEN HIGHER EDUCATION AND CAREER/PLACEMENT TRACKS
    if (userType === 'college') {
      if (collegeGoal === 'placements') {
        // Boost careers with high-yield corporate recruitment and fast break-even
        if (career.roiIndicator.investmentRating === 'Exceptional ROI' || career.roiIndicator.investmentRating === 'High ROI') {
          budgetGoalPts += 3;
          budgetGoalRationale = `Direct Career/Placement Track: Strong campus recruitment pipeline with starting CTC of ${career.estimatedSalaryRange.entry} and verified break-even of ${career.roiIndicator.breakEvenPeriod}.`;
        } else {
          budgetGoalPts += 2;
          budgetGoalRationale = `Direct Career Track: Corporate recruitment opportunities with entry compensation of ${career.estimatedSalaryRange.entry}.`;
        }
      } else if (collegeGoal === 'higher_education') {
        // Boost careers with top research and postgraduate entrance gateways
        const hasPostgradExams = career.keyExams.some((e) => e.name.includes('GATE') || e.name.includes('CAT') || e.name.includes('NET') || e.name.includes('CEED') || e.name.includes('JAM') || e.name.includes('GMAT'));
        if (hasPostgradExams || career.collegeRoadmap?.higherEducation) {
          budgetGoalPts += 3;
          budgetGoalRationale = `Higher Education Track: Premier postgraduate academic gateway (${career.keyExams.slice(0, 2).map((e) => e.name).join(', ')}) with research fellowships and institutional prestige.`;
        } else {
          budgetGoalPts += 1;
          budgetGoalRationale = 'Higher Education Track: General academic progression.';
        }
      } else if (collegeGoal === 'public_sector') {
        if (career.category.includes('Law') || career.category.includes('Civil Services') || career.keyExams.some((e) => e.name.includes('UPSC') || e.name.includes('PSC') || e.name.includes('ESE'))) {
          budgetGoalPts += 3;
          budgetGoalRationale = 'Public Sector Track: Prestigious sovereign service recruitment pathways with high public impact.';
        }
      }
    }

    if (profile.budgetPreference.includes('Subsidized') && career.budgetFit.includes('Subsidized')) {
      budgetGoalPts += 1;
      budgetGoalRationale += ' Government-subsidized fee structures match your financial preferences.';
    } else if (profile.budgetPreference.includes('Premium') || profile.budgetPreference.includes('Flexible')) {
      budgetGoalPts += 1;
    }
    const finalBudgetGoalScore = Math.min(budgetGoalPts, 10);

    // ==========================================
    // TOTAL SCORE & TRANSPARENT EXPLAINABILITY
    // ==========================================
    const rawTotal = streamPts + finalSubjectScore + academicPts + finalWorkStyleScore + finalBudgetGoalScore;
    
    // Eligible careers score 50 to 98. Ineligible careers are strictly capped at 25-38
    const finalScore = isEligible
      ? Math.min(Math.max(Math.round(rawTotal), 52), 98)
      : Math.min(Math.max(Math.round(rawTotal), 15), 38);

    const calculationEquation = `${Math.max(streamPts, 0)} (Stream) + ${finalSubjectScore} (Subjects) + ${academicPts} (Academic) + ${finalWorkStyleScore} (Work Style) + ${finalBudgetGoalScore} (Goals & Track) = ${finalScore}% Match`;

    const scoreExplanation = isEligible
      ? `How Guidley calculated ${finalScore}%: You earned ${Math.max(streamPts, 0)}/35 pts for Stream qualification (${streamRationale}), ${finalSubjectScore}/25 pts for Subject affinity (${subjectRationale}), ${academicPts}/15 pts for Academic benchmark (${academicRationale}), ${finalWorkStyleScore}/15 pts for Work style fit (${workStyleRationale}), and ${finalBudgetGoalScore}/10 pts for ${userType === 'college' ? (collegeGoal === 'placements' ? 'Career/Placement Track' : 'Higher Education Track') : 'Audience Goals'} (${budgetGoalRationale}). Total confidence index: ${finalScore}%.`
      : `Why this is ${finalScore}% (Ineligible): This pathway received 0 pts for stream compatibility due to statutory educational prerequisites: ${streamRationale}.`;

    const scoreBreakdown: ExplainableScoreBreakdown = {
      streamMatch: {
        score: Math.max(streamPts, 0),
        max: 35,
        percentage: Math.round((Math.max(streamPts, 0) / 35) * 100),
        factorTitle: 'Stream & Prerequisite Alignment',
        rationale: streamRationale,
      },
      subjectMatch: {
        score: finalSubjectScore,
        max: 25,
        percentage: Math.round((finalSubjectScore / 25) * 100),
        factorTitle: 'Subject Aptitude & Affinity',
        rationale: subjectRationale,
      },
      academicPerformance: {
        score: academicPts,
        max: 15,
        percentage: Math.round((academicPts / 15) * 100),
        factorTitle: 'Academic Cutoff & Performance Buffer',
        rationale: academicRationale,
      },
      workStyle: {
        score: finalWorkStyleScore,
        max: 15,
        percentage: Math.round((finalWorkStyleScore / 15) * 100),
        factorTitle: 'Work Style & Behavioral Traits',
        rationale: workStyleRationale,
      },
      budgetAndGoals: {
        score: finalBudgetGoalScore,
        max: 10,
        percentage: Math.round((finalBudgetGoalScore / 10) * 100),
        factorTitle: userType === 'college' ? (collegeGoal === 'placements' ? 'Career/Placement Track Fit' : 'Higher Education Track Fit') : 'Career Trajectory & Budget Goals',
        rationale: budgetGoalRationale,
      },
      totalCalculatedScore: finalScore,
      calculationEquation,
      scoreExplanation,
    };

    // ==========================================
    // APPEND PLACEMENT PREPARATION RESOURCES INTO ROADMAP FOR CAREER TRACK
    // ==========================================
    if (userType === 'college' && collegeGoal === 'placements' && career.placementPreparationKit && career.collegeRoadmap) {
      const kit = career.placementPreparationKit;
      
      // Augment Immediate Stage
      if (career.collegeRoadmap.placements[0]) {
        const stage = career.collegeRoadmap.placements[0];
        const newActions = [
          `[Core Practice Pattern] Master: ${kit.corePracticePatterns[0]}`,
          `[Industry Portfolio Milestone] Complete: ${kit.industryPortfolioRequirements[0]}`,
          ...stage.actions,
        ];
        stage.actions = Array.from(new Set(newActions));
        stage.recommendedResources = Array.from(new Set([
          ...stage.recommendedResources,
          ...kit.recommendedPlatforms.map((p) => `${p.name} (${p.description})`),
        ]));
      }

      // Augment 6-Month Stage
      if (career.collegeRoadmap.placements[1]) {
        const stage = career.collegeRoadmap.placements[1];
        const newActions = [
          `[Mock Interview Playbook] ${kit.mockInterviewTips[0]}`,
          `[Core Practice Pattern] Deep dive: ${kit.corePracticePatterns[1] || kit.corePracticePatterns[0]}`,
          ...stage.actions,
        ];
        stage.actions = Array.from(new Set(newActions));
        stage.recommendedResources = Array.from(new Set([
          ...stage.recommendedResources,
          `Peer Mock Simulations (STAR Behavioral Framework)`,
        ]));
      }

      // Augment 2-Year Stage
      if (career.collegeRoadmap.placements[2]) {
        const stage = career.collegeRoadmap.placements[2];
        const newActions = [
          `[Verified Portfolio Verification] Deploy: ${kit.industryPortfolioRequirements[1] || kit.industryPortfolioRequirements[0]}`,
          `[Interview Negotiation] Master ${kit.mockInterviewTips[2] || kit.mockInterviewTips[0]}`,
          ...stage.actions,
        ];
        stage.actions = Array.from(new Set(newActions));
      }
    }

    const rationale = buildDeterministicRationale(career, profile, finalScore, isEligible, scoreBreakdown);

    // Compute normalized 0-100 visual comparison metrics
    const interestScore = Math.min(
      100,
      Math.max(25, Math.round(scoreBreakdown.subjectMatch.percentage * 0.65 + scoreBreakdown.workStyle.percentage * 0.35))
    );
    const skillAlignment = isEligible
      ? Math.min(
          100,
          Math.max(35, Math.round(scoreBreakdown.streamMatch.percentage * 0.70 + scoreBreakdown.academicPerformance.percentage * 0.30))
        )
      : Math.min(30, Math.round(scoreBreakdown.academicPerformance.percentage * 0.30));
    const demand = career.futureDemandScore;

    const comparisonMetrics: CareerComparisonMetrics = {
      interestScore,
      skillAlignment,
      demand,
      overallMatch: finalScore,
    };

    return {
      career,
      score: finalScore,
      isEligible,
      scoreBreakdown,
      rationale,
      comparisonMetrics,
    };
  });

  // Sort descending: eligible careers first, then by match score
  return scored.sort((a, b) => {
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    return b.score - a.score;
  });
}

function buildDeterministicRationale(
  career: CareerPath,
  profile: StudentProfile,
  matchPercentage: number,
  isEligible: boolean,
  breakdown: ExplainableScoreBreakdown
): RecommendationRationale {
  const isSchool = profile.userType === 'school';
  const isCollege = profile.userType === 'college';
  const collegeGoal = profile.collegeGoal || 'placements';
  const placementKit = career.placementPreparationKit;
  const higherEdKit = career.higherEducationKit;

  const whyItFits: string[] = [
    `Stream Prerequisite (${breakdown.streamMatch.score}/35): ${breakdown.streamMatch.rationale}`,
    `Subject Aptitude (${breakdown.subjectMatch.score}/25): ${breakdown.subjectMatch.rationale}`,
    isSchool
      ? `Clear, structured undergraduate entrance route via premier national examinations (${career.keyExams.slice(0, 2).map((e) => e.name).join(', ')}).`
      : collegeGoal === 'placements'
      ? `High-leverage industry career transition with entry compensation of ${career.estimatedSalaryRange.entry} and verified placement pipelines.`
      : `Rigorous academic gateway for postgraduate specialization (${career.keyExams.slice(0, 2).map((e) => e.name).join(', ')}).`,
  ];

  const criticalWatchouts: string[] = [
    isEligible
      ? `Competitive acceptance ratios: Premier institutions (${career.topInstitutions[0]?.name}) admit less than 1-2% of applicants; requires disciplined weekly mock test routines.`
      : `Eligibility constraint alert: This pathway strictly requires ${career.eligibilityRequirements.streamConstraints.join(' / ')} qualifications.`,
    `Rigorous timeline commitment: Requires 12-18 months of focused preparation alongside ${isSchool ? 'Class 12th Board examinations' : 'College degree coursework'}.`,
    `Financial planning: Estimated education cost is ${career.roiIndicator.estimatedEducationCost}; verify scholarship availability early.`,
  ];

  let personalizedNextSteps: string[] = [];

  if (isSchool) {
    personalizedNextSteps = [
      `Download official syllabus and 5 years of past solved question papers for ${career.keyExams[0]?.name || 'key entrance exam'} from ${career.keyExams[0]?.officialPortal || 'the official portal'}.`,
      `Commit a weekly study block of 14-18 focused hours dedicated to ${career.criticalSkills.slice(0, 2).join(' and ')}.`,
      `Bookmark this career in Guidley and follow the interactive 3-stage milestone checklist.`,
    ];
  } else if (collegeGoal === 'placements' && placementKit) {
    // APPEND PLACEMENT PREPARATION RESOURCES INTO PERSONALIZED STEPS
    personalizedNextSteps = [
      `[Core Practice Pattern] Master: ${placementKit.corePracticePatterns[0]}`,
      `[Mock Interview Playbook] ${placementKit.mockInterviewTips[0]}`,
      `[Industry Portfolio Milestone] Build and deploy: ${placementKit.industryPortfolioRequirements[0]}`,
      `Format single-page ATS resume and outreach on ${placementKit.recommendedPlatforms[0]?.name || 'LinkedIn Jobs'} for alumni referrals.`,
    ];
  } else if (collegeGoal === 'higher_education' && higherEdKit) {
    personalizedNextSteps = [
      `[Diagnostic Checkpoint] Complete: ${higherEdKit.diagnosticCheckpoints[0] || 'Official syllabus analysis'}`,
      `[Research & SOP Milestone] ${higherEdKit.researchAndSOPMilestones[0] || 'Draft statement of purpose'}`,
      `Solve 10 years of previous year papers for ${higherEdKit.targetEntranceExams[0] || career.keyExams[0]?.name}.`,
      `Access practice resources on ${higherEdKit.recommendedPortals[0]?.name || 'the official portal'}.`,
    ];
  } else {
    personalizedNextSteps = [
      `Review the official syllabus and previous 10-year question papers for ${career.keyExams[0]?.name || 'entrance exam'}.`,
      `Identify faculty research guides and draft Statement of Purpose (SOP) early.`,
      `Enroll in proctored national mock test series and track percentile accuracy.`,
    ];
  }

  return {
    matchPercentage,
    whyItFits,
    criticalWatchouts,
    personalizedNextSteps,
    strategicAdvice: isCollege && collegeGoal === 'placements'
      ? `Career/Placement Track active: Focus on quantifiable project impact (the Google XYZ formula) and solve domain practice patterns daily.`
      : `Based on your ${profile.academicScore}${profile.academicScoreType === 'cgpa' ? ' CGPA' : '% marks'} profile, you have a solid foundation for ${career.title}. Prioritize mock test consistency and time management.`,
    scoreBreakdown: breakdown,
    scoreExplanation: breakdown.scoreExplanation,
    placementPrepKit: placementKit,
    higherEducationKit: higherEdKit,
  };
}

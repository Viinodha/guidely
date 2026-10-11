/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserType = 'school' | 'college';

export interface ScoreFactor {
  score: number;
  max: number;
  percentage: number;
  factorTitle: string;
  rationale: string;
}

export interface ExplainableScoreBreakdown {
  streamMatch: ScoreFactor;
  subjectMatch: ScoreFactor;
  academicPerformance: ScoreFactor;
  workStyle: ScoreFactor;
  budgetAndGoals: ScoreFactor;
  totalCalculatedScore: number;
  calculationEquation: string;
  scoreExplanation: string;
}

export interface StudentProfile {
  userType: UserType;
  // School student fields
  schoolLevel?: 'Class 9-10 (Foundations & Stream Selection)' | 'Class 11-12 (Entrance & Board Focus)';
  
  // College student fields
  collegeYear?: '1st Year (Exploring & Foundations)' | '2nd Year (Core Skills & Internships)' | '3rd / 4th Year (Placements & Exams)' | 'Graduated / Preparing';
  collegeGoal?: 'placements' | 'higher_education' | 'public_sector'; // Placements vs Masters vs Competitive exams
  
  streamOrMajor: string;
  academicScore: number;
  academicScoreType: 'percentage' | 'cgpa';
  favoriteSubjects: string[];
  
  preferredLocations: ('Tier 1 Metro' | 'Tier 2 Emerging' | 'Pan-India / State Hubs' | 'Remote / Hybrid')[];
  budgetPreference: 'Government Subsidized (< ₹2.5L)' | 'Moderate (₹3L - ₹10L)' | 'Premium (₹10L - ₹25L+)' | 'Flexible / Merit Scholarships';
  workStyle: string[];
  entranceExamReadiness: 'Already preparing intensively' | 'Planning to start now' | 'Prefer direct merit / low-exam pathways' | 'Open to guidance';
  
  bookmarks: string[];
  completedMilestones?: { [careerId: string]: string[] };
  lastUpdated: string;
  syncCode?: string;
  studentName?: string;
}

export interface PlacementResourceKit {
  trackName: string;
  corePracticePatterns: string[]; // e.g. DSA patterns, financial modeling, consulting case frameworks
  mockInterviewTips: string[];    // e.g. STAR behavioral techniques, live system design, partner interview defense
  industryPortfolioRequirements: string[]; // e.g. 2 deployed production apps with DB indexing, 3 DCF models, UX case studies
  recommendedPlatforms: { name: string; url?: string; description: string }[];
}

export interface HigherEducationKit {
  trackName: string;
  targetEntranceExams: string[];
  diagnosticCheckpoints: string[];
  researchAndSOPMilestones: string[];
  recommendedPortals: { name: string; url?: string; description: string }[];
}

export interface RecommendationRationale {
  matchPercentage: number;
  whyItFits: string[];
  criticalWatchouts: string[];
  personalizedNextSteps: string[];
  strategicAdvice?: string;
  scoreBreakdown?: ExplainableScoreBreakdown;
  scoreExplanation?: string;
  placementPrepKit?: PlacementResourceKit;
  higherEducationKit?: HigherEducationKit;
}

export interface RecommendationMap {
  [careerId: string]: RecommendationRationale;
}

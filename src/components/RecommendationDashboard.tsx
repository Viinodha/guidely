/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  BookmarkCheck, 
  AlertTriangle, 
  Check, 
  IndianRupee, 
  BookOpen, 
  MessageSquareText, 
  Search, 
  Zap,
  ListTodo,
  CheckCircle2,
  Plus,
  Briefcase,
  GraduationCap,
  Scale,
  Target,
  Layers,
  Code2,
  Lightbulb,
  FileText,
  ExternalLink
} from 'lucide-react';
import { CareerPath } from '../data/careerDatabase';
import { StudentProfile, RecommendationRationale, RecommendationMap } from '../types/student';
import { calculateCareerMatches, ScoredCareer } from '../utils/recommendationEngine';
import { CollegePlacementHub } from './CollegePlacementHub';
import { CareerComparisonChart, SingleCareerMiniVisualizer } from './CareerComparisonChart';

interface RecommendationDashboardProps {
  profile: StudentProfile;
  onBookmark: (careerId: string) => void;
  onToggleMilestone: (careerId: string, item: string) => void;
  onOpenAdvisorForCareer: (career: CareerPath) => void;
  onRetakeAssessment: () => void;
  onUpdateProfile?: (updates: Partial<StudentProfile>) => void;
}

export const RecommendationDashboard: React.FC<RecommendationDashboardProps> = ({
  profile,
  onBookmark,
  onToggleMilestone,
  onOpenAdvisorForCareer,
  onRetakeAssessment,
  onUpdateProfile,
}) => {
  const [scoredMatches, setScoredMatches] = useState<ScoredCareer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCareerId, setExpandedCareerId] = useState<string | null>(null);
  const [activeTabByCareer, setActiveTabByCareer] = useState<{ [id: string]: 'rationale' | 'milestones' | 'exams' | 'institutions' }>({});
  
  // Trajectory override per career for college students ('placements' vs 'higher_education')
  const [collegeTrajectoryByCareer, setCollegeTrajectoryByCareer] = useState<{ [id: string]: 'placements' | 'higher_education' }>({});

  // Custom user milestones state stored locally
  const [customMilestones, setCustomMilestones] = useState<{ [careerId: string]: string[] }>(() => {
    try {
      const saved = localStorage.getItem('guidley_custom_milestones');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [newMilestoneInput, setNewMilestoneInput] = useState<{ [careerId: string]: string }>({});

  // Synthesized AI rationales cache & loading states
  const [synthesizedRationales, setSynthesizedRationales] = useState<RecommendationMap>({});
  const [synthesizingCareerId, setSynthesizingCareerId] = useState<string | null>(null);

  // Re-calculate matches when profile changes
  useEffect(() => {
    const matches = calculateCareerMatches(profile);
    setScoredMatches(matches);
    if (matches.length > 0 && !expandedCareerId) {
      setExpandedCareerId(matches[0].career.id);
    }
  }, [profile]);

  // Top overall match score for hero dial
  const topMatch = scoredMatches[0];
  const topScore = topMatch ? topMatch.score : 85;

  const handleAddCustomMilestone = (careerId: string) => {
    const text = (newMilestoneInput[careerId] || '').trim();
    if (!text) return;
    setCustomMilestones((prev) => {
      const list = prev[careerId] || [];
      if (list.includes(text)) return prev;
      const updated = { ...prev, [careerId]: [...list, text] };
      try {
        localStorage.setItem('guidley_custom_milestones', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setNewMilestoneInput((prev) => ({ ...prev, [careerId]: '' }));
  };

  // Helper to get active milestones for a career depending on student mode and trajectory
  const getActiveMilestones = (career: CareerPath) => {
    if (profile.userType === 'college' && career.collegeRoadmap) {
      const trajectory = collegeTrajectoryByCareer[career.id] || profile.collegeGoal || 'placements';
      return trajectory === 'higher_education'
        ? career.collegeRoadmap.higherEducation
        : career.collegeRoadmap.placements;
    }
    return career.roadmapMilestones;
  };

  // Helper to get all checklist items for a career
  const getCareerChecklistItems = (career: CareerPath) => {
    const isCollege = profile.userType === 'college';
    const trajectory = collegeTrajectoryByCareer[career.id] || profile.collegeGoal || 'placements';

    const coreEssentialChecks = isCollege
      ? trajectory === 'placements'
        ? [
            'ATS-Compliant Single-Page Resume Built',
            'Domain Core Practice (100+ Problems / LeetCode / Cases)',
            'LinkedIn Alumni Referral Outreach (25+ Contacts)',
            'Mock Technical & HR Rounds with Peers',
            'Final Placement Portal Registration',
          ]
        : [
            'Postgraduate Exam Official Syllabus & Blueprint Analysis',
            'Diagnostic Proctored Mock Test 1',
            'Previous 10-Year Question Papers (PYQs) Solved',
            'Statement of Purpose (SOP) & Faculty Research Guides Contacted',
            'Official Entrance Examination Form Submitted',
          ]
      : [
          'Syllabus Review & High-Weightage Blueprint',
          'Diagnostic Mock Test 1 (Baseline Score)',
          'Previous 5-Year Solved Question Papers (PYQs)',
          'NCERT & Core Textbook Mastery Block',
          'Official Examination Registration & Document Prep',
        ];

    const activeMilestones = getActiveMilestones(career);
    const stageActions = activeMilestones.flatMap((m) => m.actions);
    const customList = customMilestones[career.id] || [];
    return {
      coreEssentialChecks,
      stageActions,
      customList,
      all: [...coreEssentialChecks, ...stageActions, ...customList],
    };
  };

  // Trigger live AI Narrative Synthesizer
  const synthesizeAIInsights = async (career: CareerPath, baselineScore: number) => {
    setSynthesizingCareerId(career.id);
    try {
      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career, profile, baselineScore }),
      });
      if (res.ok) {
        const data: RecommendationRationale = await res.json();
        setSynthesizedRationales((prev) => ({
          ...prev,
          [career.id]: data,
        }));
      }
    } catch (e) {
      console.warn('Synthesis fallback triggered:', e);
    } finally {
      setSynthesizingCareerId(null);
    }
  };

  // Filter list
  const filteredMatches = scoredMatches.filter((item) => {
    if (onlyEligible && !item.isEligible) return false;
    if (selectedCategory !== 'All' && item.career.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = item.career.title.toLowerCase().includes(query);
      const matchDesc = item.career.description.toLowerCase().includes(query);
      const matchExams = item.career.keyExams.some((e) => e.name.toLowerCase().includes(query));
      if (!matchTitle && !matchDesc && !matchExams) return false;
    }
    return true;
  });

  const categories = [
    'All',
    'Engineering & Technology',
    'Healthcare & Allied Sciences',
    'Commerce, Finance & CA',
    'Law, Humanities & Civil Services',
    'Design, Media & Architecture',
    'Vocational & Emerging Skills',
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 space-y-12">
      
      {/* TOP HERO: Airy & Relaxed Overview */}
      <section className="airy-card rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-[var(--bg-card)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Narrative */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#faefe4] dark:bg-[#2c2621] text-[#b85d24] dark:text-[#e08953] border border-[#ecd5c3] dark:border-[#3e342c]">
                Explainable Match Matrix
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Evaluated against genuine Indian admission cycles & stream prerequisites
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[var(--text-primary)] leading-tight">
              Curated Roadmap for{' '}
              <span className="text-[#b85d24]">
                {profile.studentName || 'You'}
              </span>
            </h1>

            <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Synthesized using your <strong className="text-[var(--text-primary)] font-semibold">{profile.streamOrMajor}</strong> background, an academic score of{' '}
              <strong className="text-[#b85d24] font-semibold">
                {profile.academicScore}{profile.academicScoreType === 'cgpa' ? ' CGPA' : '%'}
              </strong>
              , and stated career preferences.
            </p>

            {/* Quick Profile Summary Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f7f2ea] dark:bg-[#1f1c1a] border border-[var(--border-subtle)]">
                <BookOpen className="w-4 h-4 text-[#b85d24]" />
                <span className="font-medium">{profile.userType === 'school' ? (profile.schoolLevel || 'Class 11-12') : `${profile.collegeYear || 'College'} · ${profile.collegeGoal === 'higher_education' ? 'Masters Track' : 'Placement Track'}`}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f7f2ea] dark:bg-[#1f1c1a] border border-[var(--border-subtle)]">
                <IndianRupee className="w-4 h-4 text-[#b85d24]" />
                <span className="font-medium">{profile.budgetPreference}</span>
              </div>
              <button
                onClick={onRetakeAssessment}
                className="text-xs text-[#b85d24] hover:text-[#994715] font-semibold underline underline-offset-4 ml-1 cursor-pointer"
              >
                Adjust My Preferences
              </button>
            </div>
          </div>

          {/* Right Confidence Score Dial */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center pt-4 lg:pt-0">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Circular SVG Meter */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#ede4d6] dark:stroke-[#2e2925]"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#b85d24] transition-all duration-1000 ease-out"
                  strokeWidth="7"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - topScore / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inside dial text */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-display text-4xl font-extrabold text-[var(--text-primary)]">
                  {topScore}%
                </span>
                <span className="text-[11px] font-semibold text-[#b85d24] uppercase tracking-wider mt-0.5">
                  Top Match
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-medium">
                  Aptitude Fit
                </span>
              </div>
            </div>

            <p className="text-xs text-center text-[var(--text-muted)] mt-3 font-medium">
              Grounded in stream rules & subject affinity
            </p>
          </div>
        </div>
      </section>

      {/* DEDICATED COLLEGE PLACEMENT & TRANSITION HUB */}
      {profile.userType === 'college' && (
        <section className="space-y-4">
          <CollegePlacementHub
            collegeGoal={profile.collegeGoal}
            streamOrMajor={profile.streamOrMajor}
            onSelectGoal={(goal) => {
              if (onUpdateProfile) {
                onUpdateProfile({ collegeGoal: goal });
              }
            }}
          />
        </section>
      )}

      {/* RECHARTS RADAR & BAR COMPARISON: INTERACTIVE MATCH EXPLAINABILITY */}
      <CareerComparisonChart
        scoredCareers={scoredMatches}
        studentName={profile.studentName}
        onSelectCareer={(career) => {
          setExpandedCareerId(career.id);
          setActiveTabByCareer((prev) => ({ ...prev, [career.id]: 'rationale' }));
        }}
      />

      {/* FILTER & SEARCH BAR */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pathways, exams (JEE, NEET, CAT, CLAT), or skills..."
              className="w-full pl-11 pr-5 py-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)] focus:border-[#b85d24] focus:ring-1 focus:ring-[#b85d24] outline-none shadow-xs font-medium"
            />
          </div>

          {/* Toggle Only Eligible & Count */}
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[var(--text-secondary)] font-medium">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                className="w-4 h-4 rounded text-[#b85d24] accent-[#b85d24] cursor-pointer"
              />
              <span>100% Stream Eligible Only</span>
            </label>

            <span className="text-xs text-[var(--text-muted)] font-medium">
              Showing <strong className="text-[var(--text-primary)] font-semibold">{filteredMatches.length}</strong> pathways
            </span>
          </div>
        </div>

        {/* Category Buttons with Breathing Room */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#b85d24] text-white font-semibold shadow-xs'
                  : 'bg-[#f5ede3] dark:bg-[#201c19] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
              }`}
              role="tab"
              aria-selected={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* PRIMARY MATCH CARDS LIST */}
      <section className="space-y-8">
        {filteredMatches.length === 0 ? (
          <div className="airy-card rounded-3xl p-14 text-center space-y-4">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
            <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">No matching pathways</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
              Try broadening your search terms or unchecking the strict stream eligibility filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setOnlyEligible(false);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#b85d24] text-white font-semibold text-xs shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMatches.map((scored) => {
            const { career, score, isEligible, scoreBreakdown } = scored;
            const isExpanded = expandedCareerId === career.id;
            const activeTab = activeTabByCareer[career.id] || 'rationale';
            const isBookmarked = profile.bookmarks.includes(career.id);
            const activeRationale = synthesizedRationales[career.id] || scored.rationale;
            const isSynthesizing = synthesizingCareerId === career.id;

            // College trajectory for this card
            const activeCollegeTrajectory = collegeTrajectoryByCareer[career.id] || profile.collegeGoal || 'placements';
            const isCollege = profile.userType === 'college';
            const activeMilestones = getActiveMilestones(career);

            // Checklist calculations for this career
            const checklist = getCareerChecklistItems(career);
            const completedItems = profile.completedMilestones?.[career.id] || [];
            const completedCount = checklist.all.filter((item) => completedItems.includes(item)).length;
            const totalItemsCount = checklist.all.length;
            const progressPercent = totalItemsCount > 0 ? Math.round((completedCount / totalItemsCount) * 100) : 0;

            const getProgressStatus = (pct: number) => {
              if (pct === 0) return 'Ready to Begin Preparation';
              if (pct < 35) return 'Foundations Underway';
              if (pct < 70) return 'Building Strong Momentum';
              if (pct < 100) return 'Advanced Readiness';
              return 'All Milestones Completed!';
            };

            return (
              <div
                key={career.id}
                className={`airy-card rounded-3xl transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'border-[#b85d24] shadow-md' : 'airy-card-hover'
                }`}
              >
                {/* Card Header Bar */}
                <div className="p-7 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    
                    {/* Left Details */}
                    <div className="space-y-3.5 flex-1">
                      
                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* Match Badge */}
                        <div className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-[#faefe4] dark:bg-[#2f251e] text-[#b85d24] dark:text-[#f09a65] border border-[#ecd5c3] dark:border-[#423328]">
                          <Sparkles className="w-3.5 h-3.5 stroke-[2.2]" />
                          <span>{score}% Match</span>
                        </div>

                        {/* Category & Audience unboxed text metadata */}
                        <span className="text-xs text-[var(--text-muted)] font-medium">
                          {career.category}
                        </span>
                        <span className="text-[var(--text-muted)] text-xs" aria-hidden="true">·</span>
                        <span className="text-xs text-[var(--text-muted)] font-medium">
                          {career.targetAudience === 'school' ? 'School Track' : career.targetAudience === 'college' ? 'College Track' : 'School & College'}
                        </span>

                        {!isEligible && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#fcedeb] dark:bg-[#341d1a] text-[#c93b2b] dark:text-[#f47365] border border-[#f5c7c2] dark:border-[#4d241f] flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Stream prerequisite note
                          </span>
                        )}
                      </div>

                      {/* Career Title */}
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
                          {career.title}
                        </h2>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                        {career.description}
                      </p>

                      {/* Key Indicators Row */}
                      <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-[var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-[#b85d24]" />
                          <span>Entry: <strong className="text-[var(--text-primary)] font-semibold">{career.estimatedSalaryRange.entry}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#8c5936]" />
                          <span>Future Demand: <strong className="text-[var(--text-primary)] font-semibold">{career.futureDemandScore}/100</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#a66a1e]" />
                          <span>ROI: <strong className="text-[var(--text-primary)] font-semibold">{career.roiIndicator.investmentRating}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#635343]" />
                          <span>Key Exam: <strong className="text-[var(--text-primary)] font-semibold">{career.keyExams[0]?.name}</strong></span>
                        </div>

                        {/* Interactive Milestone Progress Micro-Indicator on Card */}
                        <div className="flex items-center gap-2 ml-auto lg:ml-0 text-xs">
                          <ListTodo className="w-4 h-4 text-[#b85d24]" />
                          <span className="font-semibold text-[var(--text-primary)]">{completedCount}/{totalItemsCount}</span>
                          <span className="text-[var(--text-muted)] font-medium">Milestones Done</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Cluster */}
                    <div className="flex items-center gap-3 self-start lg:self-center pt-2 lg:pt-0">
                      {/* Bookmark Button */}
                      <button
                        onClick={() => onBookmark(career.id)}
                        className={`p-3 rounded-xl border transition-all ${
                          isBookmarked
                            ? 'bg-[#faefe4] dark:bg-[#34271e] border-[#b85d24] text-[#b85d24]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                        title={isBookmarked ? 'Bookmarked' : 'Save pathway'}
                        aria-label={`Bookmark ${career.title}`}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      {/* Ask Guidely Contextual Advisor */}
                      <button
                        onClick={() => onOpenAdvisorForCareer(career)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[#f7f1e7] dark:bg-[#231f1c] hover:bg-[#ece2d3] text-[var(--text-primary)] text-xs font-semibold transition-all cursor-pointer"
                      >
                        <MessageSquareText className="w-4 h-4 text-[#b85d24]" />
                        <span>Ask Guidely</span>
                      </button>

                      {/* Expand / Collapse Rationale Button */}
                      <button
                        onClick={() => setExpandedCareerId(isExpanded ? null : career.id)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b85d24] hover:bg-[#9c4c19] text-white text-xs font-semibold transition-all cursor-pointer"
                        aria-expanded={isExpanded}
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Action Plan'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* EXPANDED ACCORDION DRAWER */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-[var(--border-subtle)] bg-[#fdfbf8] dark:bg-[#1a1715] p-7 sm:p-10 space-y-8"
                    >
                      {/* Sub-tab Navigation */}
                      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-4 overflow-x-auto scrollbar-none">
                        <button
                          onClick={() => setActiveTabByCareer((prev) => ({ ...prev, [career.id]: 'rationale' }))}
                          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                            activeTab === 'rationale'
                              ? 'bg-[#b85d24] text-white'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          Explainable AI Rationale & Score Card
                        </button>
                        <button
                          onClick={() => setActiveTabByCareer((prev) => ({ ...prev, [career.id]: 'milestones' }))}
                          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                            activeTab === 'milestones'
                              ? 'bg-[#b85d24] text-white'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <ListTodo className="w-3.5 h-3.5" />
                          <span>
                            {isCollege ? 'College Action Plan & Checklist' : 'School Action Plan & Checklist'} ({completedCount}/{totalItemsCount})
                          </span>
                        </button>
                        <button
                          onClick={() => setActiveTabByCareer((prev) => ({ ...prev, [career.id]: 'exams' }))}
                          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                            activeTab === 'exams'
                              ? 'bg-[#b85d24] text-white'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          Entrance Exams ({career.keyExams.length})
                        </button>
                        <button
                          onClick={() => setActiveTabByCareer((prev) => ({ ...prev, [career.id]: 'institutions' }))}
                          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                            activeTab === 'institutions'
                              ? 'bg-[#b85d24] text-white'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          Top Institutions ({career.topInstitutions.length})
                        </button>
                      </div>

                      {/* SUB-TAB 1: EXPLAINABLE AI RATIONALE & SCORE BREAKDOWN */}
                      {activeTab === 'rationale' && (
                        <div className="space-y-8">
                          
                          {/* TRANSPARENT 5-FACTOR SCORE CARD BREAKDOWN */}
                          <div className="p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Scale className="w-5 h-5 text-[#b85d24]" />
                                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                                    Explainable Score Composition: Why {score}%?
                                  </h3>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                  Transparent algorithmic audit showing exactly how your inputs produced this match score.
                                </p>
                              </div>
                              <span className="font-display font-extrabold text-3xl text-[#b85d24]">
                                {score} <span className="text-xs text-[var(--text-muted)] font-normal">/ 100</span>
                              </span>
                            </div>

                            {/* Explainable AI Deduction Narrative Box */}
                            <div className="p-5 rounded-2xl bg-[#faf4eb] dark:bg-[#251e18] border border-[#ebd5c1] dark:border-[#3e2e22] space-y-2.5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0ded0] dark:border-[#382a20] pb-2">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-[#b85d24]" />
                                  <span className="text-xs font-bold text-[#b85d24]">
                                    Explainable AI Deduction: How {score}% Was Derived
                                  </span>
                                </div>
                                <span className="font-mono text-[11px] font-semibold text-[#b85d24] dark:text-[#f09a65]">
                                  {scoreBreakdown.calculationEquation}
                                </span>
                              </div>
                              <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
                                {activeRationale.scoreExplanation || scoreBreakdown.scoreExplanation}
                              </p>
                            </div>

                            {/* RECHARTS RADAR MINI-VISUALIZER: INTEREST VS SKILLS VS DEMAND */}
                            <SingleCareerMiniVisualizer scoredCareer={scored} />

                            {/* 5-Factor Score Cards with Progress Indicators */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              
                              {/* 1. Stream Match */}
                              <div className="p-4 rounded-2xl bg-[#faf7f2] dark:bg-[#1f1b19] border border-[var(--border-subtle)] space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-[var(--text-primary)]">Stream Prerequisite</span>
                                  <span className="text-xs font-bold text-[#b85d24]">
                                    {scoreBreakdown.streamMatch.score} / {scoreBreakdown.streamMatch.max} pts
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-[#ede4d6] dark:bg-[#2b2520] rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#b85d24] rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.round((scoreBreakdown.streamMatch.score / scoreBreakdown.streamMatch.max) * 100)}%` }} 
                                  />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                  {scoreBreakdown.streamMatch.rationale}
                                </p>
                              </div>

                              {/* 2. Subject Affinity */}
                              <div className="p-4 rounded-2xl bg-[#faf7f2] dark:bg-[#1f1b19] border border-[var(--border-subtle)] space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-[var(--text-primary)]">Subject Affinity</span>
                                  <span className="text-xs font-bold text-[#b85d24]">
                                    {scoreBreakdown.subjectMatch.score} / {scoreBreakdown.subjectMatch.max} pts
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-[#ede4d6] dark:bg-[#2b2520] rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#b85d24] rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.round((scoreBreakdown.subjectMatch.score / scoreBreakdown.subjectMatch.max) * 100)}%` }} 
                                  />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                  {scoreBreakdown.subjectMatch.rationale}
                                </p>
                              </div>

                              {/* 3. Academic Performance */}
                              <div className="p-4 rounded-2xl bg-[#faf7f2] dark:bg-[#1f1b19] border border-[var(--border-subtle)] space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-[var(--text-primary)]">Academic Threshold</span>
                                  <span className="text-xs font-bold text-[#b85d24]">
                                    {scoreBreakdown.academicPerformance.score} / {scoreBreakdown.academicPerformance.max} pts
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-[#ede4d6] dark:bg-[#2b2520] rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#b85d24] rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.round((scoreBreakdown.academicPerformance.score / scoreBreakdown.academicPerformance.max) * 100)}%` }} 
                                  />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                  {scoreBreakdown.academicPerformance.rationale}
                                </p>
                              </div>

                              {/* 4. Work Style Fit */}
                              <div className="p-4 rounded-2xl bg-[#faf7f2] dark:bg-[#1f1b19] border border-[var(--border-subtle)] space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-[var(--text-primary)]">Work Style Fit</span>
                                  <span className="text-xs font-bold text-[#b85d24]">
                                    {scoreBreakdown.workStyle.score} / {scoreBreakdown.workStyle.max} pts
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-[#ede4d6] dark:bg-[#2b2520] rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#b85d24] rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.round((scoreBreakdown.workStyle.score / scoreBreakdown.workStyle.max) * 100)}%` }} 
                                  />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                  {scoreBreakdown.workStyle.rationale}
                                </p>
                              </div>

                              {/* 5. Budget & Goals */}
                              <div className="p-4 rounded-2xl bg-[#faf7f2] dark:bg-[#1f1b19] border border-[var(--border-subtle)] space-y-2 sm:col-span-2 lg:col-span-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-[var(--text-primary)]">Budget, Audience & Trajectory</span>
                                  <span className="text-xs font-bold text-[#b85d24]">
                                    {scoreBreakdown.budgetAndGoals.score} / {scoreBreakdown.budgetAndGoals.max} pts
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-[#ede4d6] dark:bg-[#2b2520] rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#b85d24] rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.round((scoreBreakdown.budgetAndGoals.score / scoreBreakdown.budgetAndGoals.max) * 100)}%` }} 
                                  />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                  {scoreBreakdown.budgetAndGoals.rationale}
                                </p>
                              </div>

                            </div>
                          </div>

                          {/* Trigger Live Synthesis Button */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span className="text-xs text-[var(--text-muted)] font-medium">
                              Mentor synthesized advice for {profile.streamOrMajor} profile.
                            </span>

                            <button
                              onClick={() => synthesizeAIInsights(career, score)}
                              disabled={isSynthesizing}
                              className="flex items-center gap-2 text-xs text-[#b85d24] hover:text-[#994715] font-semibold disabled:opacity-50 cursor-pointer"
                            >
                              <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
                              <span>{isSynthesizing ? 'Synthesizing with Guidely AI...' : 'Refresh Mentor Analysis'}</span>
                            </button>
                          </div>

                          {isSynthesizing ? (
                            /* Loading Skeleton */
                            <div className="space-y-4 animate-pulse p-4">
                              <div className="h-4 bg-[#ede4d6] dark:bg-[#2b2622] rounded w-3/4"></div>
                              <div className="h-4 bg-[#ede4d6] dark:bg-[#2b2622] rounded w-5/6"></div>
                              <div className="h-4 bg-[#ede4d6] dark:bg-[#2b2622] rounded w-1/2"></div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Why It Fits */}
                              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3.5 shadow-xs">
                                <h4 className="text-xs font-bold text-[#b85d24] dark:text-[#f09a65] uppercase tracking-wider flex items-center gap-2">
                                  <Check className="w-4 h-4 stroke-[2.5]" /> Why It Fits You
                                </h4>
                                <ul className="space-y-3">
                                  {activeRationale.whyItFits?.map((point, idx) => (
                                    <li key={idx} className="text-xs text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
                                      <span className="text-[#b85d24] font-bold">·</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Critical Watchouts */}
                              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3.5 shadow-xs">
                                <h4 className="text-xs font-bold text-[#9e5f29] dark:text-[#f0b070] uppercase tracking-wider flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" /> Critical Watchouts
                                </h4>
                                <ul className="space-y-3">
                                  {activeRationale.criticalWatchouts?.map((point, idx) => (
                                    <li key={idx} className="text-xs text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
                                      <span className="text-[#9e5f29] font-bold">·</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Immediate Next Steps */}
                              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3.5 shadow-xs">
                                <h4 className="text-xs font-bold text-[#6d5641] dark:text-[#d4beaa] uppercase tracking-wider flex items-center gap-2">
                                  <Zap className="w-4 h-4" /> Recommended Steps
                                </h4>
                                <ul className="space-y-3">
                                  {activeRationale.personalizedNextSteps?.map((point, idx) => (
                                    <li key={idx} className="text-xs text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
                                      <span className="text-[#6d5641] font-bold">·</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Financial & ROI Overview */}
                          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-6 text-xs shadow-xs">
                            <div>
                              <span className="text-[var(--text-muted)] block text-[11px] mb-1 font-medium">Estimated Education Cost</span>
                              <strong className="text-[var(--text-primary)] font-semibold">{career.roiIndicator.estimatedEducationCost}</strong>
                            </div>
                            <div>
                              <span className="text-[var(--text-muted)] block text-[11px] mb-1 font-medium">ROI Break-Even Window</span>
                              <strong className="text-[#b85d24] font-semibold">{career.roiIndicator.breakEvenPeriod}</strong>
                            </div>
                            <div>
                              <span className="text-[var(--text-muted)] block text-[11px] mb-1 font-medium">Senior Professional Compensation</span>
                              <strong className="text-[var(--text-primary)] font-semibold">{career.estimatedSalaryRange.senior}</strong>
                            </div>
                            <div>
                              <span className="text-[var(--text-muted)] block text-[11px] mb-1 font-medium">National Scholarships</span>
                              <span className="text-[var(--text-secondary)] font-medium">NSP, PMSSS & Central Fellowships</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 2: INTERACTIVE ACTION PLAN & CHECKLIST WITH VISUAL PROGRESS BAR */}
                      {activeTab === 'milestones' && (
                        <div className="space-y-10">
                          
                          {/* COLLEGE TRAJECTORY SELECTOR (Only shown for college students) */}
                          {isCollege && (
                            <div className="p-6 rounded-3xl bg-[#f7f2ea] dark:bg-[#1f1b19] border border-[var(--border-subtle)] space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <h4 className="font-display font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-[#b85d24]" />
                                    College Trajectory Guidance Mode
                                  </h4>
                                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                    Toggle between immediate corporate recruitment vs postgraduate competitive exams.
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 p-1 bg-white dark:bg-[#28231f] rounded-2xl border border-[var(--border-subtle)]">
                                  <button
                                    type="button"
                                    onClick={() => setCollegeTrajectoryByCareer((prev) => ({ ...prev, [career.id]: 'placements' }))}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                      activeCollegeTrajectory === 'placements'
                                        ? 'bg-[#b85d24] text-white shadow-xs'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                                  >
                                    <Briefcase className="w-3.5 h-3.5" />
                                    <span>Placement & Hiring</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setCollegeTrajectoryByCareer((prev) => ({ ...prev, [career.id]: 'higher_education' }))}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                      activeCollegeTrajectory === 'higher_education'
                                        ? 'bg-[#b85d24] text-white shadow-xs'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                                  >
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    <span>Masters & Competitive Exams</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* VISUAL PROGRESS BAR CARD */}
                          <div className="p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <ListTodo className="w-5 h-5 text-[#b85d24]" />
                                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                                    {isCollege 
                                      ? activeCollegeTrajectory === 'placements'
                                        ? 'Campus Placement & Recruitment Milestone Tracker'
                                        : 'Postgraduate Entrance & Research Milestone Tracker'
                                      : 'Action Plan Milestone Progress'}
                                  </h3>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)]">
                                  {isCollege
                                    ? activeCollegeTrajectory === 'placements'
                                      ? 'Track resume reviews, coding/case problem sprints, mock interview rounds, and referral outreach.'
                                      : 'Track GATE/CAT question banks, proctored mock percentiles, statement of purpose, and admissions counseling.'
                                    : 'Check off items as you complete syllabus reviews, mock tests, and stage milestones.'}
                                </p>
                              </div>

                              {/* Motivational Status Badge */}
                              <div className="flex items-center gap-3 self-start sm:self-auto">
                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#faefe4] dark:bg-[#2f251e] text-[#b85d24] dark:text-[#f09a65] border border-[#ecd5c3] dark:border-[#423328]">
                                  {getProgressStatus(progressPercent)}
                                </span>
                                <span className="font-display font-extrabold text-2xl text-[var(--text-primary)]">
                                  {progressPercent}%
                                </span>
                              </div>
                            </div>

                            {/* Visual Progress Bar Track */}
                            <div className="space-y-2">
                              <div 
                                className="w-full h-3.5 bg-[#ede4d6] dark:bg-[#2b2520] rounded-full overflow-hidden p-0.5 border border-[var(--border-subtle)]"
                                role="progressbar"
                                aria-valuenow={progressPercent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="Action plan completion progress"
                              >
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-[#b85d24] to-[#d97736] rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressPercent}%` }}
                                  transition={{ duration: 0.4, ease: 'easeOut' }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
                                <span><strong>{completedCount}</strong> of <strong>{totalItemsCount}</strong> action items checked</span>
                                {completedCount > 0 && (
                                  <span className="text-[#b85d24]">Keep up the momentum!</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* ESSENTIAL FOUNDATION CHECKPOINTS */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#b85d24]" />
                                <h4 className="font-display font-bold text-sm text-[var(--text-primary)]">
                                  {isCollege
                                    ? activeCollegeTrajectory === 'placements'
                                      ? 'Core Placement Preparation Checkpoints'
                                      : 'Core Masters Entrance Checkpoints'
                                    : 'Essential Preparation Checkpoints'}
                                </h4>
                              </div>
                              <span className="text-xs text-[var(--text-muted)] font-medium">
                                Core checkpoints
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {checklist.coreEssentialChecks.map((checkItem, cIdx) => {
                                const isChecked = completedItems.includes(checkItem);
                                return (
                                  <button
                                    key={cIdx}
                                    type="button"
                                    onClick={() => onToggleMilestone(career.id, checkItem)}
                                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer airy-card ${
                                      isChecked
                                        ? 'bg-[#faeee4]/60 dark:bg-[#2b241e] border-[#eed5c2] dark:border-[#42342a]'
                                        : 'bg-[var(--bg-card)] hover:border-[#b85d24]'
                                    }`}
                                    role="checkbox"
                                    aria-checked={isChecked}
                                  >
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                                      isChecked
                                        ? 'bg-[#b85d24] border-[#b85d24] text-white'
                                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-transparent'
                                    }`}>
                                      <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                                    </div>
                                    <span className={`text-xs leading-relaxed font-medium transition-all ${
                                      isChecked
                                        ? 'line-through text-[var(--text-muted)]'
                                        : 'text-[var(--text-primary)]'
                                    }`}>
                                      {checkItem}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* STAGE-BY-STAGE TIMELINE CHECKLIST */}
                          <div className="space-y-8">
                            <div className="flex items-center justify-between">
                              <h4 className="font-display font-bold text-sm text-[var(--text-primary)]">
                                {isCollege
                                  ? activeCollegeTrajectory === 'placements'
                                    ? 'Campus Placement 3-Stage Roadmap'
                                    : 'Postgraduate Entrance 3-Stage Roadmap'
                                  : '3-Stage Milestone Action Plan'}
                              </h4>
                              <span className="text-xs text-[var(--text-muted)] font-medium">
                                Click any item below to check it off
                              </span>
                            </div>

                            <div className="relative pl-8 sm:pl-10 space-y-10 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dfd5c7] dark:before:bg-[#342d27]">
                              {activeMilestones.map((milestone, idx) => {
                                const stageCompleted = milestone.actions.filter((a) => completedItems.includes(a)).length;
                                const stageTotal = milestone.actions.length;

                                return (
                                  <div key={idx} className="relative space-y-3.5">
                                    {/* Dot indicator */}
                                    <div className={`absolute -left-8 sm:-left-10 top-1 w-6 h-6 rounded-full bg-[var(--bg-card)] border-2 flex items-center justify-center transition-colors ${
                                      stageCompleted === stageTotal && stageTotal > 0
                                        ? 'border-[#b85d24] bg-[#faefe4]'
                                        : 'border-[#dfd5c7] dark:border-[#38312b]'
                                    }`}>
                                      {stageCompleted === stageTotal && stageTotal > 0 ? (
                                        <Check className="w-3.5 h-3.5 text-[#b85d24] stroke-[2.8]" />
                                      ) : (
                                        <div className="w-2 h-2 rounded-full bg-[#b85d24]" />
                                      )}
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                      <div className="flex items-center gap-2.5">
                                        <span className="text-[11px] uppercase font-bold px-3 py-1 rounded-full bg-[#faefe4] dark:bg-[#34271e] text-[#b85d24] dark:text-[#f29f6d]">
                                          {milestone.stage === 'immediate' ? 'Stage 1: Immediate Sprint' : milestone.stage === '6-month' ? 'Stage 2: Mid-Term Acceleration' : 'Stage 3: Offer Conversion & Launch'}
                                        </span>
                                        <h5 className="font-semibold text-sm text-[var(--text-primary)]">
                                          {milestone.title}
                                        </h5>
                                      </div>

                                      <span className="text-xs text-[var(--text-muted)] font-semibold">
                                        {stageCompleted}/{stageTotal} Completed
                                      </span>
                                    </div>

                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                      {milestone.description}
                                    </p>

                                    {/* Action items with interactive checkboxes */}
                                    <div className="space-y-2 pt-1">
                                      {milestone.actions.map((act, aIdx) => {
                                        const isChecked = completedItems.includes(act);
                                        return (
                                          <button
                                            key={aIdx}
                                            type="button"
                                            onClick={() => onToggleMilestone(career.id, act)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer airy-card ${
                                              isChecked
                                                ? 'bg-[#faeee4]/60 dark:bg-[#2b241e] border-[#eed5c2] dark:border-[#42342a]'
                                                : 'bg-[var(--bg-card)] hover:border-[#b85d24]'
                                            }`}
                                            role="checkbox"
                                            aria-checked={isChecked}
                                          >
                                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                                              isChecked
                                                ? 'bg-[#b85d24] border-[#b85d24] text-white'
                                                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-transparent'
                                            }`}>
                                              <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                                            </div>
                                            <span className={`text-xs leading-relaxed font-medium transition-all ${
                                              isChecked
                                                ? 'line-through text-[var(--text-muted)]'
                                                : 'text-[var(--text-primary)]'
                                            }`}>
                                              {act}
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Recommended Free / Top Resources */}
                                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-[var(--text-muted)]">
                                      <span className="font-semibold text-[var(--text-secondary)]">Recommended Placement / Study Resources:</span>
                                      {milestone.recommendedResources.map((res, rIdx) => (
                                        <span key={rIdx} className="px-2.5 py-1 rounded-lg bg-[#f4ece1] dark:bg-[#25201d] text-[var(--text-secondary)] text-[11px] font-medium border border-[var(--border-subtle)]">
                                          {res}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* APPENDED PLACEMENT PREPARATION TOOLKIT FOR CAREER TRACK */}
                          {isCollege && activeCollegeTrajectory === 'placements' && career.placementPreparationKit && (
                            <div className="p-7 rounded-3xl bg-[#faf5ef] dark:bg-[#211b17] border border-[#ebd6c3] dark:border-[#3d2e23] shadow-xs space-y-6">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebd6c3] dark:border-[#382b20] pb-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-[#b85d24]" />
                                    <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                                      Placement Preparation Toolkit & Playbooks
                                    </h4>
                                  </div>
                                  <p className="text-xs text-[var(--text-secondary)]">
                                    Specialized recruitment assets, core problem patterns, and industry portfolio rubrics appended for <strong>{career.placementPreparationKit.trackName}</strong>.
                                  </p>
                                </div>
                                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#faefe4] dark:bg-[#34271e] text-[#b85d24] dark:text-[#f29f6d] border border-[#ebd6c3] self-start sm:self-auto">
                                  Career & Placement Track
                                </span>
                              </div>

                              {/* 1. Core Practice Patterns */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                                  <Code2 className="w-4 h-4 text-[#b85d24]" />
                                  <span>Core Practice & Problem Patterns (Click to add to your checklist):</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {career.placementPreparationKit.corePracticePatterns.map((pattern, patIdx) => {
                                    const isAlreadyInMilestones = completedItems.includes(pattern);
                                    return (
                                      <div
                                        key={patIdx}
                                        className="p-3.5 rounded-2xl bg-white dark:bg-[#28211b] border border-[var(--border-subtle)] flex items-start justify-between gap-3 text-xs"
                                      >
                                        <div className="space-y-1">
                                          <span className="font-medium text-[var(--text-primary)] block leading-relaxed">
                                            {pattern}
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => onToggleMilestone(career.id, pattern)}
                                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                                            isAlreadyInMilestones
                                              ? 'bg-[#faefe4] text-[#b85d24] border border-[#ebd6c3]'
                                              : 'bg-[#b85d24] text-white hover:bg-[#9c4c19]'
                                          }`}
                                        >
                                          {isAlreadyInMilestones ? 'Tracked' : '+ Add'}
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* 2. Mock Interview Tips */}
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                                  <Lightbulb className="w-4 h-4 text-[#b85d24]" />
                                  <span>Interview Playbooks & Evaluation Rubrics:</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-white dark:bg-[#28211b] border border-[var(--border-subtle)] space-y-2.5">
                                  {career.placementPreparationKit.mockInterviewTips.map((tip, tipIdx) => (
                                    <div key={tipIdx} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#b85d24] mt-1.5 shrink-0" />
                                      <span>{tip}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 3. Industry-Specific Portfolio Requirements */}
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                                  <FileText className="w-4 h-4 text-[#b85d24]" />
                                  <span>Industry-Specific Portfolio & Work Proof Requirements:</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-white dark:bg-[#28211b] border border-[var(--border-subtle)] space-y-2">
                                  {career.placementPreparationKit.industryPortfolioRequirements.map((req, reqIdx) => (
                                    <div key={reqIdx} className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium leading-relaxed">
                                      <CheckCircle2 className="w-4 h-4 text-[#b85d24] shrink-0 mt-0.5" />
                                      <span>{req}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 4. Curated Platforms & Practice Sites */}
                              <div className="space-y-3 pt-2">
                                <span className="text-xs font-bold text-[var(--text-primary)] block">
                                  Recommended High-Impact Practice Platforms:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {career.placementPreparationKit.recommendedPlatforms.map((plat, pIdx) => (
                                    <a
                                      key={pIdx}
                                      href={plat.url || '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-3.5 rounded-2xl bg-white dark:bg-[#28211b] border border-[var(--border-subtle)] hover:border-[#b85d24] transition-all flex items-start justify-between gap-3 text-xs group"
                                    >
                                      <div>
                                        <div className="font-bold text-[var(--text-primary)] group-hover:text-[#b85d24] flex items-center gap-1.5">
                                          <span>{plat.name}</span>
                                          <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
                                        </div>
                                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                                          {plat.description}
                                        </p>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* APPENDED HIGHER EDUCATION TOOLKIT FOR MASTERS TRACK */}
                          {isCollege && activeCollegeTrajectory === 'higher_education' && career.higherEducationKit && (
                            <div className="p-7 rounded-3xl bg-[#faf5ef] dark:bg-[#211b17] border border-[#ebd6c3] dark:border-[#3d2e23] shadow-xs space-y-6">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebd6c3] dark:border-[#382b20] pb-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-[#b85d24]" />
                                    <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                                      Postgraduate & Entrance Exam Toolkit
                                    </h4>
                                  </div>
                                  <p className="text-xs text-[var(--text-secondary)]">
                                    Curated diagnostic percentiles, research SOP checkpoints, and official portals for <strong>{career.higherEducationKit.trackName}</strong>.
                                  </p>
                                </div>
                                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#faefe4] dark:bg-[#34271e] text-[#b85d24] dark:text-[#f29f6d] border border-[#ebd6c3] self-start sm:self-auto">
                                  Higher Education Track
                                </span>
                              </div>

                              {/* Target Examinations */}
                              <div className="space-y-2">
                                <span className="text-xs font-bold text-[var(--text-primary)] block">Target Examinations & Gateways:</span>
                                <div className="flex flex-wrap gap-2">
                                  {career.higherEducationKit.targetEntranceExams.map((ex, eIdx) => (
                                    <span key={eIdx} className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#28211b] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)]">
                                      {ex}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Diagnostic Checkpoints */}
                              <div className="space-y-3 pt-2">
                                <span className="text-xs font-bold text-[var(--text-primary)] block">Diagnostic Test Checkpoints:</span>
                                <div className="p-4 rounded-2xl bg-white dark:bg-[#28211b] border border-[var(--border-subtle)] space-y-2">
                                  {career.higherEducationKit.diagnosticCheckpoints.map((chk, cIdx) => (
                                    <div key={cIdx} className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] font-medium leading-relaxed">
                                      <CheckCircle2 className="w-4 h-4 text-[#b85d24] shrink-0 mt-0.5" />
                                      <span>{chk}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Research & SOP Standards */}
                              <div className="space-y-3 pt-2">
                                <span className="text-xs font-bold text-[var(--text-primary)] block">Research, Profile & Statement of Purpose (SOP) Standards:</span>
                                <div className="p-4 rounded-2xl bg-white dark:bg-[#28211b] border border-[var(--border-subtle)] space-y-2">
                                  {career.higherEducationKit.researchAndSOPMilestones.map((ms, mIdx) => (
                                    <div key={mIdx} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#b85d24] mt-1.5 shrink-0" />
                                      <span>{ms}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Recommended Portals */}
                              <div className="space-y-3 pt-2">
                                <span className="text-xs font-bold text-[var(--text-primary)] block">Official Portals & Advisories:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {career.higherEducationKit.recommendedPortals.map((prt, prtIdx) => (
                                    <a
                                      key={prtIdx}
                                      href={prt.url || '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-3.5 rounded-2xl bg-white dark:bg-[#28211b] border border-[var(--border-subtle)] hover:border-[#b85d24] transition-all flex items-start justify-between gap-3 text-xs group"
                                    >
                                      <div>
                                        <div className="font-bold text-[var(--text-primary)] group-hover:text-[#b85d24] flex items-center gap-1.5">
                                          <span>{prt.name}</span>
                                          <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
                                        </div>
                                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                                          {prt.description}
                                        </p>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ADD CUSTOM STUDENT GOAL / MILESTONE */}
                          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-4">
                            <div className="flex items-center gap-2">
                              <Plus className="w-4 h-4 text-[#b85d24]" />
                              <h4 className="font-display font-bold text-sm text-[var(--text-primary)]">
                                Add Custom Target or Goal
                              </h4>
                            </div>

                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddCustomMilestone(career.id);
                              }}
                              className="flex flex-col sm:flex-row items-center gap-3"
                            >
                              <input
                                type="text"
                                value={newMilestoneInput[career.id] || ''}
                                onChange={(e) => setNewMilestoneInput((prev) => ({ ...prev, [career.id]: e.target.value }))}
                                placeholder="e.g., Mock Interview with Senior, LeetCode 50 Hard Problems, SOP Draft 2..."
                                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[#fcfbf9] dark:bg-[#1a1715] text-xs text-[var(--text-primary)] focus:border-[#b85d24] outline-none font-medium"
                              />
                              <button
                                type="submit"
                                disabled={!(newMilestoneInput[career.id] || '').trim()}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#b85d24] hover:bg-[#9c4c19] disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
                              >
                                Add to Checklist
                              </button>
                            </form>

                            {/* Render custom milestones if any */}
                            {(checklist.customList.length > 0) && (
                              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                                <span className="text-[11px] font-semibold text-[var(--text-muted)] block">Custom Milestones:</span>
                                {checklist.customList.map((customItem, customIdx) => {
                                  const isChecked = completedItems.includes(customItem);
                                  return (
                                    <button
                                      key={customIdx}
                                      type="button"
                                      onClick={() => onToggleMilestone(career.id, customItem)}
                                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer airy-card ${
                                        isChecked
                                          ? 'bg-[#faeee4]/60 dark:bg-[#2b241e] border-[#eed5c2]'
                                          : 'bg-[var(--bg-card)] hover:border-[#b85d24]'
                                      }`}
                                    >
                                      <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                                        isChecked
                                          ? 'bg-[#b85d24] border-[#b85d24] text-white'
                                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)]'
                                      }`}>
                                        {isChecked && <Check className="w-3 h-3 stroke-[2.8]" />}
                                      </div>
                                      <span className={`text-xs font-medium ${isChecked ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                                        {customItem}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                        </div>
                      )}

                      {/* SUB-TAB 3: ENTRANCE EXAMS */}
                      {activeTab === 'exams' && (
                        <div className="space-y-6">
                          <p className="text-xs text-[var(--text-muted)] font-medium">
                            Official admission entrance examinations, schedules, and official application portals.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {career.keyExams.map((exam, idx) => (
                              <div key={idx} className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3 shadow-xs">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{exam.name}</h4>
                                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#faefe4] dark:bg-[#2f251e] text-[#b85d24] dark:text-[#f09a65]">
                                    {exam.difficulty} Rigor
                                  </span>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)]">{exam.fullForm}</p>
                                <div className="text-xs text-[var(--text-secondary)] space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                                  <div><strong>Frequency:</strong> {exam.frequency}</div>
                                  <div><strong>Timeline:</strong> {exam.timeline}</div>
                                  <div><strong>Official Portal:</strong> <span className="text-[#b85d24] font-semibold">{exam.officialPortal}</span></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 4: TOP INSTITUTIONS */}
                      {activeTab === 'institutions' && (
                        <div className="space-y-6">
                          <p className="text-xs text-[var(--text-muted)] font-medium">
                            NIRF-ranked premier Indian universities and autonomous institutions.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {career.topInstitutions.map((inst, idx) => (
                              <div key={idx} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-start justify-between shadow-xs">
                                <div className="space-y-1">
                                  <h4 className="font-semibold text-xs text-[var(--text-primary)]">{inst.name}</h4>
                                  <span className="text-[11px] text-[var(--text-muted)] block font-medium">{inst.location}</span>
                                  <span className="text-[11px] text-[#b85d24] font-medium">{inst.type}</span>
                                </div>
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#f5ece1] dark:bg-[#26211d] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                                  {inst.tier}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })
        )}
      </section>

    </div>
  );
};

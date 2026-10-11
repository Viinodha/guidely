/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Briefcase, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  BookOpen, 
  IndianRupee, 
  Cpu, 
  Building2,
  Atom,
  Lightbulb
} from 'lucide-react';
import { StudentProfile } from '../types/student';

interface AssessmentWizardProps {
  profile: StudentProfile;
  saveProfile: (updates: Partial<StudentProfile>) => void;
  onComplete: () => void;
}

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({
  profile,
  saveProfile,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Preset choices for school
  const schoolStreams = [
    { id: 'PCM (Physics, Chemistry, Mathematics)', title: 'Science (PCM)', desc: 'Engineering, Computing, Architecture, Pure Math & Physical Sciences', icon: Cpu },
    { id: 'PCB (Physics, Chemistry, Biology)', title: 'Science (PCB)', desc: 'Clinical Medicine, Biotechnology, Genetics & Allied Healthcare', icon: Atom },
    { id: 'PCMB (Physics, Chem, Math, Bio)', title: 'Science (PCMB)', desc: 'Dual versatility across Medical, Engineering, & Interdisciplinary Research', icon: Sparkles },
    { id: 'Commerce with Mathematics', title: 'Commerce + Math', desc: 'Chartered Accountancy, Actuarial Science, FinTech & Quantitative Economics', icon: IndianRupee },
    { id: 'Commerce without Mathematics', title: 'Commerce Regular', desc: 'Corporate Banking, Business Administration, Marketing & Law', icon: Building2 },
    { id: 'Humanities & Social Sciences', title: 'Humanities & Arts', desc: 'Law (CLAT), Civil Services (UPSC), Journalism, Psychology & Public Policy', icon: BookOpen },
  ];

  // Preset choices for college
  const collegeMajors = [
    { id: 'Computer Science & Engineering / IT', title: 'CSE / IT / Data & AI', desc: 'Software systems, Distributed cloud, Machine learning & Product engineering', icon: Cpu },
    { id: 'Core Engineering (Mechanical / Civil / EEE / ECE)', title: 'Core Engineering', desc: 'Industrial robotics, EV powertrains, Smart infrastructure & Hardware systems', icon: Building2 },
    { id: 'Commerce, B.Com, BBA & Management', title: 'Commerce & Business', desc: 'Corporate finance, Investment banking, CA, CFA & Top B-School MBA', icon: IndianRupee },
    { id: 'Pure Sciences & Life Sciences (B.Sc / M.Sc)', title: 'Pure & Life Sciences', desc: 'Fundamental academic research, Bioinformatics, Pharmaceuticals & Genomics', icon: Atom },
    { id: 'Law, Humanities, Arts & Journalism', title: 'Law, Policy & Media', desc: 'Corporate law, Judicial services, Civil administration & Policy strategy', icon: BookOpen },
    { id: 'Design & Architecture (B.Des / B.Arch)', title: 'Design & Architecture', desc: 'Product UI/UX design, Sustainable urban spaces & Creative media systems', icon: Lightbulb },
  ];

  const subjectOptions = [
    'Mathematics',
    'Computer Science & Programming',
    'Physics',
    'Chemistry',
    'Biology & Life Sciences',
    'Economics & Macro-Finance',
    'Accountancy & Auditing',
    'Business Management',
    'Polity, History & Legal Reasoning',
    'English & Critical Reading',
    'Design, Aesthetics & Visual Arts',
    'Psychology & Behavioral Science',
  ];

  const locationOptions: ('Tier 1 Metro' | 'Tier 2 Emerging' | 'Pan-India / State Hubs' | 'Remote / Hybrid')[] = [
    'Tier 1 Metro',
    'Tier 2 Emerging',
    'Pan-India / State Hubs',
    'Remote / Hybrid',
  ];

  const budgetOptions: ('Government Subsidized (< ₹2.5L)' | 'Moderate (₹3L - ₹10L)' | 'Premium (₹10L - ₹25L+)' | 'Flexible / Merit Scholarships')[] = [
    'Government Subsidized (< ₹2.5L)',
    'Moderate (₹3L - ₹10L)',
    'Premium (₹10L - ₹25L+)',
    'Flexible / Merit Scholarships',
  ];

  const workStyleOptions = [
    'Analytical & Deep Problem Solving',
    'Creative & Visual Storytelling',
    'Public Governance & Administration',
    'Corporate Consulting & Client Advisory',
    'Scientific Laboratory & Research',
    'Hands-on Prototyping & Engineering',
  ];

  const readinessOptions: ('Already preparing intensively' | 'Planning to start now' | 'Prefer direct merit / low-exam pathways' | 'Open to guidance')[] = [
    'Already preparing intensively',
    'Planning to start now',
    'Prefer direct merit / low-exam pathways',
    'Open to guidance',
  ];

  const toggleSubject = (sub: string) => {
    const current = profile.favoriteSubjects || [];
    const updated = current.includes(sub)
      ? current.filter((s) => s !== sub)
      : [...current, sub];
    saveProfile({ favoriteSubjects: updated });
  };

  const toggleWorkStyle = (ws: string) => {
    const current = profile.workStyle || [];
    const updated = current.includes(ws)
      ? current.filter((w) => w !== ws)
      : [...current, ws];
    saveProfile({ workStyle: updated });
  };

  const toggleLocation = (loc: 'Tier 1 Metro' | 'Tier 2 Emerging' | 'Pan-India / State Hubs' | 'Remote / Hybrid') => {
    const current = profile.preferredLocations || [];
    const updated = current.includes(loc)
      ? current.filter((l) => l !== loc)
      : [...current, loc];
    saveProfile({ preferredLocations: updated });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 space-y-10">
      
      {/* Progress Header - Airy & Clean */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-[#b86634] dark:text-[#de8953] font-semibold">
              Step {currentStep} of 3 · Student Profile Intake
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)]">
              {currentStep === 1 && 'Where are you currently situated?'}
              {currentStep === 2 && 'Your Academic Foundation'}
              {currentStep === 3 && 'Aspirations & Practical Realities'}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {currentStep === 1 && 'Guidley customizes every recommendation based on whether you are navigating school boards or college placements.'}
              {currentStep === 2 && 'Share your primary stream, academic scores, and the topics you genuinely find stimulating.'}
              {currentStep === 3 && 'Help us ground advice in your financial preferences, preferred cities, and exam readiness.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-all ${
                  step === currentStep
                    ? 'bg-[#c76f3b] text-white shadow-sm font-bold'
                    : step < currentStep
                    ? 'bg-[#edd9c8] dark:bg-[#342a22] text-[#b86634] dark:text-[#e08953]'
                    : 'bg-[#f0e8dc] dark:bg-[#201c1a] text-[var(--text-muted)]'
                }`}
              >
                {step < currentStep ? <Check className="w-4 h-4 stroke-[2.5]" /> : step}
              </div>
            ))}
          </div>
        </div>

        {/* Calm Progress Bar */}
        <div className="w-full h-1.5 bg-[#ede4d6] dark:bg-[#2c2723] rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3}>
          <div
            className="h-full bg-[#c76f3b] transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Dynamic Step Content */}
      <AnimatePresence mode="wait">
        
        {/* STEP 1: EDUCATION LEVEL & USER TYPE */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-10"
          >
            {/* Primary Mode Selector */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                1. Select your current academic journey
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* School Card */}
                <button
                  type="button"
                  onClick={() => saveProfile({ userType: 'school' })}
                  className={`p-7 rounded-2xl text-left border transition-all relative group airy-card ${
                    profile.userType === 'school'
                      ? 'border-[#c76f3b] ring-2 ring-[#c76f3b]/20 bg-[#fdfaf5] dark:bg-[#27221e]'
                      : 'hover:border-[#d9cbba] bg-[var(--bg-card)]'
                  }`}
                  aria-pressed={profile.userType === 'school'}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f5ede2] dark:bg-[#342a22] text-[#c76f3b] flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 stroke-[2]" />
                    </div>
                    {profile.userType === 'school' && (
                      <span className="w-5 h-5 rounded-full bg-[#c76f3b] text-white flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">
                    School Student
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Class 9 to 12. Focus on Stream selection, Board preparation, CUET, JEE, NEET, CLAT, NID, and undergraduate admissions.
                  </p>
                </button>

                {/* College Card */}
                <button
                  type="button"
                  onClick={() => saveProfile({ userType: 'college' })}
                  className={`p-7 rounded-2xl text-left border transition-all relative group airy-card ${
                    profile.userType === 'college'
                      ? 'border-[#c76f3b] ring-2 ring-[#c76f3b]/20 bg-[#fdfaf5] dark:bg-[#27221e]'
                      : 'hover:border-[#d9cbba] bg-[var(--bg-card)]'
                  }`}
                  aria-pressed={profile.userType === 'college'}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f5ede2] dark:bg-[#342a22] text-[#c76f3b] flex items-center justify-center">
                      <Briefcase className="w-6 h-6 stroke-[2]" />
                    </div>
                    {profile.userType === 'college' && (
                      <span className="w-5 h-5 rounded-full bg-[#c76f3b] text-white flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">
                    College / Graduate
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Undergraduate, Postgraduate, or Recent Graduate. Focus on campus placements, GATE, CAT, UPSC, internships, and high-ROI career launch.
                  </p>
                </button>
              </div>
            </div>

            {/* Sub-stage selector */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                {profile.userType === 'school'
                  ? '2. What is your current class?'
                  : '2. Which year of college or graduation are you in?'}
              </label>

              {profile.userType === 'school' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Class 9-10 (Foundations & Stream Selection)',
                    'Class 11-12 (Entrance & Board Focus)',
                  ].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => saveProfile({ schoolLevel: level as any })}
                      className={`p-5 rounded-2xl border text-left text-xs font-medium transition-all airy-card ${
                        profile.schoolLevel === level
                          ? 'border-[#c76f3b] bg-[#fdfaf5] dark:bg-[#27221e] text-[var(--text-primary)] font-semibold ring-1 ring-[#c76f3b]/30'
                          : 'hover:border-[#d9cbba] text-[var(--text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{level}</span>
                        {profile.schoolLevel === level && (
                          <Check className="w-4 h-4 text-[#c76f3b]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    '1st Year (Exploring & Foundations)',
                    '2nd Year (Core Skills & Internships)',
                    '3rd / 4th Year (Placements & Exams)',
                    'Graduated / Preparing',
                  ].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => saveProfile({ collegeYear: yr as any })}
                      className={`p-5 rounded-2xl border text-left text-xs font-medium transition-all airy-card ${
                        profile.collegeYear === yr
                          ? 'border-[#c76f3b] bg-[#fdfaf5] dark:bg-[#27221e] text-[var(--text-primary)] font-semibold ring-1 ring-[#c76f3b]/30'
                          : 'hover:border-[#d9cbba] text-[var(--text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{yr}</span>
                        {profile.collegeYear === yr && (
                          <Check className="w-4 h-4 text-[#c76f3b]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* College Trajectory Goal (Placements vs Higher Education) */}
            {profile.userType === 'college' && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-[var(--text-primary)]">
                  3. What is your primary ambition post-graduation?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => saveProfile({ collegeGoal: 'placements' })}
                    className={`p-5 rounded-2xl border text-left transition-all airy-card cursor-pointer ${
                      (profile.collegeGoal || 'placements') === 'placements'
                        ? 'border-[#b85d24] bg-[#fdfaf5] dark:bg-[#27221e] ring-2 ring-[#b85d24]/20 shadow-xs'
                        : 'hover:border-[#dfd5c7] bg-[var(--bg-card)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-[var(--text-primary)]">
                        Campus Placements & Corporate Jobs
                      </span>
                      {(profile.collegeGoal || 'placements') === 'placements' && (
                        <Check className="w-4 h-4 text-[#b85d24]" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      On-campus & off-campus hiring drives, single-page ATS resume, coding/case interviews, and company referrals.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => saveProfile({ collegeGoal: 'higher_education' })}
                    className={`p-5 rounded-2xl border text-left transition-all airy-card cursor-pointer ${
                      profile.collegeGoal === 'higher_education'
                        ? 'border-[#b85d24] bg-[#fdfaf5] dark:bg-[#27221e] ring-2 ring-[#b85d24]/20 shadow-xs'
                        : 'hover:border-[#dfd5c7] bg-[var(--bg-card)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-[var(--text-primary)]">
                        Higher Education (GATE / CAT / Masters)
                      </span>
                      {profile.collegeGoal === 'higher_education' && (
                        <Check className="w-4 h-4 text-[#b85d24]" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Competitive Master’s exams (GATE, CAT, GRE, GMAT, CSIR-NET), SOP drafting, and premier institute admissions.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => saveProfile({ collegeGoal: 'public_sector' })}
                    className={`p-5 rounded-2xl border text-left transition-all airy-card cursor-pointer ${
                      profile.collegeGoal === 'public_sector'
                        ? 'border-[#b85d24] bg-[#fdfaf5] dark:bg-[#27221e] ring-2 ring-[#b85d24]/20 shadow-xs'
                        : 'hover:border-[#dfd5c7] bg-[var(--bg-card)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-[var(--text-primary)]">
                        Public Sector & Competitive Exams
                      </span>
                      {profile.collegeGoal === 'public_sector' && (
                        <Check className="w-4 h-4 text-[#b85d24]" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      UPSC Civil Services (IAS/IPS), State PSCs, Engineering Services (IES), PSU recruitments, and Banking examinations.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Student Name */}
            <div className="space-y-3">
              <label htmlFor="studentName" className="block text-sm font-semibold text-[var(--text-primary)]">
                Your Name (for personalized reports)
              </label>
              <input
                id="studentName"
                type="text"
                value={profile.studentName || ''}
                onChange={(e) => saveProfile({ studentName: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full sm:w-96 px-5 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] focus:border-[#c76f3b] focus:ring-1 focus:ring-[#c76f3b] outline-none shadow-xs font-medium"
              />
            </div>
          </motion.div>
        )}

        {/* STEP 2: STREAM, SCORES & FAVORITE SUBJECTS */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-10"
          >
            {/* Stream/Major Card Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                {profile.userType === 'school'
                  ? '1. Current or Targeted Senior Secondary Stream (10+2)'
                  : '1. Undergraduate Degree / Academic Discipline'}
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(profile.userType === 'school' ? schoolStreams : collegeMajors).map((item) => {
                  const Icon = item.icon;
                  const isSelected = profile.streamOrMajor.includes(item.title) || profile.streamOrMajor === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => saveProfile({ streamOrMajor: item.id })}
                      className={`p-5 rounded-2xl border text-left transition-all relative airy-card ${
                        isSelected
                          ? 'border-[#c76f3b] bg-[#fdfaf5] dark:bg-[#27221e] ring-2 ring-[#c76f3b]/20 shadow-xs'
                          : 'hover:border-[#d9cbba] bg-[var(--bg-card)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#f4eae0] dark:bg-[#342921] text-[#c76f3b]' : 'bg-[#f3ede3] dark:bg-[#24201d] text-[var(--text-muted)]'}`}>
                          <Icon className="w-4 h-4 stroke-[2]" />
                        </div>
                        <h4 className="font-semibold text-sm text-[var(--text-primary)]">{item.title}</h4>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Academic Score / CGPA */}
            <div className="p-7 rounded-2xl airy-card space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label htmlFor="scoreRange" className="block text-sm font-semibold text-[var(--text-primary)]">
                    2. Recent Academic Benchmark
                  </label>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Used to evaluate deterministic admission criteria and eligibility cutoffs.
                  </p>
                </div>

                {/* Score Type Toggle */}
                <div className="flex items-center gap-1 p-1 bg-[#ede4d6] dark:bg-[#2a2522] rounded-xl border border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => saveProfile({ academicScoreType: 'percentage', academicScore: Math.min(Math.round(profile.academicScore * 9.5), 98) })}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      profile.academicScoreType === 'percentage'
                        ? 'bg-white dark:bg-[#1a1715] text-[#c76f3b] shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => saveProfile({ academicScoreType: 'cgpa', academicScore: Math.min(Number((profile.academicScore / 10).toFixed(1)), 10.0) })}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      profile.academicScoreType === 'cgpa'
                        ? 'bg-white dark:bg-[#1a1715] text-[#c76f3b] shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    CGPA (10.0)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-5 pt-2">
                <input
                  id="scoreRange"
                  type="range"
                  min={profile.academicScoreType === 'cgpa' ? 5.0 : 45}
                  max={profile.academicScoreType === 'cgpa' ? 10.0 : 99}
                  step={profile.academicScoreType === 'cgpa' ? 0.1 : 1}
                  value={profile.academicScore}
                  onChange={(e) => saveProfile({ academicScore: parseFloat(e.target.value) })}
                  className="w-full accent-[#c76f3b] h-2.5 bg-[#ede4d6] dark:bg-[#2e2925] rounded-lg cursor-pointer"
                  aria-label="Academic score slider"
                />
                <span className="font-display font-bold text-2xl text-[#c76f3b] min-w-24 text-right">
                  {profile.academicScore}
                  {profile.academicScoreType === 'cgpa' ? ' / 10' : '%'}
                </span>
              </div>
            </div>

            {/* Favorite Subjects Multi-Select */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                3. What subjects or intellectual domains do you naturally enjoy? (Select 2–4)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {subjectOptions.map((subj) => {
                  const isChecked = profile.favoriteSubjects?.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        isChecked
                          ? 'border-[#c76f3b] bg-[#fbf3ec] dark:bg-[#342921] text-[#b86634] dark:text-[#f29f6d] font-semibold ring-1 ring-[#c76f3b]/30'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[#d9cbba]'
                      }`}
                      aria-pressed={isChecked}
                    >
                      {subj}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PREFERENCES, BUDGET & EXAM READINESS */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-10"
          >
            {/* Budget Tier */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                1. Expected Total Education Investment & Family Financial Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {budgetOptions.map((budget) => (
                  <button
                    key={budget}
                    type="button"
                    onClick={() => saveProfile({ budgetPreference: budget })}
                    className={`p-5 rounded-2xl border text-left text-xs font-medium transition-all airy-card ${
                      profile.budgetPreference === budget
                        ? 'border-[#c76f3b] bg-[#fdfaf5] dark:bg-[#27221e] ring-1 ring-[#c76f3b]/30'
                        : 'hover:border-[#d9cbba] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-[var(--text-primary)]">{budget}</span>
                      {profile.budgetPreference === budget && (
                        <Check className="w-4 h-4 text-[#c76f3b]" />
                      )}
                    </div>
                    <span className="text-[var(--text-muted)] text-[11px] leading-relaxed block">
                      {budget.includes('Subsidized')
                        ? 'Central IITs, NITs, AIIMS, DU, and Govt Institutions.'
                        : budget.includes('Moderate')
                        ? 'Premier autonomous colleges, state universities, and top merit institutions.'
                        : budget.includes('Premium')
                        ? 'Top private universities (BITS Pilani, Ashoka, ISB, international tracks).'
                        : 'Open to merit-based collateral-free student loans & scholarships (NSP, PMSSS).'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Preference */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                2. Preferred College or Work Geographic Hubs
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {locationOptions.map((loc) => {
                  const isChecked = profile.preferredLocations?.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className={`p-3.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        isChecked
                          ? 'border-[#c76f3b] bg-[#fbf3ec] dark:bg-[#342921] text-[#b86634] dark:text-[#f29f6d] font-semibold'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[#d9cbba]'
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Work Style Alignment */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                3. Work Environment & Daily Problem-Solving Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workStyleOptions.map((style) => {
                  const isChecked = profile.workStyle?.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleWorkStyle(style)}
                      className={`p-4 rounded-xl border text-left text-xs font-medium transition-all airy-card ${
                        isChecked
                          ? 'border-[#c76f3b] bg-[#fbf3ec] dark:bg-[#342921] text-[#b86634] dark:text-[#f29f6d] font-semibold'
                          : 'hover:border-[#d9cbba] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{style}</span>
                        {isChecked && <Check className="w-4 h-4 text-[#c76f3b]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Entrance Exam Readiness */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                4. Entrance Exam Readiness (JEE, NEET, CUET, CLAT, CAT, GATE)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {readinessOptions.map((readiness) => (
                  <button
                    key={readiness}
                    type="button"
                    onClick={() => saveProfile({ entranceExamReadiness: readiness })}
                    className={`p-4 rounded-xl border text-left text-xs font-medium transition-all airy-card ${
                      profile.entranceExamReadiness === readiness
                        ? 'border-[#c76f3b] bg-[#fbf3ec] dark:bg-[#342921] text-[#b86634] dark:text-[#f29f6d] font-semibold ring-1 ring-[#c76f3b]/30'
                        : 'hover:border-[#d9cbba] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{readiness}</span>
                      {profile.entranceExamReadiness === readiness && (
                        <Check className="w-4 h-4 text-[#c76f3b]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons Footer */}
      <div className="pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#c76f3b] hover:bg-[#b56130] text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <span>Proceed to Step {currentStep + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onComplete}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#c76f3b] hover:bg-[#b56130] text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>View My Recommendations</span>
          </button>
        )}
      </div>
    </div>
  );
};

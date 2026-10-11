/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  TrendingUp, 
  Building2, 
  Code2, 
  CheckCircle2, 
  Sparkles,
  MessageSquare,
  GraduationCap
} from 'lucide-react';

interface CollegePlacementHubProps {
  collegeGoal?: 'placements' | 'higher_education' | 'public_sector';
  streamOrMajor: string;
  onSelectGoal?: (goal: 'placements' | 'higher_education' | 'public_sector') => void;
}

export const CollegePlacementHub: React.FC<CollegePlacementHubProps> = ({
  collegeGoal = 'placements',
  streamOrMajor,
  onSelectGoal,
}) => {
  const [activeTab, setActiveTab] = useState<'portals' | 'resume' | 'referrals' | 'salary_bands' | 'interview_prep'>('portals');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedResumeSnippet, setCopiedResumeSnippet] = useState<boolean>(false);

  const referralScript = `Hi [Name],

I came across your work as a [Role] at [Company] and really admire your team's work on [Specific Product or Feature]. 

As a student at [College Name] specializing in ${streamOrMajor || 'my discipline'}, I have built strong hands-on experience in [Key Skills / Tech Stack] and recently developed [1-line description of notable project or achievement].

I noticed Job ID #[Req ID] for the [Target Role] role is currently open. If you have a few minutes, would you be open to reviewing my single-page resume for an employee referral?

Resume Link: [Portfolio or Drive Link]
LinkedIn / GitHub: [Profile URL]

Thank you so much for your guidance and time!
Best regards,
[Your Name]`;

  const resumeSnippet = `\\resumeSubheading
  {Software Engineering Intern}{June 2024 -- Aug 2024}
  {Acme Technologies}{Bengaluru, India}
  \\resumeItemListStart
    \\resumeItem{Architected and deployed distributed cache layer using Redis, reducing API p99 latency by 38\\% across 2M daily requests.}
    \\resumeItem{Implemented asynchronous job worker queue in Go, decreasing failed transactions from 2.1\\% to under 0.05\\%.}
    \\resumeItem{Partnered with senior engineers to author automated end-to-end integration test suites with 92\\% branch coverage.}
  \\resumeItemListEnd`;

  const copyToClipboard = (text: string, type: 'referral' | 'resume') => {
    navigator.clipboard.writeText(text);
    if (type === 'referral') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2200);
    } else {
      setCopiedResumeSnippet(true);
      setTimeout(() => setCopiedResumeSnippet(false), 2200);
    }
  };

  const jobPortals = [
    {
      name: 'LinkedIn Jobs & Alumni Network',
      description: 'The #1 platform for finding hiring managers, second-degree alumni, and securing direct employee referrals.',
      bestFor: 'Targeting mid-to-large product companies, consulting firms, and alumni networking.',
      badge: 'Highest Response Rate via Referrals',
      url: 'https://www.linkedin.com/jobs',
    },
    {
      name: 'Wellfound (Formerly AngelList Talent)',
      description: 'Direct access to founders and engineering leads at funded seed-to-Series C startups with transparent equity and CTC.',
      bestFor: 'High-growth startups, product engineers, modern UI/UX designers, and early-stage growth roles.',
      badge: 'Zero Third-Party Recruiters',
      url: 'https://wellfound.com/jobs',
    },
    {
      name: 'Hirist & Cutshort',
      description: 'Curated Indian technology and engineering hiring platform with verified job postings and direct recruiter messaging.',
      bestFor: 'Specialized tech stacks, backend development, data engineering, and devops roles in India.',
      badge: 'Curated Indian Tech Openings',
      url: 'https://www.hirist.tech',
    },
    {
      name: 'Instahyre',
      description: 'Inverted hiring platform powered by AI where top Indian tech employers reach out directly to candidates based on verified skills.',
      bestFor: 'Bypassing noisy job boards and getting invited directly to technical screening rounds.',
      badge: 'Companies Apply to You',
      url: 'https://www.instahyre.com',
    },
    {
      name: 'Unstop (Formerly Dare2Compete)',
      description: 'National campus recruitment challenges, hackathons, and corporate case competitions offering direct Pre-Placement Interviews (PPIs).',
      bestFor: 'College students seeking off-campus breakthroughs via competitive coding and business case challenges.',
      badge: 'Direct PPI & PPO Contests',
      url: 'https://unstop.com',
    },
  ];

  return (
    <div className="airy-card rounded-3xl p-7 sm:p-9 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-7 shadow-xs">
      
      {/* Header with Goal Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[var(--border-subtle)] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#b85d24]" />
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
              College Placement & Career Transition Hub
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            Specialized resources, ATS resume formulas, verified off-campus job portals, and alumni referral templates designed specifically for college students transitioning into industry.
          </p>
        </div>

        {/* Ambition Quick Selector */}
        {onSelectGoal && (
          <div className="flex items-center gap-1.5 p-1 bg-[#f5ede3] dark:bg-[#201c19] rounded-2xl border border-[var(--border-subtle)] self-start lg:self-auto shrink-0">
            <button
              onClick={() => onSelectGoal('placements')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                collegeGoal === 'placements'
                  ? 'bg-[#b85d24] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Placements</span>
            </button>
            <button
              onClick={() => onSelectGoal('higher_education')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                collegeGoal === 'higher_education'
                  ? 'bg-[#b85d24] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Higher Ed</span>
            </button>
            <button
              onClick={() => onSelectGoal('public_sector')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                collegeGoal === 'public_sector'
                  ? 'bg-[#b85d24] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Public Sector</span>
            </button>
          </div>
        )}
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[var(--border-subtle)]">
        {[
          { id: 'portals', label: 'Off-Campus Job Portals', icon: ExternalLink },
          { id: 'resume', label: 'ATS Resume Architecture', icon: FileText },
          { id: 'referrals', label: 'Alumni Referral Script', icon: MessageSquare },
          { id: 'salary_bands', label: 'Indian Compensation Tiers', icon: TrendingUp },
          { id: 'interview_prep', label: 'Interview Problem Banks', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#b85d24] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OFF-CAMPUS JOB PORTALS */}
      {activeTab === 'portals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobPortals.map((portal, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                      {portal.name}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#faeee4] dark:bg-[#2b231d] text-[#b85d24] shrink-0 border border-[#edd7c4] dark:border-[#3d2e24]">
                      {portal.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {portal.description}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    <strong className="text-[var(--text-secondary)]">Best for:</strong> {portal.bestFor}
                  </p>
                </div>

                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#b85d24] hover:text-[#944414] font-semibold pt-2"
                >
                  <span>Visit Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ATS RESUME ARCHITECTURE */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Guidelines */}
            <div className="p-6 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-4">
              <h3 className="font-display font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#b85d24]" />
                The Google XYZ Resume Formula
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Applicant Tracking Systems (ATS) reject 75% of resumes because they list generic responsibilities instead of measurable outcomes. Every bullet point on your resume must follow:
              </p>

              <div className="p-4 rounded-xl bg-white dark:bg-[#241f1c] border border-[var(--border-subtle)] font-mono text-xs text-[#b85d24] dark:text-[#f09a65]">
                "Accomplished [X] as measured by [Y] by doing [Z]"
              </div>

              <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                <div className="p-3 rounded-xl bg-[#faeee4]/50 dark:bg-[#261f1a] border border-[#ecd5c3] dark:border-[#3b2d24]">
                  <strong className="text-[#c73b2b] block mb-1">❌ Weak (Task-Oriented):</strong>
                  "Responsible for building the backend database and working on API endpoints."
                </div>
                <div className="p-3 rounded-xl bg-[#f0f8f3] dark:bg-[#18261e] border border-[#c4e5ce] dark:border-[#20402b]">
                  <strong className="text-[#207a41] dark:text-[#52c27b] block mb-1">✓ Strong (Impact-Oriented):</strong>
                  "Architected PostgreSQL indexing strategy and optimized 14 relational queries, reducing query execution latency by 45% during peak loads."
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)] block">Standard 1-Page Layout Rules:</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-[var(--text-muted)]">
                  <li>Strictly 1 single page; 0.5 to 0.75-inch margins.</li>
                  <li>Do NOT include photos, age, address, or marital status.</li>
                  <li>Use ATS-friendly fonts: Inter, Helvetica, Garamond, or Computer Modern.</li>
                  <li>Hyperlink verified GitHub, LinkedIn, and live project deployments.</li>
                </ul>
              </div>
            </div>

            {/* Right Copyable Snippet */}
            <div className="p-6 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                    ATS-Optimized LaTeX Bullet Snippet
                  </h3>
                  <button
                    onClick={() => copyToClipboard(resumeSnippet, 'resume')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b85d24] text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    {copiedResumeSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedResumeSnippet ? 'Copied' : 'Copy LaTeX'}</span>
                  </button>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Use this LaTeX structure in Overleaf (based on Jake’s Resume standard template, widely recognized by Tier 1 recruiters).
                </p>

                <pre className="p-4 rounded-xl bg-white dark:bg-[#12100e] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-primary)] dark:text-white overflow-x-auto leading-relaxed">
                  {resumeSnippet}
                </pre>
              </div>

              <div className="pt-2 text-xs text-[var(--text-muted)]">
                Tip: Test your exported PDF on free ATS checkers like ResumeWorded or Jobscan before applying.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: ALUMNI REFERRAL SCRIPT */}
      {activeTab === 'referrals' && (
        <div className="p-6 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Cold Referral Outreach Message (80%+ Response Rate)
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Copy this high-converting template to message college alumni or engineers on LinkedIn.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(referralScript, 'referral')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b85d24] text-white text-xs font-semibold cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
            >
              {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script'}</span>
            </button>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#151210] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)] dark:text-white leading-relaxed whitespace-pre-wrap">
            {referralScript}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--text-secondary)]">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#201c19] border border-[var(--border-subtle)]">
              <strong className="text-[var(--text-primary)] block mb-1">Rule 1: Specify Job ID</strong>
              Never ask generally "can you refer me?". Always include the exact Job ID from their official careers portal.
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#201c19] border border-[var(--border-subtle)]">
              <strong className="text-[var(--text-primary)] block mb-1">Rule 2: Hyperlink Resume</strong>
              Make it frictionless. Store a public view-only Google Drive or personal portfolio link.
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#201c19] border border-[var(--border-subtle)]">
              <strong className="text-[var(--text-primary)] block mb-1">Rule 3: Follow Up Politely</strong>
              If they do not respond within 5 business days, send one polite 1-sentence follow-up nudge.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INDIAN SALARY BANDS BY TIER */}
      {activeTab === 'salary_bands' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b85d24] px-2 py-0.5 rounded bg-[#faeee4] dark:bg-[#2e231b]">
                Tier 1 Product MNCs
              </span>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                Google, Microsoft, Uber, Atlassian, Adobe
              </h4>
              <div className="text-xl font-extrabold text-[var(--text-primary)]">
                ₹18 - ₹45 LPA
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Base salary ₹14-22L + Joining Bonus ₹2-5L + US Stock RSUs vested over 4 years.
              </p>
              <div className="text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                Selection focus: LeetCode Hard, System Design, OS/Networking internals.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b5a2b] px-2 py-0.5 rounded bg-[#faeee4] dark:bg-[#2e231b]">
                High-Growth Startups
              </span>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                Razorpay, CRED, Swiggy, Zerodha, BrowserStack
              </h4>
              <div className="text-xl font-extrabold text-[var(--text-primary)]">
                ₹12 - ₹28 LPA
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                High cash base + Employee Stock Options (ESOPs). Accelerated promotion velocity.
              </p>
              <div className="text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                Selection focus: Fullstack machine coding, clean architecture, product ownership.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a0681c] px-2 py-0.5 rounded bg-[#faeee4] dark:bg-[#2e231b]">
                Consulting & Finance
              </span>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                McKinsey, BCG, Bain, Big 4, Goldman Sachs
              </h4>
              <div className="text-xl font-extrabold text-[var(--text-primary)]">
                ₹10 - ₹24 LPA
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Management consulting analyst CTC or investment banking analyst base + performance bonus.
              </p>
              <div className="text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                Selection focus: Case interviews, guesstimates, financial modeling, communication.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2 py-0.5 rounded bg-[#faeee4] dark:bg-[#2e231b]">
                IT Services & Core
              </span>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                TCS (Digital/Prime), Infosys, Wipro, L&T
              </h4>
              <div className="text-xl font-extrabold text-[var(--text-primary)]">
                ₹4.5 - ₹9 LPA
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Mass on-campus hiring drives and elite digital cohorts (e.g. TCS Prime at ₹9 LPA).
              </p>
              <div className="text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                Selection focus: Quantitative aptitude, basic pseudo-code, verbal communication.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: INTERVIEW PROBLEM BANKS */}
      {activeTab === 'interview_prep' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-2.5">
            <h4 className="font-display font-bold text-sm text-[var(--text-primary)]">Software & Computing</h4>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li>• <strong>NeetCode 150:</strong> 150 core LeetCode algorithmic patterns.</li>
              <li>• <strong>Striver SDE Sheet:</strong> Top 190 questions asked in Indian tech interviews.</li>
              <li>• <strong>System Design Primer:</strong> Microservices, Redis caching, SQL vs NoSQL.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-2.5">
            <h4 className="font-display font-bold text-sm text-[var(--text-primary)]">Commerce & Finance</h4>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li>• <strong>Wall Street Prep:</strong> Integrated 3-statement modeling in Excel.</li>
              <li>• <strong>Damodaran Valuation:</strong> Free NYU Stern corporate finance & DCF lectures.</li>
              <li>• <strong>Mergers & Inquisitions:</strong> 400 Technical Investment Banking questions.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf6f0] dark:bg-[#1d1917] border border-[var(--border-subtle)] space-y-2.5">
            <h4 className="font-display font-bold text-sm text-[var(--text-primary)]">Core Engineering & Biotech</h4>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li>• <strong>Made Easy Core Handbook:</strong> Formulas and concepts for mechanical/EE.</li>
              <li>• <strong>MathWorks Simulink Onramp:</strong> Control systems and EV modeling.</li>
              <li>• <strong>Rosalind Bioinformatics:</strong> Algorithmic genetics & computational biology.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Bookmark, 
  Trash2, 
  GitCompare, 
  ArrowRight, 
  Check, 
  IndianRupee, 
  TrendingUp, 
  BookOpen, 
  Building2, 
  Sparkles,
  Award,
  Compass,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CAREER_DATABASE, CareerPath } from '../data/careerDatabase';
import { StudentProfile } from '../types/student';
import { calculateCareerMatches } from '../utils/recommendationEngine';

interface BookmarksCompareProps {
  profile: StudentProfile;
  onRemoveBookmark: (id: string) => void;
  onSelectCareer: (career: CareerPath) => void;
  onGoToDashboard: () => void;
}

export const BookmarksCompare: React.FC<BookmarksCompareProps> = ({
  profile,
  onRemoveBookmark,
  onSelectCareer,
  onGoToDashboard,
}) => {
  const bookmarkedCareers = CAREER_DATABASE.filter((c) =>
    profile.bookmarks?.includes(c.id)
  );

  const [compareIdA, setCompareIdA] = useState<string>(
    bookmarkedCareers[0]?.id || CAREER_DATABASE[0].id
  );
  const [compareIdB, setCompareIdB] = useState<string>(
    bookmarkedCareers[1]?.id || CAREER_DATABASE[1].id
  );

  const careerA = CAREER_DATABASE.find((c) => c.id === compareIdA) || CAREER_DATABASE[0];
  const careerB = CAREER_DATABASE.find((c) => c.id === compareIdB) || CAREER_DATABASE[1];

  const allScored = useMemo(() => calculateCareerMatches(profile), [profile]);
  const scoredA = allScored.find((s) => s.career.id === compareIdA) || allScored[0];
  const scoredB = allScored.find((s) => s.career.id === compareIdB) || allScored[1];
  const [chartMode, setChartMode] = useState<'radar' | 'bar'>('radar');

  const radarCompareData = useMemo(() => [
    { metric: 'Interest Score', [careerA.id]: scoredA?.comparisonMetrics?.interestScore ?? 75, [careerB.id]: scoredB?.comparisonMetrics?.interestScore ?? 75, fullMark: 100 },
    { metric: 'Skill Alignment', [careerA.id]: scoredA?.comparisonMetrics?.skillAlignment ?? 80, [careerB.id]: scoredB?.comparisonMetrics?.skillAlignment ?? 80, fullMark: 100 },
    { metric: 'Demand', [careerA.id]: scoredA?.comparisonMetrics?.demand ?? 85, [careerB.id]: scoredB?.comparisonMetrics?.demand ?? 85, fullMark: 100 },
    { metric: 'AI Match Fit', [careerA.id]: scoredA?.score ?? 80, [careerB.id]: scoredB?.score ?? 80, fullMark: 100 },
  ], [careerA.id, careerB.id, scoredA, scoredB]);

  const barCompareData = useMemo(() => [
    {
      metric: 'Interest Score',
      [careerA.title]: scoredA?.comparisonMetrics?.interestScore ?? 75,
      [careerB.title]: scoredB?.comparisonMetrics?.interestScore ?? 75,
    },
    {
      metric: 'Skill Alignment',
      [careerA.title]: scoredA?.comparisonMetrics?.skillAlignment ?? 80,
      [careerB.title]: scoredB?.comparisonMetrics?.skillAlignment ?? 80,
    },
    {
      metric: 'Demand',
      [careerA.title]: scoredA?.comparisonMetrics?.demand ?? 85,
      [careerB.title]: scoredB?.comparisonMetrics?.demand ?? 85,
    },
    {
      metric: 'AI Match Fit',
      [careerA.title]: scoredA?.score ?? 80,
      [careerB.title]: scoredB?.score ?? 80,
    },
  ], [careerA.title, careerB.title, scoredA, scoredB]);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider text-[#b86634] dark:text-[#de8953] font-semibold">
            Saved Pathways & Comparison
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)]">
            Saved Blueprints ({bookmarkedCareers.length})
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Review pathways you have bookmarked or compare two career tracks side-by-side.
          </p>
        </div>

        <button
          onClick={onGoToDashboard}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c76f3b] hover:bg-[#b56130] text-white font-semibold text-xs self-start sm:self-auto transition-transform active:scale-95 shadow-xs"
        >
          <span>Explore All Pathways</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bookmarked Grid */}
      {bookmarkedCareers.length === 0 ? (
        <div className="airy-card rounded-3xl p-12 text-center space-y-4">
          <Bookmark className="w-9 h-9 text-[var(--text-muted)] mx-auto" />
          <h3 className="font-semibold text-lg text-[var(--text-primary)]">No saved pathways yet</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
            Browse the recommendations dashboard and click the bookmark icon on any career to save and compare it here.
          </p>
          <button
            onClick={onGoToDashboard}
            className="px-5 py-2.5 rounded-xl bg-[#c76f3b] text-white font-semibold text-xs shadow-xs"
          >
            Go to Recommendations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedCareers.map((c) => (
            <div
              key={c.id}
              className="airy-card rounded-3xl p-7 border border-[var(--border-subtle)] airy-card-hover space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#b86634] dark:text-[#de8953]">{c.category}</span>
                  <button
                    onClick={() => onRemoveBookmark(c.id)}
                    className="text-[var(--text-muted)] hover:text-[#c93b2b] p-1.5 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  {c.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2.5 text-xs">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Entry Salary:</span>
                  <strong className="text-[var(--text-primary)] font-semibold">{c.estimatedSalaryRange.entry}</strong>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Demand Resilience:</span>
                  <strong className="text-[#c76f3b] font-semibold">{c.futureDemandScore}/100</strong>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => onSelectCareer(c)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#f5ede3] dark:bg-[#25201d] hover:bg-[#ede1d2] text-[var(--text-primary)] font-semibold text-xs text-center transition-colors shadow-xs"
                  >
                    Inspect Full Blueprint
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SIDE-BY-SIDE COMPARISON MATRIX - Relaxed, Airy Table */}
      <section className="airy-card rounded-3xl p-8 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-[var(--border-subtle)] pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#f5ede2] dark:bg-[#2c2621] text-[#c76f3b] flex items-center justify-center">
              <GitCompare className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
                Side-by-Side Comparison Matrix
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Evaluate financial return, preparation rigor, and institutions across any two paths.
              </p>
            </div>
          </div>

          {/* Selectors for Career A and Career B */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={compareIdA}
              onChange={(e) => setCompareIdA(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#c76f3b] outline-none shadow-xs"
            >
              {CAREER_DATABASE.map((c) => (
                <option key={c.id} value={c.id}>
                  Pathway A: {c.title}
                </option>
              ))}
            </select>

            <span className="text-xs text-[var(--text-muted)] font-semibold">vs</span>

            <select
              value={compareIdB}
              onChange={(e) => setCompareIdB(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#c76f3b] outline-none shadow-xs"
            >
              {CAREER_DATABASE.map((c) => (
                <option key={c.id} value={c.id}>
                  Pathway B: {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* VISUAL RECHARTS COMPARISON: INTEREST VS SKILLS VS DEMAND */}
        <div className="p-6 rounded-2xl bg-[#faf7f2] dark:bg-[#1c1815] border border-[var(--border-subtle)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c76f3b]" />
              <h3 className="text-xs font-bold text-[var(--text-primary)]">
                Visual Fit Radar & Metric Comparison
              </h3>
            </div>
            
            <div className="inline-flex rounded-xl bg-[var(--bg-card)] p-1 border border-[var(--border-subtle)]">
              <button
                onClick={() => setChartMode('radar')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMode === 'radar'
                    ? 'bg-[#c76f3b] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Radar Analysis</span>
              </button>
              <button
                onClick={() => setChartMode('bar')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMode === 'bar'
                    ? 'bg-[#c76f3b] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Side-by-Side Bars</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Chart Area */}
            <div className="lg:col-span-7 bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-subtle)] h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'radar' ? (
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarCompareData}>
                    <PolarGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fill: 'var(--text-primary)', fontSize: 10, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 8 }} />
                    <Radar
                      name={`${careerA.title} (${scoredA?.score}%)`}
                      dataKey={careerA.id}
                      stroke="#c76f3b"
                      fill="#c76f3b"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                    <Radar
                      name={`${careerB.title} (${scoredB?.score}%)`}
                      dataKey={careerB.id}
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '11px', color: 'var(--text-secondary)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-subtle)',
                        borderRadius: '0.75rem',
                        fontSize: '11px',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </RadarChart>
                ) : (
                  <BarChart data={barCompareData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="metric" tick={{ fill: 'var(--text-primary)', fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-subtle)',
                        borderRadius: '0.75rem',
                        fontSize: '11px',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '6px', fontSize: '11px', color: 'var(--text-secondary)' }} />
                    <Bar dataKey={careerA.title} fill="#c76f3b" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    <Bar dataKey={careerB.title} fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Quick Metrics Summary */}
            <div className="lg:col-span-5 space-y-3">
              <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#c76f3b] truncate max-w-[180px]">{careerA.title}</span>
                  <span className="font-bold text-[#c76f3b]">{scoredA?.score}% Fit</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-center pt-1">
                  <div className="p-1.5 rounded-lg bg-[#faf7f2] dark:bg-[#1a1714]">
                    <span className="text-[var(--text-muted)] block">Interest</span>
                    <span className="font-bold text-[var(--text-primary)]">{scoredA?.comparisonMetrics.interestScore}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#faf7f2] dark:bg-[#1a1714]">
                    <span className="text-[var(--text-muted)] block">Skills</span>
                    <span className="font-bold text-[var(--text-primary)]">{scoredA?.comparisonMetrics.skillAlignment}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#faf7f2] dark:bg-[#1a1714]">
                    <span className="text-[var(--text-muted)] block">Demand</span>
                    <span className="font-bold text-[var(--text-primary)]">{scoredA?.comparisonMetrics.demand}/100</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2563eb] truncate max-w-[180px]">{careerB.title}</span>
                  <span className="font-bold text-[#2563eb]">{scoredB?.score}% Fit</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-center pt-1">
                  <div className="p-1.5 rounded-lg bg-[#faf7f2] dark:bg-[#1a1714]">
                    <span className="text-[var(--text-muted)] block">Interest</span>
                    <span className="font-bold text-[var(--text-primary)]">{scoredB?.comparisonMetrics.interestScore}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#faf7f2] dark:bg-[#1a1714]">
                    <span className="text-[var(--text-muted)] block">Skills</span>
                    <span className="font-bold text-[var(--text-primary)]">{scoredB?.comparisonMetrics.skillAlignment}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#faf7f2] dark:bg-[#1a1714]">
                    <span className="text-[var(--text-muted)] block">Demand</span>
                    <span className="font-bold text-[var(--text-primary)]">{scoredB?.comparisonMetrics.demand}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--text-secondary)] border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                <th className="py-4 px-5 font-semibold w-1/4">Evaluation Metric</th>
                <th className="py-4 px-5 font-bold text-[#b86634] dark:text-[#de8953] text-sm w-3/8">
                  {careerA.title}
                </th>
                <th className="py-4 px-5 font-bold text-[#8c5936] dark:text-[#c48e6c] text-sm w-3/8">
                  {careerB.title}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              
              <tr>
                <td className="py-4 px-5 font-medium text-[var(--text-muted)]">Category & Audience</td>
                <td className="py-4 px-5">{careerA.category} ({careerA.targetAudience})</td>
                <td className="py-4 px-5">{careerB.category} ({careerB.targetAudience})</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-[var(--text-muted)]">Entry Compensation</td>
                <td className="py-4 px-5 font-bold text-[var(--text-primary)]">{careerA.estimatedSalaryRange.entry}</td>
                <td className="py-4 px-5 font-bold text-[var(--text-primary)]">{careerB.estimatedSalaryRange.entry}</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-[var(--text-muted)]">Senior Peak Compensation</td>
                <td className="py-4 px-5 text-[#b86634] dark:text-[#e08953] font-semibold">{careerA.estimatedSalaryRange.senior}</td>
                <td className="py-4 px-5 text-[#8c5936] dark:text-[#c48e6c] font-semibold">{careerB.estimatedSalaryRange.senior}</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-[var(--text-muted)]">Estimated Education Cost</td>
                <td className="py-4 px-5">{careerA.roiIndicator.estimatedEducationCost}</td>
                <td className="py-4 px-5">{careerB.roiIndicator.estimatedEducationCost}</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-[var(--text-muted)]">ROI Break-Even Period</td>
                <td className="py-4 px-5 font-semibold text-[var(--text-primary)]">{careerA.roiIndicator.breakEvenPeriod}</td>
                <td className="py-4 px-5 font-semibold text-[var(--text-primary)]">{careerB.roiIndicator.breakEvenPeriod}</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-[var(--text-muted)]">Future Demand Resilience</td>
                <td className="py-4 px-5 font-bold text-[#b86634] dark:text-[#de8953]">{careerA.futureDemandScore} / 100</td>
                <td className="py-4 px-5 font-bold text-[#8c5936] dark:text-[#c48e6c]">{careerB.futureDemandScore} / 100</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-[var(--text-muted)]">Primary Entrance Exam</td>
                <td className="py-4 px-5">
                  <div className="font-semibold text-[var(--text-primary)]">{careerA.keyExams[0]?.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{careerA.keyExams[0]?.timeline} ({careerA.keyExams[0]?.difficulty} Rigor)</div>
                </td>
                <td className="py-4 px-5">
                  <div className="font-semibold text-[var(--text-primary)]">{careerB.keyExams[0]?.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{careerB.keyExams[0]?.timeline} ({careerB.keyExams[0]?.difficulty} Rigor)</div>
                </td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-[var(--text-muted)]">Top Institutions</td>
                <td className="py-4 px-5">{careerA.topInstitutions.slice(0, 2).map((i) => i.name).join(', ')}</td>
                <td className="py-4 px-5">{careerB.topInstitutions.slice(0, 2).map((i) => i.name).join(', ')}</td>
              </tr>

              <tr>
                <td className="py-4 px-5 font-medium text-[var(--text-muted)]">Stream Requirements</td>
                <td className="py-4 px-5">{careerA.eligibilityRequirements.streamConstraints.join(' / ')}</td>
                <td className="py-4 px-5">{careerB.eligibilityRequirements.streamConstraints.join(' / ')}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

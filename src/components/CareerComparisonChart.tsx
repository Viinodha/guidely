/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
  Cell,
} from 'recharts';
import {
  Sparkles,
  BarChart3,
  Compass,
  Info,
  TrendingUp,
  Brain,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import { ScoredCareer } from '../utils/recommendationEngine';
import { CareerPath } from '../data/careerDatabase';

interface CareerComparisonChartProps {
  scoredCareers: ScoredCareer[];
  studentName?: string;
  onSelectCareer?: (career: CareerPath) => void;
}

const PALETTE = [
  { stroke: '#b85d24', fill: '#b85d24', name: 'Terracotta (Primary)' },
  { stroke: '#2563eb', fill: '#2563eb', name: 'Royal Blue' },
  { stroke: '#059669', fill: '#059669', name: 'Emerald Green' },
  { stroke: '#7c3aed', fill: '#7c3aed', name: 'Purple' },
  { stroke: '#d97706', fill: '#d97706', name: 'Amber' },
];

export const CareerComparisonChart: React.FC<CareerComparisonChartProps> = ({
  scoredCareers,
  studentName,
  onSelectCareer,
}) => {
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showExplanationModal, setShowExplanationModal] = useState<boolean>(false);

  // Take up to the top 6 careers for potential comparison
  const availableCareers = useMemo(() => scoredCareers.slice(0, 6), [scoredCareers]);

  // Selected careers for multi-comparison (default top 3)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return availableCareers.slice(0, 3).map((s) => s.career.id);
  });

  const toggleSelectCareer = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 4 && chartType === 'radar') {
          // Keep radar readable with max 4
          return [...prev.slice(1), id];
        }
        return [...prev, id];
      }
    });
  };

  const selectTopThree = () => {
    setSelectedIds(availableCareers.slice(0, 3).map((s) => s.career.id));
  };

  const selectTopFive = () => {
    setSelectedIds(availableCareers.slice(0, 5).map((s) => s.career.id));
  };

  const activeScored = useMemo(() => {
    return availableCareers.filter((s) => selectedIds.includes(s.career.id));
  }, [availableCareers, selectedIds]);

  const topMatch = scoredCareers[0];

  // RADAR DATA PREPARATION:
  // Metrics as rows: Interest Score, Skill Alignment, Demand, Overall Match
  const radarData = useMemo(() => {
    const dimensions = [
      { key: 'interestScore', metric: 'Interest Score', fullMark: 100 },
      { key: 'skillAlignment', metric: 'Skill Alignment', fullMark: 100 },
      { key: 'demand', metric: 'Demand', fullMark: 100 },
      { key: 'overallMatch', metric: 'AI Match Fit', fullMark: 100 },
    ];

    return dimensions.map((dim) => {
      const row: Record<string, any> = {
        metric: dim.metric,
        fullMark: dim.fullMark,
      };
      activeScored.forEach((item) => {
        row[item.career.id] = (item.comparisonMetrics as any)[dim.key];
      });
      return row;
    });
  }, [activeScored]);

  // BAR DATA PREPARATION:
  // Each career as a row with 'Interest Score', 'Skill Alignment', 'Demand', and 'overall'
  const barData = useMemo(() => {
    return activeScored.map((item) => {
      // Shorten title for bar chart labels
      const shortTitle = item.career.title.length > 22
        ? item.career.title.slice(0, 20) + '…'
        : item.career.title;

      return {
        id: item.career.id,
        name: shortTitle,
        fullName: item.career.title,
        'Interest Score': item.comparisonMetrics.interestScore,
        'Skill Alignment': item.comparisonMetrics.skillAlignment,
        'Demand': item.comparisonMetrics.demand,
        overall: item.score,
        category: item.career.category,
      };
    });
  }, [activeScored]);

  if (scoredCareers.length === 0) return null;

  return (
    <section className="airy-card rounded-3xl p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#faefe4] dark:bg-[#2f251e] text-[#b85d24] dark:text-[#f09a65] border border-[#ecd5c3] dark:border-[#423328] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Decision Matrix</span>
            </span>
            <span className="text-xs text-[var(--text-muted)] font-medium">
              Recharts Visual Fit Engine
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">
            Compare Interest, Skill Alignment & Demand
          </h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-2xl">
            See exactly why the AI assigned a <strong className="text-[#b85d24] font-semibold">{topMatch?.score}% match</strong> to your top recommendation by analyzing the 3 core predictive dimensions.
          </p>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="inline-flex rounded-xl bg-[#f7f2ea] dark:bg-[#1f1b18] p-1 border border-[var(--border-subtle)]">
            <button
              onClick={() => setChartType('radar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartType === 'radar'
                  ? 'bg-[#b85d24] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Radar Chart: Holistic Multi-Axis Profile Comparison"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Radar Chart</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-[#b85d24] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Bar Chart: Side-by-Side Metric Comparison"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bar Chart</span>
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#f7f2ea] dark:hover:bg-[#1f1b18] border border-transparent hover:border-[var(--border-subtle)] transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse chart' : 'Expand chart'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          
          {/* PATHWAY SELECTOR CHIPS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fdfbf7] dark:bg-[#191614] p-3.5 rounded-2xl border border-[var(--border-subtle)]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mr-1">
                Active Pathways:
              </span>
              {availableCareers.map((sc, idx) => {
                const isSelected = selectedIds.includes(sc.career.id);
                const color = PALETTE[idx % PALETTE.length];
                return (
                  <button
                    key={sc.career.id}
                    onClick={() => toggleSelectCareer(sc.career.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--bg-card)] text-[var(--text-primary)] border shadow-xs font-semibold'
                        : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-transparent'
                    }`}
                    style={{
                      borderColor: isSelected ? color.stroke : 'transparent',
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: isSelected ? color.stroke : '#9c948a',
                      }}
                    />
                    <span className="truncate max-w-[140px] sm:max-w-[180px]">
                      {sc.career.title}
                    </span>
                    <span className="text-[10px] font-bold text-[#b85d24]">
                      {sc.score}%
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs">
              <button
                onClick={selectTopThree}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] hover:bg-[#faefe4] dark:hover:bg-[#2b241e] text-[var(--text-secondary)] hover:text-[#b85d24] border border-[var(--border-subtle)] text-[11px] font-medium transition-colors cursor-pointer"
              >
                Top 3
              </button>
              <button
                onClick={selectTopFive}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] hover:bg-[#faefe4] dark:hover:bg-[#2b241e] text-[var(--text-secondary)] hover:text-[#b85d24] border border-[var(--border-subtle)] text-[11px] font-medium transition-colors cursor-pointer"
              >
                Top 5
              </button>
            </div>
          </div>

          {/* MAIN VISUALIZATION + EXPLANATION SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* CHART CONTAINER (7 cols on desktop) */}
            <div className="lg:col-span-7 bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] shadow-xs min-h-[360px] flex flex-col justify-center">
              
              {chartType === 'radar' ? (
                <div className="w-full h-[320px] sm:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
                      <PolarAngleAxis
                        dataKey="metric"
                        tick={{
                          fill: 'var(--text-primary)',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{
                          fill: 'var(--text-muted)',
                          fontSize: 9,
                        }}
                      />
                      <Tooltip
                        content={<CustomRadarTooltip scoredCareers={activeScored} />}
                      />
                      {activeScored.map((item, idx) => {
                        const color = PALETTE[idx % PALETTE.length];
                        const isTop = idx === 0 && item.score >= 90;
                        return (
                          <Radar
                            key={item.career.id}
                            name={`${item.career.title} (${item.score}%)`}
                            dataKey={item.career.id}
                            stroke={color.stroke}
                            fill={color.fill}
                            fillOpacity={isTop ? 0.38 : 0.18}
                            strokeWidth={isTop ? 2.5 : 1.75}
                          />
                        );
                      })}
                      <Legend
                        wrapperStyle={{
                          paddingTop: '12px',
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-[320px] sm:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{
                          fill: 'var(--text-primary)',
                          fontSize: 10,
                          fontWeight: 500,
                        }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{
                          fill: 'var(--text-muted)',
                          fontSize: 10,
                        }}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend
                        wrapperStyle={{
                          paddingTop: '10px',
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                        }}
                      />
                      <Bar
                        dataKey="Interest Score"
                        fill="#b85d24"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="Skill Alignment"
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="Demand"
                        fill="#059669"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Caption */}
              <div className="text-center pt-2">
                <span className="text-[10px] text-[var(--text-muted)] font-medium">
                  {chartType === 'radar'
                    ? 'Larger polygon area represents higher compound alignment across interest, prerequisite skills, and hiring demand.'
                    : 'Grouped metrics allow instant benchmark comparison across interest passion, stream readiness, and hiring growth.'}
                </span>
              </div>
            </div>

            {/* INTUITIVE 98% MATCH EXPLAINABILITY PANEL (5 cols on desktop) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Highlight Card for Top Match */}
              {topMatch && (
                <div className="p-5 rounded-2xl bg-[#faf4ec] dark:bg-[#231d18] border border-[#ecd5c3] dark:border-[#3d2f24] space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#f0ded0] dark:border-[#382b20] pb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#b85d24]" />
                      <span className="text-xs font-bold text-[#b85d24] uppercase tracking-wider">
                        Why is Top Match {topMatch.score}%?
                      </span>
                    </div>
                    <span className="font-display font-extrabold text-2xl text-[#b85d24]">
                      {topMatch.score}%
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      {topMatch.career.title}
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-0.5">
                      {topMatch.career.description}
                    </p>
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="space-y-2 pt-1">
                    {/* Interest Score */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
                        <span className="w-2 h-2 rounded-full bg-[#b85d24]" />
                        Interest Score:
                      </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {topMatch.comparisonMetrics.interestScore}%
                        <span className="text-[10px] text-[var(--text-muted)] font-normal ml-1">
                          (Subject & Workstyle fit)
                        </span>
                      </span>
                    </div>

                    {/* Skill Alignment */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
                        <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                        Skill Alignment:
                      </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {topMatch.comparisonMetrics.skillAlignment}%
                        <span className="text-[10px] text-[var(--text-muted)] font-normal ml-1">
                          (Stream & Academics)
                        </span>
                      </span>
                    </div>

                    {/* Demand */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
                        <span className="w-2 h-2 rounded-full bg-[#059669]" />
                        Future Demand:
                      </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {topMatch.comparisonMetrics.demand}/100
                        <span className="text-[10px] text-[var(--text-muted)] font-normal ml-1">
                          (Hiring Index)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Why Not 100% Buffer Callout */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#1a1613] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    <strong className="text-[var(--text-primary)] font-semibold">The 2% Reality Margin:</strong>{' '}
                    The algorithm caps maximum confidence at 98% to acknowledge real-world admission volatility (entrance exam percentile cutoffs, state quota variations, and interview rounds).
                  </div>

                  {onSelectCareer && (
                    <button
                      onClick={() => onSelectCareer(topMatch.career)}
                      className="w-full py-2 px-3 rounded-xl bg-[#b85d24] hover:bg-[#9c4c19] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>Explore {topMatch.career.title} Blueprint</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Comparative takeaway note */}
              {activeScored.length > 1 && (
                <div className="p-4 rounded-2xl bg-[#faf7f2] dark:bg-[#1c1815] border border-[var(--border-subtle)] space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                    <Info className="w-3.5 h-3.5 text-[#b85d24]" />
                    <span>Key Comparative Insight</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    While <strong className="text-[var(--text-primary)]">{activeScored[1]?.career.title}</strong>{' '}
                    has high future demand ({activeScored[1]?.comparisonMetrics.demand}/100),{' '}
                    <strong className="text-[var(--text-primary)]">{topMatch.career.title}</strong> scored higher overall{' '}
                    ({topMatch.score}% vs {activeScored[1]?.score}%) due to greater alignment between your stated favorite subjects and prerequisite stream.
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* METRIC DEFINITION FOOTNOTES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#faf7f2] dark:bg-[#1a1714]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b85d24] mt-1 shrink-0" />
              <div className="text-[11px] space-y-0.5">
                <span className="font-semibold text-[var(--text-primary)] block">Interest Score</span>
                <span className="text-[var(--text-muted)] leading-tight block">
                  Measures alignment with your chosen favorite subjects and day-to-day work style preferences.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#faf7f2] dark:bg-[#1a1714]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] mt-1 shrink-0" />
              <div className="text-[11px] space-y-0.5">
                <span className="font-semibold text-[var(--text-primary)] block">Skill Alignment</span>
                <span className="text-[var(--text-muted)] leading-tight block">
                  Evaluates 10+2 stream prerequisites, academic score buffer above cutoff, and curriculum foundation.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#faf7f2] dark:bg-[#1a1714]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] mt-1 shrink-0" />
              <div className="text-[11px] space-y-0.5">
                <span className="font-semibold text-[var(--text-primary)] block">Demand</span>
                <span className="text-[var(--text-muted)] leading-tight block">
                  5-10 year verified industry hiring velocity, starting compensation growth, and market resilience.
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

    </section>
  );
};

// ==========================================
// CUSTOM TOOLTIPS WITH HIGH CONTRAST & READABILITY
// ==========================================

const CustomRadarTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
  scoredCareers: ScoredCareer[];
}> = ({ active, payload, label, scoredCareers }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1a1613] border border-[var(--border-subtle)] shadow-xl text-xs space-y-2 max-w-[260px] text-[var(--text-primary)] dark:text-white">
        <div className="font-bold border-b border-[var(--border-subtle)] pb-1 text-[var(--text-primary)] dark:text-white flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-[var(--text-muted)] font-normal">/ 100 max</span>
        </div>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 truncate max-w-[170px]" style={{ color: entry.stroke }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.stroke }} />
                  <span className="truncate text-[11px]">{entry.name}</span>
                </span>
                <span className="font-bold text-[11px]" style={{ color: entry.stroke }}>
                  {entry.value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const careerData = payload[0]?.payload;
    return (
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1a1613] border border-[var(--border-subtle)] shadow-xl text-xs space-y-2 max-w-[280px] text-[var(--text-primary)] dark:text-white">
        <div className="border-b border-[var(--border-subtle)] pb-1">
          <span className="font-bold text-xs block text-[var(--text-primary)] dark:text-white">
            {careerData?.fullName || label}
          </span>
          <span className="text-[10px] text-[#b85d24] font-semibold">
            Overall AI Match: {careerData?.overall}%
          </span>
        </div>
        <div className="space-y-1.5 pt-1">
          {payload.map((entry: any, index: number) => (
            <div key={`bar-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-[11px]" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-[11px]" style={{ color: entry.color }}>
                {entry.value}{entry.name === 'Demand' ? '/100' : '%'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// ==========================================
// COMPACT SINGLE-CAREER MINI RADAR VISUALIZER
// Embedded inside each expanded card's explainable score section
// ==========================================
interface SingleCareerMiniVisualizerProps {
  scoredCareer: ScoredCareer;
}

export const SingleCareerMiniVisualizer: React.FC<SingleCareerMiniVisualizerProps> = ({
  scoredCareer,
}) => {
  const { comparisonMetrics, score } = scoredCareer;

  const data = [
    { metric: 'Interest Score', score: comparisonMetrics.interestScore, fullMark: 100 },
    { metric: 'Skill Alignment', score: comparisonMetrics.skillAlignment, fullMark: 100 },
    { metric: 'Demand', score: comparisonMetrics.demand, fullMark: 100 },
    { metric: 'AI Match Fit', score: score, fullMark: 100 },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
        <div className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-[#b85d24]" />
          <span className="text-xs font-bold text-[var(--text-primary)]">
            Visual Score Radar: Interest vs Skills vs Demand
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#b85d24]">
          {score}% Match
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Radar Graphic */}
        <div className="md:col-span-6 h-[200px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{
                  fill: 'var(--text-primary)',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{
                  fill: 'var(--text-muted)',
                  fontSize: 8,
                }}
              />
              <Radar
                name={scoredCareer.career.title}
                dataKey="score"
                stroke="#b85d24"
                fill="#b85d24"
                fillOpacity={0.4}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 3 Metric Gauges */}
        <div className="md:col-span-6 space-y-2.5 text-xs">
          <div>
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="font-medium text-[var(--text-secondary)]">Interest Score</span>
              <span className="font-bold text-[#b85d24]">{comparisonMetrics.interestScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#ede4d6] dark:bg-[#2b241e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#b85d24] rounded-full transition-all duration-500"
                style={{ width: `${comparisonMetrics.interestScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="font-medium text-[var(--text-secondary)]">Skill Alignment</span>
              <span className="font-bold text-[#2563eb]">{comparisonMetrics.skillAlignment}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#ede4d6] dark:bg-[#2b241e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563eb] rounded-full transition-all duration-500"
                style={{ width: `${comparisonMetrics.skillAlignment}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="font-medium text-[var(--text-secondary)]">Future Demand</span>
              <span className="font-bold text-[#059669]">{comparisonMetrics.demand}/100</span>
            </div>
            <div className="w-full h-1.5 bg-[#ede4d6] dark:bg-[#2b241e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#059669] rounded-full transition-all duration-500"
                style={{ width: `${comparisonMetrics.demand}%` }}
              />
            </div>
          </div>

          <p className="text-[10px] text-[var(--text-muted)] pt-1 leading-tight">
            Compound fit across Interest ({comparisonMetrics.interestScore}%), Skills ({comparisonMetrics.skillAlignment}%), and Demand ({comparisonMetrics.demand}/100) produces the {score}% confidence deduction.
          </p>
        </div>
      </div>
    </div>
  );
};

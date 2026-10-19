import React, { useState } from 'react';
import { MatrixVariant } from '../types';
import { INITIAL_MATRIX_VARIANTS } from '../data/mockData';

interface ABMatrixScreenProps {
  onShowToast: (msg: string) => void;
  onDeductCredits: (amount: number) => void;
}

export const ABMatrixScreen: React.FC<ABMatrixScreenProps> = ({
  onShowToast,
  onDeductCredits,
}) => {
  const [variants, setVariants] = useState<MatrixVariant[]>(INITIAL_MATRIX_VARIANTS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('ctr');
  const [editingVariant, setEditingVariant] = useState<MatrixVariant | null>(null);

  // Budget Simulator State
  const [weeklyBudget, setWeeklyBudget] = useState(10000);
  const [weights, setWeights] = useState({
    'var-a': 50,
    'var-b': 30,
    'var-c': 20,
  });

  const selectedCount = variants.filter((v) => v.selected).length;

  const handleToggleSelect = (id: string) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, selected: !v.selected } : v))
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setVariants(variants.map((v) => ({ ...v, selected: checked })));
  };

  const handleGenerateMoreHooks = () => {
    onShowToast('Generating 3 new algorithmic hook angles...');
    setTimeout(() => {
      onDeductCredits(90);
      const newVar: MatrixVariant = {
        id: `var-${Date.now()}`,
        name: `Variant ${String.fromCharCode(65 + variants.length)}`,
        hookType: 'Fear of Inefficiency / Cost Leak',
        hookScore: 94,
        audienceResonance: 'CFO / Ops Focus',
        meta: {
          primaryText: '“Every day you delay automating ad copy testing, your competitors acquire customers for 35% less.”',
          charCount: 104,
          maxChars: 125,
          headline: 'Stop Overpaying for SaaS Leads',
          headlineChars: 30,
          cta: 'Audit Ad Costs',
          estCtr: '4.2%',
        },
        google: {
          headlines: ['Cut B2B SaaS CAC Today', 'Instant AI Ad Hook Matrix', 'Automated Creative Scaling'],
          headlineLengths: [23, 25, 26],
          maxHeadline: 30,
          headlineRating: 'Optimal',
          description: 'Eliminate ad creative bottlenecks. Test multivariate copy hooks automatically with AdCopy AI.',
          cpcEst: '$1.95',
          quality: 'Excellent',
        },
        linkedin: {
          narrative: 'Why are growth teams spending $20k/month on agencies when algorithmic ad copy engines yield higher statistical precision? Explore the case study.',
          charCount: 220,
          hashtags: ['#B2BMarketing', '#CAC', '#GrowthHacking'],
          projectedCvr: '11.5% Projected',
        },
        selected: true,
      };
      setVariants((prev) => [newVar, ...prev]);
      onShowToast('Added Variant to Matrix with 94/100 Hook Score!');
    }, 900);
  };

  const handleCopyAllFormats = (v: MatrixVariant) => {
    const text = `--- ${v.name} (${v.hookType}) ---\n\n[META ADS]\nPrimary: ${v.meta.primaryText}\nHeadline: ${v.meta.headline}\nCTA: ${v.meta.cta}\nEst CTR: ${v.meta.estCtr}\n\n[GOOGLE ADS]\nHeadlines:\n- ${v.google.headlines.join('\n- ')}\nDescription: ${v.google.description}\n\n[LINKEDIN ADS]\nNarrative: ${v.linkedin.narrative}\nHashtags: ${v.linkedin.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    onShowToast(`Copied all formats for ${v.name} to clipboard!`);
  };

  const handlePushSelected = () => {
    if (selectedCount === 0) {
      onShowToast('Please select at least one variant to push.');
      return;
    }
    onShowToast(`Pushed ${selectedCount} variants directly into Meta & Google Ad Sets!`);
  };

  const handleExportXlsx = () => {
    onShowToast('Exported A/B Matrix permutations (.xlsx format)');
  };

  // Filter & Sort
  const filteredVariants = variants.filter((v) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'PAS') return v.hookType.includes('PAS');
    if (activeFilter === 'Benefit / ROI') return v.hookType.includes('ROI') || v.hookType.includes('Benefit');
    if (activeFilter === 'Hook First') return v.hookScore >= 90;
    if (activeFilter === 'Social Proof') return v.hookType.includes('Social Proof');
    return true;
  });

  // Calculate Budget Split Metrics
  const spendA = Math.round((weeklyBudget * weights['var-a']) / 100);
  const spendB = Math.round((weeklyBudget * weights['var-b']) / 100);
  const spendC = Math.round((weeklyBudget * weights['var-c']) / 100);

  const convA = Math.round(spendA / 32.5);
  const convB = Math.round(spendB / 38.2);
  const convC = Math.round(spendC / 44.1);

  const totalConv = convA + convB + convC;
  const avgCpa = (weeklyBudget / (totalConv || 1)).toFixed(2);
  const blendedRoas = (
    (convA * 145 + convB * 135 + convC * 128) /
    (weeklyBudget || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              A/B Matrix &amp; Hooks Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-[11px] font-bold">
              Telemetry Live (#AB-8942)
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Multivariate ad copy permutations evaluated against historical platform performance benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleExportXlsx}
            className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">
              table_view
            </span>
            <span>Export Matrix (XLSX)</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateMoreHooks}
            className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-indigo-600 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>Generate 3 Hooks</span>
          </button>

          <button
            type="button"
            onClick={handlePushSelected}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
            <span>Push Selected ({selectedCount}) to Ads Manager</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex flex-col gap-1">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            Active Angles
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">16</span>
            <span className="text-xs text-slate-500 font-medium">12 In Testing • 4 Champions</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex flex-col gap-1">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            Avg Predicted CTR
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">3.85%</span>
            <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
              +1.4% vs Category
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex flex-col gap-1">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            Champion Hook Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-600">99 / 100</span>
            <span className="text-xs text-slate-500 font-medium">Variant A (PAS)</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '99%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex flex-col gap-1">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            Format Compliance
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">100%</span>
            <span className="text-xs text-emerald-600 font-medium">All 16 Pass Ad Policies</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['All', 'Hook First', 'Benefit / ROI', 'PAS', 'Social Proof'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {filter} {filter === 'All' && `(${variants.length})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="ctr">Highest Predicted CTR</option>
              <option value="score">Hook Strength Score</option>
              <option value="cvr">Projected CVR</option>
            </select>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="font-mono text-[11px] text-emerald-700 hidden sm:flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Synced with Meta &amp; Google Graph API • 4m ago
          </span>
        </div>
      </div>

      {/* Multivariate Permutations Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedCount === variants.length && variants.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="accent-indigo-600 rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 w-48">Variant &amp; Hook Type</th>
                <th className="py-3 px-4 w-80">Meta Ads (Feed / Story)</th>
                <th className="py-3 px-4 w-80">Google Ads (RSAs)</th>
                <th className="py-3 px-4 w-72">LinkedIn Sponsored</th>
                <th className="py-3 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredVariants.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Select Checkbox */}
                  <td className="py-4 px-4 align-top">
                    <input
                      type="checkbox"
                      checked={v.selected}
                      onChange={() => handleToggleSelect(v.id)}
                      className="accent-indigo-600 rounded cursor-pointer mt-1"
                    />
                  </td>

                  {/* Variant & Hook Gauge */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{v.name}</span>
                        {v.isChampion && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-extrabold">
                            CHAMPION
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-slate-700 text-xs leading-tight">
                        {v.hookType}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 flex items-center justify-center font-mono font-black text-xs text-indigo-700 bg-indigo-50">
                          {v.hookScore}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] text-slate-400">Hook Score</span>
                          <span className="font-mono text-[10px] text-slate-600 font-semibold">
                            {v.audienceResonance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Meta Ads Cell */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex flex-col gap-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-blue-600 font-bold">PRIMARY TEXT</span>
                        <span>{v.meta.charCount} / {v.meta.maxChars} chars</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-normal italic">
                        {v.meta.primaryText}
                      </p>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-bold text-slate-900 truncate">
                          {v.meta.headline}
                        </span>
                        <span className="shrink-0 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                          {v.meta.cta}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-emerald-700 font-bold mt-0.5">
                        <span>Est. CTR: {v.meta.estCtr}</span>
                        <span className="text-slate-400">Top 5% Cohort</span>
                      </div>
                    </div>
                  </td>

                  {/* Google Ads Cell */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex flex-col gap-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-red-600 font-bold">RESPONSIVE HEADLINES</span>
                        <span className="text-emerald-700 font-bold">{v.google.headlineRating}</span>
                      </div>
                      <div className="space-y-1">
                        {v.google.headlines.map((hl, i) => (
                          <div
                            key={i}
                            className="p-1.5 rounded bg-white border border-slate-200 text-slate-900 text-xs font-medium flex items-center justify-between shadow-xs"
                          >
                            <span className="truncate">{hl}</span>
                            <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-1">
                              {hl.length}/30
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {v.google.description}
                      </p>
                      <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between font-mono text-[10px] text-slate-500">
                        <span>CPC Est: <strong className="text-slate-800">{v.google.cpcEst}</strong></span>
                        <span>Quality: <strong className="text-emerald-700">{v.google.quality}</strong></span>
                      </div>
                    </div>
                  </td>

                  {/* LinkedIn Cell */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex flex-col gap-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-[#0A66C2] font-bold">EXECUTIVE NARRATIVE</span>
                        <span>{v.linkedin.charCount} chars</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-normal line-clamp-3">
                        {v.linkedin.narrative}
                      </p>
                      <div className="flex flex-wrap gap-1 text-[10px] text-blue-600 font-semibold mt-1">
                        {v.linkedin.hashtags.map((h) => (
                          <span key={h}>{h}</span>
                        ))}
                      </div>
                      <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between font-mono text-[10px]">
                        <span className="text-emerald-700 font-bold">
                          {v.linkedin.projectedCvr}
                        </span>
                        <span className="text-slate-400">Decision Makers</span>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 align-top text-right">
                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyAllFormats(v)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        title="Copy All Formats"
                      >
                        <span className="material-symbols-outlined text-[14px]">content_copy</span>
                        <span>Copy All</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingVariant(v)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        title="Inline Edit"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onShowToast(`Split simulation weighted for ${v.name}`)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                        title="Simulate Split"
                      >
                        <span className="material-symbols-outlined text-[14px]">tune</span>
                        <span>Simulate</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Predictive Budget & Split Simulator */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[20px]">
              finance_chip
            </span>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Predictive Budget &amp; Split Simulator
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-600">Weekly Campaign Budget:</span>
            <span className="text-base font-extrabold text-indigo-600 font-mono">
              ${weeklyBudget.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Budget Master Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>$1,000 / week</span>
            <span>Slide to simulate test capital allocation</span>
            <span>$25,000 / week</span>
          </div>
          <input
            type="range"
            min={1000}
            max={25000}
            step={500}
            value={weeklyBudget}
            onChange={(e) => setWeeklyBudget(Number(e.target.value))}
            className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
          />
        </div>

        {/* Split Allocation Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Variant A (Champion PAS)</span>
              <span className="font-mono text-xs font-bold text-indigo-600">{weights['var-a']}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights['var-a']}
              onChange={(e) => setWeights({ ...weights, 'var-a': Number(e.target.value) })}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Simulated Spend</span>
                <strong className="text-slate-900">${spendA.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Pred. Conversions</span>
                <strong className="text-emerald-700">{convA}</strong>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Variant B (Contrarian)</span>
              <span className="font-mono text-xs font-bold text-indigo-600">{weights['var-b']}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights['var-b']}
              onChange={(e) => setWeights({ ...weights, 'var-b': Number(e.target.value) })}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Simulated Spend</span>
                <strong className="text-slate-900">${spendB.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Pred. Conversions</span>
                <strong className="text-emerald-700">{convB}</strong>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Variant C (ROI Proof)</span>
              <span className="font-mono text-xs font-bold text-indigo-600">{weights['var-c']}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights['var-c']}
              onChange={(e) => setWeights({ ...weights, 'var-c': Number(e.target.value) })}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Simulated Spend</span>
                <strong className="text-slate-900">${spendC.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Pred. Conversions</span>
                <strong className="text-emerald-700">{convC}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Projected Outcome Summary Bar */}
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap font-mono">
            <span>
              Total Projected Conversions:{' '}
              <strong className="text-indigo-900 text-sm font-black">{totalConv}</strong>
            </span>
            <span>•</span>
            <span>
              Projected Blended CPA:{' '}
              <strong className="text-emerald-700 font-black">${avgCpa}</strong>
            </span>
            <span>•</span>
            <span>
              Projected Blended ROAS:{' '}
              <strong className="text-indigo-900 font-black">{blendedRoas}x</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setWeeklyBudget(10000);
                setWeights({ 'var-a': 50, 'var-b': 30, 'var-c': 20 });
                onShowToast('Reset simulator to default optimal weights');
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition shadow-xs cursor-pointer"
            >
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={() => onShowToast('Locked 50/30/20 weights into Ads Manager campaign!')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs cursor-pointer"
            >
              Lock Weights &amp; Push Experiment
            </button>
          </div>
        </div>
      </div>

      {/* Inline Edit Modal */}
      {editingVariant && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-[20px]">edit</span>
                <span className="text-sm font-bold text-slate-900">
                  Edit Copy — {editingVariant.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingVariant(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] text-slate-500 uppercase">
                  Meta Primary Text
                </label>
                <textarea
                  rows={3}
                  value={editingVariant.meta.primaryText}
                  onChange={(e) =>
                    setEditingVariant({
                      ...editingVariant,
                      meta: { ...editingVariant.meta, primaryText: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] text-slate-500 uppercase">
                  Meta Headline
                </label>
                <input
                  type="text"
                  value={editingVariant.meta.headline}
                  onChange={(e) =>
                    setEditingVariant({
                      ...editingVariant,
                      meta: { ...editingVariant.meta, headline: e.target.value },
                    })
                  }
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] text-slate-500 uppercase">
                  Google Ad Description
                </label>
                <textarea
                  rows={2}
                  value={editingVariant.google.description}
                  onChange={(e) =>
                    setEditingVariant({
                      ...editingVariant,
                      google: { ...editingVariant.google, description: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingVariant(null)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setVariants(
                    variants.map((v) => (v.id === editingVariant.id ? editingVariant : v))
                  );
                  setEditingVariant(null);
                  onShowToast(`Saved edits to ${editingVariant.name}`);
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

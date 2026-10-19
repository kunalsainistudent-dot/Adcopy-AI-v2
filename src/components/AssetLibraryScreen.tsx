import React, { useState } from 'react';
import { CreativeAsset, ScreenTab } from '../types';
import { INITIAL_ASSETS } from '../data/mockData';

interface AssetLibraryScreenProps {
  onNavigate: (tab: ScreenTab) => void;
  onShowToast: (msg: string) => void;
  onOpenVoiceModal: () => void;
  onOpenNewCreativeModal: () => void;
  onSelectAssetForStudio?: (asset: CreativeAsset) => void;
}

export const AssetLibraryScreen: React.FC<AssetLibraryScreenProps> = ({
  onNavigate,
  onShowToast,
  onOpenVoiceModal,
  onOpenNewCreativeModal,
  onSelectAssetForStudio,
}) => {
  const [assets, setAssets] = useState<CreativeAsset[]>(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<CreativeAsset>(INITIAL_ASSETS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeBrandVoice, setActiveBrandVoice] = useState('Enterprise SaaS');
  const [currentPage, setCurrentPage] = useState(1);

  const brandVoices = [
    'Enterprise SaaS',
    'D2C E-commerce High-Energy',
    'Founder Personal Brand / Thought Leader',
  ];

  // Filter Assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.winningAngleSnippet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      platformFilter === 'All' ||
      asset.platforms.some((p) => p.toLowerCase().includes(platformFilter.toLowerCase()));
    const matchesStatus =
      statusFilter === 'All' || asset.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const handleCopyAngle = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Copied angle to clipboard!');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(selectedAsset, null, 2);
    navigator.clipboard.writeText(jsonStr);
    onShowToast(`Exported JSON Schema for ${selectedAsset.id}`);
  };

  const handleSyncAsset = (asset: CreativeAsset) => {
    onShowToast(`Synced ${asset.id} creative variations to active ad accounts!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Repository
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-[11px] font-bold">
              38 Assets Live
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Creative Asset &amp; Copy Library
          </h1>
          <p className="text-xs text-slate-600">
            Archived multi-channel campaign runs, computer vision hook metrics, and conversion telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => onShowToast('Exported complete asset vault (.zip with JSON)')}
            className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">download</span>
            <span>Bulk Export</span>
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Connected APIs synchronized: Meta, Google, TikTok, LinkedIn')}
            className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-indigo-600 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Sync All APIs</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewCreativeModal}
            className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Upload Creative</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search hooks, headlines, or asset IDs... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer shadow-xs"
          >
            <option value="All">Platform: All (4)</option>
            <option value="Meta">Meta Ads</option>
            <option value="Google">Google Ads</option>
            <option value="LinkedIn">LinkedIn Ads</option>
            <option value="TikTok">TikTok Ads</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer shadow-xs"
          >
            <option value="All">Status: Live &amp; Winners</option>
            <option value="WINNER">Winner Only</option>
            <option value="TESTING">Testing</option>
            <option value="SCALING">Scaling</option>
          </select>

          <select className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer shadow-xs">
            <option>Date: Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>All Time</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
              title="Grid View"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
              title="List View"
            >
              <span className="material-symbols-outlined text-[16px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Brand Voice Guidelines Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-slate-500 uppercase tracking-wider text-[11px] font-bold">
            Active Brand Voice:
          </span>
          {brandVoices.map((voice) => (
            <button
              key={voice}
              type="button"
              onClick={() => {
                setActiveBrandVoice(voice);
                onShowToast(`Switched active voice profile to "${voice}"`);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs ${
                activeBrandVoice === voice
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600'
              }`}
            >
              {voice} {voice === 'Enterprise SaaS' && '(Default)'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenVoiceModal}
          className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          <span>Edit Voice Parameters</span>
        </button>
      </div>

      {/* Status Ribbon */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-emerald-700 font-bold">14 Winning Angles</span>
          <span>•</span>
          <span className="text-slate-700 font-semibold">18 Live in Flight</span>
          <span>•</span>
          <span className="text-slate-500">6 in Staging</span>
        </div>
        <div className="flex items-center gap-1 text-slate-700 font-medium">
          <span>Sort by:</span>
          <span className="font-bold text-slate-900">Predicted Conversion Rank</span>
          <span className="material-symbols-outlined text-[16px]">expand_more</span>
        </div>
      </div>

      {/* Main Content Layout: Grid (8 cols) + Inspector (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 2x2 Asset Cards (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssets.map((asset) => {
              const isSelected = asset.id === selectedAsset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`bg-white rounded-xl border transition-all duration-200 shadow-sm overflow-hidden flex flex-col cursor-pointer group ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Media Frame & Top Tags */}
                  <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                    <img
                      src={asset.imageUrl}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold text-white shadow-sm ${
                          asset.status === 'WINNER'
                            ? 'bg-emerald-600'
                            : asset.status === 'TESTING'
                            ? 'bg-sky-500'
                            : 'bg-indigo-600'
                        }`}
                      >
                        {asset.badgeLabel || asset.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
                        {asset.aspectRatio}
                      </span>
                    </div>

                    {/* Score Chip */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 font-mono text-[10px] font-black shadow-sm flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{asset.aiScore} AI</span>
                    </div>

                    {/* Bottom Metrics Strip on Image */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white font-mono text-[11px]">
                      <span className="font-extrabold text-emerald-300">{asset.ctr}</span>
                      <span className="font-extrabold text-cyan-300">{asset.roas}</span>
                      <span className="text-slate-300 text-[10px]">{asset.clicks || asset.impressions || asset.leads || asset.arrAdded}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                        {asset.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                        {asset.title}
                      </h3>
                    </div>

                    {/* Platform Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {asset.platformPills.map((pill) => (
                        <span
                          key={pill.name}
                          className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[10px] font-semibold"
                        >
                          {pill.name}
                        </span>
                      ))}
                    </div>

                    {/* Winning Angle Snippet */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed italic mt-auto">
                      <span className="block font-mono text-[9px] uppercase tracking-wider font-bold text-indigo-600 not-italic mb-1">
                        {asset.winningAngleCategory}
                      </span>
                      {asset.winningAngleSnippet}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectAssetForStudio) {
                            onSelectAssetForStudio(asset);
                          } else {
                            setSelectedAsset(asset);
                            onNavigate('studio-upload');
                          }
                          onShowToast(`Loaded "${asset.title}" into Studio`);
                        }}
                        className="text-xs font-semibold text-zinc-900 hover:text-zinc-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open in Studio</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSyncAsset(asset);
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                      >
                        Sync Ads
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Bar */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-sm flex items-center justify-between text-xs text-slate-600">
            <span>Showing 1-4 of 38 archived campaign runs</span>
            <div className="flex items-center gap-1 font-mono">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              >
                Previous
              </button>
              {[1, 2, 3, 4, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`px-2.5 py-1 rounded transition cursor-pointer ${
                    currentPage === num
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Telemetry & Variations Inspector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col gap-4 sticky top-24">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-[20px]">
                  analytics
                </span>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Asset Telemetry &amp; Variations
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-bold">
                ID: {selectedAsset.id}
              </span>
            </div>

            {/* Selected Micro Preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <img
                src={selectedAsset.imageUrl}
                alt={selectedAsset.title}
                className="w-14 h-14 rounded-lg object-cover shadow-xs border border-slate-200 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {selectedAsset.title}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  {selectedAsset.aspectRatio}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] text-emerald-700 font-extrabold">
                    {selectedAsset.ctr}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-[10px] text-indigo-600 font-extrabold">
                    {selectedAsset.roas}
                  </span>
                </div>
              </div>
            </div>

            {/* Radial Gauges Block */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center gap-1">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3.5"
                      strokeDasharray="94.2"
                      strokeDashoffset={94.2 * (1 - selectedAsset.aiScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-mono text-xs font-black text-indigo-700">
                    {selectedAsset.aiScore}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">
                  AI Power
                </span>
                <span className="font-mono text-[10px] text-indigo-600 font-bold">
                  {selectedAsset.cohort}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-center gap-1">
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {selectedAsset.roas}
                </span>
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Aggregated ROAS
                </span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">
                  +0.6x vs Benchmark
                </span>
              </div>
            </div>

            {/* Generated Angles List */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-700 uppercase tracking-wider font-bold">
                  Generated Angles (10 Total)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const allAngles = selectedAsset.generatedAngles
                      .map((a) => `[${a.label}]\n${a.text}`)
                      .join('\n\n');
                    navigator.clipboard.writeText(allAngles);
                    onShowToast('Copied all angles to clipboard');
                  }}
                  className="font-mono text-[10px] text-indigo-600 hover:underline font-bold cursor-pointer"
                >
                  Copy All
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {selectedAsset.generatedAngles.map((angle) => (
                  <div
                    key={angle.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1.5 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${angle.badgeColor}`}>
                        {angle.label}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {angle.charCount} / {angle.maxChars}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-normal">
                      “{angle.text}”
                    </p>
                    <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between font-mono text-[10px]">
                      <span className="text-emerald-700 font-medium">{angle.metrics}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyAngle(angle.text)}
                        className="text-indigo-600 hover:text-indigo-700 font-bold underline cursor-pointer"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Ad Networks */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1 text-xs">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Connected Ad Accounts
              </span>
              <div className="space-y-1 font-mono text-[11px] pt-1">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Meta Ads:</span>
                  <span className="font-bold text-slate-900">{selectedAsset.connectedNetworks.metaId}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Google Ads:</span>
                  <span className="font-bold text-slate-900">{selectedAsset.connectedNetworks.googleId}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>LinkedIn Ads:</span>
                  <span className="font-bold text-slate-900">{selectedAsset.connectedNetworks.linkedinId}</span>
                </div>
              </div>
            </div>

            {/* Inspector Action Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (onSelectAssetForStudio) {
                    onSelectAssetForStudio(selectedAsset);
                  } else {
                    onNavigate('studio-upload');
                    onShowToast(`Loaded ${selectedAsset.title} into Studio`);
                  }
                }}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit_square</span>
                <span>Open in Studio Editor</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">code</span>
                <span>Export JSON Schema</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

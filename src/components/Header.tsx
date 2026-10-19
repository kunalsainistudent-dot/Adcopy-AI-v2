import React, { useState } from 'react';
import { ScreenTab, CampaignProject } from '../types';

interface HeaderProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  credits: number;
  maxCredits: number;
  currentProject: CampaignProject;
  projects: CampaignProject[];
  onProjectChange: (proj: CampaignProject) => void;
  onNewCreativeClick: () => void;
  onShowToast: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  credits,
  maxCredits,
  currentProject,
  projects,
  onProjectChange,
  onNewCreativeClick,
  onShowToast,
}) => {
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tabs: Array<{ id: ScreenTab; label: string; icon: string }> = [
    { id: 'studio-upload', label: 'Studio & Upload', icon: 'auto_fix_high' },
    { id: 'multi-platform', label: 'Multi-Platform', icon: 'devices' },
    { id: 'ab-matrix', label: 'A/B Matrix', icon: 'grid_view' },
    { id: 'creative-library', label: 'Asset Library', icon: 'photo_library' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Left: Brand & Campaign Switcher */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer select-none group"
              onClick={() => onTabChange('studio-upload')}
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-zinc-800 transition">
                Ad
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-zinc-900">
                  AdCopy<span className="text-zinc-400 font-normal"> Studio</span>
                </span>
              </div>
            </div>

            <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

            {/* Campaign Switcher */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => {
                  setShowProjectMenu(!showProjectMenu);
                  setShowProfileMenu(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer font-medium"
              >
                <span className="truncate max-w-[140px]">{currentProject.name}</span>
                <span className="material-symbols-outlined text-zinc-400 text-[16px]">
                  unfold_more
                </span>
              </button>

              {showProjectMenu && (
                <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl bg-white border border-zinc-200 shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 py-1 text-[10px] uppercase text-zinc-400 font-semibold tracking-wider">
                    Campaigns
                  </div>
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onProjectChange(p);
                        setShowProjectMenu(false);
                        onShowToast(`Switched campaign to "${p.name}"`);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                        p.id === currentProject.id
                          ? 'bg-zinc-100 text-zinc-900 font-semibold'
                          : 'hover:bg-zinc-50 text-zinc-600'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {p.activeVariantCount} vars
                      </span>
                    </button>
                  ))}
                  <div className="mt-1 pt-1 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProjectMenu(false);
                        onNewCreativeClick();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-900 hover:bg-zinc-50 font-medium flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[15px] text-zinc-500">add</span>
                      New Campaign
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-100/80 p-1 rounded-lg">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[15px] ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Actions & User */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-zinc-600 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="font-mono text-[11px] text-zinc-500">
                {credits.toLocaleString()} credits
              </span>
            </div>

            <button
              type="button"
              onClick={onNewCreativeClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">upload</span>
              <span>Upload Creative</span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowProjectMenu(false);
                }}
                className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center text-xs font-semibold text-zinc-700 hover:ring-2 hover:ring-zinc-200 transition cursor-pointer"
              >
                K
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-white border border-zinc-200 shadow-lg p-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 border-b border-zinc-100">
                    <span className="font-medium text-zinc-900 block">Kunal Saini</span>
                    <span className="text-[11px] text-zinc-400 block truncate">kunal@adcopy.ai</span>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onShowToast('Ad accounts connected: Meta, Google, LinkedIn');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[15px] text-zinc-400">link</span>
                      Connected Accounts
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onShowToast('Voice settings updated');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[15px] text-zinc-400">tune</span>
                      Brand Voice
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

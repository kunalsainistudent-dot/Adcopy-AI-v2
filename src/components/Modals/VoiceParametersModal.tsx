import React, { useState } from 'react';

interface VoiceParametersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (params: any) => void;
}

export const VoiceParametersModal: React.FC<VoiceParametersModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formality, setFormality] = useState(70);
  const [urgency, setUrgency] = useState(85);
  const [techDensity, setTechDensity] = useState(60);
  const [punchiness, setPunchiness] = useState(90);
  const [forbiddenWords, setForbiddenWords] = useState('revolutionary, game-changer, synergy, rockstar, unleash');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[22px]">tune</span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Brand Voice Parameter Engine</h2>
              <p className="text-[11px] text-slate-500">Fine-tune algorithmic guardrails for copy synthesis</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Formality Level</span>
              <span className="font-mono text-indigo-600 font-bold">{formality}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={formality}
              onChange={(e) => setFormality(Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Conversational / Casual</span>
              <span>Executive / Wall Street</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Urgency &amp; Scarcity Intensity</span>
              <span className="font-mono text-indigo-600 font-bold">{urgency}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={urgency}
              onChange={(e) => setUrgency(Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Educational &amp; Patient</span>
              <span>High FOMO / Flash Deadline</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Technical Density &amp; Jargon</span>
              <span className="font-mono text-indigo-600 font-bold">{techDensity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={techDensity}
              onChange={(e) => setTechDensity(Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Plain English / ELI5</span>
              <span>Deep Domain Engineering</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Punchiness &amp; Brevity</span>
              <span className="font-mono text-indigo-600 font-bold">{punchiness}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={punchiness}
              onChange={(e) => setPunchiness(Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Long-form Narrative</span>
              <span>Ultra-compact 1-liner</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <label className="font-semibold text-slate-800">
              Forbidden Cliché Words &amp; Banned Phrasing
            </label>
            <input
              type="text"
              value={forbiddenWords}
              onChange={(e) => setForbiddenWords(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
            />
            <span className="text-[10px] text-slate-400">
              Comma-separated words the autonomous generator will strictly filter out.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave({ formality, urgency, techDensity, punchiness, forbiddenWords });
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Save Brand Voice
          </button>
        </div>
      </div>
    </div>
  );
};

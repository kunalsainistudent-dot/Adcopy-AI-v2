import React, { useState } from 'react';

interface NewCreativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (creative: { title: string; fileName: string; imageUrl?: string; aspectRatio: string }) => void;
}

export const NewCreativeModal: React.FC<NewCreativeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1 Square • Meta & LinkedIn');
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setFileName(file.name);
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSuccess({
      title,
      fileName: fileName || 'Uploaded Asset',
      imageUrl: previewUrl || undefined,
      aspectRatio,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-zinc-200 shadow-xl p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">Upload Creative Asset</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">Asset / Campaign Title</label>
            <input
              type="text"
              placeholder="e.g. Summer Running Shoes Launch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 transition"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Target Placement Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 transition"
            >
              <option>1:1 Square • Meta &amp; LinkedIn</option>
              <option>9:16 Story / Reels • TikTok &amp; IG</option>
              <option>1.91:1 Landscape • InMail &amp; Twitter</option>
              <option>Responsive Display • Multi-Size</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Select File</label>
            <label className="border border-dashed border-zinc-300 hover:border-zinc-500 rounded-xl p-4 text-center flex flex-col items-center justify-center cursor-pointer bg-zinc-50/50 hover:bg-zinc-50 transition relative overflow-hidden">
              {previewUrl ? (
                <div className="flex items-center gap-3 w-full">
                  <img src={previewUrl} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-zinc-200" />
                  <div className="flex flex-col text-left min-w-0">
                    <span className="font-semibold text-zinc-900 text-xs truncate max-w-[200px]">{fileName}</span>
                    <span className="text-zinc-500 text-[11px]">Click to replace image</span>
                  </div>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-zinc-500 text-[24px]">cloud_upload</span>
                  <span className="mt-1 font-medium text-zinc-700">
                    Click to browse or drop image (PNG, JPG, WEBP)
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium shadow-xs"
            >
              Upload &amp; Analyze
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCreativeModal;

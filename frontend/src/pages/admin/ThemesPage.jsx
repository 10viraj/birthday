import React, { useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState('pink-purple');
  const [customColors, setCustomColors] = useState({
    primary: '#FF6FAE',
    secondary: '#C7A7FF',
    accent: '#FFD166',
    background: '#160B28',
  });
  const [saved, setSaved] = useState(false);

  const themes = [
    {
      id: 'pink-purple',
      name: 'Pink & Purple (Romantic Bliss)',
      description: 'The iconic deep purple background with glowing pink and warm gold accents.',
      previewBg: '#160B28',
      previewAcc: '#FF6FAE',
      previewText: '#FFFFFF',
    },
    {
      id: 'black-gold',
      name: 'Black & Gold (Midnight Luxury)',
      description: 'Elegant dark mode with shimmering gold typography and royal velvet tones.',
      previewBg: '#0F0F13',
      previewAcc: '#FFD166',
      previewText: '#FFFFFF',
    },
    {
      id: 'blue-silver',
      name: 'Blue & Silver (Starlight Elegance)',
      description: 'Deep navy background with neon cyan glow and silver star dust particles.',
      previewBg: '#0A192F',
      previewAcc: '#64FFDA',
      previewText: '#F8FAFC',
    },
    {
      id: 'pastel-floral',
      name: 'Pastel Floral (Garden Dream)',
      description: 'Soft dreamy plum tones with floral pinks and warm amber highlights.',
      previewBg: '#1E1728',
      previewAcc: '#F472B6',
      previewText: '#FFF1F2',
    },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-serif-display font-bold text-white">Themes & Color Schemes</h2>
        <p className="text-xs text-purple-200/70">Customize the visual aesthetic of your birthday pages</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs">
          Theme preferences saved! ✨
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themes.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedTheme(t.id)}
            className={`glass-card p-6 rounded-3xl border transition-all cursor-pointer relative ${selectedTheme === t.id ? 'border-pink-400 shadow-2xl scale-[1.02] bg-pink-500/10' : 'border-pink-500/20 hover:border-pink-500/40'}`}
          >
            {selectedTheme === t.id && (
              <div className="absolute top-4 right-4 p-1.5 rounded-full bg-pink-500 text-white shadow-md">
                <Check size={14} />
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-full border border-white/20 shadow-md"
                style={{ backgroundColor: t.previewBg }}
              />
              <div
                className="w-8 h-8 rounded-full border border-white/20 shadow-md"
                style={{ backgroundColor: t.previewAcc }}
              />
            </div>

            <h3 className="text-lg font-bold font-serif-display text-white mb-1">{t.name}</h3>
            <p className="text-xs text-purple-200/70 leading-relaxed">{t.description}</p>
          </div>
        ))}
      </div>

      {/* Custom Colors Picker */}
      <div className="glass-card p-6 rounded-3xl border border-pink-500/20 space-y-4">
        <h3 className="text-lg font-bold font-serif-display text-white border-b border-white/10 pb-3 flex items-center gap-2">
          <Palette size={18} className="text-pink-400" />
          <span>Custom Palette (Advanced)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Background', key: 'background' },
            { label: 'Primary Accent', key: 'primary' },
            { label: 'Secondary Accent', key: 'secondary' },
            { label: 'Warm Highlight', key: 'accent' },
          ].map(c => (
            <div key={c.key}>
              <label className="block text-[11px] font-semibold uppercase text-purple-200 mb-1">
                {c.label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColors[c.key]}
                  onChange={(e) => setCustomColors({ ...customColors, [c.key]: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-purple-300">{customColors[c.key]}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer"
        >
          Save Theme Settings
        </button>
      </div>
    </div>
  );
}

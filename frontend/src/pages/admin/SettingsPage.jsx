import React, { useState, useEffect } from 'react';
import { Settings, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';

export default function SettingsPage() {
  const [birthdays, setBirthdays] = useState([]);
  const [selectedBirthdayId, setSelectedBirthdayId] = useState('');
  const [settings, setSettings] = useState({
    countdown_enabled: true,
    cake_animation_enabled: true,
    music_enabled: true,
    gallery_enabled: true,
    timeline_enabled: true,
    surprise_enabled: true,
    wishes_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      const res = await birthdayService.getAll();
      const list = res.data || [];
      setBirthdays(list);
      if (list.length > 0) {
        setSelectedBirthdayId(list[0].id);
        loadSettings(list[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const loadSettings = async (birthdayId) => {
    setLoading(true);
    try {
      const res = await birthdayService.getById(birthdayId);
      if (res.data?.settings) {
        setSettings({
          countdown_enabled: res.data.settings.countdown_enabled ?? true,
          cake_animation_enabled: res.data.settings.cake_animation_enabled ?? true,
          music_enabled: res.data.settings.music_enabled ?? true,
          gallery_enabled: res.data.settings.gallery_enabled ?? true,
          timeline_enabled: res.data.settings.timeline_enabled ?? true,
          surprise_enabled: res.data.settings.surprise_enabled ?? true,
          wishes_enabled: res.data.settings.wishes_enabled ?? true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBirthdayChange = (e) => {
    const id = e.target.value;
    setSelectedBirthdayId(id);
    loadSettings(id);
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!selectedBirthdayId) return;
    setSaving(true);
    setMessage('');
    try {
      await birthdayService.updateSettings(selectedBirthdayId, settings);
      setMessage('Feature settings updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggles = [
    { key: 'countdown_enabled', title: 'Birthday Countdown Timer', desc: 'Display live days, hours, minutes, seconds timer' },
    { key: 'cake_animation_enabled', title: 'Interactive Birthday Cake', desc: 'Allow visitors to light & blow out candles' },
    { key: 'music_enabled', title: 'Background Music Player', desc: 'Enable floating audio player with custom track' },
    { key: 'gallery_enabled', title: 'Photo Memory Gallery', desc: 'Show interactive photo grid with lightbox' },
    { key: 'timeline_enabled', title: 'Memory Journey Timeline', desc: 'Show chronological milestone cards' },
    { key: 'surprise_enabled', title: 'Grand Surprise Reveal', desc: 'Show interactive unwrapping mystery gift box' },
    { key: 'wishes_enabled', title: 'Guestbook Visitor Wishes', desc: 'Allow visitors to post birthday messages' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-display font-bold text-white">Section Toggles & Settings</h2>
          <p className="text-xs text-purple-200/70">Enable or disable specific sections on your public birthday page</p>
        </div>

        {birthdays.length > 0 && (
          <select
            value={selectedBirthdayId}
            onChange={handleBirthdayChange}
            className="p-3 rounded-xl bg-purple-950/80 border border-pink-500/30 text-white text-xs"
          >
            {birthdays.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} (/birthday/{b.slug})
              </option>
            ))}
          </select>
        )}
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      <div className="glass-card p-6 md:p-8 rounded-3xl border border-pink-500/20 space-y-6">
        <h3 className="text-lg font-bold font-serif-display text-white border-b border-white/10 pb-3 flex items-center gap-2">
          <Settings size={18} className="text-pink-400" />
          <span>Page Feature Modules</span>
        </h3>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-purple-200">
            <Sparkles className="animate-spin text-pink-400 mr-2" size={20} />
            <span>Loading Settings...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {toggles.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-purple-200/70">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(item.key)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${settings[item.key] ? 'bg-pink-500' : 'bg-purple-950/80'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs shadow-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, ArrowLeft, Lock, Palette } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';

export default function CreateBirthdayPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    birth_date: '',
    timezone: 'UTC',
    profile_image: '',
    headline: '',
    birthday_message: '',
    letter_title: 'Dearest Friend,',
    letter_content: '',
    signature: 'With endless love ❤️',
    theme: 'pink-purple',
    music_path: '',
    visibility: 'public',
    password: '',
    status: 'published',
  });
  const [profileFile, setProfileFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'name' && !prev.slug) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });
      if (profileFile) {
        submitData.append('profile_image_file', profileFile);
      }

      const res = await birthdayService.create(submitData);
      navigate(`/admin/birthdays/${res.data.id}/edit`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create birthday page.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/birthdays')}
            className="p-2 rounded-xl bg-white/5 text-purple-200 hover:text-white cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-serif-display font-bold text-white">Create Birthday Page</h2>
            <p className="text-xs text-purple-200/70">Personalize a new surprise celebration page</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card p-6 rounded-3xl border border-pink-500/20 space-y-4">
          <h3 className="text-lg font-bold font-serif-display text-white border-b border-white/10 pb-3">
            General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Birthday Person Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Viraj"
                required
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                URL Slug (/birthday/:slug) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="viraj-special"
                required
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Birth Date *
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Theme Preset
              </label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
              >
                <option value="pink-purple">Pink & Purple (Romantic Bliss)</option>
                <option value="black-gold">Black & Gold (Midnight Luxury)</option>
                <option value="blue-silver">Blue & Silver (Starlight)</option>
                <option value="pastel-floral">Pastel Floral (Garden Dream)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Profile Photo URL or File Upload
            </label>
            <input
              type="text"
              name="profile_image"
              value={formData.profile_image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileFile(e.target.files[0])}
              className="block w-full text-xs text-purple-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-500/20 file:text-pink-300 hover:file:bg-pink-500/30 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Headline Subtitle
            </label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="To the most incredible soul in the universe ✨"
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Hero Wish Message
            </label>
            <textarea
              name="birthday_message"
              value={formData.birthday_message}
              onChange={handleChange}
              rows={3}
              placeholder="Wishing you a year filled with endless laughter..."
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm"
            />
          </div>
        </div>

        {/* Letter Section */}
        <div className="glass-card p-6 rounded-3xl border border-pink-500/20 space-y-4">
          <h3 className="text-lg font-bold font-serif-display text-white border-b border-white/10 pb-3">
            Personal Birthday Letter 💌
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Letter Title
            </label>
            <input
              type="text"
              name="letter_title"
              value={formData.letter_title}
              onChange={handleChange}
              placeholder="Dearest Viraj,"
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Letter Content (Auto-typing animation)
            </label>
            <textarea
              name="letter_content"
              value={formData.letter_content}
              onChange={handleChange}
              rows={5}
              placeholder="Write your heartfelt letter here..."
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Signature
            </label>
            <input
              type="text"
              name="signature"
              value={formData.signature}
              onChange={handleChange}
              placeholder="With endless love ❤️"
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm font-script text-lg"
            />
          </div>
        </div>

        {/* Visibility & Protection */}
        <div className="glass-card p-6 rounded-3xl border border-pink-500/20 space-y-4">
          <h3 className="text-lg font-bold font-serif-display text-white border-b border-white/10 pb-3">
            Privacy & Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Visibility Mode
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
              >
                <option value="public">Public (Anyone with link)</option>
                <option value="password_protected">Password Protected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Password (if protected)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Optional password..."
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
              >
                <option value="published">Published</option>
                <option value="draft">Save as Draft</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm shadow-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'Creating Page...' : 'Save & Continue to Media'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

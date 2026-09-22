import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, Save, ArrowLeft, ExternalLink, Image as ImageIcon, Compass, MessageSquare } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';

export default function EditBirthdayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadBirthday();
  }, [id]);

  const loadBirthday = async () => {
    setLoading(true);
    try {
      const res = await birthdayService.getById(id);
      const data = res.data;
      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        birth_date: data.birth_date || '',
        timezone: data.timezone || 'UTC',
        profile_image: data.profile_image || '',
        headline: data.headline || '',
        birthday_message: data.birthday_message || '',
        letter_title: data.letter_title || '',
        letter_content: data.letter_content || '',
        signature: data.signature || '',
        theme: data.theme || 'pink-purple',
        music_path: data.music_path || '',
        visibility: data.visibility || 'public',
        password: '',
        status: data.status || 'published',
      });
    } catch (err) {
      setError('Failed to load birthday page details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

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

      await birthdayService.update(id, submitData);
      setMessage('Birthday page updated successfully! ✨');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update birthday page.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center h-48 text-purple-200">
        <Sparkles className="animate-spin text-pink-400 mr-2" size={24} />
        <span>Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/birthdays')}
            className="p-2 rounded-xl bg-white/5 text-purple-200 hover:text-white cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-serif-display font-bold text-white">Edit: {formData.name}</h2>
            <p className="text-xs text-pink-300 font-mono">/birthday/{formData.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/birthday/${formData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <span>Live Preview</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Management Quick Navigation Bar */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/admin/gallery" className="glass-card p-4 rounded-2xl border border-pink-500/20 text-center hover:bg-white/5 transition-all">
          <ImageIcon className="text-pink-400 mx-auto mb-1" size={20} />
          <span className="text-xs font-semibold text-white block">Manage Gallery</span>
        </Link>
        <Link to="/admin/memories" className="glass-card p-4 rounded-2xl border border-pink-500/20 text-center hover:bg-white/5 transition-all">
          <Compass className="text-pink-400 mx-auto mb-1" size={20} />
          <span className="text-xs font-semibold text-white block">Manage Timeline</span>
        </Link>
        <Link to="/admin/wishes" className="glass-card p-4 rounded-2xl border border-pink-500/20 text-center hover:bg-white/5 transition-all">
          <MessageSquare className="text-pink-400 mx-auto mb-1" size={20} />
          <span className="text-xs font-semibold text-white block">Moderate Wishes</span>
        </Link>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card p-6 rounded-3xl border border-pink-500/20 space-y-4">
          <h3 className="text-lg font-bold font-serif-display text-white border-b border-white/10 pb-3">
            General Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Birthday Person Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Birth Date
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
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
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
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
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm mb-2"
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
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
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
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
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
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Letter Content
            </label>
            <textarea
              name="letter_content"
              value={formData.letter_content}
              onChange={handleChange}
              rows={5}
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
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
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm font-script text-lg"
            />
          </div>
        </div>

        {/* Privacy & Status */}
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
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
              >
                <option value="public">Public</option>
                <option value="password_protected">Password Protected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Update Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
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
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
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
            <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

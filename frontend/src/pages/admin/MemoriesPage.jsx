import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Edit3, Compass, Calendar } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';
import { memoryService } from '../../services/memoryService';

export default function MemoriesPage() {
  const [birthdays, setBirthdays] = useState([]);
  const [selectedBirthdayId, setSelectedBirthdayId] = useState('');
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memoryDate, setMemoryDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
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
        loadMemories(list[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const loadMemories = async (birthdayId) => {
    setLoading(true);
    try {
      const res = await memoryService.getMemories(birthdayId);
      setMemories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBirthdayChange = (e) => {
    const id = e.target.value;
    setSelectedBirthdayId(id);
    loadMemories(id);
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!selectedBirthdayId) return;

    setSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('memory_date', memoryDate);
      if (imageUrl) formData.append('image_path', imageUrl);
      if (imageFile) formData.append('image', imageFile);

      await memoryService.addMemory(selectedBirthdayId, formData);
      setMessage('Memory added to timeline! ✨');
      setTitle('');
      setDescription('');
      setMemoryDate('');
      setImageUrl('');
      setImageFile(null);
      loadMemories(selectedBirthdayId);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMemory = async (memoryId) => {
    if (window.confirm('Delete this memory timeline milestone?')) {
      try {
        await memoryService.deleteMemory(selectedBirthdayId, memoryId);
        setMessage('Memory deleted.');
        loadMemories(selectedBirthdayId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-display font-bold text-white">Memory Timeline Manager</h2>
          <p className="text-xs text-purple-200/70">Create chronological milestones for celebration pages</p>
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
        <div className="p-3.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-200 text-xs">
          {message}
        </div>
      )}

      {/* Add Memory Form */}
      <div className="glass-card p-6 rounded-3xl border border-pink-500/20 space-y-4">
        <h3 className="text-lg font-bold font-serif-display text-white border-b border-white/10 pb-3 flex items-center gap-2">
          <Compass size={18} className="text-pink-400" />
          <span>Add New Timeline Milestone</span>
        </h3>

        <form onSubmit={handleAddMemory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Milestone Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Day We First Met ☕"
                required
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm placeholder-purple-300/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Memory Date *
              </label>
              <input
                type="date"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Image URL (Optional)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm placeholder-purple-300/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
                Or Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="block w-full text-xs text-purple-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-500/20 file:text-pink-300 hover:file:bg-pink-500/30 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Description / Memory Details *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="It all started with a cozy coffee chat that lasted over 4 hours..."
              rows={3}
              required
              className="w-full p-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-sm placeholder-purple-300/40"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Plus size={16} />
            <span>{submitting ? 'Adding...' : 'Add Memory Milestone'}</span>
          </button>
        </form>
      </div>

      {/* Memory Cards */}
      <div className="glass-card p-6 rounded-3xl border border-pink-500/20 space-y-4">
        <h3 className="text-lg font-bold font-serif-display text-white mb-2">
          Timeline Milestones ({memories.length})
        </h3>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-purple-200">
            <Sparkles className="animate-spin text-pink-400 mr-2" size={20} />
            <span>Loading Timeline...</span>
          </div>
        ) : memories.length === 0 ? (
          <p className="text-purple-200/60 text-xs text-center py-6">
            No memories created yet. Add one above!
          </p>
        ) : (
          <div className="space-y-4">
            {memories.map((m) => (
              <div key={m.id} className="glass-card p-5 rounded-2xl border border-pink-500/20 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{m.memory_date}</span>
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{m.title}</h4>
                  <p className="text-xs text-purple-200/80 leading-relaxed">{m.description}</p>
                </div>

                {m.image_path && (
                  <img src={m.image_path} alt={m.title} className="w-24 h-20 rounded-xl object-cover border border-white/10" />
                )}

                <button
                  onClick={() => handleDeleteMemory(m.id)}
                  className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 cursor-pointer self-start"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

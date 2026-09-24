import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, ExternalLink, Sparkles, CheckCircle2, FileText, Lock } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';
import { getFullImageUrl } from '../../utils/imageUrl';

export default function BirthdayListPage() {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    setLoading(true);
    try {
      const res = await birthdayService.getAll();
      setBirthdays(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      if (currentStatus === 'published') {
        await birthdayService.unpublish(id);
        setMessage('Page set to Draft mode');
      } else {
        await birthdayService.publish(id);
        setMessage('Page Published successfully!');
      }
      loadBirthdays();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"'s birthday page? This cannot be undone.`)) {
      try {
        await birthdayService.delete(id);
        setMessage('Birthday page deleted.');
        loadBirthdays();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-display font-bold text-white">Birthday Pages</h2>
          <p className="text-xs text-purple-200/70">Manage all your personalized celebration pages</p>
        </div>
        <Link
          to="/admin/birthdays/create"
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2 self-start cursor-pointer"
        >
          <Plus size={16} />
          <span>New Birthday Page</span>
        </Link>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-200 text-xs">
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-purple-200">
          <Sparkles className="animate-spin text-pink-400 mr-2" size={24} />
          <span>Loading Pages...</span>
        </div>
      ) : birthdays.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-pink-500/20">
          <p className="text-purple-200 text-sm mb-4">No birthday celebration pages created yet.</p>
          <Link
            to="/admin/birthdays/create"
            className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold text-xs inline-block shadow-lg"
          >
            Create Your First Birthday Page 🎉
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {birthdays.map((item) => (
            <div key={item.id} className="glass-card rounded-3xl p-6 border border-pink-500/20 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                    {item.status}
                  </span>
                  {item.is_password_protected && (
                    <span className="text-[10px] text-amber-300 flex items-center gap-1 font-semibold">
                      <Lock size={12} />
                      <span>Protected</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={getFullImageUrl(item.profile_image, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80")}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-pink-400/40 shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif-display">{item.name}</h3>
                    <p className="text-xs text-pink-300 font-mono">/birthday/{item.slug}</p>
                  </div>
                </div>

                <p className="text-xs text-purple-200/70 line-clamp-2 italic mb-3">
                  "{item.headline || 'No headline set'}"
                </p>

                <div className="flex items-center gap-4 text-[11px] text-purple-300/80 border-t border-white/5 pt-3">
                  <span>📷 {item.photos_count || 0} Photos</span>
                  <span>💫 {item.memories_count || 0} Memories</span>
                  <span>💌 {item.wishes_count || 0} Wishes</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <button
                  onClick={() => handleTogglePublish(item.id, item.status)}
                  className="text-xs font-semibold text-purple-300 hover:text-white cursor-pointer"
                >
                  {item.status === 'published' ? 'Unpublish' : 'Publish Page'}
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`/birthday/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 text-purple-200 hover:text-white cursor-pointer"
                    title="Preview"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <Link
                    to={`/admin/birthdays/${item.id}/edit`}
                    className="p-2 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

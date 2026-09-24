import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PartyPopper, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';
import { getFullImageUrl } from '../../utils/imageUrl';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentPages, setRecentPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const res = await birthdayService.getStats();
      setStats(res.stats);
      setRecentPages(res.recent_pages || []);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-purple-200">
        <Sparkles className="animate-spin text-pink-400 mr-2" size={24} />
        <span>Loading Real-time Statistics...</span>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Birthday Pages', value: stats?.total_pages || 0, icon: PartyPopper, color: 'from-purple-500 to-indigo-600' },
    { title: 'Published Pages', value: stats?.published_pages || 0, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
    { title: 'Draft Pages', value: stats?.draft_pages || 0, icon: FileText, color: 'from-amber-500 to-orange-600' },
    { title: 'Approved Wishes', value: stats?.approved_wishes || 0, icon: MessageSquare, color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-pink-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/80 via-pink-950/40 to-purple-950/80">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif-display font-bold text-white mb-1">
            Birthday Bliss Dashboard ✨
          </h2>
          <p className="text-purple-200/80 text-xs md:text-sm">
            Manage your personalized birthday pages, memory galleries, and visitor wishes in real time.
          </p>
        </div>
        <Link
          to="/admin/birthdays/create"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Create Birthday Page</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-5 rounded-2xl border border-pink-500/20 shadow-lg relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-purple-200/70 font-medium uppercase tracking-wider">{card.title}</span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md`}>
                  <Icon size={18} />
                </div>
              </div>
              <span className="text-3xl font-bold font-serif-display text-white">{card.value}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Birthday Pages Table */}
      <div className="glass-card rounded-3xl p-6 border border-pink-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-serif-display text-white">Recent Birthday Pages</h3>
          <Link to="/admin/birthdays" className="text-xs text-pink-400 hover:text-pink-300 font-semibold">
            View All ({recentPages.length}) →
          </Link>
        </div>

        {recentPages.length === 0 ? (
          <div className="py-12 text-center text-purple-200/60 text-sm">
            No birthday pages created yet.{' '}
            <Link to="/admin/birthdays/create" className="text-pink-400 font-semibold underline">
              Create your first one!
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-purple-100">
              <thead className="text-xs uppercase bg-white/5 text-purple-300 border-b border-white/10">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Person Name</th>
                  <th className="p-3.5">Public Slug URL</th>
                  <th className="p-3.5">Birth Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentPages.map((page) => (
                  <tr key={page.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-semibold text-white flex items-center gap-3">
                      <img
                        src={getFullImageUrl(page.profile_image, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80")}
                        alt={page.name}
                        className="w-8 h-8 rounded-full object-cover border border-pink-400/40"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                        }}
                      />
                      <span>{page.name}</span>
                    </td>
                    <td className="p-3.5 font-mono text-xs text-pink-300">
                      /birthday/{page.slug}
                    </td>
                    <td className="p-3.5 text-purple-200/80 text-xs">
                      {page.birth_date}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${page.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <a
                        href={`/birthday/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 text-purple-200 hover:text-white inline-block cursor-pointer"
                        title="View Public Page"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <Link
                        to={`/admin/birthdays/${page.id}/edit`}
                        className="p-2 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 inline-block cursor-pointer"
                        title="Edit Page"
                      >
                        <Edit3 size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

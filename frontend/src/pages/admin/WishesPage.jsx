import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, Trash2, Search, MessageSquare, Filter } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';
import { wishService } from '../../services/wishService';

export default function WishesPage() {
  const [birthdays, setBirthdays] = useState([]);
  const [selectedBirthdayId, setSelectedBirthdayId] = useState('');
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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
        loadWishes(list[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const loadWishes = async (birthdayId, params = {}) => {
    setLoading(true);
    try {
      const res = await wishService.getAdminWishes(birthdayId, {
        status: statusFilter || undefined,
        search: searchTerm || undefined,
        ...params
      });
      setWishes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBirthdayChange = (e) => {
    const id = e.target.value;
    setSelectedBirthdayId(id);
    loadWishes(id);
  };

  const handleApprove = async (wishId) => {
    try {
      await wishService.approveWish(selectedBirthdayId, wishId);
      setMessage('Wish approved for public view.');
      loadWishes(selectedBirthdayId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (wishId) => {
    try {
      await wishService.rejectWish(selectedBirthdayId, wishId);
      setMessage('Wish rejected.');
      loadWishes(selectedBirthdayId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (wishId) => {
    if (window.confirm('Delete this wish permanently?')) {
      try {
        await wishService.deleteWish(selectedBirthdayId, wishId);
        setMessage('Wish deleted.');
        loadWishes(selectedBirthdayId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-display font-bold text-white">Birthday Wish Moderation</h2>
          <p className="text-xs text-purple-200/70">Approve, reject, or filter visitor guestbook messages</p>
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

      {/* Filter & Search Controls */}
      <div className="glass-card p-4 rounded-2xl border border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 text-purple-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              loadWishes(selectedBirthdayId, { search: e.target.value });
            }}
            placeholder="Search by name or text..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-pink-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              loadWishes(selectedBirthdayId, { status: e.target.value });
            }}
            className="p-2 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white text-xs"
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Wishes Table */}
      <div className="glass-card rounded-3xl p-6 border border-pink-500/20 shadow-xl space-y-4">
        <h3 className="text-lg font-bold font-serif-display text-white mb-2">
          Submitted Visitor Messages ({wishes.length})
        </h3>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-purple-200">
            <Sparkles className="animate-spin text-pink-400 mr-2" size={20} />
            <span>Loading Wishes...</span>
          </div>
        ) : wishes.length === 0 ? (
          <p className="text-purple-200/60 text-xs text-center py-8">
            No wishes found for this filter.
          </p>
        ) : (
          <div className="space-y-4">
            {wishes.map((w) => (
              <div key={w.id} className="glass-card p-5 rounded-2xl border border-pink-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{w.visitor_name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${w.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : w.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {w.status}
                    </span>
                    <span className="text-[10px] text-purple-300/60">{w.created_at}</span>
                  </div>
                  <p className="text-purple-200/90 text-xs leading-relaxed">"{w.message}"</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {w.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(w.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve</span>
                    </button>
                  )}
                  {w.status !== 'rejected' && (
                    <button
                      onClick={() => handleReject(w.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

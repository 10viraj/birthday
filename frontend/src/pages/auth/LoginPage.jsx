import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Mail, Cake, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login({ email, password });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#160B28] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-pink-500/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card max-w-md w-full p-8 md:p-10 rounded-3xl border border-pink-500/30 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-pink-500/20 text-pink-400 mb-3 border border-pink-500/40">
            <Cake size={32} />
          </div>
          <h1 className="text-3xl font-serif-display font-bold">Birthday Bliss</h1>
          <p className="text-xs text-purple-200/70 mt-1 uppercase tracking-widest font-semibold">
            Admin Portal Access
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-purple-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@birthdaybliss.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-purple-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-950/60 border border-pink-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Logging in...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-purple-200/60">
          Don't have an account yet?{' '}
          <Link to="/admin/register" className="text-pink-400 hover:text-pink-300 font-semibold underline">
            Register here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

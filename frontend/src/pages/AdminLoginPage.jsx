import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, ArrowRight, Lock, Gem } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated auth: credentials = admin / admin
    await new Promise((r) => setTimeout(r, 600));

    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('aura_admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid credentials. Use admin / admin.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16"
      style={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #111113 60%, #1C1C1E 100%)' }}>

      {/* Background orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-charcoal-800/80 backdrop-blur-xl border border-charcoal-700 rounded-2xl p-8 sm:p-10 shadow-dark space-y-7">

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gold-500/15 border border-gold-500/25 flex items-center justify-center animate-pulse-gold">
              <ShieldCheck className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-widest text-white">
                AURA
              </h1>
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.35em] text-gold-500 mt-1">
                Admin Management Portal
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="gold-divider" />

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-widest text-charcoal-300">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 bg-charcoal-900/70 border border-charcoal-600 focus:border-gold-500 rounded-lg font-sans text-sm text-white placeholder-charcoal-500 outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]"
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-widest text-charcoal-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 bg-charcoal-900/70 border border-charcoal-600 focus:border-gold-500 rounded-lg font-sans text-sm text-white placeholder-charcoal-500 outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-gold-400 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-950/60 border border-red-700/50 rounded-lg">
                <Lock className="w-4 h-4 text-red-400 shrink-0" />
                <p className="font-sans text-xs text-red-300">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gold-gradient font-sans text-sm font-bold uppercase tracking-widest text-charcoal-900 rounded-lg flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-gold-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-charcoal-900/30 border-t-charcoal-900 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Access Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-center font-sans text-[11px] text-charcoal-500">
            Demo credentials:{' '}
            <span className="text-gold-500 font-semibold">admin</span>
            {' '}/{' '}
            <span className="text-gold-500 font-semibold">admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}

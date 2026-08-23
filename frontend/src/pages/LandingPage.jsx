import React from 'react';
import { Radar, ArrowRight, ShieldCheck, Layers, Cpu, Database, CheckCircle, ScanLine, Satellite, Activity, Box } from 'lucide-react';
import { View3D } from '../components/View3D';

export function LandingPage({ onStartAnalysis, onViewMethodology, onViewResults }) {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:py-8">
      <section className="relative overflow-hidden rounded-3xl border border-cyan-900/60 bg-[#0b1b2c] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(45,212,191,0.16),transparent_28%),linear-gradient(115deg,transparent_42%,rgba(56,189,248,0.07)_42%,transparent_43%)]" />
        <div className="relative grid min-h-[510px] items-center gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_1.08fr] lg:p-12">
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> Live monitoring system</div>
            <div>
              <p className="mb-2 text-sm font-semibold tracking-[0.18em] text-cyan-300">SENTRY-SAR / OPERATIONS</p>
              <h1 className="text-5xl font-bold leading-[0.96] tracking-tight text-white sm:text-7xl">See what<br /><span className="text-emerald-300">changed.</span></h1>
            </div>
            <p className="max-w-lg text-base leading-relaxed text-slate-300">A spatial intelligence workspace for finding meaningful man-made change in Sentinel-1 radar imagery, without mistaking water or vegetation for construction.</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={onStartAnalysis} className="group flex items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-bold text-[#092034] shadow-lg shadow-emerald-300/10 transition hover:bg-emerald-200"><ScanLine className="h-4 w-4" /> Open workspace <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></button>
              <button onClick={onViewResults} className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/60 hover:bg-slate-800"><Activity className="h-4 w-4 text-cyan-300" /> Review detections</button>
            </div>
            <div className="grid max-w-lg grid-cols-3 gap-4 border-t border-slate-700/70 pt-5 text-xs">
              <div><strong className="block text-xl text-white">02</strong><span className="text-slate-400">time windows</span></div>
              <div><strong className="block text-xl text-white">VV+VH</strong><span className="text-slate-400">polarization</span></div>
              <div><strong className="block text-xl text-white">98.4%</strong><span className="text-slate-400">scene coverage</span></div>
            </div>
          </div>

          <div className="relative h-[340px] overflow-hidden rounded-2xl border border-cyan-200/20 bg-[#071321] shadow-2xl sm:h-[410px]">
            <View3D events={[]} />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-slate-500/50 bg-[#0b1728]/85 px-3 py-2 text-xs text-slate-100 backdrop-blur-md"><Box className="h-4 w-4 text-cyan-300" /> Bengaluru AOI / terrain preview</div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-slate-500/40 bg-[#0b1728]/85 px-4 py-3 text-xs backdrop-blur-md"><span className="flex items-center gap-2 text-slate-300"><Satellite className="h-4 w-4 text-emerald-300" /> Sentinel-1 GRD</span><span className="font-semibold text-emerald-300">READY TO ANALYZE</span></div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="glass-panel rounded-2xl p-5"><div className="mb-5 flex items-center justify-between"><h2 className="font-semibold text-white">Detection pipeline</h2><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">Operational</span></div><div className="flex items-center gap-2 text-xs text-slate-300"><span className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-2 py-2">Acquire</span><span className="text-slate-600">/</span><span className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-2 py-2">Compare</span><span className="text-slate-600">/</span><span className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-2 py-2 text-emerald-200">Classify</span></div></div>
        <div className="glass-panel rounded-2xl p-5"><div className="mb-3 flex items-center gap-2 text-cyan-300"><Radar className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Data source</span></div><h3 className="text-lg font-semibold text-white">Copernicus Sentinel-1</h3><p className="mt-1 text-xs text-slate-400">IW mode · descending orbit · relative orbit 165</p></div>
        <div className="glass-panel rounded-2xl p-5"><div className="mb-3 flex items-center gap-2 text-amber-300"><ShieldCheck className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Signal quality</span></div><h3 className="text-lg font-semibold text-white">Natural suppression on</h3><p className="mt-1 text-xs text-slate-400">Water and vegetation filters are ready for this scene.</p></div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[['01', 'Match acquisitions', 'Align compatible orbit, mode, and polarization.', Radar], ['02', 'Suppress noise', 'Remove natural variation before scoring change.', Layers], ['03', 'Inspect in 3D', 'Explore detected structures against the terrain.', Box]].map(([number, title, copy, Icon]) => <div key={number} className="group rounded-2xl border border-slate-700/70 bg-[#102238]/75 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40"><div className="mb-6 flex items-center justify-between"><span className="font-mono text-xs text-cyan-300">{number}</span><Icon className="h-5 w-5 text-slate-500 transition group-hover:text-cyan-300" /></div><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{copy}</p></div>)}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-slate-500"><span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-300" /> Google Earth Engine connection healthy</span><button onClick={onViewMethodology} className="flex items-center gap-2 text-slate-300 transition hover:text-white"><Cpu className="h-4 w-4" /> Explore methodology <ArrowRight className="h-3.5 w-3.5" /></button></div>
    </div>
  );
}

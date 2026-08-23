import React from 'react';
import { Activity, Box, CircleDot, Layers3, Orbit } from 'lucide-react';
import { View3D } from '../components/View3D';

export function View3DPage({ analysisResult }) {
  return (
    <div className="min-h-[calc(100vh-105px)] workspace-grid p-4 sm:p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              <Orbit className="h-4 w-4" /> Live geospatial workspace
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Terrain change explorer</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">Read elevation, orbit footprint, and detected structures together in one navigable scene.</p>
          </div>
          <div className="flex gap-2 text-xs">
            <div className="glass-panel min-w-[112px] rounded-xl px-3 py-2">
              <div className="flex items-center gap-1.5 text-slate-400"><CircleDot className="h-3.5 w-3.5 text-orange-300" /> Features</div>
              <strong className="mt-1 block text-lg text-white">{analysisResult?.events?.length || 6}</strong>
            </div>
            <div className="glass-panel min-w-[112px] rounded-xl px-3 py-2">
              <div className="flex items-center gap-1.5 text-slate-400"><Activity className="h-3.5 w-3.5 text-emerald-300" /> Coverage</div>
              <strong className="mt-1 block text-lg text-white">98.4%</strong>
            </div>
          </div>
        </div>

        <div className="grid min-h-[620px] grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
          <div className="relative min-h-[560px] overflow-hidden rounded-2xl border border-slate-600/60 bg-[#08111f] shadow-2xl">
            <View3D events={analysisResult?.events} />
            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-slate-500/40 bg-[#0b1728]/80 px-3 py-2 text-xs text-slate-200 backdrop-blur-md">
              <Box className="h-4 w-4 text-cyan-300" /> S1 / AOI-165 / 3D terrain
            </div>
          </div>

          <aside className="glass-panel flex flex-col rounded-2xl p-4 text-sm">
            <div className="flex items-center gap-2 border-b border-slate-600/60 pb-3 font-semibold text-white"><Layers3 className="h-4 w-4 text-cyan-300" /> Scene layers</div>
            <div className="space-y-3 py-4 text-slate-300">
              <div className="flex items-center justify-between"><span>Elevation mesh</span><span className="h-2.5 w-2.5 rounded-full bg-cyan-300" /></div>
              <div className="flex items-center justify-between"><span>AOI boundary</span><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /></div>
              <div className="flex items-center justify-between"><span>New change</span><span className="h-2.5 w-2.5 rounded-full bg-orange-400" /></div>
              <div className="flex items-center justify-between"><span>Stable structure</span><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div>
            </div>
            <div className="mt-auto border-t border-slate-600/60 pt-4 text-xs leading-relaxed text-slate-400">
              <p className="font-semibold text-slate-200">Navigation</p>
              <p className="mt-1">Adjust tilt and rotation with the controls on the scene. Reset returns to the overview angle.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

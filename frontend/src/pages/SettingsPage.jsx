import React from 'react';
import { Settings, CheckCircle2, ShieldCheck, Database, Server } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-slate-700 pb-3 space-y-1">
        <h2 className="text-xl font-bold text-slate-100 font-mono">SYSTEM SETTINGS & ENVIRONMENT STATUS</h2>
        <p className="text-xs text-slate-400">Google Earth Engine Service Credentials & Sentinel-1 Pipeline Configuration</p>
      </div>

      <div className="space-y-4 text-xs font-mono">
        {/* GEE Status Box */}
        <div className="bg-navy-800 border border-slate-700/80 rounded-xl p-5 space-y-3 shadow-md">
          <div className="flex items-center space-x-2 border-b border-slate-700 pb-2 text-slate-200 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Google Earth Engine Status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div>GEE Status: <span className="text-emerald-400 font-bold">CONNECTED</span></div>
            <div>Earth Engine API: <span className="text-slate-100">1.7.39</span></div>
            <div>Project ID: <span className="text-emerald-400">project-086ef6ed-baf1-4362-a86</span></div>
            <div>Primary Dataset: <span className="text-slate-100">COPERNICUS/S1_GRD</span></div>
          </div>
        </div>

        {/* Pipeline Configuration */}
        <div className="bg-navy-800 border border-slate-700/80 rounded-xl p-5 space-y-3 shadow-md">
          <div className="flex items-center space-x-2 border-b border-slate-700 pb-2 text-slate-200 font-bold">
            <Server className="w-4 h-4 text-brand-blue" />
            <span>Default Analysis Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div>Spatial Scale: <span className="text-slate-100">10m / 20m vector</span></div>
            <div>Instrument Mode: <span className="text-slate-100">IW (Interferometric Wide)</span></div>
            <div>Default Threshold: <span className="text-amber-400 font-bold">3.0 dB</span></div>
            <div>Default Min Area: <span className="text-slate-100">500 m²</span></div>
            <div>Water Threshold: <span className="text-sky-400">-18.0 dB (VV)</span></div>
            <div>Cross-Pol Ratio: <span className="text-slate-100">1.3 (VH/VV)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

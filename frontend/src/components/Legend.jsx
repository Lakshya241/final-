import React from 'react';

export function Legend({ activeLayers, layerVisibility, toggleLayer }) {
  return (
    <div className="bg-navy-800/90 backdrop-blur-sm border border-slate-700/80 rounded-lg p-3 shadow-lg text-xs space-y-2 max-w-xs">
      <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between">
        <span>GEOSPATIAL LAYERS & LEGEND</span>
        <span className="text-[10px] text-slate-400 font-mono">EPSG:4326</span>
      </div>

      <div className="space-y-1.5">
        {/* Layer item: T1 VV */}
        <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={layerVisibility.t1 ?? true}
              onChange={() => toggleLayer('t1')}
              className="rounded bg-slate-900 border-slate-600 text-brand-blue focus:ring-0"
            />
            <span>T1 Sentinel-1 SAR (VV)</span>
          </div>
          <span className="w-3 h-3 bg-slate-400 rounded-sm"></span>
        </label>

        {/* Layer item: T2 VV */}
        <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={layerVisibility.t2 ?? true}
              onChange={() => toggleLayer('t2')}
              className="rounded bg-slate-900 border-slate-600 text-brand-blue focus:ring-0"
            />
            <span>T2 Sentinel-1 SAR (VV)</span>
          </div>
          <span className="w-3 h-3 bg-slate-200 rounded-sm"></span>
        </label>

        {/* Raw Change */}
        <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={layerVisibility.raw_change ?? true}
              onChange={() => toggleLayer('raw_change')}
              className="rounded bg-slate-900 border-slate-600 text-brand-blue focus:ring-0"
            />
            <span>Raw Change Score</span>
          </div>
          <span className="w-3 h-3 bg-amber-400 rounded-sm"></span>
        </label>

        {/* Natural Suppression */}
        <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={layerVisibility.natural_suppression ?? true}
              onChange={() => toggleLayer('natural_suppression')}
              className="rounded bg-slate-900 border-slate-600 text-brand-blue focus:ring-0"
            />
            <span>Natural Suppression (Water/Veg)</span>
          </div>
          <span className="w-3 h-3 bg-sky-500 rounded-sm"></span>
        </label>

        {/* Final Manmade Polygons */}
        <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none font-medium text-emerald-400">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={layerVisibility.manmade ?? true}
              onChange={() => toggleLayer('manmade')}
              className="rounded bg-slate-900 border-slate-600 text-emerald-500 focus:ring-0"
            />
            <span>Final Man-Made Changes</span>
          </div>
          <span className="w-3 h-3 bg-emerald-500 border border-emerald-300 rounded-sm"></span>
        </label>
      </div>
    </div>
  );
}

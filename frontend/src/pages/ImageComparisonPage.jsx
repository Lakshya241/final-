import React from 'react';
import { ImageSwipe } from '../components/ImageSwipe';
import { Columns, SplitSquareVertical, Activity, Radio } from 'lucide-react';

export function ImageComparisonPage({ analysisResult }) {
  return (
    <div className="h-[calc(100vh-61px)] flex flex-col p-4 space-y-3 bg-navy-950">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/80 pb-3 px-1 gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-widest mb-1">
            <Radio className="w-4 h-4 text-sky-400" />
            <span>Dual-Acquisition SAR Radar Workstation</span>
          </div>
          <h2 className="text-xl font-bold text-white font-mono tracking-tight">
            SENTINEL-1 SAR 1 (T1) vs SAR 2 (T2) SWIPE COMPARISON
          </h2>
          <p className="text-xs text-slate-400">
            Interactive visual verification workstation for backscatter radar changes between baseline T1 and target T2 acquisitions.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="glass-panel px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center space-x-2">
            <span className="text-slate-400">Orbit Pass:</span>
            <span className="text-white font-bold">{analysisResult?.t1_metadata?.orbit_pass || 'DESCENDING'}</span>
          </div>
          <div className="glass-panel px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center space-x-2">
            <span className="text-slate-400">Rel Orbit:</span>
            <span className="text-sky-400 font-bold">{analysisResult?.t1_metadata?.relative_orbit || 165}</span>
          </div>
        </div>
      </div>

      {/* Main Image Swipe Container */}
      <div className="flex-1 w-full min-h-[500px] overflow-hidden rounded-xl">
        <ImageSwipe
          t1Meta={analysisResult?.t1_metadata}
          t2Meta={analysisResult?.t2_metadata}
          t1TileUrl={analysisResult?.tile_urls?.t1}
          t2TileUrl={analysisResult?.tile_urls?.t2}
          rawChangeTileUrl={analysisResult?.tile_urls?.raw_change}
        />
      </div>
    </div>
  );
}

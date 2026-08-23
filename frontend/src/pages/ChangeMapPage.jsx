import React from 'react';
import { Map2D } from '../components/Map2D';
import { Legend } from '../components/Legend';

export function ChangeMapPage({ analysisResult, layerVisibility, toggleLayer }) {
  return (
    <div className="h-[calc(100vh-61px)] flex flex-col bg-slate-950 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-100 font-mono">FULLSCREEN CHANGE MAP WORKSTATION</h2>
          <p className="text-slate-400">Layered Sentinel-1 Backscatter, Natural Suppression, and Manmade Vector Polygons</p>
        </div>
        <div className="text-slate-300 font-mono">
          Events: <span className="text-emerald-400 font-bold">{analysisResult?.event_count || 0}</span>
        </div>
      </div>

      <div className="relative flex-1 w-full h-full rounded-lg overflow-hidden border border-slate-800">
        <div className="absolute top-4 right-4 z-10">
          <Legend
            activeLayers={[]}
            layerVisibility={layerVisibility}
            toggleLayer={toggleLayer}
          />
        </div>

        <Map2D
          tileUrls={analysisResult?.tile_urls}
          events={analysisResult?.events}
          layerVisibility={layerVisibility}
        />
      </div>
    </div>
  );
}

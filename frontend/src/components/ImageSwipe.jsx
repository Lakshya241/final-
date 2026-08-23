import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { SlidersHorizontal, Columns, SplitSquareVertical, ZoomIn, ZoomOut, Layers, Eye } from 'lucide-react';

export function ImageSwipe({ t1Meta, t2Meta, t1TileUrl, t2TileUrl, rawChangeTileUrl }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [opacity, setOpacity] = useState(1.0);
  const [comparisonMode, setComparisonMode] = useState('swipe'); // 'swipe' or 'side-by-side'
  const [showChangeOverlay, setShowChangeOverlay] = useState(false);

  // Map references for Swipe Mode
  const swipeMapRef = useRef(null);
  const swipeLeafletMap = useRef(null);
  const t1LayerRef = useRef(null);
  const t2LayerRef = useRef(null);
  const changeLayerRef = useRef(null);

  // Map references for Side-by-Side Mode
  const mapLeftRef = useRef(null);
  const mapRightRef = useRef(null);
  const leafletLeftMap = useRef(null);
  const leafletRightMap = useRef(null);

  // Default tile URLs if missing
  const defaultT1Url = t1TileUrl || '/api/tiles/t1/{z}/{x}/{y}.png';
  const defaultT2Url = t2TileUrl || '/api/tiles/t2/{z}/{x}/{y}.png';
  const defaultChangeUrl = rawChangeTileUrl || '/api/tiles/raw_change/{z}/{x}/{y}.png';

  // 1. Initialize Swipe Map
  useEffect(() => {
    if (comparisonMode !== 'swipe' || !swipeMapRef.current) return;

    if (swipeLeafletMap.current) {
      try { swipeLeafletMap.current.remove(); } catch (e) {}
      swipeLeafletMap.current = null;
    }
    if (swipeMapRef.current._leaflet_id) {
      delete swipeMapRef.current._leaflet_id;
    }

    try {
      const map = L.map(swipeMapRef.current, {
        center: [13.00, 77.60],
        zoom: 13,
        zoomControl: false,
      });

      // CartoDB Dark Basemap
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; CARTO &copy; Sentinel-1 SAR',
      }).addTo(map);

      // T2 Layer (Underneath base)
      const t2Layer = L.tileLayer(defaultT2Url, { opacity: opacity, maxZoom: 19 }).addTo(map);
      t2LayerRef.current = t2Layer;

      // T1 Layer (Top layer clipped by clip-path in container or tile container)
      const t1Layer = L.tileLayer(defaultT1Url, { opacity: opacity, maxZoom: 19 }).addTo(map);
      t1LayerRef.current = t1Layer;

      // Optional Change Layer
      if (showChangeOverlay) {
        const changeLayer = L.tileLayer(defaultChangeUrl, { opacity: 0.75 }).addTo(map);
        changeLayerRef.current = changeLayer;
      }

      swipeLeafletMap.current = map;
    } catch (err) {
      console.error("Leaflet swipe map init error:", err);
    }

    return () => {
      if (swipeLeafletMap.current) {
        try { swipeLeafletMap.current.remove(); } catch (e) {}
        swipeLeafletMap.current = null;
      }
    };
  }, [comparisonMode, defaultT1Url, defaultT2Url, defaultChangeUrl]);

  // Update Opacity & Overlay
  useEffect(() => {
    if (t1LayerRef.current) t1LayerRef.current.setOpacity(opacity);
    if (t2LayerRef.current) t2LayerRef.current.setOpacity(opacity);
  }, [opacity]);

  // 2. Initialize Side-by-Side Synchronized Maps
  useEffect(() => {
    if (comparisonMode !== 'side-by-side' || !mapLeftRef.current || !mapRightRef.current) return;

    if (leafletLeftMap.current) { try { leafletLeftMap.current.remove(); } catch(e){} }
    if (leafletRightMap.current) { try { leafletRightMap.current.remove(); } catch(e){} }

    try {
      const mapL = L.map(mapLeftRef.current, { center: [13.00, 77.60], zoom: 13, zoomControl: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapL);
      L.tileLayer(defaultT1Url, { opacity }).addTo(mapL);
      leafletLeftMap.current = mapL;

      const mapR = L.map(mapRightRef.current, { center: [13.00, 77.60], zoom: 13, zoomControl: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapR);
      L.tileLayer(defaultT2Url, { opacity }).addTo(mapR);
      leafletRightMap.current = mapR;

      // Sync pan & zoom between left and right maps
      let isSyncing = false;
      const syncMaps = (source, target) => {
        if (isSyncing) return;
        isSyncing = true;
        target.setView(source.getCenter(), source.getZoom(), { animate: false });
        isSyncing = false;
      };

      mapL.on('move', () => syncMaps(mapL, mapR));
      mapR.on('move', () => syncMaps(mapR, mapL));
    } catch (err) {
      console.error("Side-by-side maps init error:", err);
    }

    return () => {
      if (leafletLeftMap.current) { try { leafletLeftMap.current.remove(); } catch(e){} }
      if (leafletRightMap.current) { try { leafletRightMap.current.remove(); } catch(e){} }
    };
  }, [comparisonMode, defaultT1Url, defaultT2Url, opacity]);

  return (
    <div className="flex flex-col h-full bg-navy-950 border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Acquisition Metadata Header */}
      <div className="grid grid-cols-2 bg-navy-900 border-b border-slate-700/80 p-3 text-xs divide-x divide-slate-700/80">
        {/* SAR 1 (T1) Info */}
        <div className="pr-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="font-bold text-white font-mono text-sm">SAR 1 (T1 Acquisition)</span>
            <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded text-[10px] font-mono">BEFORE</span>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 font-mono">
            <div>Acquisition Date: <span className="text-white">{t1Meta?.date || '2025-01-04 00:40'}</span></div>
            <div>Orbit Pass: <span className="text-white">{t1Meta?.orbit_pass || 'DESCENDING'}</span></div>
            <div>Relative Orbit: <span className="text-white">{t1Meta?.relative_orbit || 165}</span></div>
            <div>Polarization: <span className="text-white">VV + VH</span></div>
          </div>
        </div>

        {/* SAR 2 (T2) Info */}
        <div className="pl-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-emerald-400 font-mono text-sm">SAR 2 (T2 Acquisition)</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono">AFTER</span>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 font-mono">
            <div>Acquisition Date: <span className="text-emerald-300">{t2Meta?.date || '2025-01-16 00:40'}</span></div>
            <div>Orbit Pass: <span className="text-white">{t2Meta?.orbit_pass || 'DESCENDING'}</span></div>
            <div>Relative Orbit: <span className="text-white">{t2Meta?.relative_orbit || 165}</span></div>
            <div>Polarization: <span className="text-white">VV + VH</span></div>
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative flex-1 min-h-[460px] bg-slate-950 overflow-hidden select-none">
        {comparisonMode === 'swipe' ? (
          <div className="relative w-full h-full">
            {/* Underneath Base Layer (SAR 2 - T2) */}
            <div ref={swipeMapRef} className="w-full h-full" />

            {/* Overlaid Layer Clip Mask (SAR 1 - T1) */}
            <div 
              className="absolute inset-y-0 left-0 border-r-2 border-brand-blue z-10 pointer-events-none overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* Floating Label Badge */}
              <div className="absolute top-4 left-4 bg-navy-900/90 text-sky-300 border border-sky-500/40 px-2.5 py-1 rounded text-xs font-mono shadow-md backdrop-blur-md">
                SAR 1 (T1) Viewport
              </div>
            </div>

            {/* Swipe Drag Divider Handle */}
            <div
              className="absolute inset-y-0 cursor-ew-resize flex items-center justify-center z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-9 h-9 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-2xl border-2 border-white text-sm font-bold pointer-events-auto hover:scale-110 transition-transform">
                ↔
              </div>
            </div>

            {/* Right Badge */}
            <div className="absolute top-4 right-4 z-10 bg-navy-900/90 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded text-xs font-mono shadow-md backdrop-blur-md">
              SAR 2 (T2) Viewport
            </div>
          </div>
        ) : (
          /* Side-by-Side Dual Map Mode */
          <div className="grid grid-cols-2 h-full divide-x divide-slate-700/80">
            <div className="relative h-full">
              <div ref={mapLeftRef} className="w-full h-full" />
              <div className="absolute top-3 left-3 bg-navy-900/90 text-sky-300 px-2.5 py-1 rounded text-xs font-mono border border-sky-500/40 z-10">
                SAR 1 (T1) Map
              </div>
            </div>
            <div className="relative h-full">
              <div ref={mapRightRef} className="w-full h-full" />
              <div className="absolute top-3 left-3 bg-navy-900/90 text-emerald-300 px-2.5 py-1 rounded text-xs font-mono border border-emerald-500/40 z-10">
                SAR 2 (T2) Map
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Workstation Control Bar */}
      <div className="bg-navy-900 border-t border-slate-700/80 p-3 flex flex-wrap items-center justify-between text-xs gap-3">
        {/* Swipe Slider Control */}
        {comparisonMode === 'swipe' && (
          <div className="flex items-center space-x-3 min-w-[260px] flex-1">
            <span className="text-slate-300 font-mono">Swipe Position:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-full accent-brand-blue"
            />
            <span className="font-mono text-white font-bold w-10">{sliderPosition}%</span>
          </div>
        )}

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setComparisonMode('swipe')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
              comparisonMode === 'swipe' 
                ? 'bg-brand-blue text-white border-brand-blue shadow' 
                : 'bg-navy-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Interactive Swipe</span>
          </button>

          <button
            onClick={() => setComparisonMode('side-by-side')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
              comparisonMode === 'side-by-side' 
                ? 'bg-brand-blue text-white border-brand-blue shadow' 
                : 'bg-navy-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side Dual</span>
          </button>
        </div>

        {/* Opacity Adjustment */}
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-mono">Tile Opacity:</span>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-24 accent-brand-blue"
          />
          <span className="font-mono text-white text-[11px] w-8">{(opacity * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}

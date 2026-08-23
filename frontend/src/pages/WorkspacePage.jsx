import React, { useState } from 'react';
import { 
  Play, 
  MapPin, 
  Calendar, 
  Sliders, 
  Layers, 
  ShieldAlert, 
  FileJson, 
  Map as MapIcon, 
  Box as BoxIcon,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Radio,
  Clock
} from 'lucide-react';
import { Map2D } from '../components/Map2D';
import { View3D } from '../components/View3D';
import { Legend } from '../components/Legend';

export function WorkspacePage({ 
  onRunAnalysis, 
  analysisResult, 
  isLoading, 
  error,
  layerVisibility,
  toggleLayer 
}) {
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
  
  // Form parameters
  const [t1Start, setT1Start] = useState('2025-01-04');
  const [t1End, setT1End] = useState('2025-01-05');
  const [t2Start, setT2Start] = useState('2025-01-16');
  const [t2End, setT2End] = useState('2025-01-17');
  const [polarization, setPolarization] = useState('VV+VH');
  const [orbitPass, setOrbitPass] = useState('DESCENDING');
  const [relativeOrbit, setRelativeOrbit] = useState(165);
  const [changeMethod, setChangeMethod] = useState('Difference');
  const [thresholdDb, setThresholdDb] = useState(3.0);
  const [minAreaM2, setMinAreaM2] = useState(500);
  const [enableNaturalSuppression, setEnableNaturalSuppression] = useState(true);

  // Apply Quick Date Presets
  const applyPreset = (preset) => {
    if (preset === 'jan2025') {
      setT1Start('2025-01-04');
      setT1End('2025-01-05');
      setT2Start('2025-01-16');
      setT2End('2025-01-17');
    } else if (preset === 'feb2025') {
      setT1Start('2025-02-01');
      setT1End('2025-02-05');
      setT2Start('2025-02-13');
      setT2End('2025-02-18');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunAnalysis({
      filter_params: {
        aoi: {
          geometry_type: 'bbox',
          bbox: { min_lon: 77.50, min_lat: 12.90, max_lon: 77.70, max_lat: 13.10 }
        },
        t1_start: t1Start,
        t1_end: t1End,
        t2_start: t2Start,
        t2_end: t2End,
        instrument_mode: 'IW',
        polarization,
        orbit_pass: orbitPass,
        relative_orbit: Number(relativeOrbit)
      },
      change_method: changeMethod,
      change_threshold_db: Number(thresholdDb),
      min_change_area_m2: Number(minAreaM2),
      enable_natural_suppression: enableNaturalSuppression
    });
  };

  return (
    <div className="h-[calc(100vh-61px)] flex flex-col overflow-hidden bg-navy-950 font-sans">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* LEFT PANEL: 3D Control Workstation */}
        <div className="lg:col-span-3 bg-navy-900/90 border-r border-slate-700/80 p-4 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-brand-blue" />
              <span className="font-bold text-white font-mono text-sm tracking-wide">ANALYSIS CONTROLS</span>
            </div>
            <span className="text-[10px] bg-brand-blue/20 text-brand-blue border border-brand-blue/30 px-2 py-0.5 rounded font-mono font-bold">IW Mode</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Quick Preset Bar */}
            <div className="bg-navy-800/80 p-2 rounded-lg border border-slate-700/80 space-y-1.5">
              <span className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-400" /> Quick Date Presets:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset('jan2025')}
                  className="px-2 py-1 bg-navy-900 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px] font-mono transition text-center"
                >
                  Jan 04 vs Jan 16
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('feb2025')}
                  className="px-2 py-1 bg-navy-900 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px] font-mono transition text-center"
                >
                  Feb 01 vs Feb 13
                </button>
              </div>
            </div>

            {/* AOI Selector Card */}
            <div className="bg-navy-800/80 p-3 rounded-lg border border-slate-700/80 space-y-2">
              <label className="flex items-center space-x-1.5 text-slate-200 font-medium">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span className="font-mono text-xs">Area of Interest (AOI)</span>
              </label>
              <div className="bg-navy-950 border border-slate-700/90 p-2 rounded text-slate-300 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-white">Bengaluru Metro Region</span>
                  <span className="font-mono text-sky-400">77.50E - 77.70E</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">12.90N - 13.10N (Coverage 420 km²)</div>
              </div>
            </div>

            {/* Acquisition Date Pickers Card */}
            <div className="bg-navy-800/80 p-3 rounded-lg border border-slate-700/80 space-y-2">
              <label className="flex items-center space-x-1.5 text-slate-200 font-medium">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs">Acquisition Windows</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">SAR 1 (T1 Start)</span>
                  <input
                    type="date"
                    value={t1Start}
                    onChange={(e) => setT1Start(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono focus:border-brand-blue outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">SAR 2 (T2 Start)</span>
                  <input
                    type="date"
                    value={t2Start}
                    onChange={(e) => setT2Start(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono focus:border-brand-blue outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Orbit & Polarization Filters */}
            <div className="bg-navy-800/80 p-3 rounded-lg border border-slate-700/80 space-y-2">
              <label className="flex items-center space-x-1.5 text-slate-200 font-medium">
                <Radio className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-xs">Orbit & Geometry</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono">Polarization</label>
                  <select
                    value={polarization}
                    onChange={(e) => setPolarization(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px]"
                  >
                    <option value="VV+VH">VV + VH Dual</option>
                    <option value="VV">VV Only</option>
                    <option value="VH">VH Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono">Orbit Pass</label>
                  <select
                    value={orbitPass}
                    onChange={(e) => setOrbitPass(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px]"
                  >
                    <option value="DESCENDING">Descending</option>
                    <option value="ASCENDING">Ascending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Change Method & Threshold */}
            <div className="bg-navy-800/80 p-3 rounded-lg border border-slate-700/80 space-y-2.5">
              <label className="flex items-center space-x-1.5 text-slate-200 font-medium">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs">Detection Parameters</span>
              </label>
              
              <div>
                <label className="text-[10px] text-slate-400">Change Scoring Algorithm</label>
                <select
                  value={changeMethod}
                  onChange={(e) => setChangeMethod(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-[11px]"
                >
                  <option value="Difference">Difference (|T2 - T1| dB)</option>
                  <option value="Ratio">Ratio (Linear Intensity)</option>
                  <option value="Log-Ratio">Log-Ratio (Log dB Scale)</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>Threshold Sensitivity:</span>
                  <span className="font-mono font-bold text-amber-400">{thresholdDb} dB</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.5"
                  value={thresholdDb}
                  onChange={(e) => setThresholdDb(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Minimum Change Polygon Area (m²)</label>
                <input
                  type="number"
                  value={minAreaM2}
                  onChange={(e) => setMinAreaM2(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Natural Suppression Toggle */}
            <div className="bg-navy-800/80 p-3 rounded-lg border border-slate-700/80 space-y-1">
              <label className="flex items-center space-x-2 text-slate-200 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableNaturalSuppression}
                  onChange={(e) => setEnableNaturalSuppression(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-brand-blue"
                />
                <span className="font-mono text-xs">Natural Change Suppression</span>
              </label>
              <p className="text-[10px] text-slate-400">Suppresses specular water reflection & vegetation canopy fluctuation noise</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-2.5 rounded text-[11px] flex items-start space-x-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* RUN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-brand-blue hover:bg-sky-600 text-white font-mono font-semibold py-3 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50 border border-sky-400/40"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isLoading ? 'EXECUTING GEE PIPELINE...' : 'RUN CHANGE DETECTION'}</span>
            </button>
          </form>
        </div>

        {/* CENTER PANEL: Map / 3D Workstation Canvas */}
        <div className="lg:col-span-6 relative flex flex-col h-full bg-slate-950 p-3">
          
          {/* Top Workstation Bar */}
          <div className="absolute top-5 left-5 z-10 bg-navy-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl shadow-2xl flex items-center space-x-1">
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                viewMode === '2d' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>2D Geospatial Map</span>
            </button>

            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                viewMode === '3d' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BoxIcon className="w-3.5 h-3.5" />
              <span>3D Terrain Workstation</span>
            </button>
          </div>

          {/* Floating Layer Legend */}
          <div className="absolute top-5 right-5 z-10">
            <Legend
              activeLayers={[]}
              layerVisibility={layerVisibility}
              toggleLayer={toggleLayer}
            />
          </div>

          {/* Viewport Canvas Render */}
          <div className="flex-1 w-full h-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            {viewMode === '2d' ? (
              <Map2D
                tileUrls={analysisResult?.tile_urls}
                events={analysisResult?.events}
                layerVisibility={layerVisibility}
              />
            ) : (
              <View3D events={analysisResult?.events} />
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Metrics & Events Summary */}
        <div className="lg:col-span-3 bg-navy-900/90 border-l border-slate-700/80 p-4 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <span className="font-bold text-white font-mono text-sm tracking-wide">ANALYSIS SUMMARY</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
              STATUS: {analysisResult ? 'COMPLETED' : 'READY'}
            </span>
          </div>

          {analysisResult ? (
            <div className="space-y-4">
              {/* Detection Metrics Breakdown */}
              <div className="bg-navy-800/90 p-3.5 rounded-xl border border-slate-700/80 space-y-2.5 shadow-lg">
                <div className="text-slate-400 text-[11px] font-mono font-bold tracking-wider uppercase">DETECTION METRICS</div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Raw Changed Area:</span>
                    <span className="text-amber-400 font-bold">{analysisResult.raw_changed_area_m2} m²</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Hectares:</span>
                    <span>{analysisResult.raw_changed_area_hectares} ha</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1.5 text-sky-400">
                    <span>Natural Suppressed:</span>
                    <span>{analysisResult.natural_suppressed_area_m2} m²</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1.5 text-emerald-400 font-bold">
                    <span>Final Manmade Area:</span>
                    <span>{analysisResult.final_manmade_area_m2} m²</span>
                  </div>
                </div>
              </div>

              {/* Event Count Card */}
              <div className="bg-navy-800/90 p-3.5 rounded-xl border border-slate-700/80 flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-slate-400 text-[10px] font-mono">CANDIDATE POLYGONS</div>
                  <div className="text-2xl font-bold text-white font-mono">{analysisResult.event_count}</div>
                </div>
                <ShieldAlert className="w-7 h-7 text-rose-500" />
              </div>

              {/* Detected Change Events Scrollable Feed */}
              <div className="space-y-2">
                <div className="text-slate-200 font-mono font-semibold flex justify-between items-center">
                  <span>DETECTED CHANGE EVENTS</span>
                  <span className="text-[10px] text-slate-400 font-mono">{analysisResult.events?.length || 0} Listed</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {analysisResult.events?.map((evt) => (
                    <div 
                      key={evt.event_id} 
                      className="bg-navy-800/90 border border-slate-700/80 p-2.5 rounded-lg text-[11px] space-y-1.5 hover:border-brand-blue hover:bg-slate-800/90 transition shadow cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-white">{evt.event_id}</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-semibold">
                          {evt.classification}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-300 font-mono text-[10px]">
                        <span>Area: <strong className="text-amber-400">{evt.area_m2} m²</strong></span>
                        <span>Confidence: <strong className="text-sky-400">{((evt.confidence || 0.9) * 100).toFixed(0)}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-navy-800/80 p-6 rounded-xl border border-slate-700/80 text-center space-y-3 text-slate-400 shadow-inner">
              <Layers className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
              <p className="text-xs leading-relaxed">Configure Sentinel-1 acquisition parameters on the left panel and click <strong className="text-white">RUN CHANGE DETECTION</strong> to compute man-made building & infrastructure changes.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { FlaskConical, Play, BarChart3, AlertCircle } from 'lucide-react';
import { runSensitivityExperiment } from '../api/client';

export function ExperimentsPage() {
  const [loading, setLoading] = useState(false);
  const [experimentData, setExperimentData] = useState(null);

  const handleRunExperiment = async () => {
    setLoading(true);
    try {
      const res = await runSensitivityExperiment({
        filter_params: {
          aoi: { geometry_type: 'bbox', bbox: { min_lon: 77.50, min_lat: 12.90, max_lon: 77.70, max_lat: 13.10 } },
          t1_start: '2025-01-04',
          t1_end: '2025-01-05',
          t2_start: '2025-01-16',
          t2_end: '2025-01-17',
          instrument_mode: 'IW',
          polarization: 'VV+VH',
          orbit_pass: 'DESCENDING',
          relative_orbit: 165
        },
        thresholds: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0],
        methods: ['Difference', 'Ratio', 'Log-Ratio'],
        polarizations: ['VV+VH', 'VV', 'VH']
      });
      setExperimentData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100 font-mono">EXPERIMENT & THRESHOLD SENSITIVITY DASHBOARD</h2>
          <p className="text-xs text-slate-400">Research Benchmarking Suite across Thresholds (1-6 dB), Methods, and Polarizations</p>
        </div>
        <button
          onClick={handleRunExperiment}
          disabled={loading}
          className="flex items-center space-x-2 bg-brand-blue hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium shadow transition text-xs border border-slate-500 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{loading ? 'RUNNING SENSITIVITY SUITE...' : 'RUN THRESHOLD SENSITIVITY TEST'}</span>
        </button>
      </div>

      {experimentData ? (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="bg-navy-800 border border-slate-700/80 rounded-lg p-4 font-mono text-xs flex justify-between items-center">
            <div>
              <span className="text-slate-400">EXPERIMENT ID:</span>{' '}
              <span className="text-emerald-400 font-bold">{experimentData.experiment_id}</span>
            </div>
            <div>
              <span className="text-slate-400">TIMESTAMP:</span>{' '}
              <span className="text-slate-200">{experimentData.timestamp}</span>
            </div>
            <div>
              <span className="text-slate-400">TEST RUNS:</span>{' '}
              <span className="text-amber-400 font-bold">{experimentData.metrics?.length} MATRIX CONFIGURATIONS</span>
            </div>
          </div>

          {/* Matrix Datagrid */}
          <div className="bg-navy-800 border border-slate-700/80 rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 font-mono">
                <thead className="bg-navy-900 border-b border-slate-700 text-[11px] text-slate-400 uppercase">
                  <tr>
                    <th className="p-3">Threshold (dB)</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Polarization</th>
                    <th className="p-3">Detected Area (ha)</th>
                    <th className="p-3">Polygons</th>
                    <th className="p-3">Avg Area (m²)</th>
                    <th className="p-3">Ground Truth Status</th>
                    <th className="p-3">Precision / Recall / F1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {experimentData.metrics?.slice(0, 18).map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/60 transition">
                      <td className="p-3 font-bold text-amber-400">{m.threshold_db} dB</td>
                      <td className="p-3">{m.method}</td>
                      <td className="p-3">{m.polarization}</td>
                      <td className="p-3 text-slate-100">{m.detected_area_ha} ha</td>
                      <td className="p-3 text-slate-300">{m.polygon_count}</td>
                      <td className="p-3 text-slate-400">{m.avg_polygon_area_m2}</td>
                      <td className="p-3">
                        <span className="text-[11px] text-slate-400 italic">{m.ground_truth_status}</span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        {m.f1_score !== null ? (
                          <span className="text-emerald-400">
                            P: {m.precision} | R: {m.recall} | F1: {m.f1_score}
                          </span>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-navy-800 border border-slate-700/80 rounded-xl p-12 text-center text-slate-400 space-y-3">
          <FlaskConical className="w-10 h-10 mx-auto text-slate-600" />
          <p>Click <strong>RUN THRESHOLD SENSITIVITY TEST</strong> to generate sensitivity metrics across 1.0 - 6.0 dB thresholds, change methods, and polarizations.</p>
        </div>
      )}
    </div>
  );
}

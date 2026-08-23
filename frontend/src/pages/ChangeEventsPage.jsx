import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, XCircle, Clock, Eye, Check } from 'lucide-react';
import { validateChangeEvent } from '../api/client';

export function ChangeEventsPage({ analysisResult }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [validationStatus, setValidationStatus] = useState('Validated');
  const [validationLabel, setValidationLabel] = useState('MAN-MADE');
  const [notes, setNotes] = useState('');
  const [savedValidations, setSavedValidations] = useState({});

  const events = analysisResult?.events || [];

  const handleSaveValidation = async (evtId) => {
    try {
      await validateChangeEvent({
        event_id: evtId,
        status: validationStatus,
        label: validationLabel,
        notes,
      });
      setSavedValidations((prev) => ({
        ...prev,
        [evtId]: { status: validationStatus, label: validationLabel },
      }));
      setSelectedEvent(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100 font-mono">CHANGE EVENT VALIDATION SYSTEM</h2>
          <p className="text-xs text-slate-400">Review, Inspect, and Validate Candidate Man-Made Change Vector Polygons</p>
        </div>
        <div className="bg-navy-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
          Total Candidates: <span className="text-emerald-400 font-bold">{events.length}</span>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-12 text-center text-slate-400 space-y-3">
          <ShieldAlert className="w-10 h-10 mx-auto text-slate-600" />
          <p>No change events available. Please run change detection from the Workspace page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Datagrid Table */}
          <div className="lg:col-span-8 bg-navy-800 border border-slate-700/80 rounded-lg overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-navy-900 border-b border-slate-700 text-[11px] text-slate-400 font-mono uppercase">
                  <tr>
                    <th className="p-3">Event ID</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Area (m²)</th>
                    <th className="p-3">Confidence</th>
                    <th className="p-3">Validation Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 font-mono">
                  {events.map((evt) => {
                    const currentVal = savedValidations[evt.event_id] || { status: evt.status, label: 'MAN-MADE' };
                    return (
                      <tr key={evt.event_id} className="hover:bg-slate-800/60 transition">
                        <td className="p-3 font-bold text-slate-100">{evt.event_id}</td>
                        <td className="p-3">
                          <span className="bg-slate-700/60 text-slate-200 px-2 py-0.5 rounded text-[10px]">
                            {evt.classification}
                          </span>
                        </td>
                        <td className="p-3 text-amber-400">{evt.area_m2}</td>
                        <td className="p-3 text-slate-300">{(evt.confidence * 100).toFixed(0)}%</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              currentVal.status === 'Validated'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : currentVal.status === 'Rejected'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            }`}
                          >
                            {currentVal.status} ({currentVal.label})
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedEvent(evt)}
                            className="bg-brand-blue hover:bg-slate-600 text-white px-2.5 py-1 rounded text-[11px] font-sans transition border border-slate-500"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Event Review Detail Drawer */}
          <div className="lg:col-span-4 bg-navy-800 border border-slate-700/80 rounded-lg p-5 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm font-mono border-b border-slate-700 pb-2">
              EVENT REVIEW & VALIDATION DRAWER
            </h3>

            {selectedEvent ? (
              <div className="space-y-4 text-xs">
                <div className="bg-navy-900 p-3 rounded border border-slate-700 space-y-1.5 font-mono">
                  <div className="text-slate-400 text-[10px]">EVENT ID</div>
                  <div className="font-bold text-slate-100 text-sm">{selectedEvent.event_id}</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>Area: <span className="text-amber-400">{selectedEvent.area_m2} m²</span></div>
                    <div>Hectares: <span className="text-amber-400">{selectedEvent.area_hectares} ha</span></div>
                    <div>Centroid: <span className="text-slate-300">[{selectedEvent.centroid.join(', ')}]</span></div>
                    <div>Change Score: <span className="text-slate-300">{selectedEvent.change_score_mean} dB</span></div>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Review Decision Status</label>
                  <select
                    value={validationStatus}
                    onChange={(e) => setValidationStatus(e.target.value)}
                    className="w-full bg-navy-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="Validated">Validated (Approved Detection)</option>
                    <option value="Rejected">Rejected (False Positive)</option>
                    <option value="Reviewing">Under Review</option>
                  </select>
                </div>

                {/* Validation Label */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Ground Truth Classification Tag</label>
                  <select
                    value={validationLabel}
                    onChange={(e) => setValidationLabel(e.target.value)}
                    className="w-full bg-navy-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="MAN-MADE">MAN-MADE (Structural/Urban)</option>
                    <option value="NATURAL">NATURAL (Water/Vegetation)</option>
                    <option value="UNCERTAIN">UNCERTAIN</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Validation Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add observations, ground truth context..."
                    className="w-full bg-navy-900 border border-slate-700 rounded p-2 text-slate-200"
                  />
                </div>

                <button
                  onClick={() => handleSaveValidation(selectedEvent.event_id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded shadow transition flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save User Validation Label</span>
                </button>
              </div>
            ) : (
              <div className="bg-navy-900 p-6 rounded border border-slate-700 text-center text-slate-400">
                Select an event from the table on the left to review metrics and submit ground truth validation labels.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

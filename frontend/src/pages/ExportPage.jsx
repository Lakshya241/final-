import React from 'react';
import { Download, FileCode, FileSpreadsheet, Archive, CheckCircle } from 'lucide-react';

export function ExportPage({ analysisResult }) {
  const events = analysisResult?.events || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-slate-700 pb-4 space-y-1">
        <h2 className="text-2xl font-bold text-slate-100 font-mono">GEOREFERENCED RESULTS & EXPORT WORKSTATION</h2>
        <p className="text-xs text-slate-400">Download Standard WGS84 (EPSG:4326) Vector Formats & Analysis Data</p>
      </div>

      {/* Summary Card */}
      <div className="bg-navy-800 border border-slate-700/80 rounded-xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-slate-100 font-mono">Analysis Dataset Ready</span>
          </div>
          <span className="text-xs bg-navy-900 border border-slate-700 px-3 py-1 rounded font-mono text-slate-300">
            {analysisResult?.analysis_id || 'ANALYSIS-READY'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-navy-900 p-3 rounded border border-slate-700 space-y-1">
            <div className="text-slate-400 text-[10px]">TOTAL DETECTED POLYGONS</div>
            <div className="text-xl font-bold text-slate-100">{events.length}</div>
          </div>

          <div className="bg-navy-900 p-3 rounded border border-slate-700 space-y-1">
            <div className="text-slate-400 text-[10px]">MANMADE CHANGE AREA</div>
            <div className="text-xl font-bold text-emerald-400">
              {analysisResult?.final_manmade_area_m2 || 0} m²
            </div>
            <div className="text-[10px] text-slate-400">{analysisResult?.final_manmade_area_hectares || 0} ha</div>
          </div>

          <div className="bg-navy-900 p-3 rounded border border-slate-700 space-y-1">
            <div className="text-slate-400 text-[10px]">NATURAL SUPPRESSED AREA</div>
            <div className="text-xl font-bold text-sky-400">
              {analysisResult?.natural_suppressed_area_m2 || 0} m²
            </div>
          </div>
        </div>
      </div>

      {/* Export Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GeoJSON */}
        <div className="bg-navy-800 border border-slate-700/80 rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-md hover:border-slate-500 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-brand-blue/20 text-brand-blue rounded-lg flex items-center justify-center border border-brand-blue/30">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">GeoJSON</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard RFC 7946 GeoJSON FeatureCollection with polygon geometries, centroids, area, and classification attributes.
            </p>
          </div>

          <a
            href="/api/export/geojson"
            download="sentry_sar_manmade_changes.geojson"
            className="w-full flex items-center justify-center space-x-2 bg-brand-blue hover:bg-slate-600 text-white font-medium py-2.5 rounded-lg shadow transition text-xs border border-slate-500"
          >
            <Download className="w-4 h-4" />
            <span>Export GeoJSON</span>
          </a>
        </div>

        {/* Shapefile */}
        <div className="bg-navy-800 border border-slate-700/80 rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-md hover:border-slate-500 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/30">
              <Archive className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">ESRI Shapefile (.zip)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete ESRI Shapefile archive containing .shp, .shx, .dbf, .prj (EPSG:4326), and metadata summary.
            </p>
          </div>

          <a
            href="/api/export/shapefile"
            download="sentry_sar_manmade_changes.zip"
            className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg shadow transition text-xs border border-emerald-400"
          >
            <Download className="w-4 h-4" />
            <span>Export Shapefile (.zip)</span>
          </a>
        </div>

        {/* CSV */}
        <div className="bg-navy-800 border border-slate-700/80 rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-md hover:border-slate-500 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center border border-amber-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">CSV Table</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tabular spreadsheet containing event IDs, latitude/longitude centroids, bounding boxes, area m², and validation status.
            </p>
          </div>

          <a
            href="/api/export/csv"
            download="sentry_sar_manmade_changes.csv"
            className="w-full flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white font-medium py-2.5 rounded-lg shadow transition text-xs border border-amber-400"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Table</span>
          </a>
        </div>
      </div>
    </div>
  );
}

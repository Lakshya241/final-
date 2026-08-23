# SENTRY-SAR REST API Specification

## Endpoints Summary

### 1. Acquisitions Router `/api/acquisitions`
- `POST /api/acquisitions/search`
  - **Body**: `S1FilterParams` (AOI, T1 date range, T2 date range, orbit pass, relative orbit)
  - **Returns**: `AcquisitionSearchResponse` containing metadata for T1 and T2 image collections and compatibility analysis.

### 2. Analysis Router `/api/analysis`
- `POST /api/analysis/run`
  - **Body**: `AnalysisRequest` (filter params, change method, threshold dB, min area m², natural suppression toggle)
  - **Returns**: `AnalysisResultResponse` with changed areas (m² and ha), tile URLs for visualization, and vectorized `ChangeEvent` list.
- `GET /api/analysis/latest`
  - **Returns**: Most recent analysis result.

### 3. Validation Router `/api/validation`
- `POST /api/validation/validate`
  - **Body**: `ValidationRequest` (`event_id`, `status`: Validated/Rejected/Reviewing, `label`: MAN-MADE/NATURAL/UNCERTAIN, `notes`)
  - **Returns**: Stored validation entry.
- `GET /api/validation/all`
  - **Returns**: All user validated change labels.

### 4. Experiments Router `/api/experiments`
- `POST /api/experiments/run`
  - **Body**: `SensitivityTestRequest` (thresholds [1-6 dB], methods, polarizations)
  - **Returns**: `ExperimentResponse` with metrics matrix.
- `GET /api/experiments/{id}`
  - **Returns**: Previous experiment metrics by ID.

### 5. Export Router `/api/export`
- `GET /api/export/geojson`: Downloads `sentry_sar_manmade_changes.geojson`
- `GET /api/export/csv`: Downloads `sentry_sar_manmade_changes.csv`
- `GET /api/export/shapefile`: Downloads zipped ESRI Shapefile archive `sentry_sar_manmade_changes.zip`

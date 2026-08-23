# SENTRY-SAR Project Overview

## 1. Project Summary

SENTRY-SAR is a geospatial analytics platform for detecting probable man-made changes from Sentinel-1 Synthetic Aperture Radar (SAR) imagery using Google Earth Engine (GEE). The system compares two SAR acquisitions over the same area and highlights likely structural or human-made changes while filtering out common natural changes such as water variation, vegetation shifts, and seasonal effects.

The project is built to support:
- remote sensing analysis,
- land-use and infrastructure monitoring,
- change detection for construction or disruption events,
- geospatial visualization and export,
- experiment-based analysis of SAR thresholds and sensitivities.

---

## 2. What the Project Does

At a high level, the platform does the following:

1. Searches for Sentinel-1 GRD image pairs from Google Earth Engine.
2. Filters the images by area of interest, date range, polarizations, orbit direction, and acquisition geometry.
3. Compares the selected images using SAR change metrics such as difference, ratio, and log-ratio methods.
4. Identifies change zones that may indicate man-made activity.
5. Applies natural change suppression to reduce false alarms caused by water, vegetation, and seasonal effects.
6. Converts detected change areas into vector polygons.
7. Displays the results in a web dashboard with comparison, map, event, and 3D views.
8. Lets users validate or classify events and export geospatial outputs.

The system is designed around a core goal:

> Maximize reliable man-made change detection while minimizing false alarms.

---

## 3. Main Features

### 3.1 Sentinel-1 Data Integration
- Uses Google Earth Engine dataset: COPERNICUS/S1_GRD
- Works with Sentinel-1 SAR imagery in interferometric wide (IW) mode
- Supports VV and VH band analysis, including combined VV+VH workflows
- Filters by AOI, date window, orbit pass, and relative orbit number

### 3.2 Change Detection Engine
The backend calculates backscatter changes between two dates using SAR-based change metrics, including:
- absolute difference,
- ratio-based change detection,
- log-ratio calculations,
- combined change scoring across VV and VH channels.

This helps identify unusual backscatter behavior associated with built structures, construction, or other human-caused change.

### 3.3 Natural Change Suppression
A major feature of the system is that it tries to distinguish real structural changes from natural variability.

It reduces false positives caused by:
- water body / flood extent variation,
- vegetation canopy dynamics,
- cross-polarization behavior from natural surfaces,
- seasonal effects and local scattering changes.

This is essential because SAR data can be highly sensitive to environmental conditions, even when no man-made change occurred.

### 3.4 Polygonization and Spatial Post-Processing
Once a change mask is created, the system:
- removes isolated noise,
- applies connected component filtering,
- enforces minimum area thresholds,
- converts change masks into vector polygons,
- exports them as GeoJSON, Shapefile, and CSV.

This makes the results usable in GIS workflows and external analysis systems.

### 3.5 Web Dashboard and GIS Interface
The frontend provides a modern dark-themed geospatial workstation with multiple views:
- Workspace
- Image comparison
- Change map
- Change events
- 3D view
- Export tools
- Experiments
- Settings

This allows users to inspect imagery, compare before/after scenes, review detected events, and explore spatial results without writing code.

### 3.6 Event Review and Validation
The validation module supports:
- storing event validation status,
- categorizing events as Validated, Rejected, or Reviewing,
- labeling detected events as MAN-MADE, NATURAL, or UNCERTAIN,
- adding notes for analysis review.

This is useful for quality review and supervised model evaluation.

### 3.7 Experimentation Framework
The system includes a sensitivity-analysis workflow that evaluates detection under multiple thresholds and settings, including:
- threshold sweeps from 1 to 6 dB,
- method comparisons,
- polarization comparisons,
- metrics such as change area, polygon count, suppression ratio, and precision/recall estimates.

This helps researchers tune the system for different use cases and performance trade-offs.

### 3.8 Export Options
Users can export the results in several formats:
- GeoJSON
- CSV
- Shapefile (ZIP)

This makes the project suitable for downstream GIS, reporting, and remote sensing workflows.

---

## 4. User Workflow

A typical processing flow looks like this:

1. Open the application.
2. Define the area of interest and search window.
3. Select the relevant Sentinel-1 image pair.
4. Choose detection method and threshold settings.
5. Run the SAR analysis.
6. Review the detected change areas.
7. Inspect natural suppression and spatial filtering results.
8. Validate or label the events.
9. Export the results for GIS or reporting use.

---

## 5. Architecture Overview

The project is split into a backend and frontend:

### Backend
- Built with Python and FastAPI
- Handles data access, SAR analysis, validation, export, and health checks
- Connects to Google Earth Engine for image retrieval and analysis
- Exposes REST APIs for acquisitions, analysis, validation, experiments, export, and tiles

### Frontend
- Built with React + Vite
- Uses Tailwind CSS for the UI
- Provides map and GIS-style interaction pages
- Displays analysis results and user workflows visually

### Main Backend Modules
- app/main.py — app startup and API registration
- app/api/ — REST endpoints for acquisitions, analysis, validation, experiments, export, and tiles
- app/core/config.py — configuration
- app/core/gee_init.py — Earth Engine initialization
- app/change_detection/ — SAR algorithms and natural suppression logic
- app/geospatial/ — polygon and export logic
- app/validation/ — validation service
- app/experiments/ — experiment workflow

---

## 6. Example API Capabilities

The backend exposes endpoints for:
- searching for compatible image acquisitions,
- running SAR change analysis,
- fetching latest analysis results,
- validating events,
- running sensitivity experiments,
- exporting change results.

This gives the platform a clean separation between the geospatial engine and the web UI.

---

## 7. Tech Stack

### Backend
- Python
- FastAPI
- Google Earth Engine Python API
- Pydantic-based request/response models

### Frontend
- React
- Vite
- JavaScript / JSX
- Tailwind CSS

### Geospatial / Remote Sensing
- Sentinel-1 GRD imagery
- SAR backscatter analysis
- GIS-like polygon processing

---

## 8. Project Structure

```text
project/
├── README.md
├── PROJECT_OVERVIEW.md
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── change_detection/
│   │   ├── core/
│   │   ├── experiments/
│   │   ├── gee/
│   │   ├── geospatial/
│   │   ├── models/
│   │   ├── validation/
│   │   └── main.py
│   └── tests/
├── docs/
│   ├── api.md
│   ├── architecture.md
│   ├── dataset.md
│   ├── experiments.md
│   ├── methodology.md
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── ...
```

---

## 9. Use Cases

This project is useful for:
- monitoring construction or urban expansion,
- identifying infrastructure changes,
- evaluating disaster or flood-related changes,
- studying land-cover transitions,
- performing research on SAR-based change detection,
- generating geospatial outputs for analysts and stakeholders.

---

## 10. Strengths of the Project

- Strong focus on real SAR-based environmental change detection
- Practical filtering and compatibility logic for reliable image pairing
- Built-in false-positive reduction through natural suppression techniques
- Good mix of backend analytics and frontend visualization
- Support for exportable GIS outputs
- Research-friendly experiment configuration

---

## 11. Considerations / Notes

While the system is quite capable, in practice the quality of results depends on:
- correct image pairing,
- suitable area selection,
- threshold tuning,
- SAR interpretation knowledge,
- environmental conditions of the observed region.

SAR-based change detection is powerful, but it also requires careful validation because some natural changes can mimic human-made change patterns.

---

## 12. Conclusion

SENTRY-SAR is a geospatial change detection platform that applies SAR image analysis to find probable man-made changes while suppressing false positives from natural environmental variation. It combines Google Earth Engine data, a FastAPI backend, and a React frontend into a tool for analysis, validation, visualization, and export.

In short, the project turns Sentinel-1 SAR imagery into an operational workflow for detecting, reviewing, and exporting meaningful change events.

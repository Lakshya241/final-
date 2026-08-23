# SENTRY-SAR Architecture & System Specification

## Overview
SENTRY-SAR is a software-based geospatial change detection platform built around Sentinel-1 Synthetic Aperture Radar (SAR) Ground Range Detected (GRD) imagery (`COPERNICUS/S1_GRD`) available through Google Earth Engine (GEE).

The core objective is to detect significant backscatter changes between two compatible Sentinel-1 SAR acquisitions (T1 & T2) and distinguish **PROBABLE MAN-MADE CHANGES** from **NATURAL CHANGES** (water-body variation, flood extent, vegetation/forest dynamics, seasonal changes).

## System Architecture

```
                                  +---------------------------------------+
                                  |         SENTRY-SAR WEB CLIENT         |
                                  |     (Vite + React 18 + Tailwind)      |
                                  +------------------+--------------------+
                                                     |
                                            REST API (FastAPI)
                                                     |
                                                     v
+----------------------------------------------------+----------------------------------------------------+
|                                            FASTAPI BACKEND                                             |
|                                                                                                         |
|  +--------------------+   +-----------------------+   +------------------------+   +-----------------+  |
|  | SentinelService    |   | ChangeDetectionEngine |   | NaturalSuppression     |   | PolygonService  |  |
|  | Query S1_GRD metadata| | Difference, Ratio,    |   | Water, Vegetation,     |   | Connected comp, |  |
|  | & match T1/T2 pairs|   | Log-Ratio (VV/VH)     |   | Seasonal filtering     |   | GeoJSON/Shape   |  |
|  +---------+----------+   +-----------+-----------+   +-----------+------------+   +--------+--------+  |
+------------|--------------------------|---------------------------|-------------------------|-----------+
             |                          |                           |                         |
             v                          v                           v                         v
+---------------------------------------------------------------------------------------------------------+
|                                        GOOGLE EARTH ENGINE API                                          |
|                                  Project: project-086ef6ed-baf1-4362-a86                                |
|                                       Dataset: COPERNICUS/S1_GRD                                       |
+---------------------------------------------------------------------------------------------------------+
```

## Key Components

### 1. Acquisition Filtering & Compatibility Engine
Filters Sentinel-1 GRD imagery based on:
- AOI bounding box or GeoJSON geometry
- Date range for T1 and T2
- Instrument mode (`IW`)
- Polarizations (`VV`, `VH`, `VV+VH`)
- Orbit pass (`ASCENDING` / `DESCENDING`)
- Relative orbit number (ensuring identical sensor-target geometry)

### 2. Modular SAR Change Detection Engine
Calculates backscatter difference or ratio scores:
- **Absolute Difference**: $|VV_{T2} - VV_{T1}|$ and $|VH_{T2} - VH_{T1}|$
- **Combined Change Score**: $\frac{|VV_{T2} - VV_{T1}| + |VH_{T2} - VH_{T1}|}{2}$
- **Ratio & Log-Ratio Methods**: Linear power intensity ratios converted to log decibel scale.

### 3. Natural Change Suppression Layer
Prevents false alarms caused by natural surface dynamics:
- **Water Body / Flood Extent Mask**: Open water specular reflection produces very low backscatter ($VV < -18\text{ dB}$, $VH < -25\text{ dB}$).
- **Vegetation / Canopy Volume Scattering Mask**: Vegetation changes present dominant cross-polarization ($VH$) variation relative to co-polarization ($VV$) variation ($\Delta VH > 1.3 \cdot \Delta VV$).

### 4. Polygon Vectorization & Spatial Post-Processing
- **Connected Component Filtering**: `ee.Image.connectedPixelCount(100, True)` removes isolated speckle noise below minimum area thresholds (e.g. $500\text{ m}^2$).
- **Vector Conversion**: `ee.Image.reduceToVectors` converts change masks to vector polygons.
- **Georeferenced Output**: WGS84 (EPSG:4326) GeoJSON, Shapefile (zip archive), and CSV formats.

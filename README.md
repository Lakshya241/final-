# SENTRY-SAR

> **Man-Made Change Detection from Sentinel-1 SAR**

SENTRY-SAR is a software-based geospatial change detection platform built around Sentinel-1 Synthetic Aperture Radar (SAR) Ground Range Detected (GRD) imagery available through Google Earth Engine (`COPERNICUS/S1_GRD`).

The primary optimization objective is:
**MAXIMIZE RELIABLE MAN-MADE CHANGE DETECTION WHILE MINIMIZING FALSE ALARMS.**

---

## Key Features
- **Real Sentinel-1 GRD Data**: Direct Google Earth Engine integration (`COPERNICUS/S1_GRD`) using project `project-086ef6ed-baf1-4362-a86`.
- **Viewing Geometry Compatibility**: Automatic filtering by AOI, date range, `IW` mode, polarizations (`VV`, `VH`), orbit pass (`ASCENDING`/`DESCENDING`), and relative orbit number.
- **Modular SAR Algorithms**: Support for difference, ratio, and log-ratio methods across `VV`, `VH`, and `VV+VH` combinations.
- **Natural Change Suppression**: Distinguishes specular reflection changes on water bodies and cross-polarization volume scattering dynamics in vegetation from structural man-made changes.
- **Spatial Vectorization**: Connected component filtering and minimum area ($m^2$) thresholding converted into real WGS84 GeoJSON, Shapefile (zip), and CSV exports.
- **3D Geospatial Workstation**: Modern professional dark GIS workstation interface with 3D terrain elevation and extruded change polygons.
- **Experimentation Framework**: Sensitivity matrix (1-6 dB thresholds) evaluating detected area, polygon counts, natural suppression ratios, and ground truth precision/recall metrics.

---

## Installation & Setup

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 18+ and npm

### Backend Setup
From the project root, run:

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

The Laravel API runs at `http://127.0.0.1:8000`. The frontend expects the API at
`http://127.0.0.1:8000/api`.

On Windows PowerShell, use this instead of `copy` if needed:

```powershell
Copy-Item .env.example .env
```

### Frontend Setup
Open a second terminal at the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Vite prints the frontend URL in the terminal, normally
`http://127.0.0.1:5173` (or the next available port).

### Run Tests
Backend tests:

```bash
cd backend
php artisan test
```

Frontend production build:

```bash
cd frontend
npm run build
```

Start both servers before opening the storefront or admin pages. Available routes
include `/`, `/cart`, `/checkout`, `/admin`, `/admin/products`, and `/admin/orders`.

---

## Documentation
- [Deployment Guide](docs/deployment.md)
- [Architecture & System Design](docs/architecture.md)
- [SAR Methodology & Physics](docs/methodology.md)
- [REST API Reference](docs/api.md)
- [Experiments & Sensitivity Protocols](docs/experiments.md)
- [Sentinel-1 Dataset Specifications](docs/dataset.md)

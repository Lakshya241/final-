# SENTRY-SAR Change Detection Methodology

## 1. Sentinel-1 SAR Physics & Preprocessing
Sentinel-1 SAR operates in C-band (5.405 GHz). Ground Range Detected (GRD) products in Google Earth Engine (`COPERNICUS/S1_GRD`) undergo standard thermal noise removal, radiometric calibration to $\sigma^0$ (in decibels, dB), and terrain correction using SRTM 30m / DEMs.

### Viewing Geometry Constraints
To ensure accurate temporal change detection:
- **Same Orbit Pass**: Ascending and Descending passes look at targets from opposite directions, creating severe layover/shadow discrepancies. SENTRY-SAR strictly matches orbit pass.
- **Same Relative Orbit**: Ensures identical incidence angles ($\theta_i$) and baseline geometries across acquisitions T1 and T2.

## 2. Change Detection Formulations

### Co-polarization (VV) & Cross-polarization (VH) Differences
$$\Delta \text{VV} = | \text{VV}_{T2} - \text{VV}_{T1} |$$
$$\Delta \text{VH} = | \text{VH}_{T2} - \text{VH}_{T1} |$$
$$\text{Change Score} = \frac{\Delta \text{VV} + \Delta \text{VH}}{2}$$

### Log-Ratio Method
For radar intensity images, speckle noise is multiplicative. Taking the ratio in linear scale is equivalent to subtraction in log (dB) scale:
$$\text{Log-Ratio} = 10 \cdot \log_{10} \left( \frac{\sigma^0_{T2}}{\sigma^0_{T1}} \right) = \text{dB}_{T2} - \text{dB}_{T1}$$

## 3. Natural Change Suppression

### A. Water Body & Flood Suppression
Smooth water surfaces reflect radar signals away from the sensor (specular reflection), yielding very low backscatter:
$$\text{Water Mask} = (\text{VV} < -18\text{ dB}) \lor (\text{VH} < -25\text{ dB})$$
When backscatter drops or rises significantly within open water bounds, it is tagged as **Water Body / Flood Variation** and suppressed from man-made alerts.

### B. Vegetation & Canopy Volume Scattering
Canopies cause depolarizing volume scattering, which primarily impacts cross-polarization ($VH$). Urban structures cause double-bounce reflections, impacting co-polarization ($VV$) strongly.
$$\text{Vegetation Mask} = \Delta \text{VH} > 1.3 \cdot \Delta \text{VV}$$

## 4. Man-Made Feature Classification
Man-made structures are classified based on backscatter gain, polarimetric ratio, and spatial compactness:
- **Building**: High VV gain ($\Delta \text{VV} > 5.0\text{ dB}$), double-bounce corner reflection.
- **Road / Paved Surface**: Moderate backscatter drop, linear structure.
- **Construction / Earthworks**: High VH variance + moderate VV gain.
- **Land Disturbance**: Larger contiguous area ($> 10,000\text{ m}^2$) with backscatter variance.

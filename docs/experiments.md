# SENTRY-SAR Experiments & Sensitivity Protocol

## Research Objective
Evaluate threshold sensitivity, algorithm performance (Difference vs Ratio vs Log-Ratio), polarimetric channel effectiveness (VV vs VH vs VV+VH), and natural change suppression impact.

## Test Matrix
- **Threshold Range**: 1.0 dB, 2.0 dB, 3.0 dB, 4.0 dB, 5.0 dB, 6.0 dB
- **Change Algorithms**: Difference, Ratio, Log-Ratio
- **Polarizations**: VV, VH, VV+VH

## Metrics Evaluated
1. **Detected Area**: Total detected area in square meters ($m^2$) and hectares ($ha$).
2. **Polygon Count**: Total number of contiguous candidate change polygons.
3. **Average Polygon Area**: Mean area per polygon.
4. **Natural Suppression Ratio**: Percentage of raw change area flagged as natural (water/vegetation).
5. **Ground Truth Validation Metrics**: Precision, Recall, F1 Score, and Intersection over Union (IoU) evaluated against manual user validation labels (`MAN-MADE`, `NATURAL`, `UNCERTAIN`). When unlabelled, displays `"Ground truth unavailable"`.

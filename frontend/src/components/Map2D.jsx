import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export function Map2D({ tileUrls, events, layerVisibility = {}, onSelectEvent, aoiBbox }) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayersRef = useRef({});
  const geojsonLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Destroy existing Leaflet instance if present
    if (leafletMapRef.current) {
      try {
        leafletMapRef.current.remove();
      } catch (e) {}
      leafletMapRef.current = null;
    }

    if (mapRef.current._leaflet_id) {
      delete mapRef.current._leaflet_id;
    }

    try {
      const map = L.map(mapRef.current, {
        center: [13.00, 77.60],
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Matter basemap tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO &copy; Google Earth Engine',
      }).addTo(map);

      leafletMapRef.current = map;
    } catch (err) {
      console.error("Leaflet map initialization error:", err);
    }

    return () => {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update GEE Tile Layers
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Clear existing tile layers
    Object.keys(tileLayersRef.current).forEach((key) => {
      if (tileLayersRef.current[key]) {
        try {
          map.removeLayer(tileLayersRef.current[key]);
        } catch (e) {}
      }
    });
    tileLayersRef.current = {};

    if (!tileUrls) return;

    const layerKeys = ['t1', 't2', 'raw_change', 'thresholded', 'natural_suppression', 'manmade'];
    layerKeys.forEach((key) => {
      const url = tileUrls[key];
      const isVisible = layerVisibility ? (layerVisibility[key] ?? true) : true;

      if (url && isVisible) {
        try {
          const layer = L.tileLayer(url, { opacity: key === 'manmade' ? 0.85 : 0.65 });
          layer.addTo(map);
          tileLayersRef.current[key] = layer;
        } catch (e) {
          console.error(`Error adding tile layer ${key}:`, e);
        }
      }
    });
  }, [tileUrls, layerVisibility]);

  // Update Vector Polygons
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (geojsonLayerRef.current) {
      try {
        map.removeLayer(geojsonLayerRef.current);
      } catch (e) {}
      geojsonLayerRef.current = null;
    }

    const showManmade = layerVisibility ? (layerVisibility.manmade ?? true) : true;
    if (!events || events.length === 0 || !showManmade) return;

    try {
      const features = events.map((evt) => ({
        type: 'Feature',
        geometry: evt.geometry,
        properties: evt,
      }));

      const geoJsonData = {
        type: 'FeatureCollection',
        features,
      };

      const geoLayer = L.geoJSON(geoJsonData, {
        style: (feature) => {
          const status = feature.properties ? feature.properties.status : 'New';
          let color = '#3B8256'; // Default validated green
          if (status === 'New') color = '#E55B3C'; // Change red/orange
          if (status === 'Rejected') color = '#64748B'; // Muted slate

          return {
            color: color,
            weight: 2,
            fillColor: color,
            fillOpacity: 0.35,
          };
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties || {};
          layer.bindTooltip(
            `<strong>${props.event_id || 'EVT'}</strong><br/>Class: ${props.classification || 'Unknown'}<br/>Area: ${props.area_m2 || 0} m²<br/>Conf: ${((props.confidence || 0.5) * 100).toFixed(0)}%`,
            { sticky: true, className: 'leaflet-custom-tooltip' }
          );

          layer.on('click', () => {
            if (onSelectEvent) onSelectEvent(props);
          });
        },
      }).addTo(map);

      geojsonLayerRef.current = geoLayer;

      // Fit bounds safely
      const bounds = geoLayer.getBounds();
      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    } catch (e) {
      console.error("Error updating Leaflet vector polygons:", e);
    }
  }, [events, layerVisibility]);

  return (
    <div className="relative w-full h-full min-h-[450px] bg-navy-900 rounded-lg overflow-hidden border border-slate-700/60 shadow-inner">
      <div ref={mapRef} className="w-full h-full z-0 min-h-[450px]" />
    </div>
  );
}

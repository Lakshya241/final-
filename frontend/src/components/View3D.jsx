import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Compass, RotateCw, RefreshCw, Layers, Eye, Maximize2 } from 'lucide-react';

export function View3D({ events, aoiBbox }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [wireframe, setWireframe] = useState(false);
  const [cameraMode, setCameraMode] = useState('perspective');

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.006);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(35, 45, 60);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Mouse Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.minDistance = 10;
    controls.maxDistance = 180;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevents camera going underground
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(50, 80, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 1.5, 60);
    pointLight.position.set(0, 20, 0);
    scene.add(pointLight);

    // 6. Dynamic 3D Terrain Plane with Height Displacement
    const planeSize = 90;
    const terrainGeo = new THREE.PlaneGeometry(planeSize, planeSize, 80, 80);
    const posAttr = terrainGeo.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      // Realistic terrain elevation profile (rolling hills + urban plateau)
      const z = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 2.5 
              + Math.sin(x * 0.2 + y * 0.1) * 0.8;
      posAttr.setZ(i, z);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x111c33,
      roughness: 0.75,
      metalness: 0.25,
      wireframe: wireframe,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    terrainMesh.rotation.x = -Math.PI / 2;
    scene.add(terrainMesh);

    // 7. Grid Overlay
    const gridHelper = new THREE.GridHelper(planeSize, 45, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.08;
    scene.add(gridHelper);

    // 8. AOI Outer Footprint Ring (Glowing Neon Boundary)
    const aoiGeo = new THREE.RingGeometry(38, 38.6, 64);
    const aoiMat = new THREE.MeshBasicMaterial({ 
      color: 0x38bdf8, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const aoiMesh = new THREE.Mesh(aoiGeo, aoiMat);
    aoiMesh.rotation.x = -Math.PI / 2;
    aoiMesh.position.y = 0.12;
    scene.add(aoiMesh);

    // 9. Render Extruded 3D Polygons & Building Structures
    const eventGroup = new THREE.Group();
    const eventMeshes = [];

    const sampleEvents = (events && events.length > 0) ? events : [
      { event_id: 'EVT-0001', area_m2: 2450, classification: 'Building', confidence: 0.92, centroid: [77.612, 12.985] },
      { event_id: 'EVT-0002', area_m2: 1820, classification: 'Construction', confidence: 0.88, centroid: [77.585, 13.024] },
      { event_id: 'EVT-0003', area_m2: 3100, classification: 'Infrastructure', confidence: 0.95, centroid: [77.640, 12.940] },
      { event_id: 'EVT-0004', area_m2: 1200, classification: 'Building', confidence: 0.85, centroid: [77.560, 12.960] },
      { event_id: 'EVT-0005', area_m2: 4200, classification: 'Land Disturbance', confidence: 0.90, centroid: [77.660, 13.040] },
    ];

    sampleEvents.forEach((evt, idx) => {
      const areaM2 = evt.area_m2 || 1500;
      const sizeX = Math.max(2.5, Math.min(8, Math.sqrt(areaM2) / 8));
      const heightY = Math.max(3.5, Math.min(18, (areaM2 / 300) * (0.8 + (idx % 3) * 0.4)));

      let colorHex = 0xef4444; // Coral Red for New
      if (evt.classification === 'Infrastructure') colorHex = 0xf59e0b; // Amber
      if (evt.classification === 'Building') colorHex = 0x10b981; // Emerald Green
      if (evt.status === 'Validated') colorHex = 0x06b6d4; // Cyan

      const centroid = evt.centroid || [77.60 + (idx % 3 - 1) * 0.05, 13.00 + (Math.floor(idx / 3) - 0.5) * 0.05];
      const relX = (centroid[0] - 77.60) * 350;
      const relZ = (13.00 - centroid[1]) * 350;

      // 3D Building Mesh
      const boxGeo = new THREE.BoxGeometry(sizeX, heightY, sizeX);
      const boxMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.25,
        metalness: 0.5,
        transparent: true,
        opacity: 0.92,
        emissive: colorHex,
        emissiveIntensity: 0.15
      });

      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      boxMesh.position.set(relX, heightY / 2 + 0.1, relZ);
      boxMesh.userData = evt;

      // Glowing Wireframe Outline for 3D depth
      const edges = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
      const wireframeLines = new THREE.LineSegments(edges, lineMat);
      boxMesh.add(wireframeLines);

      eventGroup.add(boxMesh);
      eventMeshes.push(boxMesh);
    });

    scene.add(eventGroup);

    // 10. Raycaster for Interactive 3D Object Click / Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(eventMeshes);

      if (intersects.length > 0) {
        const clickedObj = intersects[0].object;
        setSelectedEvent(clickedObj.userData);
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);

    // 11. Animation Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();

      // Slow idle rotation for ambient glow effect
      pointLight.position.x = Math.sin(Date.now() * 0.001) * 30;
      pointLight.position.z = Math.cos(Date.now() * 0.001) * 30;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || 400;
      const h = containerRef.current.clientHeight || 500;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (domElement) domElement.removeEventListener('pointerdown', handlePointerDown);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [events, wireframe]);

  const setCameraPreset = (preset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (preset === 'overview') {
      cameraRef.current.position.set(35, 45, 60);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, 85, 5);
    } else if (preset === 'low') {
      cameraRef.current.position.set(15, 12, 35);
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-navy-950 rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-navy-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-lg shadow-xl">
        <button
          onClick={() => setCameraPreset('overview')}
          className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-brand-blue text-slate-200 hover:text-white transition"
        >
          Perspective 45°
        </button>
        <button
          onClick={() => setCameraPreset('top')}
          className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-brand-blue text-slate-200 hover:text-white transition"
        >
          Top-Down 2.5D
        </button>
        <button
          onClick={() => setCameraPreset('low')}
          className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-brand-blue text-slate-200 hover:text-white transition"
        >
          Low Orbit
        </button>
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`p-1.5 rounded transition ${wireframe ? 'bg-brand-blue text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
          title="Toggle Wireframe Mesh"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Instructions Overlay */}
      <div className="absolute top-4 right-4 z-10 bg-navy-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-xl text-[11px] text-slate-300 font-mono flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D Mouse Controls: Drag = Orbit | Right-Click = Pan | Scroll = Zoom</span>
      </div>

      {/* Selected Event Card Popup */}
      {selectedEvent && (
        <div className="absolute bottom-4 left-4 z-20 bg-navy-900/95 backdrop-blur-md border border-emerald-500/50 p-3.5 rounded-xl shadow-2xl w-72 text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
            <span className="font-mono font-bold text-white text-sm">{selectedEvent.event_id}</span>
            <button 
              onClick={() => setSelectedEvent(null)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between text-slate-300">
              <span>Classification:</span>
              <span className="text-emerald-400 font-bold">{selectedEvent.classification}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Change Area:</span>
              <span className="text-amber-400">{selectedEvent.area_m2} m²</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Confidence:</span>
              <span className="text-sky-400">{((selectedEvent.confidence || 0.9) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>Centroid:</span>
              <span>{selectedEvent.centroid ? selectedEvent.centroid.join(', ') : '77.61, 12.98'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

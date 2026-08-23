import React, { useRef, Component, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Gem } from 'lucide-react';

/* ── Error Boundary ─────────────────────────────────────────────────────── */
class ThreeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('3D Canvas error, showing fallback:', err.message);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

/* ── Gold Torus (Ring) ──────────────────────────────────────────────────── */
function GoldRing({ position = [0, 0, 0], scale = 1, speed = 0.5 }) {
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.y = t * speed;
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={ringRef} position={position} scale={scale}>
        {/* Main band */}
        <mesh castShadow>
          <torusGeometry args={[1.0, 0.14, 32, 100]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.95}
            roughness={0.12}
            envMapIntensity={1.5}
          />
        </mesh>
        {/* Inner accent ring */}
        <mesh rotation={[Math.PI / 5, 0, 0]}>
          <torusGeometry args={[1.02, 0.04, 16, 80]} />
          <meshStandardMaterial
            color="#E8C96A"
            metalness={0.98}
            roughness={0.08}
          />
        </mesh>
        {/* Gem prong setting */}
        <mesh position={[0, 1.06, 0]}>
          <cylinderGeometry args={[0.18, 0.1, 0.22, 8]} />
          <meshStandardMaterial color="#C9A84C" metalness={0.92} roughness={0.15} />
        </mesh>
        {/* Solitaire diamond */}
        <mesh position={[0, 1.26, 0]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.32, 1]} />
          <meshStandardMaterial
            color="#FFFFFF"
            metalness={0.1}
            roughness={0.0}
            transparent
            opacity={0.92}
            envMapIntensity={2.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Floating Gem (Emerald-cut) ─────────────────────────────────────────── */
function FloatingGem({ position, scale = 0.4, color = '#5ce65c', delay = 0 }) {
  const gemRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + delay;
    if (gemRef.current) {
      gemRef.current.rotation.y = t * 0.7;
      gemRef.current.rotation.x = Math.sin(t * 0.5) * 0.3;
      gemRef.current.position.y = position[1] + Math.sin(t * 0.8 + delay) * 0.15;
    }
  });

  return (
    <mesh ref={gemRef} position={position} scale={scale} castShadow>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        metalness={0.05}
        roughness={0.02}
        transparent
        opacity={0.88}
        envMapIntensity={3}
      />
    </mesh>
  );
}

/* ── Orbiting Particles ─────────────────────────────────────────────────── */
function OrbitRing({ radius = 2.4, count = 12, color = '#D4AF37' }) {
  const groupRef = useRef();
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2,
        size: 0.03 + Math.random() * 0.04,
        offset: Math.random() * 0.3,
      })),
    [count]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(p.angle) * radius,
            Math.sin(p.angle * 0.5) * 0.2,
            Math.sin(p.angle) * radius,
          ]}
        >
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Background Decorative Sphere ───────────────────────────────────────── */
function BackgroundSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08;
      meshRef.current.rotation.z = t * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0.5, 0, -1]} scale={1.6}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#F5E199"
        metalness={0.3}
        roughness={0.8}
        transparent
        opacity={0.06}
        wireframe
      />
    </mesh>
  );
}

/* ── Mouse-Reactive Scene Wrapper ───────────────────────────────────────── */
function Scene() {
  const sceneRef = useRef();

  useFrame((state) => {
    if (sceneRef.current) {
      const targetX = state.pointer.x * 0.3;
      const targetY = state.pointer.y * 0.2;
      sceneRef.current.rotation.y += (targetX - sceneRef.current.rotation.y) * 0.04;
      sceneRef.current.rotation.x += (-targetY - sceneRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={sceneRef}>
      {/* Main hero ring */}
      <GoldRing position={[0, 0, 0]} scale={1} speed={0.45} />

      {/* Floating accent gems */}
      <FloatingGem position={[-2.2, 0.6, -0.5]} scale={0.28} color="#2adb2a" delay={0} />
      <FloatingGem position={[2.0, -0.5, -0.3]} scale={0.22} color="#6ABEFF" delay={1.5} />
      <FloatingGem position={[-1.5, -1.1, 0.4]} scale={0.18} color="#D4909A" delay={3} />
      <FloatingGem position={[1.6, 1.1, 0.2]} scale={0.20} color="#E8C96A" delay={2} />

      {/* Orbiting particle ring */}
      <OrbitRing radius={2.2} count={14} color="#C9A84C" />

      {/* Background wireframe sphere */}
      <BackgroundSphere />

      {/* Sparkle cloud */}
      <Sparkles
        count={55}
        scale={6}
        size={1.8}
        speed={0.4}
        opacity={0.55}
        color="#D4AF37"
      />

      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 8, 4]} intensity={2.2} color="#FFF5E0" castShadow />
      <pointLight position={[-5, -3, -2]} intensity={1.4} color="#C9A84C" />
      <pointLight position={[0, 5, 3]} intensity={0.8} color="#FFFFFF" />
      <spotLight
        position={[0, 6, 2]}
        intensity={1.5}
        angle={0.5}
        penumbra={0.8}
        color="#FFF8E7"
      />
    </group>
  );
}

/* ── CSS Fallback ───────────────────────────────────────────────────────── */
function FallbackVisual() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-56 h-56">
        <div className="absolute inset-0 rounded-full bg-gold-gradient-soft opacity-20 animate-pulse" />
        <div className="absolute inset-4 rounded-full border-2 border-gold-400/40 animate-spin-slow" />
        <div className="absolute inset-8 rounded-full border border-gold-300/30 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '8s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Gem className="w-20 h-20 text-gold-500 opacity-80 animate-float-slow" strokeWidth={1} />
        </div>
      </div>
      <p className="mt-4 font-sans text-[10px] uppercase tracking-widest text-gold-500 font-semibold opacity-70">
        AURA 3D Showcase
      </p>
    </div>
  );
}

/* ── Main Export ────────────────────────────────────────────────────────── */
export default function ThreeDHero() {
  return (
    <div className="w-full h-full min-h-[360px] lg:min-h-[500px]">
      <ThreeErrorBoundary fallback={<FallbackVisual />}>
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 42 }}
          style={{ background: 'transparent' }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          shadows
        >
          <Scene />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}

import React, { useRef, useState, Suspense, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// WebGL Fallback Error Boundary
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("[Globe3D] WebGL or 3D Render Warning:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-center text-white bg-navy-deep rounded-4">
          <div className="d-flex align-items-center justify-content-center bg-ocean-gradient text-white rounded-circle mb-3" style={{ width: "80px", height: "80px" }}>
            <i className="bi bi-globe fs-1"></i>
          </div>
          <h6 className="font-heading text-white fw-bold mb-1">Interactive World Map</h6>
          <p className="text-white-50 small mb-0">Multi-City Travel Route Planner</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// 3D Sphere & Atmosphere Component
function EarthSphere() {
  const sphereRef = useRef();

  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group>
      {/* Outer Atmospheric Aqua Glow */}
      <mesh scale={2.15}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#06D6C9"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main Earth Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#071A2B"
          roughness={0.6}
          metalness={0.2}
          wireframe={true}
          emissive="#0EA5E9"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// Marker component for lat/long coordinates
const latLongToVector3 = (lat, lng, radius = 2.02) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
};

const DESTINATION_MARKERS = [
  { name: "Paris", country: "France", flag: "🇫🇷", lat: 48.8566, lng: 2.3522 },
  { name: "Tokyo", country: "Japan", flag: "🇯🇵", lat: 35.6762, lng: 139.6503 },
  { name: "Dubai", country: "UAE", flag: "🇦🇪", lat: 25.2048, lng: 55.2708 },
  { name: "New York", country: "USA", flag: "🇺🇸", lat: 40.7128, lng: -74.0060 },
  { name: "Sydney", country: "Australia", flag: "🇦🇺", lat: -33.8688, lng: 151.2093 }
];

function DestinationPoint({ marker }) {
  const [hovered, setHovered] = useState(false);
  const pos = latLongToVector3(marker.lat, marker.lng);

  return (
    <group position={pos}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#FF8A3D" : "#06D6C9"} />
      </mesh>

      {hovered && (
        <Html distanceFactor={10} zIndexRange={[100, 0]}>
          <div
            className="px-2 py-1 bg-navy-deep text-white rounded shadow-sm border border-info small text-nowrap"
            style={{ pointerEvents: "none", fontSize: "11px" }}
          >
            {marker.flag} {marker.name}, {marker.country}
          </div>
        </Html>
      )}
    </group>
  );
}

const Globe3D = () => {
  return (
    <WebGLErrorBoundary>
      <div className="w-100 position-relative" style={{ height: "300px", minHeight: "260px" }}>
        <Suspense
          fallback={
            <div className="d-flex align-items-center justify-content-center h-100 text-white-50 small">
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Loading your world...
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 5.2], fov: 45 }}
            style={{ background: "transparent" }}
            gl={{ powerPreference: "high-performance", antialias: true }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 3, 5]} intensity={1.2} color="#0EA5E9" />
            <pointLight position={[-5, -3, -5]} intensity={0.5} color="#FF8A3D" />

            <EarthSphere />

            {DESTINATION_MARKERS.map((m, idx) => (
              <DestinationPoint key={idx} marker={m} />
            ))}

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={0.8}
              rotateSpeed={0.5}
            />
          </Canvas>
        </Suspense>
      </div>
    </WebGLErrorBoundary>
  );
};

export default Globe3D;

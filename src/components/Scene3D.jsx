import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { MathUtils } from "three";

const GOLD = "#d4a853";

/* 0 → 1 as the hero scrolls out of view */
const heroProgress = () => Math.min(window.scrollY / window.innerHeight, 1);

function Core() {
  const group = useRef();
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame((state, dt) => {
    const p = heroProgress();
    const g = group.current;
    // Mouse parallax + scroll-driven tumble
    g.rotation.x = MathUtils.lerp(g.rotation.x, state.pointer.y * 0.25 + p * 0.9, 0.06);
    g.rotation.y = MathUtils.lerp(g.rotation.y, state.pointer.x * 0.4 + p * 1.6, 0.06);
    g.position.y = MathUtils.lerp(g.position.y, p * 1.2, 0.08);
    const s = 1 - p * 0.35;
    g.scale.setScalar(MathUtils.lerp(g.scale.x, s, 0.08));
    ring1.current.rotation.z += dt * 0.25;
    ring2.current.rotation.z -= dt * 0.18;
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.25, 48]} />
          <MeshDistortMaterial color={GOLD} metalness={0.92} roughness={0.22} distort={0.3} speed={1.5} envMapIntensity={1.6} />
        </mesh>
      </Float>
      <mesh ref={ring1} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.1, 0.012, 16, 160]} />
        <meshStandardMaterial color="#f0cc7a" metalness={1} roughness={0.2} emissive="#8a6520" emissiveIntensity={0.4} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 1.8, Math.PI / 6, 0]}>
        <torusGeometry args={[2.55, 0.008, 16, 160]} />
        <meshStandardMaterial color="#f0cc7a" metalness={1} roughness={0.3} emissive="#8a6520" emissiveIntensity={0.25} />
      </mesh>
      <Satellite position={[2.3, 1.1, -0.6]} geo="oct" size={0.22} speed={2} />
      <Satellite position={[-2.4, -0.9, 0.2]} geo="sphere" size={0.18} speed={1.6} />
      <Satellite position={[0.3, 2.3, -1.2]} geo="torus" size={0.2} speed={1.2} />
      <Satellite position={[1.8, -1.5, 0.4]} geo="box" size={0.2} speed={1.8} />
    </group>
  );
}

function Satellite({ geo, size, ...props }) {
  return (
    <Float speed={props.speed} rotationIntensity={2} floatIntensity={1.4}>
      <mesh position={props.position}>
        {geo === "oct" && <octahedronGeometry args={[size]} />}
        {geo === "sphere" && <sphereGeometry args={[size, 32, 32]} />}
        {geo === "torus" && <torusGeometry args={[size, size * 0.35, 16, 48]} />}
        {geo === "box" && <boxGeometry args={[size * 1.3, size * 1.3, size * 1.3]} />}
        <meshStandardMaterial color={geo === "sphere" ? "#2d5a3a" : GOLD} metalness={0.9} roughness={0.2} />
      </mesh>
    </Float>
  );
}

export default function Scene3D({ active = true, reduced = false }) {
  const [dpr, setDpr] = useState(1.5);
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active && !reduced ? "always" : "demand"}
    >
      {/* Drop resolution on slower devices so scrolling stays smooth */}
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color="#fff3d6" />
      <pointLight position={[-4, -2, 2]} intensity={30} color="#3f8f5a" />
      <Core />
      <Sparkles count={70} scale={[9, 6, 4]} size={2.2} speed={0.35} color="#f0cc7a" opacity={0.7} />
      {/* Studio reflections built from light panels — no external HDR download */}
      <Environment resolution={256}>
        <color attach="background" args={["#3a2f18"]} />
        <Lightformer intensity={4} position={[0, 5, -4]} rotation-x={Math.PI / 2} scale={[12, 6, 1]} color="#fff4dc" />
        <Lightformer intensity={3} position={[0, 4, -6]} scale={[10, 2, 1]} color="#fff4dc" />
        <Lightformer intensity={1.2} position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[12, 6, 1]} color="#1e3d28" />
        <Lightformer intensity={2} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#f0cc7a" />
        <Lightformer intensity={1.5} position={[6, -1, 0]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#2d5a3a" />
        <Lightformer form="ring" intensity={2} position={[0, 0, 6]} scale={3} color="#ffffff" />
      </Environment>
    </Canvas>
  );
}

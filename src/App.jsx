import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Corridor from "./components/Corridor";
import Room from "./components/Room";
import Character from "./components/Character";
import { usePortfolioStore, ROOMS } from "./store";

function WorldFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#7a5f42" roughness={0.5} metalness={0.02} />
    </mesh>
  );
}

export default function App() {
  const activeRoomId = usePortfolioStore((s) => s.activeRoomId);
  const pointerLocked = usePortfolioStore((s) => s.pointerLocked);
  const activeRoom = ROOMS.find((r) => r.id === activeRoomId);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows camera={{ fov: 70, near: 0.1, far: 100 }}>
        <color attach="background" args={["#141210"]} />

        <ambientLight intensity={0.55} />
        <directionalLight
          position={[8, 10, 4]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-8, 10, 4]} intensity={1.4} />
        <pointLight position={[0, 3.6, -6]} intensity={0.6} color="#ffdcb0" />
        <pointLight position={[0, 3.6, -16]} intensity={0.6} color="#ffdcb0" />

        <Environment preset="apartment" />

        <WorldFloor />
        <Corridor />
        {ROOMS.map((r) => (
          <Room key={r.id} room={r} />
        ))}

        <ContactShadows
          position={[0, 0.01, -8]}
          opacity={0.5}
          scale={40}
          blur={2}
          far={10}
        />

        <Character />

        <EffectComposer>
          <Bloom intensity={0.2} luminanceThreshold={0.85} />
          <Vignette eskil={false} offset={0.15} darkness={0.5} />
        </EffectComposer>
      </Canvas>

      {activeRoom && <RoomOverlay room={activeRoom} />}
      {!pointerLocked && <ClickToStartOverlay />}
      <Crosshair />
      <Hint />
    </div>
  );
}

function ClickToStartOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.35)",
        color: "#fff",
        fontFamily: "sans-serif",
        fontSize: 18,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "14px 24px",
          background: "rgba(0,0,0,0.6)",
          borderRadius: 10,
        }}
      >
        Click anywhere to enable mouse-look
      </div>
    </div>
  );
}

function RoomOverlay({ room }) {
  const exitToCorridor = usePortfolioStore((s) => s.exitToCorridor);
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        padding: "8px 14px",
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        borderRadius: 8,
        fontFamily: "sans-serif",
      }}
    >
      You're in the {room.label} room
      <button
        onClick={exitToCorridor}
        style={{ marginLeft: 12, cursor: "pointer" }}
      >
        Back to Corridor
      </button>
    </div>
  );
}

function Crosshair() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 6,
        height: 6,
        marginLeft: -3,
        marginTop: -3,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.8)",
        pointerEvents: "none",
      }}
    />
  );
}

function Hint() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        color: "#fff",
        background: "rgba(0,0,0,0.5)",
        padding: "6px 14px",
        borderRadius: 8,
        fontFamily: "sans-serif",
        fontSize: 13,
      }}
    >
      Click once = enable mouse-look &nbsp;|&nbsp; Move mouse = look around
      &nbsp;|&nbsp; Scroll = walk &nbsp;|&nbsp; Click a door = open
    </div>
  );
}
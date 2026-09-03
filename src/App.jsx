import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Corridor from "./components/Corridor";
import Room from "./components/Room";
import Character from "./components/Character";
import { usePortfolioStore, ROOMS, INNER_DOORS } from "./store";
import Door from "./components/Door";

function WorldFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#0a0604" roughness={0.15} metalness={0.4} />
    </mesh>
  );
}

export default function App() {
  const activeRoomId = usePortfolioStore((s) => s.activeRoomId);
  const pointerLocked = usePortfolioStore((s) => s.pointerLocked);
  const activeRoom = ROOMS.find((r) => r.id === activeRoomId);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows dpr={1} camera={{ fov: 70, near: 0.1, far: 100 }}>
        <color attach="background" args={["#0a0806"]} />
        <fog attach="fog" args={["#0a0806", 8, 40]} />

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, -5]}
          intensity={0.4}
          color="#b3c6ff"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <Environment preset="city" />

        <WorldFloor />
        <Corridor />
        {ROOMS.map((r) => (
          <Room key={r.id} room={r} />
        ))}
        {INNER_DOORS.map((d) => (
          <Door
            key={d.id}
            id={d.id}
            position={d.doorPosition}
            rotationY={d.doorRotationY}
            label={d.label}
          />
        ))}

        <ContactShadows
          position={[0, 0.01, -8]}
          opacity={0.5}
          scale={40}
          blur={2}
          far={10}
          resolution={512}
          frames={1}
        />

        <Character />

        <EffectComposer multisampling={0}>
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
      &nbsp;|&nbsp; WASD or Scroll = walk &nbsp;|&nbsp; Click a door = open
    </div>
  );
}
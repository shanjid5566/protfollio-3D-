import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { fetchRoomContent } from "../api/client";
import Door from "./Door";
import { usePortfolioStore } from "../store";

function ClassicRoomWall({ position, rotation, length }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Baseboard */}
      <mesh position={[0, 0.1, 0.02]} receiveShadow>
        <boxGeometry args={[length, 0.2, 0.12]} />
        <meshStandardMaterial color="#140a05" roughness={0.8} />
      </mesh>
      {/* Lower Wall */}
      <mesh position={[0, 0.7, 0]} receiveShadow>
        <boxGeometry args={[length, 1.4, 0.1]} />
        <meshStandardMaterial color="#2b1a10" roughness={0.6} />
      </mesh>
      {/* Chair Rail */}
      <mesh position={[0, 1.45, 0.02]} receiveShadow castShadow>
        <boxGeometry args={[length, 0.1, 0.12]} />
        <meshStandardMaterial color="#140a05" roughness={0.6} />
      </mesh>
      {/* Upper Wall */}
      <mesh position={[0, 2.75, 0]} receiveShadow>
        <boxGeometry args={[length, 2.5, 0.1]} />
        <meshStandardMaterial color="#1e2b22" roughness={0.9} />
      </mesh>
      {/* Crown Molding */}
      <mesh position={[0, 3.9, 0.1]} receiveShadow castShadow>
        <boxGeometry args={[length, 0.2, 0.3]} />
        <meshStandardMaterial color="#140a05" roughness={0.8} />
      </mesh>
    </group>
  );
}

function RoomCeilingLight({ position }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 3.95, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.1, 16]} />
        <meshStandardMaterial color="#b8923f" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glass dome */}
      <mesh position={[0, 3.75, 0]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffeaad" emissiveIntensity={1.5} />
      </mesh>
      {/* Actual Light */}
      <pointLight position={[0, 3.5, 0]} intensity={4.5} distance={25} decay={1.5} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.001} color="#ffeaad" />
    </group>
  );
}

export default function Room({ room }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const activeRoomId = usePortfolioStore((s) => s.activeRoomId);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchRoomContent(room.id)
      .then((data) => alive && setContent(data))
      .catch(() => alive && setContent({ error: true }))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [room.id]);

  const [cx, , cz] = room.roomCenter;
  const accent = room.accentColor || "#3f4f8a";

  return (
    <group position={[cx, 0, cz]}>
      <ClassicRoomWall position={[0, 0, -5]} rotation={[0, 0, 0]} length={10} />
      <ClassicRoomWall position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={10} />
      <ClassicRoomWall position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} length={10} />
      <ClassicRoomWall position={[0, 0, 5]} rotation={[0, Math.PI, 0]} length={10} />
      
      {/* Exit Door */}
      <Door 
        id="exit" 
        position={[0, 0, 4.85]} 
        rotationY={Math.PI} 
        label="Exit" 
      />

      {/* Ceiling */}
      <mesh position={[0, 4, 0]} receiveShadow>
        <boxGeometry args={[10, 0.2, 10]} />
        <meshStandardMaterial color="#d4c9b8" roughness={1} />
      </mesh>
      
      {/* Room Ceiling Light */}
      <RoomCeilingLight position={[0, 0, 0]} />

      {/* Accent-colored rug with Gold Border */}
      <group position={[0, 0.02, 0]}>
        {/* Main Rug */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.005, 0]}>
          <planeGeometry args={[7.6, 7.6]} />
          <meshStandardMaterial color={accent} roughness={1} />
        </mesh>
        {/* Gold Border */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#c9a15a" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* Basic pedestal in the center (Commented out for design purposes) */}
      {/* 
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 1, 32]} />
        <meshStandardMaterial color="#2b1a10" roughness={0.4} />
      </mesh>
      */}
      
      {/* Content Floating Panel (Commented out for design purposes) */}
      {/* 
      {activeRoomId === room.id && (
        <Html position={[0, 1.8, 0]} center transform scale={0.1}>
          <div
            style={{
              width: 800,
              background: "rgba(20, 15, 10, 0.9)",
              border: `2px solid ${accent}`,
              padding: 40,
              borderRadius: 16,
              color: "#fff",
              fontFamily: "sans-serif",
              backdropFilter: "blur(8px)",
              boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${accent}40`,
            }}
          >
            {loading ? (
              <h2 style={{ textAlign: "center" }}>Loading {room.label}...</h2>
            ) : content?.error ? (
              <h2 style={{ textAlign: "center", color: "#ff6b6b" }}>
                Failed to load content.
              </h2>
            ) : (
              <>
                <h1 style={{ fontSize: 48, marginBottom: 20, color: accent }}>
                  {content?.title}
                </h1>
                <div
                  style={{ fontSize: 24, lineHeight: 1.6, whiteSpace: "pre-wrap" }}
                >
                  {content?.body}
                </div>
              </>
            )}
          </div>
        </Html>
      )} 
      */}
    </group>
  );
}

import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { fetchRoomContent } from "../api/client";
import Door from "./Door";
import { usePortfolioStore, INNER_DOORS } from "../store";

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
      <pointLight position={[0, 3.5, 0]} intensity={4.5} distance={25} decay={1.5} color="#ffeaad" />
    </group>
  );
}

function RoomWallSegment({ position, rotation, length }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.1, 0.02]} receiveShadow>
        <boxGeometry args={[length, 0.2, 0.12]} />
        <meshStandardMaterial color="#140a05" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.7, 0]} receiveShadow>
        <boxGeometry args={[length, 1.4, 0.1]} />
        <meshStandardMaterial color="#2b1a10" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.45, 0.02]} receiveShadow castShadow>
        <boxGeometry args={[length, 0.1, 0.12]} />
        <meshStandardMaterial color="#140a05" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.75, 0]} receiveShadow>
        <boxGeometry args={[length, 2.5, 0.1]} />
        <meshStandardMaterial color="#1e2b22" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.9, 0.1]} receiveShadow castShadow>
        <boxGeometry args={[length, 0.2, 0.3]} />
        <meshStandardMaterial color="#140a05" roughness={0.8} />
      </mesh>
    </group>
  );
}

function RoomWallWithDoor({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <RoomWallSegment position={[-2.925, 0, 0]} rotation={[0, 0, 0]} length={4.15} />
      <RoomWallSegment position={[2.925, 0, 0]} rotation={[0, 0, 0]} length={4.15} />
      <group position={[0, 0, 0]}>
        <mesh position={[0, 3.375, 0]} receiveShadow>
          <boxGeometry args={[1.7, 1.25, 0.1]} />
          <meshStandardMaterial color="red" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.9, 0.1]} receiveShadow castShadow>
          <boxGeometry args={[1.7, 0.2, 0.3]} />
          <meshStandardMaterial color="red" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

export default function Room({ room }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

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
  
  const isLeftRoom = room.doorPosition[0] < 0;
  
  // Hardcoded for absolute certainty instead of relying on float comparisons
  const hasBackDoor = room.id === 'about' || room.id === 'projects';
  const hasFrontDoor = room.id === 'skills' || room.id === 'contact';

  return (
    <group position={[cx, 0, cz]}>
      {/* Back Wall */}
      {hasBackDoor ? (
        <RoomWallWithDoor position={[0, 0, -4.9]} rotation={[0, 0, 0]} />
      ) : (
        <ClassicRoomWall position={[0, 0, -5]} rotation={[0, 0, 0]} length={10} />
      )}
      
      {/* Left Wall */}
      {isLeftRoom ? (
        <ClassicRoomWall position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={10} />
      ) : (
        // If room is on the right, the left wall touches the corridor. Shift it inward slightly to avoid Z-fighting.
        <RoomWallWithDoor position={[-4.9, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      )}
      
      {/* Right Wall */}
      {!isLeftRoom ? (
        <ClassicRoomWall position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} length={10} />
      ) : (
        // If room is on the left, the right wall touches the corridor. Shift it inward slightly.
        <RoomWallWithDoor position={[4.9, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      )}
      
      {/* Front Wall */}
      {hasFrontDoor ? (
        <RoomWallWithDoor position={[0, 0, 4.9]} rotation={[0, Math.PI, 0]} />
      ) : (
        <ClassicRoomWall position={[0, 0, 5]} rotation={[0, Math.PI, 0]} length={10} />
      )}

      {/* Ceiling */}
      <mesh position={[0, 4, 0]} receiveShadow>
        <boxGeometry args={[10, 0.2, 10]} />
        <meshStandardMaterial color="#d4c9b8" roughness={1} />
      </mesh>
      
      {/* Room Ceiling Light */}
      <RoomCeilingLight position={[0, 0, 0]} />

      {/* Accent-colored rug with Gold Border */}
      <group position={[0, 0.02, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.005, 0]}>
          <planeGeometry args={[7.6, 7.6]} />
          <meshStandardMaterial color={accent} roughness={1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#c9a15a" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

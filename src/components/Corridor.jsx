import Door from "./Door";
import { ROOMS, LOOP_DOOR } from "../store";

const CORRIDOR_LENGTH = 30;
const CORRIDOR_WIDTH = 7;

function Walls() {
  return (
    <>
      <mesh
        position={[-CORRIDOR_WIDTH / 2, 2, -CORRIDOR_LENGTH / 2 + 5]}
        receiveShadow
      >
        <boxGeometry args={[0.2, 4, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.85} envMapIntensity={0.15} />
      </mesh>
      <mesh
        position={[CORRIDOR_WIDTH / 2, 2, -CORRIDOR_LENGTH / 2 + 5]}
        receiveShadow
      >
        <boxGeometry args={[0.2, 4, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.85} envMapIntensity={0.15} />
      </mesh>
      <mesh position={[0, 4, -CORRIDOR_LENGTH / 2 + 5]}>
        <boxGeometry args={[CORRIDOR_WIDTH, 0.2, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      <mesh
        position={[-CORRIDOR_WIDTH / 2 + 0.15, 0.18, -CORRIDOR_LENGTH / 2 + 5]}
      >
        <boxGeometry args={[0.1, 0.36, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#b8923f" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh
        position={[CORRIDOR_WIDTH / 2 - 0.15, 0.18, -CORRIDOR_LENGTH / 2 + 5]}
      >
        <boxGeometry args={[0.1, 0.36, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#b8923f" metalness={0.4} roughness={0.4} />
      </mesh>

      <mesh position={[0, 2, 5.15]} receiveShadow>
        <boxGeometry args={[CORRIDOR_WIDTH, 4, 0.3]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.85} envMapIntensity={0.15} />
      </mesh>
      <mesh position={[0, 2, -25.15]} receiveShadow>
        <boxGeometry args={[CORRIDOR_WIDTH, 4, 0.3]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.85} envMapIntensity={0.15} />
      </mesh>
    </>
  );
}

function Carpet() {
  return (
    <mesh
      position={[0, 0.011, -10]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[2.4, 29]} />
      <meshStandardMaterial color="#7a1f1f" roughness={0.9} />
    </mesh>
  );
}

function Painting({ position, rotationY, color }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[1.2, 0.9, 0.05]} />
        <meshStandardMaterial color="#2b1a0f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

function TableWithFlower({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 24]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 12]} />
        <meshStandardMaterial color="#3d2b1f" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 12]} />
        <meshStandardMaterial color="#c9a15a" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.68, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#e0507a" />
      </mesh>
    </group>
  );
}

export default function Corridor() {
  return (
    <group>
      <Walls />
      <Carpet />

      <Painting
        position={[-3.4, 2, -2]}
        rotationY={Math.PI / 2}
        color="#3f6b4a"
      />
      <Painting
        position={[3.4, 2, -2]}
        rotationY={-Math.PI / 2}
        color="#8a3f3f"
      />
      <Painting
        position={[-3.4, 2, -16]}
        rotationY={Math.PI / 2}
        color="#3f4f8a"
      />
      <Painting
        position={[3.4, 2, -16]}
        rotationY={-Math.PI / 2}
        color="#8a7a3f"
      />

      <TableWithFlower position={[0, 0, -11]} />

      {ROOMS.map((r) => (
        <Door
          key={r.id}
          id={r.id}
          position={r.doorPosition}
          rotationY={r.doorRotationY}
          label={r.label}
        />
      ))}
      <Door
        id={LOOP_DOOR.id}
        position={LOOP_DOOR.doorPosition}
        rotationY={LOOP_DOOR.doorRotationY}
        label={LOOP_DOOR.label}
      />
    </group>
  );
}
import Door from "./Door";
import { ROOMS, LOOP_DOOR } from "../store";

const CORRIDOR_LENGTH = 32;
const CORRIDOR_WIDTH = 7;
const START_Z = 6;
const END_Z = -26;
const CENTER_Z = -10;

function ClassicWallSegment({ isLeft, zStart, zEnd }) {
  const sign = isLeft ? -1 : 1
  const x = (CORRIDOR_WIDTH / 2) * sign
  const length = Math.abs(zStart - zEnd)
  const centerZ = (zStart + zEnd) / 2

  return (
    <group>
      {/* Baseboard */}
      <mesh position={[x - 0.06 * sign, 0.1, centerZ]} receiveShadow>
        <boxGeometry args={[0.12, 0.2, length]} />
        <meshStandardMaterial color="#140a05" roughness={0.8} />
      </mesh>
      
      {/* Lower Wall (Wainscoting) */}
      <mesh position={[x, 0.7, centerZ]} receiveShadow>
        <boxGeometry args={[0.2, 1.4, length]} />
        <meshStandardMaterial color="#2b1a10" roughness={0.6} />
      </mesh>
      
      {/* Chair Rail */}
      <mesh position={[x - 0.06 * sign, 1.45, centerZ]} receiveShadow castShadow>
        <boxGeometry args={[0.12, 0.1, length]} />
        <meshStandardMaterial color="#140a05" roughness={0.6} />
      </mesh>
      
      {/* Upper Wall (Classic Wallpaper/Paint) */}
      <mesh position={[x, 2.75, centerZ]} receiveShadow>
        <boxGeometry args={[0.2, 2.5, length]} />
        <meshStandardMaterial color="#1e2b22" roughness={0.9} />
      </mesh>

      {/* Crown Molding */}
      <mesh position={[x - 0.1 * sign, 3.9, centerZ]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 0.2, length]} />
        <meshStandardMaterial color="#140a05" roughness={0.8} />
      </mesh>
    </group>
  )
}

function DoorTopFiller({ isLeft, z }) {
  const sign = isLeft ? -1 : 1
  const x = (CORRIDOR_WIDTH / 2) * sign
  // Door is 1.7 wide, and goes up to 2.8. Ceiling is 4.0.
  // We need a block from 2.8 to 4.0. (Height = 1.2, Center Y = 3.4)
  return (
    <group>
      <mesh position={[x, 3.375, z]} receiveShadow>
        <boxGeometry args={[0.2, 1.25, 1.7]} />
        <meshStandardMaterial color="#1e2b22" roughness={0.9} />
      </mesh>
      {/* Crown Molding over the door */}
      <mesh position={[x - 0.1 * sign, 3.9, z]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 0.2, 1.7]} />
        <meshStandardMaterial color="#140a05" roughness={0.8} />
      </mesh>
    </group>
  )
}

function EndCaps() {
  return (
    <group>
      <mesh position={[0, 2, START_Z + 0.1]} receiveShadow>
        <boxGeometry args={[CORRIDOR_WIDTH, 4, 0.2]} />
        <meshStandardMaterial color="#1e2b22" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2, END_Z - 0.1]} receiveShadow>
        <boxGeometry args={[CORRIDOR_WIDTH, 4, 0.2]} />
        <meshStandardMaterial color="#1e2b22" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Ceiling() {
  return (
    <mesh position={[0, 4, CENTER_Z]} receiveShadow>
      <boxGeometry args={[CORRIDOR_WIDTH, 0.2, CORRIDOR_LENGTH]} />
      <meshStandardMaterial color="#d4c9b8" roughness={1} />
    </mesh>
  );
}

function Carpet() {
  return (
    <group position={[0, 0.02, CENTER_Z]}>
      {/* Main Runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#5e1212" roughness={1} />
      </mesh>
      {/* Gold Borders */}
      <mesh position={[-1.5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.1, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#c9a15a" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[1.5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.1, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#c9a15a" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}

function CeilingLight({ position }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 3.95, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.1, 16]} />
        <meshStandardMaterial color="#b8923f" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glass dome */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffeaad" emissiveIntensity={1.5} />
      </mesh>
      {/* Actual Light */}
      <pointLight position={[0, 3.6, 0]} intensity={1.2} distance={15} decay={1.5} color="#ffeaad" />
    </group>
  );
}

function WallSconce({ position, rotationY }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#b8923f" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, 0.15]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffeaad" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 0.2, 0.2]} intensity={0.5} distance={5} decay={2} color="#ffeaad" />
    </group>
  );
}

function Painting({ position, rotationY, color }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Ornate Frame */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 1.2, 0.1]} />
        <meshStandardMaterial color="#c9a15a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Inner Frame */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[1.5, 0.9, 0.1]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.8} />
      </mesh>
      {/* Canvas */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[1.4, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

function TableWithFlower({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        <meshStandardMaterial color="#2b1a10" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 16]} />
        <meshStandardMaterial color="#1a0f0a" />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.05, 32]} />
        <meshStandardMaterial color="#2b1a10" roughness={0.3} />
      </mesh>
      {/* vase */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.25, 16]} />
        <meshStandardMaterial color="#e8e0d5" metalness={0.1} roughness={0.2} />
      </mesh>
      {/* flower */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#d4334a" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Corridor() {
  return (
    <group>
      {/* Left Wall Segments (Doors at -6 and -16) */}
      <ClassicWallSegment isLeft={true} zStart={START_Z} zEnd={-5.15} />
      <DoorTopFiller isLeft={true} z={-6} />
      <ClassicWallSegment isLeft={true} zStart={-6.85} zEnd={-15.15} />
      <DoorTopFiller isLeft={true} z={-16} />
      <ClassicWallSegment isLeft={true} zStart={-16.85} zEnd={END_Z} />

      {/* Right Wall Segments (Door at -6) */}
      <ClassicWallSegment isLeft={false} zStart={START_Z} zEnd={-5.15} />
      <DoorTopFiller isLeft={false} z={-6} />
      <ClassicWallSegment isLeft={false} zStart={-6.85} zEnd={END_Z} />

      <EndCaps />
      <Ceiling />
      <Carpet />

      {/* Ceiling Lights */}
      <CeilingLight position={[0, 0, 2]} />
      <CeilingLight position={[0, 0, -6]} />
      <CeilingLight position={[0, 0, -14]} />
      <CeilingLight position={[0, 0, -22]} />

      {/* Wall Sconces */}
      <WallSconce position={[-3.4, 2.2, 0]} rotationY={Math.PI / 2} />
      <WallSconce position={[3.4, 2.2, 0]} rotationY={-Math.PI / 2} />
      <WallSconce position={[-3.4, 2.2, -10]} rotationY={Math.PI / 2} />
      <WallSconce position={[3.4, 2.2, -10]} rotationY={-Math.PI / 2} />
      <WallSconce position={[-3.4, 2.2, -20]} rotationY={Math.PI / 2} />
      <WallSconce position={[3.4, 2.2, -20]} rotationY={-Math.PI / 2} />

      <Painting
        position={[-3.4, 2.2, -4]}
        rotationY={Math.PI / 2}
        color="#3f6b4a"
      />
      <Painting
        position={[3.4, 2.2, -4]}
        rotationY={-Math.PI / 2}
        color="#8a3f3f"
      />
      <Painting
        position={[-3.4, 2.2, -18]}
        rotationY={Math.PI / 2}
        color="#3f4f8a"
      />
      <Painting
        position={[3.4, 2.2, -18]}
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
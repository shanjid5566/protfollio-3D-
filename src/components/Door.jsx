import { Html } from '@react-three/drei'
import { usePortfolioStore } from '../store'

export default function Door({ id, position, rotationY = 0, label }) {
  const nearbyDoorId = usePortfolioStore((s) => s.nearbyDoorId)
  const isNear = nearbyDoorId === id

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 2.5, 0.14]} />
        <meshStandardMaterial color="#3a2414" roughness={0.6} metalness={0.05} />
      </mesh>

      <mesh position={[0, 1.1, 0.09]} castShadow>
        <boxGeometry args={[1.0, 2.2, 0.06]} />
        <meshStandardMaterial
          color={isNear ? '#8a4a2a' : '#6b3a20'}
          roughness={0.5}
          metalness={0.1}
          emissive={isNear ? '#ff9d52' : '#000000'}
          emissiveIntensity={isNear ? 0.25 : 0}
        />
      </mesh>

      <mesh position={[0, 1.6, 0.13]}>
        <boxGeometry args={[0.7, 0.6, 0.02]} />
        <meshStandardMaterial color="#4a2a16" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.7, 0.13]}>
        <boxGeometry args={[0.7, 0.8, 0.02]} />
        <meshStandardMaterial color="#4a2a16" roughness={0.6} />
      </mesh>

      <mesh position={[0.35, 1.1, 0.14]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>

      {isNear && (
        <Html position={[0, 2.9, 0]} center distanceFactor={8}>
          <div
            style={{
              padding: '4px 14px',
              background: 'rgba(0,0,0,0.75)',
              color: '#fff',
              borderRadius: 6,
              fontFamily: 'sans-serif',
              fontSize: 14,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: '1px solid #ff9d52',
            }}
          >
            {label} — OPEN
          </div>
        </Html>
      )}
    </group>
  )
}
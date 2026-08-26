import { Html } from '@react-three/drei'
import { usePortfolioStore } from '../store'

export default function Door({ id, position, rotationY = 0, label }) {
  const nearbyDoorId = usePortfolioStore((s) => s.nearbyDoorId)
  const isNear = nearbyDoorId === id

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Grand Door Frame */}
      <mesh position={[0, 1.4, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 2.8, 0.1]} />
        <meshStandardMaterial color="#d4c9b8" roughness={0.4} />
      </mesh>

      {/* Main Door Panel */}
      <mesh position={[0, 1.35, 0.08]} castShadow>
        <boxGeometry args={[1.3, 2.7, 0.06]} />
        <meshStandardMaterial
          color={isNear ? '#ffffff' : '#e8e0d5'}
          roughness={0.5}
          emissive={isNear ? '#ffeaad' : '#000'}
          emissiveIntensity={isNear ? 0.2 : 0}
        />
      </mesh>

      {/* Door Details (Panels) */}
      <mesh position={[0, 1.95, 0.12]}>
        <boxGeometry args={[0.9, 1.1, 0.02]} />
        <meshStandardMaterial color="#c4b7a3" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.75, 0.12]}>
        <boxGeometry args={[0.9, 1.1, 0.02]} />
        <meshStandardMaterial color="#c4b7a3" roughness={0.6} />
      </mesh>

      {/* Doorknob */}
      <mesh position={[0.45, 1.3, 0.13]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#c9a15a" metalness={0.9} roughness={0.1} />
      </mesh>

      {isNear && (
        <Html position={[0, 3.1, 0]} center distanceFactor={8}>
          <div
            style={{
              padding: '6px 16px',
              background: 'rgba(20, 15, 10, 0.85)',
              color: '#f5deb3',
              borderRadius: 4,
              fontFamily: 'Georgia, serif',
              fontSize: 16,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: '1px solid #c9a15a',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            {label} — OPEN
          </div>
        </Html>
      )}
    </group>
  )
}
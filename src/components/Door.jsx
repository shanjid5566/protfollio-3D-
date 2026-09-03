import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { usePortfolioStore, isInCorridor } from '../store'

export default function Door({ id, position, rotationY = 0, label, showLabel = true, isInnerDoor = false }) {
  const nearbyDoorId = usePortfolioStore((s) => s.nearbyDoorId)
  const openDoors = usePortfolioStore((s) => s.openDoors)
  const playerPosition = usePortfolioStore((s) => s.playerPosition)
  
  const isNear = nearbyDoorId === id
  const isOpen = openDoors.includes(id)
  const inCorridor = isInCorridor(playerPosition)
  const hingeRef = useRef()

  useFrame((state, delta) => {
    if (hingeRef.current) {
      // If the door is on the right wall (rotationY = -Math.PI / 2), it swings one way.
      // We swing 90 degrees (Math.PI / 2) when open.
      const targetRotation = isOpen ? Math.PI / 2 : 0
      hingeRef.current.rotation.y = THREE.MathUtils.lerp(
        hingeRef.current.rotation.y,
        targetRotation,
        delta * 8
      )
    }
  })

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Grand Door Frame (Left, Right, Top) */}
      <mesh position={[-0.75, 1.35, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.7, 0.1]} />
        <meshStandardMaterial color="#d4c9b8" roughness={0.4} />
      </mesh>
      <mesh position={[0.75, 1.35, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.7, 0.1]} />
        <meshStandardMaterial color="#d4c9b8" roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.75, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.1, 0.1]} />
        <meshStandardMaterial color="#d4c9b8" roughness={0.4} />
      </mesh>

      {/* Hinge Group (offset so the door swings from the edge instead of the center) */}
      <group ref={hingeRef} position={[-0.65, 0, 0.08]}>
        {/* Main Door Panel */}
        <mesh position={[0.65, 1.35, 0]} castShadow>
          <boxGeometry args={[1.3, 2.7, 0.06]} />
          <meshStandardMaterial
            color={isNear ? '#ffffff' : '#e8e0d5'}
            roughness={0.5}
            emissive={isNear && !isOpen ? '#ffeaad' : '#000'}
            emissiveIntensity={isNear && !isOpen ? 0.2 : 0}
          />
        </mesh>

        {/* Door Details (Panels) */}
        <mesh position={[0.65, 1.95, 0.04]}>
          <boxGeometry args={[0.9, 1.1, 0.02]} />
          <meshStandardMaterial color="#c4b7a3" roughness={0.6} />
        </mesh>
        <mesh position={[0.65, 0.75, 0.04]}>
          <boxGeometry args={[0.9, 1.1, 0.02]} />
          <meshStandardMaterial color="#c4b7a3" roughness={0.6} />
        </mesh>

        {/* Doorknob */}
        <mesh position={[1.1, 1.3, 0.05]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#c9a15a" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Room name above the door */}
      {showLabel && ((isInnerDoor && !inCorridor) || (!isInnerDoor && inCorridor)) && (
        <Html position={[0, 3.1, 0]} center distanceFactor={8}>
          <div
            style={{
              padding: '6px 16px',
              background: 'rgba(20, 15, 10, 0.85)',
              color: '#f5deb3',
              borderRadius: 4,
              fontFamily: 'Georgia, serif',
              fontSize: 24,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: '1px solid #c9a15a',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            {label}
          </div>
        </Html>
      )}

      {/* Interactive prompt when nearby */}
      {isNear && (
        <Html position={[0, 3.6, 0]} center distanceFactor={8}>
          <div
            style={{
              padding: '4px 12px',
              background: 'rgba(20, 15, 10, 0.75)',
              color: '#c9a15a',
              borderRadius: 4,
              fontFamily: 'Georgia, serif',
              fontSize: 13,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: '1px solid #8a7140',
            }}
          >
            {isOpen ? 'CLICK TO CLOSE' : 'CLICK TO OPEN'}
          </div>
        </Html>
      )}
    </group>
  )
}
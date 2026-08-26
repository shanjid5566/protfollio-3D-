import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import {
  usePortfolioStore,
  ROOMS,
  LOOP_DOOR,
  INNER_DOORS,
} from '../store'
import { useMouseControls } from '../hooks/useMouseControls'

const WALK_SPEED = 3.2
const DOOR_TRIGGER_DISTANCE = 2.2

const CORRIDOR_BOUNDS = { minX: -2.8, maxX: 2.8, minZ: -24, maxZ: 5.3 }

function isPositionValid(vec) {
  let isValid = false
  const { minX: cxMin, maxX: cxMax, minZ: czMin, maxZ: czMax } = CORRIDOR_BOUNDS
  if (vec.x >= cxMin && vec.x <= cxMax && vec.z >= czMin && vec.z <= czMax) {
    isValid = true
  }

  if (!isValid) {
    for (const r of ROOMS) {
      const rxMin = r.roomCenter[0] - 4.2
      const rxMax = r.roomCenter[0] + 4.2
      const rzMin = r.roomCenter[2] - 4.2
      const rzMax = r.roomCenter[2] + 4.2
      if (vec.x >= rxMin && vec.x <= rxMax && vec.z >= rzMin && vec.z <= rzMax) {
        isValid = true
        break
      }
    }
  }

  if (!isValid) {
    const openDoors = usePortfolioStore.getState().openDoors
    for (const r of ROOMS) {
      if (openDoors.includes(r.id)) {
        const dzMin = r.doorPosition[2] - 0.85
        const dzMax = r.doorPosition[2] + 0.85
        let dxMin, dxMax
        if (r.doorPosition[0] < 0) {
          dxMin = r.roomCenter[0]; dxMax = 0
        } else {
          dxMin = 0; dxMax = r.roomCenter[0]
        }
        if (vec.x >= dxMin && vec.x <= dxMax && vec.z >= dzMin && vec.z <= dzMax) {
          isValid = true
          break
        }
      }
    }
  }

  if (!isValid) {
    const openDoors = usePortfolioStore.getState().openDoors
    for (const d of INNER_DOORS) {
      if (openDoors.includes(d.id)) {
        const dxMin = d.doorPosition[0] - 0.85
        const dxMax = d.doorPosition[0] + 0.85
        const dzMin = d.doorPosition[2] - 0.85
        const dzMax = d.doorPosition[2] + 0.85
        
        if (vec.x >= dxMin && vec.x <= dxMax && vec.z >= dzMin && vec.z <= dzMax) {
          isValid = true
          break
        }
      }
    }
  }

  if (!isValid) return false

  // Negative space check: prevent walking through the open door panels
  const openDoors = usePortfolioStore.getState().openDoors
  const allDoors = [...ROOMS, LOOP_DOOR, ...INNER_DOORS]
  
  for (const d of allDoors) {
    if (openDoors.includes(d.id)) {
      let minX, maxX, minZ, maxZ
      if (d.doorRotationY === Math.PI / 2) {
        const hingeZ = d.doorPosition[2] + 0.65
        minX = d.doorPosition[0] - 1.4; maxX = d.doorPosition[0] + 0.1
        minZ = hingeZ - 0.2; maxZ = hingeZ + 0.2
      } else if (d.doorRotationY === -Math.PI / 2) {
        const hingeZ = d.doorPosition[2] - 0.65
        minX = d.doorPosition[0] - 0.1; maxX = d.doorPosition[0] + 1.4
        minZ = hingeZ - 0.2; maxZ = hingeZ + 0.2
      } else if (d.doorRotationY === 0) {
        const hingeX = d.doorPosition[0] - 0.65
        minX = hingeX - 0.2; maxX = hingeX + 0.2
        minZ = d.doorPosition[2] - 1.4; maxZ = d.doorPosition[2] + 0.1
      }
      
      if (vec.x >= minX && vec.x <= maxX && vec.z >= minZ && vec.z <= maxZ) {
        return false // Blocked by physical door panel
      }
    }
  }

  return true
}



function RealisticAvatar({ characterRef, isMoving }) {
  const { scene, animations } = useGLTF('/avatar.glb')
  const { actions } = useAnimations(animations, characterRef)

  useEffect(() => {
    if (!actions) return
    
    // Find the closest matching action names (Walk and Idle)
    const actionNames = Object.keys(actions)
    const walkName = actionNames.find(k => k.toLowerCase().includes('walk'))
    const idleName = actionNames.find(k => k.toLowerCase().includes('idle')) || actionNames[0]
    
    const currentActionName = isMoving ? walkName : idleName
    
    if (currentActionName && actions[currentActionName]) {
      const action = actions[currentActionName]
      action.reset().fadeIn(0.2).play()
      return () => action.fadeOut(0.2)
    }
  }, [isMoving, actions])

  // Scale adjustment if the model is huge or tiny. Soldier.glb is usually roughly scale 1 for human size.
  // We add rotation={[0, Math.PI, 0]} because the model is facing backwards (towards +Z instead of -Z)
  return <primitive object={scene} position={[0, 0, 0]} scale={1.05} rotation={[0, Math.PI, 0]} castShadow />
}

export default function Character() {
  const { camera } = useThree()

  // Facing into the corridor (toward the rooms) by default.
  const cameraYaw = useRef(Math.PI)     // updated by mouse movement (look left/right)
  const moveInput = useRef({ forward: 0, strafe: 0 })

  const setPlayerPosition = usePortfolioStore((s) => s.setPlayerPosition)
  const setNearbyDoor = usePortfolioStore((s) => s.setNearbyDoor)

  const posVec = useRef(new THREE.Vector3(...usePortfolioStore.getState().playerPosition))
  
  // Track teleportation events (loop back)
  const playerPosition = usePortfolioStore((s) => s.playerPosition)

  const characterRef = useRef()
  const [isMoving, setIsMoving] = useState(false)

  useMouseControls(cameraYaw, moveInput)

  useEffect(() => {
    // If the store forcefully updates the player position (e.g. Loop door), sync our local vector
    const dist = posVec.current.distanceTo(new THREE.Vector3(...playerPosition))
    if (dist > 1.0) {
      posVec.current.set(...playerPosition)
      cameraYaw.current = Math.PI
    }
  }, [playerPosition])

  useFrame((_, delta) => {
    // ---- FPS Movement (WASD + Scroll) ----
    const currentlyMoving = moveInput.current.forward !== 0 || moveInput.current.strafe !== 0
    if (currentlyMoving !== isMoving) {
      setIsMoving(currentlyMoving)
    }

    if (currentlyMoving) {
      const forward = new THREE.Vector3(
        Math.sin(cameraYaw.current),
        0,
        Math.cos(cameraYaw.current)
      ).normalize()
      
      const right = new THREE.Vector3(
        Math.sin(cameraYaw.current - Math.PI / 2),
        0,
        Math.cos(cameraYaw.current - Math.PI / 2)
      ).normalize()

      const moveVec = new THREE.Vector3()
      moveVec.addScaledVector(forward, moveInput.current.forward)
      moveVec.addScaledVector(right, moveInput.current.strafe)
      
      if (moveVec.length() > 0) {
        moveVec.normalize()
        
        const nextX = posVec.current.x + moveVec.x * WALK_SPEED * delta
        const nextZ = posVec.current.z + moveVec.z * WALK_SPEED * delta

        // Try X move
        posVec.current.x = nextX
        if (!isPositionValid(posVec.current)) {
          posVec.current.x -= moveVec.x * WALK_SPEED * delta // revert X
        }

        // Try Z move
        posVec.current.z = nextZ
        if (!isPositionValid(posVec.current)) {
          posVec.current.z -= moveVec.z * WALK_SPEED * delta // revert Z
        }

        setPlayerPosition([posVec.current.x, 0, posVec.current.z])
      }
    }

    // ---- Update Character Mesh ----
    if (characterRef.current) {
      characterRef.current.position.set(posVec.current.x, 0, posVec.current.z)
      characterRef.current.rotation.y = cameraYaw.current
    }

    // ---- Camera: Third-Person Perspective (TPP) ----
    // TPP Offset: 2.0 units behind
    const backOffset = new THREE.Vector3(
      -Math.sin(cameraYaw.current),
      0,
      -Math.cos(cameraYaw.current)
    ).multiplyScalar(2.0) 

    const idealCamPos = new THREE.Vector3(
      posVec.current.x + backOffset.x,
      0,
      posVec.current.z + backOffset.z
    )

    // Raycast-like camera collision: if camera is in wall, slide it towards player
    const camVec = idealCamPos.clone()
    if (!isPositionValid(camVec)) {
      const dir = new THREE.Vector3().subVectors(posVec.current, camVec).normalize()
      for (let i = 0; i < 20; i++) {
        camVec.addScaledVector(dir, 0.1)
        if (isPositionValid(camVec)) break
      }
    }

    camera.position.set(
      camVec.x,
      1.7,
      camVec.z
    )

    // Look at the character's head
    camera.lookAt(
      posVec.current.x,
      1.4,
      posVec.current.z
    )

    // ---- Proximity check against doors ----
    let closest = null
    let closestDist = Infinity

    const allDoors = [...ROOMS, LOOP_DOOR, ...INNER_DOORS]
    for (const d of allDoors) {
      const dp = new THREE.Vector3(...d.doorPosition)
      const dist = dp.distanceTo(posVec.current)
      if (dist < closestDist) {
        closestDist = dist
        closest = d.id
      }
    }
    setNearbyDoor(closestDist < DOOR_TRIGGER_DISTANCE ? closest : null)
  })

  return (
    <group ref={characterRef}>
      <RealisticAvatar characterRef={characterRef} isMoving={isMoving} />
    </group>
  )
}

// Called from Door.jsx / App.jsx (via click).
export function handleDoorOpen(doorId, store) {
  store.toggleDoor(doorId)
}

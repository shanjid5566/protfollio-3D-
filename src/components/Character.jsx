import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  usePortfolioStore,
  ROOMS,
  LOOP_DOOR,
  CORRIDOR_BOUNDS,
  ROOM_BOUNDS,
} from '../store'
import { useMouseControls } from '../hooks/useMouseControls'

const WALK_SPEED = 3.2
const DOOR_TRIGGER_DISTANCE = 2.2

function clampToBounds(vec, activeRoomId) {
  if (activeRoomId) {
    const room = ROOMS.find((r) => r.id === activeRoomId)
    const [cx, , cz] = room.roomCenter
    vec.x = THREE.MathUtils.clamp(vec.x, cx + ROOM_BOUNDS.minX, cx + ROOM_BOUNDS.maxX)
    vec.z = THREE.MathUtils.clamp(vec.z, cz + ROOM_BOUNDS.minZ, cz + ROOM_BOUNDS.maxZ)
  } else {
    vec.x = THREE.MathUtils.clamp(vec.x, CORRIDOR_BOUNDS.minX, CORRIDOR_BOUNDS.maxX)
    vec.z = THREE.MathUtils.clamp(vec.z, CORRIDOR_BOUNDS.minZ, CORRIDOR_BOUNDS.maxZ)
  }
}

export default function Character() {
  const { camera } = useThree()

  // Facing into the corridor (toward the rooms) by default.
  const cameraYaw = useRef(Math.PI)     // updated by mouse movement (look left/right)
  const moveInput = useRef(0)           // -1 / 0 / 1 — updated by scroll wheel

  const activeRoomId = usePortfolioStore((s) => s.activeRoomId)
  const setPlayerPosition = usePortfolioStore((s) => s.setPlayerPosition)
  const setNearbyDoor = usePortfolioStore((s) => s.setNearbyDoor)

  const posVec = useRef(new THREE.Vector3(...usePortfolioStore.getState().playerPosition))
  const prevRoomId = useRef(activeRoomId)

  useMouseControls(cameraYaw, moveInput)

  // When enterRoom/exitToCorridor "teleports" the store's playerPosition,
  // sync our local movement vector to match — otherwise it'd keep walking
  // from the old spot.
  useEffect(() => {
    if (activeRoomId !== prevRoomId.current) {
      posVec.current.set(...usePortfolioStore.getState().playerPosition)
      // Reset camera to face forward (-Z direction) when entering a room or returning to start
      cameraYaw.current = Math.PI
      prevRoomId.current = activeRoomId
    }
  }, [activeRoomId])

  useFrame((_, delta) => {
    const currentActiveRoomId = usePortfolioStore.getState().activeRoomId

    // ---- Forward/backward walk, driven by scroll wheel ----
    if (moveInput.current !== 0) {
      const forward = new THREE.Vector3(
        Math.sin(cameraYaw.current),
        0,
        Math.cos(cameraYaw.current)
      )
      const step = WALK_SPEED * delta * moveInput.current
      posVec.current.addScaledVector(forward, step)
      clampToBounds(posVec.current, currentActiveRoomId)
      setPlayerPosition([posVec.current.x, 0, posVec.current.z])
    }

    // ---- Camera: first-person, follows player position, yaw controlled by mouse ----
    const eyeHeight = 1.6
    camera.position.set(posVec.current.x, eyeHeight, posVec.current.z)

    const lookDir = new THREE.Vector3(
      Math.sin(cameraYaw.current),
      0,
      Math.cos(cameraYaw.current)
    )
    camera.lookAt(
      posVec.current.x + lookDir.x,
      eyeHeight,
      posVec.current.z + lookDir.z
    )

    // ---- Proximity check against doors ----
    let closest = null
    let closestDist = Infinity

    if (!currentActiveRoomId) {
      const allDoors = [...ROOMS, LOOP_DOOR]
      for (const d of allDoors) {
        const dp = new THREE.Vector3(...d.doorPosition)
        const dist = dp.distanceTo(posVec.current)
        if (dist < closestDist) {
          closestDist = dist
          closest = d.id
        }
      }
    } else {
      const room = ROOMS.find(r => r.id === currentActiveRoomId)
      if (room) {
        const [cx, cy, cz] = room.roomCenter
        const exitDoorPos = new THREE.Vector3(cx, 0, cz + 4.85)
        closestDist = exitDoorPos.distanceTo(posVec.current)
        closest = 'exit'
      }
    }
    setNearbyDoor(closestDist < DOOR_TRIGGER_DISTANCE ? closest : null)
  })

  return null // the camera itself IS the "character" — pure first-person
}

// Called from Door.jsx when a nearby door is clicked.
export function handleDoorOpen(doorId, store) {
  if (doorId === LOOP_DOOR.id) {
    store.exitToCorridor()
  } else {
    store.enterRoom(doorId)
  }
}

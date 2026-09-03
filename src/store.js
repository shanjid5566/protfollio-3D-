import { create } from 'zustand'

// Room + door layout is defined here — to add a new room, just add an entry
// to ROOMS; Door.jsx and Room.jsx pick it up automatically.
export const ROOMS = [
  {
    id: 'about',
    label: 'About',
    doorPosition: [-3.3, 0, -6],    // left side of the corridor (wall inner face, not center)
    doorRotationY: Math.PI / 2,
    roomCenter: [-8.5, 0, -6],      // physically attached behind the left corridor wall
    accentColor: '#3f4f8a', // blue
  },
  {
    id: 'projects',
    label: 'Projects',
    doorPosition: [3.3, 0, -6],      // right side
    doorRotationY: -Math.PI / 2,
    roomCenter: [8.5, 0, -6],       // physically attached behind the right corridor wall
    accentColor: '#3f6b4a', // green
  },
  {
    id: 'skills',
    label: 'Skills & Tech',
    doorPosition: [-3.3, 0, -16],
    doorRotationY: Math.PI / 2,
    roomCenter: [-8.5, 0, -16],
    accentColor: '#6b3f8a', // purple
  },
]

// Loop-back door at the far end of the corridor
export const LOOP_DOOR = {
  id: 'loop',
  label: 'Back to Start',
  doorPosition: [0, 0, -24.8],
  doorRotationY: 0,
  loopTarget: [0, 0, 5],
  label: 'To Beginning'
}

export const INNER_DOORS = [
  {
    id: 'about_skills',
    label: 'Skills',
    doorPosition: [-8.5, 0, -11], // Shared wall between About and Skills
    doorRotationY: 0,
    roomCenters: [[-8.5, 0, -6], [-8.5, 0, -16]]
  },
  {
    id: 'projects_contact',
    label: 'Contact',
    doorPosition: [8.5, 0, -11], // Shared wall between Projects and Contact
    doorRotationY: 0,
    roomCenters: [[8.5, 0, -6], [8.5, 0, -16]]
  }
]

export const CORRIDOR_BOUNDS = { minX: -2.8, maxX: 2.8, minZ: -24, maxZ: 5.3 }

export function isInCorridor(pos) {
  return (
    pos[0] >= CORRIDOR_BOUNDS.minX &&
    pos[0] <= CORRIDOR_BOUNDS.maxX &&
    pos[2] >= CORRIDOR_BOUNDS.minZ &&
    pos[2] <= CORRIDOR_BOUNDS.maxZ
  )
}

export function isInRoom(pos, roomId) {
  const room = ROOMS.find((r) => r.id === roomId)
  if (!room) return false
  const rxMin = room.roomCenter[0] - 4.2
  const rxMax = room.roomCenter[0] + 4.2
  const rzMin = room.roomCenter[2] - 4.2
  const rzMax = room.roomCenter[2] + 4.2
  return pos[0] >= rxMin && pos[0] <= rxMax && pos[2] >= rzMin && pos[2] <= rzMax
}

export const CORRIDOR_START = [0, 0, 4] // player starts here

export const usePortfolioStore = create((set, get) => ({
  playerPosition: [...CORRIDOR_START],
  nearbyDoorId: null,          // which door (if any) the player is close to
  pointerLocked: false,        // whether mouse-look is currently engaged
  openDoors: [],               // array of currently open door IDs

  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setNearbyDoor: (id) => set({ nearbyDoorId: id }),
  setPointerLocked: (v) => set({ pointerLocked: v }),

  toggleDoor: () => {
    const { nearbyDoorId, openDoors, setPlayerPosition } = get()
    if (!nearbyDoorId) return

    if (nearbyDoorId === LOOP_DOOR.id || nearbyDoorId === 'exit') {
      // Just teleport back to start if it's the loop door or a legacy exit door
      setPlayerPosition([...CORRIDOR_START])
      return
    }

    if (openDoors.includes(nearbyDoorId)) {
      set({ openDoors: openDoors.filter(id => id !== nearbyDoorId) })
    } else {
      set({ openDoors: [...openDoors, nearbyDoorId] })
    }
  },
}))
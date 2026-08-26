import { create } from 'zustand'

// Room + door layout is defined here — to add a new room, just add an entry
// to ROOMS; Door.jsx and Room.jsx pick it up automatically.
export const ROOMS = [
  {
    id: 'about',
    label: 'About',
    doorPosition: [-3.3, 0, -6],    // left side of the corridor (wall inner face, not center)
    doorRotationY: Math.PI / 2,
    roomCenter: [-15, 0, -6],        // rooms live in their own zone, away from the corridor
    playerEntryPoint: [-15, 0, -2],
    accentColor: '#3f4f8a', // blue
  },
  {
    id: 'projects',
    label: 'Projects',
    doorPosition: [3.3, 0, -6],      // right side
    doorRotationY: -Math.PI / 2,
    roomCenter: [15, 0, -6],
    playerEntryPoint: [15, 0, -2],
    accentColor: '#3f6b4a', // green
  },
  {
    id: 'skills',
    label: 'Skills & Tech',
    doorPosition: [-3.3, 0, -16],
    doorRotationY: Math.PI / 2,
    roomCenter: [-15, 0, -16],
    playerEntryPoint: [-15, 0, -12],
    accentColor: '#6b3f8a', // purple
  },
]

// Loop-back door at the far end of the corridor
export const LOOP_DOOR = {
  id: 'loop',
  label: 'Back to Start',
  doorPosition: [0, 0, -24.8],
  doorRotationY: 0,
}
export const CORRIDOR_START = [0, 0, 4] // player starts here

// Walkable-area limits — Character.jsx uses these to stop the player/camera
// from walking through walls (collision), and to keep some breathing room
// from the wall surface so the camera never renders an extreme close-up.
// Keep these in sync with the wall positions in Corridor.jsx / Room.jsx.
export const CORRIDOR_BOUNDS = { minX: -2.8, maxX: 2.8, minZ: -24, maxZ: 5.3 }
export const ROOM_BOUNDS = { minX: -4.1, maxX: 4.1, minZ: -4.1, maxZ: 4.3 }

export const usePortfolioStore = create((set, get) => ({
  playerPosition: [...CORRIDOR_START],
  activeRoomId: null,          // null = in the corridor, otherwise a room id
  nearbyDoorId: null,          // which door (if any) the player is close to
  pointerLocked: false,        // whether mouse-look is currently engaged

  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setNearbyDoor: (id) => set({ nearbyDoorId: id }),
  setPointerLocked: (v) => set({ pointerLocked: v }),

  enterRoom: (roomId) => {
    const room = ROOMS.find((r) => r.id === roomId)
    if (!room) return
    set({
      activeRoomId: roomId,
      playerPosition: [...room.playerEntryPoint],
      nearbyDoorId: null,
    })
  },

  exitToCorridor: () => {
    set({
      activeRoomId: null,
      playerPosition: [...CORRIDOR_START],
    })
  },

  // Called on click. Uses proximity (nearbyDoorId) rather than a cursor-based
  // raycast, since the real cursor is hidden/frozen once pointer-lock is on.
  openNearbyDoor: () => {
    const { nearbyDoorId } = get()
    if (!nearbyDoorId) return
    if (nearbyDoorId === LOOP_DOOR.id || nearbyDoorId === 'exit') {
      get().exitToCorridor()
    } else {
      get().enterRoom(nearbyDoorId)
    }
  },
}))
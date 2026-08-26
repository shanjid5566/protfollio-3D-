import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { usePortfolioStore } from '../store'

export function useMouseControls(cameraYawRef, moveInputRef) {
  const { gl } = useThree()
  const scrollResetTimeout = useRef(null)
  const setPointerLocked = usePortfolioStore((s) => s.setPointerLocked)
  const toggleDoor = usePortfolioStore((s) => s.toggleDoor)

  useEffect(() => {
    const canvas = gl.domElement

    function onClick() {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock()
      } else {
        toggleDoor()
      }
    }

    function onLockChange() {
      setPointerLocked(document.pointerLockElement === canvas)
    }

    function onMouseMove(e) {
      if (document.pointerLockElement !== canvas) return
      cameraYawRef.current -= e.movementX * 0.0025
    }

    function onWheel(e) {
      if (document.pointerLockElement !== canvas) return
      e.preventDefault()
      moveInputRef.current.forward = e.deltaY < 0 ? 1 : -1
      clearTimeout(scrollResetTimeout.current)
      scrollResetTimeout.current = setTimeout(() => {
        moveInputRef.current.forward = 0
      }, 150)
    }

    const keys = { w: false, a: false, s: false, d: false, arrowup: false, arrowdown: false, arrowleft: false, arrowright: false }
    
    function updateMovement() {
      let forward = 0
      let strafe = 0
      if (keys.w || keys.arrowup) forward += 1
      if (keys.s || keys.arrowdown) forward -= 1
      if (keys.a || keys.arrowleft) strafe -= 1
      if (keys.d || keys.arrowright) strafe += 1
      moveInputRef.current.forward = forward
      moveInputRef.current.strafe = strafe
    }

    function onKeyDown(e) {
      if (document.pointerLockElement !== canvas) return
      const key = e.key.toLowerCase()
      if (keys.hasOwnProperty(key)) {
        keys[key] = true
        updateMovement()
      }
    }

    function onKeyUp(e) {
      if (document.pointerLockElement !== canvas) return
      const key = e.key.toLowerCase()
      if (keys.hasOwnProperty(key)) {
        keys[key] = false
        updateMovement()
      }
    }

    canvas.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onLockChange)
    document.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    return () => {
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onLockChange)
      document.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('wheel', onWheel)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      clearTimeout(scrollResetTimeout.current)
    }
  }, [gl, cameraYawRef, moveInputRef, setPointerLocked, toggleDoor])
}
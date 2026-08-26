import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { usePortfolioStore } from '../store'

export function useMouseControls(cameraYawRef, moveInputRef) {
  const { gl } = useThree()
  const scrollResetTimeout = useRef(null)
  const setPointerLocked = usePortfolioStore((s) => s.setPointerLocked)
  const openNearbyDoor = usePortfolioStore((s) => s.openNearbyDoor)

  useEffect(() => {
    const canvas = gl.domElement

    function onClick() {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock()
      } else {
        openNearbyDoor()
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
      e.preventDefault()
      moveInputRef.current = e.deltaY < 0 ? 1 : -1
      clearTimeout(scrollResetTimeout.current)
      scrollResetTimeout.current = setTimeout(() => {
        moveInputRef.current = 0
      }, 150)
    }

    canvas.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onLockChange)
    document.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onLockChange)
      document.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('wheel', onWheel)
      clearTimeout(scrollResetTimeout.current)
    }
  }, [gl, cameraYawRef, moveInputRef, setPointerLocked, openNearbyDoor])
}
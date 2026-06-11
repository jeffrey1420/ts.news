<script setup lang="ts">
import * as THREE from 'three'

const container = ref<HTMLDivElement | null>(null)
const colorMode = useColorMode()

let renderer: THREE.WebGLRenderer | null = null
let frame = 0
let cleanup: (() => void) | null = null

const PALETTE = {
  light: { dots: 0xcfcdc4, knot: 0xf54e00, knotOpacity: 0.35, dotOpacity: 0.8 },
  dark: { dots: 0x3d3a32, knot: 0xff6a1f, knotOpacity: 0.4, dotOpacity: 0.9 },
}

function setup() {
  const el = container.value
  if (!el) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 100)
  camera.position.set(0, 2.2, 9)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(el.clientWidth, el.clientHeight)
  el.appendChild(renderer.domElement)

  // Dot-grid wave: calm paper-like field
  const COLS = 70
  const ROWS = 34
  const SPACING = 0.42
  const count = COLS * ROWS
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const x = (i % COLS) - (COLS - 1) / 2
    const z = Math.floor(i / COLS) - (ROWS - 1) / 2
    positions[i * 3] = x * SPACING
    positions[i * 3 + 1] = 0
    positions[i * 3 + 2] = z * SPACING
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const dotMaterial = new THREE.PointsMaterial({ size: 0.035, transparent: true, depthWrite: false })
  const dots = new THREE.Points(geometry, dotMaterial)
  dots.position.y = -1.4
  scene.add(dots)

  // One quiet voltage: a slowly turning wireframe torus knot
  const knotGeometry = new THREE.TorusKnotGeometry(1.5, 0.42, 140, 18, 2, 3)
  const knotMaterial = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true })
  const knot = new THREE.Mesh(knotGeometry, knotMaterial)
  knot.position.set(3.4, 0.6, 0)
  knot.scale.setScalar(0.9)
  scene.add(knot)

  function applyPalette() {
    const palette = colorMode.value === 'dark' ? PALETTE.dark : PALETTE.light
    dotMaterial.color.setHex(palette.dots)
    dotMaterial.opacity = palette.dotOpacity
    knotMaterial.color.setHex(palette.knot)
    knotMaterial.opacity = palette.knotOpacity
  }
  applyPalette()
  const stopPalette = watch(() => colorMode.value, applyPalette)

  const pointer = { x: 0, y: 0 }
  function onPointerMove(event: MouseEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('mousemove', onPointerMove, { passive: true })

  function onResize() {
    if (!el || !renderer) return
    camera.aspect = el.clientWidth / el.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(el.clientWidth, el.clientHeight)
  }
  window.addEventListener('resize', onResize)

  const clock = new THREE.Clock()
  function tick() {
    const t = clock.getElapsedTime()
    const pos = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      pos.setY(i, Math.sin(x * 0.55 + t * 0.7) * 0.35 + Math.cos(z * 0.7 + t * 0.45) * 0.3)
    }
    pos.needsUpdate = true

    knot.rotation.x = t * 0.12
    knot.rotation.y = t * 0.16

    camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.04
    camera.position.y += (2.2 - pointer.y * 0.5 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)

    renderer!.render(scene, camera)
    frame = requestAnimationFrame(tick)
  }

  if (reducedMotion) {
    renderer.render(scene, camera)
  } else {
    frame = requestAnimationFrame(tick)
  }

  cleanup = () => {
    cancelAnimationFrame(frame)
    stopPalette()
    window.removeEventListener('mousemove', onPointerMove)
    window.removeEventListener('resize', onResize)
    geometry.dispose()
    dotMaterial.dispose()
    knotGeometry.dispose()
    knotMaterial.dispose()
    renderer?.dispose()
    renderer?.domElement.remove()
    renderer = null
  }
}

onMounted(setup)
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="container" class="absolute inset-0 pointer-events-none" aria-hidden="true" />
</template>

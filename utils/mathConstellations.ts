// @ts-ignore — three has no type declarations in this project
import * as THREE from 'three'
import { MATH_FORMULAS } from '~/utils/mathFormulas'

// --- Types ---

interface ConstellationStar {
  position: THREE.Vector3
  formula: string
  formulaId: string
  labelSprite: THREE.Sprite | null
  pointIndex: number
}

interface Constellation {
  name: string
  stars: ConstellationStar[]
  points: THREE.Points
  lines: THREE.Line
}

interface ConstellationResult {
  constellations: Constellation[]
  update: (mouseX: number, mouseY: number) => void
  dispose: () => void
  updateTheme: (isLight: boolean) => void
}

// --- Constants ---

const STAR_SIZE = 6
const STAR_GLOW_SIZE = 14
const LINE_OPACITY = 0.15
const HOVER_RADIUS_PX = 80
const LABEL_SCALE = 12

// Constellation definitions: formula IDs and positions
// Algebra constellation — upper-left area (negative x, positive y)
const ALGEBRA_STARS: { id: string; pos: [number, number, number] }[] = [
  { id: 'euler', pos: [-280, 180, -150] },
  { id: 'pythagoras', pos: [-220, 240, -180] },
  { id: 'quadratic', pos: [-160, 160, -130] },
]

// Calculus constellation — lower-right but avoiding solar system at (120, -40, -200)
// Place at positive x, positive y, far z to avoid conflict
const CALCULUS_STARS: { id: string; pos: [number, number, number] }[] = [
  { id: 'gaussian', pos: [250, 200, -300] },
  { id: 'basel', pos: [310, 140, -260] },
  { id: 'euler-limit', pos: [200, 120, -340] },
]

// --- Helper: create text sprite from canvas ---

function createTextSprite(text: string, color: string): THREE.Sprite {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = 512
  canvas.height = 64

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = '28px monospace'
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(LABEL_SCALE * (canvas.width / canvas.height), LABEL_SCALE, 1)
  return sprite
}

// --- Helper: create glow point texture ---

function createGlowTexture(): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(200,220,255,0.8)')
  gradient.addColorStop(0.5, 'rgba(100,150,255,0.3)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// --- Build a single constellation ---

function buildConstellation(
  name: string,
  starDefs: { id: string; pos: [number, number, number] }[],
  scene: THREE.Scene,
  glowTexture: THREE.CanvasTexture,
  starColor: THREE.Color,
  lineColor: THREE.Color,
): Constellation {
  const formulas = MATH_FORMULAS
  const stars: ConstellationStar[] = []

  // Points geometry
  const positions: number[] = []
  const sizes: number[] = []

  starDefs.forEach((def, i) => {
    const formula = formulas.find(f => f.id === def.id)
    const pos = new THREE.Vector3(...def.pos)
    positions.push(pos.x, pos.y, pos.z)
    sizes.push(STAR_SIZE)

    const labelSprite = createTextSprite(
      formula?.text ?? def.id,
      `#${starColor.getHexString()}`,
    )
    labelSprite.position.copy(pos)
    labelSprite.position.y += 10
    labelSprite.visible = false
    scene.add(labelSprite)

    stars.push({
      position: pos,
      formula: formula?.text ?? def.id,
      formulaId: def.id,
      labelSprite,
      pointIndex: i,
    })
  })

  // Points mesh
  const pointsGeo = new THREE.BufferGeometry()
  pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  pointsGeo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

  const pointsMat = new THREE.PointsMaterial({
    color: starColor,
    size: STAR_GLOW_SIZE,
    map: glowTexture,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })

  const points = new THREE.Points(pointsGeo, pointsMat)
  scene.add(points)

  // Lines connecting stars
  const linePositions: number[] = []
  for (let i = 0; i < stars.length - 1; i++) {
    const a = stars[i]!.position
    const b = stars[i + 1]!.position
    linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z)
  }

  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))

  const lineMat = new THREE.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: LINE_OPACITY,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const lines = new THREE.Line(lineGeo, lineMat)
  scene.add(lines)

  return { name, stars, points, lines }
}

// --- Main export ---

export function addMathConstellations(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
): ConstellationResult {
  const raycaster = new THREE.Raycaster()
  raycaster.params.Points = { threshold: 20 } as any
  const mouse = new THREE.Vector2()

  const glowTexture = createGlowTexture()

  // Colors for dark theme (default)
  let starColor = new THREE.Color(0x88bbff)
  let lineColor = new THREE.Color(0x4488cc)

  const algebraConstellation = buildConstellation(
    'Algebra',
    ALGEBRA_STARS,
    scene,
    glowTexture,
    starColor,
    lineColor,
  )

  const calculusConstellation = buildConstellation(
    'Calculus',
    CALCULUS_STARS,
    scene,
    glowTexture,
    starColor,
    lineColor,
  )

  const constellations = [algebraConstellation, calculusConstellation]

  // Animation state
  let hoveredStar: ConstellationStar | null = null
  let pulseTime = 0

  // --- Update (called each frame) ---
  function update(mouseX: number, mouseY: number): void {
    pulseTime += 0.05
    mouse.set(mouseX, mouseY)
    raycaster.setFromCamera(mouse, camera)

    // Find closest star within hover radius
    let closestStar: ConstellationStar | null = null
    let closestDist = Infinity
    let closestConstellation: Constellation | null = null

    for (const constellation of constellations) {
      const intersects = raycaster.intersectObject(constellation.points)
      if (intersects.length > 0 && intersects[0].distanceToRay !== undefined) {
        // Check screen-space distance for 80px radius
        for (const star of constellation.stars) {
          const screenPos = star.position.clone().project(camera)
          const sx = (screenPos.x * 0.5 + 0.5) * renderer.domElement.clientWidth
          const sy = (1 - (screenPos.y * 0.5 + 0.5)) * renderer.domElement.clientHeight
          const mx = (mouseX * 0.5 + 0.5) * renderer.domElement.clientWidth
          const my = (1 - (mouseY * 0.5 + 0.5)) * renderer.domElement.clientHeight
          const dist = Math.sqrt((sx - mx) ** 2 + (sy - my) ** 2)

          if (dist < HOVER_RADIUS_PX && dist < closestDist) {
            closestDist = dist
            closestStar = star
            closestConstellation = constellation
          }
        }
      }
    }

    // If raycaster didn't intersect, also do a screen-space fallback check
    if (!closestStar) {
      for (const constellation of constellations) {
        for (const star of constellation.stars) {
          const screenPos = star.position.clone().project(camera)
          const sx = (screenPos.x * 0.5 + 0.5) * renderer.domElement.clientWidth
          const sy = (1 - (screenPos.y * 0.5 + 0.5)) * renderer.domElement.clientHeight
          const mx = (mouseX * 0.5 + 0.5) * renderer.domElement.clientWidth
          const my = (1 - (mouseY * 0.5 + 0.5)) * renderer.domElement.clientHeight
          const dist = Math.sqrt((sx - mx) ** 2 + (sy - my) ** 2)

          if (dist < HOVER_RADIUS_PX && dist < closestDist) {
            closestDist = dist
            closestStar = star
            closestConstellation = constellation
          }
        }
      }
    }

    // Reset previous hover state
    if (hoveredStar && hoveredStar !== closestStar) {
      if (hoveredStar.labelSprite) {
        hoveredStar.labelSprite.visible = false
        ;(hoveredStar.labelSprite.material as THREE.SpriteMaterial).opacity = 0
      }
    }

    // Reset all constellations to default
    for (const constellation of constellations) {
      const ptsMat = constellation.points.material as THREE.PointsMaterial
      ptsMat.size = STAR_GLOW_SIZE
      ptsMat.opacity = 0.85

      const lnMat = constellation.lines.material as THREE.LineBasicMaterial
      lnMat.opacity = LINE_OPACITY
    }

    // Apply hover effects
    if (closestStar && closestConstellation) {
      hoveredStar = closestStar

      // Pulsating glow on the constellation's points
      const pulse = 0.5 + 0.5 * Math.sin(pulseTime * 3)
      const ptsMat = closestConstellation.points.material as THREE.PointsMaterial
      ptsMat.size = STAR_GLOW_SIZE + pulse * 6
      ptsMat.opacity = 0.85 + pulse * 0.15

      // Brighten connected lines
      const lnMat = closestConstellation.lines.material as THREE.LineBasicMaterial
      lnMat.opacity = LINE_OPACITY + pulse * 0.2

      // Show label on direct hover (close enough)
      if (closestDist < 40 && closestStar.labelSprite) {
        closestStar.labelSprite.visible = true
        ;(closestStar.labelSprite.material as THREE.SpriteMaterial).opacity =
          0.7 + pulse * 0.3
      }
    } else {
      hoveredStar = null
    }
  }

  // --- Theme update ---
  function updateTheme(isLight: boolean): void {
    starColor = isLight ? new THREE.Color(0x334466) : new THREE.Color(0x88bbff)
    lineColor = isLight ? new THREE.Color(0x445566) : new THREE.Color(0x4488cc)

    for (const constellation of constellations) {
      const ptsMat = constellation.points.material as THREE.PointsMaterial
      ptsMat.color.copy(starColor)
      if (isLight) {
        ptsMat.blending = THREE.NormalBlending
      } else {
        ptsMat.blending = THREE.AdditiveBlending
      }

      const lnMat = constellation.lines.material as THREE.LineBasicMaterial
      lnMat.color.copy(lineColor)
      if (isLight) {
        lnMat.blending = THREE.NormalBlending
      } else {
        lnMat.blending = THREE.AdditiveBlending
      }

      // Rebuild label sprites with new color
      for (const star of constellation.stars) {
        if (star.labelSprite) {
          const oldSprite = star.labelSprite
          const newSprite = createTextSprite(
            star.formula,
            `#${starColor.getHexString()}`,
          )
          newSprite.position.copy(oldSprite.position)
          newSprite.visible = oldSprite.visible
          ;(newSprite.material as THREE.SpriteMaterial).opacity =
            (oldSprite.material as THREE.SpriteMaterial).opacity

          if (isLight) {
            ;(newSprite.material as THREE.SpriteMaterial).blending = THREE.NormalBlending
          }

          scene.remove(oldSprite)
          oldSprite.material.dispose()
          ;(oldSprite.material as THREE.SpriteMaterial).map?.dispose()
          scene.add(newSprite)
          star.labelSprite = newSprite
        }
      }
    }
  }

  // --- Dispose ---
  function dispose(): void {
    for (const constellation of constellations) {
      // Remove points
      scene.remove(constellation.points)
      constellation.points.geometry.dispose()
      ;(constellation.points.material as THREE.PointsMaterial).dispose()

      // Remove lines
      scene.remove(constellation.lines)
      constellation.lines.geometry.dispose()
      ;(constellation.lines.material as THREE.LineBasicMaterial).dispose()

      // Remove label sprites
      for (const star of constellation.stars) {
        if (star.labelSprite) {
          scene.remove(star.labelSprite)
          ;(star.labelSprite.material as THREE.SpriteMaterial).map?.dispose()
          star.labelSprite.material.dispose()
          star.labelSprite = null
        }
      }
    }

    glowTexture.dispose()
    constellations.length = 0
  }

  return { constellations, update, dispose, updateTheme }
}

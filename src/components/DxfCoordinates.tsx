import type React from 'react'
import { type FC, useRef, useState, useEffect, useCallback } from 'react'
import styles from '../styles/styles.module.css'
import type {
  DXFBlock,
  DXFData,
  DXFEntity,
  DxfCoordinatesProps,
  Point,
  SelectionArea,
} from '../types'

export const DxfCoordinates: FC<DxfCoordinatesProps> = ({
  file,
  controller,
  hasToolBar = true,
}) => {
  const { mode, setMode, setAreas, activeAreaIndex, setActiveAreaIndex } =
    controller

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [dxfData, setDxfData] = useState<DXFData | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionAreas, setSelectionAreas] = useState<SelectionArea[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 })
  const [isMovingSelection, setIsMovingSelection] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [currentMousePos, setCurrentMousePos] = useState<Point>({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 })

  const parseDXF = useCallback((content: string): DXFData => {
    const lines = content.split('\n').map((line) => line.trim())
    const entities: DXFEntity[] = []
    const blocks: Record<string, DXFBlock> = {}

    let i = 0
    let inEntitiesSection = false
    let inBlocksSection = false
    let currentBlock: DXFBlock | null = null

    while (i < lines.length) {
      const line = lines[i]

      if (line === 'BLOCKS') {
        inBlocksSection = true
        i++
        continue
      }

      if (line === 'ENTITIES') {
        inEntitiesSection = true
        inBlocksSection = false
        i++
        continue
      }

      if (line === 'ENDSEC') {
        if (inEntitiesSection) {
          inEntitiesSection = false
        }
        if (inBlocksSection) {
          inBlocksSection = false
        }
        i++
        continue
      }

      if (inBlocksSection && line === 'BLOCK') {
        i++
        const blockEntity: DXFBlock = {
          name: '',
          entities: [],
        }

        while (i < lines.length && lines[i] !== '0') {
          const code = Number.parseInt(lines[i])
          const value = lines[i + 1]

          if (code === 2) blockEntity.name = value

          i += 2
        }

        currentBlock = blockEntity
        continue
      }

      if (inBlocksSection && line === 'ENDBLK') {
        if (currentBlock) {
          blocks[currentBlock.name] = currentBlock
          currentBlock = null
        }
        i++
        continue
      }

      if (inEntitiesSection && line === 'INSERT') {
        const entity: DXFEntity = {
          type: 'INSERT',
          layer: '0',
          blockName: '',
          insertionPoint: { x: 0, y: 0 },
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
          rotationAngle: 0,
        }
        i++

        while (i < lines.length && lines[i] !== '0') {
          const code = Number.parseInt(lines[i])
          const value = lines[i + 1]

          if (code === 2) entity.blockName = value
          if (code === 10 && entity.insertionPoint)
            entity.insertionPoint.x = Number.parseFloat(value)
          if (code === 20 && entity.insertionPoint)
            entity.insertionPoint.y = Number.parseFloat(value)
          if (code === 41) entity.scaleX = Number.parseFloat(value)
          if (code === 42) entity.scaleY = Number.parseFloat(value)
          if (code === 43) entity.scaleZ = Number.parseFloat(value)
          if (code === 50) entity.rotationAngle = Number.parseFloat(value)
          if (code === 8) entity.layer = value
          if (code === 62) entity.color = Number.parseInt(value)

          i += 2
        }

        entities.push(entity)
        continue
      }

      if (
        inBlocksSection &&
        currentBlock &&
        (line === 'LINE' ||
          line === 'CIRCLE' ||
          line === 'TEXT' ||
          line === 'MTEXT' ||
          line === 'POLYLINE')
      ) {
        if (line === 'LINE') {
          const entity: DXFEntity = {
            type: 'LINE',
            layer: '0',
            start: { x: 0, y: 0 },
            end: { x: 0, y: 0 },
          }
          i++

          while (i < lines.length && lines[i] !== '0') {
            const code = Number.parseInt(lines[i])
            const value = lines[i + 1]

            if (code === 10 && entity.start)
              entity.start.x = Number.parseFloat(value)
            if (code === 20 && entity.start)
              entity.start.y = Number.parseFloat(value)
            if (code === 11 && entity.end)
              entity.end.x = Number.parseFloat(value)
            if (code === 21 && entity.end)
              entity.end.y = Number.parseFloat(value)
            if (code === 8) entity.layer = value
            if (code === 62) entity.color = Number.parseInt(value)
            if (code === 6) entity.lineType = value
            if (code === 370) entity.lineWeight = Number.parseInt(value)

            i += 2
          }

          currentBlock.entities.push(entity)
          continue
        }

        if (line === 'CIRCLE') {
          const entity: DXFEntity = {
            type: 'CIRCLE',
            layer: '0',
            center: { x: 0, y: 0 },
            radius: 0,
          }
          i++

          while (i < lines.length && lines[i] !== '0') {
            const code = Number.parseInt(lines[i])
            const value = lines[i + 1]

            if (code === 10 && entity.center)
              entity.center.x = Number.parseFloat(value)
            if (code === 20 && entity.center)
              entity.center.y = Number.parseFloat(value)
            if (code === 40) entity.radius = Number.parseFloat(value)
            if (code === 8) entity.layer = value
            if (code === 62) entity.color = Number.parseInt(value)
            if (code === 6) entity.lineType = value
            if (code === 370) entity.lineWeight = Number.parseInt(value)

            i += 2
          }

          currentBlock.entities.push(entity)
          continue
        }

        if (line === 'TEXT' || line === 'MTEXT') {
          const entity: DXFEntity = {
            type: line,
            layer: '0',
            start: { x: 0, y: 0 },
            text: '',
            height: 1,
            rotation: 0,
          }
          i++

          while (i < lines.length && lines[i] !== '0') {
            const code = Number.parseInt(lines[i])
            const value = lines[i + 1]

            if (code === 10 && entity.start)
              entity.start.x = Number.parseFloat(value)
            if (code === 20 && entity.start)
              entity.start.y = Number.parseFloat(value)
            if (code === 1) entity.text = value
            if (code === 40) entity.height = Number.parseFloat(value)
            if (code === 50) entity.rotation = Number.parseFloat(value)
            if (code === 8) entity.layer = value
            if (code === 62) entity.color = Number.parseInt(value)

            i += 2
          }

          currentBlock.entities.push(entity)
          continue
        }

        if (line === 'POLYLINE') {
          const entity: DXFEntity = {
            type: 'POLYLINE',
            layer: '0',
            vertices: [],
          }
          i++

          while (i < lines.length && lines[i] !== '0') {
            const code = Number.parseInt(lines[i])
            const value = lines[i + 1]

            if (code === 8) entity.layer = value
            if (code === 62) entity.color = Number.parseInt(value)
            if (code === 6) entity.lineType = value
            if (code === 370) entity.lineWeight = Number.parseInt(value)

            i += 2
          }

          while (i < lines.length && lines[i] !== 'SEQEND') {
            if (lines[i] === 'VERTEX') {
              i++
              const vertex = { x: 0, y: 0 }
              while (i < lines.length && lines[i] !== '0') {
                const code = Number.parseInt(lines[i])
                const value = lines[i + 1]

                if (code === 10) vertex.x = Number.parseFloat(value)
                if (code === 20) vertex.y = Number.parseFloat(value)

                i += 2
              }
              entity.vertices?.push(vertex)
            } else {
              i++
            }
          }

          currentBlock.entities.push(entity)
          continue
        }
      }

      if (inEntitiesSection && line === 'LINE') {
        const entity: DXFEntity = {
          type: 'LINE',
          layer: '0',
          start: { x: 0, y: 0 },
          end: { x: 0, y: 0 },
        }
        i++

        while (i < lines.length && lines[i] !== '0') {
          const code = Number.parseInt(lines[i])
          const value = lines[i + 1]

          if (code === 10 && entity.start)
            entity.start.x = Number.parseFloat(value)
          if (code === 20 && entity.start)
            entity.start.y = Number.parseFloat(value)
          if (code === 11 && entity.end) entity.end.x = Number.parseFloat(value)
          if (code === 21 && entity.end) entity.end.y = Number.parseFloat(value)
          if (code === 8) entity.layer = value
          if (code === 62) entity.color = Number.parseInt(value) // 色情報
          if (code === 6) entity.lineType = value // 線種
          if (code === 370) entity.lineWeight = Number.parseInt(value) // 線の太さ

          i += 2
        }

        entities.push(entity)
        continue
      }

      if (inEntitiesSection && line === 'CIRCLE') {
        const entity: DXFEntity = {
          type: 'CIRCLE',
          layer: '0',
          center: { x: 0, y: 0 },
          radius: 0,
        }
        i++

        while (i < lines.length && lines[i] !== '0') {
          const code = Number.parseInt(lines[i])
          const value = lines[i + 1]

          if (code === 10 && entity.center)
            entity.center.x = Number.parseFloat(value)
          if (code === 20 && entity.center)
            entity.center.y = Number.parseFloat(value)
          if (code === 40) entity.radius = Number.parseFloat(value)
          if (code === 8) entity.layer = value
          if (code === 62) entity.color = Number.parseInt(value) // 色情報
          if (code === 6) entity.lineType = value // 線種
          if (code === 370) entity.lineWeight = Number.parseInt(value) // 線の太さ

          i += 2
        }

        entities.push(entity)
        continue
      }

      if (inEntitiesSection && (line === 'TEXT' || line === 'MTEXT')) {
        const entity: DXFEntity = {
          type: line,
          layer: '0',
          start: { x: 0, y: 0 },
          text: '',
          height: 1,
          rotation: 0,
        }
        i++

        while (i < lines.length && lines[i] !== '0') {
          const code = Number.parseInt(lines[i])
          const value = lines[i + 1]

          if (code === 10 && entity.start)
            entity.start.x = Number.parseFloat(value)
          if (code === 20 && entity.start)
            entity.start.y = Number.parseFloat(value)
          if (code === 1) entity.text = value // テキスト内容
          if (code === 40) entity.height = Number.parseFloat(value) // テキスト高さ
          if (code === 50) entity.rotation = Number.parseFloat(value) // 回転角度
          if (code === 8) entity.layer = value
          if (code === 62) entity.color = Number.parseInt(value) // 色情報

          i += 2
        }

        entities.push(entity)
        continue
      }

      if (inEntitiesSection && line === 'POLYLINE') {
        const entity: DXFEntity = {
          type: 'POLYLINE',
          layer: '0',
          vertices: [],
        }
        i++

        while (i < lines.length && lines[i] !== '0') {
          const code = Number.parseInt(lines[i])
          const value = lines[i + 1]

          if (code === 8) entity.layer = value
          if (code === 62) entity.color = Number.parseInt(value)
          if (code === 6) entity.lineType = value
          if (code === 370) entity.lineWeight = Number.parseInt(value)

          i += 2
        }

        while (i < lines.length && lines[i] !== 'SEQEND') {
          if (lines[i] === 'VERTEX') {
            i++
            const vertex = { x: 0, y: 0 }
            while (i < lines.length && lines[i] !== '0') {
              const code = Number.parseInt(lines[i])
              const value = lines[i + 1]

              if (code === 10) vertex.x = Number.parseFloat(value)
              if (code === 20) vertex.y = Number.parseFloat(value)

              i += 2
            }
            entity.vertices?.push(vertex)
          } else {
            i++
          }
        }

        entities.push(entity)
        continue
      }

      i++
    }

    return { entities, blocks }
  }, [])

  const findSelectionAreaAtPoint = (point: Point): number => {
    for (let i = selectionAreas.length - 1; i >= 0; i--) {
      if (isPointInSelectionArea(point, selectionAreas[i])) {
        return i
      }
    }
    return -1
  }

  const getResizeHandle = (
    point: Point,
    selection: SelectionArea,
  ): string | null => {
    const handleSize = 12
    const tolerance = handleSize / 2

    const minX = Math.min(selection.start.x, selection.end.x)
    const maxX = Math.max(selection.start.x, selection.end.x)
    const minY = Math.min(selection.start.y, selection.end.y)
    const maxY = Math.max(selection.start.y, selection.end.y)

    if (
      Math.abs(point.x - minX) <= tolerance &&
      Math.abs(point.y - minY) <= tolerance
    )
      return 'nw'
    if (
      Math.abs(point.x - maxX) <= tolerance &&
      Math.abs(point.y - minY) <= tolerance
    )
      return 'ne'
    if (
      Math.abs(point.x - minX) <= tolerance &&
      Math.abs(point.y - maxY) <= tolerance
    )
      return 'sw'
    if (
      Math.abs(point.x - maxX) <= tolerance &&
      Math.abs(point.y - maxY) <= tolerance
    )
      return 'se'

    if (
      Math.abs(point.x - minX) <= tolerance &&
      point.y >= minY &&
      point.y <= maxY
    )
      return 'w'
    if (
      Math.abs(point.x - maxX) <= tolerance &&
      point.y >= minY &&
      point.y <= maxY
    )
      return 'e'
    if (
      Math.abs(point.y - minY) <= tolerance &&
      point.x >= minX &&
      point.x <= maxX
    )
      return 'n'
    if (
      Math.abs(point.y - maxY) <= tolerance &&
      point.x >= minX &&
      point.x <= maxX
    )
      return 's'

    return null
  }

  const isPointInSelectionArea = (
    point: Point,
    selection: SelectionArea,
  ): boolean => {
    const minX = Math.min(selection.start.x, selection.end.x)
    const maxX = Math.max(selection.start.x, selection.end.x)
    const minY = Math.min(selection.start.y, selection.end.y)
    const maxY = Math.max(selection.start.y, selection.end.y)

    return (
      point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
    )
  }

  const calculateBounds = useCallback((entities: DXFEntity[]) => {
    let minX = Number.POSITIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY

    for (const entity of entities) {
      if (entity.type === 'LINE' && entity.start && entity.end) {
        minX = Math.min(minX, entity.start.x, entity.end.x)
        minY = Math.min(minY, entity.start.y, entity.end.y)
        maxX = Math.max(maxX, entity.start.x, entity.end.x)
        maxY = Math.max(maxY, entity.start.y, entity.end.y)
      } else if (entity.type === 'CIRCLE' && entity.center && entity.radius) {
        minX = Math.min(minX, entity.center.x - entity.radius)
        minY = Math.min(minY, entity.center.y - entity.radius)
        maxX = Math.max(maxX, entity.center.x + entity.radius)
        maxY = Math.max(maxY, entity.center.y + entity.radius)
      } else if (entity.type === 'POLYLINE' && entity.vertices) {
        for (const vertex of entity.vertices) {
          minX = Math.min(minX, vertex.x)
          minY = Math.min(minY, vertex.y)
          maxX = Math.max(maxX, vertex.x)
          maxY = Math.max(maxY, vertex.y)
        }
      } else if (
        (entity.type === 'TEXT' || entity.type === 'MTEXT') &&
        entity.start
      ) {
        const textWidth =
          (entity.text?.length || 0) * (entity.height || 1) * 0.6
        minX = Math.min(minX, entity.start.x)
        minY = Math.min(minY, entity.start.y)
        maxX = Math.max(maxX, entity.start.x + textWidth)
        maxY = Math.max(maxY, entity.start.y + (entity.height || 1))
      }
    }

    return {
      min: { x: minX, y: minY },
      max: { x: maxX, y: maxY },
    }
  }, [])

  const getEntityColor = useCallback((colorCode?: number | string): string => {
    if (!colorCode && colorCode !== 0) return '#1f2937' // デフォルト色（濃いグレー）

    const colorPalette: { [key: number]: string } = {
      0: '#1f2937',
      1: '#FF0000',
      2: '#FFFF00',
      3: '#00FF00',
      4: '#00FFFF',
      5: '#0000FF',
      6: '#FF00FF',
      7: '#1f2937',
      8: '#808080',
      9: '#C0C0C0',
      // 必要に応じて追加
    }

    if (typeof colorCode === 'number') {
      const color = colorPalette[colorCode]
      if (color === '#000000') {
        return '#1f2937'
      }
      return color || '#1f2937'
    }

    const colorString = colorCode as string
    if (
      colorString === '#000000' ||
      colorString === '#000' ||
      colorString.toLowerCase() === 'black'
    ) {
      return '#1f2937'
    }

    return colorString
  }, [])

  const getLineWidth = useCallback(
    (lineWeight?: number, baseWidth = 1): number => {
      if (!lineWeight) return baseWidth

      const mmToPixel = 0.1
      return Math.max(0.5, (lineWeight / 100) * mmToPixel * baseWidth)
    },
    [],
  )

  const worldToScreen = useCallback(
    (worldPoint: Point): Point => {
      const canvas = canvasRef.current
      if (!canvas) return worldPoint

      return {
        x: (worldPoint.x + offset.x) * scale + canvas.width / 2,
        y: canvas.height / 2 - (worldPoint.y + offset.y) * scale,
      }
    },
    [offset, scale],
  )

  const screenToWorld = useCallback(
    (screenPoint: Point): Point => {
      const canvas = canvasRef.current
      if (!canvas) return screenPoint

      return {
        x: (screenPoint.x - canvas.width / 2) / scale - offset.x,
        y: -((screenPoint.y - canvas.height / 2) / scale) - offset.y,
      }
    },
    [offset, scale],
  )

  const drawDXF = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#f0f0f0'
    ctx.lineWidth = 1
    const gridSize = 50

    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    if (dxfData?.entities && dxfData.entities.length > 0) {
      for (const entity of dxfData.entities) {
        if (entity.type === 'INSERT' && entity.blockName && dxfData.blocks) {
          const block = dxfData.blocks[entity.blockName]
          if (block && entity.insertionPoint) {
            ctx.save()

            const insertionScreen = worldToScreen(entity.insertionPoint)
            ctx.translate(insertionScreen.x, insertionScreen.y)

            if (entity.rotationAngle) {
              ctx.rotate((entity.rotationAngle * Math.PI) / 180)
            }

            if (entity.scaleX || entity.scaleY) {
              ctx.scale(entity.scaleX || 1, entity.scaleY || 1)
            }

            for (const blockEntity of block.entities) {
              ctx.strokeStyle = getEntityColor(blockEntity.color)
              ctx.fillStyle = getEntityColor(blockEntity.color)
              ctx.lineWidth = getLineWidth(blockEntity.lineWeight, 2)

              if (
                blockEntity.type === 'LINE' &&
                blockEntity.start &&
                blockEntity.end
              ) {
                ctx.beginPath()
                ctx.moveTo(
                  blockEntity.start.x * scale,
                  -blockEntity.start.y * scale,
                )
                ctx.lineTo(
                  blockEntity.end.x * scale,
                  -blockEntity.end.y * scale,
                )
                ctx.stroke()
              } else if (
                blockEntity.type === 'CIRCLE' &&
                blockEntity.center &&
                blockEntity.radius
              ) {
                ctx.beginPath()
                ctx.arc(
                  blockEntity.center.x * scale,
                  -blockEntity.center.y * scale,
                  blockEntity.radius * scale,
                  0,
                  2 * Math.PI,
                )
                ctx.stroke()
              } else if (
                blockEntity.type === 'POLYLINE' &&
                blockEntity.vertices &&
                blockEntity.vertices.length > 0
              ) {
                ctx.beginPath()
                ctx.moveTo(
                  blockEntity.vertices[0].x * scale,
                  -blockEntity.vertices[0].y * scale,
                )
                for (let i = 1; i < blockEntity.vertices.length; i++) {
                  ctx.lineTo(
                    blockEntity.vertices[i].x * scale,
                    -blockEntity.vertices[i].y * scale,
                  )
                }
                ctx.stroke()
              } else if (
                (blockEntity.type === 'TEXT' || blockEntity.type === 'MTEXT') &&
                blockEntity.start &&
                blockEntity.text
              ) {
                const fontSize = Math.max(8, (blockEntity.height || 1) * scale)
                ctx.font = `${fontSize}px Arial`
                ctx.textBaseline = 'bottom'

                ctx.save()
                ctx.translate(
                  blockEntity.start.x * scale,
                  -blockEntity.start.y * scale,
                )
                if (blockEntity.rotation) {
                  ctx.rotate((-blockEntity.rotation * Math.PI) / 180)
                }
                ctx.fillText(blockEntity.text, 0, 0)
                ctx.restore()
              }
            }

            ctx.restore()
          }
          continue
        }

        ctx.strokeStyle = getEntityColor(entity.color)
        ctx.fillStyle = getEntityColor(entity.color)
        ctx.lineWidth = getLineWidth(entity.lineWeight, 2)

        if (entity.type === 'LINE' && entity.start && entity.end) {
          const startScreen = worldToScreen(entity.start)
          const endScreen = worldToScreen(entity.end)

          ctx.beginPath()
          ctx.moveTo(startScreen.x, startScreen.y)
          ctx.lineTo(endScreen.x, endScreen.y)
          ctx.stroke()
        } else if (entity.type === 'CIRCLE' && entity.center && entity.radius) {
          const centerScreen = worldToScreen(entity.center)
          const radiusScreen = entity.radius * scale

          ctx.beginPath()
          ctx.arc(centerScreen.x, centerScreen.y, radiusScreen, 0, 2 * Math.PI)
          ctx.stroke()
        } else if (
          entity.type === 'POLYLINE' &&
          entity.vertices &&
          entity.vertices.length > 0
        ) {
          ctx.beginPath()
          const firstVertex = worldToScreen(entity.vertices[0])
          ctx.moveTo(firstVertex.x, firstVertex.y)

          for (let i = 1; i < entity.vertices.length; i++) {
            const vertex = worldToScreen(entity.vertices[i])
            ctx.lineTo(vertex.x, vertex.y)
          }
          ctx.stroke()
        } else if (
          (entity.type === 'TEXT' || entity.type === 'MTEXT') &&
          entity.start &&
          entity.text
        ) {
          const textScreen = worldToScreen(entity.start)
          const fontSize = Math.max(8, (entity.height || 1) * scale)

          ctx.font = `${fontSize}px Arial`
          ctx.textBaseline = 'bottom'

          ctx.save()
          ctx.translate(textScreen.x, textScreen.y)
          if (entity.rotation) {
            ctx.rotate((-entity.rotation * Math.PI) / 180)
          }

          ctx.fillText(entity.text, 0, 0)
          ctx.restore()
        }
      }
    }

    if (selectionAreas.length > 0 && mode === 'select') {
      selectionAreas.forEach((selectionArea, index) => {
        const isActive = index === activeAreaIndex

        ctx.strokeStyle = '#3b82f6'
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
        ctx.lineWidth = 2
        ctx.setLineDash([8, 4])

        const width = selectionArea.end.x - selectionArea.start.x
        const height = selectionArea.end.y - selectionArea.start.y

        ctx.fillRect(
          selectionArea.start.x,
          selectionArea.start.y,
          width,
          height,
        )
        ctx.strokeRect(
          selectionArea.start.x,
          selectionArea.start.y,
          width,
          height,
        )

        ctx.setLineDash([])

        if (isActive) {
          ctx.fillStyle = '#3b82f6'
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1
          const handleSize = 10

          const minX = Math.min(selectionArea.start.x, selectionArea.end.x)
          const maxX = Math.max(selectionArea.start.x, selectionArea.end.x)
          const minY = Math.min(selectionArea.start.y, selectionArea.end.y)
          const maxY = Math.max(selectionArea.start.y, selectionArea.end.y)
          const centerX = (minX + maxX) / 2
          const centerY = (minY + maxY) / 2

          const handles = [
            { x: minX, y: minY },
            { x: maxX, y: minY },
            { x: minX, y: maxY },
            { x: maxX, y: maxY },
            { x: minX, y: centerY },
            { x: maxX, y: centerY },
            { x: centerX, y: minY },
            { x: centerX, y: maxY },
          ]

          for (const handle of handles) {
            ctx.fillRect(
              handle.x - handleSize / 2,
              handle.y - handleSize / 2,
              handleSize,
              handleSize,
            )
            ctx.strokeRect(
              handle.x - handleSize / 2,
              handle.y - handleSize / 2,
              handleSize,
              handleSize,
            )
          }
        }
      })
    }
  }, [
    dxfData,
    scale,
    selectionAreas,
    activeAreaIndex,
    mode,
    worldToScreen,
    getLineWidth,
    getEntityColor,
  ])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' && activeAreaIndex >= 0) {
        const newSelectionAreas = selectionAreas.filter(
          (_, index) => index !== activeAreaIndex,
        )
        setSelectionAreas(newSelectionAreas)

        if (newSelectionAreas.length === 0) {
          setActiveAreaIndex(-1)
        } else if (activeAreaIndex >= newSelectionAreas.length) {
          setActiveAreaIndex(newSelectionAreas.length - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectionAreas, activeAreaIndex, setActiveAreaIndex])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return

      const rect = parent.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      setTimeout(() => {
        drawDXF()
      }, 10)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [drawDXF])

  useEffect(() => {
    drawDXF()
  }, [drawDXF])

  useEffect(() => {
    setAreas(
      selectionAreas.map((area) => ({
        x: Math.min(area.worldStart.x, area.worldEnd.x),
        y: Math.min(area.worldStart.y, area.worldEnd.y),
        width: Math.abs(area.worldEnd.x - area.worldStart.x),
        height: Math.abs(area.worldEnd.y - area.worldStart.y),
      })),
    )
  }, [selectionAreas, setAreas])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleWheel = (event: WheelEvent) => {
      if (selectionAreas.length > 0) return

      event.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      const mousePos = {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      }

      const worldPos = screenToWorld(mousePos)

      const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.max(0.1, Math.min(10, scale * scaleFactor))

      setScale(newScale)

      // スケール変更後の新しいワールド座標を計算
      const newWorldPos = {
        x: (mousePos.x - canvas.width / 2) / newScale - offset.x,
        y: -((mousePos.y - canvas.height / 2) / newScale) - offset.y,
      }

      const newOffset = {
        x: offset.x + (worldPos.x - newWorldPos.x),
        y: offset.y + (worldPos.y - newWorldPos.y),
      }

      setOffset(newOffset)
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [scale, offset, selectionAreas.length, screenToWorld])

  const loadDxfFromStore = useCallback(async () => {
    if (!file) return

    try {
      const content = await file.text()
      const parsed = parseDXF(content)

      if (parsed.entities.length === 0) {
        throw new Error('DXFファイルにエンティティが見つかりません')
      }

      setDxfData(parsed)

      const bounds = calculateBounds(parsed.entities)
      const canvas = canvasRef.current
      if (canvas && bounds) {
        const width = bounds.max.x - bounds.min.x
        const height = bounds.max.y - bounds.min.y
        const scaleX = (canvas.width * 0.8) / width
        const scaleY = (canvas.height * 0.8) / height
        const newScale = Math.min(scaleX, scaleY, 2)

        setScale(newScale)
        setOffset({
          x: -(bounds.min.x + bounds.max.x) / 2,
          y: -(bounds.min.y + bounds.max.y) / 2,
        })
      }
    } catch (err) {
      console.error('DXFファイルの解析に失敗:', err)
      setDxfData(null)
    }
  }, [parseDXF, calculateBounds, file])

  useEffect(() => {
    loadDxfFromStore()
  }, [loadDxfFromStore])

  const getMousePos = (event: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const mousePos = getMousePos(event)

    if (event.button === 0) {
      if (mode === 'pan') {
        setIsDragging(true)
        setDragStart(mousePos)
      } else if (mode === 'select') {
        const activeArea =
          activeAreaIndex >= 0 ? selectionAreas[activeAreaIndex] : null

        if (activeArea) {
          const handle = getResizeHandle(mousePos, activeArea)
          if (handle) {
            setIsResizing(true)
            setResizeHandle(handle)
            setDragStart(mousePos)
            return
          }
        }

        const clickedIndex = findSelectionAreaAtPoint(mousePos)
        if (clickedIndex >= 0) {
          setActiveAreaIndex(clickedIndex)
          setIsMovingSelection(true)
          setDragStart(mousePos)
          return
        }

        setIsSelecting(true)
        const worldPos = screenToWorld(mousePos)
        const newSelection: SelectionArea = {
          start: mousePos,
          end: mousePos,
          worldStart: worldPos,
          worldEnd: worldPos,
        }

        const newIndex = selectionAreas.length
        setSelectionAreas([...selectionAreas, newSelection])
        setActiveAreaIndex(newIndex)
      }
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const mousePos = getMousePos(event)
    setCurrentMousePos(mousePos)

    if (isDragging && mode === 'pan') {
      const dx = (mousePos.x - dragStart.x) / scale
      const dy = -(mousePos.y - dragStart.y) / scale
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
      setDragStart(mousePos)
    } else if (isSelecting && activeAreaIndex >= 0 && mode === 'select') {
      const worldPos = screenToWorld(mousePos)
      const updatedAreas = [...selectionAreas]
      updatedAreas[activeAreaIndex] = {
        ...updatedAreas[activeAreaIndex],
        end: mousePos,
        worldEnd: worldPos,
      }
      setSelectionAreas(updatedAreas)
    } else if (
      isResizing &&
      activeAreaIndex >= 0 &&
      resizeHandle &&
      mode === 'select'
    ) {
      const activeArea = selectionAreas[activeAreaIndex]
      const minX = Math.min(activeArea.start.x, activeArea.end.x)
      const maxX = Math.max(activeArea.start.x, activeArea.end.x)
      const minY = Math.min(activeArea.start.y, activeArea.end.y)
      const maxY = Math.max(activeArea.start.y, activeArea.end.y)

      let newMinX = minX
      let newMaxX = maxX
      let newMinY = minY
      let newMaxY = maxY

      switch (resizeHandle) {
        case 'nw':
          newMinX = mousePos.x
          newMinY = mousePos.y
          break
        case 'ne':
          newMaxX = mousePos.x
          newMinY = mousePos.y
          break
        case 'sw':
          newMinX = mousePos.x
          newMaxY = mousePos.y
          break
        case 'se':
          newMaxX = mousePos.x
          newMaxY = mousePos.y
          break
        case 'n':
          newMinY = mousePos.y
          break
        case 's':
          newMaxY = mousePos.y
          break
        case 'w':
          newMinX = mousePos.x
          break
        case 'e':
          newMaxX = mousePos.x
          break
      }

      const minSize = 20
      if (
        Math.abs(newMaxX - newMinX) < minSize ||
        Math.abs(newMaxY - newMinY) < minSize
      ) {
        return
      }

      const updatedAreas = [...selectionAreas]
      updatedAreas[activeAreaIndex] = {
        start: { x: newMinX, y: newMinY },
        end: { x: newMaxX, y: newMaxY },
        worldStart: screenToWorld({ x: newMinX, y: newMinY }),
        worldEnd: screenToWorld({ x: newMaxX, y: newMaxY }),
      }
      setSelectionAreas(updatedAreas)
    } else if (isMovingSelection && activeAreaIndex >= 0 && mode === 'select') {
      const activeArea = selectionAreas[activeAreaIndex]
      const dx = mousePos.x - dragStart.x
      const dy = mousePos.y - dragStart.y

      const updatedAreas = [...selectionAreas]
      updatedAreas[activeAreaIndex] = {
        start: {
          x: activeArea.start.x + dx,
          y: activeArea.start.y + dy,
        },
        end: {
          x: activeArea.end.x + dx,
          y: activeArea.end.y + dy,
        },
        worldStart: screenToWorld({
          x: activeArea.start.x + dx,
          y: activeArea.start.y + dy,
        }),
        worldEnd: screenToWorld({
          x: activeArea.end.x + dx,
          y: activeArea.end.y + dy,
        }),
      }
      setSelectionAreas(updatedAreas)
      setDragStart(mousePos)
    }
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
    setIsMovingSelection(false)
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  // const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
  //   if (selectionAreas.length > 0) return

  //   event.preventDefault()
  //   const mousePos = getMousePos(event)
  //   const worldPos = screenToWorld(mousePos)

  //   const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1
  //   const newScale = Math.max(0.1, Math.min(10, scale * scaleFactor))

  //   const newWorldPos = screenToWorld(mousePos)
  //   const newOffset = {
  //     x: offset.x + (worldPos.x - newWorldPos.x),
  //     y: offset.y + (worldPos.y - newWorldPos.y),
  //   }

  //   setScale(newScale)
  //   setOffset(newOffset)
  // }

  const getCursorStyle = () => {
    if (mode === 'pan') {
      return isDragging ? 'grabbing' : 'grab'
    }
    if (mode === 'select') {
      if (activeAreaIndex >= 0 && !isSelecting && !isMovingSelection) {
        const activeArea = selectionAreas[activeAreaIndex]
        const handle = getResizeHandle(currentMousePos, activeArea)
        if (handle) {
          switch (handle) {
            case 'nw':
            case 'se':
              return 'nwse-resize'
            case 'ne':
            case 'sw':
              return 'nesw-resize'
            case 'n':
            case 's':
              return 'ns-resize'
            case 'w':
            case 'e':
              return 'ew-resize'
          }
        }

        if (isPointInSelectionArea(currentMousePos, activeArea)) {
          return 'move'
        }
      }

      if (findSelectionAreaAtPoint(currentMousePos) >= 0) {
        return 'move'
      }

      return 'crosshair'
    }
    return 'default'
  }

  return (
    <div className={styles.container}>
      {hasToolBar && (
        <div className={styles.toolbar}>
          <div className={styles.fixedButtonContainer}>
            <div className={styles.buttonGroup}>
              <button
                type='button'
                onClick={() => setMode('pan')}
                className={`${styles.button} ${mode === 'pan' ? styles.buttonActive : ''}`}
              >
                移動
              </button>
              <button
                type='button'
                onClick={() => setMode('select')}
                className={`${styles.button} ${mode === 'select' ? styles.buttonActive : ''}`}
              >
                選択
              </button>
            </div>
            {file && !!selectionAreas.length && (
              <div className={styles.selectionInfo}>
                <p color='text.secondary'>
                  x:{' '}
                  {Math.min(
                    selectionAreas[activeAreaIndex].worldStart.x,
                    selectionAreas[activeAreaIndex].worldEnd.x,
                  ).toFixed(2)}
                </p>
                <p color='text.secondary'>|</p>
                <p color='text.secondary'>
                  y:{' '}
                  {Math.min(
                    selectionAreas[activeAreaIndex].worldStart.y,
                    selectionAreas[activeAreaIndex].worldEnd.y,
                  ).toFixed(2)}
                </p>
                <p color='text.secondary'>|</p>
                <p color='text.secondary'>
                  width:{' '}
                  {Math.abs(
                    selectionAreas[activeAreaIndex].worldEnd.x -
                      selectionAreas[activeAreaIndex].worldStart.x,
                  ).toFixed(2)}
                </p>
                <p color='text.secondary'>|</p>
                <p color='text.secondary'>
                  height:{' '}
                  {Math.abs(
                    selectionAreas[activeAreaIndex].worldEnd.y -
                      selectionAreas[activeAreaIndex].worldStart.y,
                  ).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.mainContent}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          style={{ cursor: getCursorStyle() }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  )
}

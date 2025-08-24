import type { DxfCoordinatesHook } from '../hooks/useDxfCoordinates'

export interface DXFEntity {
  type: string
  layer: string
  color?: number | string
  lineType?: string
  lineWeight?: number
  text?: string
  height?: number
  rotation?: number
  vertices?: Array<{ x: number; y: number; z?: number }>
  start?: { x: number; y: number; z?: number }
  end?: { x: number; y: number; z?: number }
  center?: { x: number; y: number; z?: number }
  radius?: number
  startAngle?: number
  endAngle?: number
  blockName?: string
  insertionPoint?: { x: number; y: number; z?: number }
  scaleX?: number
  scaleY?: number
  scaleZ?: number
  rotationAngle?: number
}

export interface DXFHeader {
  [key: string]: string | number | boolean | null
}

export interface DXFTable {
  [key: string]: string | number | Record<string, unknown>
}

export interface DXFBlock {
  name: string
  entities: DXFEntity[]
  [key: string]: unknown
}

export interface DXFData {
  entities: DXFEntity[]
  header?: DXFHeader
  tables?: Record<string, DXFTable>
  blocks?: Record<string, DXFBlock>
}

export interface Point {
  x: number
  y: number
}

export interface SelectionArea {
  start: Point
  end: Point
  worldStart: Point
  worldEnd: Point
}

export type Mode = 'pan' | 'select'

export interface Area {
  x: number
  y: number
  width: number
  height: number
}

export type DxfCoordinatesProps = {
  file: File | null
  controller: DxfCoordinatesHook
  hasToolBar?: boolean
}

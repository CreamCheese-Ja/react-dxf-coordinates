import { useState } from 'react'
import type { Area, Mode } from '../types'

export const useDxfViewer = () => {
  const [mode, setMode] = useState<Mode>('select')
  const [areas, setAreas] = useState<Area[]>([])
  const [activeAreaIndex, setActiveAreaIndex] = useState<number>(-1)

  return {
    mode,
    setMode,
    areas,
    setAreas,
    activeAreaIndex,
    setActiveAreaIndex,
  }
}

export type DxfViewerHook = ReturnType<typeof useDxfViewer>

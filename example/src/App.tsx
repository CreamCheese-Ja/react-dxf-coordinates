import { useState } from 'react'
import { DxfViewer, useDxfViewer } from 'react-dxf-viewer'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const dxfState = useDxfViewer()
  console.log(dxfState.areas)

  return (
    <>
      <input
        type='file'
        accept='.dxf'
        onChange={(e) => {
          const file = e.target.files?.[0] || null
          setFile(file)
        }}
      />
      <DxfViewer file={file} controller={dxfState} />
    </>
  )
}

export default App

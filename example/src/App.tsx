import { useState } from 'react'
import { DxfCoordinates, useDxfCoordinates } from 'react-dxf-coordinates'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const dxfState = useDxfCoordinates()
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
      <DxfCoordinates file={file} controller={dxfState} />
    </>
  )
}

export default App

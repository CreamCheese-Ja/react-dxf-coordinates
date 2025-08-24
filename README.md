# React DXF Coordinates

<div align="center">

![dxf-sample](https://github.com/user-attachments/assets/05a6e930-1b85-4c28-96ed-c763f4a40f52)


[![npm version](https://badge.fury.io/js/react-dxf-coordinates.svg)](https://badge.fury.io/js/react-dxf-coordinates) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)


**A powerful, lightweight React component for viewing DXF files with interactive area selection and coordinate extraction.**

[Features](#features) • [Installation](#installation) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Examples](#examples) • [Contributing](#contributing)

</div>

---

## ✨ Features

- 🎯 **Interactive Area Selection** - Click and drag to select areas on DXF drawings
- 📍 **Real-time Coordinate Tracking** - Get mouse coordinates as you move
- ⚡ **TypeScript Support** - Built with TypeScript for type safety
- 🪝 **Custom Hooks** - Powerful `useDxfCoordinates` hook for state management
- 🔧 **Zero Dependencies** - Lightweight with minimal external dependencies
- 🚀 **Performance Optimized** - Smooth interactions even with complex drawings

## 🚀 Installation

```bash
npm install react-dxf-coordinates
```

```bash
yarn add react-dxf-coordinates
```

```bash
pnpm add react-dxf-coordinates
```

## ⚡ Quick Start

```tsx
import React from 'react'
import { DxfCoordinates, useDxfCoordinates } from 'react-dxf-coordinates'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const dxfState = useDxfCoordinates()

  console.log(dxfState.areas)

  return (
    <div>
      <input
        type='file'
        accept='.dxf'
        onChange={(e) => {
          const file = e.target.files?.[0] || null
          setFile(file)
        }}
      />

      <DxfCoordinates file={file} controller={dxfState} />
    </div>
  )
}

export default App
```

## 📖 Documentation

### Components

#### `<DxfCoordinates />`

The main component for rendering DXF files with interactive capabilities.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `file` | `File` | **required** | `.dxf` file
| `controller` | `UseDxfCoordinatesReturn` | **required** | Controller object from `useDxfCoordinates` hook |
| `hasToolBar` | `boolean` | `true` | Show toolbar |

### Hooks

#### `useDxfCoordinates()`

A powerful hook that provides state management and controls for the DXF coordinates.

**Returns:**

```typescript
type DxfCoordinatesHook = {
  mode: Mode
  setMode: React.Dispatch<React.SetStateAction<Mode>>
  areas: Area[]
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>
  activeAreaIndex: number;
  setActiveAreaIndex: React.Dispatch<React.SetStateAction<number>>
}
```

### Types

```typescript
type Mode = 'pan' | 'select'

interface Area {
  x: number
  y: number
  width: number
  height: number
}
```

## 📋 Examples

### Basic Usage

```tsx
import { DxfCoordinates, useDxfCoordinates } from 'react-dxf-coordinates'

function BasicExample() {
  const [file, setFile] = useState<File | null>(null)
  const dxfState = useDxfCoordinates()

  return (
    <DxfCoordinates file={file} controller={dxfState} />
  )
}
```

## 🛠️ Development

### Prerequisites

- Node.js 22.0.0 or higher
- npm, yarn, or pnpm

### Setting up development environment

```bash
git clone https://github.com/CreamCheese-Ja/react-dxf-coordinates.git
cd react-dxf-coordinates
npm install
```

### Running the example

```bash
npm run example
```

### Building the library

```bash
npm run build
```

## 📄 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Reporting Issues

Please use the [GitHub Issues](https://github.com/CreamCheese-Ja/react-dxf-coordinates/issues) page to report bugs or request features.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the React and CAD communities
- Inspired by the need for better DXF visualization tools in web applications
- Thanks to all contributors who help make this project better

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/CreamCheese-Ja/react-dxf-coordinates?style=social)
![GitHub forks](https://img.shields.io/github/forks/CreamCheese-Ja/react-dxf-coordinates?style=social)
![GitHub issues](https://img.shields.io/github/issues/CreamCheese-Ja/react-dxf-coordinates)
![GitHub pull requests](https://img.shields.io/github/issues-pr/CreamCheese-Ja/react-dxf-coordinates)

---

<div align="center">

**[⬆ Back to Top](#react-dxf-coordinates)**

Made with ❤️ by [CreamCheese-Ja](https://github.com/CreamCheese-Ja)

</div>

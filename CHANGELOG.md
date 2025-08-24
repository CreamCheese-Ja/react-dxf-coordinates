# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-08-24

### Added
- Initial release of React DXF Coordinates
- Interactive DXF file viewing component (`<DxfCoordinates />`)
- Custom React hook for state management (`useDxfCoordinates`)
- Real-time coordinate tracking on mouse movement
- Area selection functionality with drag-and-drop
- TypeScript support with full type definitions
- Automatic CSS injection (no manual imports needed)
- CSS Modules for scoped styling
- Modern build pipeline with Rollup and Vite

### Features
- **DxfCoordinates Component**: Canvas-based interactive viewer
- **Area Selection**: Click and drag to select rectangular areas
- **Coordinate Extraction**: Real-time mouse coordinate tracking
- **State Management**: Comprehensive hook with selection history
- **TypeScript**: Full type safety and IntelliSense support
- **Zero Config CSS**: Styles automatically injected into DOM

### Technical
- Built with TypeScript 5.6+
- Supports React 17+ and 18+
- Rollup for optimized bundling
- CSS Modules with automatic class name generation
- Vite development environment for fast iteration

### Known Limitations
- No automated tests yet
- Limited error handling
- API may change in future versions
- Basic functionality only (no zoom, pan, etc.)
- No DXF file parsing (displays placeholder content)

[Unreleased]: https://github.com/CreamCheese-Ja/react-dxf-coordinates/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/CreamCheese-Ja/react-dxf-coordinates/releases/tag/v0.1.0
# Contributing to React DXF Coordinates

Thank you for your interest in contributing to React DXF Coordinates! We welcome contributions from everyone. This document provides guidelines and information for contributors.

## 🤝 How to Contribute

There are many ways to contribute to this project:

- **Report bugs** by opening issues
- **Suggest new features** or improvements
- **Submit pull requests** with bug fixes or new features
- **Improve documentation** and examples
- **Help other users** by answering questions in issues

## 🐛 Reporting Bugs

Before creating a bug report, please check the [existing issues](https://github.com/CreamCheese-Ja/react-dxf-coordinates/issues) to see if the problem has already been reported.

### Bug Report Template

When filing a bug report, please include:

- **Clear title** that summarizes the issue
- **Environment details**:
  - React DXF Coordinates version
  - React version
  - Node.js version
  - Browser version (if applicable)
  - Operating system
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Code sample** or minimal reproduction case
- **Screenshots** if applicable

### Example Bug Report

**Bug**: Canvas not updating when selectedAreas changes

**Environment**:
- react-dxf-coordinates: 1.0.0
- React: 18.2.0
- Node.js: 22.0.0
- Chrome: 120.0.0
- macOS 14.0

**Steps to reproduce**:
1. Create a DxfCoordinates with useDxfCoordinates hook
2. Select multiple areas
3. Call clearAllAreas()
4. Canvas still shows selected areas

**Expected**: Canvas should clear all selections
**Actual**: Canvas retains visual selections

## 💡 Feature Requests

We love hearing about new ideas! When suggesting a feature:

1. **Check existing issues** for similar requests
2. **Describe the problem** you're trying to solve
3. **Explain your proposed solution** with examples
4. **Consider backwards compatibility** and breaking changes
5. **Provide use cases** where this feature would be beneficial

## 🔧 Development Setup

### Prerequisites

- **Node.js 22.0.0 or higher**
- **npm 10.0.0 or higher**
- **Git**

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/react-dxf-coordinates.git
   cd react-dxf-coordinates
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up the example app**:
   ```bash
   npm run example:install
   ```

5. **Start development**:
   ```bash
   # Terminal 1: Build library in watch mode
   npm run dev
   
   # Terminal 2: Run example app
   npm run example
   ```

6. **Make your changes** and test them in the example app

### Project Structure

```
react-dxf-coordinates/
├── src/                    # Library source code
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript type definitions
│   └── index.ts           # Main export file
├── example/               # Development example app
├── dist/                  # Built library (generated)
├── rollup.config.js       # Build configuration
├── biome.json            # Linting and formatting
└── tsconfig.json         # TypeScript configuration
```

## 📝 Coding Standards

We use [Biome](https://biomejs.dev/) for linting and formatting. Please ensure your code follows our standards:

### Code Style

- **TypeScript**: All code should be written in TypeScript
- **Functional components**: Use functional components with hooks
- **Named exports**: Prefer named exports over default exports
- **Interface naming**: Use PascalCase for interfaces (e.g., `DxfCoordinatesProps`)
- **File naming**: Use PascalCase for components, camelCase for utilities

### Formatting

```bash
# Check formatting
npm run check

# Fix formatting issues
npm run format:fix

# Fix linting issues  
npm run lint:fix
```

### Type Safety

- Always provide proper TypeScript types
- Avoid `any` types (use `unknown` if necessary)
- Export all public interfaces from `src/types/index.ts`
- Use strict TypeScript configuration

## 📤 Submitting Changes

### Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test your changes** thoroughly

4. **Update documentation** if needed (README.md, TypeScript types, etc.)

5. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "feat: add coordinate snapping functionality"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Pull Request Template

When creating a PR, please include:

- **Clear title** describing the change
- **Description** of what changed and why
- **Breaking changes** (if any)
- **Testing notes** for reviewers
- **Screenshots** (if UI changes)
- **Related issues** (closes #123)

## 📋 Code Review Process

1. **Automated checks** must pass (linting, type checking, build)
2. **Manual review** by maintainers
3. **Feedback** may be provided for improvements
4. **Approval** required before merging
5. **Squash and merge** will be used to maintain clean history

### Review Criteria

- Code follows project standards
- Changes are well-tested
- Documentation is updated
- No breaking changes (unless justified)
- Performance impact considered

## 🚀 Release Process

Releases are handled by maintainers:

1. Version bump following [Semantic Versioning](https://semver.org/)
2. Update CHANGELOG.md
3. Create GitHub release
4. Publish to npm

## 📚 Documentation

When contributing, please update relevant documentation:

- **README.md**: For user-facing changes
- **TypeScript types**: For API changes
- **Code comments**: For complex logic
- **Example app**: For new features

## 🤔 Questions?

If you have questions about contributing:

1. **Check existing issues** and discussions
2. **Create a new issue** with the "question" label
3. **Start a discussion** on GitHub Discussions (if available)

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- **Be respectful** in all interactions
- **Use inclusive language**
- **Focus on constructive feedback**
- **Help create a positive community**

## 🙏 Recognition

All contributors will be recognized in our README.md and release notes. We appreciate every contribution, no matter how small!

## 📄 License

By contributing to React DXF Coordinates, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to React DXF Coordinates! 🎉
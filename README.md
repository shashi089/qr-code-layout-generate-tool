# QR Layout Workspace

A powerful, monorepo-based tool for designing, generating, and printing QR code layouts. This project provides both a core library for programmatic generation and a user-friendly UI for visual design.

## Packages

This repository is organized as a monorepo containing:

- **[`qrlayout-core`](./packages/core)**: The core rendering engine capable of generating layouts in PNG, PDF, and ZPL formats. It can be used as a standalone library in your own projects.
- **`packages/ui`**: The source code for the web-based visual editor. This is a local application for designing layouts, not currently published to npm.

## Getting Started

Follow these instructions to set up the project locally for development or usage.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v8+ with workspaces support)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/shashi089/qr-code-layout-generate-tool.git
cd qr-code-layout-generate-tool
npm install
```

### Running the Application

To start the visual editor (UI) locally:

```bash
npm run dev:ui
```

This will start the development server. Open the URL shown in your terminal (usually `http://localhost:5173`) to access the editor.

### Building

To build the packages for production:

**Build Core Library:**
```bash
npm run build:core
```

**Build UI Application:**
```bash
npm run build:ui
```

**Build All:**
```bash
npm run build
```

## Contributing

Contributions are welcome! If you'd like to improve the core engine or the UI, please feel free to fork the repository and submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

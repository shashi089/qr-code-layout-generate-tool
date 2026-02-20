# QR Layout Tool

**A powerful, professional-grade engine for designing, rendering, and printing QR code layouts.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/qrlayout-core.svg?label=qrlayout-core)](https://www.npmjs.com/package/qrlayout-core)
[![npm version](https://img.shields.io/npm/v/qrlayout-ui.svg?label=qrlayout-ui)](https://www.npmjs.com/package/qrlayout-ui)
[![Typescript](https://img.shields.io/badge/TypeScript-Enabled-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Live Demos

Explore the capabilities of `qrlayout-core` & `qrlayout-ui` through our framework-specific implementations:

| Framework | Live Demo | Source Code |
| :--- | :--- | :--- |
| **React** | [Live Demo](https://qr-layout-designer.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/react-demo) |
| **Svelte 5** | [Live Demo](https://qr-layout-designer-svelte.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/svelte-demo) |
| **Vue 3** | [Live Demo](https://qr-layout-designer-vue.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/vue-demo) |

![QR Layout Designer Screenshot](./assets/layout_designer.png)

## 🛠 Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white" alt="Svelte" />
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

---

## 📖 Overview

**QR Layout Tool** is a comprehensive solution for developers building applications that require dynamic, printable labels, stickers, or badges. Unlike traditional QR generators that output single images, this tool provides a robust framework for composing **complex layouts** that integrate text, multiple QR codes, images, and dynamic data fields.

### Why Choose QR Layout Tool?

- **Visual Precision**: Design layouts with a professional drag-and-drop interface via `qrlayout-ui`.
- **Industrial Standards**: Built-in support for **ZPL (Zebra Programming Language)**, enabling direct output to industrial thermal printers.
- **Multi-Format Export**: High-fidelity **PDF** and **PNG** export for office environments and digital sharing.
- **Dynamic Data Binding**: Advanced "Mail Merge" capabilities. Define templates with `{{handlebars}}` syntax and batch-generate thousands of personalized labels.
- **High Performance**: Optimized rendering engine that runs efficiently in the browser and Node.js environments.

## 🏗 Project Structure

This project is managed as a high-performance monorepo using **npm workspaces**:

- **`packages/core`**: The headless rendering engine. Handles Layout JSON parsing, data merging, and output generation (Canvas, ZPL, PDF).
- **`packages/ui`**: A framework-agnostic, embeddable Layout Designer. Provides the visual interface for layout creation.
- **`examples/`**: Reference implementations for React, Vue, and Svelte.

## 📦 Packages

| Package | Version | Description | Links |
| :--- | :--- | :--- | :--- |
| **`qrlayout-core`** | [![npm](https://img.shields.io/npm/v/qrlayout-core.svg)](https://www.npmjs.com/package/qrlayout-core) | Headless rendering & logic engine | [Docs](./packages/core/README.md) |
| **`qrlayout-ui`** | [![npm](https://img.shields.io/npm/v/qrlayout-ui.svg)](https://www.npmjs.com/package/qrlayout-ui) | Interactive visual designer | [Docs](./packages/ui/README.md) |

## 🎯 Use Cases

- **Logistics & Warehousing**: Standardized ZPL shipping labels for Zebra printers.
- **Event Management**: High-speed generation of personalized attendee badges.
- **Inventory Control**: SKU and product labeling with QR/Barcode integration.
- **Visitor Passes**: Real-time pass generation with dynamic security data.

## ⌨️ Quick Start

### 1. Headless Generation (Core)

```javascript
import { StickerPrinter } from "qrlayout-core";

const layout = { /* Layout JSON */ };
const data = { name: "Asset #421", sku: "QR-PRO-99" };

const printer = new StickerPrinter();
const zpl = printer.exportToZPL(layout, [data]); 
```

### 2. Embedded Designer (UI)

```javascript
import { QRLayoutDesigner } from "qrlayout-ui";
import "qrlayout-ui/style.css";

const designer = new QRLayoutDesigner({
    element: document.getElementById("editor"),
    onSave: (layout) => console.log("Layout Saved:", layout)
});
```

## 🛠 Development

### Setup
```bash
git clone https://github.com/shashi089/qr-code-layout-generate-tool.git
cd qr-code-layout-generate-tool
npm install
```

### Run UI Demo
```bash
npm run dev:ui
```

### Build
```bash
npm run build:core
npm run build:ui
```

## 📚 Documentation

- [Core Engine API Reference](./packages/core/README.md)
- [UI Designer Integration Guide](./packages/ui/README.md)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## 👤 Author

**Shashidhar Naik**
- GitHub: [@shashi089](https://github.com/shashi089)

## 📄 License

MIT © [Shashidhar Naik](https://github.com/shashi089)

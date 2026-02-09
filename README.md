# QR Layout Tool

**A powerful, professional-grade engine for designing, rendering, and printing QR code layouts.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/qrlayout-core.svg?label=qrlayout-core)](https://www.npmjs.com/package/qrlayout-core)
[![npm version](https://img.shields.io/npm/v/qrlayout-ui.svg?label=qrlayout-ui)](https://www.npmjs.com/package/qrlayout-ui)
[![Typescript](https://img.shields.io/badge/TypeScript-Enabled-blue.svg)](https://www.typescriptlang.org/)

Live demos of `qrlayout-core` & `qrlayout-ui` built with React, Svelte, and Vue

**[React Live Demo ](https://qr-layout-designer.netlify.app/)** 

**[Svelte Live Demo ](https://qr-layout-designer-svelte.netlify.app/)**

**[Vue Live Demo](https://qr-layout-designer-vue.netlify.app/)**


![QR Layout Designer Screenshot](./assets/layout_designer.png)

---

## Overview

**QR Layout Tool** is a complete solution for developers building applications that need to generate dynamic, printable labels, stickers, or badges containing QR codes. Unlike simple "QR generators" that just output a single image, this tool allows you to design composed **layouts** with text, multiple QR codes, images, and dynamic data fields.

It is structured as a monorepo consisting of a core rendering engine and a visual designer UI.

### Why use QR Layout Tool?

- **Visual Design**: Build layouts with a drag-and-drop interface (via `qrlayout-ui`).
- **Industrial Ready**: Native **ZPL (Zebra Programming Language)** export for thermal label printers.
- **Print Perfect**: High-quality **PDF** and **PNG** export for standard office printers.
- **Dynamic Data**: Built-in "Mail Merge" functionality. Design once with placeholders like `{{name}}` or `{{sku}}` and batch generate thousands of unique labels.
- **Edge Utility**: Runs entirely in the browser or Node.js. No heavy server processing required.

## Packages

| Package | Description | Version | Links |
| :--- | :--- | :--- | :--- |
| **[qrlayout-core](https://www.npmjs.com/package/qrlayout-core)** | The headless rendering engine. Handles Layout JSON parsing, data merging, and rendering to Canvas, ZPL, or PDF. Use this if you just need to generate files. | [![npm](https://img.shields.io/npm/v/qrlayout-core.svg)](https://www.npmjs.com/package/qrlayout-core) | [Docs](./packages/core/README.md) |
| **[qrlayout-ui](https://www.npmjs.com/package/qrlayout-ui)** | An embeddable Layout Designer. Provides a polished `QRLayoutDesigner` class and React components to let *your* users design their own labels inside your app. | [![npm](https://img.shields.io/npm/v/qrlayout-ui.svg)](https://www.npmjs.com/package/qrlayout-ui) | [Docs](./packages/ui/README.md) |

## Use Cases

- **Event Management**: Generate conference badges with unique attendee QR codes and names.
- **Inventory Systems**: Print sticky labels for products with SKU, Description, and Scannable Barcodes/QRs.
- **Visitor Management**: Create temporary visitor passes on the fly.
- **Logistics**: Generate industry-standard ZPL code for shipping labels to be sent directly to Zebra printers.

## Installation & Usage

### 1. Using the Core Engine (Server or Client)

If you only need to *generate* layouts:

```bash
npm install qrlayout-core
```

```javascript
import { StickerPrinter } from "qrlayout-core";

const layout = { ... }; // Your Layout JSON
const data = { name: "Office Laptop", sku: "OL-M3-14" };

const printer = new StickerPrinter();
const zpl = printer.exportToZPL(layout, [data]); 
// Output: ^XA^FO... (Ready for printer)
```

### 2. Using the Visual Designer (Frontend)

If you want to embed the designer in your React/Vue/Angular app:

```bash
npm install qrlayout-ui qrlayout-core
```

```javascript
import { QRLayoutDesigner } from "qrlayout-ui";
import "qrlayout-ui/style.css";

const designer = new QRLayoutDesigner({
    element: document.getElementById("editor"),
    initialLayout: myLayout,
    onSave: (layout) => saveToDb(layout)
});
```

## Development

This repository uses **npm workspaces**.

### 1. Setup
```bash
git clone https://github.com/shashi089/qr-code-layout-generate-tool.git
cd qr-code-layout-generate-tool
npm install
```

### 2. Run the UI Demo
To start the local development server for the UI package and the demo app:
```bash
npm run dev:ui
```
This typically starts on `http://localhost:5173`.

### 3. Build Libraries
```bash
# Build Core
npm run build:core

# Build UI
npm run build:ui
```

## detailed Documentation
- [Core Documentation & API Reference](./packages/core/README.md)
- [UI Documentation & Integration Guide](./packages/ui/README.md)

## NPM Packages
- [qrlayout-ui](https://www.npmjs.com/package/qrlayout-ui)
- [qrlayout-core](https://www.npmjs.com/package/qrlayout-core)

## Contributing

Contributions are welcome! Please fork the repository and open a pull request.
1. Fork it
2. Create your feature branch (`git checkout -b feature/cool-feature`)
3. Commit your changes (`git commit -am 'Add some cool feature'`)
4. Push to the branch (`git push origin feature/cool-feature`)
5. Create a new Pull Request

## License

MIT © [Shashidhar Naik](https://github.com/shashi089)

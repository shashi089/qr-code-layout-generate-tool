# QR Layout Workspace

This repo contains two packages:

- `@qrlayout/core`: the rendering/printing engine (PNG, PDF, ZPL).
- `@qrlayout/ui`: the browser editor UI (drag/drop layout designer).

## Prerequisites

- Node.js 18+ recommended
- npm 8+ (workspaces enabled)

## Install

```bash
npm install
```

## Run the editor UI

```bash
npm run dev:ui
```

Then open the local URL shown by Vite.

## Build

```bash
npm run build:core
npm run build:ui
```

Or build everything:

```bash
npm run build
```

## Package usage

### Core (library)

```ts
import { StickerPrinter, type StickerLayout } from "@qrlayout/core";

const layout: StickerLayout = {
  id: "layout-1",
  name: "Badge",
  width: 100,
  height: 60,
  unit: "mm",
  elements: [
    { id: "title", type: "text", x: 0, y: 5, w: 100, h: 10, content: "CONFERENCE PASS" },
    { id: "name", type: "text", x: 5, y: 25, w: 60, h: 10, content: "{{name}}" },
    { id: "qr", type: "qr", x: 70, y: 20, w: 25, h: 25, content: "{{uuid}}" }
  ]
};

const data = { name: "John Doe", uuid: "https://example.com" };
const printer = new StickerPrinter();

// Browser canvas preview
const canvas = document.getElementById("preview-canvas") as HTMLCanvasElement;
await printer.renderToCanvas(layout, data, canvas);

// PNG
const png = await printer.renderToDataURL(layout, data, { format: "png" });

// PDF
const pdf = await printer.exportToPDF(layout, [data]);
pdf.save("stickers.pdf");

// ZPL
const zpl = printer.exportToZPL(layout, [data]);
console.log(zpl[0]);
```

### UI (editor)

The UI package runs the editor with drag/resize controls. Use:

```bash
npm run dev:ui
```

The editor lets you design layouts, preview with sample JSON, and export PNG/PDF/ZPL.

## Publish (core)

```bash
npm run build:core
npm login
cd packages/core
npm publish --access public
```

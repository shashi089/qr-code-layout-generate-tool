# @qrlayout/core

Print-ready QR label layout engine. Build a label template with text/QR/image blocks, then export as PNG, PDF, or ZPL.

## Install

```bash
npm install @qrlayout/core
```

## Quick start

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

## Layout schema

```ts
type Unit = "mm" | "px" | "cm" | "in";
type ElementType = "text" | "qr" | "image";

interface StickerElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  content: string; // supports {{placeholders}}
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string | number;
    textAlign?: "left" | "center" | "right";
    color?: string;
    backgroundColor?: string;
  };
}

interface StickerLayout {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: Unit;
  elements: StickerElement[];
  backgroundColor?: string;
  backgroundImage?: string;
}
```

## Outputs

- `renderToCanvas` for live preview in the browser
- `renderToDataURL` for PNG/JPEG/WebP export
- `exportToPDF` for print-ready PDF (optional)
- `exportToZPL` for Zebra printers

## Optional PDF export

PDF export is isolated in a separate entry so users can avoid the `jspdf` dependency unless needed.

```ts
import { exportToPDF } from "@qrlayout/core/pdf";
```

If `jspdf` is not installed, `StickerPrinter.exportToPDF()` will throw a clear error.

## Notes

- Text alignment is horizontal only (left/center/right).
- For ZPL, images are not embedded (text and QR only).
- When using external images in the browser, CORS headers are required or the canvas export will fail.

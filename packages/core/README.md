# qrlayout-core

A powerful, framework-agnostic QR code layout engine for designing and printing QR code stickers and labels. Create pixel-perfect layouts with text and QR codes, and export them to **PNG**, **PDF**, or **ZPL** (Zebra Programming Language).

> [!NOTE]
> This package is the core rendering engine. For a visual drag-and-drop designer, check out **[qrlayout-ui](../ui/README.md)**.
> It is a **Framework-Agnostic** embeddable UI component that works with **React, Vue, Angular, Svelte, and Vanilla JS**.
>
> Visit our **[Live Demo](https://qr-layout-designer.netlify.app/)** to see it in action.


## Features

-  **Precise Layouts**: Define stickers in `mm`, `cm`, `in`, or `px`.
-  **Multiple Formats**: Export to Canvas (preview), PNG/JPEG (image), PDF (print), or ZPL (industrial thermal printers).
-  **Dynamic Content**: Use variable placeholders (e.g., `{{name}}`, `{{visitorId}}`) to batch generate unique stickers.
-  **Lightweight**: Minimal dependencies. PDF export is optional to keep bundle size small.

## Keywords

QR code, qrcode, qr-code, layout, sticker, label, generator, renderer, PDF, ZPL, barcode, thermal printer.

## Live Demo & Examples

- **[Interactive Demo](https://qr-layout-designer.netlify.app/)**: A full-featured designer built with `qrlayout-core` and `qrlayout-ui`.
- **[React Demo Source Code](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/ui-react)**: Reference implementation for monorepo usage.

## Installation

```bash
npm install qrlayout-core
```

## Quick Start

### 1. Define a Layout

A layout is a JSON object describing the sticker dimensions and elements.

```ts
import { type StickerLayout } from "qrlayout-core";

const myLayout: StickerLayout = {
  id: "badge-layout",
  name: "Conference Badge",
  width: 100, // 100mm width
  height: 60, // 60mm height
  unit: "mm",
  elements: [
    { 
        id: "title", 
        type: "text", 
        x: 0, y: 5, w: 100, h: 10, 
        content: "VISITOR PASS",
        style: { fontSize: 14, fontWeight: "bold", textAlign: "center" }
    },
    { 
        id: "name", 
        type: "text", 
        x: 5, y: 25, w: 60, h: 10, 
        content: "{{name}}", // Placeholder
        style: { fontSize: 12 }
    },
    { 
        id: "qr-code", 
        type: "qr", 
        x: 70, y: 20, w: 25, h: 25, 
        content: "{{visitorId}}" // Placeholder
    }
  ]
};
```

### 2. Render or Export

Pass data to the `StickerPrinter` to generate outputs.

```ts
import { StickerPrinter } from "qrlayout-core";

// Data to fill placeholders
const data = { 
    name: "Priyanka Verma", 
    visitorId: "https://example.com/visitors/priyanka" 
};

const printer = new StickerPrinter();

// --- Option A: Render to HTML Canvas (Browser) ---
const canvas = document.querySelector("#preview") as HTMLCanvasElement;
await printer.renderToCanvas(myLayout, data, canvas);

// --- Option B: Get an Image URL (PNG) ---
const imageUrl = await printer.renderToDataURL(myLayout, data, { format: "png", dpi: 300 });
console.log(imageUrl); // "data:image/png;base64,..."

// --- Option C: Generate ZPL for Thermal Printers ---
const zplCommands = printer.exportToZPL(myLayout, [data]);
console.log(zplCommands[0]); // "^XA^FO..."

```

## PDF Export (Optional)

To enable PDF export, you must install `jspdf`. This is an optional peer dependency to prevent bloating the core library for users who don't need PDF support.

### 1. Install jspdf

```bash
npm install jspdf
```

### 2. Use the PDF Module

```ts
import { exportToPDF } from "qrlayout-core/pdf";

// Generate a PDF with multiple stickers (e.g., standard A4 sheet logic can be handled by caller, 
// this function currently outputs one page per sticker or as configured).
const pdfDoc = await exportToPDF(myLayout, [data, data2, data3]);

// Save the PDF
pdfDoc.save("badges.pdf");
```

## API Reference

### `StickerLayout` Interface

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the layout. |
| `name` | `string` | Human-readable name of the layout. |
| `width` | `number` | Width of the sticker. |
| `height` | `number` | Height of the sticker. |
| `unit` | `"mm" \| "cm" \| "in" \| "px"` | Unit of measurement. |
| `elements` | `StickerElement[]` | List of items on the sticker. |
| `backgroundColor` | `string` | (Optional) Background color hex. |
| `backgroundImage` | `string` | (Optional) Background image URL. |

### `StickerElement` Interface

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the element. |
| `type` | `"text" \| "qr"` | Type of element. |
| `x`, `y` | `number` | Position from top-left. |
| `w`, `h` | `number` | Width and height. |
| `content` | `string` | Text, URL, source. Supports `{{key}}` syntax. |
| `qrSeparator` | `string` | (Optional) Separator used to join consecutive `{{variables}}` (e.g., `|`, `,`). |
| `style.fontFamily` | `string` | Font family (e.g., 'sans-serif', 'Inter'). |
| `style.fontSize` | `number` | Font size (px). |
| `style.fontWeight` | `string \| number` | Font weight (e.g., 'bold', 700). |
| `style.textAlign` | `"left" \| "center" \| "right"` | Horizontal alignment. |
| `style.verticalAlign` | `"top" \| "middle" \| "bottom"` | Vertical alignment. |
| `style.color` | `string` | Text color hex code. |
| `style.backgroundColor` | `string` | Background color for the element. |

## License

MIT

# qrlayout-core

A high-performance, framework-agnostic QR code layout engine designed for professional sticker and label generation. Create pixel-perfect layouts with text, QR codes, and dynamic data, with native support for **PNG**, **PDF**, and **ZPL** (Zebra Programming Language).

> [!TIP]
> This package contains the headless rendering logic. For an interactive visual designer, use **[`qrlayout-ui`](../ui/README.md)**.
> It works seamlessly across **React, Vue, Angular, Svelte, and Vanilla JS**.

## 🚀 Live Demos & Examples

| Framework | Live Demo | Source Code |
| :--- | :--- | :--- |
| **React** | [Live Demo](https://qr-layout-designer.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/react-demo) |
| **Svelte 5** | [Live Demo](https://qr-layout-designer-svelte.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/svelte-demo) |
| **Vue 3** | [Live Demo](https://qr-layout-designer-vue.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/vue-demo) |

## ✨ Core Features

- **Industrial Precision**: Define layouts in `mm`, `cm`, `in`, or `px`.
- **ZPL Support**: Direct export to Zebra Programming Language for thermal printers.
- **Batched Processing**: Generate thousands of unique labels from a single template using dynamic data binding.
- **Hardware Agnostic**: Renders to Canvas (Browser), Buffer (Node.js), or professional document formats.

## 📦 Installation

```bash
npm install qrlayout-core
```

## ⌨️ Quick Start

### 1. Define a Template
A layout is a robust JSON schema defining dimensions and elements.

```typescript
import { type StickerLayout } from "qrlayout-core";

const template: StickerLayout = {
  id: "asset-tag",
  name: "Asset Label",
  width: 100, 
  height: 60,
  unit: "mm",
  elements: [
    { 
        id: "header", 
        type: "text", 
        x: 0, y: 5, w: 100, h: 10, 
        content: "PROPERTY OF CORP",
        style: { fontSize: 14, fontWeight: "bold", textAlign: "center" }
    },
    { 
        id: "id-qr", 
        type: "qr", 
        x: 35, y: 20, w: 30, h: 30, 
        content: "{{assetId}}" 
    }
  ]
};
```

### 2. Generate Output
Use the `StickerPrinter` to render the template with real data.

```typescript
import { StickerPrinter } from "qrlayout-core";

const printer = new StickerPrinter();
const data = { assetId: "https://audit.co/ID-9921" };

// Render to Canvas for UI preview
await printer.renderToCanvas(template, data, myCanvasElement);

// Export to ZPL for thermal printing
const [zpl] = printer.exportToZPL(template, [data]);
```

## 📄 PDF Support (Optional)

PDF export is provided as an optional module to keep the core bundle lightweight.

```bash
npm install jspdf
```

```typescript
import { exportToPDF } from "qrlayout-core/pdf";

const pdf = await exportToPDF(template, [data1, data2]);
pdf.save("labels.pdf");
```

## 📖 API Specification

### `StickerLayout` Attributes

| Attribute | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier for the layout. |
| `name` | `string` | Human-readable label name. |
| `width`, `height` | `number` | Physical dimensions. |
| `unit` | `mm \| cm \| in \| px` | Unit of measure. |
| `elements` | `StickerElement[]` | Array of visual components. |
| `backgroundColor` | `string` | (Optional) Background fill color hex. |
| `backgroundImage` | `string` | (Optional) Background image URL. |

### `StickerElement` Attributes

| Attribute | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier for the element. |
| `type` | `text \| qr` | Component type. |
| `content` | `string` | Text content or template (e.g. `{{name}}`). |
| `x`, `y`, `w`, `h` | `number` | Position and size (top-left origin). |
| `qrSeparator` | `string` | Separator for joining consecutive `{{variables}}`. |
| `style.fontFamily` | `string` | Font family (e.g. `'Inter'`, `'sans-serif'`). |
| `style.fontSize` | `number` | Font size in pixels. |
| `style.fontWeight` | `string \| number` | Font weight (e.g. `'bold'`, `700`). |
| `style.textAlign` | `left \| center \| right` | Horizontal text alignment. |
| `style.verticalAlign` | `top \| middle \| bottom` | Vertical text alignment. |
| `style.color` | `string` | Text color hex. |
| `style.backgroundColor` | `string` | Element background color hex. |

## 📄 License

MIT

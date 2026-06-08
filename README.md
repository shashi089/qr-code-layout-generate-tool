# QR Layout Tool

**The open-source QR code label designer for developers. Design once, print everywhere.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/qrlayout-core.svg?label=qrlayout-core)](https://www.npmjs.com/package/qrlayout-core)
[![npm version](https://img.shields.io/npm/v/qrlayout-ui.svg?label=qrlayout-ui)](https://www.npmjs.com/package/qrlayout-ui)
[![npm downloads](https://img.shields.io/npm/dm/qrlayout-core.svg?label=core+downloads)](https://www.npmjs.com/package/qrlayout-core)
[![npm downloads](https://img.shields.io/npm/dm/qrlayout-ui.svg?label=ui+downloads)](https://www.npmjs.com/package/qrlayout-ui)
[![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Stars](https://img.shields.io/github/stars/shashi089/qr-code-layout-generate-tool?style=social)](https://github.com/shashi089/qr-code-layout-generate-tool/stargazers)

> If this project saves you time, please consider giving it a ⭐ — it helps others find it!

---

## 🚀 Live Demos

Try the designer live — no signup required:

| Framework | Live Demo | Source Code |
| :--- | :--- | :--- |
| **React** | [▶ Open Demo](https://react-qr-label-designer.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/react-qr-label-demo) |
| **Angular** | [▶ Open Demo](https://qr-layout-designer-angular-demo.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/angular-demo) |
| **Svelte 5** | [▶ Open Demo](https://qr-layout-designer-svelte.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/svelte-demo) |
| **Vue 3** | [▶ Open Demo](https://qr-layout-designer-vue.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/vue-demo) |

![QR Layout Designer Screenshot](./assets/layout_designer.png)

---

## 📖 What Is This?

**QR Layout Tool** is a complete solution for building applications that generate dynamic, printable QR code labels, stickers, and badges. Unlike basic QR generators that produce a single image, this tool gives you a full layout engine with a visual designer, data binding, and multi-format export.

It is split into **two focused npm packages**:

| Package | Purpose |
| :--- | :--- |
| [`qrlayout-core`](https://www.npmjs.com/package/qrlayout-core) | Headless rendering engine — use in any JS/TS project |
| [`qrlayout-ui`](https://www.npmjs.com/package/qrlayout-ui) | Embeddable drag-and-drop visual designer |

### Why choose QR Layout Tool?

- 🖨️ **Industrial-grade output**: Direct ZPL export for Zebra thermal printers
- 📦 **Mail-merge style batching**: Generate thousands of unique labels from one template with `{{variable}}` syntax
- 🌐 **Truly framework-agnostic**: Works with React, Vue, Angular, Svelte, or plain HTML — no framework lock-in
- 📄 **Multi-format**: High-fidelity PDF, PNG, and ZPL from the same layout definition
- ⚡ **Lightweight**: Zero heavy dependencies in `qrlayout-core`; renders on Canvas in the browser or Buffer in Node.js

---

## 🛠 Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white" alt="Svelte" />
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
</p>

---

## ⚡ Quick Start

### Option 1: Headless (Core only)
Use the rendering engine directly — no UI needed.

```bash
npm install qrlayout-core
```

```typescript
import { StickerPrinter } from "qrlayout-core";

const printer = new StickerPrinter();

const layout = {
  id: "badge",
  name: "Employee Badge",
  width: 100, height: 60, unit: "mm",
  elements: [
    { id: "name", type: "text", x: 5, y: 5, w: 90, h: 12, content: "{{name}}", style: { fontSize: 16, fontWeight: "bold" } },
    { id: "qr",   type: "qr",   x: 35, y: 20, w: 30, h: 30, content: "{{id}}" }
  ]
};

// Batch generate 3 labels and export to ZPL for a thermal printer
const zplPages = printer.exportToZPL(layout, [
  { name: "Alice",   id: "EMP-001" },
  { name: "Bob",     id: "EMP-002" },
  { name: "Charlie", id: "EMP-003" },
]);
```

### Option 2: Embedded Visual Designer (UI)
Drop a full drag-and-drop designer into any web app.

```bash
npm install qrlayout-ui qrlayout-core
```

```typescript
import { QRLayoutDesigner } from "qrlayout-ui";
import "qrlayout-ui/style.css";

const designer = new QRLayoutDesigner({
  element: document.getElementById("editor"),
  onSave: (layout) => {
    // Save layout JSON to your backend
    console.log("Saved:", layout);
  }
});
```

### PDF Export (optional)

```bash
npm install jspdf
```

```typescript
import { exportToPDF } from "qrlayout-core/pdf";

const pdf = await exportToPDF(layout, [data1, data2]);
pdf.save("badges.pdf");
```

---

## 💾 How It Works — Design, Save, Print

The layout JSON output from `qrlayout-ui` is your single source of truth. **Store it in your database, load it back anytime, and pass it with real records to `qrlayout-core` to generate labels.**

```
  User designs in qrlayout-ui
          │
          │  onSave(layout JSON)
          ▼
  Your database / backend       ← store the layout JSON like any other record
          │
          │  fetch layout + your real data (employees, machines, assets…)
          ▼
  qrlayout-core (StickerPrinter)  ← merges data into the template
          │
          ├── exportToPNG()   → download as image
          ├── exportToPDF()   → printable PDF (batch)
          └── exportToZPL()   → send to Zebra thermal printer
```

```typescript
// 1. Save the layout from the designer
onSave: async (layout) => {
  await fetch("/api/layouts", { method: "POST", body: JSON.stringify(layout) });
}

// 2. Later — fetch the saved layout and your real data, then print
const layout  = await fetch("/api/layouts/employee-badge").then(r => r.json());
const records = await fetch("/api/employees").then(r => r.json());

const printer = new StickerPrinter();
const pdf = await printer.exportToPDF(layout, records);
pdf.save("badges.pdf");
```

> [!NOTE]
> **About the live demo apps** — Each framework demo ([React](https://react-qr-label-designer.netlify.app/), [Angular](https://qr-layout-designer-angular-demo.netlify.app/), [Svelte](https://qr-layout-designer-svelte.netlify.app/), [Vue](https://qr-layout-designer-vue.netlify.app/)) comes with pre-built sample layouts and demo records so you can explore every feature without any setup.
>
> All data is stored **only in your browser's `localStorage`** — nothing is sent to any server. Clearing browser storage resets the demo to its defaults. Your layouts and data never leave your browser.

---

## 🎯 Use Cases

| Industry | Example |
| :--- | :--- |
| 🏭 **Manufacturing & Warehousing** | ZPL shipping labels for Zebra printers |
| 🎟️ **Events & Conferences** | Personalized attendee badge generation |
| 🏥 **Healthcare** | Patient wristbands and asset tagging |
| 📦 **Inventory & Retail** | SKU labels with QR codes linking to product pages |
| 🏢 **HR & Access Control** | Employee ID cards and visitor passes |
| 🔧 **MRO / Maintenance** | Machine asset tags with scannable maintenance history links |

---

## 🏗 Project Structure

This monorepo is managed with **npm workspaces**:

```
qr-code-layout-generate-tool/
├── packages/
│   ├── core/          # qrlayout-core — headless rendering engine
│   └── ui/            # qrlayout-ui  — visual drag-and-drop designer
└── examples/
    ├── react-qr-label-demo/          # React + Vite wrapper showcase app
    ├── react-demo/    # Legacy React + Vite reference app
    ├── angular-demo/  # Angular 19 reference app
    ├── svelte-demo/   # Svelte 5 reference app
    └── vue-demo/      # Vue 3 reference app
```

---

## 📦 Packages

| Package | Version | Description | Docs |
| :--- | :--- | :--- | :--- |
| **`qrlayout-core`** | [![npm](https://img.shields.io/npm/v/qrlayout-core.svg)](https://www.npmjs.com/package/qrlayout-core) | Headless rendering & logic engine | [API Reference](./packages/core/README.md) |
| **`qrlayout-ui`** | [![npm](https://img.shields.io/npm/v/qrlayout-ui.svg)](https://www.npmjs.com/package/qrlayout-ui) | Interactive visual designer | [Integration Guide](./packages/ui/README.md) |

---

## 🛠 Development

```bash
# Clone the repo
git clone https://github.com/shashi089/qr-code-layout-generate-tool.git
cd qr-code-layout-generate-tool

# Install all workspace dependencies
npm install

# Run the UI in dev mode (live preview)
npm run dev:ui

# Build all packages
npm run build:core
npm run build:ui
```

---

## 📚 Documentation

- 📘 [Core Engine API Reference](./packages/core/README.md)
- 🎨 [UI Designer Integration Guide](./packages/ui/README.md)

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Found a bug or have an idea? [Open an Issue →](https://github.com/shashi089/qr-code-layout-generate-tool/issues)

---

## 👤 Author

**Shashidhar Naik**
- GitHub: [@shashi089](https://github.com/shashi089)

---

## 📄 License

MIT © [Shashidhar Naik](https://github.com/shashi089)

---

<p align="center">
  <b>If this project helped you, please give it a ⭐ on GitHub!</b><br/>
  It helps more developers discover the tool.
</p>

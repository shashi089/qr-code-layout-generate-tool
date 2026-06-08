# react-qr-label

> 🌐 **Live Showcase Application**: [react-qr-label-designer.netlify.app](https://react-qr-label-designer.netlify.app/)

**An embeddable, framework-agnostic visual drag-and-drop QR label designer for React.**

`react-qr-label` is the official React wrapper for the `qrlayout` ecosystem. It lets you embed a fully responsive, professional label editor directly into your React application. Users can layout text blocks and QR codes, bind variables (`{{fields}}`), preview layouts with real sample records, and export templates to JSON.

Once designed, you can use the headless `qrlayout-core` engine to merge your layouts with database records and print in bulk to **PDF, PNG, or ZPL (Zebra thermal printers)**.

---

## ✨ Features

- **Drag & Drop Canvas:** Fluidly reposition and resize elements (text and QR codes) on a customizable canvas.
- **Dynamic Data Binding:** Inject template tags (e.g. `{{fullName}}`, `{{sku}}`) directly into text blocks or QR codes.
- **Multiple Variable QR Codes:** Combine multiple database fields into a single QR scan (e.g., `id|name|dept`).
- **Aesthetic Dark Mode:** Integrated dark theme that follows system settings or can be toggled by the user.
- **Performance Optimized:** Uses React callback refs to handle configuration changes without re-instantiating the editor canvas, protecting undo-history and drag state.
- **Flexible Sizing:** Fully fluid element container. Sized in millimeters, centimeters, inches, or pixels.

---

## 🚀 Installation

Install the React wrapper package:

```bash
npm install react-qr-label
```

*(Note: `qrlayout-core` and `qrlayout-ui` are direct dependencies of this package and will be installed automatically by npm/yarn/pnpm.)*

---

## 💻 Getting Started

### 1. Import the CSS Stylesheet
To render the designer properly, you must import the package styles in your app's entry point (e.g., `main.tsx` or `App.tsx`):

```typescript
import 'react-qr-label/style.css';
```

### 2. Add the Component to your Code
Here is a minimal implementation loading a default layout and entity schemas:

```tsx
import { useState } from 'react';
import { QRLabelDesigner, type StickerLayout, type EntitySchema } from 'react-qr-label';
import 'react-qr-label/style.css';

export default function MyDesigner() {
  const [layout, setLayout] = useState<StickerLayout>({
    id: 'badge-1',
    name: 'Standard Badge',
    width: 100,
    height: 60,
    unit: 'mm',
    backgroundColor: '#ffffff',
    targetEntity: 'employee',
    elements: []
  });

  // Define database fields available for drag-and-drop mapping
  const schemas: Record<string, EntitySchema> = {
    employee: {
      label: 'Employee Schema',
      fields: [
        { name: 'fullName', label: 'Full Name' },
        { name: 'employeeId', label: 'Employee ID' },
        { name: 'department', label: 'Department' }
      ],
      sampleData: {
        fullName: 'Rajesh Sharma',
        employeeId: 'EMP-101',
        department: 'Engineering'
      }
    }
  };

  const handleSave = (savedLayout: StickerLayout) => {
    // Persist this JSON configuration object to your database
    console.log('Saved Layout:', savedLayout);
    setLayout(savedLayout);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <QRLabelDesigner
        initialLayout={layout}
        entitySchemas={schemas}
        onSave={handleSave}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </div>
  );
}
```

---

## ⚙️ Component Props Reference

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `initialLayout` | `StickerLayout` | ❌ | The layout JSON to preload into the designer on mount. |
| `entitySchemas` | `Record<string, EntitySchema>` | ❌ | Available data schemas and preview records for dynamic tags. |
| `onSave` | `(layout: StickerLayout) => void` | ❌ | Triggered when the user clicks the "Save Layout" button. |
| `className` | `string` | ❌ | Custom CSS class applied to the container wrapper. |
| `style` | `React.CSSProperties` | ❌ | Inline styles applied to the container wrapper. |

---

## 💾 Saving Layouts & Bulk Printing Workflow

The `onSave` callback outputs a compact, plain JSON object. You should store this JSON in your database (e.g. Postgres `JSONB`). When you need to print labels in bulk, you can import the `StickerPrinter` engine directly from the same package:

```typescript
import { StickerPrinter } from 'react-qr-label';

// 1. Fetch saved layout config & records list from database
const layoutJSON = await fetchLayoutFromDB(layoutId);
const recordsList = await fetchEmployeesFromDB(departmentId);

// 2. Initialize the headless renderer
const printer = new StickerPrinter();

// ── Export to PDF ──────────────────────────────────────────
// Merges all records into a single multi-page PDF document
const pdf = await printer.exportToPDF(layoutJSON, recordsList);
pdf.save('batch-badges.pdf');

// ── Export to ZPL (Zebra thermal printers) ──────────────────
// Returns raw printer commands for each record
const zplPages = printer.exportToZPL(layoutJSON, recordsList, { dpi: 203 });
const combinedPrintJob = zplPages.join('\n');
// Send `combinedPrintJob` directly to raw printer socket port 9100
```

---

## 🎯 Industry Use Cases

* **Workforce ID Badges**: Design security cards, attendee badges, and staff credentials. Binds text variables and access QR codes.
* **Industrial Asset Tagging**: Label equipment specs, servers, and tools. Point scan codes to service history sheets.
* **Logistics & Warehousing Bins**: Print ZPL thermal labels for racks, palettes, and shipment boxes.
* **Retail Product Price Tags**: Render high-density SKU codes, barcodes, and custom discount labels.

---

## 📄 License
MIT © [Shashidhar Naik](https://github.com/shashi089)

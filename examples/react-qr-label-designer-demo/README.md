# React QR Label Designer Demo

> 🌐 **Live Demo Application**: [react-qr-label-designer.netlify.app](https://react-qr-label-designer.netlify.app/)

This workspace showcases a live integration of `react-qr-label-designer` — an embeddable drag-and-drop label designer and headless batch-mail-merge printing engine for React. 

The application is structured as a **Sticker Studio** split-panel workspace where you can visually design label layouts and instantly test printing them against mock databases.

---

## Key Features

### 1. Sticker Studio Split-Panel Workspace
* **Layout list sidebar**: Manage and select layout templates (such as Employee ID Badges or Machine Asset Tags). Edit layouts in the full-screen visual canvas or delete them.
* **Consolidated Sandbox Database**: Automatically swaps the data grid to match the target schema (e.g. Employee or Machine) of the active template. Select rows to trigger instant batch prints.
* **No Context Switching**: Edit your template canvas, save, and immediately test batch-printing on the same screen!

### 2. Collapsible Developer Studio
* **Toggleable Panel**: Hidden by default to keep data grids spacious. Opens with a fluid slide-in animation when clicked.
* **React Embed Code**: Generates copy-paste ready JSX/TS integration blocks reflecting your current schema parameters.
* **Headless print reference**: Shows how to run batch exports programmatically using the headless `StickerPrinter` engine and sub-path PDF exports.
* **Layout JSON exporter**: Inspects and copies the raw active template JSON to pass directly as initial layouts in your code.

### 3. High-Performance Print Engine
* **Batch PNG**: Canvas-based local image downloads (one per record).
* **Batch PDF**: Combines all records into a single multi-page PDF locally.
* **Dynamic ZPL**: Translates active design canvas coords, shapes, texts, and QR codes into Zebra Programming Language (ZPL) commands for industrial thermal label printing.

---

## Industry Use Cases

Our visual QR label designer and batch print pipeline solves label generation needs across various industries:

### 💼 Workforce & Event Badges
* **Use Case**: Security access cards, corporate ID badges, event credentials, and visitor passes.
* **Capability**: Automatically merges employee names, departments, and join dates into layouts. Embeds a QR code containing security check URLs or digital business card links.

### 🏭 Asset Tagging & Industrial Maintenance
* **Use Case**: Plant machinery tags, hardware server labels, facility tools, and company laptop spec plates.
* **Capability**: Places asset codes and locations onto high-contrast tags. Connects dynamic QR codes directly to maintenance logging databases or installation manuals.

### 📦 Logistics & Warehouse Location Tags
* **Use Case**: Inventory storage bin labels, rack identifiers, cold-storage shelves, and shipping package labels.
* **Capability**: Merges aisle codes, rack numbers, and storage type details. Exports directly to ZPL files, allowing developers to send raw command streams over sockets to network-connected Zebra thermal printers.

### 🏷️ Retail & Pricing Barcodes
* **Use Case**: Product shelf price cards, spec tags, discounts, and promo code labels.
* **Capability**: Binds product SKU, pricing, and specs, printing high-density QR coupons for customer scan-and-buy triggers.

---

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm

### Installation

1. Navigate to this demo directory:
   ```bash
   cd examples/react-qr-label-designer-demo
   ```

2. Install workspace dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

---

## Usage Guide

1. **Preset Stories**: On the landing page, choose an industry preset (e.g. **Staff Badge** or **Asset Spec Tag**) to preload templates and dataset sandboxes.
2. **Visual Designer**: Click **"Edit Canvas"** on any template to launch the full-screen visual designer. Drag elements, bind variables (like `{{fullName}}`), style borders/fonts, and click **"Save"**.
3. **Database Sandbox**: Select records using checkboxes, then click the appearing batch actions (**PNG**, **PDF**, or **ZPL**) to immediately download print jobs.
4. **Developer Integration**: Click **"Show Dev Studio"** in the table header to copy embed codes or layout schemas directly into your product.

---

## License
MIT

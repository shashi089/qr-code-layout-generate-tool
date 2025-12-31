# QR Layout Studio - React Demo

This application is a comprehensive reference implementation of the **[`qrlayout-core`](../../packages/core)** package. It demonstrates how to build a high-performance, visual QR code layout designer and management system using React, TypeScript, and Material UI.

##  Overview

The **React Demo** serves as a "Ready-to-Use" playground and a boilerplate for developers who want to integrate QR sticker generation into their own business applications. It moves beyond simple generation by providing a full-blown **Visual Editor** with drag-and-drop capabilities.

##  Key Features

### 1. Visual Layout Designer
- **Drag-and-Resize**: Intuitively move and scale elements (Text and QR codes) directly on a live canvas.
- **Advanced Text Alignment**: Precise control over placement with both **Horizontal** (Left, Center, Right) and **Vertical** (Top, Middle, Bottom) alignment.
- **Live Dynamic Data Preview**: Uses localized Indian sample data (e.g., *Rajesh Sharma*) to show exactly how your stickers will look with real values.

### 2. Multi-Entity Architecture
The designer is schema-driven, allowing you to manage different types of data:
- **Employees**: For ID cards and badges.
- **Vendors**: For supplier tracking and shipping labels.
- **Machines**: For asset management and maintenance logs.

### 3. Professional Export Options
- **PNG/JPEG**: High-quality images for web use or digital sharing.
- **PDF**: Print-ready documents with precise scaling.
- **ZPL**: Generate raw code for industrial **Zebra** thermal printers.

## Industry Use Cases

This tool is highly versatile and can be used in various market segments:

- **Manufacturing & Logistics**: Tagging machinery with maintenance QR codes or labeling warehouse bins for inventory management.
- **Corporate & Events**: Generating professional visitor passes and employee ID cards on the fly.
- **Retail**: Creating price tags and product labels that link to digital catalogs or tracking systems.
- **Healthcare**: Labeling equipment or patient records with unique identifiers for quick scanning.

## How it works with `qrlayout-core`

This demo showcases the power of the core library by:
1. **Defining Layouts**: Converting the visual state of the designer into a `StickerLayout` JSON object.
2. **Rendering**: Using `StickerPrinter.renderToCanvas` for the real-time editor preview.
3. **Exporting**: Leveraging the library's built-in PDF and ZPL exporters to handle the heavy lifting of document generation.

##  Open Source & Contributions

This project is **Open Source**. We believe in the power of community collaboration!

- **Use it freely**: Fork this code and use it in your own commercial or private projects.
- **Suggest Updates**: Found a bug or have a feature idea (like Barcode support or cloud syncing)? Open an issue or a PR.
- **Improve the Core**: Contributions to the rendering logic in `qrlayout-core` are also highly welcome.

##  Getting Started

1. Navigate to this directory: `cd examples/demo-react`
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

---


# QR Layout Demo Application

A comprehensive React application demonstrating the capabilities of the `qrlayout-ui` and `qrlayout-core` packages. This demo showcases a full-featured QR code badge implementation with design, management, and export capabilities.

## Features

### 1. Label Designer (`LabelList` & `QRLayoutDesigner`)
- **Visual Editor**: Drag-and-drop interface for creating sticker layouts.
- **Rich Elements**: Support for Text, QR Codes, and Images (coming soon).
- **Customization**: Fine-tune properties like font size, alignment, dimensions, and positioning.
- **Save & Load**: Layouts are persisted to `localStorage`.

### 2. Employee Master Management
- **CRUD Operations**: Add, Edit, and Delete employee records.
- **Data Persistence**: Employee data is stored locally.
- **Search & Filter**: Efficiently manage your employee database.

### 3. Batch Export & Printing
- **Multi-Selection**: Select multiple employees from the master list.
- **Layout Selection**: Apply any designed sticker layout to the selected records.
- **Export Options**:
    - **PNG**: Download individual high-quality badge images.
    - **PDF**: Generate printable PDF files (individual or batch).
    - **ZPL**: Generate ZPL code for industrial label printers.

## Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Core Libraries**: `qrlayout-core`, `qrlayout-ui`

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- `npm` or `pnpm`

### Installation

1. Navigate to the project root:
   ```bash
   cd examples/ui-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage Guide

### Designing a Badge
1. Navigate to the **"Labels"** tab.
2. Click **"New Layout"** or select an existing one.
3. Use the designer to drag elements onto the canvas.
4. Configure element properties (content, position, size) in the sidebar.
5. Click **"Save"** to persist your layout.

### Managing Employees
1. Navigate to the **"Employees"** tab.
2. Click **"Add Employee"** to create a new record.
3. Fill in the details (Name, ID, Department, etc.) and save.

### Batch Exporting Badges
1. In the **"Employees"** tab, verify you have at least one Layout saved.
2. Select a **Layout Template** from the dropdown at the top.
3. Use the checkboxes to select one or more employees.
4. Click the **PNG**, **PDF**, or **ZPL** button in the appearing action bar to export.

## Project Structure

```
src/
├── components/     # Generic reusable components (e.g., Table)
├── features/       # Feature-specific modules
│   ├── employees/  # Employee Master logic
│   └── labels/     # Label Designer logic
├── services/       # Shared services (storage, etc.)
└── App.tsx         # Main application entry
```

## License
MIT

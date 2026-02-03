# SvelteKit QR Label Designer

An industrial-grade QR code label design and printing application built with [SvelteKit](https://kit.svelte.dev/) and Tailwind CSS. This project is a modern port of the React-based `react-demo`, leveraging Svelte 5's runes for state management and creating a high-performance, SEO-friendly web application.

##  Live Demo

**[View Live Application](https://qr-layout-designer-svelte.netlify.app/)**

##  Features

*   **Visual Label Designer**: Drag-and-drop interface to create pixel-perfect label templates for any industrial use case.
*   **Master Data Management**: Dedicated modules for managing:
    *   **Employees**: Generate ID badges with QR codes.
    *   **Machines**: create asset tags for equipment tracking.
    *   **Storage (BINs)**: manage warehouse locations and print bin labels.
*   **Batch Printing**: Select multiple records and export labels in bulk as **PDF**, **PNG**, or **ZPL** (Zebra Programming Language) for thermal printers.
*   **Local Persistence**: All data is stored securely in your browser's LocalStorage - no backend required for the demo.
*   **Responsive Design**: A premium, mobile-friendly UI built with Tailwind CSS.

##  Tech Stack

*   **Framework**: SvelteKit (Svelte 5)
*   **Styling**: Tailwind CSS v4
*   **Icons**: Lucide Svelte
*   **Core Logic**: `qrlayout-core` (Label generation, PDF/ZPL export)
*   **UI Components**: `qrlayout-ui` (Designer canvas)

##  Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd svelte-demo
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open your browser**:
    Navigate to `http://localhost:5173` to launch the application.

##  Building for Production

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

##  Theme & Customization

The application uses a **Teal & Emerald** industrial theme. 
- Primary Color: `teal-600`
- Accent Color: `emerald-500` & `amber-500`

To customize the theme, edit the Tailwind classes in `src/routes/+layout.svelte` and the individual page components.

##  Project Structure

*   `src/routes/`: Application pages (file-based routing).
    *   `labels/`: Label template management.
    *   `employees/`: Employee master data.
    *   `machines/`: Machine assets.
    *   `storage/`: Warehouse storage bins.
*   `src/lib/components/`: Reusable UI components (e.g., `Table.svelte`).
*   `src/lib/services/`: Business logic and data services (e.g., `storage.ts`).

##  Contributing

Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

##  License

MIT

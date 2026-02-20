# qrlayout-ui

A framework-agnostic, embeddable UI for designing sticker layouts with QR codes. Part of the [QR Layout Tool](https://github.com/shashi089/qr-code-layout-generate-tool).

## 🚀 Live Demos & Examples

| Framework | Live Demo | Source Code |
| :--- | :--- | :--- |
| **React** | [Live Demo](https://qr-layout-designer.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/react-demo) |
| **Svelte 5** | [Live Demo](https://qr-layout-designer-svelte.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/svelte-demo) |
| **Vue 3** | [Live Demo](https://qr-layout-designer-vue.netlify.app/) | [Source](https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/examples/vue-demo) |

![QR Layout Designer Screenshot](https://github.com/shashi089/qr-code-layout-generate-tool/raw/main/assets/layout_designer.png)


## Features

- **Framework Independent**: Built with vanilla TypeScript, works with React, Vue, Angular, Svelte, or plain HTML/JS.
- **Drag & Drop Designer**: Visual placement of text and QR code elements.
- **Data Binding**: Bind fields like `{{name}}` or `{{id}}` from your entity schemas.
- **Rich Text Styling**: Customize font size, weight, and alignment (horizontal/vertical).
- **Auto-Join Fields**: Set a "Field Separator" (e.g., `|`) on QR elements to automatically join variables (e.g. `{{id}}{{name}}` becomes `ID|NAME`).
- **Dark Mode**: Built-in support for light and dark themes.
- **Flexible Units**: Design in millimeters (mm), centimeters (cm), inches (in), or pixels (px).
- **Export**: Get the final layout JSON for storage.

## Installation

```bash
npm install qrlayout-ui qrlayout-core
```

## Usage

This library is exposed as a class `QRLayoutDesigner` that can be mounted into any HTML element. It also re-exports `StickerPrinter` for rendering layouts without the UI.

### 1. Import Styles

Make sure to import the CSS file in your project entry point:

```javascript
import "qrlayout-ui/style.css";
```

### 2. Styling the Container

The designer expects its parent container to have a defined width and height. If the container has zero height, the designer will not be visible. 

For a **full-screen experience**, you can use the following CSS:

```css
.designer-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
```

### 3. Basic Setup

```typescript
import { QRLayoutDesigner } from "qrlayout-ui";

const container = document.getElementById("my-designer-container");

const designer = new QRLayoutDesigner({
    element: container,
    
    // Optional: Provide Schemas for data binding
    entitySchemas: {
        employee: {
            label: "Employee",
            fields: [
                { name: "name", label: "Full Name" },
                { name: "id", label: "Employee ID" }
            ],
            sampleData: { name: "Mallikarjun Naik", id: "12345" } // Used for preview
        }
    },

    // Optional: Load an existing layout
    initialLayout: {
        id: "1",
        name: "My Layout",
        targetEntity: "employee",
        width: 100,
        height: 60,
        unit: "mm",
        backgroundColor: "#ffffff",
        elements: []
    },

    onSave: (layout) => {
        console.log("Layout saved:", layout);
        // Save to your backend here
    }
});
```

### 4. Cleanup

Destroy the instance when the component unmounts to prevent memory leaks:

```javascript
designer.destroy();
```

## Props / Options

| Option | Type | Description |
|---|---|---|
| `element` | `HTMLElement` | **Required**. The DOM element to mount the designer into. |
| `entitySchemas` | `Record<string, Schema>` | Data entity definitions for `{{field}}` placeholder binding. |
| `initialLayout` | `StickerLayout` | The initial layout state to load on mount. |
| `onSave` | `(layout: StickerLayout) => void` | Callback triggered when the "Save Layout" button is clicked. |

## Integration Examples

Since `qrlayout-ui` is framework-agnostic, it can be easily integrated into any setup.

### 1. React (TypeScript)

```tsx
import { useEffect, useRef } from 'react';
import { QRLayoutDesigner } from 'qrlayout-ui';
import 'qrlayout-ui/style.css';

const MyDesigner = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const designer = new QRLayoutDesigner({
      element: containerRef.current,
      onSave: (data) => console.log('Saved Layout:', data)
    });

    return () => designer.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '800px' }} />;
};

export default MyDesigner;
```

### 2. Vue 3 (Composition API)

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { QRLayoutDesigner } from 'qrlayout-ui';
import 'qrlayout-ui/style.css';

const container = ref(null);
let designer = null;

onMounted(() => {
  designer = new QRLayoutDesigner({
    element: container.value,
    onSave: (data) => console.log('Saved:', data)
  });
});

onUnmounted(() => {
  if (designer) designer.destroy();
});
</script>

<template>
  <div ref="container" style="width: 100%; height: 800px;"></div>
</template>
```

### 3. Svelte 5 (Runes)

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { QRLayoutDesigner } from 'qrlayout-ui';
  import 'qrlayout-ui/style.css';

  let container = $state<HTMLDivElement | null>(null);
  let designer: QRLayoutDesigner | null = null;

  onMount(() => {
    if (!container) return;

    designer = new QRLayoutDesigner({
      element: container,
      onSave: (data) => console.log('Saved Layout:', data)
    });

    return () => designer?.destroy();
  });
</script>

<div bind:this={container} style="width: 100%; height: 800px;"></div>
```

### 4. Vanilla JavaScript / HTML

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="node_modules/qrlayout-ui/dist/style.css">
</head>
<body>
    <div id="designer" style="width: 100%; height: 800px;"></div>

    <script type="module">
        import { QRLayoutDesigner } from 'qrlayout-ui';
        
        const designer = new QRLayoutDesigner({
            element: document.getElementById('designer'),
            onSave: (data) => console.log('Saved:', data)
        });
    </script>
</body>
</html>
```

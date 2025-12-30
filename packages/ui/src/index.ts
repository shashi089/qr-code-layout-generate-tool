import { StickerPrinter, StickerLayout, StickerElement, ElementType } from "@qrlayout/core";

// --- State ---
let currentLayout: StickerLayout = {
    id: "layout-1",
    name: "My Custom Layout",
    width: 100,
    height: 60,
    unit: "mm",
    backgroundColor: "#ffffff",
    elements: [
        {
            id: "title",
            type: "text",
            x: 0, y: 5, w: 100, h: 10,
            content: "CONFERENCE PASS",
            style: {
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
                color: "#333333"
            } as any // cast to avoid strict casing issues if any
        },
        {
            id: "name-var",
            type: "text",
            x: 5, y: 25, w: 60, h: 10,
            content: "{{name}}",
            style: { fontSize: 14, textAlign: "left" }
        },
        {
            id: "qr-code",
            type: "qr",
            x: 70, y: 20, w: 25, h: 25,
            content: "{{uuid}}"
        }
    ]
};

let selectedElementId: string | null = null;
let currentDataIndex: number = 0;
let isEditMode = true;

// --- Services ---
// Printer is sufficient as we hold state locally
const printer = new StickerPrinter();

// --- Utilities ---
function debounce(func: Function, wait: number) {
    let timeout: any;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
const debouncedUpdatePreview = debounce(updatePreview, 300);

// --- DOM Elements ---
const canvas = document.getElementById("preview-canvas") as HTMLCanvasElement;
const dataInput = document.getElementById("data-input") as HTMLTextAreaElement;
const elementsContainer = document.getElementById("elements-container") as HTMLDivElement;
const propPanel = document.getElementById("prop-panel") as HTMLDivElement;
const propContent = document.getElementById("prop-content") as HTMLDivElement;
const editorOverlay = document.getElementById("editor-overlay") as HTMLDivElement;
const paginationDiv = document.getElementById("data-pagination") as HTMLDivElement;
const paginationText = document.getElementById("data-indicator") as HTMLSpanElement;

const inputs = {
    width: document.getElementById("layout-width") as HTMLInputElement,
    height: document.getElementById("layout-height") as HTMLInputElement,
    bg: document.getElementById("layout-bg") as HTMLInputElement,
};

// --- Initialization ---
async function init() {
    setupGlobalListeners();
    renderElementsList();
    updateModeButtons();
    updatePreview();
}

function getData() {
    try {
        return JSON.parse(dataInput.value);
    } catch (e) {
        console.error("Invalid JSON data", e);
        return {};
    }
}

async function updatePreview() {
    // Sync inputs if not focused (optional, but good for initial load)
    // Actually, let's just render
    if (!canvas) return;

    try {
        let data = getData();
        // If array, pick element based on index
        if (Array.isArray(data)) {
            paginationDiv.style.display = "flex";
            const max = Math.max(0, data.length - 1);
            if (currentDataIndex > max) currentDataIndex = 0;

            paginationText.innerText = `Item ${currentDataIndex + 1} of ${data.length}`;

            if (data.length > 0) {
                console.log(`Previewing item ${currentDataIndex} of ${data.length}`);
                data = data[currentDataIndex];
            } else {
                data = {};
            }
        } else {
            paginationDiv.style.display = "none";
            currentDataIndex = 0;
        }

        await printer.renderToCanvas(currentLayout, data, canvas);
        if (isEditMode) updateEditorOverlay();
    } catch (e) {
        console.error("Render failed", e);
    }
}

// --- Layout Modifiers ---
function updateLayoutProp(key: keyof StickerLayout, value: any) {
    (currentLayout as any)[key] = value;
    debouncedUpdatePreview();
}

function addElement(type: ElementType) {
    const id = `el-${Date.now()}`;
    const newEl: StickerElement = {
        id,
        type,
        x: 10,
        y: 10,
        w: type === 'qr' ? 20 : 50,
        h: type === 'qr' ? 20 : 10,
        content: type === 'qr' ? "{{uuid}}" : "New Text",
        style: type === 'text' ? { fontSize: 12, color: "#000000" } : undefined
    };
    currentLayout.elements.push(newEl);
    renderElementsList();
    selectElement(id);
    updatePreview();
}

function deleteSelectedElement() {
    if (!selectedElementId) return;
    currentLayout.elements = currentLayout.elements.filter(e => e.id !== selectedElementId);
    selectedElementId = null;
    renderElementsList();
    propPanel.style.display = "none";
    updatePreview();
}

// --- UI Rendering ---

function renderElementsList() {
    elementsContainer.innerHTML = "";
    currentLayout.elements.forEach(el => {
        const div = document.createElement("div");
        div.className = `element-item ${selectedElementId === el.id ? "active" : ""}`;
        div.innerHTML = `
            <div class="element-info">
                <span class="element-name">${el.id}</span>
                <span class="element-type">${el.type}</span>
            </div>
            <div style="font-size:12px; color:#999;">
                x:${el.x} y:${el.y}
            </div>
        `;
        div.onclick = () => selectElement(el.id);
        elementsContainer.appendChild(div);
    });
}

function selectElement(id: string) {
    selectedElementId = id;
    renderElementsList(); // Update active class
    renderPropPanel(id);
    syncOverlaySelection();
}

function renderPropPanel(id: string) {
    const el = currentLayout.elements.find(e => e.id === id);
    if (!el) return;

    propPanel.style.display = "block";
    propContent.innerHTML = "";

    // Helper to create input
    const createInput = (label: string, value: any, type: string = "text", onChange: (val: any) => void) => {
        const row = document.createElement("div");
        row.className = "form-group";
        row.innerHTML = `<label>${label}</label>`;
        const input = document.createElement("input");
        input.type = type;
        input.value = value;
        input.oninput = (e) => {
            const val = (e.target as HTMLInputElement).value;
            onChange(type === "number" ? parseFloat(val) : val);
        };
        row.appendChild(input);
        propContent.appendChild(row);
    };

    // ID (Read only for now)
    createInput("ID", el.id, "text", (val) => {
        el.id = val;
        renderElementsList();
    });

    // Content
    createInput("Content", el.content, "text", (val) => {
        el.content = val;
        updatePreview();
    });

    // Position
    const posRow = document.createElement("div");
    posRow.className = "form-row";
    propContent.appendChild(posRow);

    const createSmallInput = (lbl: string, val: number, field: 'x' | 'y' | 'w' | 'h') => {
        const grp = document.createElement("div");
        grp.className = "form-group";
        grp.style.flex = "1";
        grp.innerHTML = `<label>${lbl}</label>`;
        const inp = document.createElement("input");
        inp.type = "number";
        inp.value = String(val);
        inp.oninput = (e) => {
            el[field] = parseFloat((e.target as HTMLInputElement).value);
            renderElementsList(); // update overview
            updateEditorOverlay();
            debouncedUpdatePreview();
        };
        grp.appendChild(inp);
        posRow.appendChild(grp);
    };

    createSmallInput("X", el.x, 'x');
    createSmallInput("Y", el.y, 'y');
    createSmallInput("W", el.w, 'w');
    createSmallInput("H", el.h, 'h');

    // Style (if text)
    if (el.type === "text") {
        if (!el.style) el.style = {};

        createInput("Font Size (pt)", el.style.fontSize || 12, "number", (val) => {
            if (!el.style) el.style = {};
            el.style.fontSize = val;
            debouncedUpdatePreview();
        });

        createInput("Color", el.style.color || "#000000", "text", (val) => {
            if (!el.style) el.style = {};
            el.style.color = val;
            debouncedUpdatePreview();
        });

        // Align
        const alignRow = document.createElement("div");
        alignRow.className = "form-group";
        alignRow.innerHTML = "<label>Alignment</label>";
        const select = document.createElement("select");
        ["left", "center", "right"].forEach(opt => {
            const o = document.createElement("option");
            o.value = opt;
            o.text = opt;
            o.selected = el.style?.textAlign === opt;
            select.appendChild(o);
        });
        select.onchange = (e) => {
            if (!el.style) el.style = {};
            el.style.textAlign = (e.target as HTMLSelectElement).value as any;
            updatePreview();
        };
        alignRow.appendChild(select);
        propContent.appendChild(alignRow);
    }
}

// --- Editor Overlay (Drag/Resize) ---
type DragMode = "move" | "resize";
type ResizeHandle = "nw" | "ne" | "sw" | "se";

interface DragState {
    id: string;
    mode: DragMode;
    handle?: ResizeHandle;
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
}

let dragState: DragState | null = null;

const MIN_SIZE_MM = 2;
const GRID_MM = 1;

function unitToPx(value: number): number {
    switch (currentLayout.unit) {
        case "mm": return (value * 96) / 25.4;
        case "cm": return (value * 96) / 2.54;
        case "in": return value * 96;
        case "px": default: return value;
    }
}

function pxToUnit(value: number): number {
    switch (currentLayout.unit) {
        case "mm": return (value * 25.4) / 96;
        case "cm": return (value * 2.54) / 96;
        case "in": return value / 96;
        case "px": default: return value;
    }
}

function roundTo(value: number, decimals: number): number {
    return parseFloat(value.toFixed(decimals));
}

function snapPx(value: number, gridPx: number): number {
    if (gridPx <= 0) return value;
    return Math.round(value / gridPx) * gridPx;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function updateEditorOverlay() {
    if (!editorOverlay || !canvas) return;

    editorOverlay.style.display = isEditMode ? "block" : "none";
    editorOverlay.style.width = `${canvas.width}px`;
    editorOverlay.style.height = `${canvas.height}px`;

    if (!isEditMode) {
        editorOverlay.innerHTML = "";
        return;
    }

    editorOverlay.innerHTML = "";

    currentLayout.elements.forEach((el) => {
        const item = document.createElement("div");
        item.className = `editor-item${selectedElementId === el.id ? " selected" : ""}`;
        item.dataset.id = el.id;

        const label = document.createElement("div");
        label.className = "editor-label";
        label.innerText = el.id;
        item.appendChild(label);

        const handles: ResizeHandle[] = ["nw", "ne", "sw", "se"];
        handles.forEach((handle) => {
            const h = document.createElement("div");
            h.className = `resize-handle ${handle}`;
            h.dataset.handle = handle;
            item.appendChild(h);
        });

        positionOverlayItem(el, item);

        item.addEventListener("mousedown", (e) => {
            const target = e.target as HTMLElement;
            const handle = target.dataset.handle as ResizeHandle | undefined;
            startDrag(e, el.id, handle ? "resize" : "move", handle);
        });

        editorOverlay.appendChild(item);
    });
}

function positionOverlayItem(el: StickerElement, item: HTMLDivElement) {
    const x = unitToPx(el.x);
    const y = unitToPx(el.y);
    const w = unitToPx(el.w);
    const h = unitToPx(el.h);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.style.width = `${w}px`;
    item.style.height = `${h}px`;
}

function syncOverlaySelection() {
    const items = editorOverlay?.querySelectorAll(".editor-item");
    if (!items) return;
    items.forEach((item) => {
        const id = (item as HTMLElement).dataset.id;
        if (id && id === selectedElementId) item.classList.add("selected");
        else item.classList.remove("selected");
    });
}

function startDrag(e: MouseEvent, id: string, mode: DragMode, handle?: ResizeHandle) {
    const el = currentLayout.elements.find((element) => element.id === id);
    if (!el) return;
    e.preventDefault();
    selectElement(id);

    dragState = {
        id,
        mode,
        handle,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startX: unitToPx(el.x),
        startY: unitToPx(el.y),
        startW: unitToPx(el.w),
        startH: unitToPx(el.h),
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", endDrag);
}

function handleDrag(e: MouseEvent) {
    if (!dragState) return;
    const el = currentLayout.elements.find((element) => element.id === dragState?.id);
    if (!el) return;

    const layoutWidthPx = unitToPx(currentLayout.width);
    const layoutHeightPx = unitToPx(currentLayout.height);
    const minPx = unitToPx(MIN_SIZE_MM);
    const gridPx = unitToPx(GRID_MM);

    const dx = e.clientX - dragState.startMouseX;
    const dy = e.clientY - dragState.startMouseY;

    let x = dragState.startX;
    let y = dragState.startY;
    let w = dragState.startW;
    let h = dragState.startH;

    if (dragState.mode === "move") {
        x = dragState.startX + dx;
        y = dragState.startY + dy;
        x = clamp(x, 0, layoutWidthPx - w);
        y = clamp(y, 0, layoutHeightPx - h);
    } else if (dragState.mode === "resize" && dragState.handle) {
        switch (dragState.handle) {
            case "nw":
                x = dragState.startX + dx;
                y = dragState.startY + dy;
                w = dragState.startW - dx;
                h = dragState.startH - dy;
                break;
            case "ne":
                y = dragState.startY + dy;
                w = dragState.startW + dx;
                h = dragState.startH - dy;
                break;
            case "sw":
                x = dragState.startX + dx;
                w = dragState.startW - dx;
                h = dragState.startH + dy;
                break;
            case "se":
                w = dragState.startW + dx;
                h = dragState.startH + dy;
                break;
        }

        if (w < minPx) {
            const delta = minPx - w;
            w = minPx;
            if (dragState.handle === "nw" || dragState.handle === "sw") x -= delta;
        }
        if (h < minPx) {
            const delta = minPx - h;
            h = minPx;
            if (dragState.handle === "nw" || dragState.handle === "ne") y -= delta;
        }

        x = clamp(x, 0, layoutWidthPx - w);
        y = clamp(y, 0, layoutHeightPx - h);
        w = clamp(w, minPx, layoutWidthPx - x);
        h = clamp(h, minPx, layoutHeightPx - y);
    }

    if (!e.altKey) {
        x = snapPx(x, gridPx);
        y = snapPx(y, gridPx);
        w = snapPx(w, gridPx);
        h = snapPx(h, gridPx);
    }

    el.x = roundTo(pxToUnit(x), 2);
    el.y = roundTo(pxToUnit(y), 2);
    el.w = roundTo(pxToUnit(w), 2);
    el.h = roundTo(pxToUnit(h), 2);

    const item = editorOverlay.querySelector(`.editor-item[data-id="${el.id}"]`) as HTMLDivElement | null;
    if (item) positionOverlayItem(el, item);
}

function endDrag() {
    if (!dragState) return;
    dragState = null;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", endDrag);
    renderElementsList();
    if (selectedElementId) renderPropPanel(selectedElementId);
    updatePreview();
}

// --- Listeners ---
function setupGlobalListeners() {
    // Layout Props
    inputs.width.oninput = (e) => updateLayoutProp("width", parseFloat((e.target as HTMLInputElement).value));
    inputs.height.oninput = (e) => updateLayoutProp("height", parseFloat((e.target as HTMLInputElement).value));
    inputs.bg.oninput = (e) => updateLayoutProp("backgroundColor", (e.target as HTMLInputElement).value);

    // Actions
    document.getElementById("btn-add-text")?.addEventListener("click", () => addElement("text"));
    document.getElementById("btn-add-qr")?.addEventListener("click", () => addElement("qr"));
    document.getElementById("btn-delete-el")?.addEventListener("click", deleteSelectedElement);
    document.getElementById("btn-save-layout")?.addEventListener("click", saveLayoutJson);

    document.getElementById("btn-render")?.addEventListener("click", updatePreview);
    document.getElementById("btn-edit-mode")?.addEventListener("click", () => {
        isEditMode = true;
        updateModeButtons();
        updateEditorOverlay();
    });
    document.getElementById("btn-preview-mode")?.addEventListener("click", () => {
        isEditMode = false;
        updateModeButtons();
        updateEditorOverlay();
        updatePreview();
    });

    // File Upload
    document.getElementById("file-upload")?.addEventListener("change", (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const text = evt.target?.result as string;
            if (text) {
                // Validate JSON
                try {
                    JSON.parse(text); // Just to check if valid
                    dataInput.value = text;
                    currentDataIndex = 0; // Reset pagination
                    updatePreview();
                } catch (err) {
                    alert("Invalid JSON file");
                    console.error(err);
                }
            }
        };
        reader.readAsText(file);
        // Clear value so same file can be selected again
        (e.target as HTMLInputElement).value = "";
    });

    // Pagination
    document.getElementById("btn-prev-data")?.addEventListener("click", () => {
        const data = getData();
        if (Array.isArray(data) && data.length > 0) {
            currentDataIndex--;
            if (currentDataIndex < 0) currentDataIndex = data.length - 1;
            updatePreview();
        }
    });

    document.getElementById("btn-next-data")?.addEventListener("click", () => {
        const data = getData();
        if (Array.isArray(data) && data.length > 0) {
            currentDataIndex++;
            if (currentDataIndex >= data.length) currentDataIndex = 0;
            updatePreview();
        }
    });

    // Downloads
    document.getElementById("btn-pdf")?.addEventListener("click", async () => {
        const data = getData();
        // Pass array directly if it is an array, else wrap in array
        const dataList = Array.isArray(data) ? data : [data];

        const doc = await printer.exportToPDF(currentLayout, dataList);
        doc.save("stickers.pdf");
    });

    document.getElementById("btn-png")?.addEventListener("click", async () => {
        let data = getData();
        if (Array.isArray(data)) {
            if (data.length === 0) data = {};
            else {
                alert("Multiple items detected. Downloading the first one as PNG.");
                data = data[0];
            }
        }
        const url = await printer.renderToDataURL(currentLayout, data, { format: "png" });
        const link = document.createElement("a");
        link.href = url;
        link.download = "sticker.png";
        link.click();
    });

    document.getElementById("btn-zpl")?.addEventListener("click", async () => {
        const data = getData();
        const dataList = Array.isArray(data) ? data : [data];

        const zplStrings = printer.exportToZPL(currentLayout, dataList);
        // Combine all ZPL codes into one file
        const blob = new Blob([zplStrings.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "stickers.zpl";
        link.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById("btn-copy-zpl")?.addEventListener("click", () => {
        const data = getData();
        const dataList = Array.isArray(data) ? data : [data];

        const zplStrings = printer.exportToZPL(currentLayout, dataList);
        const zplContent = zplStrings.join("\n");

        navigator.clipboard.writeText(zplContent).then(() => {
            alert("ZPL Code copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy ZPL:", err);
            alert("Failed to copy ZPL code.");
        });
    });
}

function updateModeButtons() {
    const editBtn = document.getElementById("btn-edit-mode");
    const previewBtn = document.getElementById("btn-preview-mode");
    editBtn?.classList.toggle("active", isEditMode);
    previewBtn?.classList.toggle("active", !isEditMode);
}

function saveLayoutJson() {
    const safeName = (currentLayout.name || currentLayout.id || "layout")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const fileName = `${safeName || "layout"}.json`;
    const content = JSON.stringify(currentLayout, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}

init();

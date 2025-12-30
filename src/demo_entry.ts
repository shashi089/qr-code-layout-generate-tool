import { StickerPrinter } from "./index";
import { StickerLayout, StickerElement, ElementType } from "./layout/schema";

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
                Color: "#333333"
            } as any // cast to avoid strict casing issues if any
        },
        {
            id: "name-var",
            type: "text",
            x: 5, y: 25, w: 90, h: 10,
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

// --- Services ---
// Printer is sufficient as we hold state locally
const printer = new StickerPrinter();

// --- DOM Elements ---
const canvas = document.getElementById("preview-canvas") as HTMLCanvasElement;
const dataInput = document.getElementById("data-input") as HTMLTextAreaElement;
const elementsContainer = document.getElementById("elements-container") as HTMLDivElement;
const propPanel = document.getElementById("prop-panel") as HTMLDivElement;
const propContent = document.getElementById("prop-content") as HTMLDivElement;
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
    } catch (e) {
        console.error("Render failed", e);
    }
}

// --- Layout Modifiers ---
function updateLayoutProp(key: keyof StickerLayout, value: any) {
    (currentLayout as any)[key] = value;
    updatePreview();
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
            updatePreview();
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
            updatePreview();
        });

        createInput("Color", el.style.color || "#000000", "text", (val) => {
            if (!el.style) el.style = {};
            el.style.color = val;
            updatePreview();
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

    document.getElementById("btn-render")?.addEventListener("click", updatePreview);

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

init();

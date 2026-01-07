import { StickerPrinter, StickerLayout, StickerElement, ElementType } from "qrlayout-core";

const ENTITY_SCHEMAS: Record<string, { label: string; fields: { name: string; label: string }[]; sampleData: any }> = {
    employee: {
        label: "Employee",
        fields: [
            { name: "name", label: "Full Name" },
            { name: "employeeId", label: "Employee ID" },
            { name: "designation", label: "Designation" },
            { name: "place", label: "Location" }
        ],
        sampleData: { name: "Rajesh Sharma", employeeId: "EMP-101", designation: "Architect", place: "Mumbai" }
    },
    vendor: {
        label: "Vendor",
        fields: [
            { name: "name", label: "Company Name" },
            { name: "vendorId", label: "Vendor ID" },
            { name: "category", label: "Category" }
        ],
        sampleData: { name: "ACME Corp", vendorId: "V-202", category: "Supplies" }
    }
};

interface DesignerLayout extends StickerLayout {
    targetEntity?: string;
}

// --- Designer State ---
let currentLayout: DesignerLayout = {
    id: "layout-1",
    name: "New Layout",
    targetEntity: "employee",
    width: 100,
    height: 60,
    unit: "mm",
    backgroundColor: "#ffffff",
    elements: [
        { id: "t1", type: "text", x: 5, y: 5, w: 90, h: 8, content: "VISITOR PASS", style: { textAlign: "center", fontWeight: "bold" } },
        { id: "q1", type: "qr", x: 35, y: 15, w: 30, h: 30, content: "{{employeeId}}" }
    ]
};

let selectedElementId: string | null = null;
let isEditMode = true;
let isDarkMode = false;
let pxPerUnit = 1;

const printer = new StickerPrinter();

// --- DOM References ---
const canvas = document.getElementById("preview-canvas") as HTMLCanvasElement;
const editorOverlay = document.getElementById("editor-overlay") as HTMLDivElement;
const elementsContainer = document.getElementById("elements-container") as HTMLDivElement;
const propertyPanel = document.getElementById("property-panel") as HTMLDivElement;
const propContent = document.getElementById("prop-content") as HTMLDivElement;

const inputs = {
    entity: document.getElementById("layout-entity") as HTMLSelectElement,
    name: document.getElementById("layout-name") as HTMLInputElement,
    width: document.getElementById("layout-width") as HTMLInputElement,
    height: document.getElementById("layout-height") as HTMLInputElement,
    unit: document.getElementById("layout-unit") as HTMLSelectElement,
    labelWidth: document.getElementById("label-width") as HTMLLabelElement,
    labelHeight: document.getElementById("label-height") as HTMLLabelElement,
    bg: document.getElementById("layout-bg") as HTMLInputElement,
    bgPreview: document.getElementById("bg-preview") as HTMLDivElement,
};

// --- Initialization ---
function init() {
    syncInputsFromLayout();
    setupGlobalListeners();
    renderElementsList();
    updatePreview();
}

function syncInputsFromLayout() {
    inputs.entity.value = currentLayout.targetEntity || "";
    inputs.name.value = currentLayout.name;
    inputs.width.value = currentLayout.width.toFixed(2);
    inputs.height.value = currentLayout.height.toFixed(2);
    inputs.unit.value = currentLayout.unit;
    inputs.labelWidth.innerText = `Width (${currentLayout.unit})`;
    inputs.labelHeight.innerText = `Height (${currentLayout.unit})`;
    inputs.bg.value = currentLayout.backgroundColor || "#ffffff";
    inputs.bgPreview.style.backgroundColor = inputs.bg.value;
}

// --- Designer Core ---
async function updatePreview() {
    if (!canvas || !currentLayout) return;

    // Use sample data based on entity
    const sampleData = (currentLayout.targetEntity && ENTITY_SCHEMAS[currentLayout.targetEntity])
        ? ENTITY_SCHEMAS[currentLayout.targetEntity].sampleData
        : {};

    await printer.renderToCanvas(currentLayout, sampleData, canvas);

    const rect = canvas.getBoundingClientRect();
    pxPerUnit = rect.width / currentLayout.width;

    updateEditorOverlay();
}

function renderElementsList() {
    elementsContainer.innerHTML = "";
    currentLayout.elements.forEach(el => {
        const div = document.createElement("div");
        div.className = `element-item ${selectedElementId === el.id ? "active" : ""}`;
        div.innerHTML = `
            <div class="element-info">
                <span class="element-name">${el.type.toUpperCase()}</span>
                <span class="element-sub">${String(el.content).substring(0, 20)}</span>
            </div>
        `;
        div.onclick = () => selectElement(el.id);
        elementsContainer.appendChild(div);
    });
}

function selectElement(id: string | null) {
    selectedElementId = id;
    renderElementsList();
    renderPropertyPanel();
    updateEditorOverlay();
}

function renderPropertyPanel() {
    if (!selectedElementId) {
        propertyPanel.style.display = "none";
        return;
    }
    const el = currentLayout.elements.find(e => e.id === selectedElementId);
    if (!el) return;

    propertyPanel.style.display = "block";
    propContent.innerHTML = `
        <div class="form-group">
            <label>Content</label>
            <textarea id="prop-content-val" rows="2">${el.content}</textarea>
            <div class="field-buttons" id="field-suggestions"></div>
        </div>
        <div class="form-row">
            <div class="form-group" style="flex:1;"><label>X (pos)</label><input type="number" step="0.01" id="prop-x" value="${el.x.toFixed(2)}"></div>
            <div class="form-group" style="flex:1;"><label>Y (pos)</label><input type="number" step="0.01" id="prop-y" value="${el.y.toFixed(2)}"></div>
        </div>
        <div class="form-row">
            <div class="form-group" style="flex:1;"><label>Width</label><input type="number" step="0.01" id="prop-w" value="${el.w.toFixed(2)}"></div>
            <div class="form-group" style="flex:1;"><label>Height</label><input type="number" step="0.01" id="prop-h" value="${el.h.toFixed(2)}"></div>
        </div>
        ${el.type === 'text' ? `
            <div style="height: 1px; background: var(--border-color); margin: 16px 0;"></div>
            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label>Font Size</label>
                    <input type="number" id="prop-fontSize" value="${el.style?.fontSize || 12}">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Font Weight</label>
                    <select id="prop-fontWeight">
                        <option value="normal" ${el.style?.fontWeight === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="bold" ${el.style?.fontWeight === 'bold' ? 'selected' : ''}>Bold</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Horizontal Align</label>
                <div class="toggle-group" style="width: 100%;">
                    <button class="toggle-btn prop-align-h ${el.style?.textAlign === 'left' ? 'active' : ''}" data-val="left" style="flex:1;">Left</button>
                    <button class="toggle-btn prop-align-h ${el.style?.textAlign === 'center' ? 'active' : ''}" data-val="center" style="flex:1;">Center</button>
                    <button class="toggle-btn prop-align-h ${el.style?.textAlign === 'right' ? 'active' : ''}" data-val="right" style="flex:1;">Right</button>
                </div>
            </div>
            <div class="form-group">
                <label>Vertical Align</label>
                <div class="toggle-group" style="width: 100%;">
                    <button class="toggle-btn prop-align-v ${el.style?.verticalAlign === 'top' ? 'active' : ''}" data-val="top" style="flex:1;">Top</button>
                    <button class="toggle-btn prop-align-v ${el.style?.verticalAlign === 'middle' ? 'active' : ''}" data-val="middle" style="flex:1;">Middle</button>
                    <button class="toggle-btn prop-align-v ${el.style?.verticalAlign === 'bottom' ? 'active' : ''}" data-val="bottom" style="flex:1;">Bottom</button>
                </div>
            </div>
        ` : ''}
    `;

    // Suggestions from Schema
    const suggestions = document.getElementById("field-suggestions")!;
    const entitySchema = currentLayout.targetEntity ? ENTITY_SCHEMAS[currentLayout.targetEntity] : null;

    if (entitySchema) {
        entitySchema.fields.forEach(f => {
            const pill = document.createElement("div");
            pill.className = "field-pill";
            pill.innerText = `+ ${f.label}`;
            pill.onclick = () => {
                el.content += `{{${f.name}}}`;
                renderPropertyPanel();
                updatePreview();
            };
            suggestions.appendChild(pill);
        });
    }

    // Listeners
    const link = (id: string, field: string, isNum = false, subField?: string) => {
        document.getElementById(id)?.addEventListener("input", (e) => {
            const val = (e.target as HTMLInputElement).value;
            const finalVal = isNum ? parseFloat(val) || 0 : val;

            if (subField) {
                if (!el.style) el.style = {};
                (el.style as any)[subField] = finalVal;
            } else {
                (el as any)[field] = finalVal;
            }
            updatePreview();
        });
    };
    link("prop-content-val", "content");
    link("prop-x", "x", true);
    link("prop-y", "y", true);
    link("prop-w", "w", true);
    link("prop-h", "h", true);

    if (el.type === 'text') {
        link("prop-fontSize", "style", true, "fontSize");
        link("prop-fontWeight", "style", false, "fontWeight");

        document.querySelectorAll(".prop-align-h").forEach(btn => {
            btn.addEventListener("click", () => {
                if (!el.style) el.style = {};
                el.style.textAlign = (btn as HTMLElement).dataset.val as any;
                renderPropertyPanel();
                updatePreview();
            });
        });

        document.querySelectorAll(".prop-align-v").forEach(btn => {
            btn.addEventListener("click", () => {
                if (!el.style) el.style = {};
                el.style.verticalAlign = (btn as HTMLElement).dataset.val as any;
                renderPropertyPanel();
                updatePreview();
            });
        });
    }
}

function updateEditorOverlay() {
    if (!editorOverlay || !canvas) return;
    editorOverlay.style.width = canvas.style.width;
    editorOverlay.style.height = canvas.style.height;
    editorOverlay.innerHTML = "";

    currentLayout.elements.forEach(el => {
        const item = document.createElement("div");
        item.className = `editor-item ${selectedElementId === el.id ? "selected" : ""}`;
        item.style.left = `${el.x * pxPerUnit}px`;
        item.style.top = `${el.y * pxPerUnit}px`;
        item.style.width = `${el.w * pxPerUnit}px`;
        item.style.height = `${el.h * pxPerUnit}px`;

        if (selectedElementId === el.id) {
            const handle = document.createElement("div");
            handle.className = "resize-handle";
            handle.onmousedown = (e) => {
                e.preventDefault();
                e.stopPropagation();
                startElementResize(e, el);
            };
            item.appendChild(handle);
        }

        item.onmousedown = (e) => {
            e.preventDefault();
            selectElement(el.id);
            startElementDrag(e, el);
        };

        editorOverlay.appendChild(item);
    });
}

function startElementResize(e: MouseEvent, el: StickerElement) {
    const startX = e.clientX;
    const startY = e.clientY;
    const initW = el.w;
    const initH = el.h;

    const onMove = (me: MouseEvent) => {
        el.w = Math.max(1, initW + (me.clientX - startX) / pxPerUnit);
        el.h = Math.max(1, initH + (me.clientY - startY) / pxPerUnit);
        updatePreview();
        renderPropertyPanel();
    };
    const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
}

function startElementDrag(e: MouseEvent, el: StickerElement) {
    const startX = e.clientX;
    const startY = e.clientY;
    const initX = el.x;
    const initY = el.y;

    const onMove = (me: MouseEvent) => {
        el.x = initX + (me.clientX - startX) / pxPerUnit;
        el.y = initY + (me.clientY - startY) / pxPerUnit;
        updatePreview();
        renderPropertyPanel();
    };
    const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
}

// --- Global UX Handlers ---
function setupGlobalListeners() {
    // Theme
    document.getElementById("btn-theme-toggle")!.onclick = () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle("dark-mode", isDarkMode);
        document.getElementById("btn-theme-toggle")!.innerText = isDarkMode ? "Light Mode" : "Dark Mode";
    };

    // Layout Props
    inputs.entity.onchange = (e) => {
        currentLayout.targetEntity = (e.target as HTMLSelectElement).value;
        renderPropertyPanel();
        updatePreview();
    };
    inputs.name.oninput = (e) => currentLayout.name = (e.target as HTMLInputElement).value;
    inputs.width.oninput = (e) => { currentLayout.width = parseFloat((e.target as HTMLInputElement).value) || 100; updatePreview(); };
    inputs.height.oninput = (e) => { currentLayout.height = parseFloat((e.target as HTMLInputElement).value) || 60; updatePreview(); };
    inputs.unit.onchange = (e) => {
        currentLayout.unit = (e.target as HTMLSelectElement).value as any;
        inputs.labelWidth.innerText = `Width (${currentLayout.unit})`;
        inputs.labelHeight.innerText = `Height (${currentLayout.unit})`;
        updatePreview();
    };
    inputs.bg.oninput = (e) => {
        currentLayout.backgroundColor = (e.target as HTMLInputElement).value;
        inputs.bgPreview.style.backgroundColor = currentLayout.backgroundColor;
        updatePreview();
    };

    // Elements
    document.getElementById("btn-add-text")!.onclick = () => {
        const id = "t" + Date.now();
        currentLayout.elements.push({ id, type: 'text', x: 10, y: 10, w: 40, h: 10, content: "New Text" });
        selectElement(id);
        updatePreview();
    };
    document.getElementById("btn-add-qr")!.onclick = () => {
        const id = "q" + Date.now();
        currentLayout.elements.push({ id, type: 'qr', x: 5, y: 5, w: 20, h: 20, content: "{{id}}" });
        selectElement(id);
        updatePreview();
    };
    document.getElementById("btn-delete-element")!.onclick = () => {
        currentLayout.elements = currentLayout.elements.filter(e => e.id !== selectedElementId);
        selectElement(null);
        updatePreview();
    };

    // Export Logic
    document.getElementById("btn-export-json")!.onclick = () => {
        const blob = new Blob([JSON.stringify(currentLayout, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${currentLayout.name.toLowerCase().replace(/ /g, "-")}.json`;
        a.click();
    };

    document.getElementById("btn-save-all")!.onclick = () => {
        console.log("Saving Layout Data:", currentLayout);
        alert("Layout data logged to console. In a real integration, this would trigger an onChange prop.");
    };
}

init();

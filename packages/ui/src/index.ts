import { StickerPrinter, StickerLayout, StickerElement } from "qrlayout-core";
import "./styles.css";

export { StickerPrinter };
export type { StickerLayout, StickerElement };

interface DesignerLayout extends StickerLayout {
    targetEntity?: string;
}

export interface EntityField {
    name: string;
    label: string;
}

export interface EntitySchema {
    label: string;
    fields: EntityField[];
    sampleData: any;
}

export interface DesignerOptions {
    element: HTMLElement;
    initialLayout?: StickerLayout;
    entitySchemas?: Record<string, EntitySchema>;
    onSave?: (layout: StickerLayout) => void;
}

export class QRLayoutDesigner {
    private container: HTMLElement;
    private currentLayout: DesignerLayout;
    private entitySchemas: Record<string, EntitySchema>;
    private selectedElementId: string | null = null;
    private isDarkMode = false;
    private pxPerUnit = 1;
    private printer: StickerPrinter;
    private onSaveCallback?: (layout: StickerLayout) => void;

    // DOM Elements
    private canvas!: HTMLCanvasElement;

    private editorOverlay!: HTMLDivElement;
    private elementsContainer!: HTMLDivElement;
    private propertyPanel!: HTMLDivElement;
    private propContent!: HTMLDivElement;
    private leftSidebar!: HTMLElement;
    private rightSidebar!: HTMLElement;

    // Inputs
    private inputs!: {
        entity: HTMLSelectElement;
        name: HTMLInputElement;
        width: HTMLInputElement;
        height: HTMLInputElement;
        unit: HTMLSelectElement;
        labelWidth: HTMLLabelElement;
        labelHeight: HTMLLabelElement;
        bg: HTMLInputElement;
        bgPreview: HTMLDivElement;
    };

    constructor(options: DesignerOptions) {
        this.container = options.element;
        this.printer = new StickerPrinter();
        this.onSaveCallback = options.onSave;
        this.entitySchemas = options.entitySchemas || {};

        // Default Layout if not provided
        this.currentLayout = (options.initialLayout as DesignerLayout) || {
            id: "layout-" + Date.now(),
            name: "New Layout",
            targetEntity: "",
            width: 100,
            height: 60,
            unit: "mm",
            backgroundColor: "#ffffff",
            elements: []
        };

        this.init();
    }

    private init() {
        this.renderTemplate();
        this.cacheDOM();
        this.renderEntityOptions(); // New method to populate select
        this.syncInputsFromLayout();
        this.bindEvents();
        this.renderElementsList();
        this.updatePreview();
    }

    private renderTemplate() {
        this.container.classList.add("qrlayout-designer");
        this.container.innerHTML = `
        <header>
            <div data-el="header-left"></div>
            <div style="display: flex; gap: 12px; align-items: center;">
                <button class="btn btn-icon btn-outline" data-action="toggle-theme" title="Toggle Dark Mode">
                    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                    <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </button>
                <button class="btn btn-primary" data-action="save">Save Layout</button>
            </div>
        </header>
        <div class="main-container">
            <div class="edit-view" style="display: flex; flex: 1; height: 100%;">
                <!-- LEFT SIDEBAR: CONFIG & ELEMENTS -->
                <aside class="sidebar">
                    <!-- Configuration -->
                    <div class="sidebar-section">
                        <div class="sidebar-title">Layout Settings</div>
                        <div class="form-group">
                            <label>Target Entity</label>
                            <select data-input="entity">
                                <option value="">Select Entity...</option>
                                <!-- Populated dynamically -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Internal Layout Name</label>
                            <input type="text" data-input="name" placeholder="Standard Badge" />
                        </div>
                        <div class="form-row">
                            <div class="form-group" style="flex: 1">
                                <label data-label="width">Width (mm)</label>
                                <input type="number" data-input="width" value="100" step="0.01" />
                            </div>
                            <div class="form-group" style="flex: 1">
                                <label data-label="height">Height (mm)</label>
                                <input type="number" data-input="height" value="60" step="0.01" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Measurement Unit</label>
                            <select data-input="unit">
                                <option value="mm">Millimeters (mm)</option>
                                <option value="cm">Centimeters (cm)</option>
                                <option value="in">Inches (in)</option>
                                <option value="px">Pixels (px)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Base Background</label>
                            <div class="color-picker-wrapper">
                                <div data-el="bg-preview" class="color-preview" style="background: #ffffff"></div>
                                <input type="text" data-input="bg" value="#ffffff" />
                            </div>
                        </div>
                    </div>

                    <!-- Elements List -->
                    <div class="sidebar-section">
                        <div class="sidebar-title">
                            Elements
                            <div style="display: flex; gap: 6px">
                                <button class="btn btn-outline btn-sm" data-action="add-text" title="Add Text">+ Text</button>
                                <button class="btn btn-outline btn-sm" data-action="add-qr" title="Add QR">+ QR</button>
                            </div>
                        </div>
                        <div data-el="elements-container" class="element-list" style="margin-top: 8px;"></div>
                    </div>
                </aside>

                <!-- CENTER: CANVAS -->
                <main class="preview-area">
                    <button id="toggle-left" class="sidebar-toggle" title="Toggle Settings">☰</button>
                    <button id="toggle-right" class="sidebar-toggle" title="Toggle Properties" style="display: none;">✎</button>

                    <div class="canvas-wrapper">
                        <canvas data-el="preview-canvas"></canvas>
                        <div data-el="editor-overlay" class="editor-overlay"></div>
                    </div>
                </main>

                <!-- RIGHT SIDEBAR: PROPERTIES -->
                <aside class="sidebar-right" data-el="property-panel" style="display: none;">
                    <div class="sidebar-section">
                        <div class="sidebar-title">Element Properties</div>
                        <div data-el="prop-content"></div>
                        <button class="btn btn-danger btn-block" data-action="delete-element" style="margin-top: 24px">Delete Element</button>
                    </div>
                </aside>
            </div>
        </div>
        `;
    }

    private cacheDOM() {
        const q = (sel: string) => this.container.querySelector(sel) as HTMLElement;
        const qi = (key: string) => this.container.querySelector(`[data-input="${key}"]`) as any;

        this.canvas = q('[data-el="preview-canvas"]') as HTMLCanvasElement;
        this.editorOverlay = q('[data-el="editor-overlay"]') as HTMLDivElement;
        this.elementsContainer = q('[data-el="elements-container"]') as HTMLDivElement;
        this.propertyPanel = q('[data-el="property-panel"]') as HTMLDivElement;
        this.propContent = q('[data-el="prop-content"]') as HTMLDivElement;
        this.leftSidebar = q('.sidebar');
        this.rightSidebar = q('.sidebar-right');

        this.inputs = {
            entity: qi('entity'),
            name: qi('name'),
            width: qi('width'),
            height: qi('height'),
            unit: qi('unit'),
            labelWidth: q('[data-label="width"]') as HTMLLabelElement,
            labelHeight: q('[data-label="height"]') as HTMLLabelElement,
            bg: qi('bg'),
            bgPreview: q('[data-el="bg-preview"]') as HTMLDivElement
        };
    }

    private renderEntityOptions() {
        const select = this.inputs.entity;
        // Keep the first default option "Select Entity..."
        while (select.options.length > 1) {
            select.remove(1);
        }

        Object.keys(this.entitySchemas).forEach(key => {
            const schema = this.entitySchemas[key];
            const option = document.createElement("option");
            option.value = key;
            option.text = schema.label || key;
            select.add(option);
        });
    }

    private syncInputsFromLayout() {
        this.inputs.entity.value = this.currentLayout.targetEntity || "";
        this.inputs.name.value = this.currentLayout.name;
        // Updated: Removed .toFixed(2) to show clean integers like 100 instead of 100.00
        this.inputs.width.value = String(this.currentLayout.width);
        this.inputs.height.value = String(this.currentLayout.height);
        this.inputs.unit.value = this.currentLayout.unit;
        this.inputs.labelWidth.innerText = `Width (${this.currentLayout.unit})`;
        this.inputs.labelHeight.innerText = `Height (${this.currentLayout.unit})`;
        this.inputs.bg.value = this.currentLayout.backgroundColor || "#ffffff";
        this.inputs.bgPreview.style.backgroundColor = this.inputs.bg.value;
    }

    private bindEvents() {
        // Global Buttons
        this.container.querySelector('[data-action="toggle-theme"]')?.addEventListener('click', (e) => {
            this.isDarkMode = !this.isDarkMode;
            this.container.classList.toggle("dark-mode", this.isDarkMode);
            const btn = (e.currentTarget as HTMLElement);
            const sun = btn.querySelector('.sun-icon') as HTMLElement;
            const moon = btn.querySelector('.moon-icon') as HTMLElement;
            if (this.isDarkMode) {
                sun.style.display = 'block';
                moon.style.display = 'none';
            } else {
                sun.style.display = 'none';
                moon.style.display = 'block';
            }
        });

        this.container.querySelector('[data-action="export-json"]')?.addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(this.currentLayout, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${this.currentLayout.name.toLowerCase().replace(/ /g, "-")}.json`;
            a.click();
        });

        this.container.querySelector('[data-action="save"]')?.addEventListener('click', () => {
            if (this.onSaveCallback) {
                this.onSaveCallback(this.currentLayout);
            }
        });

        // Sidebar Toggles
        this.container.querySelector('#toggle-left')?.addEventListener('click', () => {
            this.leftSidebar.classList.toggle("show");
        });
        const toggleRight = this.container.querySelector('#toggle-right');
        toggleRight?.addEventListener('click', () => {
            this.rightSidebar.classList.toggle("show");
        });

        // Layout Inputs
        this.inputs.entity.onchange = (e) => {
            this.currentLayout.targetEntity = (e.target as HTMLSelectElement).value;
            this.renderPropertyPanel();
            this.updatePreview();
        };
        this.inputs.name.oninput = (e) => this.currentLayout.name = (e.target as HTMLInputElement).value;
        this.inputs.width.oninput = (e) => { this.currentLayout.width = parseFloat((e.target as HTMLInputElement).value) || 100; this.updatePreview(); };
        this.inputs.height.oninput = (e) => { this.currentLayout.height = parseFloat((e.target as HTMLInputElement).value) || 60; this.updatePreview(); };
        this.inputs.unit.onchange = (e) => {
            this.currentLayout.unit = (e.target as HTMLSelectElement).value as any;
            this.inputs.labelWidth.innerText = `Width (${this.currentLayout.unit})`;
            this.inputs.labelHeight.innerText = `Height (${this.currentLayout.unit})`;
            this.updatePreview();
        };
        this.inputs.bg.oninput = (e) => {
            this.currentLayout.backgroundColor = (e.target as HTMLInputElement).value;
            this.inputs.bgPreview.style.backgroundColor = this.currentLayout.backgroundColor;
            this.updatePreview();
        };

        // Element Actions
        this.container.querySelector('[data-action="add-text"]')?.addEventListener('click', () => {
            const id = "t" + Date.now();
            this.currentLayout.elements.push({ id, type: 'text', x: 10, y: 10, w: 40, h: 10, content: "New Text" });
            this.selectElement(id);
            this.updatePreview();
        });

        this.container.querySelector('[data-action="add-qr"]')?.addEventListener('click', () => {
            const id = "q" + Date.now();
            this.currentLayout.elements.push({ id, type: 'qr', x: 5, y: 5, w: 20, h: 20, content: "{{id}}" });
            this.selectElement(id);
            this.updatePreview();
        });

        this.container.querySelector('[data-action="delete-element"]')?.addEventListener('click', () => {
            this.currentLayout.elements = this.currentLayout.elements.filter(e => e.id !== this.selectedElementId);
            this.selectElement(null);
            this.updatePreview();
        });

        // Resize observer to handle responsiveness
        new ResizeObserver(() => {
            if (this.container.offsetWidth > 768) {
                this.leftSidebar.classList.remove("show");
                this.rightSidebar.classList.remove("show");
            }
            this.renderPropertyPanel();
        }).observe(this.container);
    }

    public async updatePreview() {
        if (!this.canvas || !this.currentLayout) return;

        // Use sample data based on entity and provided schemas
        const sampleData = (this.currentLayout.targetEntity && this.entitySchemas[this.currentLayout.targetEntity])
            ? this.entitySchemas[this.currentLayout.targetEntity].sampleData
            : {};

        await this.printer.renderToCanvas(this.currentLayout, sampleData, this.canvas);

        const rect = this.canvas.getBoundingClientRect();
        this.pxPerUnit = rect.width / this.currentLayout.width;

        this.updateEditorOverlay();
    }

    private renderElementsList() {
        this.elementsContainer.innerHTML = "";
        this.currentLayout.elements.forEach(el => {
            const div = document.createElement("div");
            div.className = `element-item ${this.selectedElementId === el.id ? "active" : ""}`;
            div.innerHTML = `
                <div class="element-info">
                    <span class="element-name">${el.type.toUpperCase()}</span>
                    <span class="element-sub">${String(el.content).substring(0, 20)}</span>
                </div>
            `;
            div.onclick = () => this.selectElement(el.id);
            this.elementsContainer.appendChild(div);
        });
    }

    private selectElement(id: string | null) {
        this.selectedElementId = id;
        this.renderElementsList();
        this.renderPropertyPanel();
        this.updateEditorOverlay();

        // Auto-show right sidebar on mobile if an element is selected
        if (id && this.container.offsetWidth <= 768) {
            this.rightSidebar.classList.add("show");
        }
    }

    private renderPropertyPanel() {
        const toggleRight = this.container.querySelector("#toggle-right") as HTMLButtonElement;

        if (!this.selectedElementId) {
            this.propertyPanel.style.display = "none";
            if (toggleRight) toggleRight.style.display = "none";
            return;
        }

        if (this.container.offsetWidth <= 768) {
            if (toggleRight) toggleRight.style.display = "flex";
        } else {
            if (toggleRight) toggleRight.style.display = "none";
        }

        const el = this.currentLayout.elements.find(e => e.id === this.selectedElementId);
        if (!el) return;

        this.propertyPanel.style.display = "block";
        this.propContent.innerHTML = `
            <div class="form-group">
                ${el.type === 'qr' ? `
                <label>Field Separator</label>
                <input type="text" id="prop-qr-separator" placeholder="e.g. | or -" value="${el.qrSeparator || ''}">
                ` : ''}
                <label>Content</label>
                <textarea data-prop="content-val" rows="2">${el.content}</textarea>
                <div class="field-buttons" data-el="field-suggestions"></div>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:1;"><label>X (pos)</label><input type="number" step="0.01" data-prop="x" value="${el.x.toFixed(2)}"></div>
                <div class="form-group" style="flex:1;"><label>Y (pos)</label><input type="number" step="0.01" data-prop="y" value="${el.y.toFixed(2)}"></div>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:1;"><label>Width</label><input type="number" step="0.01" data-prop="w" value="${el.w.toFixed(2)}"></div>
                <div class="form-group" style="flex:1;"><label>Height</label><input type="number" step="0.01" data-prop="h" value="${el.h.toFixed(2)}"></div>
            </div>
            ${el.type === 'text' ? `
                <div style="height: 1px; background: var(--border-color); margin: 16px 0;"></div>
                <div class="form-row">
                    <div class="form-group" style="flex:1;">
                        <label>Font Size</label>
                        <input type="number" data-prop="fontSize" value="${el.style?.fontSize || 12}">
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Font Weight</label>
                        <select data-prop="fontWeight">
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

        // Suggestions from Props (using this.entitySchemas)
        const suggestions = this.propContent.querySelector('[data-el="field-suggestions"]');
        const entitySchema = this.currentLayout.targetEntity ? this.entitySchemas[this.currentLayout.targetEntity] : null;

        if (entitySchema && suggestions) {
            entitySchema.fields.forEach(f => {
                const pill = document.createElement("div");
                pill.className = "field-pill";
                pill.innerText = `+ ${f.label}`;
                pill.onclick = () => {
                    el.content += `{{${f.name}}}`;
                    this.renderPropertyPanel();
                    this.updatePreview();
                };
                suggestions.appendChild(pill);
            });
        }

        // Listeners for props
        const sepInput = this.propContent.querySelector("#prop-qr-separator");
        if (sepInput) {
            sepInput.addEventListener("input", (e) => {
                el.qrSeparator = (e.target as HTMLInputElement).value;
                this.updatePreview();
            });
        }

        const link = (key: string, field: string, isNum = false, subField?: string) => {
            const input = this.propContent.querySelector(`[data-prop="${key}"]`);
            if (!input) return;

            input.addEventListener("input", (e) => {
                const val = (e.target as HTMLInputElement).value;
                const finalVal = isNum ? parseFloat(val) || 0 : val;

                if (subField) {
                    if (!el.style) el.style = {};
                    (el.style as any)[subField] = finalVal;
                } else {
                    (el as any)[field] = finalVal;
                }
                this.updatePreview();
            });
        };

        link("content-val", "content");
        link("x", "x", true);
        link("y", "y", true);
        link("w", "w", true);
        link("h", "h", true);
        link("fontSize", "style", true, "fontSize");
        link("fontWeight", "style", false, "fontWeight");

        this.propContent.querySelectorAll(".prop-align-h").forEach(btn => {
            btn.addEventListener("click", () => {
                if (!el.style) el.style = {};
                el.style.textAlign = (btn as HTMLElement).dataset.val as any;
                this.renderPropertyPanel();
                this.updatePreview();
            });
        });

        this.propContent.querySelectorAll(".prop-align-v").forEach(btn => {
            btn.addEventListener("click", () => {
                if (!el.style) el.style = {};
                el.style.verticalAlign = (btn as HTMLElement).dataset.val as any;
                this.renderPropertyPanel();
                this.updatePreview();
            });
        });
    }

    private updateEditorOverlay() {
        if (!this.editorOverlay || !this.canvas) return;
        this.editorOverlay.style.width = this.canvas.style.width;
        this.editorOverlay.style.height = this.canvas.style.height;
        this.editorOverlay.innerHTML = "";

        this.currentLayout.elements.forEach(el => {
            const item = document.createElement("div");
            item.className = `editor-item ${this.selectedElementId === el.id ? "selected" : ""}`;
            item.style.left = `${el.x * this.pxPerUnit}px`;
            item.style.top = `${el.y * this.pxPerUnit}px`;
            item.style.width = `${el.w * this.pxPerUnit}px`;
            item.style.height = `${el.h * this.pxPerUnit}px`;

            if (this.selectedElementId === el.id) {
                const handle = document.createElement("div");
                handle.className = "resize-handle";
                handle.onmousedown = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.startElementResize(e, el);
                };
                item.appendChild(handle);
            }

            item.onmousedown = (e) => {
                e.preventDefault();
                this.selectElement(el.id);
                this.startElementDrag(e, el);
            };

            this.editorOverlay.appendChild(item);
        });
    }

    private startElementResize(e: MouseEvent, el: StickerElement) {
        const startX = e.clientX;
        const startY = e.clientY;
        const initW = el.w;
        const initH = el.h;

        const onMove = (me: MouseEvent) => {
            el.w = Math.max(1, initW + (me.clientX - startX) / this.pxPerUnit);
            el.h = Math.max(1, initH + (me.clientY - startY) / this.pxPerUnit);
            this.updatePreview();
            this.renderPropertyPanel();
        };
        const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    }

    private startElementDrag(e: MouseEvent, el: StickerElement) {
        const startX = e.clientX;
        const startY = e.clientY;
        const initX = el.x;
        const initY = el.y;

        const onMove = (me: MouseEvent) => {
            el.x = initX + (me.clientX - startX) / this.pxPerUnit;
            el.y = initY + (me.clientY - startY) / this.pxPerUnit;
            this.updatePreview();
            this.renderPropertyPanel();
        };
        const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    }

    public destroy() {
        this.container.innerHTML = "";
        this.container.classList.remove("qrlayout-designer");
        // Additional cleanup if necessary
    }
}

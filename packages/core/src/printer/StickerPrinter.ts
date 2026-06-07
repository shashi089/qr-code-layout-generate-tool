import { StickerLayout, StickerElement, StickerData, ImageFormat } from "../layout/schema";
import { generateQR } from "../qr/generator";
import type { PdfDoc } from "../pdf";

export interface DataUrlOptions {
    format?: ImageFormat;
    quality?: number;
    canvas?: HTMLCanvasElement;
}

export interface ExportPNGOptions {
    /** Override the canvas element used for rendering (useful for server-side/Node rendering). */
    canvas?: HTMLCanvasElement;
}

export interface ZplOptions {
    /**
     * The print resolution of the target Zebra printer in dots-per-inch (DPI).
     * This must match your printer's physical DPI setting exactly — wrong DPI
     * causes all positions, sizes, and fonts to be scaled incorrectly on the label.
     *
     * Common Zebra DPI values:
     * - `203` — standard desktop label printers (default)
     * - `300` — mid-range / high-quality printers
     * - `600` — high-resolution printers
     *
     * @default 203
     */
    dpi?: 203 | 300 | 600 | number;

    /**
     * QR code error correction level.
     * Higher levels allow the code to be read even if partially damaged,
     * at the cost of a denser/larger QR pattern.
     *
     * - `L` — ~7% data restoration  (lowest density)
     * - `M` — ~15% data restoration (default, good for most labels)
     * - `Q` — ~25% data restoration
     * - `H` — ~30% data restoration (use when label may be dirty or worn)
     *
     * @default "M"
     */
    qrErrorCorrection?: "L" | "M" | "Q" | "H";
}

export class StickerPrinter {

    // ─── Unit Conversion ────────────────────────────────────────────────────────

    /** Convert a layout-unit value to pixels (96 dpi baseline for canvas). */
    private toPx(value: number, unit: string): number {
        switch (unit) {
            case "mm": return (value * 96) / 25.4;
            case "cm": return (value * 96) / 2.54;
            case "in": return value * 96;
            case "px":
            default:   return value;
        }
    }

    // ─── Template Variable Parser ────────────────────────────────────────────────

    /** Replace {{variable}} placeholders in a content string with actual data values. */
    private parseContent(content: string, data: StickerData, separator?: string): string {
        let processed = content;
        if (separator) {
            processed = processed.replace(/\}\}\s*\{\{/g, `}}${separator}{{`);
        }
        return processed.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            const trimmedKey = key.trim();
            return data[trimmedKey] !== undefined ? String(data[trimmedKey]) : "";
        });
    }

    // ─── Canvas Renderer ─────────────────────────────────────────────────────────

    /**
     * Render a single label onto an existing HTML Canvas element.
     * The canvas dimensions are automatically set to match the layout size.
     */
    public async renderToCanvas(
        layout: StickerLayout,
        data: StickerData,
        canvas: HTMLCanvasElement
    ): Promise<void> {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context not available");

        canvas.width  = this.toPx(layout.width,  layout.unit);
        canvas.height = this.toPx(layout.height, layout.unit);

        // Background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (layout.backgroundColor) {
            ctx.fillStyle = layout.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        if (layout.backgroundImage) {
            await this.drawImage(ctx, layout.backgroundImage, 0, 0, canvas.width, canvas.height);
        }

        // Elements
        for (const element of layout.elements) {
            const x = this.toPx(element.x, layout.unit);
            const y = this.toPx(element.y, layout.unit);
            const w = this.toPx(element.w, layout.unit);
            const h = this.toPx(element.h, layout.unit);

            const filledContent = this.parseContent(
                element.content,
                data,
                element.type === "qr" ? element.qrSeparator : undefined
            );

            if (element.type === "qr") {
                if (filledContent) {
                    const qrUrl = await generateQR(filledContent);
                    await this.drawImage(ctx, qrUrl, x, y, w, h);
                }
            } else if (element.type === "text") {
                this.drawText(ctx, element, filledContent, x, y, w, h);
            }
        }
    }

    /**
     * Render a single label and return it as a data URL string.
     * Use this result as an `<img src>` or pass it to `URL.createObjectURL`.
     *
     * @param format  Image format: "png" (default), "jpeg", "jpg", or "webp"
     * @param quality Compression quality for jpeg/webp (0.0–1.0). Ignored for png.
     */
    public async renderToDataURL(
        layout: StickerLayout,
        data: StickerData,
        options?: DataUrlOptions
    ): Promise<string> {
        const format = (options?.format || "png").toLowerCase() as ImageFormat;
        const mime   = format === "jpg" ? "image/jpeg" : `image/${format}`;
        const canvas = options?.canvas || this.createCanvas();
        await this.renderToCanvas(layout, data, canvas);
        return canvas.toDataURL(mime, options?.quality);
    }

    /**
     * Export a single label as a PNG `Blob` — ready for download or the File API.
     *
     * @example
     * const blob = await printer.exportToPNG(layout, data);
     * const url  = URL.createObjectURL(blob);
     * const a    = document.createElement("a");
     * a.href     = url;
     * a.download = "label.png";
     * a.click();
     * URL.revokeObjectURL(url);
     */
    public async exportToPNG(
        layout: StickerLayout,
        data: StickerData,
        options?: ExportPNGOptions
    ): Promise<Blob> {
        const canvas  = options?.canvas || this.createCanvas();
        const dataUrl = await this.renderToDataURL(layout, data, { format: "png", canvas });

        // Convert data URL → Blob without requiring fetch (works in all environments)
        const [header, base64] = dataUrl.split(",");
        const mime             = header.match(/:(.*?);/)?.[1] ?? "image/png";
        const binary           = atob(base64);
        const bytes            = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new Blob([bytes], { type: mime });
    }

    /**
     * Batch-export multiple records as data URL strings (one per record).
     * Useful for generating image previews for a list of items.
     */
    public async exportImages(
        layout: StickerLayout,
        dataList: StickerData[],
        options?: DataUrlOptions
    ): Promise<string[]> {
        const results: string[] = [];
        for (const data of dataList) {
            results.push(await this.renderToDataURL(layout, data, options));
        }
        return results;
    }

    // ─── Internal: Text Rendering (with word wrap) ───────────────────────────────

    private drawText(
        ctx: CanvasRenderingContext2D,
        el: StickerElement,
        text: string,
        x: number,
        y: number,
        w: number,
        h: number
    ): void {
        const style      = el.style || {};
        const fontSize   = style.fontSize   || 12;
        const fontFamily = style.fontFamily || "sans-serif";
        const fontWeight = style.fontWeight || "normal";
        const lineHeight = fontSize * (style.lineHeight ?? 1.25);
        const shouldWrap = style.wordWrap !== false; // default: true

        ctx.font      = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = style.color || "#000";
        ctx.textAlign = (style.textAlign as CanvasTextAlign) || "left";

        // Horizontal anchor point
        let drawX = x;
        if (style.textAlign === "center") drawX = x + w / 2;
        if (style.textAlign === "right")  drawX = x + w;

        // ── Word-wrap: split text into lines that fit within w ────────────────
        const lines = this.wrapText(ctx, text, w, shouldWrap);

        // ── Vertical alignment of the whole text block ────────────────────────
        const blockHeight = lines.length * lineHeight;
        let blockStartY: number;

        if (style.verticalAlign === "middle") {
            blockStartY = y + (h - blockHeight) / 2;
        } else if (style.verticalAlign === "bottom") {
            blockStartY = y + h - blockHeight;
        } else {
            blockStartY = y; // "top" (default)
        }

        // ── Draw each line using "top" baseline for predictable positioning ───
        ctx.textBaseline = "top";
        lines.forEach((line, i) => {
            ctx.fillText(line, drawX, blockStartY + i * lineHeight);
        });
    }

    /**
     * Break `text` into an array of lines that each fit within `maxWidth` pixels.
     * When `wrap` is false the original text is returned as a single-element array.
     */
    private wrapText(
        ctx: CanvasRenderingContext2D,
        text: string,
        maxWidth: number,
        wrap: boolean
    ): string[] {
        if (!wrap) return [text];

        // Support explicit newlines (\n) in content
        const paragraphs = text.split("\n");
        const lines: string[] = [];

        for (const paragraph of paragraphs) {
            const words = paragraph.split(" ");
            let current = "";

            for (const word of words) {
                const candidate = current ? `${current} ${word}` : word;
                if (ctx.measureText(candidate).width > maxWidth && current) {
                    lines.push(current);
                    current = word;
                } else {
                    current = candidate;
                }
            }
            if (current) lines.push(current);
        }

        return lines.length > 0 ? lines : [""];
    }

    // ─── Internal: Image Drawing ─────────────────────────────────────────────────

    private drawImage(
        ctx: CanvasRenderingContext2D,
        url: string,
        x: number,
        y: number,
        w: number,
        h: number
    ): Promise<void> {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload  = () => { ctx.drawImage(img, x, y, w, h); resolve(); };
            img.onerror = () => resolve(); // Don't block render if image fails
            img.src = url;
        });
    }

    private createCanvas(): HTMLCanvasElement {
        if (typeof document === "undefined") {
            throw new Error(
                "Canvas creation requires a DOM environment. " +
                "Pass a canvas explicitly via options.canvas when rendering server-side."
            );
        }
        return document.createElement("canvas");
    }

    // ─── PDF Export ──────────────────────────────────────────────────────────────

    /**
     * Export all records as a multi-page PDF document (one page per record).
     * Requires the optional peer dependency: `npm install jspdf`
     *
     * @example
     * const pdf = await printer.exportToPDF(layout, employees);
     * pdf.save("badges.pdf");
     */
    public async exportToPDF(
        layout: StickerLayout,
        dataList: Record<string, any>[]
    ): Promise<PdfDoc> {
        try {
            const { exportToPDF } = await import("../pdf");
            return await exportToPDF(layout, dataList);
        } catch {
            throw new Error(
                "PDF export requires the optional dependency 'jspdf'. " +
                "Run: npm install jspdf"
            );
        }
    }

    // ─── ZPL Export ──────────────────────────────────────────────────────────────

    /**
     * Export all records as ZPL (Zebra Programming Language) strings.
     * Returns one ZPL string per record — send each directly to a thermal printer.
     *
     * **Important:** Pass the `dpi` option matching your printer's physical resolution.
     * Using the wrong DPI will cause all positions, sizes, and fonts to print at the
     * wrong scale. Common values: `203` (default), `300`, `600`.
     *
     * @example
     * // 203 DPI printer (default — no option needed)
     * const pages = printer.exportToZPL(layout, employees);
     *
     * // 300 DPI printer
     * const pages = printer.exportToZPL(layout, employees, { dpi: 300 });
     *
     * // 600 DPI printer with high error correction on QR codes
     * const pages = printer.exportToZPL(layout, employees, { dpi: 600, qrErrorCorrection: 'H' });
     */
    public exportToZPL(
        layout: StickerLayout,
        dataList: Record<string, any>[],
        options?: ZplOptions
    ): string[] {
        const dpi              = options?.dpi ?? 203;    // dots per inch
        const dpmm             = dpi / 25.4;             // dots per mm (derived from actual DPI)
        const qrErrorLevel     = options?.qrErrorCorrection ?? "M"; // ZPL ^BQ d-param

        // Convert a value in the layout's unit to printer dots
        const toDots = (val: number, unit: string): number => {
            let mm = 0;
            switch (unit) {
                case "mm": mm = val; break;
                case "cm": mm = val * 10; break;
                case "in": mm = val * 25.4; break;
                case "px": mm = val * (25.4 / 96); break;
                default:   mm = val;
            }
            return Math.round(mm * dpmm);
        };

        /**
         * Escape content for safe use inside a ZPL ^FD...^FS field.
         *
         * ZPL treats `^` as a command delimiter and `~` as a tilde command prefix.
         * If user data contains either character, it breaks the ZPL stream.
         *
         * Fix: emit ^FH before the field, which tells the printer to interpret
         * underscore-hex sequences. Then encode `^` as `_5E` and `~` as `_7E`.
         * Any literal `_` in the data must also be escaped as `_5F`.
         *
         * Returns { prefix, escaped } where prefix is "^FH" or "".
         */
        const escapeFieldData = (text: string): { prefix: string; value: string } => {
            const needsEscape = /[\^~_]/.test(text);
            if (!needsEscape) return { prefix: "", value: text };
            const escaped = text
                .replace(/_/g, "_5F")  // must be first to avoid double-escaping
                .replace(/\^/g, "_5E")
                .replace(/~/g,  "_7E");
            return { prefix: "^FH", value: escaped };
        };

        return dataList.map(data => {
            const widthDots  = toDots(layout.width,  layout.unit);
            const heightDots = toDots(layout.height, layout.unit);

            let zpl = "^XA\n";
            zpl += `^PW${widthDots}\n`;   // Label print width in dots
            zpl += `^LL${heightDots}\n`;  // Label length in dots

            for (const element of layout.elements) {
                const filledContent = this.parseContent(
                    element.content,
                    data,
                    element.type === "qr" ? element.qrSeparator : undefined
                );
                const x = toDots(element.x, layout.unit);
                const y = toDots(element.y, layout.unit);

                if (element.type === "text") {
                    const fontSizePt     = element.style?.fontSize || 12;
                    // 1 pt = 1/72 inch; dots = pt * (dpi / 72)
                    const fontHeightDots = Math.round(fontSizePt * (dpi / 72));
                    const { prefix, value } = escapeFieldData(filledContent);

                    // ^FO  — field origin (x, y in dots)
                    // ^A0N — scalable built-in font, Normal orientation, height x width
                    // ^FH  — enable hex escaping in ^FD (only emitted when needed)
                    // ^FD  — field data
                    // ^FS  — field separator (end of field)
                    zpl += `^FO${x},${y}^A0N,${fontHeightDots},${fontHeightDots}${prefix}^FD${value}^FS\n`;

                } else if (element.type === "qr") {
                    const wDots = toDots(element.w, layout.unit);

                    // QR magnification factor (1–10):
                    // A QR Version-1 code is 21x21 modules. The mag factor is
                    // how many printer dots each module occupies.
                    // mag = floor(elementWidthDots / 21), clamped to [1, 10].
                    const mag = Math.min(10, Math.max(1, Math.floor(wDots / 21)));

                    const { prefix, value } = escapeFieldData(filledContent);

                    // ^FO   — field origin
                    // ^BQN  — QR code, Normal orientation, model 2 (enhanced), mag, error-correction
                    // ^FH   — hex escaping (only when content has ^ or ~)
                    // ^FDQA,data — QA, prefix: Q=error-correction indicator (matches ^BQ d-param),
                    //              A=auto encoding mode selection
                    zpl += `^FO${x},${y}^BQN,2,${mag},${qrErrorLevel}${prefix}^FD${qrErrorLevel}A,${value}^FS\n`;
                }
            }

            zpl += "^XZ";
            return zpl;
        });
    }
}

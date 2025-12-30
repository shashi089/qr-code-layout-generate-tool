import { StickerLayout, StickerElement, StickerData, ImageFormat } from "../layout/schema";
import { generateQR } from "../qr/generator";
import type { PdfDoc } from "../pdf";

export interface DataUrlOptions {
    format?: ImageFormat;
    quality?: number;
    canvas?: HTMLCanvasElement;
}

export class StickerPrinter {

    // Helper to convert units to Pixels (Canvas) and Points (PDF)
    // We'll use 96 dpi for screen/canvas calculations
    private toPx(value: number, unit: string): number {
        switch (unit) {
            case "mm": return (value * 96) / 25.4;
            case "cm": return (value * 96) / 2.54;
            case "in": return value * 96;
            case "px": default: return value;
        }
    }

    // Parse variable content like "{{name}}"
    private parseContent(content: string, data: StickerData): string {
        return content.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            const trimmedKey = key.trim();
            return data[trimmedKey] !== undefined ? String(data[trimmedKey]) : "";
        });
    }

    // --- HTML Canvas Renderer (Preview & Image Export) ---

    public async renderToCanvas(
        layout: StickerLayout,
        data: StickerData,
        canvas: HTMLCanvasElement
    ): Promise<void> {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context not available");

        // Setup Canvas Size
        canvas.width = this.toPx(layout.width, layout.unit);
        canvas.height = this.toPx(layout.height, layout.unit);

        // Clear & Background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (layout.backgroundColor) {
            ctx.fillStyle = layout.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        if (layout.backgroundImage) {
            await this.drawImage(ctx, layout.backgroundImage, 0, 0, canvas.width, canvas.height);
        }

        // Render Elements
        for (const element of layout.elements) {
            const x = this.toPx(element.x, layout.unit);
            const y = this.toPx(element.y, layout.unit);
            const w = this.toPx(element.w, layout.unit);
            const h = this.toPx(element.h, layout.unit);

            const filledContent = this.parseContent(element.content, data);

            if (element.type === "qr") {
                if (filledContent) {
                    const qrUrl = await generateQR(filledContent);
                    await this.drawImage(ctx, qrUrl, x, y, w, h);
                }
            } else if (element.type === "text") {
                this.drawText(ctx, element, filledContent, x, y, w, h);
            } else if (element.type === "image") {
                if (filledContent) { // Assume content is URL
                    await this.drawImage(ctx, filledContent, x, y, w, h);
                }
            }
        }
    }

    public async renderToDataURL(
        layout: StickerLayout,
        data: StickerData,
        options?: DataUrlOptions
    ): Promise<string> {
        const format = (options?.format || "png").toLowerCase() as ImageFormat;
        const mime = format === "jpg" ? "image/jpeg" : `image/${format}`;
        const canvas = options?.canvas || this.createCanvas();
        await this.renderToCanvas(layout, data, canvas);
        return canvas.toDataURL(mime, options?.quality);
    }

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

    private drawText(ctx: CanvasRenderingContext2D, el: StickerElement, text: string, x: number, y: number, w: number, h: number) {
        const style = el.style || {};
        const fontSize = style.fontSize || 12;
        const fontFamily = style.fontFamily || "sans-serif";
        const fontWeight = style.fontWeight || "normal";

        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = style.color || "#000";
        ctx.textBaseline = "top";
        ctx.textAlign = (style.textAlign as CanvasTextAlign) || "left";

        // Handle Alignment X adjusment
        let drawX = x;
        if (style.textAlign === "center") drawX = x + w / 2;
        if (style.textAlign === "right") drawX = x + w;

        ctx.fillText(text, drawX, y);
    }

    private drawImage(ctx: CanvasRenderingContext2D, url: string, x: number, y: number, w: number, h: number): Promise<void> {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                ctx.drawImage(img, x, y, w, h);
                resolve();
            };
            img.onerror = () => resolve(); // Don't block if image fails
            img.src = url;
        });
    }

    private createCanvas(): HTMLCanvasElement {
        if (typeof document === "undefined") {
            throw new Error("Canvas creation requires a DOM environment. Pass a canvas explicitly when rendering server-side.");
        }
        return document.createElement("canvas");
    }

    // --- PDF Exporter ---

    public async exportToPDF(
        layout: StickerLayout,
        dataList: Record<string, any>[]
    ): Promise<PdfDoc> {
        try {
            const { exportToPDF } = await import("../pdf");
            return await exportToPDF(layout, dataList);
        } catch (err) {
            throw new Error("PDF export requires optional dependency 'jspdf'. Install it to use exportToPDF().");
        }
    }

    // --- ZPL Exporter ---

    public exportToZPL(
        layout: StickerLayout,
        dataList: Record<string, any>[]
    ): string[] {
        const dpi = 203; // Standard Zebra DPI
        const dpmm = 8;  // dots per mm

        // Helper to convert to dots
        const toDots = (val: number, unit: string) => {
            let mm = 0;
            switch (unit) {
                case "mm": mm = val; break;
                case "cm": mm = val * 10; break;
                case "in": mm = val * 25.4; break;
                case "px": mm = val * (25.4 / 96); break;
                default: mm = val;
            }
            return Math.round(mm * dpmm);
        };

        const results: string[] = [];

        for (const data of dataList) {
            let zpl = "^XA\n"; // Start Format

            // Label Length (optional but good practice)
            // ^LL<length in dots>
            const heightDots = toDots(layout.height, layout.unit);
            const widthDots = toDots(layout.width, layout.unit);
            zpl += `^PW${widthDots}\n`;
            zpl += `^LL${heightDots}\n`;

            for (const element of layout.elements) {
                const filledContent = this.parseContent(element.content, data);
                const x = toDots(element.x, layout.unit);
                const y = toDots(element.y, layout.unit);

                zpl += `^FO${x},${y}`;

                if (element.type === "text") {
                    // Font mapping is tricky. We'll use Scalable Font 0 (^A0)
                    // Height in dots.
                    const style = element.style || {};
                    const fontSizePt = style.fontSize || 12;
                    // Approximate pt to dots conversion (1 pt = 1/72 inch). 203 DPI.
                    // dots = pt * (203/72) ~ pt * 2.8
                    const fontHeightDots = Math.round(fontSizePt * 2.8);

                    zpl += `^A0N,${fontHeightDots},${fontHeightDots}`;
                    zpl += `^FD${filledContent}^FS\n`;
                }
                else if (element.type === "qr") {
                    // ^BQN,2,height
                    // ZPL QR codes are controlled by magnification factor mostly.
                    const w = toDots(element.w, layout.unit);
                    // Mag factor 1-10. Approximate based on width? 
                    // Let's assume a reasonable default magnification or calculate roughly.
                    // ^BQa,b,c,d,e
                    // ^BQN,2,height
                    let mag = 2;
                    if (w > 100) mag = 4;
                    if (w > 200) mag = 6;

                    zpl += `^BQN,2,${mag}`;
                    zpl += `^FDQA,${filledContent}^FS\n`;
                }
                // Images are very hard in pure ZPL text (need hex conversion), skipping for simple implementation
            }

            zpl += "^XZ"; // End Format
            results.push(zpl);
        }

        return results;
    }

}

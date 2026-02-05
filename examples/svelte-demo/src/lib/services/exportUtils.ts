import { StickerPrinter } from 'qrlayout-core';
import { exportToPDF } from 'qrlayout-core/pdf';
import type { StickerLayout } from 'qrlayout-ui';

/**
 * Export options for batch exports
 */
export interface ExportOptions {
    /** The layout template to use for rendering */
    layout: StickerLayout;
    /** Array of data items to export */
    items: any[];
    /** Printer instance for rendering */
    printer: StickerPrinter;
    /** Base filename for the export (without extension) */
    baseFilename: string;
}

/**
 * Export selected items as PNG images
 * Downloads one PNG file per item
 */
export async function exportToPNG(options: ExportOptions): Promise<void> {
    const { layout, items, printer, baseFilename } = options;

    if (!layout || items.length === 0) {
        console.warn('Cannot export PNG: missing layout or items');
        return;
    }

    for (const item of items) {
        const dataUrl = await printer.renderToDataURL(layout, item, { format: 'png' });

        const link = document.createElement('a');
        link.download = `${baseFilename}-${item.id || Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    }
}

/**
 * Export selected items as a single PDF document
 * All items are combined into one PDF file
 */
export async function exportToBatchPDF(options: ExportOptions): Promise<void> {
    const { layout, items, baseFilename } = options;

    if (!layout || items.length === 0) {
        console.warn('Cannot export PDF: missing layout or items');
        return;
    }

    const pdf = await exportToPDF(layout, items);
    pdf.save(`${baseFilename}-${Date.now()}.pdf`);
}

/**
 * Export selected items as ZPL code in a text file
 * All ZPL commands are combined into one .txt file
 */
export function exportToZPLFile(options: ExportOptions): void {
    const { layout, items, printer, baseFilename } = options;

    if (!layout || items.length === 0) {
        console.warn('Cannot export ZPL: missing layout or items');
        return;
    }

    const zplArray = printer.exportToZPL(layout, items);
    const zplContent = zplArray.join('\n');

    console.log('ZPL Code generated:', zplContent);

    // Download ZPL as txt file
    const blob = new Blob([zplContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${baseFilename}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

import jsPDF from "jspdf";
import { StickerLayout, StickerData } from "./layout/schema";
import { generateQR } from "./qr/generator";

export type PdfDoc = InstanceType<typeof jsPDF>;

function parseContent(content: string, data: StickerData): string {
  return content.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const trimmedKey = String(key).trim();
    return data[trimmedKey] !== undefined ? String(data[trimmedKey]) : "";
  });
}

async function resolveDataUrl(src: string): Promise<string | undefined> {
  if (!src) return undefined;
  if (src.startsWith("data:")) return src;
  if (typeof fetch === "undefined" || typeof FileReader === "undefined") return undefined;
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Could not resolve data URL", err);
    return undefined;
  }
}

export async function exportToPDF(
  layout: StickerLayout,
  dataList: Record<string, any>[]
): Promise<PdfDoc> {
  const validUnits = ["pt", "px", "in", "mm", "cm"];
  const pdfUnit = validUnits.includes(layout.unit) ? (layout.unit as any) : "mm";

  const doc = new jsPDF({
    orientation: layout.width > layout.height ? "l" : "p",
    unit: pdfUnit,
    format: [layout.width, layout.height]
  });

  for (let i = 0; i < dataList.length; i++) {
    if (i > 0) doc.addPage([layout.width, layout.height], layout.width > layout.height ? "l" : "p");

    const data = dataList[i];

    if (layout.backgroundColor) {
      doc.setFillColor(layout.backgroundColor);
      doc.rect(0, 0, layout.width, layout.height, "F");
    }
    if (layout.backgroundImage) {
      const dataUrl = await resolveDataUrl(layout.backgroundImage);
      if (dataUrl) {
        doc.addImage(dataUrl, "PNG", 0, 0, layout.width, layout.height);
      }
    }

    for (const element of layout.elements) {
      const filledContent = parseContent(element.content, data);
      const { x, y, w, h } = element;

      if (element.type === "qr") {
        if (filledContent) {
          const qrUrl = await generateQR(filledContent);
          doc.addImage(qrUrl, "PNG", x, y, w, h);
        }
      } else if (element.type === "image") {
        if (filledContent) {
          try {
            doc.addImage(filledContent, "PNG", x, y, w, h);
          } catch (e) {
            console.warn("Could not add image to PDF", e);
          }
        }
      } else if (element.type === "text") {
        const style = element.style || {};
        const fontSize = style.fontSize || 12;
        const color = style.color || "#000000";

        doc.setFontSize(fontSize);
        doc.setTextColor(color);

        let drawX = x;
        const align = style.textAlign || "left";
        if (align === "center") drawX = x + w / 2;
        if (align === "right") drawX = x + w;

        doc.text(filledContent, drawX, y, {
          baseline: "top",
          align: align as "left" | "center" | "right"
        });
      }
    }
  }

  return doc;
}

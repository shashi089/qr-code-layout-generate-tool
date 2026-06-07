export type Unit = "mm" | "px" | "cm" | "in";

export type ElementType = "text" | "qr";

export interface ElementStyle {
    // Typography
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string | number;
    color?: string;

    // Layout
    textAlign?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";

    /**
     * Line height multiplier relative to fontSize. Defaults to 1.25.
     * Example: fontSize=12, lineHeight=1.5 → 18px between lines.
     */
    lineHeight?: number;

    /**
     * Whether long text automatically wraps to the next line when it
     * exceeds the element's width (w). Defaults to true.
     * Set to false to force single-line rendering (text will be clipped).
     */
    wordWrap?: boolean;

    // General
    backgroundColor?: string;
}

export interface StickerElement {
    id: string;
    type: ElementType;

    // Position & Size (based on Layout Unit)
    x: number;
    y: number;
    w: number;
    h: number;

    // Content
    // content can be static text like "Name:"
    // OR dynamic variable like "{{name}}"
    content: string;

    // Optional separator for multi-variable QR codes
    qrSeparator?: string;

    style?: ElementStyle;
}

export type StickerData = Record<string, unknown>;

export interface StickerLayout {
    id: string;
    name: string;
    width: number;
    height: number;
    unit: Unit;
    elements: StickerElement[];
    targetEntity?: string;

    // Optional background
    backgroundColor?: string;
    backgroundImage?: string;
}

export type ImageFormat = "png" | "jpeg" | "jpg" | "webp";

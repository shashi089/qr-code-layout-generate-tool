export type Unit = "mm" | "px" | "cm" | "in";

export type ElementType = "text" | "qr" | "image";

export interface ElementStyle {
    // Text specific
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string | number;
    textAlign?: "left" | "center" | "right";
    color?: string;

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
    h: number; // For Text, h might be "auto" or ignored mostly, but useful for bounding box

    // Content
    // content can be static text like "Name:" 
    // OR dynamic variable like "{{name}}"
    content: string;

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

    // Optional background
    backgroundColor?: string;
    backgroundImage?: string;
}

export type ImageFormat = "png" | "jpeg" | "jpg" | "webp";

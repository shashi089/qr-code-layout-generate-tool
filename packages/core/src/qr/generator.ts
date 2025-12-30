import QRCode from "qrcode";

export async function generateQR(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error("Error generating QR code", err);
    return "";
  }
}

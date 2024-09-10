import { removeBackground } from '@imgly/background-removal-node';
import { readFileSync } from 'fs';

export async function removeImageBackground(
    imgSource: string
): Promise<string> {
    const blob = await removeBackground(imgSource);
    const buffer = Buffer.from(await blob.arrayBuffer());
    return buffer.toString('base64');
}

export function convertImageToBase64(imagePath: string): string {
    const imgBuffer = readFileSync(imagePath);
    return imgBuffer.toString('base64');
}

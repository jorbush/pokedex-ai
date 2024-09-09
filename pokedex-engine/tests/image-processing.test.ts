import { describe, expect, it } from 'bun:test';
import { removeImageBackground, convertImageToBase64 } from '../src/image-processing';

describe('Image Processing', () => {
    it('should convert an image to base64', () => {
        const base64Image = convertImageToBase64('./img/001.png');
        expect(base64Image).toBeDefined();
        expect(base64Image.length).toBeGreaterThan(0);
    });

    it('should remove the background from an image', async () => {
        const base64Image = await removeImageBackground('./img/001.png');
        expect(base64Image).toBeDefined();
    });
});

import { LOCAL_IP } from '@env';
import { PokedexEngineResponse } from '../types/pokemon';

export const sendImageToServer = async (
    base64Image: string
): Promise<PokedexEngineResponse> => {
    const response = await fetch(`http://${LOCAL_IP}:3000/pokedex`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
        throw new Error('Failed to send the image to the server');
    }

    const responseData = await response.json();
    return responseData.data;
};

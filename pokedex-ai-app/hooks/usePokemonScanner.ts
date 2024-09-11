import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { PokemonData } from '../types/pokemon';
import { sendImageToServer } from '../utils/api';

const usePokemonScanner = () => {
    const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
    const [pokemonImage, setPokemonImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Camera permission is required!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            base64: true,
            quality: 1,
        });

        if (!result.canceled && result.assets[0].base64) {
            await processImage(result.assets[0].base64);
        } else {
            Alert.alert('No image was taken');
        }
    };

    const processImage = async (base64Image: string) => {
        setIsLoading(true);
        try {
            const responseData = await sendImageToServer(base64Image);
            setPokemonData(responseData.data);
            setPokemonImage(responseData.pokedexImage);
        } catch (error) {
            console.error('Error processing image:', error);
            Alert.alert('Error', 'Failed to process the image');
        } finally {
            setIsLoading(false);
        }
    };

    return { pokemonData, pokemonImage, isLoading, openCamera };
};

export default usePokemonScanner;

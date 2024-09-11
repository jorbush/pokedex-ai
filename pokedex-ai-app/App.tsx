import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    Text,
    View,
    Alert,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LOCAL_IP } from '@env';
import { Ionicons } from '@expo/vector-icons';

export interface PokemonData {
    Ab: Array<{ n: string; id: number; isH: boolean }>;
    BE: number;
    H: number;
    HI: string[];
    id: number;
    isD: boolean;
    N: string;
    Sp: { n: string; id: number };
    St: Array<{ n: string; EV: number; bs: number }>;
    T: Array<{ n: string; id: number }>;
    W: number;
}

export interface PokedexEngineResponse {
    data: PokemonData;
    pokedexImage: string;
}

const PokemonTitle = ({ text }: { text: string }) => (
    <Text
        className="text-4xl font-bold text-yellow-300 tracking-widest"
        style={{
            textShadowColor: '#2a75bb',
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10,
        }}
    >
        {text}
    </Text>
);

const PokemonInfo = ({ data, image }: { data: PokemonData; image: string }) => {
    return (
        <ScrollView className="flex-1 w-full px-4">
            <View className="items-center my-4">
                <Image
                    source={{ uri: `data:image/png;base64,${image}` }}
                    className="w-64 h-64 resizeMode-contain"
                    onError={(error) =>
                        console.error(
                            'Image loading error:',
                            error.nativeEvent.error
                        )
                    }
                />
            </View>
            <Text className="text-2xl font-bold text-white mb-2">{data.N}</Text>
            <Text className="text-white">
                Type: {data.T.map((t) => t.n).join(', ')}
            </Text>
            <Text className="text-white">Height: {data.H / 10}m</Text>
            <Text className="text-white">Weight: {data.W / 10}kg</Text>
            <Text className="text-white">
                Abilities: {data.Ab.map((a) => a.n).join(', ')}
            </Text>
            <Text className="text-white font-bold mt-2">Base Stats:</Text>
            {data.St.map((stat, index) => (
                <Text
                    key={index}
                    className="text-white"
                >
                    {stat.n}: {stat.bs}
                </Text>
            ))}
        </ScrollView>
    );
};

export default function App() {
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
        if (!result.canceled && result.assets[0].base64 !== null) {
            await sendImageToServer(result.assets[0].base64);
        } else {
            Alert.alert('No image was taken');
        }
    };

    const sendImageToServer = async (base64Image: string | undefined) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://${LOCAL_IP}:3000/pokedex`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image }),
            });
            const responseData: PokedexEngineResponse = (await response.json())
                .data;
            setPokemonData(responseData.data);
            setPokemonImage(responseData.pokedexImage);
        } catch (error) {
            console.error('Error sending image:', error);
            console.log('LocalIP:', LOCAL_IP);
            Alert.alert('Error', 'Failed to send the image to the server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex flex-col h-screen bg-red-600 py-10">
            <View className="pt-12 pb-4 items-center">
                <PokemonTitle text="Pokédex AI" />
            </View>
            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator
                        size="large"
                        color="#FFDE00"
                    />
                    <Text className="text-white text-lg mt-4">
                        Analyzing Pokémon...
                    </Text>
                </View>
            ) : pokemonData && pokemonImage ? (
                <PokemonInfo
                    data={pokemonData}
                    image={pokemonImage}
                />
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-lg">
                        Scan a Pokémon to see its data!
                    </Text>
                </View>
            )}
            <TouchableOpacity
                onPress={openCamera}
                className="m-6 bg-yellow-400 rounded-full px-6 py-3 flex flex-row items-center justify-center"
                activeOpacity={0.7}
                disabled={isLoading}
            >
                <Ionicons
                    name="camera"
                    size={24}
                    color="white"
                />
                <Text className="text-white font-bold text-lg ml-2">
                    {pokemonData ? 'Scan Again' : 'Scan Pokémon'}
                </Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}

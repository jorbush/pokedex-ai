import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PokemonTitle from './components/PokemonTitle';
import PokemonInfo from './components/PokemonInfo';
import usePokemonScanner from './hooks/usePokemonScanner';

export default function App() {
    const { pokemonData, pokemonImage, isLoading, openCamera } =
        usePokemonScanner();

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

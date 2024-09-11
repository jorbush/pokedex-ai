import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
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

const PokemonTitle = ({ text }: { text: string }) => (
  <Text className="text-4xl font-bold text-yellow-300 tracking-widest" style={{
    textShadowColor: '#2a75bb',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  }}>
    {text}
  </Text>
);

export default function App() {
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
    try {
      const response = await fetch(`http://${LOCAL_IP}:3000/pokedex`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });
      const { data } = await response.json();
      const pokedexEntry: PokemonData = data.data;
      const pokedexImage = data.image;
      console.log('Server response:', pokedexEntry.N);
      Alert.alert('Pokemon:', pokedexEntry.N);
    } catch (error) {
      console.error('Error sending image:', error);
      console.log('LocalIP:', LOCAL_IP);
      Alert.alert('Error', 'Failed to send the image to the server');
    }
  };

  return (
    <View className="flex flex-col h-screen justify-center items-center bg-red-600">
      <PokemonTitle text="Pokédex AI" />
      <TouchableOpacity
        onPress={openCamera}
        className="mt-8 bg-yellow-300 rounded-full px-6 py-3 flex flex-row items-center"
        activeOpacity={0.7}
      >
        <Ionicons name="camera" size={24} color="white" />
        <Text className="text-white font-bold text-lg ml-2">Scan Pokemon</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

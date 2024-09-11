import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Text, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LOCAL_IP } from '@env';

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
            console.log('Server response:', data.data.N);
            Alert.alert('Pokemon:', data.data.N);
        } catch (error) {
            console.error('Error sending image:', error);
            console.log('LocalIP:', LOCAL_IP);
            Alert.alert('Error', 'Failed to send the image to the server');
        }
    };

    return (
        <View className="flex flex-col h-screen justify-center items-center bg-red-600">
            <Text className="text-xl text-white">Pokedex AI</Text>
            <Button
                title="Scan Pokemon"
                onPress={openCamera}
            />
            <StatusBar style="auto" />
        </View>
    );
}

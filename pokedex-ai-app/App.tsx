import { StatusBar } from 'expo-status-bar';
import { Button, Text, View } from 'react-native';

export default function App() {
    return (
        <View className="flex flex-col h-screen justify-center items-center bg-red-600">
            <Text className='text-xl text-white'>Pokedex AI</Text>
            <Button
              title="Scan Pokemon"
              onPress={() => {
                console.log('Scanning Pokemon');
              }} />
            <StatusBar style="auto" />
        </View>
    );
}

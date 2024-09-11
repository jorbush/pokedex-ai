import React from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { PokemonData } from '../types/pokemon';

interface PokemonInfoProps {
    data: PokemonData;
    image: string;
}

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const PokemonInfo: React.FC<PokemonInfoProps> = ({ data, image }) => {
    return (
        <StyledScrollView className="flex-1 w-full px-4">
            <StyledView className="items-center my-4">
                <StyledImage
                    source={{ uri: `data:image/png;base64,${image}` }}
                    className="w-64 h-64 resizeMode-contain"
                    onError={(error) =>
                        console.error(
                            'Image loading error:',
                            error.nativeEvent.error
                        )
                    }
                />
            </StyledView>
            <StyledText className="text-2xl font-bold text-white mb-2">
                {data.N}
            </StyledText>
            <StyledText className="text-white">
                Type: {data.T.map((t) => t.n).join(', ')}
            </StyledText>
            <StyledText className="text-white">
                Height: {data.H / 10}m
            </StyledText>
            <StyledText className="text-white">
                Weight: {data.W / 10}kg
            </StyledText>
            <StyledText className="text-white">
                Abilities: {data.Ab.map((a) => a.n).join(', ')}
            </StyledText>
            <StyledText className="text-white font-bold mt-2">
                Base Stats:
            </StyledText>
            {data.St.map((stat, index) => (
                <StyledText
                    key={index}
                    className="text-white"
                >
                    {stat.n}: {stat.bs}
                </StyledText>
            ))}
        </StyledScrollView>
    );
};

export default PokemonInfo;

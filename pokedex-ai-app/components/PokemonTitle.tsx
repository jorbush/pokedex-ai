import React from 'react';
import { Text } from 'react-native';
import { styled } from 'nativewind';

interface PokemonTitleProps {
    text: string;
}

const StyledText = styled(Text);

const PokemonTitle: React.FC<PokemonTitleProps> = ({ text }) => (
    <StyledText
        className="text-4xl font-bold text-yellow-300 tracking-widest"
        style={{
            textShadowColor: '#2a75bb',
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10,
        }}
    >
        {text}
    </StyledText>
);

export default PokemonTitle;

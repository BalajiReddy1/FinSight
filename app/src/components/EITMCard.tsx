import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { EITMCardData } from '../data/mockData';

interface EITMCardProps {
    card: EITMCardData;
}

export const EITMCard: React.FC<EITMCardProps> = ({ card }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setExpanded(!expanded)}
            className="flex-1 rounded-2xl p-4 bg-ai-bg border border-brand-primary/30 relative overflow-hidden"
            accessible
            accessibilityLabel={`AI-generated insight: ${card.headline}`}
            accessibilityRole="button"
            accessibilityHint={expanded ? 'Tap to collapse' : 'Tap to expand and read more'}
        >
            {/* AI Badge */}
            <View className="absolute top-2 right-2 bg-brand-primary rounded-lg px-2 py-1 z-10">
                <Text className="text-white text-[10px] font-semibold">✨ AI</Text>
            </View>

            {/* Header */}
            <View className="flex-row items-center mb-2">
                <Text className="text-lg mr-2">🤖</Text>
                <Text className="text-sm font-medium text-text-secondary">
                    Explain It To Me
                </Text>
            </View>

            {/* Headline */}
            <Text className="text-xl font-semibold text-text-primary mb-3 pr-12">
                {card.headline}
            </Text>

            {!expanded ? (
                <Text className="text-sm text-brand-primary font-medium">
                    Tap to learn more →
                </Text>
            ) : (
                <View>
                    {/* Explanation */}
                    <Text className="text-base leading-7 text-text-secondary mb-4">
                        {card.explanation}
                    </Text>

                    {/* Impact Box */}
                    <View className="bg-profit-bg border-l-4 border-profit rounded-lg p-3 mb-4">
                        <Text className="text-sm font-medium text-text-secondary mb-1">
                            💡 What this means for you:
                        </Text>
                        <Text className="text-base font-semibold text-text-primary">
                            {card.personalImpact.holding}: {card.personalImpact.change}
                        </Text>
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity className="bg-brand-primary rounded-lg px-4 py-2 flex-1 items-center">
                            <Text className="text-white font-semibold text-sm">Learn More</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-surface-tertiary rounded-lg px-4 py-2 flex-1 items-center"
                            onPress={() => setExpanded(false)}
                        >
                            <Text className="text-text-secondary font-semibold text-sm">Got It</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Privacy Footer */}
                    <Text className="text-xs text-text-tertiary mt-3 text-center">
                        🔒 Your data stays private. We masked account details before analysis.
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

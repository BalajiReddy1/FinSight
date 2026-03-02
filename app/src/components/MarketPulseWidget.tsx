import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Polyline } from 'react-native-svg';
import { MarketIndex } from '../data/mockData';

interface MarketPulseWidgetProps {
    indices: MarketIndex[];
    insight: string;
}

const Sparkline: React.FC<{ data: number[]; positive: boolean }> = ({
    data,
    positive,
}) => {
    if (data.length === 0) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 60;
    const height = 24;
    const padding = 2;

    const points = data
        .map((val, i) => {
            const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((val - min) / range) * (height - 2 * padding);
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <Svg width={width} height={height}>
            <Polyline
                points={points}
                fill="none"
                stroke={positive ? '#10B981' : '#EF4444'}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

const IndexRow: React.FC<{ index: MarketIndex }> = ({ index }) => {
    const isPositive = index.change >= 0;

    return (
        <View className="flex-row items-center justify-between py-2">
            <Text className="text-sm font-medium text-text-primary w-28" numberOfLines={1}>
                {index.name}
            </Text>

            <Text
                className="text-base font-bold text-text-primary w-20 text-right"
                style={{ fontVariant: ['tabular-nums'] }}
            >
                {index.value.toLocaleString('en-IN')}
            </Text>

            <View className="flex-row items-center w-24 justify-end">
                <Text className={`text-sm font-semibold mr-2 ${isPositive ? 'text-profit' : 'text-loss'}`}>
                    {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}
                    {index.change.toFixed(2)}%
                </Text>
            </View>

            <View className="ml-2">
                <Sparkline data={index.sparkline} positive={isPositive} />
            </View>
        </View>
    );
};

export const MarketPulseWidget: React.FC<MarketPulseWidgetProps> = ({
    indices,
    insight,
}) => {
    return (
        <View
            className="bg-white border border-border rounded-xl p-4 mx-4"
            accessible
            accessibilityLabel="Market Pulse Widget"
        >
            <View className="flex-row items-center mb-3">
                <Text className="text-lg mr-2">📈</Text>
                <Text className="text-lg font-semibold text-text-primary">Market Pulse</Text>
            </View>

            {indices.map((index) => (
                <IndexRow key={index.name} index={index} />
            ))}

            {insight ? (
                <View className="mt-3 pt-3 border-t border-border">
                    <Text className="text-sm text-text-secondary">{insight} →</Text>
                </View>
            ) : null}
        </View>
    );
};

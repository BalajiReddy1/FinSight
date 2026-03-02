import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Svg, Polyline } from 'react-native-svg';
import { CategorySpending } from '../data/mockData';

interface FinancialVitalsProps {
    totalSpent: number;
    categories: CategorySpending[];
    weeklyTrend: number[];
    comparison: { type: 'increase' | 'decrease'; percentage: number };
}

const SpendingTrendChart: React.FC<{ data: number[] }> = ({ data }) => {
    if (data.length === 0) return null;
    const min = Math.min(...data) * 0.8;
    const max = Math.max(...data) * 1.1;
    const range = max - min || 1;
    const width = 300;
    const height = 60;
    const padding = 4;

    const points = data
        .map((val, i) => {
            const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((val - min) / range) * (height - 2 * padding);
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            <Polyline
                points={points}
                fill="none"
                stroke="#6366F1"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

const CategoryBar: React.FC<{
    category: CategorySpending;
    maxAmount: number;
}> = ({ category, maxAmount }) => {
    const percentage = (category.amount / maxAmount) * 100;

    return (
        <TouchableOpacity className="flex-row items-center py-2" activeOpacity={0.7}>
            <Text className="text-base mr-2">{category.icon}</Text>
            <View className="flex-1">
                <View className="flex-row justify-between mb-1">
                    <Text className="text-sm font-medium text-text-primary">
                        {category.name}
                    </Text>
                    <Text
                        className="text-sm font-bold text-text-primary"
                        style={{ fontVariant: ['tabular-nums'] }}
                    >
                        ₹{category.amount.toLocaleString('en-IN')}
                    </Text>
                </View>
                <View className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
                    <View
                        className="h-full rounded-full bg-brand-primary"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </View>
            </View>
            <Text className="text-xs text-text-tertiary ml-2 w-10 text-right">
                {category.percentage}%
            </Text>
        </TouchableOpacity>
    );
};

export const FinancialVitals: React.FC<FinancialVitalsProps> = ({
    totalSpent,
    categories,
    weeklyTrend,
    comparison,
}) => {
    const maxAmount = Math.max(...categories.map((c) => c.amount));
    const isIncrease = comparison.type === 'increase';

    return (
        <View className="bg-white border border-border rounded-xl p-4 mx-4">
            {/* Header */}
            <View className="flex-row items-center mb-1">
                <Text className="text-lg mr-2">💰</Text>
                <Text className="text-lg font-semibold text-text-primary">This Month</Text>
            </View>

            {/* Total */}
            <Text
                className="text-3xl font-bold text-text-primary mb-1"
                style={{ fontVariant: ['tabular-nums'] }}
            >
                ₹{totalSpent.toLocaleString('en-IN')}
            </Text>
            <Text className="text-sm text-text-secondary mb-3">Total Spent</Text>

            {/* Trend Chart */}
            <View className="mb-3">
                <SpendingTrendChart data={weeklyTrend} />
                <Text className="text-xs text-text-tertiary mt-1">Last 7 days spending trend</Text>
            </View>

            {/* Category breakdown */}
            <Text className="text-sm font-semibold text-text-primary mb-2">
                Top Categories
            </Text>
            {categories.slice(0, 3).map((category) => (
                <CategoryBar
                    key={category.name}
                    category={category}
                    maxAmount={maxAmount}
                />
            ))}

            {/* Comparison */}
            <View className="mt-3 pt-3 border-t border-border flex-row items-center">
                <Text
                    className={`text-sm font-semibold ${isIncrease ? 'text-alert-amber' : 'text-profit'}`}
                >
                    {isIncrease ? '↑' : '↓'} {comparison.percentage}% {isIncrease ? 'higher' : 'lower'}{' '}
                    than last month {isIncrease ? '⚠️' : '🎉'}
                </Text>
            </View>
        </View>
    );
};

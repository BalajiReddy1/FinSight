import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setEITMCards, fetchMarketPulse } from '../store/slices/feedSlice';
// import { setTransactions } from '../store/slices/transactionsSlice'; // Removed mock setter
import { fetchTransactions } from '../store/slices/transactionsSlice';
import { fetchBudgets } from '../store/slices/budgetsSlice';
import { generateInsights } from '../utils/insights';
import { MarketPulseWidget } from '../components/MarketPulseWidget';
import { EITMCard } from '../components/EITMCard';
import { FinancialVitals } from '../components/FinancialVitals';
import { TransactionRow } from '../components/TransactionRow';
import {
    MOCK_EITM_CARDS,
    // MOCK_TRANSACTIONS, // Removed
    MOCK_CATEGORY_SPENDING,
    MOCK_WEEKLY_TREND,
} from '../data/mockData';
import { format } from 'date-fns';

// Helper for icons
const getCategoryIcon = (category: string) => {
    const map: Record<string, string> = {
        dining: '🍽️', shopping: '🛍️', transport: '🚗', groceries: '🛒',
        utilities: '⚡', entertainment: '🎬', investments: '📈', health: '💊',
        education: '📚', housing: '🏠'
    };
    return map[category.toLowerCase()] || '💸';
};

export const FeedScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const marketPulse = useAppSelector((state) => state.feed.marketPulse);
    const eitmCards = useAppSelector((state) => state.feed.eitmCards);
    const transactions = useAppSelector((state) => state.transactions.items);
    const budgets = useAppSelector((state) => state.budgets.items);
    const transactionsError = useAppSelector((state) => state.transactions.error);
    const budgetsError = useAppSelector((state) => state.budgets.error);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        if (transactionsError) Alert.alert('Transaction Sync Error', transactionsError);
        if (budgetsError) Alert.alert('Budget Sync Error', budgetsError);
    }, [transactionsError, budgetsError]);

    useEffect(() => {
        // Kick off real market data fetch (falls back to mocks on failure).
        dispatch(fetchMarketPulse());

        // Use default EITM cards initially, then replace with dynamic ones
        if (transactions.length === 0) {
            dispatch(setEITMCards(MOCK_EITM_CARDS));
        }

        // Load real transactions and budgets
        dispatch(fetchTransactions());
        dispatch(fetchBudgets());
    }, [dispatch]);

    useEffect(() => {
        if (transactions.length > 0) {
            const cards = generateInsights(transactions, budgets);
            dispatch(setEITMCards(cards));
        }
    }, [transactions, budgets, dispatch]);

    // We need to adhere to Hook rules.


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Refresh transactions
        dispatch(fetchTransactions()).then(() => setRefreshing(false));
    }, [dispatch]);

    const today = new Date();
    const greeting =
        today.getHours() < 12
            ? 'Good Morning'
            : today.getHours() < 17
                ? 'Good Afternoon'
                : 'Good Evening';

    const displayName = user?.displayName?.split(' ')[0] || 'User';

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    // Calculate total spent dynamically
    const totalSpent = React.useMemo(() => transactions.reduce(
        (acc, t) => (t.type === 'debit' ? acc + t.amount : acc),
        0
    ), [transactions]);

    // Calculate Category Spending
    const categorySpending = React.useMemo(() => {
        const totals: Record<string, number> = {};
        transactions.forEach(t => {
            if (t.type === 'debit') {
                const cat = t.category;
                totals[cat] = (totals[cat] || 0) + t.amount;
            }
        });

        const total = Object.values(totals).reduce((a, b) => a + b, 0);
        return Object.entries(totals)
            .map(([name, amount]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                amount,
                percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
                icon: getCategoryIcon(name),
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions]);

    // Calculate Weekly Trend (Last 7 Days)
    const weeklyTrend = React.useMemo(() => {
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return days.map(date => {
            return transactions
                .filter(t => t.type === 'debit' && t.date.startsWith(date))
                .reduce((acc, t) => acc + t.amount, 0);
        });
    }, [transactions]);

    return (
        <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top', 'left', 'right']}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#6366F1"
                        colors={['#6366F1']}
                    />
                }
            >
                {/* Greeting Header */}
                <View className="px-4 pt-4 pb-2">
                    <Text className="text-2xl font-bold text-text-primary">
                        {greeting}, {displayName} 👋
                    </Text>
                    <Text className="text-sm text-text-secondary">
                        {format(today, 'EEEE, MMMM d')}
                    </Text>
                </View>

                {/* Market Pulse */}
                <View className="mt-3">
                    <MarketPulseWidget
                        indices={marketPulse}
                        insight="Markets up on IT sector gains"
                    />
                </View>

                {/* EITM Cards Carousel */}
                {eitmCards.length > 0 && (
                    <View className="mt-5">
                        <View className="px-4 mb-2 flex-row items-center">
                            <Text className="text-[10px] font-bold tracking-widest text-brand-primary uppercase">
                                🤖 AI Insights & Alerts
                            </Text>
                        </View>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                            decelerationRate="fast"
                            snapToInterval={316} // 300 width + 16 gap
                        >
                            {eitmCards.map((card, idx) => (
                                <View key={card.id || idx} style={{ width: 300, marginRight: 16 }}>
                                    <EITMCard card={card} />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Financial Vitals */}
                <View className="mt-4">
                    <FinancialVitals
                        totalSpent={totalSpent}
                        categories={categorySpending}
                        weeklyTrend={weeklyTrend}
                        comparison={{ type: 'increase', percentage: 0 }} // Diff hard to calc without history
                    />
                </View>



                {/* Recent Transactions */}
                <View className="mt-4 mx-4 bg-white border border-border rounded-xl overflow-hidden mb-6">
                    <View className="px-4 py-3 border-b border-border">
                        <Text className="text-lg font-semibold text-text-primary">
                            Recent Transactions
                        </Text>
                    </View>
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map((txn) => (
                            <TransactionRow
                                key={txn.id}
                                category={txn.category}
                                merchant={txn.merchant}
                                amount={txn.amount}
                                type={txn.type}
                                date={txn.date}
                                source={txn.source as 'auto' | 'manual'}
                            />
                        ))
                    ) : (
                        <View className="p-4 items-center">
                            <Text className="text-text-secondary">No recent transactions</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 bg-indigo-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
                onPress={() => navigation.navigate('AddTransaction' as never)}
                activeOpacity={0.8}
            >
                <Plus color="white" size={24} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

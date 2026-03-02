import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';
import transactionsReducer from './slices/transactionsSlice';
import budgetsReducer from './slices/budgetsSlice';
import learningReducer from './slices/learningSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        feed: feedReducer,
        transactions: transactionsReducer,
        budgets: budgetsReducer,
        learning: learningReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

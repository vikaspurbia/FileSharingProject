import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { watchUserActions } from './saga';
import userReducer from './createSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default is localStorage
import { combineReducers } from 'redux';

// Create a saga middleware instance
const sagaMiddleware = createSagaMiddleware();

// Persist configuration
const persistConfig = {
  key: 'root', // Key for storing data in storage
  storage, // Use localStorage to persist data
};

// Combine reducers
const rootReducer = combineReducers({
  formData: userReducer, // Replace `formData` with your actual reducer key if needed
});

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk if using saga
      serializableCheck: false, // Ignore serializable warnings for Redux Persist
    }).concat(sagaMiddleware),
});

// Run the saga middleware
sagaMiddleware.run(watchUserActions);

// Create the persistor for persisting store
export const persistor = persistStore(store);

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

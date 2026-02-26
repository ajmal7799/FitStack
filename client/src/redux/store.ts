
import { configureStore } from '@reduxjs/toolkit';
import userAuthDataSlice from './slice/userSlice/authDataSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import notificationReducer from './slice/notificationSlice';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authData'],
};

const rootReducer = combineReducers({
  authData: userAuthDataSlice,  
  notifications: notificationReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import cardInfoReducer from "./selectedCardSlice";

import jobScheduleReducer from "./jobSchedule";


const rootReducer = combineReducers({

  jobSchedule: jobScheduleReducer,
  selectedCard: cardInfoReducer,

});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['searchPendingActivity'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware :any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },    
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { rootReducer } from './reducers'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: []
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configureAppStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
        })
    })
    const persistor = persistStore(store)
    return { store, persistor }
}

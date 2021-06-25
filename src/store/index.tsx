import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./appSlice";
import dataReducer from "./dataSlice";

const reducers = combineReducers({
  app: appReducer,
  data: dataReducer
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["data", "router"]
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

let persistor = persistStore(store);

export { store, persistor };

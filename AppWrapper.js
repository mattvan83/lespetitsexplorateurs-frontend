import App from "./App";
import user from "./reducers/user";
import activities from "./reducers/activities";
import organizers from "./reducers/organizers";

import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// redux-persist imports
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const reducers = combineReducers({ user, activities, organizers });
const persistConfig = {
  key: "lespetitsexplorateurs",
  storage: AsyncStorage,
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}

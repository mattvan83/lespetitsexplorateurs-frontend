import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SignupScreen from "./screens/SignupScreen";
import SigninScreen from "./screens/SigninScreen";
import FiltersScreen from "./screens/FiltersScreen";
import ListResultsScreen from "./screens/ListResultsScreen";
import MapResultsScreenTest from "./screens/MapResultsScreenTest";
import ActivitySheetScreen from "./screens/ActivitySheetScreen";
import OrganizerProfileScreen from "./screens/OrganizerProfileScreen";
import ActivityPart1Screen from "./screens/ActivityPart1Screen";
import ActivityPart2Screen from "./screens/ActivityPart2Screen";
import ActivityPart3Screen from "./screens/ActivityPart3Screen";
import ActivityPart4Screen from "./screens/ActivityPart4Screen";
import ActivityPart5Screen from "./screens/ActivityPart5Screen";
import ActivityPart6Screen from "./screens/ActivityPart6Screen";
import MessagingDiscussionScreen from "./screens/MessagingDiscussionScreen";
import HomeScreen from "./screens/HomeScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import ActivitiesScreen from "./screens/ActivitiesScreen";
import MessagingScreen from "./screens/MessagingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import NewOrganizerScreen from "./screens/NewOrganizerScreen";

// import { Provider } from "react-redux";
// import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

// import user from "./reducers/user";
// import activities from "./reducers/activities";
// import organizers from "./reducers/organizers";

// // redux-persist imports
// import { persistStore, persistReducer } from "redux-persist";
// import { PersistGate } from "redux-persist/integration/react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSelector } from "react-redux";

// const store = configureStore({
//   reducer: { user, activities, organizers },
// });

// const reducers = combineReducers({ user, activities, organizers });
// const persistConfig = {
//   key: "lespetitsexplorateurs",
//   storage: AsyncStorage,
// };

// const store = configureStore({
//   reducer: persistReducer(persistConfig, reducers),
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });

// const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Explorer") {
            iconName = "search";
          } else if (route.name === "Favoris") {
            iconName = "heart-o";
          } else if (route.name == "Activités") {
            iconName = "calendar-o";
          } else if (route.name === "Messages") {
            iconName = "wechat";
          } else if (route.name === "Profil") {
            iconName = "user-o";
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#5669ff",
        tabBarInactiveTintColor: "#888693",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Explorer" component={HomeScreen} />
      <Tab.Screen name="Favoris" component={FavoriteScreen} />
      <Tab.Screen name="Activités" component={ActivitiesScreen} />
      <Tab.Screen name="Messages" component={MessagingScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  const userReducer = useSelector((state) => state.user.value);

  return (
    // <Provider store={store}>
    //   <PersistGate persistor={persistor}>
    <AutocompleteDropdownContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!userReducer.token ? (
            <Stack.Screen name="Signup" component={SignupScreen} />
          ) : (
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          )}
          <Stack.Screen name="Signin" component={SigninScreen} />
          <Stack.Screen name="Filters" component={FiltersScreen} />
          <Stack.Screen name="ListResults" component={ListResultsScreen} />
          <Stack.Screen name="MapResults" component={MapResultsScreenTest} />
          <Stack.Screen name="NewOrganizer" component={NewOrganizerScreen} />
          <Stack.Screen name="ActivitySheet" component={ActivitySheetScreen} />
          <Stack.Screen
            name="OrganizerProfile"
            component={OrganizerProfileScreen}
          />

          <Stack.Screen name="ActivityPart1" component={ActivityPart1Screen} />
          <Stack.Screen name="ActivityPart2" component={ActivityPart2Screen} />
          <Stack.Screen name="ActivityPart3" component={ActivityPart3Screen} />
          <Stack.Screen name="ActivityPart4" component={ActivityPart4Screen} />
          <Stack.Screen name="ActivityPart5" component={ActivityPart5Screen} />
          <Stack.Screen name="ActivityPart6" component={ActivityPart6Screen} />
          <Stack.Screen
            name="MessagingDiscussion"
            component={MessagingDiscussionScreen}
          />
          {/* <Stack.Screen name="TabNavigator" component={TabNavigator} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </AutocompleteDropdownContextProvider>
    //   </PersistGate>
    // </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

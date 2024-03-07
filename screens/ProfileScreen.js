import {
  StyleSheet,
  Text,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import globalStyles from "../globalStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  setPreferences,
  resetPreferences,
  setLocationFilters,
} from "../reducers/user";
import { useState } from "react";
import { logout } from "../reducers/user";
import Slider from "@react-native-community/slider";
import InputLocalisation from "../components/InputLocalisation";
import FilterTextCategory from "../components/FilterTextCategory";
import { handleFilterButtonClick } from "../modules/handleFilterButtonClick";

BACKEND_ADDRESS = "http://192.168.1.111:3000";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [scope, setScope] = useState(user.preferences.scopePreference);
  const [selectedAges, setSelectedAges] = useState(
    user.preferences.agePreference
  );
  const [selectedCity, setSelectedCity] = useState(
    user.preferences.cityPreference
  );
  const [selectedLongitude, setSelectedLongitude] = useState(
    user.preferences.latitudePreference
  );
  const [selectedLatitude, setSelectedLatitude] = useState(
    user.preferences.longitudePreference
  );

  const handleLogOut = () => {
    dispatch(resetPreferences());
    dispatch(logout());
    navigation.navigate("Signin");
  };

  const ageCategory = [
    "3_12months",
    "1_3years",
    "3_6years",
    "6_10years",
    "10+years",
  ];

  const handleAgeList = (category) => {
    handleFilterButtonClick(category, selectedAges, setSelectedAges);
  };

  const ageList = ageCategory.map((category, i) => {
    const isActive = selectedAges.includes(category);
    return (
      <FilterTextCategory
        key={i}
        category={category}
        handleCategoryList={handleAgeList}
        isActive={isActive}
      />
    );
  });

  const handleSetPreferences = () => {
    console.log(selectedCity);
    console.log(selectedLongitude);
    console.log(selectedLatitude);
    fetch(`${BACKEND_ADDRESS}/users/updatePreferences`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        concernedAges: selectedAges,
        radius: scope,
        city: selectedCity,
        longitude: selectedLongitude,
        latitude: selectedLatitude,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.result &&
          dispatch(
            setPreferences({
              agePreference: selectedAges,
              cityPreference: selectedCity,
              latitudePreference: selectedLatitude,
              longitudePreference: selectedLongitude,
              scopePreference: scope,
            })
          );
        data.result &&
          dispatch(
            setLocationFilters({
              cityFilter: selectedCity,
              latitudeFilter: selectedLatitude,
              longitudeFilter: selectedLongitude,
            })
          );
        navigation.navigate("TabNavigator", { screen: "Explorer" });
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.filtersContainer}>
        <Text style={globalStyles.title2}>Mon profil</Text>
        <TouchableOpacity onPress={() => handleLogOut()} activeOpacity={0.8}>
          <Text style={styles.deconnexion}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={globalStyles.title4}>Nom d'utilisateur</Text>
        <Text style={styles.text}>{user.username}</Text>

        <Text style={globalStyles.title4}>Image de profil</Text>
        <Image
          style={styles.profileImg}
          source={require("../assets/Images/avatar.jpg")}
        />

        <Text style={globalStyles.title4}>Âges des enfants</Text>
        <ScrollView horizontal={true} style={styles.filters}>
          {ageList}
        </ScrollView>

        <Text style={globalStyles.title4}>Localisation</Text>
        <InputLocalisation
          setSelectedCity={setSelectedCity}
          selectedCity={selectedCity}
          setSelectedLongitude={setSelectedLongitude}
          setSelectedLatitude={setSelectedLatitude}
        />

        <Text style={globalStyles.title4}>Dans un rayon de {scope}km</Text>
        <Slider
          style={styles.slider}
          lowerLimit={1}
          minimumValue={1}
          maximumValue={50}
          upperLimit={50}
          value={scope}
          minimumTrackTintColor="#5669FF"
          maximumTrackTintColor="#E7E7E9"
          step={1}
          onValueChange={(value) => setScope(value)}
        />
        <View style={styles.sliderBottom}>
          <Text style={styles.textSlider}>1km</Text>
          <Text style={styles.textSlider}>50km</Text>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => handleSetPreferences()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  filtersContainer: {
    flex: 0.9,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginTop: 10,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "#EBEDFF",
  },
  deconnexion: {
    position: "absolute",
    right: 20,
    color: "#5669FF",
  },
  filters: {
    marginLeft: 20,
  },
  slider: {
    width: "90%",
    height: 40,
    alignSelf: "center",
  },
  sliderBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  textSlider: {
    fontSize: 14,
    color: "#8A8AA3",
  },
  text: {
    fontSize: 16,
    color: "#120D26",
    marginTop: 12,
    marginLeft: 20,
  },
  bottom: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flex: 0.1,
  },
  button: {
    padding: 10,
    width: "70%",
    height: 58,
    backgroundColor: "#5669FF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
});

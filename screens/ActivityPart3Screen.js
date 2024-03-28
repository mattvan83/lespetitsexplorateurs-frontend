import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import globalStyles from "../globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { addActivityInfoScreen3 } from "../reducers/activities";
import { useState, useEffect } from "react";
import Button from '../components/Button';
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.activities.value);
  const [activityAddress, setActivityAddress] = useState(activities.address);
  const [activityPostalCode, setActivityPostalCode] = useState(
    activities.postalCode
  );
  const [activityCity, setActivityCity] = useState(activities.city);
  const [activityPlace, setActivityPlace] = useState(activities.locationName);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorPostalCode, setErrorPostalCode] = useState(false);

  const handleContinue = () => {
    if (
      !activityAddress ||
      activityAddress === "" ||
      !activityPostalCode ||
      activityPostalCode === "" ||
      !activityCity ||
      activityCity === ""
    ) {
      setShowError(true);
    } else {
      if (!longitude || !latitude) {
        setErrorPostalCode(true);
      } else {
        // console.log(longitude)
        // console.log(latitude)
        dispatch(
          addActivityInfoScreen3({
            address: activityAddress,
            postalCode: activityPostalCode,
            city: activityCity,
            locationName: activityPlace,
            longitude: longitude,
            latitude: latitude,
          })
        );
        navigation.navigate("ActivityPart4");
      }
    }
  };

  useEffect(() => {
    const searchAddress = activityCity + activityPostalCode;
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${searchAddress}`)
      .then((response) => response.json())
      .then((apiData) => {
        if (apiData && apiData.features && apiData.features.length > 0) {
          setLongitude(apiData.features[0].geometry.coordinates[0]);
          setLatitude(apiData.features[0].geometry.coordinates[1]);
        } else {
          fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${activityPostalCode}`
          )
            .then((response) => response.json())
            .then((apiData) => {
              if (apiData && apiData.features && apiData.features.length > 0) {
                setLongitude(apiData.features[0].geometry.coordinates[0]);
                setLatitude(apiData.features[0].geometry.coordinates[1]);
              }
            });
        }
      });
  }, [activityCity, activityPostalCode]);

  const handleBackgroundPress = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={1}
      onPress={handleBackgroundPress}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.filtersContainer}>
          <FontAwesome
            name={"arrow-left"}
            color={"black"}
            size={20}
            style={styles.arrow}
            onPress={() => navigation.goBack()}
          />

          <Text style={styles.title2}>Comment trouver l'activité ?</Text>

          {showError && (
            <Text style={styles.error}>
              Les champs "Adresse", "Code postal" et "Ville" sont requis.
            </Text>
          )}
          <Text style={globalStyles.title4}>Adresse</Text>
          <View style={globalStyles.border} marginLeft={20}>
            <TextInput
              placeholder="Adresse précise"
              autoCapitalize="sentences"
              keyboardType="default"
              onChangeText={(value) => setActivityAddress(value)}
              value={activityAddress}
              style={globalStyles.input}
            />
          </View>

          {errorPostalCode && (
            <View>
              <Text style={styles.error}>Code postal non reconnu</Text>
            </View>
          )}
          <Text style={globalStyles.title4}>Code postal</Text>
          <View style={globalStyles.border} marginLeft={20} width={150}>
            <TextInput
              placeholder="Code postal"
              maxLength={5}
              autoCapitalize="sentences"
              keyboardType="number-pad"
              onChangeText={(value) => setActivityPostalCode(value)}
              value={activityPostalCode}
              style={globalStyles.input}
            />
          </View>
          <Text style={globalStyles.title4}>Ville</Text>
          <View style={globalStyles.border} marginLeft={20}>
            <TextInput
              placeholder="Ville"
              autoCapitalize="sentences"
              keyboardType="default"
              onChangeText={(value) => setActivityCity(value)}
              value={activityCity}
              style={globalStyles.input}
            />
          </View>

          <Text style={globalStyles.title4}>Nom du lieu</Text>
          <View style={globalStyles.border} marginLeft={20}>
            <TextInput
              placeholder="ex : Gymnase, Ludothèque, Bibliothèque..."
              autoCapitalize="sentences"
              keyboardType="default"
              onChangeText={(value) => setActivityPlace(value)}
              value={activityPlace}
              style={globalStyles.input}
            />
          </View>
        </View>

        <Button onPress={handleContinue} text="Continuer" />

      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  arrow: {
    marginTop: 50,
    marginLeft: 20,
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#120D26",
    marginTop: 45,
    marginLeft: 20,
  },
  filtersContainer: {
    flex: 0.9,
  },
  filters: {
    marginLeft: 20,
  },
  error: {
    marginTop: 10,
    marginLeft: 20,
    color: "#EB5757",
    width: "90%",
  },
  // a supprimer plus tard
  filtersButton: {
    width: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#EBEDFF",
    borderRadius: 100,
    padding: 6,
  },
  text: {
    fontSize: 16,
    color: "#120D26",
    marginTop: 12,
    marginLeft: 20,
  },
});

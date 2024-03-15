import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, setPreferences, setPreferencesFilters } from "../reducers/user";
import globalStyles from "../globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;
// console.log(BACKEND_ADDRESS);
export default function SigninScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [authentificationError, setAuthentificationError] = useState(Boolean);
  const [showPassword, setShowPassword] = useState(false);

  const backToFrontAgeMapping = {
    "3_12months": "3-12 mois",
    "1_3years": "1-3 ans",
    "3_6years": "3-6 ans",
    "6_10years": "6-10 ans",
    "10+years": "10+ ans",
  };

  const handleSubmit = () => {
    if (EMAIL_REGEX.test(email)) {
      fetch(`${BACKEND_ADDRESS}/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            // Mapping between frontend and backend age
            const mappedSelectedAges = data.userPreferences.concernedAges.map(
              (age) => backToFrontAgeMapping[age]
            );

            dispatch(login({ token: data.token, username: data.username }));
            dispatch(
              setPreferences({
                agePreference: mappedSelectedAges,
                cityPreference: data.userPreferences.city,
                latitudePreference: data.userPreferences.latitude,
                longitudePreference: data.userPreferences.longitude,
                scopePreference: data.userPreferences.radius,
              })
            );
            dispatch(
              setPreferencesFilters({
                agePreference: mappedSelectedAges,
                cityPreference: data.userPreferences.city,
                latitudePreference: data.userPreferences.latitude,
                longitudePreference: data.userPreferences.longitude,
                scopePreference: data.userPreferences.radius,
              })
            );
            setEmail("");
            setPassword("");
            navigation.navigate("TabNavigator", { screen: "Explorer" });
          } else {
            setAuthentificationError(true);
          }
        });
    } else {
      setEmailError(true);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <Image
        style={styles.img}
        source={{
          uri: "https://res.cloudinary.com/ddoqxafok/image/upload/v1710230637/iufea3u7hgp5l3rzxi7o.jpg",
        }}
      />
      <Text style={styles.title}>Identification</Text>

      <View style={styles.inputContainer}>
        {emailError && (
          <View>
            <Text style={styles.error}>Email invalide</Text>
          </View>
        )}
        {authentificationError && (
          <View>
            <Text style={styles.error}>Email ou mot de passe invalide</Text>
          </View>
        )}
        <View style={globalStyles.border}>
          <Ionicons name="mail-outline" size={24} color="#BBC3FF" />
          <TextInput
            placeholder="jane.doe@gmail.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            onChangeText={(value) => setEmail(value)}
            value={email}
            style={styles.input}
          />
        </View>
        <View style={globalStyles.border}>
          <Ionicons name="lock-closed-outline" size={24} color="#BBC3FF" />
          <TextInput
            placeholder="Mot de passe"
            textContentType="password"
            secureTextEntry={!showPassword}
            onChangeText={(value) => setPassword(value)}
            value={password}
            style={styles.input}
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#BBC3FF"
            style={styles.icon}
            onPress={toggleShowPassword}
          />
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          activeOpacity={0.8}
        >
          <Text style={styles.textBottom}>
            Pas encore de compte ? Inscrivez-vous ici
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: 200,
    // marginTop: 100,
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#29253C",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    padding: 10,
    width: "70%",
    height: 58,
    backgroundColor: "#5669FF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  bottom: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    gap: 20,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
  },
  error: {
    marginTop: 10,
    color: "#EB5757",
    width: "90%",
    alignSelf: "center",
  },
  input: {
    flex: 1,
    height: 56,
    color: "#7887FF",
    fontSize: 14,
    marginLeft: 10,
  },
});

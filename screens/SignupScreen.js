import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Image,
  Switch,
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import globalStyles from "../globalStyles";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import ButtonPlainText from "../components/ButtonPlainText";

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // For the switch button
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const handlePress = () => {
    if (EMAIL_REGEX.test(email)) {
      fetch(`${BACKEND_ADDRESS}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(login({ token: data.token, username }));
            // Whereas user wants to create a organizer profile, navigation differs
            console.log(isEnabled);
            if (isEnabled) {
              navigation.navigate("NewOrganizer");
            } else {
              navigation.navigate("TabNavigator", { screen: "Explorer" });
            }
            setEmail("");
            setPassword("");
            setUsername("");
          }
          console.log(data.error);
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
          uri: "https://res.cloudinary.com/ddoqxafok/image/upload/v1710191558/rnhxlupxbteo1kw5nf0c.jpg",
        }}
      />
      <Text style={styles.title}>Créer un compte</Text>

      <View style={styles.inputContainer}>
        {emailError && (
          <View>
            <Text style={styles.error}>Email invalide</Text>
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
            style={globalStyles.input}
          />
        </View>
        <View style={globalStyles.border}>
          <AntDesign name="smileo" size={24} color="#BBC3FF" />
          <TextInput
            placeholder="Nom d'utilisateur"
            textContentType="username"
            onChangeText={(value) => setUsername(value)}
            value={username}
            style={globalStyles.input}
          />
        </View>
        <View style={globalStyles.border}>
          <Ionicons name="lock-closed-outline" size={24} color="#BBC3FF" />
          <TextInput
            placeholder="Mot de passe"
            textContentType="newPassword"
            secureTextEntry={!showPassword}
            onChangeText={(value) => setPassword(value)}
            value={password}
            style={styles.input}
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={styles.icon}
            onPress={toggleShowPassword}
          />
        </View>

        <View style={styles.switchContainer}>
          <Switch
            style={styles.switchButton}
            trackColor={{ false: "#767577", true: "#FDC400" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#E7E7E9"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <View>
            <Text>Je veux créer un profil organisateur</Text>
            <Text style={styles.subtitles}>
              Vous pourrez en créer un plus tard
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <Button onPress={handlePress} text="Se connecter" />
        <ButtonPlainText onPress={() => navigation.navigate("Signin")} text="Déjà inscrit ? Connectez-vous ici" />
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
    borderRadius: 100,
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
  bottom: {
    position: "absolute",
    bottom: 30,
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
    color: "#747688",
    fontSize: 14,
    marginLeft: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchButton: {
    margin: 10,
  },
  subtitles: {
    fontSize: 12,
    color: "#D0CFD4",
    fontStyle: "italic",
  },
});

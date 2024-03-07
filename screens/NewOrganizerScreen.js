import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import globalStyles from "../globalStyles";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const BACKEND_ADDRESS = "http://192.168.1.22:3000";

export default function NewOrganizerScreen({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [orgFunction, setOrgFunction] = useState("");
  const [about, setAbout] = useState("");
  const [inputError, setInputError] = useState("");

  // const handleSubmit = () => {

  //     fetch(`${BACKEND_ADDRESS}/users/signup`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, username, password }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         data.result && dispatch(login({ token: data.token, username }));
  //         setEmail("");
  //         setPassword("");
  //         setUsername("");
  //         navigation.navigate("TabNavigator", { screen: "Explorer" });
  //       });
  // };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 200 : 0}
    >
      <ScrollView style={styles.scrollview}>
      <Text style={globalStyles.title2}>Profil organisateur</Text>
      <MaterialIcons name={"cancel"} size={36} color="#5669FF" style={styles.iconCancel} onPress={() => navigation.navigate("TabNavigator", { screen: "Explorer" })} />

        <View style={styles.scrollContainer}>
          <View style={styles.img}>
            <Ionicons name="camera" size={64} color="#BBC3FF" />
            <Text style={styles.text}>Ajouter une photo</Text>
          </View>

          {inputError && (
            <View>
              <Text style={styles.error}>Remplissez bien tous les champs !</Text>
            </View>
          )}
          <Text style={globalStyles.title4}>Nom organisateur :</Text>
          <View style={globalStyles.border}>
            <TextInput
              placeholder="Nom de l'association ou de l'organisateur"
              autoCapitalize="none"
              keyboardType="default"
              onChangeText={(value) => setName(value)}
              value={name}
              style={globalStyles.input}
            />
          </View>
          <Text style={globalStyles.title4}>Titre du profil :</Text>
          <View style={globalStyles.border}>
            <TextInput
              placeholder="Ex: Une association de parents pour les parents"
              onChangeText={(value) => setOrgFunction(value)}
              value={orgFunction}
              style={globalStyles.input}
            />
          </View>
          <Text style={globalStyles.title4}>À propos :</Text>
          <View style={globalStyles.border}>
            <TextInput
              multiline={true}
              placeholder="Ex: Une association de parents pour les parents"
              onChangeText={(value) => setAbout(value)}
              value={about}
              style={globalStyles.inputMultiline}
            />
          </View>
          <Text style={globalStyles.title4}>Adresse :</Text>
          <View style={globalStyles.border}>
            <TextInput
              placeholder="Ex: 1, chemin des petits lutins"
              onChangeText={(value) => setOrgFunction(value)}
              value={orgFunction}
              style={globalStyles.input}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Créer le profil</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: 'center',
  },
  scrollview: {
    width: '100%',
    flex: 0.9,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: '#EEF0FF',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    color: '#9AA5FF',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#29253C",
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
    color: "#747688",
    fontSize: 14,
    marginLeft: 10,
  },
  iconCancel: {
    position: "absolute",
    top: 80,
    right: 20
  },
});

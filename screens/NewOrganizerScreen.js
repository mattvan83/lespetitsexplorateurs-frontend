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
import { useDispatch, useSelector } from "react-redux";
import globalStyles from "../globalStyles";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const BACKEND_ADDRESS = "http://172.20.10.8:3000";

export default function NewOrganizerScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  //A MODIFIER
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  //
  const [inputError, setInputError] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("")
  const [photo, setPhoto] = useState("");
  const [photoType, setPhotoType] = useState('image/jpeg');

  const POSTALCODE_REGEX = /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/;

  const handleSubmit = () => {
    // if (POSTALCODE_REGEX.test(postalCode)) {

      // If one of the input fields is empty
      // if (name === '' || title === '' || about === '' || postalCode === '' || city === '' || address === '') {
      //   setInputError(true);
      //   console.log('error champ vide')
      // } else {

      if (photo != "") {
        const formData = new FormData();

        formData.append('photoFromFront', {
          uri: photo,
          name: 'photo.jpg',
          type: photoType,
        });

        fetch(`${BACKEND_ADDRESS}/users/newOrganizerPhoto/${user.token}`, {
          method: 'POST',
          body: formData,
        }).then((response) => response.json())
          .then((data) => {
            console.log(data)
          });
      }


      fetch(`${BACKEND_ADDRESS}/users/newOrganizer/${user.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          title: title,
          about: about,
          postalCode: postalCode,
          city: city,
          address: address,
          longitude: longitude,
          latitude: latitude,
        }),
      }).then((response) => response.json())
        .then((data) => {
          console.log(data)
          navigation.navigate("TabNavigator", { screen: "Explorer" });
        });
      // }

    // } else {
    //   setPostalCodeError(true);
    // }
  };

  const handleChoosePhoto = async () => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission d\'accès à la galerie refusée');
      }
    })();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setPhotoType(result.assets[0].mimeType);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
    >
      <ScrollView style={styles.scrollview}>
        <Text style={globalStyles.title2}>Création profil organisateur</Text>
        <MaterialIcons name={"cancel"} size={36} color="#5669FF" style={styles.iconCancel} onPress={() => navigation.navigate("TabNavigator", { screen: "Explorer" })} />

        <View style={styles.scrollContainer}>

          <TouchableOpacity onPress={handleChoosePhoto} style={styles.img}>
            {photo && <Image source={{ uri: photo }} style={{ width: 150, height: 150, borderRadius: 100 }} />}
            {!photo && <Ionicons name="camera" size={64} color="#BBC3FF" />}
            {!photo && <Text style={styles.text}>Choisir une photo</Text>}
          </TouchableOpacity>

          <Text style={styles.title4}>Nom organisateur :</Text>
          <View style={styles.border}>
            <TextInput
              placeholder="Nom de l'association ou de l'organisateur"
              autoCapitalize="none"
              keyboardType="default"
              onChangeText={(value) => setName(value)}
              value={name}
              style={styles.input}
            />
          </View>
          <Text style={styles.title4}>Titre du profil :</Text>
          <View style={styles.border}>
            <TextInput
              placeholder="Ex: Une association de parents pour les parents"
              onChangeText={(value) => setTitle(value)}
              value={title}
              style={styles.input}
            />
          </View>
          <Text style={styles.title4}>À propos :</Text>
          <View style={styles.border}>
            <TextInput
              multiline={true}
              placeholder="Dites-nous en plus sur votre histoire !"
              onChangeText={(value) => setAbout(value)}
              value={about}
              style={globalStyles.inputMultiline}
            />
          </View>
          <Text style={styles.title4}>Adresse :</Text>
          <View style={styles.border}>
            <TextInput
              placeholder="Ex: 1, chemin des petits lutins"
              onChangeText={(value) => setAddress(value)}
              value={address}
              style={styles.input}
            />
          </View>
          <Text style={styles.title4}>Ville :</Text>
          <View style={styles.border}>
            <TextInput
              placeholder="Ville"
              onChangeText={(value) => setCity(value)}
              value={city}
              style={styles.input}
            />
          </View>
          <Text style={styles.title4}>Code postal :</Text>
          <View style={styles.border}>
            <TextInput
              placeholder="Code postal"
              onChangeText={(value) => setPostalCode(value)}
              value={postalCode}
              style={styles.input}
            />
          </View>
        </View>

        {inputError && (
          <View>
            <Text style={styles.error}>Remplissez bien tous les champs !</Text>
          </View>
        )}
        {/* {postalCodeError && (
          <View>
            <Text style={styles.error}>Oops, le code postal contient une coquille</Text>
          </View>
        )} */}
        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Créer le profil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  scrollContainer: {
    alignItems: 'center',
    width: '100%'
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
  title4: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#29253C",
    marginTop: 16,
    marginLeft: 10,
    marginBottom: 8,
    textAlign: 'left',
    width: '90%'
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
  border: {
    alignItems: "center",
    paddingLeft: 4,
    paddingRight: 4,
    borderColor: "#E4dfdf",
    borderWidth: 1,
    borderRadius: 12,
    width: "90%",
  },
  bottom: {
    // position: "absolute",
    // bottom: 30,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
  },
  error: {
    marginTop: 20,
    color: "#EB5757",
    width: "90%",
    alignSelf: "center",
    textAlign: 'center',
  },
  input: {
    width: "90%",
    height: 56,
    color: "#747688",
    fontSize: 14,
  },
  iconCancel: {
    position: "absolute",
    top: 80,
    right: 20
  },
});

import { StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
// import globalStyles from '../globalStyles';
import { useDispatch, useSelector } from "react-redux";
import { addUserActivity, addUserActivityPhoto, modifyUserActivity } from "../reducers/user";
import { resetActivityInfos } from "../reducers/activities";
import { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Button from '../components/Button';

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ActivityPart5Screen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const activities = useSelector((state) => state.activities.value);
  const [photo, setPhoto] = useState(activities.imgUrl);
  const [photoType, setPhotoType] = useState("image/jpeg");
  const [photoModification, setPhotoModification] = useState(false);
  const token = user.token;

  const handleChoosePhoto = async () => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission d'accès à la galerie refusée");
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
      setPhotoModification(true);
    }
  };

  const handleCreate = () => {
    fetch(`${BACKEND_ADDRESS}/activities/newActivity/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        name: activities.name,
        description: activities.description,
        category: activities.category,
        concernedAges: activities.concernedAges,
        durationInMilliseconds: activities.durationInMilliseconds,
        address: activities.address,
        postalCode: activities.postalCode,
        longitude: activities.longitude,
        latitude: activities.latitude,
        locationName: activities.locationName,
        city: activities.city,
        date: activities.date,
        price: activities.price,
      }),
    })
      .then((response) => response.json())
      .then((activity) => {
        if (activity.result) {
          dispatch(resetActivityInfos())

          // If a photo has been added, we update the activity in database
          if (photo) {
            console.log(photo)
            const formData = new FormData();
            formData.append("photoFromFront", {
              uri: photo,
              name: "photo.jpg",
              type: photoType,
            });

            fetch(
              `${BACKEND_ADDRESS}/activities/newPhoto/${activity.activity._id}`,
              {
                method: "POST",
                body: formData,
              }
            )
              .then((response) => response.json())
              .then((data) => {
                dispatch(addUserActivity({
                  id: activity.activity._id,
                  name: activity.activity.name,
                  description: activity.activity.description,
                  //durationInMilliseconds: activity.activity.duration,
                  category: activity.activity.category,
                  concernedAges: activity.activity.ages,
                  address: activity.activity.address,
                  postalCode: activity.activity.postalCode,
                  locationName: activity.activity.locationName,
                  latitude: activity.activity.latitude,
                  longitude: activity.activity.longitude,
                  city: activity.activity.city,
                  date: activity.activity.date,
                  price: activity.activity.price,
                  imgUrl: data.url,
                }));
                navigation.navigate("TabNavigator", { screen: "Activité" });
              });
          } else {
            dispatch(addUserActivity({
              id: activity.activity._id,
              name: activity.activity.name,
              description: activity.activity.description,
              //durationInMilliseconds: activity.activity.duration,
              category: activity.activity.category,
              concernedAges: activity.activity.ages,
              address: activity.activity.address,
              postalCode: activity.activity.postalCode,
              locationName: activity.activity.locationName,
              latitude: activity.activity.latitude,
              longitude: activity.activity.longitude,
              city: activity.activity.city,
              date: activity.activity.date,
              price: activity.activity.price,
            }));
            navigation.navigate("TabNavigator", { screen: "Activité" });
          }
        } else {
          console.error("The activity haven't been created", activity.error);
        }
      });
  };

  const handleEdit = () => {
    console.log("handleEdit")
    fetch(`${BACKEND_ADDRESS}/activities/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: user.token,
        name: activities.name,
        description: activities.description,
        category: activities.category,
        concernedAges: activities.concernedAges,
        address: activities.address,
        postalCode: activities.postalCode,
        locationName: activities.locationName,
        city: activities.city,
        date: activities.date,
        id: activities.id,
        price: activities.price,
        longitude: activities.longitude,
        latitude: activities.latitude,
      }),
    })
      .then((response) => response.json())
      .then((activity) => {
        if (activity.result) {
          // If a photo has been modified, we update the activity in database
          if (photo && photoModification) {
            const formData = new FormData();
            formData.append('photoFromFront', {
              uri: photo,
              name: 'photo.jpg',
              type: photoType,
            });

            fetch(`${BACKEND_ADDRESS}/activities/newPhoto/${activities.id}`, {
              method: 'POST',
              body: formData,
            }).then((response) => response.json())
              .then((data) => {
                dispatch(modifyUserActivity({
                  activityId: activities.id,
                  activity: {
                    name: activities.name,
                    description: activities.description,
                    category: activities.category,
                    concernedAges: activities.concernedAges,
                    address: activities.address,
                    postalCode: activities.postalCode,
                    locationName: activities.locationName,
                    city: activities.city,
                    date: activities.date,
                    price: activities.price,
                    longitude: activities.longitude,
                    latitude: activities.latitude,
                    imgUrl: data.url,
                  }
                }
                ));
                navigation.navigate("TabNavigator", { screen: "Activité" });
              });
          } else {
            dispatch(modifyUserActivity({
              activityId: activities.id,
              activity: {
                name: activities.name,
                description: activities.description,
                category: activities.category,
                concernedAges: activities.concernedAges,
                address: activities.address,
                postalCode: activities.postalCode,
                locationName: activities.locationName,
                city: activities.city,
                date: activities.date,
                price: activities.price,
                longitude: activities.longitude,
                latitude: activities.latitude,
              }
            }
            ));
            navigation.navigate("TabNavigator", { screen: "Activité" });
          }
        } else {
          console.error("The activity haven't been created", activity.error);
        }
      });
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.filtersContainer}>
        <FontAwesome
          name={"arrow-left"}
          color={"black"}
          size={20}
          style={styles.arrow}
          onPress={() => navigation.goBack()}
        />

        <Text style={styles.title2}>Une photo vaut 1000 mots !</Text>

        <View style={styles.text}>
          <Text>Mettez en valeur l'activité proposée.</Text>
          <Text>
            Les photos de l'activité proposée permettent aux parents d'avoir une
            idée du cadre proposé aux enfants.
          </Text>
          <Text style={styles.importantText}>
            Veillez à ce que les visages soient floutés !
          </Text>
        </View>

        <TouchableOpacity onPress={handleChoosePhoto} style={styles.img}>
          {photo && (
            <Image
              source={{ uri: photo }}
              style={{ width: 150, height: 150, borderRadius: 15 }}
            />
          )}
          {!photo && <Ionicons name="camera" size={64} color="#BBC3FF" />}
          {!photo && <Text style={styles.textImg}>Choisir une photo</Text>}
        </TouchableOpacity>
      </View>

      {!activities.isCurrentlyUpdated && <Button onPress={handleCreate} text="Créer l'activité" />}
      {activities.isCurrentlyUpdated && <Button onPress={handleEdit} text="Mettre à jour l'activité" />}

    </KeyboardAvoidingView>
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
  textImg: {
    fontSize: 10,
    color: "#9AA5FF",
  },
  img: {
    width: 150,
    height: 150,
    margin: 20,
    backgroundColor: "#EEF0FF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#BBC3FF",
  },
  greyText: {
    color: "grey",
    marginTop: 10,
  },
  importantText: {
    color: "red",
    fontWeight: "bold",
  },
  filtersContainer: {
    flex: 0.9,
  },
  filters: {
    marginLeft: 20,
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
    fontSize: 14,
    color: "#120D26",
    marginTop: 12,
    marginLeft: 20,
    width: 350,
  },
});

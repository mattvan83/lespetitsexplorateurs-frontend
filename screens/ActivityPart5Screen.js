import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
// import globalStyles from '../globalStyles';
import { useDispatch, useSelector } from "react-redux";
import { addUserActivity, addUserActivityPhoto } from "../reducers/user";
import { addActivityInfoScreen5 } from "../reducers/activities";
import { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const activities = useSelector((state) => state.activities.value);
  const [photo, setPhoto] = useState(activities.imgUrl);
  const [photoType, setPhotoType] = useState("image/jpeg");
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
        address: activities.address,
        postalCode: activities.postalCode,
        locationName: activities.locationName,
        city: activities.city,
        date: activities.date,
        // image: activities.image,
      }),
    })
      .then((response) => response.json())
      .then((activity) => {
        if (activity.result) {
          // let activity_temp = activity.activity;

          // If a photo has been added, we update the activity in database
          if (photo) {
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
                // activity_temp.imgUrl = data.url
                // console.log(activity_temp.imgUrl)
                photoAdded = true;
                dispatch(addUserActivity(activity.activity));
                dispatch(
                  addUserActivityPhoto({
                    activityId: activity.activity._id,
                    url: data.url,
                  })
                );
                navigation.navigate("TabNavigator", { screen: "Activité" });
              });
          } else {
            dispatch(addUserActivity(activity.activity));
            navigation.navigate("TabNavigator", { screen: "Activité" });
          }
        } else {
          console.error("The activity haven't been created", activity.error);
        }
      });
  };

  // const handleEdit = () => {
  //   const activityId = activities.id;
  //   console.log(`${BACKEND_ADDRESS}/activities/update/${activityId}`)
  //   fetch(`${BACKEND_ADDRESS}/activities/update/65ef05c640d0908371f25cef`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       token: user.token,
  //       name: activities.name,
  //       description: activities.description,
  //       category: activities.category,
  //       concernedAges: activities.concernedAges,
  //       address: activities.address,
  //       postalCode: activities.postalCode,
  //       locationName: activities.locationName,
  //       city: activities.city,
  //       date: activities.date,
  //       // image: activities.image,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((activity) => {
  //       if (activity.result) {

  //         // let activity_temp = activity.activity;

  //         // If a photo has been added, we update the activity in database
  //         // if (photo) {
  //         //   const formData = new FormData();
  //         //   formData.append('photoFromFront', {
  //         //     uri: photo,
  //         //     name: 'photo.jpg',
  //         //     type: photoType,
  //         //   });

  //         //   fetch(`${BACKEND_ADDRESS}/activities/newPhoto/${activity.activity._id}`, {
  //         //     method: 'POST',
  //         //     body: formData,
  //         //   }).then((response) => response.json())
  //         //     .then((data) => {
  //         //       // activity_temp.imgUrl = data.url
  //         //       // console.log(activity_temp.imgUrl)
  //         //       photoAdded = true;
  //         //       dispatch(addUserActivity(activity.activity))
  //         //       dispatch(addUserActivityPhoto({activityId: activity.activity._id, url: data.url}))
  //         //       navigation.navigate("TabNavigator", { screen: "Activité" });
  //         //     });
  //         // } else {
  //         //   //Modifier le dispatch pour qu'il mette à jour les champs dans le tableau activités du user
  //         //   // dispatch(addUserActivity(activity.activity))
  //         //   navigation.navigate("TabNavigator", { screen: "Activité" });
  //         // }

  //         // A supprimer quand la mise à jour des photos sera OK
  //           navigation.navigate("TabNavigator", { screen: "Activité" });

  //       } else {
  //         console.error("The activity haven't been created", activity.error);
  //       }
  //     });
  // }

  return (
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

      {!activities.isCurrentlyUpdated && (
        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={() => handleCreate()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Créer l'activité</Text>
          </TouchableOpacity>
        </View>
      )}
      {activities.isCurrentlyUpdated && (
        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={() => handleEdit()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Mettre à jour l'activité</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  textButton: {
    color: "#5669FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    color: "#120D26",
    marginTop: 12,
    marginLeft: 20,
    width: 350,
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

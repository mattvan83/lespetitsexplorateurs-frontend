import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { updateLikedActivities } from "../reducers/activities";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ActivitySheetScreen({
  navigation,
  route: {
    params: { activity },
  },
}) {
  const user = useSelector((state) => state.user.value);
  const activities = useSelector((state) => state.activities.value);

  const handleShare = async () => {
    console.log("share");

    try {
      const result = await Share.share({
        message: "Les Petits Explorateurs | Activité proche de chez vous !",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleLike = () => {
    console.log("add to or remove from favorites");
    console.log("isLiked BDD: ", activity.isLiked);
    console.log("isLiked reducer: ", activities);

    const token = user.token;
    const activityId = activity.id;
    const userId = user.id;
    const isLiked = activity.isLiked;

    fetch(`${BACKEND_ADDRESS}/activities/favorite/${token}/${activityId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, activityId })
    }).then((response) => response.json())
      .then(data => {
        data.result && dispatch(updateLikedActivities({ activityId, userId, isLiked }));
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  /*const handleFollow = () => {
    console.log("follow or unfollow");
  };*/

  /*const handleMessage = () => {
    console.log("navigate to MessageScreen");
    navigation.navigate("MessagingDiscussion");
  };*/

  const handleCalendar = () => {
    console.log("add to calendar");
  };

  //const inputDate = new Date(activity.date);

  //const options = {
  //  weekday: "long", // full weekday name
  //   day: "numeric", // day of the month
  //   month: "long", // full month name
  //   hour: "numeric",
  //   minute: "numeric",
  // };

  // const formattedDate = inputDate.toLocaleString("fr-FR", options).replace(":", "h").toUpperCase();

  //Gestion de la date
  const dateObject = new Date(activity.date);
  // Pour obtenir heure de fin
  const dateEnMillisecondes = new Date(activity.date).getTime(); // Get milliseconds
  const endOfActivity = dateEnMillisecondes + activity.durationInMilliseconds
  const endDate = new Date(endOfActivity);
  const endHour = endDate.getHours();
  const endMinutes = endDate.getMinutes();

  const daysOfWeek = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  // Obtenir le jour de la semaine, le jour du mois, le mois et l'année
  const day = daysOfWeek[dateObject.getDay()];
  const date = dateObject.getDate();
  const month = months[dateObject.getMonth()];
  const year = dateObject.getFullYear();
  // Obtenir l'heure et les minutes
  const hours = dateObject.getHours().toString().padStart(2, "0"); // Ajoute un zéro devant si nécessaire
  const minutes = dateObject.getMinutes().toString().padStart(2, "0"); // Ajoute un zéro devant si nécessaire
  // Formater date et heure
  const formattedDate = `${day} ${date} ${month} ${year}`;
  const formattedTime = `${hours}h${minutes}`;

  // Formater la durée
  const formattedDuration = `${endHour}h${endMinutes === 0 ? "00" : endMinutes}`;

  const handleClickOnOrganizer = () => {
    fetch(`${BACKEND_ADDRESS}/organizers/${activity.organizerId}`)
      .then((response) => response.json())
      .then((data) => {
        data.result &&
          navigation.navigate("OrganizerProfile", {
            organizer: data.organizer,
          });
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        style={styles.image}
        source={{ uri: activity.imgUrl ? activity.imgUrl : "https://res.cloudinary.com/ddoqxafok/image/upload/v1710193256/htkhybdxefcsm7ktpqbp.jpg" }}
      >
        <View style={styles.iconPosition}>
          <View>
            <FontAwesome
              name={"arrow-left"}
              color={"black"}
              size={20}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.likeShare}>
            <TouchableOpacity
              onPress={() => handleShare()}
              style={styles.topIconBckgd}
            >
              <Ionicons name="share-social-sharp" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLike()}
              style={styles.topIconBckgd}
            >
              <Ionicons
                name="heart"
                size={24}
                style={{ color: activities.isLiked ? "red" : "white" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.activity}>
        <View style={styles.namePrice}>
          <Text style={styles.title}>{activity.name}</Text>
          <View style={styles.price}>
            <Text style={styles.priceText}>{activity.price === 0 ?  "Gratuit" : activity.price + "€"}</Text>
          </View>
        </View>
        <View style={styles.div}>
          <View style={styles.icon}>
            <Ionicons name="calendar" size={24} color="#5669FF" />
          </View>
          <View marginLeft={20}>
            <Text style={styles.bold}>{formattedDate}</Text>
            <Text style={styles.small}>
              De {formattedTime} à {formattedDuration}
            </Text>
          </View>
        </View>

        <View style={styles.div}>
          <View style={styles.icon}>
            <Ionicons name="location" size={28} color="#5669FF" />
          </View>
          <View marginLeft={20}>
            <Text style={styles.bold}>{activity.locationName}</Text>
            <Text style={styles.small}>
              {activity.address} {activity.postalCode} {activity.city}{" "}
            </Text>
          </View>
        </View>

        {activity.organizer && (
          <View>
            <TouchableOpacity
              onPress={() => handleClickOnOrganizer()}
              activeOpacity={0.8}
              style={styles.orgaDiv}
            >
              <View style={styles.img}>
                {activity.organizerImgUrl && (
                  <Image
                    style={styles.photoOrg}
                    source={{ uri: activity.organizerImgUrl }}
                  />
                )}
                {activity.organizerImgUrl === "" && (
                  <Text style={styles.initiale}>
                    {activity.organizer.slice(0, 1)}
                  </Text>
                )}
              </View>
              <View marginLeft={20}>
                <Text style={styles.bold}>{activity.organizer}</Text>
                <Text style={styles.small}>Organisateur</Text>
              </View>
            </TouchableOpacity>


            {/* <View style={styles.followWrite}>
            <TouchableOpacity onPress={() => handleFollow()} style={styles.btn}>
              <Text style={styles.btnOrganizer}>Suivre</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMessage()} style={styles.btn}>
              <Text style={styles.btnOrganizer}>Écrire</Text>
            </TouchableOpacity>
          </View> */}
          </View>
        )}



        <Text style={styles.subtitle}>À propos de l'évènement</Text>
        <ScrollView>
          <Text style={styles.description}>{activity.description}</Text>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleCalendar()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>AJOUTER À L'AGENDA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    flex: 3.5,
  },
  iconPosition: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 25,
    paddingLeft: 25,
    paddingTop: 35,
  },
  likeShare: {
    display: "flex",
    flexDirection: "row",
  },
  like: {
    color: "white",
  },
  like: {
    color: "white",
  },
  topIconBckgd: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    height: 36,
    width: 36,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    margin: 5,
  },
  activity: {
    flex: 6,
  },
  title: {
    fontSize: 35,
    fontWeight: "600",
    display: "flex",
    alignItems: "flex-start",
    marginLeft: 25,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 25,
  },
  namePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between"
  },
  price: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "rgba(255, 180, 89, 0.3)",
    height: 36,
    width: 80,
    borderRadius: 5,
    marginRight: 20,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9B5909",
  },
  icon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAEDFF",
    width: 48,
    height: 48,
    borderRadius: 15,
    marginLeft: 25,
  },
  div: {
    display: "flex",
    height: 55,
    width: 305,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  orgaDiv: {
    display: "flex",
    height: 55,
    width: 260,
    flexDirection: "row",
    alignItems: "center",
  },
  bold: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    marginRight: 25,
  },
  small: {
    fontSize: 12,
    color: "grey",
    marginRight: 25,
  },
  followWrite: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAEDFF",
    width: 60,
    height: 28,
    borderRadius: 5,
    marginTop: 7,
  },
  btnOrganizer: {
    color: "#5669FF",
    fontWeight: "bold",
    fontSize: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    marginLeft: 25,
    marginRight: 25,
    fontSize: 15,
    lineHeight: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
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
  photoOrg: {
    width: 48,
    height: 48,
    borderRadius: 100,
  },
  img: {
    width: 48,
    height: 48,
    borderRadius: 100,
    marginLeft: 25,
    alignSelf: "center",
    backgroundColor: "#EEF0FF",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  initiale: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#BBC3FF",
  },
  photoOrg: {
    width: 48,
    height: 48,
    borderRadius: 100,
  },
  img: {
    width: 48,
    height: 48,
    borderRadius: 100,
    marginLeft: 25,
    alignSelf: "center",
    backgroundColor: "#EEF0FF",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  initiale: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#BBC3FF",
  },
});

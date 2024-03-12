import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function Card({ activity }) {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.value);
  const [selectedImage, setSelectedImage] = useState(null);
  //A SUPPRIMER PLUS TARD
  let isFavorite = false;

  const inputDate = new Date(activity.date);

  const options = {
    weekday: "long", // full weekday name
    day: "numeric", // day of the month
    month: "long", // full month name
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = inputDate
    .toLocaleString("fr-FR", options)
    .replace(":", "h")
    .toUpperCase();

  let distanceText;
  if (
    user.filters.latitudeFilter === -200 ||
    user.filters.longitudeFilter === -200
  ) {
    if (
      user.preferences.latitudePreference === -200 ||
      user.preferences.longitudePreference === -200
    ) {
      distanceText = <></>;
    } else if (
      user.preferences.latitudePreference !== -200 &&
      user.preferences.longitudePreference !== -200
    ) {
      distanceText = (activity.distance === undefined ? <></> : <Text style={styles.activityLocation}>{`${activity.distance} KM`}</Text>);
    }
  } else if (
    user.filters.latitudeFilter !== -200 &&
    user.filters.longitudeFilter !== -200
  ) {
    distanceText = (activity.distance === undefined ? <></> : <Text style={styles.activityLocation}>{`${activity.distance} KM`}</Text>);
  }

  const images = [
    "https://res.cloudinary.com/ddoqxafok/image/upload/v1710193837/fc8mbgyemnaoht4vmtbq.jpg",
    "https://res.cloudinary.com/ddoqxafok/image/upload/v1710194196/mrti6xyaxle51luebatx.jpg",
    "https://res.cloudinary.com/ddoqxafok/image/upload/v1710193256/htkhybdxefcsm7ktpqbp.jpg",
    "https://res.cloudinary.com/ddoqxafok/image/upload/v1710230637/roldct4qep6fbuusopb6.jpg",
    "https://res.cloudinary.com/ddoqxafok/image/upload/v1710230637/lfisxvri72gavcspokvt.jpg",
    "https://res.cloudinary.com/ddoqxafok/image/upload/v1710230637/sqjdln8xutod0u5oijbh.jpg",
    "https://res.cloudinary.com/ddoqxafok/image/upload/v1710230637/t0ia8jbjnnp2wtlhac98.jpg",
  ];

  const chooseRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    setSelectedImage(randomImage);
  };

  useEffect(() => {
    chooseRandomImage();
  });

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => navigation.navigate("ActivitySheet", { activity })}
      >
        <Image
          style={styles.img}
          source={{ uri: activity.imgUrl ? activity.imgUrl : selectedImage }}
        />

        <View style={styles.details}>
          <View style={styles.dateFavoriteContainer}>
            <Text style={styles.activityDate}>{formattedDate}</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.favorite}>
              {!isFavorite ? (
                <Icon
                  style={styles.heartIcon}
                  name="heart-outline"
                  size={20}
                  color="#EB5757"
                />
              ) : (
                <Icon
                  style={styles.heartIcon}
                  name="heart"
                  size={20}
                  color="#EB5757"
                />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.activityName}>{activity.name}</Text>
          <View style={styles.locationContainer}>
            <Text
              style={styles.activityLocation}
            >{`${activity.postalCode}, ${activity.city}`}</Text>
            {distanceText}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
    width: "100%",
  },
  card: {
    justifyContent: "flex-start",
    padding: 8,
    gap: 12,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 16,
    margin: 8,
    width: "90%",
    height: 112,
    backgroundColor: "white",
    //Ombre portée
    shadowColor: "#535990",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 25,
    shadowOpacity: 0.07,
    elevation: 5, // Pour Android
  },
  img: {
    height: 92,
    width: 82,
    borderRadius: 8,
    backgroundColor: "#EEF0FF",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    gap: 4,
    height: 82,
    justifyContent: "space-between",
  },
  dateFavoriteContainer: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityDate: {
    fontWeight: "bold",
    color: "#5669FF",
    fontSize: 12,
  },
  favorite: {
    width: 24,
    height: 24,
  },
  activityName: {
    fontWeight: "bold",
    color: "#120D26",
    fontSize: 20,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityLocation: {
    color: "#888693",
    fontSize: 12,
  },
});

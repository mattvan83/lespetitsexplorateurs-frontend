import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function Card({ activity }) {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.value);
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
    .toLocaleString("fr-FR")
    .replace(":", "h")
    .toUpperCase();

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => navigation.navigate("ActivitySheet", { activity })}
      >
        <Image style={styles.img} source={{ uri: activity.imgUrl }} />
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
            {/* {activityDistance ? (
              <Text style={styles.activityLocation}>{user.latitude && user.longitude ? activity.distance : null} KM</Text>
            ) : (
              <></>
            )} */}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
  },
  card: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 16,
    margin: 8,
    width: 325,
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
  },
  details: {
    gap: 4,
    height: 82,
    width: 215,
    justifyContent: "space-between",
  },
  dateFavoriteContainer: {
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

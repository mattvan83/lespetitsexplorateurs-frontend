import { StyleSheet, Text, Image, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Card({
  imagePath,
  activityDate,
  activityName,
  activityLocation,
  isFavorite,
}) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Image
          style={styles.img}
          source={require("../assets/Images/eveil-musical.png")}
        />
        <View style={styles.details}>
          <Text style={styles.activityDate}>{activityDate}</Text>
          <Text style={styles.activityName}>{activityName}</Text>
          <Text style={styles.activityLocation}>{activityLocation}</Text>
        </View>
        {/* Icone si isFavorite=false */}
        <Icon
          style={styles.heartIcon}
          name="heart-outline"
          size={28}
          color="#EB5757"
        />
        {/* Icone si isFavorite=true */}
        {/* <Icon style={styles.heartIcon} name="heart" size={20} color="#EB5757" /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
  },
  card: {
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    borderRadius: 16,
    margin: 13,
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
    marginRight: 16,
  },
  details: {
    gap: 10,
  },
  activityDate: {
    fontWeight: "bold",
    color: "#5669FF",
    fontSize: 12,
  },
  activityName: {
    fontWeight: "bold",
    color: "#120D26",
    fontSize: 20,
  },
  activityLocation: {
    color: "#888693",
    fontSize: 12,
  },
  heartIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});

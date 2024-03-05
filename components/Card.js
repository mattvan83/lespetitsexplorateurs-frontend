import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const imageMapping = {
  localImage1: require("../assets/test/activity1.png"),
  localImage2: require("../assets/test/activity2.png"),
  localImage3: require("../assets/test/activity3.png"),
  localImage4: require("../assets/Images/eveil-musical.png"),
};

export default function Card({
  imagePath,
  activityDate,
  activityName,
  activityLocation,
  isFavorite,
  activityDistance,
}) {
  // Check if the image is in the mapping
  const isLocalAsset = imageMapping.hasOwnProperty(imagePath);

  // console.log(activityDistance);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Image
          style={styles.img}
          source={isLocalAsset ? imageMapping[imagePath] : { uri: imagePath }}
        />
        <View style={styles.details}>
          <View style={styles.dateFavoriteContainer}>
            <Text style={styles.activityDate}>{activityDate}</Text>
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

          <Text style={styles.activityName}>{activityName}</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.activityLocation}>{activityLocation}</Text>
            {activityDistance ? (
              <Text style={styles.activityLocation}>{activityDistance} KM</Text>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
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
    // borderColor: "red",
    // borderWidth: 1,
  },
  img: {
    height: 92,
    width: 82,
    borderRadius: 8,
    // borderColor: "blue",
    // borderWidth: 1,
  },
  details: {
    gap: 4,
    height: 82,
    width: 215,
    justifyContent: "space-between",
    // borderColor: "green",
    // borderWidth: 1,
  },
  dateFavoriteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderColor: "green",
    // borderWidth: 1,
  },
  activityDate: {
    fontWeight: "bold",
    color: "#5669FF",
    fontSize: 12,
  },
  favorite: {
    width: 24,
    height: 24,
    // borderColor: "yellow",
    // borderWidth: 1,
  },
  activityName: {
    fontWeight: "bold",
    color: "#120D26",
    fontSize: 20,
    // borderColor: "red",
    // borderWidth: 1,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // borderColor: "yellow",
    // borderWidth: 1,
  },
  activityLocation: {
    color: "#888693",
    fontSize: 12,
  },
});

import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserActivity } from "../reducers/user";
import { useNavigation } from '@react-navigation/native';

const imageMapping = {
  localImage1: require("../assets/test/activity1.png"),
  localImage2: require("../assets/test/activity2.png"),
  localImage3: require("../assets/test/activity3.png"),
  localImage4: require("../assets/Images/eveil-musical.png"),
};

export default function CardEditDelete({
  activityId,
  imagePath,
  activityDate,
  activityName,
  activityLocation,
  activityDistance,
}) {
  // Check if the image is in the mapping
  const navigation = useNavigation();
  const isLocalAsset = imageMapping.hasOwnProperty(imagePath);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const BACKEND_ADDRESS = "http://172.20.10.8:3000";

  const handleDeleteSubmit = () => {
    fetch(`${BACKEND_ADDRESS}/activities/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId: activityId, token: user.token }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        data.result && dispatch(deleteUserActivity(activityId))
      })
  }

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('ActivitySheet', { activityId })}>
        <View style={styles.card}>
          <Image
            style={styles.img}
            source={isLocalAsset ? imageMapping[imagePath] : { uri: imagePath }}
          />
          <View style={styles.details}>
            <Text style={styles.activityDate}>{activityDate}</Text>

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
        <TouchableOpacity activeOpacity={0.8} style={styles.edit}>
          <AntDesign name="edit" size={24} color="#5669FF" />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.delete} onPress={() => handleDeleteSubmit()}>
          <MaterialCommunityIcons name="delete-forever" size={24} color="#5669FF" />
        </TouchableOpacity>
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
    width: '90%',
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
  activityDate: {
    fontWeight: "bold",
    color: "#F59762",
    fontSize: 12,
  },
  edit: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  delete: {
    position: 'absolute',
    bottom: 10,
    right: 10,
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

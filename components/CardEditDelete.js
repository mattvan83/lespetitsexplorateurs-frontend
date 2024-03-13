import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addActivityInfoScreen1, addActivityInfoScreen2, addActivityInfoScreen3, addActivityInfoScreen4, addActivityInfoScreen5, startUpdate } from '../reducers/activities';
import { deleteUserActivity } from "../reducers/user";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function CardEditDelete({ activity }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const handleClickOnActivity = () => {
    fetch(`${BACKEND_ADDRESS}/activities/${activity.id}`)
      .then((response) => response.json())
      .then((data) => {
        data.result && navigation.navigate('ActivitySheet', { activity: data.activity })
      });
  }

  const handleEditSubmit = () => {
    console.log(activity.durationInMilliseconds)
    dispatch(addActivityInfoScreen1({ name: activity.name, description: activity.description, category: activity.category }));
    dispatch(addActivityInfoScreen2({ concernedAges: activity.concernedAges }));
    dispatch(addActivityInfoScreen3({ address: activity.address, postalCode: activity.postalCode, city: activity.city, locationName: activity.locationName }));
    dispatch(addActivityInfoScreen4({ date: activity.date, durationInMilliseconds: activity.durationInMilliseconds }));
    dispatch(addActivityInfoScreen5({ imgUrl: activity.imgUrl }));
    dispatch(startUpdate({id: activity.id}));
    navigation.navigate("ActivityPart1");
  }

  const handleDeleteSubmit = () => {
    fetch(`${BACKEND_ADDRESS}/activities/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId: activity.id, token: user.token }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        data.result && dispatch(deleteUserActivity(data.activityId))
      })
  }

  const inputDate = new Date(activity.date);

  const options = {
    weekday: "long", // full weekday name
    day: "numeric", // day of the month
    month: "long", // full month name
    hour: "numeric",
    minute: "numeric",
  };
  const formattedDate = inputDate.toLocaleString("fr-FR", options).replace(":", "h").toUpperCase();

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => handleClickOnActivity()}>
        {activity.imgUrl && <Image style={styles.img} source={{ uri: activity.imgUrl }} />}
        {!activity.imgUrl && <View style={styles.img}><FontAwesome name={'photo'} color={'#BBC3FF'} size={28} /></View>}
        <View style={styles.details}>
          <Text style={styles.activityDate}>{formattedDate}</Text>

          <Text style={styles.activityName}>{activity.name}</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.activityLocation}>{`${activity.postalCode}, ${activity.city}`}</Text>
            {activity.distance ? (
              <Text style={styles.activityLocation}>{activity.distance} KM</Text>
            ) : (
              <></>
            )}
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.edit} onPress={() => handleEditSubmit()}>
          <AntDesign name="edit" size={24} color="#5669FF" />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.delete} onPress={() => handleDeleteSubmit()}>
          <MaterialCommunityIcons name="delete-forever" size={24} color="#5669FF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
  },
  card: {
    justifyContent: "flex-start",
    padding: 8,
    gap: 12,
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
    backgroundColor: "#EEF0FF",
    justifyContent: 'center',
    alignItems: 'center',
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

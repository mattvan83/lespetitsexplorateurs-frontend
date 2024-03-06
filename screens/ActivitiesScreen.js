import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import globalStyles from '../globalStyles';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CardEditDelete from '../components/CardEditDelete';

const BACKEND_ADDRESS = "http://192.168.1.22:3000";

export default function ActivitiesScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/activities/allactivities/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        data.result && setActivities(data.activities);
      })
  }, [])

  const activitiesList = activities.map((activity, i) => {
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

    return <CardEditDelete key={i} imagePath={activity.imgUrl}
      activityDate={formattedDate}
      activityName={activity.name}
      activityLocation={`${activity.postalCode}, ${activity.city}`}
      isFavorite={activity.isLiked}
      activityDistance={0} />
  })


  const handleSubmit = () => {
    navigation.navigate("ActivityPart1");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={globalStyles.title2}>Mes activités</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {activitiesList}
      </ScrollView>

      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}>
        <Text style={styles.textButton}>Répertorier une activité</Text>
      </TouchableOpacity>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "white",
  },
  button: {
    padding: 10,
    width: '70%',
    height: 58,
    backgroundColor: '#5669FF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 30
  },
  textButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
});

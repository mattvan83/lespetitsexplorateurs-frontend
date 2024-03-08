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
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserActivities, deleteUserActivity } from '../reducers/user';
import CardEditDelete from '../components/CardEditDelete';

const BACKEND_ADDRESS = "http://172.20.10.8:3000";

export default function ActivitiesScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/activities/allactivities/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        data.result && dispatch(loadUserActivities(data.activities));
      })
  }, [])

  const activitiesList = user.userActivities.map((activity, i) => {
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
      activityId={activity.id}
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

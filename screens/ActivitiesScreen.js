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

const BACKEND_ADDRESS = "http://192.168.1.23:3000";

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
      return <CardEditDelete key={i} activity={activity} />
  })

  const handleSubmit = () => {
    navigation.navigate("ActivityPart1");
  };

  console.log(user.userActivities)

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

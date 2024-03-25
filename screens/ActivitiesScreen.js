import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  FlatList,
} from "react-native";
import globalStyles from "../globalStyles";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUserActivities } from "../reducers/user";
import { resetActivityInfos } from "../reducers/activities";
import CardEditDelete from "../components/CardEditDelete";
import Button from "../components/Button";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ActivitiesScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/activities/allactivities/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        data.result && dispatch(loadUserActivities(data.activities));
      });
  }, []);


  const handlePress = () => {
    dispatch(resetActivityInfos())
    navigation.navigate("ActivityPart1");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={globalStyles.title2}>Mes activités</Text>

      {user.userActivities.length === 0 && (
        <View style={styles.noMsgContainer}>
          <Image
            style={styles.img}
            source={require('../assets/Images/19.jpg')}
          />
          <Text style={styles.text} >Vous n'avez répertorié aucune activité.</Text>
          <Text style={styles.text}>Commencez dès à présent !</Text>
        </View>)}

      <FlatList
        data={user.userActivities}
        renderItem={({ item, index }) => (
          <View style={{ marginBottom: index === user.userActivities.length - 1 ? 100 : 0 }}>
            <CardEditDelete key={String(item.id)} activity={item} />
          </View>
        )}
        keyExtractor={item => String(item.id)}
        style={styles.flatlist}
      />
      <View style={globalStyles.bottomButton}>
        <Button onPress={handlePress} text="Répertorier une activité" />
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  flatlist: {
    width: '100%',
    padding: 8,
    gap: 8,
  },
  noMsgContainer: {
    alignItems: 'center',
    justifyContent: "center",
    flex: 1,
  },
  img: {
    width: 250,
    height: 250,
    borderRadius: 150,
    marginTop: 330,
    marginBottom: 20,
    alignSelf: "center",
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    width: '80%',
    lineHeight: 24,
    alignSelf: 'center',
  }
});

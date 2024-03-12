import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import globalStyles from "../globalStyles";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUserActivities } from "../reducers/user";
import { resetActivityInfos } from "../reducers/activities";
import CardEditDelete from "../components/CardEditDelete";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ActivitiesScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const activities = useSelector((state) => state.activities.value);

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/activities/allactivities/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        data.result && dispatch(loadUserActivities(data.activities));
      });
  }, [activities]);


  const handleSubmit = () => {
    dispatch(resetActivityInfos())
    navigation.navigate("ActivityPart1");
  };

  console.log(user.userActivities)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={globalStyles.title2}>Mes activités</Text>

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

      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Répertorier une activité</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  button: {
    padding: 10,
    width: "70%",
    height: 58,
    backgroundColor: "#5669FF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 30,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  flatlist: {
    width: '100%',
    padding: 8,
    gap: 8,
  },
});

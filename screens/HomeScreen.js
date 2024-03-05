import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import globalStyles from "../globalStyles";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentLocation, importActivities } from "../reducers/user";

const BACKEND_ADDRESS = "http://192.168.1.20:3000";

export default function HomeScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  console.log("user: ", user);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("permission geolocalization status: ", status);

      if (status === "granted") {
        const {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync();

        const coordinates = { latitude, longitude };
        console.log("user coordinates: ", coordinates);

        dispatch(addCurrentLocation(coordinates));
      }
    })();
  }, []);

  useEffect(() => {
    if (!user.latitude && !user.longitude) {
      console.log("User coordinates unavailable");
      fetch(`${BACKEND_ADDRESS}/activities/nogeoloc/${user.token}`)
        .then((response) => response.json())
        .then((data) => {
          data.result && dispatch(importActivities(data.activities));
        });
    } else {
      console.log("User coordinates available");
      fetch(
        `${BACKEND_ADDRESS}/activities/geoloc/${user.token}/${user.latitude}/${user.longitude}`
      )
        .then((response) => response.json())
        .then((data) => {
          data.result && dispatch(importActivities(data.activities));
        });
    }
  }, []);

  const activities = user.activities.map((activity, i) => {
    return (
      <Card
        key={i}
        imagePath={activity.imgUrl}
        activityDate={"Jeudi 15 Mars à 10h"}
        activityName={activity.name}
        activityLocation={`${activity.postalCode}, ${activity.city}`}
        isFavorite={activity.isLiked}
      ></Card>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <SearchBar />
        </View>
        <View style={styles.body}>
          <View style={styles.listActivities}>
            <Text style={globalStyles.title3}>Près de chez vous</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* <Card
                activityDate={"Jeudi 15 Mars à 10h"}
                activityName={"Eveil musical"}
                activityLocation={"26240, SAINT-VALLIER"}
                isFavorite={true}
              ></Card>
              <Card
                activityDate={"Jeudi 15 Mars à 10h"}
                activityName={"Eveil musical"}
                activityLocation={"26240, SAINT-VALLIER"}
                isFavorite={false}
              ></Card>
              <Card
                activityDate={"Jeudi 15 Mars à 10h"}
                activityName={"Eveil musical"}
                activityLocation={"26240, SAINT-VALLIER"}
                isFavorite={false}
              ></Card> */}
              {activities}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    width: "100%",
  },
  header: {
    flex: 0.25,
    backgroundColor: "#4A43EC",
    width: "100%",
  },
  body: {
    flex: 0.8,
    width: "100%",
    // marginTop: 15,
  },
  listActivities: {
    flex: 0.35,
    // width: "100%",
    // margin: 13,
    // marginLeft: "5%",
    // marginRight: "5%",
  },
  scrollView: {
    // flex: 1,
    // paddingRight: 20,
    // marginVertical: 20,
    // backgroundColor: "grey",
    // width: "100%",
    // height: "100%",
  },
  card: {
    marginRight: 100,
  },
});

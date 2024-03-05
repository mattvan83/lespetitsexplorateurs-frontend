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
  // console.log("user: ", user);

  const dispatch = useDispatch();

  useEffect(() => {
    let isPositionObtained = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("permission geolocalization status: ", status);

      if (status === "granted") {
        try {
          const {
            coords: { latitude, longitude },
          } = await Location.getCurrentPositionAsync();

          const coordinates = { latitude, longitude };
          console.log("user coordinates: ", coordinates);

          // Set the flag to indicate that the position has been obtained
          isPositionObtained = true;
          dispatch(addCurrentLocation(coordinates));

          if (isPositionObtained) {
            console.log("User coordinates available");
            fetch(
              `${BACKEND_ADDRESS}/activities/geoloc/${user.token}/${coordinates.latitude}/${coordinates.longitude}`
            )
              .then((response) => response.json())
              .then((data) => {
                data.result && dispatch(importActivities(data.activities));
              });
          }
        } catch (error) {
          console.error("Error obtaining user coordinates: ", error);
        }
      }

      // Check if the position is not obtained after a certain delay
      const delay = 2000; // Set your desired delay in milliseconds
      const timeoutId = setTimeout(() => {
        if (!isPositionObtained) {
          console.log("User coordinates unavailable");
          // Handle the case where coordinates are not obtained within the specified delay
          fetch(`${BACKEND_ADDRESS}/activities/nogeoloc/${user.token}`)
            .then((response) => response.json())
            .then((data) => {
              data.result && dispatch(importActivities(data.activities));
            });
        }
      }, delay);

      // Cleanup the timeout when the component unmounts or when the position is obtained
      return () => clearTimeout(timeoutId);
    })();
  }, []);

  const activities = user.activities.map((activity, i) => {
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

    // console.log(formattedDate);

    return (
      <Card
        key={i}
        id={activity.id}
        imagePath={
          activity.imgUrl.includes(1)
            ? "localImage1"
            : activity.imgUrl.includes(2)
            ? "localImage2"
            : "localImage3"
        }
        activityDate={formattedDate}
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

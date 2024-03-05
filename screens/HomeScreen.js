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
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";

const BACKEND_ADDRESS = "http://192.168.1.20:3000";

export default function HomeScreen({ navigation }) {
  const [dataSet, setDataSet] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
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

  const searchCity = (query) => {
    // Prevent search with an empty query
    if (query === "") {
      return;
    }

    fetch(
      `https://geo.api.gouv.fr/communes?nom=${query}&fields=code,nom,departement,region,centre&limit=8`
    )
      .then((response) => response.json())
      .then((apiData) => {
        const suggestions = apiData.map((data, i) => {
          return {
            id: i,
            title: `${data.nom}, ${data.departement.nom}, ${data.region.nom}`,
            cityName: data.nom,
            postalCode: data.code,
            department: data.departement.nom,
            region: data.region.name,
            coords: data.centre.coordinates,
          };
        });
        setDataSet(suggestions);
      });
  };

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
        activityDistance={
          user.latitude && user.longitude ? activity.distance : null
        }
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
          {/* <SearchBar /> */}
          <AutocompleteDropdown
            onChangeText={(value) => searchCity(value)}
            onSelectItem={(item) =>
              item && setCitiesData([...citiesData, item])
            }
            dataSet={dataSet}
            textInputProps={{
              placeholder: "Rechercher un lieu...",
            }}
            inputContainerStyle={styles.inputContainer}
            containerStyle={styles.dropdownContainer}
            suggestionsListContainerStyle={styles.suggestionListContainer}
            closeOnSubmit
          />
        </View>
        <View style={styles.body}>
          <View style={styles.listActivities}>
            {user.latitude && user.longitude ? (
              <Text style={globalStyles.title3}>Près de chez vous</Text>
            ) : (
              <Text style={globalStyles.title3}>Bientôt</Text>
            )}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}
            >
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
    justifyContent: "flex-end",
    alignItems: "center",
  },
  body: {
    flex: 0.8,
    width: "100%",
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputContainer: {
    width: "70%",
    marginHorizontal: "15%",
    // borderWidth: 1,
    // borderColor: "#51e181",
    // backgroundColor: "#ffffff",
  },
  suggestionListContainer: {
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  listActivities: {
    flex: 0.35,
  },
  scrollView: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  card: {
    marginRight: 100,
  },
});

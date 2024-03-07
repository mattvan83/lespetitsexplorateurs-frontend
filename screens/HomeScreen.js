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
  Dimensions,
} from "react-native";
import Card from "../components/Card";
import globalStyles from "../globalStyles";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { loadOrganizers } from "../reducers/organizers";
import {
  addCurrentLocation,
  addCurrentCity,
  importActivities,
  setLocationFilters,
  setLocationPreferences,
} from "../reducers/user";
import Organizers from "../components/Organizers";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Ionicons } from "@expo/vector-icons";

const BACKEND_ADDRESS = "http://192.168.1.20:3000";

export default function HomeScreen({ navigation }) {
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const user = useSelector((state) => state.user.value);
  const organizers = useSelector((state) => state.organizers.value);
  // console.log("user: ", user);
  console.log("user.filters: ", user.filters);
  console.log("user.preferences: ", user.preferences);

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

          // Set the flag to indicate that the position has been obtained
          isPositionObtained = true;

          if (isPositionObtained) {
            // console.log("User coordinates available");

            // Set the geo-localization coordinates in user reducer
            dispatch(addCurrentLocation(coordinates));
            console.log("user coordinates: ", coordinates);

            // Set the city name in user reducer
            let geoLocationInfo = await Location.reverseGeocodeAsync({
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            });

            if (geoLocationInfo.length > 0) {
              const city = geoLocationInfo[0].city;
              dispatch(addCurrentCity(city));
              console.log("user city: ", city);

              // Set location details in user preferences if not defined
              if (
                !user.preferences.latitudePreference &&
                !user.preferences.longitudePreference
              ) {
                dispatch(
                  setLocationPreferences({
                    cityPreference: city,
                    latitudePreference: coordinates.latitude,
                    longitudePreference: coordinates.longitude,
                  })
                );
              }
            }

            // Get user filters
            const {
              categoryFilter,
              dateFilter,
              momentFilter,
              ageFilter,
              priceFilter,
              scopeFilter,
            } = user.filters;
            // console.log(
            //   categoryFilter,
            //   dateFilter,
            //   momentFilter,
            //   ageFilter,
            //   priceFilter,
            //   scopeFilter
            // );

            // console.log(
            //   user.token,
            //   coordinates.latitude,
            //   coordinates.longitude
            // );

            fetch(`${BACKEND_ADDRESS}/activities/geoloc`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: user.token,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                scope: scopeFilter,
                filters: {
                  categoryFilter,
                  dateFilter,
                  momentFilter,
                  ageFilter,
                },
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                // console.log("data.result: ", data.result);
                // console.log("data.error: ", data.error);
                // console.log("data.activities: ", data.activities);
                data.result &&
                  dispatch(importActivities(data.activities)) &&
                  setErrorMsg("");
                !data.result &&
                  dispatch(importActivities([])) &&
                  setErrorMsg(data.error);
              });

            // console.log(user.preferences.scopePreference);
            // console.log(coordinates.longitude);
            // console.log(coordinates.latitude);
            // console.log(
            //   `${BACKEND_ADDRESS}/organizers/geoloc/${user.preferences.scopePreference}/${coordinates.longitude}/${coordinates.latitude}`
            // );
            fetch(
              `${BACKEND_ADDRESS}/organizers/geoloc/${user.preferences.scopePreference}/${coordinates.longitude}/${coordinates.latitude}`
            )
              .then((response) => response.json())
              .then((data) => {
                // console.log(data);
                // data.result && console.log(data);
                data.result && dispatch(loadOrganizers(data.organizers));
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

          fetch(`${BACKEND_ADDRESS}/organizers/nogeoloc`)
            .then((response) => response.json())
            .then((data) => {
              data.result && console.log(data);
              data.result && dispatch(loadOrganizers(data.organizers));
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
            region: data.region.nom,
            coords: data.centre.coordinates,
          };
        });
        setSuggestionsList(suggestions);
      });
  };

  const onClearPress = () => {
    setSuggestionsList(null);
  };

  const handlePressFilters = () => {
    navigation.navigate("Filters");
  };

  const organizersMax10 =
    organizers.length > 10 ? organizers.slice(0, 10) : organizers;
  const organizersList = organizersMax10.map((data, i) => {
    return <Organizers key={i} {...data} />;
  });

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
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <View style={styles.searchBar}>
              <Ionicons name="location-outline" size={24} color="#D0CFD4" />
              <AutocompleteDropdown
                onChangeText={(value) => searchCity(value)}
                onSelectItem={(item) =>
                  item &&
                  dispatch(
                    setLocationFilters({
                      cityFilter: item.cityName,
                      longitudeFilter: item.coords[0],
                      latitudeFilter: item.coords[1],
                    })
                  ) &&
                  navigation.navigate("ListResults")
                }
                dataSet={suggestionsList}
                suggestionsListMaxHeight={
                  Dimensions.get("window").height * 0.45
                }
                onClear={onClearPress}
                textInputProps={{
                  placeholder: "Rechercher un lieu...",
                  style: {
                    color: "#120D26",
                    paddingLeft: 20,
                  },
                }}
                inputContainerStyle={styles.inputContainer}
                containerStyle={styles.dropdownContainer}
                suggestionsListContainerStyle={styles.suggestionListContainer}
                rightButtonsContainerStyle={styles.rightButtonsContainerStyle}
                emptyResultText="Recherche infructueuse"
                suggestionsListTextStyle={{
                  color: "#120D26",
                  fontSize: 12,
                }}
                closeOnSubmit
              />
            </View>
            <TouchableOpacity
              onPress={() => handlePressFilters()}
              style={styles.filtersButton}
              activeOpacity={0.8}
            >
              <Ionicons name="filter" size={24} color="#4A43EC" />
              {/* <Text style={styles.textButton}>Filtres</Text> */}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.listActivities}>
            {user.latitude && user.longitude ? (
              <Text style={globalStyles.title3}>Près de chez vous</Text>
            ) : (
              <Text style={globalStyles.title3}>Bientôt</Text>
            )}
            {errorMsg ? (
              <TextInput style={styles.errorMsg}>{errorMsg}</TextInput>
            ) : (
              <></>
            )}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}
            >
              {activities}
            </ScrollView>

            <Text style={globalStyles.title3}>Organisateurs</Text>
            <ScrollView horizontal={true} style={styles.organizers}>
              {organizersList}
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
  organizers: {
    marginLeft: 10,
    gap: 8,
  },
  header: {
    flex: 0.25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4A43EC",
    width: "100%",
  },
  filtersButton: {
    width: 70,
    alignItems: "center",
    backgroundColor: "#EBEDFF",
    borderRadius: 100,
    justifyContent: "center",
    padding: 6,
  },
  textButton: {
    color: "#5669FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  body: {
    flex: 0.8,
    width: "100%",
  },
  listActivities: {
    height: "100%",
  },
  errorMsg: {
    marginTop: 24,
    marginLeft: 20,
    color: "red",
    fontWeight: "bold",
  },
  scrollView: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  card: {
    marginRight: 100,
  },
  searchContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  search: {
    flexDirection: "row",
    gap: 8,
    height: 45,
    width: "90%",
  },
  searchBar: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 5,
    borderRadius: 12,
    borderColor: "#E4dfdf",
    borderWidth: 1,
  },
  input: {
    width: "90%",
    color: "#747688",
    fontSize: 16,
    marginLeft: 10,
  },
  dropdownContainer: {
    width: "100%",
  },
  inputContainer: {
    width: "90%",
    fontSize: 16,
    marginLeft: 10,
    backgroundColor: "white",
    marginLeft: 5,
  },
  suggestionListContainer: {
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  rightButtonsContainerStyle: {
    backgroundColor: "white",
  },
});

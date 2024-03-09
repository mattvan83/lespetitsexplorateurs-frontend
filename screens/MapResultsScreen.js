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
  Button,
} from "react-native";
// import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import globalStyles from "../globalStyles";
import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import {
  addCurrentLocation,
  importActivities,
  setLocationFilters,
  setErrorMsg,
} from "../reducers/user";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

const BACKEND_ADDRESS = "http://192.168.1.20:3000";

export default function MapResultsScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const userFilters = useSelector((state) => state.user.value.filters);
  const [suggestionsList, setSuggestionsList] = useState([]);
  const mapViewRef = useRef(null);

  console.log("user.filters: ", userFilters);

  const dispatch = useDispatch();

  useEffect(() => {
    // Get user filters
    const {
      categoryFilter,
      dateFilter,
      momentFilter,
      ageFilter,
      priceFilter,
      scopeFilter,
    } = user.filters;

    fetch(`${BACKEND_ADDRESS}/activities/geoloc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        latitude: user.filters.latitudeFilter,
        longitude: user.filters.longitudeFilter,
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
          dispatch(setErrorMsg(null));
        !data.result &&
          dispatch(importActivities([])) &&
          dispatch(setErrorMsg(data.error));
      });
  }, [userFilters]);

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

  const handleSelectItem = (item) => {
    if (item) {
      dispatch(
        setLocationFilters({
          cityFilter: item.cityName,
          longitudeFilter: item.coords[0],
          latitudeFilter: item.coords[1],
        })
      );

      // Get user filters
      const {
        categoryFilter,
        dateFilter,
        momentFilter,
        ageFilter,
        priceFilter,
        scopeFilter,
      } = user.filters;

      fetch(`${BACKEND_ADDRESS}/activities/geoloc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: user.token,
          latitude: item.coords[1],
          longitude: item.coords[0],
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
            dispatch(setErrorMsg(null));
          !data.result &&
            dispatch(importActivities([])) &&
            dispatch(setErrorMsg(data.error));
        });
    }
  };

  const onClearPress = () => {
    setSuggestionsList(null);
  };

  const handlePressFilters = () => {
    navigation.navigate("Filters");
  };

  // Coordinates of the center point
  const centerLatitude = user.filters.latitudeFilter; // Example latitude
  const centerLongitude = user.filters.longitudeFilter; // Example longitude

  // Radius in kilometers
  const radiusInKm = 55;

  // Calculate bounding box coordinates
  const oneDegreeOfLatitudeInKm = 111.32;
  const latitudeDelta = radiusInKm / oneDegreeOfLatitudeInKm;
  const longitudeDelta =
    radiusInKm /
    (oneDegreeOfLatitudeInKm * Math.cos(centerLatitude * (Math.PI / 180)));

  const initialRegion = {
    latitude: centerLatitude,
    longitude: centerLongitude,
    latitudeDelta,
    longitudeDelta,
  };

  const reFocusMap = () => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(initialRegion, 1000); // Adjust the duration as needed
    }
  };

  // const activities = user.activities.map((activity, i) => {
  //   const inputDate = new Date(activity.date);

  //   const options = {
  //     weekday: "long", // full weekday name
  //     day: "numeric", // day of the month
  //     month: "long", // full month name
  //     hour: "numeric",
  //     minute: "numeric",
  //   };

  //   const formattedDate = inputDate
  //     .toLocaleString("fr-FR", options)
  //     .replace(":", "h")
  //     .toUpperCase();

  //   // console.log(formattedDate);

  //   return (
  //     <Card
  //       key={i}
  //       id={activity.id}
  //       imagePath={
  //         activity.imgUrl.includes(1)
  //           ? "localImage1"
  //           : activity.imgUrl.includes(2)
  //           ? "localImage2"
  //           : "localImage3"
  //       }
  //       activityDate={formattedDate}
  //       activityName={activity.name}
  //       activityLocation={`${activity.postalCode}, ${activity.city}`}
  //       isFavorite={activity.isLiked}
  //       activityDistance={
  //         user.latitude && user.longitude ? activity.distance : null
  //       }
  //     />
  //   );
  // });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ListResults")}
              style={styles.goBackButton}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <TextInput style={styles.titleHeader}>
              Evènements proches du lieu de votre choix
            </TextInput>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.search}>
              <View style={styles.searchBar}>
                <Ionicons name="location-outline" size={24} color="#D0CFD4" />
                <AutocompleteDropdown
                  onChangeText={(value) => searchCity(value)}
                  onSelectItem={(item) => handleSelectItem(item)}
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
        </View>

        <View style={styles.body}>
          <MapView
            ref={mapViewRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation
          >
            <Marker
              coordinate={{
                latitude: centerLatitude,
                longitude: centerLongitude,
              }}
              title={userFilters.cityFilter}
              description="Super ville"
              pinColor="#fecb2d"
            />
          </MapView>
          <TouchableOpacity
            onPress={reFocusMap}
            style={styles.refocusContainer}
            activeOpacity={0.8}
          >
            <Ionicons name="location-outline" size={24} color="#fecb2d" />
          </TouchableOpacity>
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
    flex: 0.28,
    justifyContent: "space-between",
    alignItems: "flex-start",
    // backgroundColor: "#4A43EC",
    width: "100%",
    paddingTop: 50,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  goBackButton: {
    marginHorizontal: 20,
  },
  titleHeader: {
    fontWeight: "bold",
    width: "80%",
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
    flex: 1,
    width: "100%",
  },
  map: {
    flex: 1,
  },
  errorMsg: {
    marginTop: 24,
    marginLeft: 20,
    color: "red",
    fontWeight: "bold",
  },
  card: {
    marginRight: 100,
  },
  searchContainer: {
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    // backgroundColor: "#4A43EC",
    width: "100%",
    paddingBottom: 20,
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
  mapButtonContainer: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
    bottom: 25,
  },
  refocusContainer: {
    position: "absolute",
    top: 64,
    right: 13,
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
  },
});

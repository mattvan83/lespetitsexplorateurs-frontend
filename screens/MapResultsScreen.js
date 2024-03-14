import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
// import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import globalStyles from "../globalStyles";
import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { loadOrganizers } from "../reducers/organizers";
import {
  addCurrentLocation,
  importActivities,
  setLocationFilters,
  setErrorMsg,
  setErrorOrganizersMsg,
} from "../reducers/user";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import {
  calculateBarycenter,
  convertCoordsToKm,
} from "../modules/localisation";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function MapResultsScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const userFilters = useSelector((state) => state.user.value.filters);
  const [suggestionsList, setSuggestionsList] = useState([]);
  const mapViewRef = useRef(null);

  const initialMarkerColor = "rgba(255, 255, 255, 0.65)";
  const pressedMarkerColor = "rgba(0, 255, 0, 0.75)";

  const [markerColors, setMarkerColors] = useState(
    user.activities.map(() => initialMarkerColor)
  );
  const [pressedMarkerIndex, setPressedMarkerIndex] = useState(null);

  // console.log("user.filters: ", userFilters);
  // console.log("markerColors: ", markerColors);
  // console.log("pressedMarkerIndex: ", pressedMarkerIndex);

  const dispatch = useDispatch();

  useEffect(() => {
    // Execute when the component unmounts
    return () => {
      console.log("Unmount MapResultsScreen");
    };
  }, []);

  useEffect(() => {
    // Get user filters
    const {
      latitudeFilter,
      longitudeFilter,
      categoryFilter,
      dateFilter,
      momentFilter,
      ageFilter,
      priceFilter,
      scopeFilter,
    } = user.filters;

    if (latitudeFilter === -200 || longitudeFilter === -200) {
      if (
        user.preferences.latitudePreference === -200 ||
        user.preferences.longitudePreference === -200
      ) {
        fetch(`${BACKEND_ADDRESS}/activities/nogeoloc`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: user.token,
            filters: {
              categoryFilter,
              dateFilter,
              momentFilter,
              ageFilter,
              priceFilter,
            },
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            data.result &&
              dispatch(importActivities(data.activities)) &&
              dispatch(setErrorMsg(null));
            !data.result &&
              dispatch(importActivities([])) &&
              dispatch(setErrorMsg(data.error));
          });

        fetch(`${BACKEND_ADDRESS}/organizers/nogeoloc`)
          .then((response) => response.json())
          .then((data) => {
            data.result &&
              dispatch(loadOrganizers(data.organizers)) &&
              dispatch(setErrorOrganizersMsg(null));
            !data.result &&
              dispatch(loadOrganizers([])) &&
              dispatch(setErrorOrganizersMsg(data.error));
          });
      } else if (
        user.preferences.latitudePreference !== -200 &&
        user.preferences.longitudePreference !== -200
      ) {
        fetch(`${BACKEND_ADDRESS}/activities/geoloc`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: user.token,
            latitude: user.preferences.latitudePreference,
            longitude: user.preferences.longitudePreference,
            scope: user.preferences.scopePreference,
            filters: {
              categoryFilter,
              dateFilter,
              momentFilter,
              ageFilter: user.preferences.agePreference,
              priceFilter,
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

        fetch(
          `${BACKEND_ADDRESS}/organizers/geoloc/${user.preferences.scopePreference}/${user.preferences.longitudePreference}/${user.preferences.latitudePreference}`
        )
          .then((response) => response.json())
          .then((data) => {
            data.result &&
              dispatch(loadOrganizers(data.organizers)) &&
              dispatch(setErrorOrganizersMsg(null));
            !data.result &&
              dispatch(loadOrganizers([])) &&
              dispatch(setErrorOrganizersMsg(data.error));
          });
      }
    } else if (latitudeFilter !== -200 || longitudeFilter !== -200) {
      fetch(`${BACKEND_ADDRESS}/activities/geoloc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: user.token,
          latitude: latitudeFilter,
          longitude: longitudeFilter,
          scope: scopeFilter,
          filters: {
            categoryFilter,
            dateFilter,
            momentFilter,
            ageFilter,
            priceFilter,
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

      fetch(
        `${BACKEND_ADDRESS}/organizers/geoloc/${scopeFilter}/${longitudeFilter}/${latitudeFilter}`
      )
        .then((response) => response.json())
        .then((data) => {
          data.result &&
            dispatch(loadOrganizers(data.organizers)) &&
            dispatch(setErrorOrganizersMsg(null));
          !data.result &&
            dispatch(loadOrganizers([])) &&
            dispatch(setErrorOrganizersMsg(data.error));
        });
    }
    // // Execute when the component unmounts
    // return () => {
    //   console.log("Unmount MapResultsScreen");
    // };
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
            priceFilter,
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
            dispatch(setErrorMsg(null)) &&
            setMarkerColors(data.activities.map(() => initialMarkerColor));
          !data.result &&
            dispatch(importActivities([])) &&
            dispatch(setErrorMsg(data.error)) &&
            setMarkerColors([]);
          setPressedMarkerIndex(null);
        });

      fetch(
        `${BACKEND_ADDRESS}/organizers/geoloc/${scopeFilter}/${item.coords[0]}/${item.coords[1]}`
      )
        .then((response) => response.json())
        .then((data) => {
          data.result &&
            dispatch(loadOrganizers(data.organizers)) &&
            dispatch(setErrorOrganizersMsg(null));
          !data.result &&
            dispatch(loadOrganizers([])) &&
            dispatch(setErrorOrganizersMsg(data.error));
        });
    }
  };

  const onClearPress = () => {
    setSuggestionsList(null);
  };

  const handlePressFilters = () => {
    navigation.navigate("Filters");
  };

  const reFocusMap = () => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(region, 1000); // Adjust the duration as needed
    }
  };

  const handleMarkerPress = (activity, index) => {
    // console.log("Change background marker color");
    const newColors = [...markerColors];

    // Reset the color of the previously pressed marker
    if (pressedMarkerIndex !== null) {
      newColors[pressedMarkerIndex] = initialMarkerColor;
    }

    // Set the color of the currently pressed marker
    newColors[index] = pressedMarkerColor;
    console.log(newColors);

    setMarkerColors(newColors);
    setPressedMarkerIndex(index);
  };

  const handleMapPress = () => {
    // console.log("maps");
    // Reset all markers to the initial color
    setMarkerColors(user.activities.map(() => initialMarkerColor));
    // Reset pressedMarkerIndex
    setPressedMarkerIndex(null);
    // Refocus map to center Location
    reFocusMap();
  };

  const activityMarkers = user.activities.map((activity, i) => {
    let icon = null;

    switch (activity.category) {
      case "Sport":
        icon = "tennisball";
        break;
      case "Musique":
        icon = "musical-notes";
        break;
      case "Créativité":
        icon = "color-palette";
        break;
      case "Motricité":
        icon = "balloon";
        break;
      case "Éveil":
        icon = "sparkles";
        break;
      default:
        console.log(`${activity.category} not found`);
    }

    // console.log(`markerColors[${i}]: `, markerColors[i]);

    return (
      <Marker
        key={i}
        style={styles.customMarker}
        id={activity.id}
        coordinate={{
          latitude: activity.latitude,
          longitude: activity.longitude,
        }}
        title={activity.name}
        description={activity.distance ? `${activity.distance} km` : null}
        onPress={() => handleMarkerPress(activity, i)}
      >
        <TouchableOpacity
          style={[
            styles.customMarkerIcon,
            { backgroundColor: markerColors[i] },
          ]}
          activeOpacity={0.8}
        >
          <Ionicons name={icon} size={24} color={"#4A43EC"} />
        </TouchableOpacity>
      </Marker>
    );
  });

  let headerLocalisation;
  let centerLatitude;
  let centerLongitude;
  let region;
  if (
    user.filters.latitudeFilter === -200 ||
    user.filters.longitudeFilter === -200
  ) {
    if (
      user.preferences.latitudePreference === -200 ||
      user.preferences.longitudePreference === -200
    ) {
      headerLocalisation = (
        <Text style={styles.localisationBold}>Activités en France</Text>
      );

      // Coordinates of the center point
      centerLatitude = undefined;
      centerLongitude = undefined;

      // Compute barycenter of the near in time activities
      const { barycenterLatitude, barycenterLongitude } = calculateBarycenter(
        user.activities.map((activity) => {
          return { latitude: activity.latitude, longitude: activity.longitude };
        })
      );
      // console.log("Barycenter: ", { barycenterLatitude, barycenterLongitude });

      // Compute distances from the barycenter and determine the max radius
      const maxRadius = user.activities.map((activity) =>
        convertCoordsToKm(
          { latitude: barycenterLatitude, longitude: barycenterLongitude },
          { latitude: activity.latitude, longitude: activity.longitude }
        )
      );
      // console.log("maxRadius: ", maxRadius);

      // Radius in kilometers
      const radiusInKm = Math.max(...maxRadius) + 20;
      // console.log("radiusInKm: ", radiusInKm);

      // Calculate bounding box coordinates
      const oneDegreeOfLatitudeInKm = 111.32;
      const latitudeDelta = radiusInKm / oneDegreeOfLatitudeInKm;
      const longitudeDelta =
        radiusInKm /
        (oneDegreeOfLatitudeInKm *
          Math.cos(barycenterLatitude * (Math.PI / 180)));

      region = {
        latitude: barycenterLatitude,
        longitude: barycenterLongitude,
        latitudeDelta,
        longitudeDelta,
      };
    } else if (
      user.preferences.latitudePreference !== -200 &&
      user.preferences.longitudePreference !== -200
    ) {
      headerLocalisation = (
        <Text style={styles.localisationBold}>
          Activités autour de {user.preferences.cityPreference} (-{" "}
          {user.preferences.scopeFilter}km )
        </Text>
      );

      // Coordinates of the center point
      centerLatitude = user.preferences.latitudePreference; // Example latitude
      centerLongitude = user.preferences.longitudePreference; // Example longitude

      // Radius in kilometers
      const radiusInKm = user.preferences.scopePreference + 20;

      // Calculate bounding box coordinates
      const oneDegreeOfLatitudeInKm = 111.32;
      const latitudeDelta = radiusInKm / oneDegreeOfLatitudeInKm;
      const longitudeDelta =
        radiusInKm /
        (oneDegreeOfLatitudeInKm * Math.cos(centerLatitude * (Math.PI / 180)));

      region = {
        latitude: centerLatitude,
        longitude: centerLongitude,
        latitudeDelta,
        longitudeDelta,
      };
    }
  } else if (
    user.filters.latitudeFilter !== -200 &&
    user.filters.longitudeFilter !== -200
  ) {
    headerLocalisation = (
      <Text style={styles.localisationBold}>
        Activités autour de {user.filters.cityFilter} (-{" "}
        {user.filters.scopeFilter}km )
      </Text>
    );

    // Coordinates of the center point
    centerLatitude = user.filters.latitudeFilter; // Example latitude
    centerLongitude = user.filters.longitudeFilter; // Example longitude

    // Radius in kilometers
    const radiusInKm = user.filters.scopeFilter + 20;

    // Calculate bounding box coordinates
    const oneDegreeOfLatitudeInKm = 111.32;
    const latitudeDelta = radiusInKm / oneDegreeOfLatitudeInKm;
    const longitudeDelta =
      radiusInKm /
      (oneDegreeOfLatitudeInKm * Math.cos(centerLatitude * (Math.PI / 180)));

    region = {
      latitude: centerLatitude,
      longitude: centerLongitude,
      latitudeDelta,
      longitudeDelta,
    };
  }

  console.log(`marker index : ${pressedMarkerIndex}`);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.goBackButton}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
            {headerLocalisation}
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
            region={region}
            showsUserLocation
            onPress={handleMapPress}
          >
            {centerLatitude && centerLongitude && (
              <Marker
                coordinate={{
                  latitude: centerLatitude,
                  longitude: centerLongitude,
                }}
                title={userFilters.cityFilter}
                // description="Super ville"
                pinColor="#fecb2d"
                onPress={() => handleMapPress()} // Reset all marker colors when clicking on this marker
              />
            )}
            {activityMarkers}
          </MapView>
          <TouchableOpacity
            onPress={reFocusMap}
            style={styles.refocusContainer}
            activeOpacity={0.8}
          >
            <Ionicons name="location-outline" size={24} color="#fecb2d" />
          </TouchableOpacity>

          {pressedMarkerIndex !== null && (
            <View style={styles.popupCardContainer}>
              <Card activity={user.activities[pressedMarkerIndex]} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  header: {
    width: "100%",
    paddingTop: 40,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  goBackButton: {
    marginHorizontal: 20,
  },
  localisationBold: {
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
    flex: 0.95,
  },
  errorMsg: {
    marginTop: 24,
    marginLeft: 20,
    color: "red",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 20,
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
  refocusContainer: {
    position: "absolute",
    top: 64,
    right: 13,
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
  },
  customMarker: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  customMarkerIcon: {
    // backgroundColor: initialMarkerColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    padding: 4,
  },
  popupCardContainer: {
    // position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 50,
    flex: 0.15,
    backgroundColor: "transparent",
    alignItems: "center",
  },
});

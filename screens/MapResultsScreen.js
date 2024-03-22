import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
  ActivityIndicator,
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
  setErrorActivitiesFetch,
  setErrorOrganizersFetch,
} from "../reducers/user";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  calculateBarycenter,
  convertCoordsToKm,
} from "../modules/localisation";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function MapResultsScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  // const userFilters = useSelector((state) => state.user.value.filters);
  const [suggestionsList, setSuggestionsList] = useState([]);
  const mapViewRef = useRef(null);

  const initialMarkerColor = "rgba(255, 255, 255, 0.65)";
  const pressedMarkerColor = "rgba(0, 255, 0, 0.75)";

  const [markerColors, setMarkerColors] = useState(
    user.activities.map(() => initialMarkerColor)
  );
  const [pressedMarkerIndex, setPressedMarkerIndex] = useState(null);
  const [tempCity, setTempCity] = useState(null);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const addToRadiusKms = 25;

  // console.log("user.filters: ", user.filters);
  // console.log("markerColors: ", markerColors);
  // console.log("pressedMarkerIndex: ", pressedMarkerIndex);
  console.log("tempCity: ", tempCity);
  console.log("tempCoordinates: ", tempCoordinates);

  const dispatch = useDispatch();

  useEffect(() => {
    // Execute when the component unmounts
    return () => {
      console.log("Unmount MapResultsScreen");
    };
  }, []);

  // useEffect to manage fetch of activities at each update of user.filters
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        // Get user preferences, filters and token
        const {
          agePreference,
          latitudePreference,
          longitudePreference,
          scopePreference,
        } = user.preferences;

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

        const { token } = user;

        if (latitudeFilter === -200 || longitudeFilter === -200) {
          // Case where filters localization has been cleared and no preferences localization is defined
          if (latitudePreference === -200 || longitudePreference === -200) {
            const response = await fetch(
              `${BACKEND_ADDRESS}/activities/nogeoloc`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  token: token,
                  filters: {
                    categoryFilter,
                    dateFilter,
                    momentFilter,
                    ageFilter,
                    priceFilter,
                  },
                }),
              }
            );
            const data = await response.json();
            data.result &&
              dispatch(importActivities(data.activities)) &&
              dispatch(setErrorActivitiesFetch(null)) &&
              setMarkerColors(data.activities.map(() => initialMarkerColor));
            !data.result &&
              dispatch(importActivities([])) &&
              dispatch(setErrorActivitiesFetch(data.error)) &&
              setMarkerColors([]);
            setPressedMarkerIndex(null);
            // Case where filters localization has been cleared and preferences localization is defined
          } else if (
            latitudePreference !== -200 &&
            longitudePreference !== -200
          ) {
            const response = await fetch(
              `${BACKEND_ADDRESS}/activities/geoloc`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  token: token,
                  latitude: latitudePreference,
                  longitude: longitudePreference,
                  scope: scopePreference,
                  filters: {
                    categoryFilter,
                    dateFilter,
                    momentFilter,
                    ageFilter: agePreference,
                    priceFilter,
                  },
                }),
              }
            );
            const data = await response.json();
            data.result &&
              dispatch(importActivities(data.activities)) &&
              dispatch(setErrorActivitiesFetch(null)) &&
              setMarkerColors(data.activities.map(() => initialMarkerColor));
            !data.result &&
              dispatch(importActivities([])) &&
              dispatch(setErrorActivitiesFetch(data.error)) &&
              setMarkerColors([]);
            setPressedMarkerIndex(null);
          }
          // Case where filters localization is defined
        } else if (latitudeFilter !== -200 || longitudeFilter !== -200) {
          const response = await fetch(`${BACKEND_ADDRESS}/activities/geoloc`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: token,
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
          });
          const data = await response.json();
          data.result &&
            dispatch(importActivities(data.activities)) &&
            dispatch(setErrorActivitiesFetch(null)) &&
            setMarkerColors(data.activities.map(() => initialMarkerColor));
          !data.result &&
            dispatch(importActivities([])) &&
            dispatch(setErrorActivitiesFetch(data.error)) &&
            setMarkerColors([]);
          setPressedMarkerIndex(null);
        }
      } catch (error) {
        console.error(error.message);
        setErrorActivitiesFetch(error.message);
      } finally {
        setIsLoading(false);
      }
    })();

    // // Execute when the component unmounts
    // return () => {
    //   console.log("Unmount MapResultsScreen");
    // };
  }, [user.filters]);

  // useEffect to manage fetch of organizers at each update of user.filters.scopeFilter, user.filters.latitudeFilter or user.filters.longitudeFilter
  useEffect(() => {
    (async () => {
      try {
        // Get user preferences, filters and token
        const { latitudePreference, longitudePreference, scopePreference } =
          user.preferences;

        const { latitudeFilter, longitudeFilter, scopeFilter } = user.filters;

        if (latitudeFilter === -200 || longitudeFilter === -200) {
          // Case where filters localization has been cleared and no preferences localization is defined
          if (latitudePreference === -200 || longitudePreference === -200) {
            const response = await fetch(
              `${BACKEND_ADDRESS}/organizers/nogeoloc`
            );
            const data = await response.json();
            data.result &&
              dispatch(loadOrganizers(data.organizers)) &&
              dispatch(setErrorOrganizersFetch(null));
            !data.result &&
              dispatch(loadOrganizers([])) &&
              dispatch(setErrorOrganizersFetch(data.error));
            // Case where filters localization has been cleared and preferences localization is defined
          } else if (
            latitudePreference !== -200 &&
            longitudePreference !== -200
          ) {
            const response = await fetch(
              `${BACKEND_ADDRESS}/organizers/geoloc/${scopePreference}/${longitudePreference}/${latitudePreference}`
            );
            const data = await response.json();
            data.result &&
              dispatch(loadOrganizers(data.organizers)) &&
              dispatch(setErrorOrganizersFetch(null));
            !data.result &&
              dispatch(loadOrganizers([])) &&
              dispatch(setErrorOrganizersFetch(data.error));
          }
          // Case where filters localization is defined
        } else if (latitudeFilter !== -200 || longitudeFilter !== -200) {
          const response = await fetch(
            `${BACKEND_ADDRESS}/organizers/geoloc/${scopeFilter}/${longitudeFilter}/${latitudeFilter}`
          );
          const data = await response.json();
          data.result &&
            dispatch(loadOrganizers(data.organizers)) &&
            dispatch(setErrorOrganizersFetch(null));
          !data.result &&
            dispatch(loadOrganizers([])) &&
            dispatch(setErrorOrganizersFetch(data.error));
        }
      } catch (error) {
        console.error(error.message);
        setErrorOrganizersFetch(error.message);
      }
    })();
  }, [
    user.filters.scopeFilter,
    user.filters.latitudeFilter,
    user.filters.longitudeFilter,
  ]);

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
    // // Refocus map to center Location
    // reFocusMap();
  };

  const handleLongPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    fetch(
      `https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=nom,codesPostaux,centre`
    )
      .then((response) => response.json())
      .then((apiData) => {
        if (apiData.length) {
          setTempCity({
            cityName: apiData[0].nom,
            cityPostalCode: apiData[0].codesPostaux[0],
          });
          setTempCoordinates({ latitude, longitude });
          setModalVisible(true);
        }
      });
  };

  const handleNewSearch = () => {
    if (tempCoordinates && tempCity) {
      dispatch(
        setLocationFilters({
          cityFilter: tempCity.cityName,
          longitudeFilter: tempCoordinates.longitude,
          latitudeFilter: tempCoordinates.latitude,
        })
      );

      setTempCity(null);
      setTempCoordinates(null);
      setModalVisible(false);
    }
  };

  const handleClose = () => {
    setTempCity(null);
    setTempCoordinates(null);
    setModalVisible(false);
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

  // Get user preferences and filters
  const {
    latitudePreference,
    longitudePreference,
    scopePreference,
    cityPreference,
  } = user.preferences;

  const { latitudeFilter, longitudeFilter, cityFilter, scopeFilter } =
    user.filters;

  let headerLocalisation;
  let centerLatitude;
  let centerLongitude;
  let region;
  if (latitudeFilter === -200 || longitudeFilter === -200) {
    if (latitudePreference === -200 || longitudePreference === -200) {
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
      const radiusInKm = Math.max(...maxRadius) + addToRadiusKms;
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
    } else if (latitudePreference !== -200 && longitudePreference !== -200) {
      headerLocalisation = (
        <Text style={styles.localisationBold}>
          Activités autour de {cityPreference} (- {scopePreference}km )
        </Text>
      );

      // Coordinates of the center point
      centerLatitude = latitudePreference; // Example latitude
      centerLongitude = longitudePreference; // Example longitude

      // Radius in kilometers
      const radiusInKm = scopePreference + addToRadiusKms;

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
  } else if (latitudeFilter !== -200 && longitudeFilter !== -200) {
    headerLocalisation = (
      <Text style={styles.localisationBold}>
        Activités autour de {cityFilter} (- {scopeFilter}km )
      </Text>
    );

    // Coordinates of the center point
    centerLatitude = latitudeFilter; // Example latitude
    centerLongitude = longitudeFilter; // Example longitude

    // Radius in kilometers
    const radiusInKm = scopeFilter + addToRadiusKms;

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

  // console.log(`marker index : ${pressedMarkerIndex}`);

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

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.body}>
            {tempCity && (
              <Modal visible={modalVisible} animationType="fade" transparent>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TouchableOpacity
                      onPress={() => handleNewSearch()}
                      style={styles.modalButton}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.textModalButton}>
                        Nouvelle recherche sur :{"\n"}
                        {"\n"}
                        {tempCity.cityName} ({tempCity.cityPostalCode})
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleClose()}
                      style={styles.modalButtonClose}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.textModalButtonClose}>Fermer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}

            <MapView
              provider={PROVIDER_GOOGLE}
              ref={mapViewRef}
              style={styles.map}
              region={region}
              showsUserLocation
              onPress={handleMapPress}
              onLongPress={(e) => handleLongPress(e)}
            >
              {centerLatitude && centerLongitude && (
                <Marker
                  coordinate={{
                    latitude: centerLatitude,
                    longitude: centerLongitude,
                  }}
                  title={cityFilter}
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
        )}
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
  // textButton: {
  //   color: "#5669FF",
  //   fontWeight: "bold",
  //   fontSize: 16,
  // },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
  body: {
    flex: 1,
    width: "100%",
  },
  map: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    width: 210,
    height: 64,
    alignItems: "center",
    // marginTop: 10,
    paddingVertical: 8,
    backgroundColor: "#5669FF",
    borderRadius: 10,
  },
  textModalButton: {
    color: "#ffffff",
    height: 54,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  modalButtonClose: {
    width: 210,
    alignItems: "center",
    // marginTop: 10,
    paddingVertical: 8,
    backgroundColor: "#5669FF",
    borderRadius: 10,
  },
  textModalButtonClose: {
    color: "#ffffff",
    height: 20,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  errorActivitiesFetch: {
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
    position: "absolute",
    bottom: 50,
    backgroundColor: "transparent",
    alignItems: "center",
    width: "100%",
  },
});

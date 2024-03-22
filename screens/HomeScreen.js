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
import CardBig from "../components/CardBig";
import globalStyles from "../globalStyles";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { loadOrganizers } from "../reducers/organizers";
import { loadFavoriteActivities } from "../reducers/user";
import {
  importActivities,
  setLocationFilters,
  setLocationPreferences,
  setErrorActivitiesFetch,
  setErrorOrganizersFetch,
} from "../reducers/user";
import Organizers from "../components/Organizers";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Ionicons } from "@expo/vector-icons";
import HomeCategoryMedium from "../components/HomeCategoryMedium";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function HomeScreen({ navigation }) {
  const [suggestionsList, setSuggestionsList] = useState([]);
  const user = useSelector((state) => state.user.value);
  const organizers = useSelector((state) => state.organizers.value);
  const categories = ["Sport", "Musique", "Créativité", "Motricité", "Éveil"];

  // console.log("user: ", user);
  // console.log("user.filters: ", user.filters);
  // console.log("user.preferences: ", user.preferences);
  // console.log("user.errorActivitiesFetch: ", user.errorActivitiesFetch);
  // console.log("organizers: ", organizers);
  // console.log("user.errorOrganizersMsg: ", user.errorOrganizersMsg);

  const dispatch = useDispatch();

  useEffect(() => {
    // Execute when the component unmounts
    return () => {
      console.log("Unmount HomeScreen");
    };
  }, []);

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
            console.log("User coordinates available");
            console.log(
              "geolocalization coordinates: ",
              coordinates.latitude,
              coordinates.longitude
            );

            const response = await fetch(
              `https://geo.api.gouv.fr/communes?lat=${coordinates.latitude}&lon=${coordinates.longitude}&fields=nom,codesPostaux,centre`
            );
            const apiData = await response.json();
            const cityName = apiData[0].nom;
            console.log("Geolocalized cityName: ", cityName);

            // Set location details in user preferences if not defined -> indirectly set user location filters as default state
            // ToDo: Call fetch PUT /updatePreferences to update partially user preferences?
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
                console.log("Use geolocalization");
                console.log(
                  "geolocalization coordinates: ",
                  coordinates.latitude,
                  coordinates.longitude
                );

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
                      dispatch(setErrorActivitiesFetch(null));
                    !data.result &&
                      dispatch(importActivities([])) &&
                      dispatch(setErrorActivitiesFetch(data.error));
                    dispatch(
                      setLocationPreferences({
                        cityPreference: cityName,
                        latitudePreference: coordinates.latitude,
                        longitudePreference: coordinates.longitude,
                      })
                    );

                    dispatch(
                      setLocationFilters({
                        cityFilter: cityName,
                        latitudeFilter: coordinates.latitude,
                        longitudeFilter: coordinates.longitude,
                      })
                    );
                  });

                fetch(
                  `${BACKEND_ADDRESS}/organizers/geoloc/${scopeFilter}/${coordinates.longitude}/${coordinates.latitude}`
                )
                  .then((response) => response.json())
                  .then((data) => {
                    data.result &&
                      dispatch(loadOrganizers(data.organizers)) &&
                      dispatch(setErrorOrganizersFetch(null));
                    !data.result &&
                      dispatch(loadOrganizers([])) &&
                      dispatch(setErrorOrganizersFetch(data.error));
                  });
              } else if (
                user.preferences.latitudePreference !== -200 &&
                user.preferences.longitudePreference !== -200
              ) {
                console.log("Use preferences localization");
                console.log("user.preferences: ", user.preferences);

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
                      dispatch(setErrorActivitiesFetch(null));
                    !data.result &&
                      dispatch(importActivities([])) &&
                      dispatch(setErrorActivitiesFetch(data.error));
                    // data.result && setActivities(data.activities);
                  });

                fetch(
                  `${BACKEND_ADDRESS}/organizers/geoloc/${user.preferences.scopePreference}/${user.preferences.longitudePreference}/${user.preferences.latitudePreference}`
                )
                  .then((response) => response.json())
                  .then((data) => {
                    data.result &&
                      dispatch(loadOrganizers(data.organizers)) &&
                      dispatch(setErrorOrganizersFetch(null));
                    !data.result &&
                      dispatch(loadOrganizers([])) &&
                      dispatch(setErrorOrganizersFetch(data.error));
                  });
              }
            } else if (latitudeFilter !== -200 || longitudeFilter !== -200) {
              console.log("Use filters localization");
              console.log("user.filters: ", user.filters);

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
                    dispatch(setErrorActivitiesFetch(null));
                  !data.result &&
                    dispatch(importActivities([])) &&
                    dispatch(setErrorActivitiesFetch(data.error));
                  // data.result && setActivities(data.activities);
                });

              fetch(
                `${BACKEND_ADDRESS}/organizers/geoloc/${scopeFilter}/${longitudeFilter}/${latitudeFilter}`
              )
                .then((response) => response.json())
                .then((data) => {
                  data.result &&
                    dispatch(loadOrganizers(data.organizers)) &&
                    dispatch(setErrorOrganizersFetch(null));
                  !data.result &&
                    dispatch(loadOrganizers([])) &&
                    dispatch(setErrorOrganizersFetch(data.error));
                });
            }
            // }
          }
        } catch (error) {
          // console.error("Error obtaining user coordinates: ", error);
          console.log("Error obtaining user coordinates: ", error);
        }
      }

      // Check if the position is not obtained after a certain delay
      const delay = 1000; // Set your desired delay in milliseconds
      const timeoutId = setTimeout(() => {
        if (!isPositionObtained) {
          console.log("User coordinates unavailable");
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
                    dispatch(setErrorActivitiesFetch(null));
                  !data.result &&
                    dispatch(importActivities([])) &&
                    dispatch(setErrorActivitiesFetch(data.error));
                });

              fetch(`${BACKEND_ADDRESS}/organizers/nogeoloc`)
                .then((response) => response.json())
                .then((data) => {
                  data.result &&
                    dispatch(loadOrganizers(data.organizers)) &&
                    dispatch(setErrorOrganizersFetch(null));
                  !data.result &&
                    dispatch(loadOrganizers([])) &&
                    dispatch(setErrorOrganizersFetch(data.error));
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
                    dispatch(setErrorActivitiesFetch(null));
                  !data.result &&
                    dispatch(importActivities([])) &&
                    dispatch(setErrorActivitiesFetch(data.error));
                });

              fetch(
                `${BACKEND_ADDRESS}/organizers/geoloc/${user.preferences.scopePreference}/${user.preferences.longitudePreference}/${user.preferences.latitudePreference}`
              )
                .then((response) => response.json())
                .then((data) => {
                  data.result &&
                    dispatch(loadOrganizers(data.organizers)) &&
                    dispatch(setErrorOrganizersFetch(null));
                  !data.result &&
                    dispatch(loadOrganizers([])) &&
                    dispatch(setErrorOrganizersFetch(data.error));
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
                  dispatch(setErrorActivitiesFetch(null));
                !data.result &&
                  dispatch(importActivities([])) &&
                  dispatch(setErrorActivitiesFetch(data.error));
                // data.result && setActivities(data.activities);
              });

            fetch(
              `${BACKEND_ADDRESS}/organizers/geoloc/${scopeFilter}/${longitudeFilter}/${latitudeFilter}`
            )
              .then((response) => response.json())
              .then((data) => {
                data.result &&
                  dispatch(loadOrganizers(data.organizers)) &&
                  dispatch(setErrorOrganizersFetch(null));
                !data.result &&
                  dispatch(loadOrganizers([])) &&
                  dispatch(setErrorOrganizersFetch(data.error));
              });
          }
        }
      }, delay);

      // Cleanup the timeout when the component unmounts or when the position is obtained
      return () => {
        clearTimeout(timeoutId);
      };
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

  const handleSelectItem = (item) => {
    item &&
      dispatch(
        setLocationFilters({
          cityFilter: item.cityName,
          longitudeFilter: item.coords[0],
          latitudeFilter: item.coords[1],
        })
      ) &&
      navigation.navigate("ListResults");
  };

  const onClearPress = () => {
    setSuggestionsList(null);
  };

  const handlePressFilters = () => {
    navigation.navigate("Filters");
  };

  const categoryList = categories.map((category, i) => {
    return <HomeCategoryMedium key={i} category={category} />;
  });

  const organizersMax10 =
    organizers.length > 10 ? organizers.slice(0, 10) : organizers;
  // console.log("organizersMax10: ", organizersMax10);
  const organizersList = organizersMax10.map((data, i) => {
    return <Organizers key={i} {...data} />;
  });

  const activitiesListMax15 =
    user.activities.length > 15
      ? user.activities.slice(0, 15)
      : user.activities;
  const activitiesList = activitiesListMax15.map((activity, i) => {
    return <CardBig key={i} activity={activity} />;
  });

  let headerLocalisation;
  let activitiesSectionTitle;
  if (
    user.filters.latitudeFilter === -200 ||
    user.filters.longitudeFilter === -200
  ) {
    if (
      user.preferences.latitudePreference === -200 ||
      user.preferences.longitudePreference === -200
    ) {
      headerLocalisation = <Text style={styles.localisationBold}>France</Text>;
      activitiesSectionTitle = (
        <View style={styles.activitiesSectionContainer}>
          <Text style={globalStyles.title3}>Bientôt</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ListResults")}
            style={styles.seeAllActivities}
            activeOpacity={0.8}
          >
            <Text style={styles.seeAllTitle}>Voir tout</Text>
            <Ionicons name="caret-forward-outline" size={16} color="#b8b6be" />
          </TouchableOpacity>
        </View>
      );
    } else if (
      user.preferences.latitudePreference !== -200 &&
      user.preferences.longitudePreference !== -200
    ) {
      headerLocalisation = (
        <Text style={styles.localisationBold}>
          {user.preferences.scopePreference}km autour de{" "}
          {user.preferences.cityPreference}
        </Text>
      );
      activitiesSectionTitle = (
        <View style={styles.activitiesSectionContainer}>
          <Text style={globalStyles.title3}>Près de chez vous</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ListResults")}
            style={styles.seeAllActivities}
            activeOpacity={0.8}
          >
            <Text style={styles.seeAllTitle}>Voir tout</Text>
            <Ionicons name="caret-forward-outline" size={16} color="#b8b6be" />
          </TouchableOpacity>
        </View>
      );
    }
  } else if (
    user.filters.latitudeFilter !== -200 &&
    user.filters.longitudeFilter !== -200
  ) {
    headerLocalisation = (
      <Text style={styles.localisationBold}>
        {user.filters.scopeFilter}km autour de {user.filters.cityFilter}
      </Text>
    );
    activitiesSectionTitle = (
      <View style={styles.activitiesSectionContainer}>
        <Text style={globalStyles.title3}>Près de chez vous</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ListResults")}
          style={styles.seeAllActivities}
          activeOpacity={0.8}
        >
          <Text style={styles.seeAllTitle}>Voir tout</Text>
          <Ionicons name="caret-forward-outline" size={16} color="#b8b6be" />
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/activities/allfavorites/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        data.result && dispatch(loadFavoriteActivities(data.activities));
      });
  }, []);

  return (
    // <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <Text style={styles.localisation}>Localisation</Text>
        {headerLocalisation}
        <View style={styles.search}>
          <View style={styles.searchBar}>
            <Ionicons name="location-outline" size={24} color="#7887FF" />
            <AutocompleteDropdown
              onChangeText={(value) => searchCity(value)}
              onSelectItem={(item) => handleSelectItem(item)}
              dataSet={suggestionsList}
              suggestionsListMaxHeight={Dimensions.get("window").height * 0.45}
              onClear={onClearPress}
              textInputProps={{
                placeholder: "Rechercher un lieu...",
                style: {
                  color: "#5669FF",
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
        <ScrollView style={styles.listActivities}>
          <Text style={globalStyles.title3}>Catégories</Text>
          <ScrollView horizontal={true} style={styles.organizers}>
            {categoryList}
          </ScrollView>
          {activitiesSectionTitle}
          {user.errorActivitiesFetch ? (
            <Text style={styles.errorActivitiesFetch}>
              {user.errorActivitiesFetch}
            </Text>
          ) : (
            <></>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
          >
            {activitiesList}
          </ScrollView>

          <Text style={globalStyles.title3}>Organisateurs</Text>
          {user.errorOrganizersMsg ? (
            <Text style={styles.errorActivitiesFetch}>
              {user.errorOrganizersMsg}
            </Text>
          ) : (
            <></>
          )}
          <ScrollView horizontal={true} style={styles.organizers}>
            {organizersList}
          </ScrollView>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  localisation: {
    marginTop: 50,
    color: "white",
  },
  localisationBold: {
    marginTop: 4,
    marginBottom: 24,
    color: "white",
    fontWeight: "bold",
  },
  organizers: {
    marginLeft: 10,
    gap: 8,
    // flex: 0.33,
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
    // height: "100%",
  },
  activitiesSectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAllActivities: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 30,
    marginRight: 16,
  },
  seeAllTitle: {
    color: "#b8b6be",
    fontWeight: "bold",
  },
  errorActivitiesFetch: {
    marginTop: 24,
    marginHorizontal: 20,
    width: "90%",
    lineHeight: 25,
  },
  scrollView: {
    paddingHorizontal: 10,
    // marginTop: 20,
  },
  searchContainer: {
    // marginTop: 50,
    flex: 0.2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4A43EC",
    width: "100%",
    paddingBottom: 20,
    borderBottomRightRadius: 33,
    borderBottomLeftRadius: 33,
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
    paddingRight: 10,
    borderRadius: 12,
    backgroundColor: "white",
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

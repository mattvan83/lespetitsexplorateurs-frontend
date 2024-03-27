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
  ActivityIndicator,
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
  const [geolocation, setGeolocation] = useState(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isLoadingOrganizers, setIsLoadingOrganizers] = useState(true);

  // console.log("user: ", user);
  // console.log("user.filters: ", user.filters);
  // console.log("user.preferences: ", user.preferences);
  // console.log("user.errorActivitiesFetch: ", user.errorActivitiesFetch);
  // console.log("organizers: ", organizers);
  // console.log("user.errorOrganizersFetch: ", user.errorOrganizersFetch);
  // console.log("geolocation: ", geolocation);

  const dispatch = useDispatch();

  useEffect(() => {
    // Execute when the component unmounts
    return () => {
      console.log("Unmount HomeScreen");
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Permission geolocation status: ", status);

      if (status === "granted") {
        try {
          const {
            coords: { latitude, longitude },
          } = await Location.getCurrentPositionAsync();

          setGeolocation({ latitude, longitude });
        } catch (error) {
          // console.error("Error obtaining user geolocation: ", error.message);
          console.log("Error obtaining user geolocation: ", error.message);
          setGeolocation(undefined);
        }
      }
    })();
  }, []);

  // useEffect to manage fetch of activities at each update of geolocation
  useEffect(() => {
    (async () => {
      // Test if geolocation has been obtained
      if (geolocation) {
        try {
          // console.log("User geolocation available");
          console.log("User geolocation: ", geolocation);
          const { latitude, longitude } = geolocation;

          const response = await fetch(
            `https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=nom,codesPostaux,centre`
          );
          const apiData = await response.json();
          const cityName = apiData[0].nom;
          console.log("Geolocation cityName: ", cityName);

          // Set location details in user preferences if not defined -> indirectly set user location filters as default state
          // ToDo: Call fetch PUT /updatePreferences to update partially user preferences?

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
            // Case where filters location has been cleared and no preferences location is defined
            if (latitudePreference === -200 || longitudePreference === -200) {
              console.log("Use geolocation");

              const response = await fetch(
                `${BACKEND_ADDRESS}/activities/geoloc`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    token,
                    latitude,
                    longitude,
                    scope: scopeFilter,
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
                dispatch(setErrorActivitiesFetch(null));
              !data.result &&
                dispatch(importActivities([])) &&
                dispatch(setErrorActivitiesFetch(data.error));
              dispatch(
                setLocationPreferences({
                  cityPreference: cityName,
                  latitudePreference: latitude,
                  longitudePreference: longitude,
                })
              );

              dispatch(
                setLocationFilters({
                  cityFilter: cityName,
                  latitudeFilter: latitude,
                  longitudeFilter: longitude,
                })
              );
              // Case where filters location has been cleared and preferences location is defined
            } else if (
              latitudePreference !== -200 &&
              longitudePreference !== -200
            ) {
              console.log("Use preferences location");
              console.log("user.preferences: ", user.preferences);

              const response = await fetch(
                `${BACKEND_ADDRESS}/activities/geoloc`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    token,
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
                dispatch(setErrorActivitiesFetch(null));
              !data.result &&
                dispatch(importActivities([])) &&
                dispatch(setErrorActivitiesFetch(data.error));
            }
            // Case where filters location is defined
          } else if (latitudeFilter !== -200 || longitudeFilter !== -200) {
            console.log("Use filters location");
            console.log("user.filters: ", user.filters);

            const response = await fetch(
              `${BACKEND_ADDRESS}/activities/geoloc`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  token,
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
              }
            );
            const data = await response.json();
            data.result &&
              dispatch(importActivities(data.activities)) &&
              dispatch(setErrorActivitiesFetch(null));
            !data.result &&
              dispatch(importActivities([])) &&
              dispatch(setErrorActivitiesFetch(data.error));

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
        } catch (error) {
          console.error(error.message);
          setErrorActivitiesFetch(error.message);
        } finally {
          setIsLoadingActivities(false);
        }
      } else if (geolocation === undefined) {
        try {
          // console.log("User geolocation unavailable");

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
            // Case where filters location has been cleared and no preferences location is defined
            if (latitudePreference === -200 || longitudePreference === -200) {
              const response = await fetch(
                `${BACKEND_ADDRESS}/activities/nogeoloc`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    token,
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
                dispatch(setErrorActivitiesFetch(null));
              !data.result &&
                dispatch(importActivities([])) &&
                dispatch(setErrorActivitiesFetch(data.error));

              // Case where filters location has been cleared and preferences location is defined
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
                    token,
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
                dispatch(setErrorActivitiesFetch(null));
              !data.result &&
                dispatch(importActivities([])) &&
                dispatch(setErrorActivitiesFetch(data.error));
            } else if (latitudeFilter !== -200 || longitudeFilter !== -200) {
              const response = await fetch(
                `${BACKEND_ADDRESS}/activities/geoloc`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    token,
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
                }
              );
              const data = await response.json();
              data.result &&
                dispatch(importActivities(data.activities)) &&
                dispatch(setErrorActivitiesFetch(null));
              !data.result &&
                dispatch(importActivities([])) &&
                dispatch(setErrorActivitiesFetch(data.error));

              // }, delay);

              // // Cleanup the timeout when the component unmounts or when the position is obtained
              // return () => {
              //   clearTimeout(timeoutId);
              // };
            }
          }
        } catch (error) {
          console.error(error.message);
          setErrorActivitiesFetch(error.message);
        } finally {
          setIsLoadingActivities(false);
        }
      }
    })();
  }, [geolocation]);

  // useEffect to manage fetch of organizers at each update of geolocation
  useEffect(() => {
    (async () => {
      // Test if geolocation has been obtained
      if (geolocation) {
        try {
          // console.log("User geolocation available");
          // console.log("User geolocation: ", geolocation);
          const { latitude, longitude } = geolocation;

          // Get user preferences, filters
          const { latitudePreference, longitudePreference, scopePreference } =
            user.preferences;

          const { latitudeFilter, longitudeFilter, scopeFilter } = user.filters;

          if (latitudeFilter === -200 || longitudeFilter === -200) {
            // Case where filters location has been cleared and no preferences location is defined
            if (latitudePreference === -200 || longitudePreference === -200) {
              const response = await fetch(
                `${BACKEND_ADDRESS}/organizers/geoloc/${scopeFilter}/${longitude}/${latitude}`
              );
              const data = await response.json();
              data.result &&
                dispatch(loadOrganizers(data.organizers)) &&
                dispatch(setErrorOrganizersFetch(null));
              !data.result &&
                dispatch(loadOrganizers([])) &&
                dispatch(setErrorOrganizersFetch(data.error));
              // Case where filters location has been cleared and preferences location is defined
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
            // Case where filters location is defined
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
        } finally {
          setIsLoadingOrganizers(false);
        }
      } else if (geolocation === undefined) {
        try {
          // console.log("User geolocation unavailable");

          // Get user preferences, filters
          const { latitudePreference, longitudePreference, scopePreference } =
            user.preferences;

          const { latitudeFilter, longitudeFilter, scopeFilter } = user.filters;

          if (latitudeFilter === -200 || longitudeFilter === -200) {
            // Case where filters location has been cleared and no preferences location is defined
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
              // Case where filters location has been cleared and preferences location is defined
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
            // Case where filters location is defined
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
        } finally {
          setIsLoadingOrganizers(false);
        }
      }
    })();
  }, [geolocation]);

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
    navigation.navigate("Filters", { previousScreen: "Explorer" });
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
  let activitiesSectionTitle;
  if (latitudeFilter === -200 || longitudeFilter === -200) {
    if (latitudePreference === -200 || longitudePreference === -200) {
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
    } else if (latitudePreference !== -200 && longitudePreference !== -200) {
      headerLocalisation = (
        <Text style={styles.localisationBold}>
          {scopePreference}km autour de {cityPreference}
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
  } else if (latitudeFilter !== -200 && longitudeFilter !== -200) {
    headerLocalisation = (
      <Text style={styles.localisationBold}>
        {scopeFilter}km autour de {cityFilter}
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
      {isLoadingActivities || isLoadingOrganizers ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <View style={styles.explorerContainer}>
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
                  suggestionsListMaxHeight={
                    Dimensions.get("window").height * 0.45
                  }
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
              {user.errorOrganizersFetch ? (
                <Text style={styles.errorActivitiesFetch}>
                  {user.errorOrganizersFetch}
                </Text>
              ) : (
                <></>
              )}
              <ScrollView horizontal={true} style={styles.organizers}>
                {organizersList}
              </ScrollView>
            </ScrollView>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  explorerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
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

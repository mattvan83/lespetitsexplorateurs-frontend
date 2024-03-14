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
// import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import globalStyles from "../globalStyles";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { loadOrganizers } from "../reducers/organizers";
import {
  addCurrentLocation,
  importActivities,
  setLocationFilters,
  setErrorMsg,
  setErrorOrganizersMsg,
  setCategoryFilters,
} from "../reducers/user";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ListResultsScreen({ navigation, route }) {
  const { category } = route.params ? route.params : { category: null };

  const user = useSelector((state) => state.user.value);
  const userFilters = useSelector((state) => state.user.value.filters);
  const [suggestionsList, setSuggestionsList] = useState([]);

  console.log("user.filters: ", userFilters);
  console.log("category: ", category);

  const dispatch = useDispatch();

  useEffect(() => {
    // Execute when the component unmounts
    return () => {
      console.log("Unmount ListResultsScreen");
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
    //   console.log("Unmount ListResultsScreen");
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
            dispatch(setErrorMsg(null));
          !data.result &&
            dispatch(importActivities([])) &&
            dispatch(setErrorMsg(data.error));
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

  const handlePressGoBackButton = () => {
    if (category) {
      dispatch(setCategoryFilters([]));

      // Get user filters
      const {
        latitudeFilter,
        longitudeFilter,
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
                categoryFilter: [],
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
                categoryFilter: [],
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
              categoryFilter: [],
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
    }

    navigation.navigate("TabNavigator", { screen: "Explorer" });
  };

  const onClearPress = () => {
    setSuggestionsList(null);
  };

  const handlePressFilters = () => {
    navigation.navigate("Filters");
  };

  const activitiesList = user.activities.map((activity, i) => {
    return <Card key={i} activity={activity} />;
  });

  let headerLocalisation;
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
    } else if (
      user.preferences.latitudePreference !== -200 &&
      user.preferences.longitudePreference !== -200
    ) {
      headerLocalisation = (
        <Text style={styles.localisationBold}>
          Activités autour de {user.preferences.cityPreference} (-{" "}
          {user.preferences.scopePreference}km)
        </Text>
      );
    }
  } else if (
    user.filters.latitudeFilter !== -200 &&
    user.filters.longitudeFilter !== -200
  ) {
    headerLocalisation = (
      <Text style={styles.localisationBold}>
        Activités autour de {user.filters.cityFilter} (-{" "}
        {user.filters.scopeFilter}km)
      </Text>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              onPress={() => handlePressGoBackButton()}
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
          <View style={styles.listActivities}>
            {user.errorMsg ? (
              <Text style={styles.errorMsg}>{user.errorMsg}</Text>
            ) : (
              <></>
            )}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}
            >
              {activitiesList}
            </ScrollView>
          </View>
          <View style={styles.mapButtonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("MapResults")}
              style={styles.mapButton}
              activeOpacity={0.8}
            >
              <Ionicons name="map-outline" size={24} color="#fff" />
              <Text style={styles.textMapButton}>Carte</Text>
            </TouchableOpacity>
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
    // alignItems: "center",
    width: "100%",
  },
  header: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 30,
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
  arrow: {
    marginTop: 35,
    marginLeft: 20,
    alignSelf: "flex-start",
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
  listActivities: {
    height: "100%",
  },
  errorMsg: {
    marginTop: 24,
    marginHorizontal: 20,
    width: "90%",
    lineHeight: 25,
  },
  scrollView: {
    paddingBottom: 70,
  },
  card: {
    marginRight: 100,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    // backgroundColor: "#4A43EC",
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
  mapButtonContainer: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
    bottom: 25,
  },
  mapButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    // height: 58,
    backgroundColor: "#5669FF",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "32%",
  },
  textMapButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    // textTransform: "uppercase",
  },
});

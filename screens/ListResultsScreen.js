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
// import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import globalStyles from "../globalStyles";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { loadOrganizers } from "../reducers/organizers";
import {
  importActivities,
  setLocationFilters,
  setErrorActivitiesFetch,
  setErrorOrganizersFetch,
  setCategoryFilters,
} from "../reducers/user";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFetchActivities } from "../hooks/useFetchActivities"; // Import custom hook for fetching activities
import { useFetchOrganizers } from "../hooks/useFetchOrganizers"; // Import custom hook for fetching organizers

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ListResultsScreen({ navigation, route }) {
  const { category } = route.params ? route.params : { category: null };

  const user = useSelector((state) => state.user.value);
  const [suggestionsList, setSuggestionsList] = useState([]);
  const { isLoadingActivities, fetchActivities } = useFetchActivities(
    user,
    "ListResults"
  );
  const { isLoadingOrganizers } = useFetchOrganizers(user);

  // console.log("user.filters: ", user.filters);
  // console.log("user.preferences: ", user.preferences);
  // console.log("category: ", category);

  const dispatch = useDispatch();

  useEffect(() => {
    // Execute when the component unmounts
    return () => {
      console.log("Unmount ListResultsScreen");
    };
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

  const handlePressGoBackButton = async () => {
    if (category) {
      dispatch(setCategoryFilters([]));
      await fetchActivities(user, "ListResults", true);
    }
    navigation.navigate("TabNavigator", { screen: "Explorer" });
  };

  const onClearPress = () => {
    setSuggestionsList(null);
  };

  const handlePressFilters = () => {
    navigation.navigate("Filters", { previousScreen: "ListResults" });
  };

  const activitiesList = user.activities.map((activity, i) => {
    return <Card key={i} activity={activity} />;
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
  if (latitudeFilter === -200 || longitudeFilter === -200) {
    if (latitudePreference === -200 || longitudePreference === -200) {
      headerLocalisation = (
        <Text style={styles.localisationBold}>Activités en France</Text>
      );
    } else if (latitudePreference !== -200 && longitudePreference !== -200) {
      headerLocalisation = (
        <Text style={styles.localisationBold}>
          Activités autour de {cityPreference} (- {scopePreference}km)
        </Text>
      );
    }
  } else if (latitudeFilter !== -200 && longitudeFilter !== -200) {
    headerLocalisation = (
      <Text style={styles.localisationBold}>
        Activités autour de {cityFilter} (- {scopeFilter}km)
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

        {isLoadingActivities || isLoadingOrganizers ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : user.errorActivitiesFetch ? (
          <View style={styles.body}>
            <Text style={styles.errorActivitiesFetch}>
              {user.errorActivitiesFetch}
            </Text>
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
        ) : (
          <View style={styles.body}>
            <View style={styles.listActivities}>
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
        )}
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
  listActivities: {
    height: "100%",
  },
  errorActivitiesFetch: {
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

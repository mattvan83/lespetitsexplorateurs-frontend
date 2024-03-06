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
import {
  addCurrentLocation,
  importActivities,
  setCitySearched,
} from "../reducers/user";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";

const BACKEND_ADDRESS = "http://192.168.1.20:3000";

export default function ListResultsScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const [suggestionsList, setSuggestionsList] = useState([]);

  console.log("user.citySearched: ", user.citySearched);

  const dispatch = useDispatch();

  useEffect(() => {
    fetch(
      `${BACKEND_ADDRESS}/activities/geoloc/${user.token}/${user.citySearched.latitude}/${user.citySearched.longitude}`
    )
      .then((response) => response.json())
      .then((data) => {
        data.result && dispatch(importActivities(data.activities));
      });
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
      dispatch(setCitySearched(item));

      fetch(
        `${BACKEND_ADDRESS}/activities/geoloc/${user.token}/${item.coords[1]}/${item.coords[0]}`
      )
        .then((response) => response.json())
        .then((data) => {
          data.result && dispatch(importActivities(data.activities));
        });
    }
  };

  const onClearPress = () => {
    setSuggestionsList(null);
  };

  const handlePressFilters = () => {
    navigation.navigate("Filters");
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
          <AutocompleteDropdown
            onChangeText={(value) => searchCity(value)}
            onSelectItem={(item) => handleSelectItem(item)}
            dataSet={suggestionsList}
            suggestionsListMaxHeight={Dimensions.get("window").height * 0.45}
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
          <TouchableOpacity
            onPress={() => handlePressFilters()}
            style={styles.filtersButton}
            activeOpacity={0.8}
          >
            {/* <SvgUri
            width="28"
            height="28"
            source={require("../assets/icons/search-filters-darker.svg")}
          /> */}
            <Text style={styles.textButton}>Filtres</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={styles.listActivities}>
            <ScrollView
              showsVerticalScrollIndicator={false}
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#4A43EC",
    width: "100%",
  },
  filtersButton: {
    width: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#EBEDFF",
    borderRadius: 100,
    padding: 6,
    marginRight: "25%",
    marginTop: "15%",
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
  dropdownContainer: {
    width: "100%",
    // marginBottom: 20,
  },
  inputContainer: {
    width: "70%",
    marginTop: "15%",
    marginLeft: "25%",
    // borderWidth: 1,
    // borderColor: "#51e181",
    // backgroundColor: "#ffffff",
  },
  suggestionListContainer: {
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.97)",
  },
  listActivities: {
    height: "100%",
  },
  scrollView: {
    paddingBottom: 20,
  },
  card: {
    marginRight: 100,
  },
});

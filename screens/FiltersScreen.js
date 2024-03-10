import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "../reducers/user";
import globalStyles from "../globalStyles";
import Slider from "@react-native-community/slider";
import FilterCategoryMedium from "../components/FilterCategoryMedium";
import InputLocalisation from "../components/InputLocalisation";
import { handleFilterButtonClick } from "../modules/handleFilterButtonClick";

export default function FiltersScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [price, setPrice] = useState(30);
  const [scope, setScope] = useState(user.preferences.scopePreference);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedMoments, setSelectedMoments] = useState([]);
  const [selectedAges, setSelectedAges] = useState(
    user.preferences.agePreference
  );
  const [selectedCity, setSelectedCity] = useState(user.filters.cityFilter);
  const [selectedLongitude, setSelectedLongitude] = useState(
    user.filters.longitudeFilter
  );
  const [selectedLatitude, setSelectedLatitude] = useState(
    user.filters.latitudeFilter
  );

  const categories = ["Sport", "Musique", "Créativité", "Motricité", "Éveil"];
  const dateFilters = ["Aujourd'hui", "Demain", "Cette semaine", "Ce week-end"];
  const momentFilters = ["Matin", "Après-midi", "Soir"];
  const ageFilters = ["3-12 mois", "1-3 ans", "3-6 ans", "6-10 ans", "10+ ans"];

  const handleCategoryList = (category) => {
    handleFilterButtonClick(
      category,
      selectedCategories,
      setSelectedCategories
    );
  };

  const categoryList = categories.map((category, i) => {
    const isActive = selectedCategories.includes(category);
    return (
      <FilterCategoryMedium
        key={i}
        category={category}
        handleCategoryList={handleCategoryList}
        isActive={isActive}
      />
    );
  });

  const dateList = dateFilters.map((dateCategory, i) => {
    return (
      <View
        key={i}
        style={
          selectedDates.includes(dateCategory)
            ? styles.activeFilter
            : styles.inactiveFilter
        }
      >
        <TouchableOpacity
          onPress={() =>
            handleFilterButtonClick(
              dateCategory,
              selectedDates,
              setSelectedDates
            )
          }
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text
            style={
              selectedDates.includes(dateCategory)
                ? styles.activeFilterText
                : styles.inactiveFilterText
            }
          >
            {dateCategory}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  const momentList = momentFilters.map((moment, i) => {
    return (
      <View
        key={i}
        style={
          selectedMoments.includes(moment)
            ? styles.activeFilter
            : styles.inactiveFilter
        }
      >
        <TouchableOpacity
          onPress={() =>
            handleFilterButtonClick(moment, selectedMoments, setSelectedMoments)
          }
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text
            style={
              selectedMoments.includes(moment)
                ? styles.activeFilterText
                : styles.inactiveFilterText
            }
          >
            {moment}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  const ageList = ageFilters.map((age, i) => {
    return (
      <View
        key={i}
        style={
          selectedAges.includes(age)
            ? styles.activeFilter
            : styles.inactiveFilter
        }
      >
        <TouchableOpacity
          onPress={() =>
            handleFilterButtonClick(age, selectedAges, setSelectedAges)
          }
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text
            style={
              selectedAges.includes(age)
                ? styles.activeFilterText
                : styles.inactiveFilterText
            }
          >
            {age}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedDates([]);
    setSelectedMoments([]);
    setSelectedAges([]);
    setPrice(30);
    setSelectedLongitude(null);
    setSelectedLatitude(null);
    setSelectedCity(null);
    setScope(50);

    dispatch(resetFilters());
  };

  const handleSetFilters = () => {
    dispatch(
      setFilters({
        categoryFilter: selectedCategories,
        dateFilter: selectedDates,
        momentFilter: selectedMoments,
        ageFilter: selectedAges,
        priceFilter: price,
        cityFilter: selectedCity,
        longitudeFilter: selectedLongitude,
        latitudeFilter: selectedLatitude,
        scopeFilter: scope,
      })
    );
    navigation.navigate("ListResults");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.filtersContainer}>
        <Text style={globalStyles.title2}>Filtres</Text>

        <Text style={globalStyles.title4}>Catégories</Text>
        <ScrollView horizontal={true} style={styles.categoryFilters}>
          {categoryList}
        </ScrollView>

        <Text style={globalStyles.title4}>Date</Text>
        <ScrollView horizontal={true} style={styles.filters}>
          {dateList}
        </ScrollView>

        <Text style={globalStyles.title4}>Moment de la journée</Text>
        <ScrollView horizontal={true} style={styles.filters}>
          {momentList}
        </ScrollView>

        <Text style={globalStyles.title4}>Tranche d'âge</Text>
        <ScrollView horizontal={true} style={styles.filters}>
          {ageList}
        </ScrollView>

        <Text style={globalStyles.title4}>Prix : 0 - {price} €</Text>
        <Slider
          style={styles.slider}
          lowerLimit={0}
          minimumValue={0}
          maximumValue={30}
          upperLimit={30}
          minimumTrackTintColor="#5669FF"
          maximumTrackTintColor="#E7E7E9"
          step={1}
          value={price}
          onValueChange={(value) => setPrice(value)}
        />
        <View style={styles.sliderBottom}>
          <Text style={styles.textSlider}>0€</Text>
          <Text style={styles.textSlider}>30€</Text>
        </View>

        <Text style={globalStyles.title4}>Localisation</Text>
        <InputLocalisation
          setSelectedCity={setSelectedCity}
          selectedCity={selectedCity}
          setSelectedLongitude={setSelectedLongitude}
          setSelectedLatitude={setSelectedLatitude}
        />

        <Text style={globalStyles.title4}>Dans un rayon de {scope}km</Text>
        <Slider
          style={styles.slider}
          lowerLimit={1}
          minimumValue={1}
          maximumValue={50}
          upperLimit={50}
          value={scope}
          minimumTrackTintColor="#5669FF"
          maximumTrackTintColor="#E7E7E9"
          step={1}
          onValueChange={(value) => setScope(value)}
        />
        <View style={styles.sliderBottom}>
          <Text style={styles.textSlider}>1km</Text>
          <Text style={styles.textSlider}>50km</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => handleResetFilters()}
          style={styles.eraseButton}
          activeOpacity={0.8}
        >
          <Text style={styles.eraseTextButton}>EFFACER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSetFilters()}
          style={styles.applyButton}
          activeOpacity={0.8}
        >
          <Text style={styles.applyTextButton}>APPLIQUER</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  filtersContainer: {
    flex: 1,
    height: "70%",
  },
  categoryFilters: {
    marginLeft: 10,
  },
  filters: {
    marginLeft: 20,
  },
  inactiveFilter: {
    marginTop: 20,
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  inactiveFilterText: {
    color: "#120D26",
    fontSize: 16,
  },
  activeFilter: {
    marginTop: 20,
    marginRight: 14,
    backgroundColor: "#5669FF",
    borderRadius: 10,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  activeFilterText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    alignSelf: "center",
    bottom: 0,
    backgroundColor: "white",
    borderTopColor: "#E6E6E6",
    borderTopWidth: 1,
    height: 110,
    width: "100%",
  },
  eraseButton: {
    padding: 10,
    width: "30%",
    height: 58,
    borderColor: "#E6E6E6",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  eraseTextButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#120D26",
    textTransform: "uppercase",
  },
  applyButton: {
    padding: 10,
    width: "60%",
    height: 58,
    backgroundColor: "#5669FF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  applyTextButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  slider: {
    width: "90%",
    height: 40,
    alignSelf: "center",
  },
  sliderBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  textSlider: {
    fontSize: 14,
    color: "#8A8AA3",
  },
});

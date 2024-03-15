import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import globalStyles from "../globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { addActivityInfoScreen2 } from "../reducers/activities";
import { useState, useEffect } from "react";
import FilterTextCategory from "../components/FilterTextCategory";
import { handleFilterButtonClick } from "../modules/handleFilterButtonClick";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Slider from "@react-native-community/slider";
const { invertMappingTable } = require("../modules/invertMapping");

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.activities.value);
  const [price, setPrice] = useState(0);
  // CF below for concernedAges
  const [showError, setShowError] = useState(false);

  const ageCategory = [
    "3-12 mois",
    "1-3 ans",
    "3-6 ans",
    "6-10 ans",
    "10+ ans",
  ];

  const ageMapping = {
    "3-12 mois": "3_12months",
    "1-3 ans": "1_3years",
    "3-6 ans": "3_6years",
    "6-10 ans": "6_10years",
    "10+ ans": "10+years",
  };
  const ages = [];
  for (let element of activities.concernedAges) {
    ages.push(ageMapping[element]);
  }
  const backToFrontAgeMapping = invertMappingTable(ageMapping);

  frontConcernedAges = activities.concernedAges.map(
    (age) => backToFrontAgeMapping[age]
  );

  const [selectedAges, setSelectedAges] = useState(
    activities.isCurrentlyUpdated ? frontConcernedAges : []
  );

  const handleAgeList = (category) => {
    handleFilterButtonClick(category, selectedAges, setSelectedAges);
  };

  const ageList = ageCategory.map((category, i) => {
    const isActive = selectedAges.includes(category);
    return (
      <FilterTextCategory
        key={i}
        category={category}
        style={styles.box}
        handleCategoryList={handleAgeList}
        isActive={isActive}
      />
    );
  });

  const handleContinue = () => {
    if (selectedAges.length !== 0) {
      // console.log(price)
      dispatch(
        addActivityInfoScreen2({ concernedAges: selectedAges, price: price })
      );
      // console.log('Ages: ', selectedAges);
      navigation.navigate("ActivityPart3");
    } else {
      setShowError(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.filtersContainer}>
        <FontAwesome
          name={"arrow-left"}
          color={"black"}
          size={20}
          style={styles.arrow}
          onPress={() => navigation.goBack()}
        />

        <Text style={styles.title2}>Dites-nous en plus !</Text>

        <Text style={globalStyles.title4}>Âge du public concerné</Text>
        <View style={styles.filters}>{ageList}</View>

        <Text style={globalStyles.title4}>Prix de l'activité : {price} €</Text>
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

        {showError && (
          <Text style={styles.error}>Tous les champs sont requis.</Text>
        )}
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => handleContinue()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Continuer</Text>
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
  arrow: {
    marginTop: 50,
    marginLeft: 20,
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#120D26",
    marginTop: 45,
    marginLeft: 20,
  },
  filtersContainer: {
    flex: 0.9,
  },
  filters: {
    marginLeft: 20,
  },
  error: {
    color: "red",
    fontWeight: "bold",
    margin: 15,
  },
  textButton: {
    color: "#5669FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: "#120D26",
    marginTop: 12,
    marginLeft: 20,
  },
  bottom: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flex: 0.1,
  },
  button: {
    padding: 10,
    width: "70%",
    height: 58,
    backgroundColor: "#5669FF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  textButton: {
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

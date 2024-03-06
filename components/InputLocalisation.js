import {
  StyleSheet,
  View,
} from "react-native";
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";


export default function InputLocalisation({ setSelectedCity, selectedCity, setSelectedLatitude, setSelectedLongitude }) {
  const [dataSet, setDataSet] = useState([]);

  const handleSubmit = (item) => {
    setSelectedCity(item.cityName);
    setSelectedLatitude(item.coords[1]);
    setSelectedLongitude(item.coords[0]);
  }

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
            region: data.region.name,
            coords: data.centre.coordinates,
          };
        });
        setDataSet(suggestions);
      });
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.search}>
        <View style={styles.searchBar}>
          <Ionicons name="location-outline" size={24} color="#D0CFD4" />
          <AutocompleteDropdown
            onChangeText={(value) => searchCity(value)}
            onSelectItem={(item) =>
              item && handleSubmit(item)
            }
            dataSet={dataSet}
            textInputProps={{
              placeholder: selectedCity === null ? "Saisissez une ville..." : selectedCity,
            }}
            inputContainerStyle={styles.inputContainer}
            containerStyle={styles.dropdownContainer}
            suggestionsListContainerStyle={styles.suggestionListContainer}
            rightButtonsContainerStyle={styles.rightButtonsContainerStyle}
            emptyResultText='Recherche infructueuse'
            closeOnSubmit
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: "center",
    marginTop: 20,
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
    backgroundColor: 'white',
    marginLeft: 5,
  },
  suggestionListContainer: {
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  rightButtonsContainerStyle: {
    backgroundColor: 'white',
  }
});

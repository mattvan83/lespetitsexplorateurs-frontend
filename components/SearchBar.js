import {
  StyleSheet,
  TextInput,
  Text,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import SvgUri from "react-native-svg-uri";

export default function SearchBar() {
  const handleSubmit = () => {};

  return (
    <View style={styles.searchContainer}>
      <View style={styles.search}>
        <View style={styles.searchBar}>
          <SvgUri
            width="28"
            height="28"
            source={require("../assets/icons/search-grey.svg")}
          />
          <TextInput
            style={styles.input}
            placeholder="Rechercher une activité..."
          />
        </View>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.filtersButton}
          activeOpacity={0.8}
        >
          <SvgUri
            width="28"
            height="28"
            source={require("../assets/icons/search-filters-darker.svg")}
          />
          <Text style={styles.textButton}>Filtres</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  search: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    height: 40,
    width: "90%",
  },
  searchBar: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    borderRadius: 12,
  },
  input: {
    width: "90%",
    color: "#747688",
    fontSize: 16,
    marginLeft: 10,
  },
  filtersButton: {
    width: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#EBEDFF",
    borderRadius: 100,
    padding: 6,
  },
  textButton: {
    color: "#5669FF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

import {
  StyleSheet,
  TextInput,
  Text,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import SvgUri from "react-native-svg-uri";

export default function InputLocalisation() {
  const handleSubmit = () => {};

  return (
    <View style={styles.searchContainer}>
      <View style={styles.search}>
        <View style={styles.searchBar}>
          <SvgUri
            width="24"
            height="24"
            source={require("../assets/icons/filter-pin.svg")}
          />
          <TextInput
            style={styles.input}
            placeholder="Saisissez une ville..."
          />
        </View>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.geolocButton}
          activeOpacity={0.8}
        >
          <SvgUri
            width="28"
            height="28"
            source={require("../assets/icons/filter-geoloc.svg")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: "center",
  },
  search: {
    flexDirection: "row",
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
    borderColor: "#E4dfdf",
    borderWidth: 1,
  },
  input: {
    width: "90%",
    color: "#747688",
    fontSize: 16,
    marginLeft: 10,
  },
  geolocButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5669FF",
    borderRadius: 8,
    padding: 4,
  },
});

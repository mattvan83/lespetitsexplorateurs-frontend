import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setCategoryFilters } from "../reducers/user";
import { useNavigation } from "@react-navigation/native";

export default function HomeCategoryMedium({ category }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSubmit = (category) => {
    dispatch(setCategoryFilters([category])) &&
      navigation.navigate("ListResults");
  };

  let icon = null;

  switch (category) {
    case "Sport":
      icon = "tennisball";
      color= "#EE544A";
      break;
    case "Musique":
      icon = "musical-notes";
      color= '#FFB459';
      break;
    case "Créativité":
      icon = "color-palette";
      color= "#39C3F2";
      break;
    case "Motricité":
      icon = "balloon";
      color= "#5669FF";
      break;
    case "Éveil":
      icon = "sparkles";
      color= "#FDC400";
      break;
    default:
      console.log(`${category} not found`);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleSubmit(category)}
        style={[styles.categoryButton, { backgroundColor: color }]}
        activeOpacity={0.8}
      >
        <Ionicons name={icon} size={35} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.textButton}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: 90,
    alignItems: "center",
  },
  categoryButton: {
    padding: 10,
    width: 64,
    height: 64,
    // borderWidth: 1,
    // borderColor: "#E6E6E6",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontSize: 16,
    color: "#120D26",
    marginTop: 8,
  },
});

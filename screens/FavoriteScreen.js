import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import globalStyles from '../globalStyles';

export default function FavoriteScreen({ navigation }) {
  const handleSubmit = () => {
    navigation.navigate("ActivitySheet");
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title2}>Mes favoris</Text>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Go to ActivitySheet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    justifyContent: "flex-start",
  },
});

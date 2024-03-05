import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import globalStyles from '../globalStyles';

export default function ActivitiesScreen({ navigation }) {
  const handleSubmit = () => {
    navigation.navigate("ActivityPart1");
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title2}>Activities Screen</Text>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}>
        <Text style={styles.textButton}>Go to Create an Activity</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
});

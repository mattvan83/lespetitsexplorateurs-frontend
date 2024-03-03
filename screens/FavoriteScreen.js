import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import globalStyles from '../globalStyles';

export default function FavoriteScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.title2}>Mes favoris</Text>
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

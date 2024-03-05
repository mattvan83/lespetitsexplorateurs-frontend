import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useSelector } from 'react-redux';

export default function ListResultsScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);

  console.log(user);
  
  return (
    <View style={styles.container}>
      <Text>Resultats de recherche</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

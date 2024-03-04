import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

export default function SignupScreen({ navigation }) {
  const handleSubmit = () => {
    navigation.navigate("TabNavigator");
  };

  return (
    
    <View style={styles.container}>
      <Text>Signup Screen</Text>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Go to TabNavigator</Text>
      </TouchableOpacity>
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
  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    marginTop: 30,
    backgroundColor: "#ec6e5b",
    borderRadius: 10,
    marginBottom: 80,
  },
  textButton: {
    color: "#ffffff",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
});

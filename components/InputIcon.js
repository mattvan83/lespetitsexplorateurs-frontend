import { StyleSheet, TextInput, View } from "react-native";

export default function InputIcon({ placeholder }) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.border}>
        <TextInput style={styles.input} placeholder={placeholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: "center",
  },
  border: {
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    borderColor: "#E4dfdf",
    borderWidth: 1,
    borderRadius: 12,
    margin: 13,
    width: "90%",
  },
  input: {
    width: "90%",
    height: 56,
    color: "#747688",
    fontSize: 14,
    marginLeft: 10,
  },
});

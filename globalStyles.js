import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  // TITLES
  title1: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#120D26",
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#120D26",
    marginTop: 24,
    marginLeft: 20,
  },
  title3: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#120D26",
    marginTop: 24,
    marginLeft: 20,
  },

  // FORMS
  labelInput: {
    textAlign: "left",
    marginLeft: 20,
    marginTop: 15,
  },
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
    margin: 6,
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

export default globalStyles;

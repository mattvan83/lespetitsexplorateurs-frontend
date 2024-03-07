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
    marginTop: 80,
    marginLeft: 20,
    marginBottom: 16,
  },
  title3: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#120D26",
    marginTop: 24,
    marginLeft: 20,
  },
  title4: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#29253C",
    marginTop: 24,
    marginLeft: 20,
    marginBottom: 4,
    textAlign: 'left'
  },

  // FORMS
  labelInput: {
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
    paddingRight: 10,
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
  inputMultiline: {
    width: "90%",
    height: 56,
    color: "#747688",
    fontSize: 14,
    marginLeft: 4,
    marginTop: 8,
    marginBottom: 8,
  },
});

export default globalStyles;

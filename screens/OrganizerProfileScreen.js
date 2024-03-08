import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image
} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function OrganizerProfileScreen({ navigation, route: { params: { organizer } } }) {

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
    >
      <FontAwesome style={styles.iconReturnButton} name={'arrow-left'} color={'black'} size={20} onPress={() => navigation.goBack()} />
        <View style={styles.img}>
          {organizer.imgUrl && <Image source={{ uri: organizer.imgUrl }} style={{ width: 150, height: 150, borderRadius: 100 }} />}
          {!organizer.imgUrl && <Text style={styles.initiale}>{organizer.name.slice(0,1)}</Text>}
        </View>

        <Text style={styles.title}>{organizer.name}</Text>
        <Text style={styles.subtitle}>{organizer.title}</Text>
        <Text style={styles.text}>{organizer.about}</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  iconReturnButton: {
    marginTop: 80,
    marginLeft: 20,
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: '#EEF0FF',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    margin: 20,
    lineHeight: 22,
  },
  initiale : {
    fontSize: 68,
    fontWeight: 'bold',
    color: '#BBC3FF',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#29253C",
    marginBottom: 8,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: "#B8B6BE",
    marginBottom: 20,
    alignSelf: 'center',
  },

  button: {
    padding: 10,
    width: "70%",
    height: 58,
    backgroundColor: "#5669FF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  border: {
    alignItems: "center",
    paddingLeft: 4,
    paddingRight: 4,
    borderColor: "#E4dfdf",
    borderWidth: 1,
    borderRadius: 12,
    width: "90%",
  },
});

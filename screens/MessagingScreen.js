import {
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles from '../globalStyles';

export default function MessagingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.title2}>Mes messages</Text>
      <View style={styles.noMsgContainer}>
      <Image
          style={styles.img}
          source={require('../assets/Images/14.jpg')}
        />
        <Text style={styles.text} >Vous n'avez pas encore reçu de messages.</Text>
        <Text style={styles.text}>Partagez l'appli avec votre cercle de parents et commencez à échanger vos bons plans !</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  noMsgContainer: {
    alignItems: 'center',
    justifyContent: "center",
    flex: 1,
  },
  img: {
    width: 250,
    height: 250,
    borderRadius: 150,
    marginBottom: 20,
    alignSelf: "center",
    // backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    width: '80%',
    lineHeight: 24,
    alignSelf: 'center',
  }
});

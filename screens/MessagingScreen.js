import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles from '../globalStyles';

export default function MessagingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.title2}>Mes messages</Text>
      <View style={styles.noMsgContainer}>
        <View style={styles.img}>
          <MaterialIcons name='message' size={64} color="#BBC3FF" style={styles.icon} />
        </View>
        <Text style={styles.text} >Vous n'avez pas encore reçus de messages.</Text>
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
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
    alignSelf: "center",
    backgroundColor: '#EEF0FF',
    borderRadius: 100,
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

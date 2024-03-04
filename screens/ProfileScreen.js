import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import globalStyles from '../globalStyles';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/user';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logout())
    navigation.navigate('Explorer')
  }

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title2}>Mon profil</Text>
      <TouchableOpacity
          onPress={() => handleLogOut()}
          activeOpacity={0.8}
        >
          <Text style={styles.deconnexion}>Se déconnecter</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  deconnexion : {
    margin : 20,

  }
});

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


      {/* A supprimer quand je l'aurais sur la page explorer */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Filters')}
        style={styles.filtersButton}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Filtres</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  deconnexion: {
    margin: 20,
  },

// a supprimer plus tard 
  filtersButton: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#EBEDFF',
    borderRadius: 100,
    padding: 6,
},
textButton: {
    color: '#5669FF',
    fontWeight: 'bold',
    fontSize: 16
}
});

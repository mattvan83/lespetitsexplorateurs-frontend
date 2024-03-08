import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import globalStyles from '../globalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { setPreferences, resetPreferences } from '../reducers/user';
import { useState } from 'react';
import FilterCategoryMedium from "../components/FilterCategoryMedium";
import { handleFilterButtonClick } from '../modules/handleFilterButtonClick';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [activityAddress, setActivityAddress] = useState('');
  const [activityPostalCode, setActivityPostalCode] = useState('');
  const [activityCity, setActivityCity] = useState('');
  const [activityPlace, setActivityPlace] = useState('');

  const handleContinue = () => {
    //dispatch(setPreferences({ agePreference: selectedAges, locationPreference: selectedLocation, scopePreference: scope}));
    navigation.navigate('ActivityPart4');
  }


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.filtersContainer}>
        <FontAwesome name={'arrow-left'} color={'black'} size={20} style={styles.arrow} onPress={() => navigation.goBack()}/>
        
        <Text style={styles.title2}>Comment trouver l'activité ?</Text>

        <Text style={globalStyles.title4}>Adresse</Text>
        <View style={globalStyles.border} marginLeft={20}>
          <TextInput
            placeholder="Adresse précise"
            autoCapitalize="none"
            keyboardType="default"
            onChangeText={(value) => setActivityAddress(value)}
            value={activityAddress}
            style={globalStyles.input}
          />
        </View>

        <Text style={globalStyles.title4}>Code postal</Text>
        <View style={globalStyles.border} marginLeft={20} width={150}>
          <TextInput
            placeholder="Code postal"
            autoCapitalize="none"
            keyboardType="number-pad"
            onChangeText={(value) => setActivityPostalCode(value)}
            value={activityPostalCode}
            style={globalStyles.input}
          />
        </View>
        <Text style={globalStyles.title4}>Ville</Text>
        <View style={globalStyles.border} marginLeft={20}>
          <TextInput
            placeholder="Ville"
            autoCapitalize="none"
            keyboardType="default"
            onChangeText={(value) => setActivityCity(value)}
            value={activityCity}
            style={globalStyles.input}
          />
        </View>

        <Text style={globalStyles.title4}>Nom du lieu</Text>
        <View style={globalStyles.border} marginLeft={20}>
          <TextInput
            placeholder="ex : Gymnase, Ludothèque, Bibliothèque..."
            autoCapitalize="none"
            keyboardType="default"
            onChangeText={(value) => setActivityPlace(value)}
            value={activityPlace}
            style={globalStyles.input}
          />
        </View>

      </View>

      <View style={styles.bottom}>
      <TouchableOpacity
          onPress={() => handleContinue()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "white",
  },
  arrow: {
    marginTop: 50,
    marginLeft: 20,
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#120D26",
    marginTop: 45,
    marginLeft: 20,
  },
  filtersContainer: {
    flex: 0.9,
  },
  filters: {
    marginLeft: 20,
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
  },
  text: {
    fontSize: 16,
    color: "#120D26",
    marginTop: 12,
    marginLeft: 20,
  },
  bottom: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flex: 0.1
  },
  button: {
    padding: 10,
    width: "70%",
    height: 58,
    backgroundColor: "#5669FF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
});
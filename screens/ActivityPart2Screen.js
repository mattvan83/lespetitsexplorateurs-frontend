import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import globalStyles from '../globalStyles';
import { useDispatch } from 'react-redux';
import { addActivityInfoScreen2 } from '../reducers/activities';
import { useState, useEffect } from 'react';
import FilterTextCategory from "../components/FilterTextCategory";
import { handleFilterButtonClick } from '../modules/handleFilterButtonClick';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const [selectedAges, setSelectedAges] = useState([]);
  const [showError, setShowError] = useState(false);

  /*useEffect(() => {
    setSelectedAges([]);
  }, []);*/
  
  const ageCategory = ["3-12 mois", "1-3 ans", "3-6 ans", "6-10 ans", "10+ ans"];

  const handleAgeList = (category) => {
    handleFilterButtonClick(category, selectedAges, setSelectedAges);
  }

  const ageList = ageCategory.map((category, i) => {
    const isActive = selectedAges.includes(category);
    return <FilterTextCategory key={i} category={category} style={styles.box} handleCategoryList={handleAgeList} isActive={isActive} />
  })

  const handleContinue = () => {
    if (selectedAges.length !== 0) {
      dispatch(addActivityInfoScreen2({ concernedAges: selectedAges }));
      navigation.navigate('ActivityPart3');
    } else {
      setShowError(true);
    }
  }

  return (
    <View style={styles.filtersContainer}>
        <FontAwesome name={'arrow-left'} color={'black'} size={20} style={styles.arrow} onPress={() => navigation.goBack()}/>
        
        <Text style={styles.title2}>À qui s'adresse l'activité ?</Text>

        <Text style={globalStyles.title4}>Âge des enfants</Text>
        <View style={styles.filters} >
          {ageList}
        </View>

        <View style={styles.bottom} >
          <TouchableOpacity
              onPress={() => handleContinue()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>Continuer</Text>
            </TouchableOpacity>
            {showError && (
            <Text style={styles.error}>
              Tous les champs sont requis.
            </Text>
          )}
      </View>
      </View>
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
  error: {
    color: 'red',
    fontWeight: 'bold',
    margin: 15,
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

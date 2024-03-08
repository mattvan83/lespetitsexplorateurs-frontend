import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import globalStyles from '../globalStyles';
import { useDispatch } from 'react-redux';
import { addActivityInfoScreen1 } from '../reducers/activities';
import { useState } from 'react';
import FilterCategoryMedium from "../components/FilterCategoryMedium";
import { handleFilterButtonClick } from '../modules/handleFilterButtonClick';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activityName, setActivityName] = useState('');
  const [activityDescription, setActivityDescription] = useState('');

  const handleContinue = () => {
    dispatch(addActivityInfoScreen1({ name: activityName, description: activityDescription, category: selectedCategories}));
    navigation.navigate('ActivityPart2');
  }

  const categories = ['Sport', 'Musique', 'Créativité', 'Motricité', 'Éveil'];
  
  const handleCategoryList = (category)=> {
    handleFilterButtonClick(category, selectedCategories, setSelectedCategories);
  }

  const categoryList = categories.map((category, i) => {
    const isActive = selectedCategories.includes(category);
    return <FilterCategoryMedium key={i} category={category} handleCategoryList={handleCategoryList} isActive={isActive} />
  })


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.filtersContainer}>
        <FontAwesome name={'arrow-left'} color={'black'} size={20} style={styles.arrow} onPress={() => navigation.goBack()}/>
        
        <Text style={styles.title2}>Dites-nous tout</Text>

        <Text style={globalStyles.title4}>Nom de l'activité</Text>
        <View style={globalStyles.border} marginLeft={20}>
          <TextInput
            placeholder="Nom de l'activité (max. 23 caractères)"
            autoCapitalize="none"
            keyboardType="default"
            maxLength={23}
            onChangeText={(value) => setActivityName(value)}
            value={activityName}
            style={globalStyles.input}
          />
        </View>

        <Text style={globalStyles.title4}>Description</Text>
        <View style={globalStyles.border} marginLeft={20} height={200}>
          <TextInput
            placeholder="Décrivez l'activité"
            autoCapitalize="none"
            keyboardType="default"
            onChangeText={(value) => setActivityDescription(value)}
            value={activityDescription}
            style={globalStyles.input}
          />
        </View>

        <Text style={globalStyles.title4}>Sélectionnez une catégorie</Text>
        <ScrollView horizontal={true} style={styles.categoryFilters}>
          {categoryList}
        </ScrollView>
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

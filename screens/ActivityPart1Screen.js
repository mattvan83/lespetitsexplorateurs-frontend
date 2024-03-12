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
import { useDispatch, useSelector } from 'react-redux';
import { addActivityInfoScreen1, resetActivityInfos } from '../reducers/activities';
import { useState } from 'react';
import FilterCategoryMedium from "../components/FilterCategoryMedium";
import { handleFilterButtonClick } from '../modules/handleFilterButtonClick';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { invertMappingTable } = require("../modules/invertMapping");


export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.activities.value);
  // Cf below for category mapping
  const [activityName, setActivityName] = useState(activities.name);
  const [activityDescription, setActivityDescription] = useState(activities.description);
  const [showError, setShowError] = useState(false);

  const categoryMapping = {
    Sport: "Sport",
    Musique: "Music",
    Créativité: "Creativity",
    Motricité: "Motricity",
    Éveil: "Awakening",
  };
  const backToFrontCategoryMapping = invertMappingTable(categoryMapping); 
  let frontCategory = "";
  if (activities.category) {
    frontCategory = backToFrontCategoryMapping[activities.category];
  }
  const [selectedCategory, setSelectedCategory] = useState(activities.isCurrentlyUpdated ? frontCategory : '');
  console.log(frontCategory)

  const handleContinue = () => {
    if (activityName !== '' && activityDescription !== '' && selectedCategory !== '') {
      dispatch(addActivityInfoScreen1({ name: activityName, description: activityDescription, category: selectedCategory }));
      navigation.navigate('ActivityPart2');
    } else {
      setShowError(true);
    }
  }

  const categories = ['Sport', 'Musique', 'Créativité', 'Motricité', 'Éveil'];

  const handleCategoryList = (category) => {
    setSelectedCategory(category);
  }

  const categoryList = categories.map((category, i) => {
    const isActive = selectedCategory === category;
    return <FilterCategoryMedium key={i} category={category} handleCategoryList={handleCategoryList} isActive={isActive} />
  })

  const handleReturnClick = () => {
    dispatch(resetActivityInfos())
    navigation.goBack()
  }


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.filtersContainer}>
        <FontAwesome name={'arrow-left'} color={'black'} size={20} style={styles.arrow} onPress={() => handleReturnClick()} />

        <Text style={styles.title2}>Dites-nous tout</Text>

        <Text style={globalStyles.title4}>Nom de l'activité</Text>
        <View style={globalStyles.border} marginLeft={20}>
          <TextInput
            placeholder="Nom de l'activité (max. 23 caractères)"
            autoCapitalize="sentences"
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
            placeholder="Décrivez l'activité en quelques mots"
            autoCapitalize="sentences"
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
        {showError && (
          <Text style={styles.error}>
            Tous les champs sont requis.
          </Text>
        )}
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

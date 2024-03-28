import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import globalStyles from '../globalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { addActivityInfoScreen1, resetActivityInfos } from '../reducers/activities';
import { useState } from 'react';
import FilterCategoryMedium from "../components/FilterCategoryMedium";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Button from '../components/Button';
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

  const handleBackgroundPress = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={1}
      onPress={handleBackgroundPress}>
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
              placeholder="Décrivez l'activité en quelques mots..."
              autoCapitalize="sentences"
              keyboardType="default"
              onChangeText={(value) => setActivityDescription(value)}
              value={activityDescription}
              style={styles.descriptionInput}
              multiline={true}
              numberOfLines={6}
            />
          </View>

          <Text style={globalStyles.title4}>Sélectionnez une catégorie</Text>
          <ScrollView horizontal={true} style={styles.categoryFilters}>
            {categoryList}
          </ScrollView>
        </View>

        {showError && (
            <Text style={styles.error}>
              Tous les champs sont requis.
            </Text>
          )}

        <Button onPress={handleContinue} text="Continuer" />

      </KeyboardAvoidingView>

    </TouchableOpacity>
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
  text: {
    fontSize: 16,
    color: "#120D26",
    marginTop: 12,
    marginLeft: 20,
  },
  descriptionInput: {
    width: "90%",
    height: 160,
    color: "#7887FF",
    fontSize: 14,
    marginLeft: 10,
    textAlignVertical: "top",
  }
});

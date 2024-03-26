import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
} from "react-native";
import globalStyles from "../globalStyles";
import { useSelector, useDispatch } from "react-redux";
import Card from "../components/Card";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function FavoriteScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const activitiesList = user.favoriteActivities.map((activity, i) => <Card key={i} activity={activity} /> );

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title2}>Mes favoris</Text>
      {activitiesList.length === 0 ? ( // if activitiesList is empty
      <View style={styles.noFavContainer}>
         <Image style={styles.img} source={require('../assets/Images/15.jpg')} />
        <Text style={styles.text}>Vous n'avez pas encore de favoris.</Text>
        <Text style={styles.text}>Explorez l'appli pour sauvegarder des activités près de chez vous !</Text>
      </View>
    ) : (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView} >
        {activitiesList}
      </ScrollView>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  noFavContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
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

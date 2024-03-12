import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import globalStyles from "../globalStyles";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadFavoriteActivities } from "../reducers/user";
import CardEditDelete from "../components/CardEditDelete";
import { MaterialIcons } from "@expo/vector-icons";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function FavoriteScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/activities/favorite/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        data.result && dispatch(loadFavoriteActivities(data.activities));
      });
  }, []);

  const activitiesList = user.favoriteActivities.map((activity, i) => {
    const inputDate = new Date(activity.date);
    const options = {
      weekday: "long", // full weekday name
      day: "numeric", // day of the month
      month: "long", // full month name
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = inputDate
      .toLocaleString("fr-FR", options)
      .replace(":", "h")
      .toUpperCase();

    return (
      <CardEditDelete
        key={i}
        imagePath={activity.imgUrl}
        activityId={activity.id}
        activityDate={formattedDate}
        activityName={activity.name}
        activityLocation={`${activity.postalCode}, ${activity.city}`}
        isFavorite={activity.isLiked}
        activityDistance={0}
      />
    );
  });

  const handleActivitySheet = () => {
    navigation.navigate("ActivitySheet");
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title2}>Mes favoris</Text>
      {activitiesList.length === 0 ? ( // Vérifiez si la liste des activités est vide
      <View style={styles.noFavContainer}>
        <View style={styles.img}>
          <MaterialIcons name='favorite' size={64} color="#BBC3FF" style={styles.icon} />
        </View>
        <Text style={styles.text}>Vous n'avez pas encore de favoris.</Text>
        <Text style={styles.text}>Explorez l'appli pour sauvegarder des activités près de chez vous !</Text>
      </View>
    ) : (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
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

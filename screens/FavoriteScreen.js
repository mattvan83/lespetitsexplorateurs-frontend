import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import globalStyles from "../globalStyles";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadFavoriteActivities } from "../reducers/user";
import Card from "../components/Card";
import { MaterialIcons } from "@expo/vector-icons";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function FavoriteScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const userId = user._id;

  fetch(`${BACKEND_ADDRESS}/activities/favorite/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      data.result && dispatch(loadFavoriteActivities(data.activities));
    });

  /*const activitiesList = user.favoriteActivities.map((activity, i) => {
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
    });*/


  const activitiesList = user.favoriteActivities.map((activity, i) => {
    return <Card key={i} activity={activity} />;
  });


  const handleActivitySheet = () => {
    navigation.navigate("ActivitySheet");
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.title2}>Mes favoris</Text>
      {activitiesList.length === 0 ? ( // if activitiesList is empty
      <View style={styles.noFavContainer}>
         <Image
          style={styles.img}
          source={require('../assets/Images/15.jpg')}
        />
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

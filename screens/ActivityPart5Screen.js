import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import globalStyles from '../globalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { addActivityInfoScreen5 } from '../reducers/activities';
import { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ProfileScreen({ navigation }) {
  const formData = new FormData();

  const dispatch = useDispatch();
  const activities = useSelector((state) => state.activities.value);
  console.log(activities);
  const [uploadedImage, setUploadedImage] = useState("");

  const handleAddImage = () => {
    console.log('add image');

    /*formData.append('photoFromFront', {
      uri: 'file://...',
      name: 'photo.jpg',
      type: 'image/jpeg',
     });

    fetch('http://.../upload', {
    method: 'POST',
    body: formData,
    }).then((response) => response.json())
    .then((data) => {

    });*/
  }

  const handleCreate = () => {
    if (uploadedImage === "") {
      setUploadedImage("../assets/Images/ludotheque.jpeg");
    }
    dispatch(addActivityInfoScreen5({ image: uploadedImage }));
    
    
    //Fetch route POST /activities
    fetch('http://172.20.10.8:3000/activities/newActivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activities }),
      })
        .then((response) => response.json())
        .then((activity) => {
          activity.result;
          navigation.navigate("TabNavigator", { screen: "Activité" });
        });
  }


  return (
    <View style={styles.filtersContainer}>
      <FontAwesome name={'arrow-left'} color={'black'} size={20} style={styles.arrow} onPress={() => navigation.goBack()}/>
        
        <Text style={styles.title2}>Une photo vaut 1000 mots !</Text>
        
        <View style={styles.text}>
          <Text>Mettez en valeur l'activité proposée.</Text>
          <Text>Les photos de l'activité proposée permettent aux parents d'avoir une idée du cadre proposé aux enfants.</Text>
          <Text style={styles.importantText}>Veillez à ce que les visages soient floutés !</Text>
        </View>
        
        <View style={styles.chooseImage}>
          <FontAwesome name={'image'} color={'#5669FF'} size={40} style={styles.iconBckgd} onPress={handleAddImage}/>
          <Text style={styles.greyText}>Choisir une image</Text>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
              onPress={() => handleCreate()}
              style={styles.button}
              activeOpacity={0.8}>
              <Text style={styles.textButton}>Créer l'activité</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "white",
  },
  arrow: {
    marginTop: 35,
    marginLeft: 20,
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#120D26",
    marginTop: 45,
    marginLeft: 20,
  },
  chooseImage: {
    display: 'flex',
    height: 108,
    width: 153,
    borderColor: 'grey',
    borderWidth: 2,
    borderStyle: 'dashed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    margin: 20,
  },
  greyText: {
    color: 'grey',
    marginTop: 10,
  },
  importantText: {
    color: 'red',
    fontWeight: 'bold',
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
    fontSize: 14,
    color: "#120D26",
    marginTop: 12,
    marginLeft: 20,
    width: 350,
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

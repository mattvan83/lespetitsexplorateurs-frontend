import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import globalStyles from '../globalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { addActivityInfoScreen4 } from '../reducers/activities';
import { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileScreen({ navigation }) {
  const activities = useSelector((state) => state.activities.value);
  const [date, setDate] = useState(activities.isCurrentlyUpdated ? new Date(activities.date) : new Date());
  const [time, setTime] = useState(activities.isCurrentlyUpdated ? new Date(activities.date) : new Date());
  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();
  
  const onChangeDate = (e, selectedDate) => {
    setDate(selectedDate);
  }

  const onChangeTime = (e, selectedTime) => {
    setTime((selectedTime));
  }

  const handleContinue = () => {
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(time.getHours(), time.getMinutes());

      const formattedDateTime = combinedDateTime.toISOString();
      const currentDateTime = new Date().toISOString();

      if (formattedDateTime !== currentDateTime) {
        dispatch(addActivityInfoScreen4({ date: formattedDateTime }));
        navigation.navigate('ActivityPart5');
      } else {
        setShowError(true);
      }
  }

  
  return (
    <View style={styles.filtersContainer}>
        <FontAwesome name={'arrow-left'} color={'black'} size={20} style={styles.arrow} onPress={() => navigation.goBack()}/>
        
        <Text style={styles.title2}>Quand aura-t-elle lieu ?</Text>

        <View style={styles.datetime}>
            <Text style={globalStyles.title4}>Sélectionnez une date :</Text>
            <DateTimePicker
              margin={10}
              value={date}
              mode={'date'}
              onChange={onChangeDate} 
            />
        </View>
        <View style={styles.datetime}>
            <Text style={globalStyles.title4}>Sélectionnez une heure :</Text>
            <DateTimePicker
              margin={10}
              value={time}
              mode={'time'}
              onChange={onChangeTime}
            />
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
  datetime: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
  },  
  filtersContainer: {
    flex: 0.9,
  },
  filters: {
    marginLeft: 20,
  },
  centeredModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
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

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import globalStyles from '../globalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { addActivityInfoScreen4 } from '../reducers/activities';
import { useState } from 'react';
import Button from '../components/Button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileScreen({ navigation }) {
  const activities = useSelector((state) => state.activities.value);
  const [date, setDate] = useState(activities.isCurrentlyUpdated ? new Date(activities.date) : new Date());
  const [time, setTime] = useState(activities.isCurrentlyUpdated ? new Date(activities.date) : new Date());
  const [milliseconds, setMilliseconds] = useState(activities.isCurrentlyUpdated ? activities.durationInMilliseconds : 3600000); // 1H
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
      dispatch(addActivityInfoScreen4({ date: formattedDateTime, durationInMilliseconds: milliseconds }));
      navigation.navigate('ActivityPart5');
    } else {
      setShowError(true);
    }
  }

  const incrementMilliseconds = () => {
    setMilliseconds(milliseconds + 900000);
  };

  const decrementMilliseconds = () => {
    if (milliseconds > 900000) {
      setMilliseconds(milliseconds - 900000);
    }
  };

  // Conversion en heures, minutes et secondes
  const durationHours = Math.floor(milliseconds / (1000 * 60 * 60));
  const durationMinutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.filtersContainer}>
        <FontAwesome name={'arrow-left'} color={'black'} size={20} style={styles.arrow} onPress={() => navigation.goBack()} />

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

        <Text style={globalStyles.title4}>Sélectionnez une durée :</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.buttonDuration} onPress={decrementMilliseconds}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <View style={styles.buttonDuration}>
            <Text style={styles.buttonText}>{durationHours}H{durationMinutes === 0 ? "00" : durationMinutes}</Text>
          </View>
          <TouchableOpacity style={styles.buttonDuration} onPress={incrementMilliseconds}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        {showError && (
          <Text style={styles.error}>
            Tous les champs sont requis.
          </Text>
        )}

      </View>

      <Button onPress={handleContinue} text="Continuer" />

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
  text: {
    fontSize: 16,
    color: "#120D26",
    marginTop: 12,
    marginLeft: 20,
  },
  buttonGroup: {
    marginLeft: 20,
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItens: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '2px solid rgba(0, 0, 0, 0.05)',
    width: 150,
  },
  buttonText: {
    // fontWeight: 'bold',
    // color: '#655074',
    fontSize: 16,
  },
  buttonDuration: {
    padding: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

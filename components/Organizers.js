import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Organizers(organizer) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('OrganizerProfile', {organizer})}
                style={styles.button}
                activeOpacity={0.8}
            >
                 {organizer.imgUrl && <Image source={{ uri: organizer.imgUrl }} style={styles.organizerImgProfile} />}
                 {organizer.imgUrl==="" && <Text style={styles.initiale}>{organizer.name.slice(0, 1)}</Text>}
            </TouchableOpacity>
            <Text style={styles.textButton}>{organizer.name}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: 120,
        height: 110,
        alignItems: 'center',
        marginBottom: 10,
    },
    textButton: {
        fontSize: 14,
        color: '#120D26',
        width: '85%',
        marginTop: 8,
        flexWrap: 'wrap',
        textAlign: 'center'
    },
    button: {
        margin: 10,
        width: 100,
        height: 100,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fcdac7',
    },
    initiale: {
        fontSize: 68,
        fontWeight: 'bold',
        color: '#F59762',
      },
    organizerImgProfile : {
        height: 100,
        width: 100,
        borderRadius: 100,
    },
});
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function Organizers(organizer) {
    const navigation = useNavigation();
    const [organizerDetailed, setOrganizerDetailed] = useState(null);
    const user = useSelector((state) => state.user.value);

    // Pour avoir les activités de l'organisateur mise à jour après qu'il en ait ajouté une (sinon on a les activités au moment du signin )
    useEffect(() => {
        fetch(`${BACKEND_ADDRESS}/organizers/byId/${organizer.id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                data.result && setOrganizerDetailed(data.organizer)
            });
    }, [user.userActivities])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('OrganizerProfile', { organizerDetailed })}
                style={styles.button}
                activeOpacity={0.8}
            >
                {organizer.imgUrl && <Image source={{ uri: organizer.imgUrl }} style={styles.organizerImgProfile} />}
                {organizer.imgUrl === "" && <Text style={styles.initiale}>{organizer.name.slice(0, 1)}</Text>}
            </TouchableOpacity>
            <Text style={styles.textButton}>{organizer.name}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: 120,
        alignItems: 'center',
        marginBottom: 10,
    },
    textButton: {
        fontSize: 12,
        color: '#120D26',
        width: '85%',
        marginTop: 8,
        flexWrap: 'wrap',
        textAlign: 'center',
        lineHeight: 20,
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
    organizerImgProfile: {
        height: 100,
        width: 100,
        borderRadius: 100,
    },
});
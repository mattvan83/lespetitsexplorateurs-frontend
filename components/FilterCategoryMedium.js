import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function FilterCategoryMedium({ category, handleCategoryList, isActive }) {

    const handleSubmit = () => {
        handleCategoryList(category);
    }

    let icon = null;

    switch (category) {
        case 'Sport':
            icon = 'tennisball'
            break;
        case 'Musique':
            icon = 'musical-notes'
            break;
        case 'Créativité':
            icon = 'color-palette'
            break;
        case 'Motricité':
            icon = 'balloon'
            break;
        case 'Éveil':
            icon = 'sparkles'
            break;
        default:
            console.log(`${category} not found`);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => handleSubmit()}
                style={isActive ? styles.activeButton : styles.inactiveButton}
                activeOpacity={0.8}
            >
                <Ionicons name={icon} size={35} color={isActive ? 'white' : '#120D26'} />
            </TouchableOpacity>
            <Text style={styles.textButton}>{category}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: 90,
        alignItems: 'center'
    },
    activeButton: {
        // padding: 10,
        width: 64,
        height: 64,
        backgroundColor: '#5669FF',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        fontSize: 16,
        color: '#120D26',
        marginTop: 8,
    },
    inactiveButton: {
        padding: 10,
        width: 64,
        height: 64,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
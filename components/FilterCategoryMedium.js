import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function FilterCategoryMedium({ category, iconPath }) {

    const handleSubmit = () => {
        
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => handleSubmit()}
                style={styles.button}
                activeOpacity={0.8}
            >
            <Image style={styles.icone} source={{uri: iconPath}} />
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
    icone: {
        // fill: 'white',
    },
    button: {
        padding: 10,
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
});
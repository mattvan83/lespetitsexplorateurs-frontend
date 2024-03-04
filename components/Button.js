import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Button({ text }) {

    const handleSubmit = () => {

    }

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={() => handleSubmit()}
                style={styles.button}
                activeOpacity={0.8}
            >
                <Text style={styles.textButton}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center'
    },
    button: {
        padding: 10,
        width: '70%',
        height: 58,
        backgroundColor: '#5669FF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
    },
});
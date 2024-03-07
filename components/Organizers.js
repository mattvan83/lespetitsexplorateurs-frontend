import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function Organizers( props ) {

    // const handleSubmit = ( props ) => {
    //     handleCategoryList(category);
    // }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => handleSubmit()}
                style={styles.button}
                activeOpacity={0.8}
            >
                <Image style={styles.organizerImgProfile} source={require('../assets/Images/presque-pieds-nus.jpeg')}/>
            </TouchableOpacity>
            <Text style={styles.textButton}>{props.name}</Text>
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
        borderWidth: 1,
        borderColor: '#A1A1AA',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    organizerImgProfile : {
        height: 100,
        width: 100,
        borderRadius: 100,
    },
});
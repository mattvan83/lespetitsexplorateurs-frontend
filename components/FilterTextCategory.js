import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function FilterTextCategory({ category, handleCategoryList, isActive }) {

    const handleSubmit = () => {
        handleCategoryList(category);
    }

    return (
        <View style={isActive ? styles.activeFilter : styles.inactiveFilter}>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={isActive ? styles.activeFilterText : styles.inactiveFilterText}>{category}</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    inactiveFilter: {
        marginTop: 20,
        marginRight: 14,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        borderRadius: 10,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      },
      inactiveFilterText: {
        color: '#120D26',
        fontSize: 16
      },
      activeFilter : {
        marginTop: 20,
        marginRight: 14,
        backgroundColor: '#5669FF',
        borderRadius: 10,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      },
      activeFilterText: {
        color: '#fff',
        fontSize: 16
      },
});
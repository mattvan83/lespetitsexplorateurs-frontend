import { Text, TouchableOpacity } from 'react-native';

export default function ButtonPlainText({ text, onPress }) {

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text>{text}</Text>
        </TouchableOpacity>
    );
}
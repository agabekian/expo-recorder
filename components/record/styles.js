import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    recordButton: {
        width: 60,
        height: 60,
        borderColor: 'gray',
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recording: {
        opacity: 0.5,
    },
    recordButtonInner: {
        width: 22,
        height: 22,
        borderRadius: 20,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },

});
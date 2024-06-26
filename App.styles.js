import { StyleSheet } from 'react-native';

const baseStyles = {
    container: {
        flex: 1,
        padding: 0,
        marginTop: 30,
    },
    topMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
        marginBottom: 10,
    },
    topMenuText: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Roboto',
        color: 'white',
    },
    recordPlayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        paddingLeft: 30,
    },
    buttonContainer: {
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 45,
    },
    button: {
        borderRightWidth: 2,
        borderBottomWidth: 2,
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Roboto',
    },
    reminder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        width: '100%',
    },
    reminderText: {
        fontSize: 16,
    },
    content: {
        flex: 1,
    },
};

export const lightStyles = StyleSheet.create({
    ...baseStyles,
    container: {
        ...baseStyles.container,
        backgroundColor: '#ffffff',
    },
    topMenu: {
        ...baseStyles.topMenu,
        backgroundColor: '#5f8381',
    },
    button: {
        ...baseStyles.button,
        backgroundColor: '#f5f6f6',
    },
    buttonText: {
        ...baseStyles.buttonText,
        color: 'black',
    },
    reminder: {
        ...baseStyles.reminder,
        borderColor: '#ccc',
        backgroundColor: '#ffffff',
    },
    reminderText: {
        ...baseStyles.reminderText,
        color: 'black',
    },
});

export const darkStyles = StyleSheet.create({
    ...baseStyles,
    container: {
        ...baseStyles.container,
        backgroundColor: '#393b3d',
    },
    topMenu: {
        ...baseStyles.topMenu,
        backgroundColor: '#5f8381',
    },
    button: {
        ...baseStyles.button,
        backgroundColor: 'transparent',
        borderColor: 'gray',
    },
    buttonText: {
        ...baseStyles.buttonText,
        color: 'white',
    },
    reminder: {
        ...baseStyles.reminder,
        borderColor: 'white',
        backgroundColor: '#34495e',
    },
    reminderText: {
        ...baseStyles.reminderText,
        color: 'white',
    },
});

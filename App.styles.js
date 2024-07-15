import {StyleSheet} from 'react-native';

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
        borderWidth: 1,
        padding:10,
        marginRight:5
    },
    transport: {
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 4,
        borderWidth: 1,
        padding:10,
        marginRight:5
    },

    button: {
        borderRightWidth: 2,
        borderBottomWidth: 2,
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        margin:8,
    },

    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Roboto',
    },

    reminder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'red',
        padding:10,
        marginLeft: 5,
        marginRight: 5,
    },

    reminderText: {
        fontSize: 16,
    },

    deleteButton: {
        marginLeft: 'auto', // Push delete button to the right
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
        borderColor: '#1c7530',
        backgroundColor: '#e3e5e1',
    },
    reminderText: {
        ...baseStyles.reminderText,
        color: '#1C7530FF',
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

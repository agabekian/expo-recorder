import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        padding: 20,
        marginTop: 20
    },
    darkContainer: {
        backgroundColor: '#2c3e50',
    },
    recordPlayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    buttonContainer: {
        color: 'gray',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    roundButton: {
        borderRightWidth: 2,
        borderBottomWidth: 2,
        backgroundColor: '#f5f6f6',
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
    },
    buttonText: {
        color: 'teal',
        fontSize: 16,
        fontWeight: 'semibold',
        fontFamily: 'Roboto',
    },
    lightReminder: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%',
    },
    darkReminder: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white',
        textDecorationColor: 'white',
        width: '100%',
        backgroundColor: '#34495e'
    },
    scheduledTime: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
    topMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 40,

        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#5f8381',
        width: '100%',
        marginBottom: 10,
    },
    topMenuText: {
        fontSize: 20,
        fontWeight: 'condensed',
        fontFamily: 'Roboto',
        color: 'white',
    },
});


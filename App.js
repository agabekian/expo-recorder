import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Button, Alert, Text, FlatList, TouchableOpacity, Platform, Switch} from 'react-native';
import RecordAudio from './components/RecordAudio';
import PlayAudio from './components/PlayAudio';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function App() {
    const [reminderUri, setReminderUri] = useState(null);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);

    useEffect(() => {
        (async () => {
            const {status} = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission not granted for notifications!');
            } else {
                setNotificationPermissionGranted(true);
            }
        })();
    }, []);

    const handleSaveRecording = (uri) => {
        setReminderUri(uri);
    };

    const handleScheduleReminder = async () => {
        if (!reminderUri) {
            Alert.alert('Please record a reminder first!');
            return;
        }
        if (!notificationPermissionGranted) {
            Alert.alert('Notification permission is not granted!');
            return;
        }

        const newReminder = {uri: reminderUri, time};
        setReminders([...reminders, newReminder]);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Reminder',
                body: 'Tap to listen to your reminder',
                data: {uri: reminderUri},
            },
            trigger: {date: time.getTime()},
        });

        // Alert.alert('Reminder scheduled!');
        setReminderUri(null); // Reset reminderUri after scheduling
    };

    const onChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
    };

    const renderReminder = ({item, index}) => (
        <View style={[styles.reminder, isDarkMode ? styles.darkReminder : styles.lightReminder]}>
            <Text>Reminder {index + 1}:</Text>
            <Text>Time: {new Date(item.time).toLocaleTimeString()}</Text>
            <PlayAudio uri={item.uri}/>
        </View>
    );
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <>
            <View style={styles.topMenu}>
                <Text style={styles.topMenuText}>voice <Ionicons name="checkmark-circle" size={32} color="white"/> book</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={isDarkMode}
                />
            </View>

            <View style={styles.container}>
                <View style={styles.recordPlayContainer}>
                    <RecordAudio onSave={handleSaveRecording}/>
                    {reminderUri && <PlayAudio uri={reminderUri}/>}
                </View>
                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.roundButton} onPress={() => setShowTimePicker(true)}>
                        <Text style={styles.buttonText}>Pick Time</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton} onPress={handleScheduleReminder}>
                        <Text style={styles.buttonText}>Schedule Reminder</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={reminders}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderReminder}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
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
        textDecorationColor:'white',
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





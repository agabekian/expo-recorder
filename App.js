import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert, Switch} from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import RecordAudio from './components/record/RecordAudio';
import PlayAudio from './components/play/PlayAudio';
import {ThemeProvider, useTheme} from './ThemeContext';
import {lightStyles, darkStyles} from './App.styles';
import {formatFullDateTime} from './util';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const App = () => {
    const [reminderUri, setReminderUri] = useState(null);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
    const {isDarkMode, toggleTheme} = useTheme();
    const styles = isDarkMode ? darkStyles : lightStyles;

    useEffect(() => {
        const requestNotificationPermissions = async () => {
            const {status} = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission not granted for notifications!');
            } else {
                setNotificationPermissionGranted(true);
            }
        };

        requestNotificationPermissions();
    }, []);

    useEffect(() => {
        loadStoredReminders();
    }, []);

    const handleSaveRecording = async (uri) => {
        setReminderUri(uri);
    };

    const loadStoredReminders = async () => {
        try {
            const storedURIs = await AsyncStorage.getItem('@stored_reminder_uris');
            if (storedURIs !== null) {
                setReminders(JSON.parse(storedURIs));
            }
        } catch (error) {
            console.error('Error loading reminders:', error);
        }
    };

    const handleScheduleReminder = async () => {
        if (!notificationPermissionGranted) {
            Alert.alert('Notification permission is not granted!');
            return;
        }

        const reminderTime = new Date(date);
        reminderTime.setHours(time.getHours());
        reminderTime.setMinutes(time.getMinutes());

        const newReminder = {uri: reminderUri, time: reminderTime};
        const updatedReminders = [...reminders, newReminder];
        setReminders(updatedReminders);

        try {
            await AsyncStorage.setItem('@stored_reminder_uris', JSON.stringify(updatedReminders));
        } catch (error) {
            console.error('Failed to save reminders to storage:', error);
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Reminder',
                body: 'Tap to listen to your reminder',
                data: {uri: reminderUri},
            },
            trigger: {date: reminderTime},
        });

        setReminderUri(null);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const showTimepicker = () => {
        setShowTimePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(false);
        setTime(currentTime);
    };

    const handleRemoveReminder = async (index) => {
        const updatedReminders = [...reminders];
        updatedReminders.splice(index, 1);
        setReminders(updatedReminders);

        try {
            await AsyncStorage.setItem('@stored_reminder_uris', JSON.stringify(updatedReminders));
        } catch (error) {
            console.error('Failed to update reminders in storage:', error);
        }
    };

    const renderReminder = ({item, index}) => (
        <View style={styles.reminder}>
            <TouchableOpacity onPress={() => alert("DUDE!")}>
                <Text style={styles.reminderText}>{index + 1}. </Text>
                <Text style={styles.dateText1}>{formatFullDateTime(item.time)}</Text>
            </TouchableOpacity>

            <View style={styles.audioInfo}>
                <PlayAudio uri={item.uri} dateRecorded={new Date(item.time).toLocaleString()}/>
                {/*actual play button etc*/}
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleRemoveReminder(index)} style={styles.deleteButton}>
                    <Ionicons name="close-circle" size={24} color="red"/>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={{flex: 1}}>
            <View style={styles.topMenu}>
                <Text style={styles.topMenuText}>Todayly <Ionicons name="checkmark-circle" size={32} color="white"/>
                </Text>
                <Switch
                    trackColor={{false: "#3b3a3b", true: "#d6e5df"}}
                    thumbColor={isDarkMode ? "#435b5b" : "#c6d0d0"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={isDarkMode}
                />
            </View>
            <View style={{flex: 1}}>
                <View style={styles.transport}>
                    <View style={styles.buttonContainer}>
                        <RecordAudio onSave={handleSaveRecording}/>
                        <TouchableOpacity style={styles.button} onPress={showDatepicker}>
                            <Text style={styles.buttonText}>Pick <Ionicons name="calendar-outline" size={24}
                                                                           color="orange"/> Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={showTimepicker}>
                            <Text style={styles.buttonText}>Pick <Ionicons name="time-outline" size={24}
                                                                           color="orange"/> Time</Text>
                        </TouchableOpacity>
                    </View>
                    {reminderUri && (
                        <View style={styles.buttonContainer}>
                            <Text style={styles.reminderText}>Recorded:</Text>
                            <PlayAudio uri={reminderUri}/>
                            <TouchableOpacity style={styles.button} onPress={handleScheduleReminder}>
                                <Text style={styles.buttonText}><Ionicons name="add-outline" size={24}
                                                                          color="orange"/> Schedule as reminder</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onTimeChange}
                    />
                )}
                <FlatList
                    data={reminders}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderReminder}
                    contentContainerStyle={{paddingBottom: 20}}  // Ensure padding for better scrolling
                />
            </View>
        </View>
    );
};

export default () => (
    <ThemeProvider>
        <App/>
    </ThemeProvider>
);
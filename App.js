import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import RecordAudio from './components/record/recordAudio';
import PlayAudio from './components/play/playAudio';
import { ThemeProvider, useTheme } from './ThemeContext';
import { lightStyles, darkStyles } from './App.styles';
import { formatTime } from './util'; // Adjust the path as necessary
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const AppContent = () => {
    const [reminderUri, setReminderUri] = useState(null);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const styles = isDarkMode ? darkStyles : lightStyles;

    useEffect(() => {
        (async () => {
            const { status } = await Notifications.requestPermissionsAsync();
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

        const newReminder = { uri: reminderUri, time };
        setReminders([...reminders, newReminder]);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Reminder',
                body: 'Tap to listen to your reminder',
                data: { uri: reminderUri },
            },
            trigger: { date: time.getTime() },
        });

        setReminderUri(null);
    };

    const showPicker = () => {
        setShowTimePicker(true);
    };

    const onChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(false); // Close DateTimePicker after picking time
        setTime(currentTime);
    };

    const handleRemoveReminder = (index) => {
        const updatedReminders = [...reminders];
        updatedReminders.splice(index, 1);
        setReminders(updatedReminders);
    };

    const renderReminder = ({ item, index }) => (
        <View style={styles.reminder}>
            <Text style={styles.reminderText}>{index + 1}. </Text>
            <Text style={styles.reminderText}>{formatTime(item.time)}</Text>
            <View style={styles.audioInfo}>
                <PlayAudio uri={item.uri} />
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleRemoveReminder(index)} style={styles.deleteButton}>
                    <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.topMenu}>
                <Text style={styles.topMenuText}>Voice <Ionicons name="checkmark-circle" size={32} color="white" /> Book</Text>
                <Switch
                    trackColor={{ false: "#3b3a3b", true: "#d6e5df" }}
                    thumbColor={isDarkMode ? "#435b5b" : "#c6d0d0"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={isDarkMode}
                />
            </View>
            <View style={styles.content}>
                <View style={styles.recordPlayContainer}>
                    <RecordAudio onSave={handleSaveRecording} />
                    {reminderUri && <PlayAudio uri={reminderUri} />}
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
                    <TouchableOpacity style={styles.button} onPress={showPicker}>
                        <Text style={styles.buttonText}>Pick Time</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleScheduleReminder}>
                        <Text style={styles.buttonText}>Schedule Reminder</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={reminders.map((item) => ({
                        ...item,
                    }))}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderReminder}
                />
            </View>
        </View>
    );
};

export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

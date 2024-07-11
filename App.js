import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import RecordAudio from './components/record/recordAudio';
import PlayAudio from './components/play/playAudio';
import { lightStyles, darkStyles } from './App.styles';
import { formatTime } from './util';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContent = () => {
    const [reminderUri, setReminderUri] = useState(null);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // State for theme
    const styles = isDarkMode ? darkStyles : lightStyles;

    useEffect(() => {
        // Request notification permissions on component mount
        const requestNotificationPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission not granted for notifications!');
            } else {
                setNotificationPermissionGranted(true);
            }
        };

        requestNotificationPermissions();
    }, []);

    useEffect(() => {
        // Load stored reminders from AsyncStorage on component mount
        loadStoredReminders();
    }, []);

    const handleSaveRecording = async (uri) => {
        setReminderUri(uri);
    };

    const loadStoredReminders = async () => {
        // Load stored reminders from AsyncStorage
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
            trigger: { date: time },
        });

        setReminderUri(null); // Reset reminder URI after scheduling
    };

    const showPicker = () => {
        setShowTimePicker(true);
    };

    const onChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(false); // Close DateTimePicker after picking time
        setTime(currentTime);
    };

    const handleRemoveReminder = async (index) => {
        const updatedReminders = [...reminders];
        const removedReminder = updatedReminders.splice(index, 1)[0];
        setReminders(updatedReminders);

        try {
            await AsyncStorage.setItem('@stored_reminder_uris', JSON.stringify(updatedReminders));
        } catch (error) {
            console.error('Failed to update reminders in storage:', error);
        }
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
                <Text style={styles.topMenuText}>Todayly <Ionicons name="checkmark-circle" size={32} color="white" /> </Text>
                <Switch
                    trackColor={{ false: "#3b3a3b", true: "#d6e5df" }}
                    thumbColor={isDarkMode ? "#435b5b" : "#c6d0d0"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setIsDarkMode(prev => !prev)}
                    value={isDarkMode}
                />
            </View>
            <View style={styles.content}>
                <View style={styles.transport}>

                    <View style={styles.buttonContainer}>
                        <RecordAudio onSave={handleSaveRecording} />
                        <TouchableOpacity style={styles.button} onPress={showPicker}>
                            <Text style={styles.buttonText}>Pick <Ionicons name="time-outline" size={24} color="orange" /> Time</Text>
                        </TouchableOpacity>
                    </View>
                    {reminderUri && (
                        <View style={styles.buttonContainer}>
                            <Text style={styles.reminderText}>Recorded:</Text>
                            <PlayAudio uri={reminderUri} />
                            <TouchableOpacity style={styles.button} onPress={handleScheduleReminder}>
                                <Text style={styles.buttonText}><Ionicons name="add-outline" size={24} color="orange" />Schedule
                                    as reminder</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View>
                    {showTimePicker && (
                        <DateTimePicker
                            value={time}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )}
                    <FlatList
                        data={reminders}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderReminder}
                    />
                </View>
            </View>
        </View>
    );
};

export default AppContent;

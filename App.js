import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, Text, FlatList } from 'react-native';
import RecordAudio from './components/RecordAudio';
import PlayAudio from './components/PlayAudio';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);

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

    Alert.alert('Reminder scheduled!');
    setReminderUri(null); // Reset reminderUri after scheduling
  };

  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const renderReminder = ({ item, index }) => (
      <View style={styles.reminder}>
        <Text>Reminder {index + 1}:</Text>
        <Text>Time: {new Date(item.time).toLocaleTimeString()}</Text>
        <PlayAudio uri={item.uri} />
      </View>
  );

  return (
      <View style={styles.container}>
        <RecordAudio onSave={handleSaveRecording} />
        {reminderUri && <PlayAudio uri={reminderUri} />}
        {showTimePicker && (
            <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChange}
            />
        )}
        {!showTimePicker && (
            <Button title="Pick Time" onPress={() => setShowTimePicker(true)} />
        )}
        <Button title="Schedule Reminder" onPress={handleScheduleReminder} />
        <FlatList
            data={reminders}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderReminder}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  reminder: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
});


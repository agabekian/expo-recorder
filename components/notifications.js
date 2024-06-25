// notifications.js

import * as Notifications from 'expo-notifications';

export const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status;
};

export const scheduleReminder = async (reminderUri, time) => {
    try {
        const notificationTime = new Date(time).getTime();
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Reminder',
                body: 'Tap to listen to your reminder',
                data: { uri: reminderUri },
            },
            trigger: { date: notificationTime },
        });
        return true; // Return true if scheduled successfully
    } catch (error) {
        console.error('Failed to schedule reminder:', error);
        return false; // Return false if scheduling failed
    }
};

// components/NotificationPermissions.js
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

const NotificationPermissions = ({ onPermissionGranted }) => {
    const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);

    useEffect(() => {
        const requestNotificationPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission not granted for notifications!');
            } else {
                setNotificationPermissionGranted(true);
                onPermissionGranted(true);
            }
        };

        requestNotificationPermissions();
    }, []);

    return null; // This component does not render any UI.
};

export default NotificationPermissions;

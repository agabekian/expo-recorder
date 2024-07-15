import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecordAudio = ({ onSave }) => {
    const [recording, setRecording] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        const requestAudioPermission = async () => {
            const response = await Audio.requestPermissionsAsync();
            setHasPermission(response.status === 'granted');
        };

        requestAudioPermission();
    }, []);

    useEffect(() => {
        const loadRecordingState = async () => {
            const startTime = await AsyncStorage.getItem('recordingStartTime');
            if (startTime) {
                const duration = Math.floor((Date.now() - parseInt(startTime)) / 1000);
                setRecordingDuration(duration);
                startRecordingInterval();
            }
        };

        loadRecordingState();
    }, []);

    useEffect(() => {
        if (recording) {
            startRecordingInterval();
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [recording]);

    const startRecordingInterval = () => {
        const id = setInterval(() => {
            setRecordingDuration(prevDuration => prevDuration + 1);
        }, 1000);
        setIntervalId(id);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const startRecording = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recordingObject = new Audio.Recording();
            await recordingObject.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recordingObject.startAsync();
            setRecording(recordingObject);
            const startTime = Date.now();
            await AsyncStorage.setItem('recordingStartTime', startTime.toString());
            setRecordingDuration(0);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);
            await AsyncStorage.removeItem('recordingStartTime');
            await saveRecording(uri);
            onSave(uri);
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    };

    const saveRecording = async (uri) => {
        try {
            await AsyncStorage.setItem('recordedAudioURI', uri);
            console.log('Recording saved:', uri);
        } catch (error) {
            console.error('Failed to save recording URI', error);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.recordButton, recording ? styles.recording : null]}
            onPress={recording ? stopRecording : startRecording}
            disabled={!hasPermission}
        >
            <View style={styles.recordButtonInner}>
                {recording || recordingDuration > 0 ? (
                    <Text style={styles.recordingText}>{formatTime(recordingDuration)}</Text>
                ) : (
                    <View style={styles.circle} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    recordButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4c4f4c',
    },
    recording: {
        backgroundColor: '#c72929',
    },
    recordButtonInner: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#eeefee',
    },
    recordingText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RecordAudio;

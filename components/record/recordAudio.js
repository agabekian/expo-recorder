import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { styles } from './styles';

const RecordAudio = ({ onSave }) => {
    const [recording, setRecording] = useState(null); // Initialize recording state as null initially
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    useEffect(() => {
        const requestAudioPermission = async () => {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                console.warn('Audio permission not granted');
            }
        };

        requestAudioPermission();
    }, []); // Run once on component mount

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
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) {
            return;
        }

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null); // Reset recording state
            onSave(uri); // Pass the URI to the onSave function to handle saving
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.recordButton, recording ? styles.recording : null]}
            onPress={recording ? stopRecording : startRecording}
            disabled={permissionResponse?.status !== 'granted'}
        >
            <View style={styles.recordButtonInner}>
                {!recording && <View style={styles.circle} />}
            </View>
        </TouchableOpacity>
    );
};

export default RecordAudio;

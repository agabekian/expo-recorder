// RecordAudio.js
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';
import { styles } from './styles';

const RecordAudio = ({ onSave }) => {
    const [recording, setRecording] = useState();
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    useEffect(() => {
        (async () => {
            if (permissionResponse?.status !== 'granted') {
                await requestPermission();
            }
        })();
    }, [permissionResponse]);

    async function startRecording() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HighQuality
            );
            setRecording(recording);
            await recording.startAsync();
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        try {
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            const uri = recording.getURI();
            setRecording(undefined);
            onSave(uri); // Pass the URI to the onSave function to handle saving
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    }

    return (
        <TouchableOpacity
            style={[styles.recordButton, recording ? styles.recording : {}]}
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

// RecordAudio.js
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';

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
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        setRecording(undefined);
        onSave(uri);
    }

    return (
        <TouchableOpacity
            style={[styles.recordButton, recording ? styles.recording : {}]}
            onPress={recording ? stopRecording : startRecording}
        >
            <View style={styles.recordButtonInner}>
                {!recording && <View style={styles.circle} />}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    recordButton: {
        width: 60,
        height: 60,
        borderColor:'gray',
        borderRightWidth:2,
        borderBottomWidth:2,

        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recording: {
        opacity: 0.5,
    },
    recordButtonInner: {
        width: 33,
        height: 33,
        borderRadius: 20,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // circle: {
    //     width: 20,
    //     height: 20,
    //     borderRadius: 10,
    //     backgroundColor: 'red',
    // },
});

export default RecordAudio;
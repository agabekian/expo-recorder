import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Audio } from 'expo-av';

const PlayAudio = ({ uri }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedTime, setElapsedTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');

    useEffect(() => {
        const loadSound = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: false });
                setSound(sound);
                const status = await sound.getStatusAsync();
                setDuration(formatTime(status.durationMillis));
            } catch (error) {
                console.error('Failed to load sound', error);
            }
        };

        loadSound();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [uri]);

    useEffect(() => {
        const checkPlaybackStatus = async () => {
            if (sound) {
                const status = await sound.getStatusAsync();
                if (status.isLoaded) {
                    if (status.isPlaying) {
                        setElapsedTime(formatTime(status.positionMillis));
                    } else if (status.didJustFinish || status.positionMillis >= status.durationMillis) {
                        setIsPlaying(false);
                        await sound.unloadAsync();
                        setSound(null);
                        setElapsedTime('00:00');
                    }
                }
            }
        };

        const interval = setInterval(checkPlaybackStatus, 500); // Check every 500ms
        return () => clearInterval(interval);
    }, [sound]);

    const playAudio = async () => {
        try {
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
                setIsPlaying(false);
                setElapsedTime('00:00');
            } else {
                const { sound: newSound } = await Audio.Sound.createAsync({ uri });
                setSound(newSound);
                await newSound.playAsync();
                setIsPlaying(true);
            }
        } catch (error) {
            console.log('Error playing audio:', error);
        }
    };

    const formatTime = (millis) => {
        const seconds = Math.floor(millis / 1000);
        const minutes = Math.floor(seconds / 60);
        const formattedSeconds = seconds % 60;
        return `${minutes}:${formattedSeconds < 10 ? '0' : ''}${formattedSeconds}`;
    };

    return (
        <TouchableOpacity style={styles.playButton} onPress={playAudio}>
            <View style={[styles.triangle, isPlaying && styles.stopTriangle]} />
            <Text style={styles.elapsedTime}>{isPlaying ? elapsedTime : duration}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    playButton: {
        flexDirection: 'row',
        width: 90,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#50a965',
        alignItems: 'center',
        justifyContent: 'center',
    },
    triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 15,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
        transform: [{ rotate: '90deg' }],
        marginRight: 10,
    },
    stopTriangle: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        transform: [{ rotate: '45deg' }],
    },

    elapsedTime: {
        marginTop: 5,
        color: 'white',
        fontSize: 12,
    },
});

export default PlayAudio;

import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';

const PlayAudio = ({ uri }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const unsubscribe = sound?.setOnPlaybackStatusUpdate(async (status) => {
            if (status.didJustFinish) {
                // Introduce a small delay for short audio
                setTimeout(() => setIsPlaying(false), 100); // Adjust delay as needed
            }
        });
        return () => unsubscribe?.(); // Unsubscribe on unmount to avoid leaks
    }, [sound]);

    const playAudio = async () => {
        try {
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
                setIsPlaying(false);
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

    return (
        <TouchableOpacity style={styles.playButton} onPress={playAudio}>
            <View style={[styles.triangle, isPlaying && styles.stopTriangle]} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    playButton: {
        marginRight:300,
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
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
    },
    stopTriangle: {
        width: 15,
        height: 15,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderStyle: 'solid',
        backgroundColor: 'white',
        transform: [{ rotate: '0deg' }],
    },
});

export default PlayAudio;

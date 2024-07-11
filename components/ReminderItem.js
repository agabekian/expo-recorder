import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { formatTime } from '../util';
import {styles} from "../App.styles";

const ReminderItem = ({ item, index, onDelete }) => {
    return (
        <View style={styles.reminder}>
            <Text style={styles.reminderText}>{index + 1}. </Text>
            <Text style={styles.reminderText}>{formatTime(item.time)}</Text>
            <View style={styles.audioInfo}>
                <PlayAudio uri={item.uri} />
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => onDelete(index)} style={styles.deleteButton}>
                    <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ReminderItem;

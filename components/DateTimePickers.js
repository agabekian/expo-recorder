// components/DateTimePickers.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';

const DateTimePickers = ({ date, time, onDateChange, onTimeChange, styles }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const showTimepicker = () => {
        setShowTimePicker(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        onDateChange(selectedDate || date);
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        onTimeChange(selectedTime || time);
    };

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={showDatepicker}>
                <Text style={styles.buttonText}>
                    Pick <Ionicons name="calendar-outline" size={24} color="orange" /> Date
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={showTimepicker}>
                <Text style={styles.buttonText}>
                    Pick <Ionicons name="time-outline" size={24} color="orange" /> Time
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
};

export default DateTimePickers;

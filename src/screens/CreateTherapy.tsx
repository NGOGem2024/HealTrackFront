import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Animated,
    KeyboardTypeOptions,
    ActivityIndicator,
    ScrollView,
    Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/types";
import axios from "axios";
import { MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

type AddNewTherapyScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, "CreateTherapy">;
};

const CreateTherapy: React.FC<AddNewTherapyScreenProps> = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [therapyData, setTherapyData] = useState({
        therapy_type: "",
        therapy_duration: "",
        therapy_remarks: "",
        therapy_cost: "",
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const [error, setError] = useState("");

    const categories = ["Virtual", "In Clinic", "InHome"];

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date());
    const [date, setDate] = useState<Date>(new Date()); 
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [duration, setDuration] = useState("");

    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDuration(`${diffDays} days`);
            setTherapyData({ ...therapyData, therapy_duration: `${diffDays} days` });
        }
    }, [startDate, endDate]);
 
    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === "ios");
        setDate(currentDate);
      };

    const onChangeStartTime = (event: any, selectedTime?: Date) => {
        setShowStartTimePicker(false);
        if (selectedTime) {
            setStartTime(selectedTime);
        }
    };

    const onChangeEndTime = (event: any, selectedTime?: Date) => {
        setShowEndTimePicker(false);
        if (selectedTime) {
            setEndTime(selectedTime);
        }
    };
 
    const showStartTimepicker = () => {
        setShowStartTimePicker(true);
    };

    const showEndTimepicker = () => {
        setShowEndTimePicker(true);
    };

    const handleAddTherapy = async () => {
        setIsLoading(true);
        setError("");

        try {
            const formatTime = (date: Date) => {
                return date.toTimeString().split(" ")[0].substr(0, 5);
            };

            const requestBody = {
                therapy_type: selectedCategory,
                therapy_date: startDate.toISOString().split("T")[0],
                therapy_start_time: formatTime(startTime),
                therapy_end_time: formatTime(endTime),
                therapy_duration: therapyData.therapy_duration,
                therapy_remarks: therapyData.therapy_remarks,
                therapy_cost: therapyData.therapy_cost,
            };

            const response = await axios.post(
                "http://192.168.31.101:5000/therepy/create",
                requestBody
            ); console.log(requestBody);

            if (response.status === 200 || response.status === 201) {
                Alert.alert("Success", "Therapy added successfully");
                navigation.goBack(); // Or navigate to a different screen
            } else {
                setError("Failed to add therapy. Please try again.");
            }
        } catch (error) {
            setError("An error occurred while adding therapy.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Add New Therapy</Text>
                <Dropdown
                    value={selectedCategory}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                    items={categories}
                />

                <TouchableOpacity style={styles.datePickerContainer} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.heading}>Date: </Text>
                    <View style={styles.dateDisplay}>
                        <MaterialIcons name="date-range" size={24} color="#119FB3" />
                        <Text style={styles.dateText}>{date.toDateString()}</Text>
                    </View>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                <View style={styles.dateTimeRow}>
                    <TimePickerField
                        label="Start Time"
                        time={startTime}
                        showTimePicker={showStartTimePicker}
                        onPress={showStartTimepicker}
                        onChange={onChangeStartTime}
                    />
                    <TimePickerField
                        label="End Time"
                        time={endTime}
                        showTimePicker={showEndTimePicker}
                        onPress={showEndTimepicker}
                        onChange={onChangeEndTime}
                    />
                </View>

                <InputField
                    icon={<MaterialIcons name="book" size={24} color="#119FB3" />}
                    placeholder="Therapy Remarks (e.g., 3 times a week)"
                    value={therapyData.therapy_remarks}
                    onChangeText={(text) =>
                        setTherapyData({ ...therapyData, therapy_remarks: text })
                    }
                />
                <InputField
                    icon={<FontAwesome name="money" size={24} color="#119FB3" />}
                    placeholder="Therapy Cost"
                    value={therapyData.therapy_cost}
                    onChangeText={(text) =>
                        setTherapyData({ ...therapyData, therapy_cost: text })
                    }
                    keyboardType="numeric"
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleAddTherapy}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Add Therapy</Text>
                    )}
                </TouchableOpacity>
            </Animated.View>
        </ScrollView>
    );
};

const InputField = ({
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default" as KeyboardTypeOptions,
}) => (
    <View style={styles.inputContainer}>
        {icon}
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholderTextColor="#A0A0A0"
        />
    </View>
);

const DatePickerField = ({
    label,
    date,
    showDatePicker,
    onPress,
    onChange,
}) => (
    <View style={styles.dateTimeBlock}>
        <Text style={styles.dateTimeLabel}>{label}</Text>
        <TouchableOpacity style={styles.dateTimeContainer} onPress={onPress}>
            <Text style={styles.dateTimeText}>{date.toLocaleDateString()}</Text>
            <FontAwesome name="calendar" size={24} color="#119FB3" />
        </TouchableOpacity>
        {showDatePicker && (
            <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
            />
        )}
    </View>
);

const TimePickerField = ({
    label,
    time,
    showTimePicker,
    onPress,
    onChange,
}) => (
    <View style={styles.dateTimeBlock}>
        <Text style={styles.dateTimeLabel}>{label}</Text>
        <TouchableOpacity style={styles.dateTimeContainer} onPress={onPress}>
            <Text style={styles.dateTimeText}>{time.toLocaleTimeString()}</Text>
            <AntDesign name="clockcircle" size={24} color="#119FB3" />
        </TouchableOpacity>
        {showTimePicker && (
            <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChange}
            />
        )}
    </View>
);

const Dropdown = ({ value, onValueChange, items }) => (
    <View style={styles.inputContainer}>
        <MaterialIcons name="category" size={24} color="#119FB3" />
        <Picker
            selectedValue={value}
            onValueChange={onValueChange}
            style={styles.picker}
        >
            <Picker.Item label="Therapy Type" value="" />
            {items.map((item, index) => (
                <Picker.Item key={index} label={item} value={item} />
            ))}
        </Picker>
    </View>
);

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: "#F0F8FF",
    },
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: "#F0F8FF",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#119FB3",
        textAlign: "center",
        marginBottom: 20,
        marginTop: 25,
    },

    heading: {
        fontSize: 16,
        marginBottom: 5,
        marginRight: 10,
        color: "#119FB3",
        marginLeft: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        elevation: 2,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginBottom:20,
        borderRadius:15,
    },
    dateDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 2,
        borderRadius: 5,
        padding: 12,
        flex: 1,
    },
    dateText: {
        marginLeft: 10,
        color: 'gray',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        color: "#333333",
        fontSize: 16,
        paddingVertical: 12,
    },
    dateTimeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    dateTimeBlock: {
        flex: 1,
        marginHorizontal: 2,
    },
    dateTimeLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#119FB3",
        marginBottom: 5,
    },
    dateTimeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        elevation: 2,
    },
    dateTimeText: {
        fontSize: 16,
        color: "#333333",
    },
    durationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    durationValue: {
        fontSize: 16,
        marginLeft: 10,
        color: "#333333",
    },
    saveButton: {
        backgroundColor: "#119FB3",
        paddingVertical: 12,
        borderRadius: 10,
        width: "50%",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 20,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    picker: {
        flex: 1,
        marginLeft: 10,
        color: "#333333",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
});

export default CreateTherapy;
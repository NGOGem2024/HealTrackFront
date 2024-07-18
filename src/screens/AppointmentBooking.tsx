import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import ConfirmationPopup from "./ConfirmationPopup";
import BackTabTop from "./BackTopTab";

const AppointmentBooking = () => {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentType, setAppointmentType] = useState("In Clinic");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const styles = createStyles(colors);

  const appointmentTypes = ["Online", "In Clinic", "In Home"];
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ];

  const formatDate = (date) => {
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === "ios");
    setSelectedDate(currentDate);
  };

  const bookAppointment = async () => {
    if (selectedSlot === null) {
      alert("Please select a time slot");
      return;
    }

    const appointmentDetails = {
      date: formatDate(selectedDate),
      time: timeSlots[selectedSlot],
      type: appointmentType,
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Appointment booked:", appointmentDetails);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };
  return (
    <View style={styles.container}>       
      <BackTabTop/>        
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Type</Text>
          <View style={styles.appointmentTypes}>
            {appointmentTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  appointmentType === type && styles.selectedTypeButton,
                ]}
                onPress={() => setAppointmentType(type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    appointmentType === type && styles.selectedTypeButtonText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={() => changeDate(-1)}>
              <Icon name="chevron-left" size={24} color="#119FB3" />
            </TouchableOpacity>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <TouchableOpacity onPress={() => changeDate(1)}>
              <Icon name="chevron-right" size={24} color="#119FB3" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.calendarIcon}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar-today" size={24} color="#119FB3" />
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          <View style={styles.slotsContainer}>
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.slotButton,
                  selectedSlot === index && styles.selectedSlot,
                ]}
                onPress={() => setSelectedSlot(index)}
              >
                <Text
                  style={[
                    styles.slotText,
                    selectedSlot === index && styles.selectedSlotText,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.bookButton} onPress={bookAppointment}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>

      <ConfirmationPopup
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        appointmentDetails={{
          date: formatDate(selectedDate),
          time: selectedSlot !== null ? timeSlots[selectedSlot] : "",
          type: appointmentType,
        }}
      />
    </View>
  );
};



const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      paddingTop: 40,
      // backgroundColor: colors.primary,
      backgroundColor:"#119FB3",
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.card,
      marginLeft: 16,
    },
    section: {
      padding: 16,
      backgroundColor: colors.card,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    appointmentTypes: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    typeButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      // borderColor: colors.primary,
      borderColor:"#119FB3",
    },
    selectedTypeButton: {
      // backgroundColor: colors.primary,
      backgroundColor:"#119FB3",
    },
    typeButtonText: {
          // backgroundColor: colors.primary,
          color:"#119FB3",
    },
    selectedTypeButtonText: {
      color: colors.card,
      // color:"#119FB3",
    },
    dateSelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dateText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    calendarIcon: {
      marginLeft: 16,
    },
    slotsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    slotButton: {
      borderWidth: 1,
      // borderColor: colors.border,
      borderColor:"#119FB3",
      borderRadius: 4,
      padding: 8,
      margin: 4,
    },
    selectedSlot: {
      // backgroundColor: colors.primary,
      backgroundColor:"#119FB3",
    },
    slotText: {
      color: colors.text,
    },
    selectedSlotText: {
      color: colors.card,
    },
    bookButton: {
      // backgroundColor: colors.primary,
      backgroundColor:"#119FB3",
      padding: 16,
      alignItems: "center",
      margin: 16,
      borderRadius: 8,
    },
    bookButtonText: {
      color: colors.card,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default AppointmentBooking;
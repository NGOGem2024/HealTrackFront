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
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/types";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Fontisto,
  AntDesign,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackTabTop from "./BackTopTab";
import { Picker } from "@react-native-picker/picker";

type UpdatePatientProps = {
  navigation: StackNavigationProp<RootStackParamList, "UpdatePatient">;
  route: { params: { patientId: string } };
};

const UpdatePatient: React.FC<UpdatePatientProps> = ({ navigation, route }) => {
  const { patientId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState({
    patient_first_name: "",
    patient_last_name: "",
    patient_email: "",
    patient_phone: "",
    patient_gender: "",
    patient_address1: "",
    patient_address2: "",
    patient_age: "",
    patient_bloodGroup: "",
    patient_symptoms: "",
    therepy_category: "",
    patient_diagnosis: "",
    patient_therapy_type: "",
    therapy_duration: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "Musculoskeletal",
    "Neurological",
    "Cardiorespiratory",
    "Paediatrics",
    "Women's Health",
    "Geriatrics",
    "Post surgical rehabilitation",
  ];

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
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
    }
  }, [startDate, endDate]);

  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const showStartDatepicker = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatepicker = () => {
    setShowEndDatePicker(true);
  };

  const handlePatientUpdate = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://192.168.31.101:5000/patient/update/${patientId}`,
        { ...patientData, patient_therapy_category: selectedCategory }
      );
      console.log("Response:", response.data);
      Alert.alert("Success", "Patient updated successfully");
      navigation.navigate("UpdatePatient");
    } catch (error) {
      console.error("Error updating patient:", error);
      Alert.alert("Error", "Failed to update patient");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackTabTop />
      <ScrollView style={styles.scrollView}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Update Patient</Text>
          <InputField
            icon={<Ionicons name="person" size={24} color="#119FB3" />}
            placeholder="First Name"
            value={patientData.patient_first_name}
            onChangeText={(text) =>
              setPatientData({ ...patientData, patient_first_name: text })
            }
          />
          <InputField
            icon={<Ionicons name="person" size={24} color="#119FB3" />}
            placeholder="Last Name"
            value={patientData.patient_last_name}
            onChangeText={(text) =>
              setPatientData({ ...patientData, patient_last_name: text })
            }
          />
          <InputField
            icon={<MaterialIcons name="email" size={24} color="#119FB3" />}
            placeholder="Email"
            value={patientData.patient_email}
            onChangeText={(text) =>
              setPatientData({ ...patientData, patient_email: text })
            }
          />
          <InputField
            icon={<Ionicons name="call" size={24} color="#119FB3" />}
            placeholder="Contact No"
            value={patientData.patient_phone}
            onChangeText={(text) =>
              setPatientData({ ...patientData, patient_phone: text })
            }
            keyboardType="numeric"
          />
          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender</Text>
            <View style={styles.genderButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  patientData.patient_gender === "male" &&
                    styles.genderButtonSelected,
                ]}
                onPress={() =>
                  setPatientData({ ...patientData, patient_gender: "male" })
                }
              >
                <Ionicons
                  name={
                    patientData.patient_gender === "male"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={24}
                  color={
                    patientData.patient_gender === "male"
                      ? "#119FB3"
                      : "#A0A0A0"
                  }
                />
                <Fontisto name="male" size={24} color="#119FB3" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  patientData.patient_gender === "female" &&
                    styles.genderButtonSelected,
                ]}
                onPress={() =>
                  setPatientData({ ...patientData, patient_gender: "female" })
                }
              >
                <Ionicons
                  name={
                    patientData.patient_gender === "female"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={24}
                  color={
                    patientData.patient_gender === "female"
                      ? "#119FB3"
                      : "#A0A0A0"
                  }
                />
                <Fontisto name="female" size={24} color="#119FB3" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  patientData.patient_gender === "other" &&
                    styles.genderButtonSelected,
                ]}
                onPress={() =>
                  setPatientData({ ...patientData, patient_gender: "other" })
                }
              >
                <Ionicons
                  name={
                    patientData.patient_gender === "other"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={24}
                  color={
                    patientData.patient_gender === "other"
                      ? "#119FB3"
                      : "#A0A0A0"
                  }
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    patientData.patient_gender === "other" &&
                      styles.genderButtonTextSelected,
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <InputField
            icon={<MaterialIcons name="bloodtype" size={24} color="#119FB3" />}
            placeholder="Blood Group"
            value={patientData.patient_bloodGroup}
            onChangeText={(text) =>
              setPatientData({ ...patientData, patient_bloodGroup: text })
            }
          />
          <InputField
            icon={<MaterialIcons name="numbers" size={24} color="#119FB3" />}
            placeholder="Age"
            value={patientData.patient_age}
            onChangeText={(text) =>
              setPatientData({ ...patientData, patient_age: text })
            }
            keyboardType="numeric"
          />
          <InputField
            icon={<Ionicons name="location" size={24} color="#119FB3" />}
            placeholder="Address"
            value={patientData.patient_address1}
            onChangeText={(text) =>
              setPatientData({ ...patientData, patient_address1: text })
            }
          />
          <InputField
            icon={<Ionicons name="medkit" size={24} color="#119FB3" />}
            placeholder="Symptom Details"
            value={patientData.patient_symptoms}
            onChangeText={(text) =>
              setPatientData({ ...patientData, patient_symptoms: text })
            }
          />
          <Dropdown
            value={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            items={categories}
          />
          <InputField
            icon={<FontAwesome name="stethoscope" size={24} color="#119FB3" />}
            placeholder="Diagnosis Details"
            value={patientData.patient_diagnosis}
            onChangeText={(text) =>
              setPatientData({ ...patientData, patient_diagnosis: text })
            }
          />
          <InputField
            icon={<MaterialIcons name="healing" size={24} color="#119FB3" />}
            placeholder="Therapy Type"
            value={patientData.patient_therapy_type}
            onChangeText={(text) =>
              setPatientData({ ...patientData, patient_therapy_type: text })
            }
          />
          <View style={styles.dateRow}>
            <DatePickerField
              label="Start Date"
              date={startDate}
              showDatePicker={showStartDatePicker}
              onPress={showStartDatepicker}
              onChange={onChangeStartDate}
            />
            <DatePickerField
              label="End Date"
              date={endDate}
              showDatePicker={showEndDatePicker}
              onPress={showEndDatepicker}
              onChange={onChangeEndDate}
            />
          </View>
          <View style={styles.durationContainer}>
            <AntDesign name="clockcircle" size={24} color="#119FB3" />
            <Text style={styles.durationValue}>{duration}</Text>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handlePatientUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </>
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
  <View style={styles.dateBlock}>
    <Text style={styles.dateLabel}>{label}</Text>
    <TouchableOpacity style={styles.dateContainer} onPress={onPress}>
      <Text style={styles.dateText}>{date?.toLocaleDateString()}</Text>
      <FontAwesome name="calendar" size={24} color="#119FB3" />
    </TouchableOpacity>
    {showDatePicker && (
      <DateTimePicker
        value={date || new Date()}
        mode="date"
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
      <Picker.Item label="Therapy Category" value="" />
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
    padding: 20,
    backgroundColor: "#F0F8FF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#119FB3",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#333333",
    fontSize: 16,
    paddingVertical: 12,
  },
  genderContainer: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#A0A0A0",
    marginBottom: 10,
  },
  genderButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  genderButtonSelected: {
    borderColor: "#119FB3",
    backgroundColor: "#E6F7FB",
  },
  genderButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333333",
  },
  genderButtonTextSelected: {
    color: "#119FB3",
    fontWeight: "bold",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateBlock: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#119FB3",
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 2,
  },
  dateText: {
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
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
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
});

export default UpdatePatient;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  Modal,
  Platform,
  TextInput,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/types";
import { Picker } from "@react-native-picker/picker";

interface Therapy {
  _id: string;
  patient_id: string;
  therepy_id: string;
  therepy_type: string;
  therepy_remarks: string;
  therepy_link: string;
  therepy_date: string;
  therepy_start_time?: string;
  therepy_end_time?: string;
  therepy_cost?: string;
}

type TherapyHistoryScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "TherapySession">;
  route: { params: { patientId: string } };
};

const TherapySession: React.FC<TherapyHistoryScreenProps> = ({ navigation, route }) => {
  const patientId = route.params?.patientId;

  const [therapies, setTherapies] = useState<Therapy[] | undefined>(undefined);
  const [pastTherapies, setPastTherapies] = useState<Therapy[]>([]);
  const [upcomingTherapies, setUpcomingTherapies] = useState<Therapy[]>([]);
  const [showPastTherapies, setShowPastTherapies] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRecPopup, setShowRecPopup] = useState<boolean>(false);
  const [recUrl, setRecUrl] = useState<string>("");
  const [therapyType, setTherapyType] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [editingTherapy, setEditingTherapy] = useState<Therapy | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [dropdownHeight] = useState(new Animated.Value(0));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!patientId) {
      setError("No patient ID provided.");
      return;
    }

    setIsLoading(true);
    fetch(`http://192.168.31.101:5000/therepy/${patientId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.therepys && Array.isArray(data.therepys)) {
          setTherapies(data.therepys);
          const now = new Date();
          const past = data.therepys.filter((therapy: Therapy) => new Date(therapy.therepy_date) < now);
          const upcoming = data.therepys.filter((therapy: Therapy) => new Date(therapy.therepy_date) >= now);

          setPastTherapies(past);
          setUpcomingTherapies(upcoming);
        } else {
          console.error("Unexpected data structure:", data);
          setError("Unexpected data structure received from server");
        }
      })
      .catch((error) => {
        console.error("Error fetching therapy data:", error);
        setError("Failed to fetch therapy data. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [patientId]);

  const toggleDropdown = () => {
    const toValue = isDropdownOpen ? 0 : 100;
    Animated.timing(dropdownHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectTherapyType = (type: 'past' | 'upcoming') => {
    setShowPastTherapies(type === 'past');
    toggleDropdown();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startTime;
    setShowStartTimePicker(Platform.OS === "ios");
    setStartTime(currentDate);
  };

  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endTime;
    setShowEndTimePicker(Platform.OS === "ios");
    setEndTime(currentDate);
  };

  const handleUpdateTherapy = async () => {
    if (!editingTherapy) return;

    try {
      const updatedTherapy = {
        ...editingTherapy,
        therepy_type: therapyType,
        therepy_remarks: remarks,
        therapy_cost: cost,
        therepy_date: date.toISOString().split('T')[0],
        therepy_start_time: startTime.toTimeString().split(' ')[0],
        therepy_end_time: endTime.toTimeString().split(' ')[0],
      };

      const response = await fetch(
        `http://192.168.43.158:5000/therepy/update/${patientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTherapy),
        }
      );

      if (response.ok) {
        const updatedTherapies = therapies?.map((therapy) =>
          therapy._id === editingTherapy._id ? updatedTherapy : therapy
        );
        setTherapies(updatedTherapies);
        setIsEditing(false);
        setEditingTherapy(null);
      } else {
        setError("Failed to update therapy.");
      }
    } catch (error) {
      setError("An error occurred while updating therapy.");
    }
  };

  const handleRecTherapy = async () => {
    try {
      const response = await fetch(`http://192.168.43.158:5000/recording`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecUrl(data.RecordingLink);
        setShowRecPopup(true);
      } else {
        setError("Failed to fetch recording URL.");
      }
    } catch (error) {
      setError("An error occurred while fetching recording URL.");
    }
  };

  const renderTherapyItem = ({ item }: { item: Therapy }) => (
    <View style={styles.therapyCard}>
      <View style={styles.therapyHeader}>
        <MaterialIcons name="event" size={24} color="#119FB3" />
        <Text style={styles.therapyType}>{item.therepy_type}</Text>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => {
            setEditingTherapy(item);
            setTherapyType(item.therepy_type);
            setRemarks(item.therepy_remarks);
            setCost(item.therepy_cost || "");
            setDate(new Date(item.therepy_date));
            setStartTime(new Date(`1970-01-01T${item.therepy_start_time}`));
            setEndTime(new Date(`1970-01-01T${item.therepy_end_time}`));
            setIsEditing(true);
          }}
        >
          <MaterialIcons name="edit" size={24} color="#119FB3" />
        </TouchableOpacity>
      </View>
      <View style={styles.therapyDetails}>
        <Text style={styles.therapyText}>Date: {item.therepy_date}</Text>
        <Text style={styles.therapyText}>Start Time: {item.therepy_start_time}</Text>
        <Text style={styles.therapyText}>End Time: {item.therepy_end_time}</Text>
        <Text style={styles.therapyText}>Cost: {item.therepy_cost}</Text>
        <Text style={styles.therapyText}>Remarks: {item.therepy_remarks}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.joinButton]}
          onPress={() => {/* Implement join session logic */}}
        >
          <Text style={styles.buttonText}>Join Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.recordButton]}
          onPress={handleRecTherapy}
        >
          <Text style={styles.buttonText}>Get Recording</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/bac2.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Therapy Session</Text>
        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
          <Text style={styles.dropdownButtonText}>
            {showPastTherapies ? "Past Therapies" : "Upcoming Therapies"}
          </Text>
          <Icon name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#FFFFFF" />
        </TouchableOpacity>

        <Animated.View style={[styles.dropdownContent, { height: dropdownHeight }]}>
          <TouchableOpacity onPress={() => selectTherapyType('past')} style={styles.dropdownItem}>
            <Text>Past Therapies</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectTherapyType('upcoming')} style={styles.dropdownItem}>
            <Text>Upcoming Therapies</Text>
          </TouchableOpacity>
        </Animated.View>

        {isLoading ? (
          <Text style={styles.loadingText}>Loading therapies...</Text>
        ) : (
          <FlatList
            data={showPastTherapies ? pastTherapies : upcomingTherapies}
            keyExtractor={(item) => item._id}
            renderItem={renderTherapyItem}
            ListEmptyComponent={
              <Text style={styles.noTherapyText}>
                No {showPastTherapies ? "past" : "upcoming"} therapies available
              </Text>
            }
          />
        )}

        {/* Edit Therapy Modal */}
        <Modal visible={isEditing} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Therapy</Text>
                <TouchableOpacity onPress={() => setIsEditing(false)}>
                  <MaterialIcons name="close" size={24} color="#119FB3" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="healing" size={24} color="#119FB3" style={styles.inputIcon} />
                <Picker
                  selectedValue={therapyType}
                  onValueChange={(itemValue) => setTherapyType(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Therapy Type" value="" />
                  <Picker.Item label="Virtual" value="Virtual" />
                  <Picker.Item label="In Home" value="In Home" />
                  <Picker.Item label="In Clinic" value="In Clinic" />
                </Picker>
              </View>

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

              <View style={styles.timeContainer}>
                <TouchableOpacity style={styles.timePickerContainer} onPress={() => setShowStartTimePicker(true)}>
                  <Text style={styles.heading}>Start Time: </Text>
                  <View style={styles.timeDisplay}>
                    <Ionicons name="time-sharp" size={24} color="#119FB3" />
                    <Text style={styles.timeText}>{startTime.toLocaleTimeString()}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.timePickerContainer} onPress={() => setShowEndTimePicker(true)}>
                  <Text style={styles.heading}>End Time: </Text>
                  <View style={styles.timeDisplay}>
                    <Ionicons name="time-sharp" size={24} color="#119FB3" />
                    <Text style={styles.timeText}>{endTime.toLocaleTimeString()}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onStartTimeChange}
                />
              )}

              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onEndTimeChange}
                />
              )}

               <View style={styles.inputContainer}>
                <MaterialIcons name="comment" size={24} color="#119FB3" style={styles.inputIcon} />
                <TextInput
                  style={styles.picker}
                  value={remarks}
                  onChangeText={setRemarks}
                  placeholder="Remarks"
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="money" size={24} color="#119FB3" style={styles.inputIcon} />
                <TextInput
                  style={styles.picker}
                  value={cost}
                  onChangeText={setCost}
                  placeholder="  Cost For Therapy"
                  keyboardType="numeric"
                />
              </View>


              {/* ... (keep the rest of the modal content) */}

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleUpdateTherapy}
                >
                  <Text style={styles.modalButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ... (keep the existing Recording URL Modal) */}

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // ... (keep existing styles)

  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 159, 179, 0.8)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginLeft: -25,
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 2,
  },
  picker: {
    flex: 1,
    height: 50,
    // marginTop:10,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(17, 159, 179, 0.1)",
  },
  datePickerText: {
    fontSize: 16,
    color: "black",
    marginBottom: 20,
    marginLeft: 40,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputIcon: {
    marginLeft: 10,

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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 20,
  },
  in: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    width: "80%",
    marginLeft: 30,
    elevation: 2,
  },
  error: {
    color: "#FF6B6B",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
  },
  theraddButton: {
    backgroundColor: "#119FB3",
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 3,
  },
  therapyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  therapyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  therapyType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#119FB3",
    marginLeft: 8,
  },
  therapyDetails: {
    marginBottom: 12,
  },
  therapyText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
    backgroundColor: "#fff",
    elevation: 2
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    // backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  joinButton: {
    borderRadius: 20,
  },

  gradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: '#119FB3',
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",

  },
  addButton: {
    borderRadius: 10,
    overflow: "hidden",
    width: "45%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",

  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
  },
  noTherapyText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  dropdownContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    width: '100%',
  },
  recordButton: {
    backgroundColor: "#FF6B6B",
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#119FB3",
    marginBottom: 10,
    textAlign: "center",
    // marginLeft:30,    
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  activeButton: {
    backgroundColor: '#2a7fba',
  },
  modalButton1: {
    justifyContent: "center",
    color: " #2a7fba",
    marginTop: 30,
    width: "20%",
    marginLeft: "30%",
    marginBottom: 20,
    height: 45,
  },
  modalButton2: {
    justifyContent: "center",
    color: " #2a7fba",
    marginTop: 30,
    width: "20%",
    marginLeft: 20,
    marginBottom: 20,
    height: 45,
  },
  cross: {
    marginHorizontal: '92%',
    fontSize: 38,
    marginTop: -45,
    marginRight: -50,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  modalButton: {
    backgroundColor: "#119FB3",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF6B6B",
  },
  timeBoxContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  timeBox: {
    borderWidth: 1,
    borderColor: '#119FB3',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    textAlign: 'center',
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#119FB3',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    margin: 5,
  },
  timePickerContainer: {
    flex: 1,
    marginRight: 5,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    gap: 5,
  },
  timeText: {
    marginLeft: 5,
    color: 'gray',
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(17, 159, 179, 0.5)',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeToggleButton: {
    backgroundColor: '#119FB3',
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },


  // ... (keep other existing styles)
});

export default TherapySession;
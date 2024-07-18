import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ImageBackground,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

interface TherapyResponse {
  therepys: Therapy[];
  responseData: {
    HostJoinUrl: string;
  };
}

type TherapyTableProps = {
  navigation: StackNavigationProp<RootStackParamList, "UpdateTherapy">;
  route: { params: { patientId: string } };
};


const TherapyTable: React.FC<TherapyTableProps> = ({ navigation, route }) => {
  // Safely access patientId using optional chaining
  const patientId = route.params?.patientId;

  const [therapies, setTherapies] = useState<Therapy[] | undefined>(undefined);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  
  const [showHostPopup, setShowHostPopup] = useState<boolean>(false);
  const [showRecPopup, setShowRecPopup] = useState<boolean>(false);
  const [showStartTherapyBut, setShowStartTherapyBut] =
    useState<boolean>(false);
  const [joinurl, setJoinurl] = useState<string>("");
  const [recUrl, setRecUrl] = useState<string>("");
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [therapyType, setTherapyType] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date()); 

  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingTherapy, setEditingTherapy] = useState<Therapy | null>(null);
  const [showEditStartPicker, setShowEditStartPicker] = useState(false);
  const [showEditEndPicker, setShowEditEndPicker] = useState(false);

  // ... (keep your existing useEffect and other functions)
  const onEditStartChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startTime;
    setShowEditStartPicker(Platform.OS === "ios");
    setStartTime(currentDate);
  };

  const onEditEndChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endTime;
    setShowEditEndPicker(Platform.OS === "ios");
    setEndTime(currentDate);
  };

  const handleCloseEditModal = () => {
    setIsEditing(false);
    setEditingTherapy(null);
  };

  
  const handleEditTherapy = (therapy: Therapy) => {
    setEditingTherapy(therapy);
    setIsEditing(true);
    setTherapyType(therapy.therepy_type);
    setRemarks(therapy.therepy_remarks);
    setCost(therapy.therepy_cost || "");
    setStartTime(new Date(therapy.therepy_start_time || new Date()));
    setEndTime(new Date(therapy.therepy_end_time || new Date()));
  };

  const handleUpdateTherapy = async () => {
    if (!editingTherapy) return;

    try {
      const updatedTherapy = {
        ...editingTherapy,
        therepy_type: therapyType,
        therepy_remarks: remarks,
        therapy_cost: cost,
        therepy_start_time: startTime.toISOString(),
        therepy_end_time: endTime.toISOString(),
      };

      const response = await fetch(
        `http://192.168.43.158:5000/therepy/update/${editingTherapy._id}`,
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

  useEffect(() => {
    if (!patientId) {
      setError("No patient ID provided.");
      return;
    }

    setIsLoading(true);
    console.log(patientId);
    fetch(`http://192.168.43.158:5000/therepy/${patientId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        if (data.therepys && Array.isArray(data.therepys)) {
          setTherapies(data.therepys);
          navigation.navigate("UpdateTherapy");
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
 

  const handleAddTherapy = async () => {
    try {
      const requestBody = {
        contactId: patientId,
        message: "Please click the following LiveSwitch conversation link.",
        type: "LiveConversation",
        autoStartRecording: true,
        sendSmsNotification: true,
        remarks: remarks,
        cost: cost,
        therepy_type: therapyType,
        therepy_start_time: startTime.toISOString(),
        therepy_end_time: endTime.toISOString(),
      };

      const response = await fetch(
        `http://192.168.43.158:5000/therepy/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data: TherapyResponse = await response.json();
        setTherapies(data.therepys);
        setJoinurl(data.responseData.HostJoinUrl);
        setShowHostPopup(true);
        setShowPopup(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add therapy.");
      }
    } catch (error) {
      setError("An error occurred while adding therapy.");
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

  const handleStartTherapy = (joinUrl: string) => {
    setIframeUrl(joinUrl);
    setShowStartTherapyBut(true);
  };

  const handleStopTherapy = () => {
    setIframeUrl("");
    setShowStartTherapyBut(false);
  };

  const onStartChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startTime;
    setShowStartPicker(Platform.OS === "ios");
    setStartTime(currentDate);
  };

  const onEndChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endTime;
    setShowEndPicker(Platform.OS === "ios");
    setEndTime(currentDate);
  };
     

  return (
    <ImageBackground
      source={require("../assets/bac2.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Therapy Sessions</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        {isLoading ? (
          <Text style={styles.loadingText}>Loading therapies...</Text>
        ) : therapies && therapies.length > 0 ? (
          <FlatList
            data={therapies}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.therapyCard}>
                <View style={styles.therapyHeader}>
                  <MaterialIcons name="event" size={24} color="#119FB3" />
                  <Text style={styles.therapyType}>{item.therepy_type}</Text>
                  <TouchableOpacity
                  style={styles.editIcon}
                  onPress={()=> setIsEditing(true)}
                  >
                  <MaterialIcons name="edit" size={24} color="#119FB3"/>
                  </TouchableOpacity>
                </View>
                <View style={styles.therapyDetails}>
                  <Text style={styles.therapyText}>Date: {item.therepy_date}</Text>
                  <Text style={styles.therapyText}>Start Time: {item.therepy_start_time}</Text>
                  <Text style={styles.therapyText}>End Time: {item.therepy_end_time}</Text>
                  <Text style={styles.therapyText}>Cost For Therapy: {item.therepy_cost}</Text>
                  <Text style={styles.therapyText}>Remarks: {item.therepy_remarks}</Text>
                  {/* <Text>Link: {item.therepy_link}</Text>                   */}
                </View>

                <View style={styles.buttonContainer}>

                  <TouchableOpacity
                    style={[styles.addButton, styles.gradient]}
                    onPress={() => handleStartTherapy(item.therepy_link)}
                  >
                    <Text style={styles.joinButtonText}>Join Session</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.addButton, styles.gradient]}
                    onPress={handleRecTherapy}
                  >
                    <Text style={styles.buttonText}>Get Recording</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noTherapyText}>No therapies available</Text>
        )}

          {/* Edit Therapy Modal */}
          <Modal visible={isEditing} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalTitle}>
                <Text style={styles.modalTitle}>Update Therapy</Text>
                <TouchableOpacity onPress={()=>setIsEditing(false)}>
                  <MaterialIcons name="close" size={24} color="#119FB3" style={styles.cross} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="healing" size={24} color="#119FB3" style={styles.inputIcon} />
                <Picker
                  selectedValue={therapyType}
                  onValueChange={(itemValue) => setTherapyType(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Therapy Type" value="Select Therapy Type" />
                  <Picker.Item label="Virtual" value="Virtual" />
                  <Picker.Item label="In Home" value="In Home" />
                  <Picker.Item label="In Clinic" value="In Clinic" />
                </Picker>
              </View>

              <View style={styles.timeContainer}>
                <TouchableOpacity style={styles.timePickerContainer} onPress={() => setShowEditStartPicker(true)}>
                  <Text style={styles.heading}>Start Time: </Text>
                  <View style={styles.timeDisplay}>
                    <Ionicons name="time-sharp" size={24} color="#119FB3" />
                    <Text style={styles.timeText}>{startTime.toLocaleTimeString()}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.timePickerContainer} onPress={() => setShowEditEndPicker(true)}>
                  <Text style={styles.heading}>End Time: </Text>
                  <View style={styles.timeDisplay}>
                    <Ionicons name="time-sharp" size={24} color="#119FB3" />
                    <Text style={styles.timeText}>{endTime.toLocaleTimeString()}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {showEditStartPicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="default"
                  onChange={onEditStartChange}
                />
              )}

              {showEditEndPicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="default"
                  onChange={onEditEndChange}
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
                  placeholder="Cost For Therapy"
                  keyboardType="numeric"
                />
              </View>

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

        {/* Keep existing Modal components with updated styles */}
        
        <TouchableOpacity onPress={() => setShowPopup(true)} style={styles.theraddButton}>
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Add Therapy Modal */}
        <Modal visible={showPopup} animationType="slide" transparent={true}>
          {/* <Animated.View style={[styles.container, { opacity: fadeAnim }]}> */}
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalTitle}>
                <Text style={styles.modalTitle}>Add New Therapy</Text>
                <TouchableOpacity
                  onPress={() => setShowPopup(false)}
                >
                  <MaterialIcons name="close" size={24} color="#119FB3" style={styles.cross} />
                </TouchableOpacity>

              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="healing" size={24} color="#119FB3" style={styles.inputIcon} />
                <Picker
                  selectedValue={therapyType}
                  onValueChange={(itemValue) => setTherapyType(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Therapy Type" value="Select Therapy Type" />
                  <Picker.Item label="Virtual" value="Virtual" />
                  <Picker.Item label="In Home" value="In Home" />
                  <Picker.Item label="In Clinic" value="In Clinic" />
                  {/* Add more therapy types as needed */}
                </Picker>

              </View>
              <View style={styles.timeContainer}>
                <TouchableOpacity style={styles.timePickerContainer} onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.heading}>Start Time: </Text>
                  <View style={styles.timeDisplay}>
                    <Ionicons name="time-sharp" size={24} color="#119FB3" />
                    <Text style={styles.timeText}>{startTime.toLocaleTimeString()}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.timePickerContainer} onPress={() => setShowEndPicker(true)}>
                  <Text style={styles.heading}>End Time: </Text>
                  <View style={styles.timeDisplay}>
                    <Ionicons name="time-sharp" size={24} color="#119FB3" />
                    <Text style={styles.timeText}>{endTime.toLocaleTimeString()}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {showStartPicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="default"
                  onChange={onStartChange}
                />
              )}

              {showEndPicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="default"
                  onChange={onEndChange}
                />
              )}

              <View style={styles.inputContainer}>
                <MaterialIcons name="comment" size={24} color="#119FB3" style={styles.inputIcon} />
                <TextInput
                  style={styles.picker}
                  value={remarks}
                  onChangeText={setRemarks}
                  placeholder="   Remarks"
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="money" size={24} color="#119FB3" style={styles.inputIcon} />
                <TextInput
                  style={styles.picker}
                  value={cost}
                  onChangeText={setCost}
                  placeholder="   Cost For Therapy"
                  keyboardType="numeric"
                />
                
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleAddTherapy}
                >
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
          {/* </Animated.View> */}
        </Modal>


        {/* ... (keep other modals with similar styling updates) */}

      </View>
    </ImageBackground>
  );
};

export default TherapyTable;

const styles = StyleSheet.create({
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
    // overflow: "hidden",
  },
  // button: {
  //       flexDirection: "row",
  //       marginHorizontal: -50,
  //       marginTop: -15,
  //     },
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
  noTherapyText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
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
  // ... (add more styles as needed)
});


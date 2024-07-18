import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, FlatList, TextInput, Platform,KeyboardAvoidingView, Pressable } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { RootStackParamList } from "../types/types"; // Correct the import path if necessary
import {openBrowserAsync} from 'expo-web-browser';

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
}

interface TherapyResponse {
  therepys: Therapy[];
  responseData: {
    HostJoinUrl: string;
  };
}

interface TherapyFormData {
  therapyType: string;
  startTime: Date;
  endTime: Date;
  remarks: string;
}

type UpdateTherapyScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'UpdateTherapy'>;
  route: RouteProp<RootStackParamList, 'UpdateTherapy'>;
};

const TherapyTable: React.FC<UpdateTherapyScreenProps> = ({ route }) => {
  const [therapies, setTherapies] = useState<Therapy[] | undefined>(undefined);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showHostPopup, setShowHostPopup] = useState<boolean>(false);
  const [showRecPopup, setShowRecPopup] = useState<boolean>(false);
  const [showStartTherapyBut, setShowStartTherapyBut] = useState<boolean>(false);
  const [joinurl, setJoinurl] = useState<string>("");
  const [recUrl, setRecUrl] = useState<string>("");
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [therapyType, setTherapyType] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);

  const { patientId } = route.params;

  useEffect(() => {
    fetch(`http://192.168.31.101:5000/therepy/${patientId}`)
      .then((response) => response.json())
      .then((data) => {
        setTherapies(data.therepys);
      })
      .catch((error) => console.error("Error fetching therapy data:", error));
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
        therepy_type: therapyType,
        therepy_start_time: startTime.toISOString(),
        therepy_end_time: endTime.toISOString(),        
      };

      const response = await fetch(`http://192.168.31.101:5000/therepy/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

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
      
    } 
    
    catch (error) {
      setError("An error occurred while adding therapy.");
    }
  };

  const handleRecTherapy = async () => {
    try {
      const response = await fetch(`http://192.168.31.101:5000/recording`, {
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

  // const handleStartTherapy = async () => {
  //   // setIframeUrl(joinUrl);
  //   await WebBrowser.openBrowserAsync('https://api.staging.liveswitch.com/contact/public/answer?__suptoken=VFEKCF&supparticipantid=01eabe1c-11b1-4f59-bf3f-41013542a116&supuserid=300accd6-69be-42d2-99f0-065666ea578d&suporganizationid=d768729e-00a7-4c26-b0a4-644e31056d9e&supconversationid=39634e2d-b04d-4e37-b6db-8efd69d4d246&supconversationtoken=bb96w%40o6qs%24n&usesapprecording=undefined&recordingsupported=true&app=contact&source=DASHBOARD');
  //   setShowStartTherapyBut(false);
  // };

  const handleStopTherapy = () => {
    setIframeUrl("");
    setShowStartTherapyBut(false);
  };

  const onStartChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startTime;
    setShowStartPicker(Platform.OS === 'ios');
    setStartTime(currentDate);
  };

  const onEndChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endTime;
    setShowEndPicker(Platform.OS === 'ios');
    setEndTime(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Therapy Table</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={therapies}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.therapyItem}>
            <Text>Type: {item.therepy_type}</Text>
            <Text>Date: {item.therepy_date}</Text>
            <Text>Start Time: {item.therepy_start_time}</Text>
            <Text>End Time: {item.therepy_end_time}</Text>
            <Text>Remarks: {item.therepy_remarks}</Text>
            {/* <Text>LiveSwitch Link:</Text><Text style={{color:'#2a7fba'}}> {item.therepy_link}</Text> */}
            <Pressable style={styles.join}>
              {/* <LinearGradient colors={['', '#d3eaf2']} > */}
                <Button color="#2a7fba" title="Join" onPress={()=> openBrowserAsync("https://api.staging.liveswitch.com/contact/public/answer?__suptoken=VFEKCF&supparticipantid=01eabe1c-11b1-4f59-bf3f-41013542a116&supuserid=300accd6-69be-42d2-99f0-065666ea578d&suporganizationid=d768729e-00a7-4c26-b0a4-644e31056d9e&supconversationid=39634e2d-b04d-4e37-b6db-8efd69d4d246&supconversationtoken=bb96w%40o6qs%24n&usesapprecording=undefined&recordingsupported=true&app=contact&source=DASHBOARD")} />
              {/* </LinearGradient> */}
            </Pressable>
          </View>
        )}
      />
      <View style={styles.btnContainer}>
        <View style={styles.btn}>
          <Button color="#2a7fba" title="Add Therapy" onPress={() => setShowPopup(true)} />
        </View>
        <View style={styles.btn}>
          <Button color="#2a7fba" title="Get Recording" onPress={handleRecTherapy} />      
        </View>
      </View>
      <Modal visible={showPopup} animationType="slide">
        <GestureHandlerRootView>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <TouchableWithoutFeedback>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add New Therapy</Text>
                <Text style={styles.heading}>Therapy Type:</Text>
                <TextInput
                  style={styles.input}
                  value={therapyType}
                  onChangeText={setTherapyType}
                  placeholder="Therapy Type"
                />
                <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.heading}>Start Time: </Text>
                  <Text style={styles.datePickerText}>
                    <Text style={styles.in}><Ionicons name="time-sharp" size={24} color="black" /> {startTime.toLocaleTimeString()}</Text>
                  </Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={onStartChange}
                  />
                )}
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                  <Text style={styles.heading}>End Time: </Text>
                  <Text style={styles.datePickerText}>
                    <Text style={styles.in}><Ionicons name="time-sharp" size={24} color="black" /> {endTime.toLocaleTimeString()}</Text>
                  </Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={onEndChange}
                  />
                )}
                 <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.heading}>Start Date: </Text>
                  <Text style={styles.datePickerText}>
                    <Text style={styles.in}>
                      {/* <Ionicons name="time-sharp" size={24} color="black" />  */}
                      {startTime.toLocaleDateString()}</Text>
                  </Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={onStartChange}
                  />
                )}
                 
                
                <Text style={styles.heading}>Remarks:</Text>
                <TextInput
                  style={styles.input}
                  value={remarks}
                  onChangeText={setRemarks}
                  placeholder="Remarks"
                  multiline
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleAddTherapy} style={styles.button}>
                    <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowPopup(false)} style={styles.button}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </GestureHandlerRootView>
      </Modal>
      <Modal visible={showHostPopup} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Host Join URL</Text>
          <Text>{joinurl}</Text>
          <Button title="Close" onPress={() => setShowHostPopup(false)} />
        </View>
      </Modal>
      <Modal visible={showRecPopup} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Recording URL</Text>
          <Text>{recUrl}</Text>
          <Button title="Close" onPress={() => setShowRecPopup(false)} />
        </View>
      </Modal>
      {showStartTherapyBut && (
        <View style={styles.iframeContainer}>
          <TouchableOpacity onPress={handleStopTherapy} style={styles.stopButton}>
            <Text style={styles.stopButtonText}>Stop Therapy</Text>
          </TouchableOpacity>
          <Text>Join URL: {iframeUrl}</Text>
        </View>
      )}
    </View>
  );
};

export default TherapyTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginTop:'10%',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  join: {
    marginTop: 10,
    alignSelf: 'center',
    flex: 1,
    width: '40%',
    height: '40%',
    color:'#d3eaf2',
    backgroundColor:'#d3eaf2',
     borderRadius:50,
    marginBottom:10,
  },
  therapyItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    fontSize: 14,
     
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: -5,     
    borderRadius:50,
    // width: -50,
  },
  btn: {
    flex: 1,
    marginHorizontal: 10,
    // borderRadius:20,
    padding: -10,
    borderRadius: 50,
    // alignItems: "center",
  },
  modalContent: {
    padding: 10,
    height:'50%',
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    // marginTop:-30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#2a7fba",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#aaa",
  },
  iframeContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  stopButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  stopButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  heading: {
    fontSize: 16,
    // fontWeight: "bold",
    marginBottom: 5,
  },
  datePickerText: {
    fontSize: 16,
    marginBottom: 15,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  in: {
    paddingVertical: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: "#ccc",
  },
});
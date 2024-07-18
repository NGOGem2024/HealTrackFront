import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Animated,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/types";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import BackTabTop from "./BackTopTab";

type PatientRegisterScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "PaitentRegister">;
};

const PaitentRegister: React.FC<PatientRegisterScreenProps> = ({ navigation }) => {
  const [patientData, setPatientData] = useState({
    patient_first_name: "",
    patient_last_name: "",
    patient_email: "",
    patient_phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePatientRegister = async () => {
    setIsLoading(true);
    try {
      const formattedData = {
        ...patientData,
        patient_phone: "+91" + patientData.patient_phone,
      };

      const response = await axios.post(
        "http://192.168.31.101:5000/patient/registration",
        formattedData
      );
      console.log("Response:", response.data);
      Alert.alert("Success", "Patient registered successfully");
    } catch (error) {
      console.error("Error registering patient:", error);
      Alert.alert("Error", "Failed to register patient");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bac2.jpg")}
      style={styles.backgroundImage}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BackTabTop />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Register Patient</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={patientData.patient_first_name}
                onChangeText={(text) =>
                  setPatientData({ ...patientData, patient_first_name: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={patientData.patient_last_name}
                onChangeText={(text) =>
                  setPatientData({ ...patientData, patient_last_name: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={patientData.patient_email}
                onChangeText={(text) =>
                  setPatientData({ ...patientData, patient_email: text })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="+91 Contact No."
                value={"+91" + patientData.patient_phone}
                onChangeText={(text) =>
                  setPatientData({
                    ...patientData,
                    patient_phone: text.slice(3),
                  })
                }
                 keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePatientRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton1}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText1}>Back to Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </GestureHandlerRootView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#119FB3",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 5,
    padding: 10,
    color: "#333333",
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#119FB3",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  backButton1: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#119FB3",
  },
  backButtonText1: {
    color: "#119FB3",
    fontWeight: "bold",
  },
});

export default PaitentRegister;
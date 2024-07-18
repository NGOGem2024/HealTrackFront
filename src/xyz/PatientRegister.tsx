import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/types";
import UpdatePatient from "./UpdatePatient";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import axios from "axios";

type PatientRegisterScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "PaitentRegister">;
};

const PaitentRegister: React.FC<PatientRegisterScreenProps> = ({ navigation }) => {
  const [patientData, setPatientData] = useState({
    patient_first_name: '',
    patient_last_name: '',
    patient_email: '',
    patient_phone: '',
  });




  const handlePatientRegister = async () => {
    try {

      const response = await axios.post('http://192.168.31.101:5000/patient/registration', patientData);
      console.log('Response:', response.data);
      // Handle successful registration, e.g., show a success message
      Alert.alert('Success', 'Patient registered successfully');
      navigation.navigate('UpdatePatient');
    } catch (error) {
      console.error('Error registering patient:', error);
      // Handle error, e.g., show an error message
      Alert.alert('Error', 'Failed to register patient');
    }

  };


  return (
    <GestureHandlerRootView style={{flex:1, backgroundColor:"white"}}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.subcontainer}>
          <Text style={styles.title}> Register  patient</Text>
          <View style={styles.inputout}>
            <Text style={[styles.label, styles.nameLabel]}>First Name:</Text>
            <TextInput
              style={styles.input}
              value={patientData.patient_first_name}
              onChangeText={(text) => setPatientData({ ...patientData, patient_first_name: text })}

            />
          </View>
          <View style={styles.inputout}>

            <Text style={[styles.label, styles.nameLabel]}>Last Name:</Text>

            <TextInput
              style={styles.input}
              value={patientData.patient_last_name}
              onChangeText={(text) => setPatientData({ ...patientData, patient_last_name: text })}

            />
          </View>
          <View style={styles.inputout}>

            <Text style={[styles.label, styles.nameLabel]}>Email:</Text>

            <TextInput
              style={styles.input}
              value={patientData.patient_email}
              onChangeText={(text) => setPatientData({ ...patientData, patient_email: text })}

            />
          </View>
          <View style={styles.inputout}>
            <Text style={[styles.label, styles.nameLabel]}>ContactNo:</Text>

            <TextInput
              style={styles.input}
              value={patientData.patient_phone}
              onChangeText={(text) => setPatientData({ ...patientData, patient_phone: text })}

            />
          </View>

          <View style={styles.btn}>
            <Button
              color="#2a7fba"
              title="Save"
              onPress={handlePatientRegister}
            />
          </View>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 35,
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
     
  },
  title: {
    fontSize: 30,
    marginBottom: 50,
    color: "#2a7fba",
    textAlign: "center",
    marginTop:40,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    width: "30%",
    marginRight: 10,
    color: "white",
    fontSize: 35,
    marginLeft:10,
  },
  nameLabel: {
    fontSize: 15,
    color: "black", // Custom font size for Patient Name label
    marginBottom:5,
  },
  subcontainer:{
    marginTop:'40%',
    marginBottom:'10%',
    backgroundColor:'white',
    elevation:20,
    width:'100%',
    height:'60%',
    flex:1,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 10,
    // backgroundColor: "white",
    borderRadius: 5,
    color: "#333",
    backgroundColor: "#d3eaf2",
    width:'95%',
    marginLeft:8,
  },
  inputout: {
    marginBottom: 15,
    
  },
  btn: {
    marginTop: 10,
    width: "50%",
    marginLeft:80,
    marginBottom:20,
    height:40,
  },
});


export default PaitentRegister;

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/types'; // Update with the correct path
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Title } from 'react-native-paper';
import TherapyTable from '../UpdateTherapy'; // Update with the correct path

type PatientScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Patient'>;
  route: { params: { patientid: string } };
};

const PatientScreen: React.FC<PatientScreenProps> = ({ navigation, route }) => {
  const { patientid } = route.params;
  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://192.168.31.101:5000/patient/${patientid}`);
        const data = await response.json();
        setPatientData(data.patientData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatientData();
  }, [patientid]);

  return (
    <View style={styles.main}>
      <LinearGradient colors={["#2a7fba", "#d3eaf2"]} style={{ height: "15%" }} />
      <View
        style={{
          marginLeft: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
        }}
      >
        {patientData ? (
          <>
            <Image
              style={{
                width: 140,
                height: 140,
                borderRadius: 140 / 2,
                marginTop: -60,
              }}
              source={require("../../assets/profile.png")}
            />

            <Title style={{ fontSize: 23, color: "" }}>{patientData.patient_first_name} {patientData.patient_last_name}</Title>
            
            <View style={styles.content}>
              <MaterialIcons name="email" size={20} color="#333333" />
              <Text style={styles.mytext}> {patientData.patient_email}</Text>
            </View>
             
            <View style={styles.content}>
              <MaterialIcons name="call" size={20} color="#333333" />
              <Text style={styles.mytext}> {patientData.patient_phone}</Text>
            </View>

            <View style={styles.content}>
              <AntDesign name="idcard" size={20} color="#333333" />
              <Text style={styles.mytext}> {patientData.patient_id}</Text>
            </View>

            <View style={styles.content}>
              <MaterialIcons name="location-on" size={20} color="#333333" />
              <Text style={styles.mytext}> {patientData.patient_address1}</Text>
            </View>

            <View style={styles.content}>
              <MaterialIcons name="location-on" size={20} color="#333333" />
              <Text style={styles.mytext}> {patientData.patient_address2}</Text>
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>

      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.linkContainer}
            onPress={() => navigation.navigate('UpdatePatient', { patientId: patientData?.patient_id })}
            disabled={!patientData}
          >
            <Text style={styles.link}>Update-Patient</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkContainer}
            onPress={() => navigation.navigate('UpdateTherapy', { patientId: patientData?.patient_id })}
            disabled={!patientData}
          >
            <Text style={styles.link}>Therapy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkContainer}>
            <Text style={styles.link}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkContainer}>
            <Text style={styles.link}>Remarks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkContainer}>
            <Text style={styles.link}>Media</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: "row",
    margin: 3,
  },
  mytext: {
    fontSize: 15,
    color: "#333333",
  },
  container: {
    padding: 20,
    justifyContent: "center",
    flexDirection: "row",
    marginTop: -10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  link: {
    fontSize: 18,
    marginBottom: 5,
    color:'grey',
    rowGap:5,
    // elevation:20,
  },
  linkContainer: {
    paddingHorizontal: 10,
    // color: "#d3eaf2",
    borderRadius: 10,
    marginHorizontal: 20,
    marginLeft: -15,
    height:30,         
    backgroundColor:'lightblue',
  },
  content1:{
    margin:5,
    fontSize:10,    
    marginBottom:-15 
  },
});

export default PatientScreen;
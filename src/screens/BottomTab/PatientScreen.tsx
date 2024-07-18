import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,   
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/types"; // Update with the correct path
import {
  MaterialIcons,
  AntDesign,
  Octicons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";  
import { Title } from "react-native-paper"; 
import BackTabTop from "../BackTopTab";
import TherapySession from "../TherapySession";

type PatientScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Patient">;
  route: { params: { patientId: string } };
};

const PatientScreen: React.FC<PatientScreenProps> = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(
          `http://192.168.31.101:5000/patient/${patientId}`
        );
        const data = await response.json();
        setPatientData(data.patientData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BackTabTop />
      <View style={styles.main}>
        <Image
          source={require("../../assets/bac2.jpg")}
          resizeMode="cover"
          style={styles.backcover}
        ></Image>
     
        <View
          style={{
            paddingLeft: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {patientData ? (
            <>
              <Image
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 140 / 2,
                  marginTop: 10,
                  borderWidth: 3,
                  borderColor: "white",
                }}
                source={require("../../assets/profile3.jpg")}
              />

              <Title
                style={{ fontSize: 23, color: "white", fontWeight: "bold" }}
              >
                {patientData.patient_first_name} {patientData.patient_last_name}
              </Title>

              <View style={styles.content}>
                <MaterialIcons name="email" size={20} color="white" />
                <Text style={styles.mytext}> {patientData.patient_email}</Text>
              </View>

              <View style={styles.content}>
                <MaterialIcons name="call" size={20} color="white" />
                <Text style={styles.mytext}> {patientData.patient_phone}</Text>
              </View>

              <View style={styles.content}>
                <AntDesign name="idcard" size={20} color="white" />
                <Text style={styles.mytext}> {patientData.patient_id}</Text>
              </View>

              <View style={styles.content}>
                <MaterialIcons name="location-on" size={20} color="white" />
                <Text style={styles.mytext}>
                  {patientData.patient_address1}
                </Text>
              </View>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>

        <ScrollView style={styles.botscrview}>
          <Text style={styles.headlist}>Account Overview</Text>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() =>
                navigation.navigate("UpdatePatient", {
                  patientId: patientData?.patient_id,
                })
              }
              disabled={!patientData}
            >
              <View style={styles.iconleft}>
                <MaterialCommunityIcons
                  name="square-edit-outline"
                  size={30}
                  color="#65b6e7"
                  style={styles.iconlist}
                />
                <Text style={styles.link}>Update Patient</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() =>
                navigation.navigate("CreateTherapy")
              }
              disabled={!patientData}
            >
              <View style={styles.iconleft}>
                <Ionicons
                  name="medical"
                  size={30}
                  color="#55b55b"
                  style={[styles.iconlist, styles.therapyicon]}
                />
                <Text style={styles.link}>Create Therapy</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.linkContainer}
            onPress={()=>navigation.navigate("TherapySession",{
              patientId:patientData?.patient_id
              })
            }
              disabled={!patientData}
              >
              <View style={styles.iconleft}>
                <MaterialCommunityIcons
                  name="file"
                  size={30}
                  color="#6e54ef"
                  style={[styles.iconlist, styles.reportsicon]}
                />
                <Text style={styles.link}>Therapy Session</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.linkContainer}
            onPress={()=>navigation.navigate("AppointmentBooking")}
              disabled={!patientData}
              >
              <View style={styles.iconleft}>
                <MaterialIcons
                  name="perm-media"
                  size={30}
                  color="#c4298e"
                  style={[styles.iconlist, styles.mediaicon]}                  
                />
                <Text style={styles.link}>Book Appointments</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity> */}
{/* 
            <TouchableOpacity style={styles.linkContainer}>
              <View style={styles.iconleft}>
                <MaterialCommunityIcons
                  name="chat"
                  size={30}
                  color="#e86e2f"
                  style={[styles.iconlist, styles.remarksicon]}
                />
                <Text style={styles.link}>Settings</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity> */}
{/* 
            <TouchableOpacity style={styles.linkContainer}>
              <View style={styles.iconleft}>
                <MaterialIcons
                  name="perm-media"
                  size={30}
                  color="#c4298e"
                  style={[styles.iconlist, styles.mediaicon]}
                />
                <Text style={styles.link}>Remove patient</Text>
              </View>
              <Octicons name="chevron-right" size={24} color="black" />
            </TouchableOpacity> */}

            
 
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  content: {
    flexDirection: "row",
    margin: 3,
  },
  mytext: {
    fontSize: 14,

    color: "white",
    fontWeight: "bold",
  },

  botscrview: {
    display: "flex",
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 40,
    marginTop: 30,
    borderTopRightRadius: 40,
    paddingTop: 20,
  },
  container: {
    display: "flex",
    padding: 20,
    rowGap: 5,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    flexDirection: "column",
    margin: 10,
    marginTop: 10,
    // marginBottom:20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  link: {
    fontSize: 16,
    marginLeft: 15,
    color: "black",
    rowGap: 5,
    fontWeight: "bold",
    // elevation:20,
  },
  linkContainer: {
    paddingHorizontal: 10,
    display: "flex",
    // color: "#d3eaf2",
    borderRadius: 10,
    marginHorizontal: 20,
    marginLeft: -15,
    height: 65,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "row",
  },
  content1: {
    margin: 5,
    fontSize: 10,
    marginBottom: -15,
  },
  iconleft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  iconlist: {
    padding: 7,
    borderRadius: 15,
    backgroundColor: "#d6e6f2",
  },
  headlist: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 20,
    marginBottom: 0,
  },
  therapyicon: {
    backgroundColor: "#d3edda",
  },
  reportsicon: {
    backgroundColor: "#dddaf2",
  },
  remarksicon: {
    backgroundColor: "#ebe0dc",
  },
  mediaicon: {
    backgroundColor: "#eaddeb",
  },
  backcover: {
    position: "absolute",
  },
});

export default PatientScreen;

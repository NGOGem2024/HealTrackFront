import React, { useState,useEffect,useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "./ThemeContext";
import { getTheme } from "./Theme";
import ThemeSelector from "./BottomTab/ThemeSelector";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PaitentRegister from "./PatientRegister";

const { width, height } = Dimensions.get("window");

interface DoctorInfo {
  doctor_first_name: string;
  doctor_last_name: string;
  doctors_photo: string;
  organization_name: string;
  doctor_email: string;
  doctor_phone: string;
}

interface Appointment {
  date: string;
  time: string;
  type: string;
}

type RootStackParamList = {
  AllPatients: undefined;
  // AppointmentBooking:undefined;
  PatientRegister:undefined;
  // Add other screen names here
};

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Item = {
  icon: string;
  label: string;
  screen?: keyof RootStackParamList | undefined;
};

const items: Item[] = [
  { icon: "person-add-outline", label: "Add Patient",screen:"PatientRegister"},
  { icon: "list-outline", label: "View Patients", screen: "AllPatients" },
  { icon: "document-text-outline", label: "Dashboard", },
  // { icon: "search-outline", label: "SearchPatient" },
  // { icon: "document-text-outline", label: "Patient History" },
  // { icon: "fitness-outline", label: "Diagnosis Plans" },
  // { icon: "clipboard-outline", label: "Notes & Remarks" },
];


const DoctorDashboard: React.FC<{ doctorInfo: DoctorInfo }> = ({
  doctorInfo,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(getTheme(theme)), [theme]);
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const [patientCount, setPatientCount] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://192.168.31.101:5000/patient/getall");
      setPatientCount(response.data.length);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get("http://your-api-endpoint/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === formatDate(new Date())
  );

  const renderAppointment = ({ item }:{item:Appointment}) => (
    <View style={styles.appointmentItem}>
      <Icon
        name={item.type.toLowerCase().includes("video") ? "videocam-outline" : "person-outline"}
        size={24}
        color={styles.iconColor.color}
       />
      <View style={styles.appointmentInfo}>
        <Text style={styles.appointmentTime}>{item.time}</Text>
        <Text style={styles.appointmentType}>{item.type}</Text>
      </View>
    </View>
  );

  const renderManagementCard = ({ item }:{item:Item}) => (
    <TouchableOpacity style={styles.card}
      onPress={()=> item.screen && navigation.navigate(item.screen)}>

      <Icon name={item.icon} size={32} color={styles.cardIcon.color} />
      <Text style={styles.cardText}>{item.label}</Text>
    </TouchableOpacity>
  );

  
  const handleNavigation = (screen?: keyof RootStackParamList) => {
    if (screen) {
      navigation.navigate(screen);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        {/* <Image
          source={require("../assets/bac2.jpg")}
          resizeMode="cover"
          style={styles.backcover}
        ></Image> */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon
              name="notifications-outline"
              size={24}
              color={styles.headerIcon.color}
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
          <ThemeSelector />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Image
            source={require("../assets/profile.png")}
            style={styles.profilePhoto}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Dr. Ana Mendis</Text>
            <Text style={styles.profileDetailText}>MD, MBBS</Text>

            <Text style={styles.profileOrg}>Arogya physiotherapy</Text>
            <View style={styles.profileDetail}>
              <Icon
                name="mail-outline"
                size={16}
                color={styles.profileDetailIcon.color}
              />
              <Text style={styles.profileDetailText}>amendis@outlook.com</Text>
            </View>
            <View style={styles.profileDetail}>
              <Icon
                name="call-outline"
                size={16}
                color={styles.profileDetailIcon.color}
              />
              <Text style={styles.profileDetailText}>+91 7864562543</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{patientCount}</Text>
            <Text style={styles.statLabel}>Patient Joined</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todayAppointments.length}</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Management</Text>
          <View style={styles.cardContainer}>
            {items.map((item, index) => (
              <TouchableOpacity key={index} style={styles.card}
              onPress={() => item.screen && handleNavigation(item.screen)}
              >
                <Icon
                  name={item.icon}
                  size={32}
                  color={styles.cardIcon.color}
                />
                <Text style={styles.cardText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <Text style={styles.dateText}>{formatDate(new Date())}</Text>
          {todayAppointments.length > 0 ? (
            <FlatList
              data={todayAppointments}
              renderItem={renderAppointment}
              keyExtractor={(item, index) => `appointment-${index}`}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noAppointmentsText}>No appointments scheduled for today.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme: ReturnType<typeof getTheme>) =>
  StyleSheet.create({
    noAppointmentsText: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'center',
      marginTop: 20,
      backgroundColor:"white",
      borderRadius:5,
      // height:25,
      paddingVertical:5,
    },
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
      backgroundColor:"#119FB3",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      paddingTop: 40,
      // backgroundColor: theme.colors.primary,
      backgroundColor:"#119FB3",
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.card,

    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIcon: {
      color: theme.colors.card,
    },
    iconButton: {
      marginLeft: 16,
    },
    notificationBadge: {
      backgroundColor: theme.colors.notification,
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: -5,
      right: -5,
    },
    notificationText: {
      color: theme.colors.card,
      fontSize: 12,
      fontWeight: "bold",
    },
    profileSection: {
      flexDirection: "row",
      padding: 24,
      backgroundColor: theme.colors.card,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 150,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    profilePhoto: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 20,
    },
    profileInfo: {
      flex: 1,
      justifyContent: "center",
      marginBottom: 20,
    },
    profileName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 4,
    },
    profileOrg: {
      fontSize: 18,
      // color: theme.colors.primary,
      color:"#119FB3",
      marginBottom: 12,
    },
    profileDetail: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    profileDetailIcon: {
      // color: theme.colors.primary,
      color:"#119FB3",
      marginRight: 8,
    },
    profileDetailText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    statsSection: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 10,
      alignItems: "center",
      // backgroundColor: theme.colors.cardBackground,
      padding: 10,
      marginHorizontal: 16,
      borderRadius: 50,
      borderBottomRightRadius: 10,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      marginTop: -20,
      left: -110,
      elevation: 5,
      shadowColor: "#000",
      backgroundColor:"#119FB3",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    statItem: {
      alignItems: "center",
    },
    statDivider: {
      height: "70%",
      width: 1,
      backgroundColor: theme.colors.border,
    },
    statNumber: {
      fontSize: 28,
      fontWeight: "bold",
      // color: theme.colors.primary,
      color:"#FFFFF",
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.7,
    },
    section: {
      display: "flex",
      margin: 16,
      marginBottom: 0,
      backgroundColor:"#119FB3",
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
    },
    dateText: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 12,
    },
    appointmentItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    appointmentInfo: {
      marginLeft: 16,
    },
    appointmentTime: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    appointmentType: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.7,
    },
    iconColor: {
      // color: theme.colors.primary,
      color:"#119FB3",
    },
    cardContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    card: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 16,
      width: (width - 64) / 3,
      marginBottom: 16,
      alignItems: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    backcover: {
      position: "absolute",
      flex:1,
      resizeMode:'cover',
    },
    cardIcon: {
      // color: theme.colors.primary,
      color:"#119FB3",
    },
    cardText: {
      color: theme.colors.text,
      marginTop: 8,
      textAlign: "center",
      fontSize: 12,
    },
  });

export default DoctorDashboard;
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "./ThemeContext";
import { getTheme } from "./Theme";
import ThemeSelector from "./BottomTab/ThemeSelector";
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get("window");

type RootStackParamList = {
  AllPatients: undefined;
  AppointmentBooking:undefined;
  // Add other screen names here
};

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Item = {
  icon: string;
  label: string;
  screen?: keyof RootStackParamList | undefined;
};

const items: Item[] = [
  { icon: "person-add-outline", label: "Add Patient"},
  { icon: "list-outline", label: "View Patients", screen: "AllPatients" },
  { icon: "search-outline", label: "SearchPatient" },
  { icon: "document-text-outline", label: "Patient History" },
  { icon: "fitness-outline", label: "Diagnosis Plans" },
  { icon: "clipboard-outline", label: "Notes & Remarks" },
];



const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const styles = getStyles(getTheme(theme));
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  };

  const handleNavigation = (screen?: keyof RootStackParamList) => {
    if (screen) {
      navigation.navigate(screen);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../assets/profile.png")}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.headerText}>Dr. Smith</Text>
            <Text style={styles.headerSubText}>Physiotherapist</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon
              name="notifications-outline"
              size={24}
              color={styles.headerText.color}
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
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
         
          >
            <Icon
              name="add-circle-outline"
              size={32}
              color={styles.quickActionText.color}
            />
            <Text style={styles.quickActionText}>New Patient</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}      
             
          >
            <Icon
              name="calendar-outline"
              size={32}
              color={styles.quickActionText.color}
            />
            <Text style={styles.quickActionText}>Appointments</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}          
          >

            <Icon
              name="stats-chart-outline"
              size={32}
              color={styles.quickActionText.color}
            />
            <Text style={styles.quickActionText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.overviewCard}>
            <View style={styles.overviewItem}>
              <Icon
                name="people-outline"
                size={32}
                color={styles.overviewData.color}
              />
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewTitle}>Patients</Text>
                <Text style={styles.overviewData}>24</Text>
              </View>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Icon
                name="calendar-outline"
                size={32}
                color={styles.overviewData.color}
              />
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewTitle}>Appointments</Text>
                <Text style={styles.overviewData}>18</Text>
              </View>
            </View>
          </View>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Management</Text>
          <View style={styles.cardContainer}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => item.screen && handleNavigation(item.screen)}
              >
                <Icon
                  name={item.icon}
                  size={32}
                  color={styles.cardText.color}
                />
                <Text style={styles.cardText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tools</Text>
          <View style={styles.toolsContainer}>
            <TouchableOpacity style={styles.toolButton}>
              <Icon
                name="body-outline"
                size={24}
                color={styles.toolButtonText.color}
              />
              <Text style={styles.toolButtonText}>Body Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton}>
              <Icon
                name="calculator-outline"
                size={24}
                color={styles.toolButtonText.color}
              />
              <Text style={styles.toolButtonText}>BMI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton}>
              <Icon
                name="timer-outline"
                size={24}
                color={styles.toolButtonText.color}
              />
              <Text style={styles.toolButtonText}>Timer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Patient Trend</Text>
          <LineChart
            data={chartData}
            width={width - 32}
            height={200}
            chartConfig={{
              backgroundColor: styles.card.backgroundColor,
              backgroundGradientFrom: styles.card.backgroundColor,
              backgroundGradientTo: styles.card.backgroundColor,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.bannerCard}>
          <Text style={styles.bannerText}>Upcoming Webinar</Text>
          <Text style={styles.bannerSubtitle}>
            "Advanced Techniques in Sports Rehabilitation"
          </Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>REGISTER NOW</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme: ReturnType<typeof getTheme>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      paddingTop: 40,
      backgroundColor: theme.colors.primary,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.card,
    },
    headerSubText: {
      fontSize: 12,
      color: theme.colors.card,
      opacity: 0.8,
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
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: 24,
    },
    quickActions: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 20,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 25,
      marginHorizontal: 16,
      marginTop: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    quickActionButton: {
      alignItems: "center",
    },
    quickActionText: {
      color: theme.colors.text,
      marginTop: 8,
      fontSize: 12,
    },
    section: {
      marginTop: 24,
      marginHorizontal: 16,
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    analyticsSection: {
      marginTop: 24,
      marginHorizontal: 16,
    },
    analyticsCards: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    analyticsCard: {
      flex: 1,
      alignItems: "center",
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    analyticsTitle: {
      fontSize: 14,
      color: theme.colors.text,
      marginTop: 8,
    },
    analyticsData: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginTop: 4,
    },
    chart: {
      marginHorizontal: 16,
      marginVertical: 16,
      // marginRight: 16,
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.colors.card,
    },
    cardContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    card: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 25,
      width: 100,
      marginBottom: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardText: {
      color: theme.colors.text,
      marginTop: 8,
      textAlign: "center",
    },
    toolsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    toolButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginHorizontal: 4,
    },
    toolButtonText: {
      color: theme.colors.card,
      marginLeft: 8,
      fontSize: 14,
      fontWeight: "bold",
    },
    bannerCard: {
      backgroundColor: theme.colors.cardBackground,
      padding: 20,
      margin: 16,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    bannerText: {
      color: theme.colors.primary,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    bannerSubtitle: {
      color: theme.colors.text,
      fontSize: 14,
      marginBottom: 16,
      textAlign: "center",
    },
    bannerButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    bannerButtonText: {
      color: theme.colors.card,
      fontSize: 14,
      fontWeight: "bold",
    },
    overviewSection: {
      marginTop: 24,
      marginHorizontal: 16,
    },
    overviewCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    overviewItem: {
      flexDirection: "column",
      alignItems: "center",
      flex: 1,
    },
    overviewTextContainer: {
      marginLeft: 0,
      alignItems: "center",
    },
    overviewTitle: {
      fontSize: 18,
      color: theme.colors.text,
    },
    overviewData: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginTop: 4,
    },
    overviewDivider: {
      width: 1,
      height: "80%",
      backgroundColor: theme.colors.border,
      marginHorizontal: 8,
    },
  });
export default Dashboard;

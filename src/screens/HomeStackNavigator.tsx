import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import PatientScreen from "./BottomTab/PatientScreen"; 
import PatientRegister from "./PatientRegister";
import UpdatePatient from "./UpdatePatient";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/types";
import TabScreen from "./BottomTab/TabScreen";
import AllPatients from "./AllPatients"; 
import Dashboard from "./Dashboard";
import TherapySession from "./TherapySession";
import CreateTherapy from "./CreateTherapy";
import DoctorDashboard from "./DoctorDashboard";
import AppointmentBooking from "./AppointmentBooking";
import PaymentHistoryPage from "./PaymentHistory";
import ReceivePaymentPage from "./RecievePayent";
import ProfileEditPage from "./ProfileEditPage";
 
type HomeStackNavigatorProps = {
  navigation: StackNavigationProp<RootStackParamList, "Patient">;
};
const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DoctorDashboard ">
      {/*<Stack.Screen name="Register" component={RegisterScreen} />*/}
      <Stack.Screen
        name="DoctorDashboard"
        component={DoctorDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllPatients"
        component={AllPatients}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientRegister"
        component={PatientRegister}
        options={{ headerShown: false }}
      />
         <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReceivePayment"
        component={ReceivePaymentPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdatePatient"
        component={UpdatePatient}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Patient"
        component={PatientScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TherapySession"
        component={TherapySession}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTherapy"
        component={CreateTherapy}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name="AppointmentBooking"
        component={AppointmentBooking}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileEditPage"
        component={ProfileEditPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Tabs" component={TabScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;

const styles = StyleSheet.create({});

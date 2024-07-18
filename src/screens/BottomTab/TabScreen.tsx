import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, Entypo, Octicons } from "@expo/vector-icons";
import HomeStackNavigator from "../HomeStackNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/types";
import PatientRegister from "../PatientRegister";
import UpdatePatient from "../UpdatePatient";
import {Icons} from "react-native-vector-icons"
import AllPatients from "../AllPatients";
import ProfileEditPage from "../ProfileEditPage";
// import { Icon } from "react-native-paper";
// type TabScreenProps = {
//   navigation: StackNavigationProp<RootStackParamList, "Tabs">;
// };

const Tab = createBottomTabNavigator();
const TabScreen: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Login"
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "black",
        tabBarActiveBackgroundColor: "white",
        tabBarInactiveBackgroundColor: "white",
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Patient"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Octicons name="home" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddPatient"
        component={PatientRegister}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Octicons name="plus-circle" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AllPatients"
        component={ProfileEditPage}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={30} color={color} />
            // <Icons name="person-outline" color={color} size={size} />
          ),
        }}
      />
       {/* <Tab.Screen
        name="Profile"
        component={ProfileEditPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icons name="person-outline" color={color} size={size} />
          ),
        }}
       /> */}
    </Tab.Navigator>
  );
};

export default TabScreen;

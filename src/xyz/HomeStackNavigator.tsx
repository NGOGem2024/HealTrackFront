import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import PatientScreen from './BottomTab/PatientScreen'
import TherapyScreen from './BottomTab/TherapyHistory'
import PatientRegister from './PatientRegister'
import UpdatePatient from './UpdatePatient'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types/types'
import TabScreen from './BottomTab/TabScreen'
import AllPatients from './AllPatients'
import TherapyTable from './UpdateTherapy'
import Home from './Home'
import SplashScreen from './SplashScreen'
type HomeStackNavigatorProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Patient'>;
};
const Stack = createNativeStackNavigator();



const HomeStackNavigator = () => {
    return (

        <Stack.Navigator initialRouteName='SplashScreen'>

            <Stack.Screen name="SplashScreen" component={SplashScreen}  options={{headerShown:false}}/>
            <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/> 
            <Stack.Screen name="AllPatients" component={AllPatients} options={{headerShown:false}} />
            <Stack.Screen name="PatientRegister" component={PatientRegister} options={{headerShown:false}} />
            <Stack.Screen name="UpdatePatient" component={UpdatePatient} options={{headerShown:false}} />
            <Stack.Screen name="Patient" component={PatientScreen} />
            <Stack.Screen name="TherapyHistory" component={TherapyScreen}  options={{headerShown:false}} />
            <Stack.Screen name="UpdateTherapy" component={TherapyTable} options={{headerShown:false}}/>
            <Stack.Screen name="Tabs" component={TabScreen} />
        </Stack.Navigator>
    );
}

export default HomeStackNavigator

const styles = StyleSheet.create({})
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
    Register : undefined;
    Login : undefined;
    UpdatePatient:{ patientId?: string };
    PaitentRegister:undefined;
    Doctor:undefined;
    Patient:undefined;
    TherapySession: {patientId?: string };
    CreateTherapy:undefined;
    AppointmentBooking:undefined;
    HomeStack:undefined;
    Tabs:undefined;
    Media:undefined;
    Report:undefined;
    AllPatients:undefined;
    LandingPage:undefined;
    Home:undefined;
    UpdateTherapy:{ patientId?: string };
    ProfileEditPage:undefined;
};


export type RootStackNavProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
}; 
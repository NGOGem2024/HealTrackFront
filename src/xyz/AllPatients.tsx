import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import PatientScreen from './BottomTab/PatientScreen';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
interface Props {
    navigation: NavigationProp<ParamListBase>;
}

interface Patient {
    _id: string;
    patient_first_name: string;
    patient_last_name: string;
    // Add other properties as needed
}

const AllPatients: React.FC<Props> = ({ navigation }) => {
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://192.168.31.101:5000/patient/getall');
                setPatients(response.data); // Assuming the response contains an array of patients
            } catch (error) {
                console.error('Error fetching patients:', error);
                // Handle error (e.g., show an error message)
            }
        };

        fetchPatients(); // Call the function to fetch patients when the component mounts
    }, []); // Empty dependency array means this effect runs once on component mount

    const handleAddPatient = () => {
        // Navigate to the register patient screen
        navigation.navigate('PatientRegister'); // Replace 'RegisterPatient' with your screen name
    };
    const navigatetopatient = (patientid: string) => {
        if (patientid) {
            navigation.navigate("Patient", { patientid });
        } else {
            console.error('Invalid patient ID:', patientid);
            // Handle the case where the patient ID is invalid or undefined
        }
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>List of Patients</Text>
            <View style={{
                flex: 1,
                justifyContent: 'center',
            }}>
                <FlatList
                    data={patients}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigatetopatient(item._id)}>
                            <View style={styles.flat}>
                                <Text style={{ fontSize: 20 }}>{item.patient_first_name} {item.patient_last_name}</Text>
                                {/* Render other patient information as needed */}
                            </View>
                        </TouchableOpacity>
                    )}

                />
            </View>
            <TouchableOpacity onPress={handleAddPatient} style={styles.addButton}>
                <Icon name="plus" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    flat: {
        borderColor: 'black',
        flex: 1,
        borderRadius: 5,
        backgroundColor: '#d3eaf2',
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        padding: 10,
    },
    title: {
        fontSize: 30,
        marginTop:30,
        marginBottom: 20,
        color: "#2a7fba",
        textAlign: "center",
        fontWeight: 'bold'
    },
    addButton: {
        backgroundColor: 'black',
        borderRadius: 50, // half of the width and height to make it circular
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        elevation: 3, // for Android shadow
    },
    addButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
});


export default AllPatients;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReceivePaymentPage = () => {
  const { colors } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState('QR');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
    },
    methodContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 30,
    },
    methodButton: {
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    methodText: {
      color: colors.text,
      marginTop: 5,
    },
    qrContainer: {
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 20,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    qrPlaceholder: {
        width: 200,
        height: 200,
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
      },
      qrPlaceholderText: {
        color: colors.text,
        textAlign: 'center',
      },
    qrText: {
      color: colors.text,
      marginTop: 20,
      fontSize: 16,
    },
    upiContainer: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 20,
      marginTop: 20,
    },
    upiText: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 10,
    },
    upiId: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    bankContainer: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 20,
      marginTop: 20,
    },
    bankText: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 10,
    },
    bankDetails: {
      color: colors.text,
      fontSize: 14,
      marginBottom: 5,
    },
  });

  const renderPaymentMethod = () => {
    switch (selectedMethod) {
      case 'QR':
        return (
          <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
              <Text style={styles.qrPlaceholderText}>QR Code Placeholder</Text>
              <Text style={styles.qrPlaceholderText}>(Implement with a QR library)</Text>
            </View>
            <Text style={styles.qrText}>Scan this QR code to pay</Text>
          </View>
        );
      case 'UPI':
        return (
          <View style={styles.upiContainer}>
            <Text style={styles.upiText}>UPI ID:</Text>
            <Text style={styles.upiId}>doctor@upi</Text>
          </View>
        );
      case 'Bank':
        return (
          <View style={styles.bankContainer}>
            <Text style={styles.bankText}>Bank Details:</Text>
            <Text style={styles.bankDetails}>Account Name: Dr. Smith</Text>
            <Text style={styles.bankDetails}>Account Number: 1234567890</Text>
            <Text style={styles.bankDetails}>IFSC Code: ABCD0001234</Text>
            <Text style={styles.bankDetails}>Bank Name: XYZ Bank</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Receive Payment</Text>
      <View style={styles.methodContainer}>
        {['QR', 'UPI', 'Bank'].map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.methodButton,
              {
                backgroundColor:
                  method === selectedMethod ? colors.primary : colors.card,
              },
            ]}
            onPress={() => setSelectedMethod(method)}
          >
             
            <Icon
              name={method === 'QR' ? 'qr-code' : method === 'UPI' ? 'payment' : 'account-balance'}
              size={24}
              color={method === selectedMethod ? colors.card : colors.primary}
            />
            <Text
              style={[
                styles.methodText,
                {
                  color:
                    method === selectedMethod ? colors.card : colors.primary,
                },
              ]}
            >
              {method}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderPaymentMethod()}
    </View>
  );
};

export default ReceivePaymentPage;
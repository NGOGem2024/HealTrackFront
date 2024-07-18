import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
// import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import Icon from 'react-native-vector-icons/MaterialIcons';

const PaymentHistoryPage = () => {
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("All");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 20,
    },
    filterContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    filterButton: {
      padding: 10,
      borderRadius: 10,
      alignItems: "center",
    },
    filterText: {
      color: colors.text,
      marginTop: 5,
    },
    paymentItem: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    paymentInfo: {
      flex: 1,
    },
    paymentName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    paymentDate: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
    },
    paymentAmount: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  const paymentData = [
    {
      id: "1",
      name: "John Doe",
      date: "2024-07-10",
      amount: 150,
      type: "received",
    },
    {
      id: "2",
      name: "Jane Smith",
      date: "2024-07-09",
      amount: 200,
      type: "received",
    },
    {
      id: "3",
      name: "Medical Supplies",
      date: "2024-07-08",
      amount: 500,
      type: "sent",
    },
    {
      id: "4",
      name: "Tom Johnson",
      date: "2024-07-07",
      amount: 175,
      type: "received",
    },
    {
      id: "5",
      name: "Office Rent",
      date: "2024-07-06",
      amount: 1000,
      type: "sent",
    },
  ];

  const filteredPayments = paymentData.filter((payment) => {
    if (selectedFilter === "All") return true;
    return payment.type === selectedFilter.toLowerCase();
  });

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentName}>{item.name}</Text>
        <Text style={styles.paymentDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.paymentAmount,
          {
            color:
              item.type === "received" ? colors.primary : colors.notification,
          },
        ]}
      >
        {item.type === "received" ? "+" : "-"}${item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment History</Text>
      <View style={styles.filterContainer}>
        {["All", "Received", "Sent"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  filter === selectedFilter ? colors.primary : colors.card,
              },
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Icon
              name={filter === "All" ? "date-range" : filter === "Received" ? "arrow-downward" : "arrow-upward"}
              size={24}
              color={filter === selectedFilter ? colors.card : colors.primary}
            />
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    filter === selectedFilter ? colors.card : colors.primary,
                },
              ]}
            >
              {filter}
            </Text>             
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredPayments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default PaymentHistoryPage;
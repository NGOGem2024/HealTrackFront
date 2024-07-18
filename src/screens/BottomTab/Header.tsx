import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Make sure to install this package

const Header = ({ theme, onThemeChange }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>PhysioApp</Text>
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={() => onThemeChange(theme === "light" ? "dark" : "light")}
        >
          <Icon
            name={theme === "light" ? "moon" : "sunny"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileIcon}>
          <Icon name="person-circle-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    marginLeft: 15,
  },
});

export default Header;

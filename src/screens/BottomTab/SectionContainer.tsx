import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SectionContainerProps {
  title: string;
  children?: React.ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        {children || <Text>No data available</Text>}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  content: {
    // Add styles for content if needed
  },
});

export default SectionContainer;

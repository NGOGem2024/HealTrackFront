import React, { useEffect } from "react";
import { View, Image, StyleSheet, ImageBackground, Text } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to your main screen after 3 seconds
      navigation.replace("TabScreen");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    // <View style={styles.container}>
    //   <ImageBackground
    //   source={require("../assets/bac2.jpg")}
    //   style={styles.backgroundImage}
    //   /> 

    <View style={styles.container}>
      <Image
        source={require("../assets/splash.png")}
        style={styles.logo1}
      />       
    </View>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "35%",
  },
  logo1: {
    width: 300,
    height: 200,
    // marginTop: '-50%',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default SplashScreen;

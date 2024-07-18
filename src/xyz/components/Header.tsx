import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type HeaderProps = {
  title: string;
  icon: any;
};

const Header: React.FC<HeaderProps> = ({ title, icon }) => {
  return (
    <View style={headerStyles.container}>
      <Image source={icon} style={headerStyles.icon} />
      <Text style={headerStyles.title}>{title}</Text>
      
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginTop:20,
    width:'100%',
  },
  icon: {
    width: 70,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'#00592D',
    marginLeft:25,
  },
});

export default Header;
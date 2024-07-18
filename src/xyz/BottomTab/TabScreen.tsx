import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import HomeStackNavigator from '../HomeStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/types';
import TherapyHistory from './TherapyHistory';
import Report from './Reports';
import Media from './Media';
import Remark from './Remark'

type TabScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Tabs'>;
};

const Tab = createBottomTabNavigator();
const TabScreen: React.FC = () => {

  return (
    <Tab.Navigator initialRouteName='Login' screenOptions={{
      tabBarActiveTintColor: '#24A0ED',
      tabBarInactiveTintColor: 'black',
      tabBarActiveBackgroundColor: 'white',
      tabBarInactiveBackgroundColor: '#24A0ED',
      tabBarLabelStyle: {
        fontSize: 15,
      },

    }}>
      <Tab.Screen
       name='Patient'
        component={HomeStackNavigator}
        options={{
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='people' size={size} color={color} />
          ),
        
        }}
      


      />
      <Tab.Screen name='Therapy History'
        component={TherapyHistory}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='healing' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen name='Reports'
        component={Report}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='description' size={size} color={color} />
          ),
        }}

      />
      <Tab.Screen name='Media'
        component={Media}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='photo-album' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen name='Remark'
        component={Remark}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='message' size={size} color={color} />
          ),
        }}

      />
    </Tab.Navigator>
  )
}

export default TabScreen
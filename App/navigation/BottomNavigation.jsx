import { View, Text, Platform } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screen/Main/Home';
import Profile from '../screen/Main/Profile';
import News from '../screen/Main/News';

export default function BottomNavigation() {
    const Tab = createBottomTabNavigator();
    
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'News') {
                        iconName = focused ? 'newspaper' : 'newspaper-outline';
                    }
                    
                    return <Ionicons name={iconName} size={20} color={color} />;
                },
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#6b7280',
                headerShown: false,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginBottom: Platform.OS === 'ios' ? 0 : 5,
                },
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                    height: Platform.OS === 'ios' ? 85 : 70,
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'ios' ? 25 : 8,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 10,
                },
                tabBarIconStyle: {
                    marginTop: Platform.OS === 'ios' ? 2 : 0,
                },
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={Home}
                options={{
                    tabBarLabel: 'Home'
                }}
            />
            <Tab.Screen 
                name="News" 
                component={News}
                options={{
                    tabBarLabel: 'News'
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={Profile}
                options={{
                    tabBarLabel: 'Profile'
                }}
            />
        </Tab.Navigator>
    );
}
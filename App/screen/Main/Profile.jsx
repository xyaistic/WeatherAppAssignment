import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNewsStore } from '@/App/context/newsStore';

export default function Profile() {
    const [temperatureUnit, setTemperatureUnit] = useState('C')
    const [selectedInterests, setSelectedInterests] = useState([])
    const { getIntresetedNews } = useNewsStore()

    useEffect(() => {
        const fetchTemp = async () => {
            const temp = await AsyncStorage.getItem('temp');
            setTemperatureUnit(temp || 'C');
        }
        fetchTemp();
    }, [])

    useEffect(() => {
        const loadData = async () => {
            await getIntresetedNews(selectedInterests);
        }
        loadData();
    }, [selectedInterests])

    const newsInterests = [
        { id: 1, title: 'Technology', icon: 'hardware-chip-outline' },
        { id: 2, title: 'Sports', icon: 'basketball-outline' },
        { id: 3, title: 'Politics', icon: 'people-outline' },
        { id: 4, title: 'Business', icon: 'briefcase-outline' },
        { id: 5, title: 'Entertainment', icon: 'film-outline' },
        { id: 6, title: 'Health', icon: 'fitness-outline' },
        { id: 7, title: 'Science', icon: 'flask-outline' },
        { id: 8, title: 'Travel', icon: 'airplane-outline' },
        { id: 9, title: 'Food', icon: 'restaurant-outline' },
        { id: 10, title: 'Fashion', icon: 'shirt-outline' },
    ]

    const toggleInterest = (interestTitle) => {
        setSelectedInterests(prev => {
            if (prev.includes(interestTitle)) {
                return prev.filter(title => title !== interestTitle)
            } else {
                return [...prev, interestTitle]
            }
        })
    }

    const InterestChip = ({ interest }) => {
        const isSelected = selectedInterests.includes(interest.title)
        return (
            <TouchableOpacity
                onPress={() => toggleInterest(interest.title)}
                className={`flex-row items-center px-3 py-2 rounded-full mr-2 mb-2 ${isSelected
                    ? 'bg-blue-500 border-blue-500 border'
                    : 'bg-white border-gray-200 border'
                    }`}
            >
                <Ionicons
                    name={interest.icon}
                    size={16}
                    color={isSelected ? 'white' : '#6B7280'}
                />
                <Text className={`ml-2 text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'
                    }`}>
                    {interest.title}
                </Text>
            </TouchableOpacity>
        )
    }


    const handletemperatureUnitChange = async (unit) => {
        setTemperatureUnit(unit)
        await AsyncStorage.setItem('temp', unit)
    }



    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                <View className="flex-row justify-between items-center px-4 py-4 bg-white shadow-sm">
                    <Text className="text-2xl font-bold text-gray-900">Profile</Text>
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <View className="bg-white mx-4 rounded-2xl shadow-sm mb-6 p-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Temperature Unit</Text>
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-gray-700 font-medium">Preferred Unit</Text>
                            <Text className="text-gray-500 text-sm">Choose between Celsius and Fahrenheit</Text>
                        </View>
                        <View className="flex-row bg-gray-100 rounded-lg p-1">
                            <TouchableOpacity
                                onPress={() => handletemperatureUnitChange('C')}
                                className={`px-4 py-2 rounded-md ${temperatureUnit === 'C'
                                    ? 'bg-blue-500'
                                    : 'bg-transparent'
                                    }`}
                            >
                                <Text className={`font-medium ${temperatureUnit === 'C'
                                    ? 'text-white'
                                    : 'text-gray-700'
                                    }`}>
                                    °C
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handletemperatureUnitChange('F')}
                                className={`px-4 py-2 rounded-md ${temperatureUnit === 'F'
                                    ? 'bg-blue-500'
                                    : 'bg-transparent'
                                    }`}
                            >
                                <Text className={`font-medium ${temperatureUnit === 'F'
                                    ? 'text-white'
                                    : 'text-gray-700'
                                    }`}>
                                    °F
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className="bg-white mx-4 rounded-2xl shadow-sm mb-6 p-6">
                    <Text className="text-lg font-bold text-gray-900 mb-2">News Interests</Text>
                    <Text className="text-gray-500 text-sm mb-4">
                        Select topics you're interested in to personalize your news feed
                    </Text>
                    <View className="flex-row flex-wrap">
                        {newsInterests.map((interest) => (
                            <InterestChip key={interest.id} interest={interest} />
                        ))}
                    </View>
                    <Text className="text-gray-400 text-xs mt-2">
                        {selectedInterests.length} of {newsInterests.length} topics selected
                    </Text>
                </View>


                <View className="px-4 pb-8">
                    <TouchableOpacity className="flex-row items-center justify-center py-4 bg-red-50 rounded-2xl border border-red-100">
                        <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                        <Text className="text-red-600 font-semibold ml-2">Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
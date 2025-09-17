import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import useWeatherStore from '../context/weatherStore'

export default function ConditionTabs({ todaysWeather, setTodaysWeather }: any) {
  const { weather }: any = useWeatherStore()

  const currentCondition = weather?.current?.temp_c
    ? weather.current.temp_c < 15
      ? 'Depressing'
      : weather.current.temp_c > 25
        ? 'Fear'
        : 'Happiness'
    : null

  const handlePress = () => {
    if (todaysWeather === currentCondition) {
      setTodaysWeather(null)
    } else {
      setTodaysWeather(currentCondition) 
    }
  }

  return (
    <View className="flex-row items-center gap-4 px-4 mb-4">
      <TouchableOpacity
        onPress={handlePress}
        className={`px-4 py-2 rounded-lg border ${
          todaysWeather === currentCondition
            ? 'bg-blue-100 border-blue-300'
            : 'bg-gray-100 border-gray-300'
        }`}
      >
        <Text className={`${todaysWeather === currentCondition ? 'text-blue-700' : 'text-gray-700'}`}>
          Today's Weather: {currentCondition}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

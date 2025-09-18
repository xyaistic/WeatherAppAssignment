import { View, Text, ScrollView, RefreshControl, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useWeatherStore from '../../context/weatherStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { celsiusToFahrenheit, fahrenheitToCelsius } from '@/App/hook/useChangeUnit';
import { useFocusEffect } from '@react-navigation/native';


interface WeatherCondition {
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
}

interface WeatherConditions {
  [key: string]: WeatherCondition;
}

interface WeatherCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  unit?: string;
}

interface WeatherData {
  location: {
    name: string;
    country?: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    condition: {
      text: string;
    };
    wind_kph: number;
    humidity: number;
    pressure_mb: number;
    vis_km: number;
    uv: number;
    wind_dir: string;
    last_updated: string;
  };
}

const weatherConditions: WeatherConditions = {
  'Sunny': { icon: 'sunny', gradient: ['#87CEEB', '#98D8E8'] },
  'Clear': { icon: 'sunny', gradient: ['#87CEEB', '#98D8E8'] },
  'Partly cloudy': { icon: 'partly-sunny', gradient: ['#87CEEB', '#B0C4DE'] },
  'Cloudy': { icon: 'cloudy', gradient: ['#708090', '#B0C4DE'] },
  'Overcast': { icon: 'cloudy', gradient: ['#696969', '#A9A9A9'] },
  'Mist': { icon: 'water', gradient: ['#B0C4DE', '#D3D3D3'] },
  'Patchy rain possible': { icon: 'rainy', gradient: ['#4682B4', '#87CEEB'] },
  'Light rain': { icon: 'rainy', gradient: ['#4682B4', '#6495ED'] },
  'Moderate rain': { icon: 'rainy', gradient: ['#4169E1', '#6495ED'] },
  'Heavy rain': { icon: 'rainy', gradient: ['#191970', '#4169E1'] },
  'Snow': { icon: 'snow', gradient: ['#E0E6ED', '#F0F8FF'] },
  'Thunderstorm': { icon: 'thunderstorm', gradient: ['#2F4F4F', '#708090'] },
  default: { icon: 'partly-sunny', gradient: ['#87CEEB', '#98D8E8'] }
};

const WeatherCard: React.FC<WeatherCardProps> = ({ title, value, icon, unit = '' }) => (
  <View className="bg-white/20 p-5 rounded-2xl my-2 mx-1 flex-1 items-center shadow-lg shadow-black/10">
    <Ionicons name={icon} size={28} color="white" className="mb-2" />
    <Text className="text-white text-xs font-medium text-center opacity-90 mb-1">
      {title}
    </Text>
    <Text className="text-white text-lg font-bold text-center">
      {value}{unit}
    </Text>
  </View>
);

const Home: React.FC = () => {
  const { weather, getWeather, forecast }: any = useWeatherStore();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [temp, setTemp] = useState('C');

  useEffect(() => {
    getWeather('Bangalore');
  }, []);


  useFocusEffect(
    useCallback(() => {
      const fetchTemperatureUnit = async () => {
        try {
          const savedUnit = await AsyncStorage.getItem('temp');
          if (savedUnit) {
            setTemp(savedUnit);
          } else {
            setTemp('C');
          }
        } catch (error) {
          console.error('Error fetching temperature unit:', error);
          setTemp('C');
        }
      };

      fetchTemperatureUnit();
    }, [])
  );


  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    const currentLocation = weather?.location?.name || 'Bangalore';
    await getWeather(currentLocation);
    setRefreshing(false);
  };


  const handleSearch = async (): Promise<void> => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        await getWeather(searchQuery.trim());
        setSearchQuery('');
        Keyboard.dismiss();
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch weather data');
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSearchSubmit = (): void => {
    handleSearch();
  };

  const getWeatherCondition = (condition: string): WeatherCondition => {
    return weatherConditions[condition] || weatherConditions.default;
  };

  const getCurrentTime = (): string => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentDate = (): string => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!weather) {
    const defaultGradient = weatherConditions.default.gradient;
    return (
      <LinearGradient
        colors={defaultGradient as any}
        className="flex-1"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar barStyle="light-content" />
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-white text-lg font-semibold mt-4 text-center">
            Loading Weather Data...
          </Text>
          <Text className="text-white/80 text-sm mt-2 text-center">
            Please wait while we fetch the latest information
          </Text>
        </View>
      </LinearGradient>
    );
  }

  const condition = getWeatherCondition(weather.current.condition.text);

  return (
    <LinearGradient
      colors={condition.gradient as any}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 p-5">
        <View className="flex-row items-center justify-between p-5 mt-8">
          <View className="flex-1 flex-row items-center bg-white/20 rounded-2xl px-4 mr-3">
            <Ionicons name="search" size={20} color="white" style={{ opacity: 0.8 }} />
            <TextInput
              className="flex-1 text-black text-lg font-medium ml-3 px-4"
              placeholder="Search for a city..."
              placeholderTextColor="rgba(0, 0, 0, 0.5)"  // Make the placeholder visible with a transparent black color
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
              style={{ height: 40 }}  // Adjusting height for better input area and placeholder visibility
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
                <Ionicons name="close-circle" size={20} color="white" style={{ opacity: 0.8 }} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="bg-white/20 rounded-2xl p-3"
          >
            <Ionicons
              name={isSearching ? "hourglass" : "arrow-forward"}
              size={20}
              color="white"
              style={{ opacity: searchQuery.trim() && !isSearching ? 1 : 0.5 }}
            />
          </TouchableOpacity>
        </View>


        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="white"
              colors={['white']}
            />
          }
        >

          <View className="pt-4 px-6 items-center mb-5">
            <Text className="text-white text-base font-medium opacity-90">
              {getCurrentDate()}
            </Text>
            <Text className="text-white text-sm font-normal opacity-80 mt-1">
              {getCurrentTime()}
            </Text>
          </View>

          <View className="items-center px-6 mb-8">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location" size={20} color="white" style={{ opacity: 0.9 }} />
              <Text className="text-white text-lg font-semibold ml-1.5">
                {weather.location.name}
              </Text>
              {weather.location.country && (
                <Text className="text-white text-sm font-normal opacity-70 ml-1">
                  , {weather.location.country}
                </Text>
              )}
            </View>

            <View className="items-center mb-4">
              <Ionicons name={condition?.icon} size={100} color="white" />
              <Text className="text-white text-7xl font-light mt-2">
                {temp === 'C' ? weather?.current?.temp_c.toFixed(1) : fahrenheitToCelsius(weather.current.temp_c).toFixed(2)}
              </Text>
              <Text className="text-white text-lg font-medium opacity-90 -mt-2">
                {weather.current.condition.text}
              </Text>
            </View>

            <Text className="text-white text-base opacity-80 text-center">
              Feels like {Math.round(weather.current.feelslike_c)}°
            </Text>
          </View>
          <View className="px-4 mb-5">
            <Text className="text-white text-xl font-bold opacity-90 mb-3">
              Climate Information
            </Text>
            <View className="flex-row justify-between mb-3">
              <WeatherCard
                title="Wind Speed"
                value={weather.current.wind_kph}
                unit=" km/h"
                icon="speedometer"
              />
              <WeatherCard
                title="Humidity"
                value={weather.current.humidity}
                unit="%"
                icon="water"
              />
            </View>

            <Text className="text-white text-xl font-bold opacity-90 mb-3">
              5-Day Forecast
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {forecast?.forecast.forecastday.map((day: any, index: number) => {
                const date = new Date(day.date);
                const dayName = index === 0
                  ? 'Today'
                  : date.toLocaleDateString('en-US', { weekday: 'short' });

                const dayCondition = getWeatherCondition(day.day.condition.text);

                return (
                  <View
                    key={day.date}
                    className="bg-white/20 p-4 rounded-2xl items-center shadow-lg shadow-black/10 mb-3"
                    style={{ width: '48%' }}
                  >
                    <Text className="text-white text-sm font-medium opacity-90 mb-2">
                      {dayName}
                    </Text>
                    <Ionicons
                      name={dayCondition.icon}
                      size={24}
                      color="white"
                      style={{ marginBottom: 8 }}
                    />
                    <Text className="text-white text-lg font-bold">
                      {temp === 'C' ? day.day.maxtemp_c.toFixed(1) + ' C' : fahrenheitToCelsius(day.day.maxtemp_c).toFixed(2) + ' F'}

                    </Text>
                    <Text className="text-white text-sm opacity-70">
                      {temp === 'C' ? day.day.mintemp_c.toFixed(1) + ' C' : fahrenheitToCelsius(day.day.mintemp_c).toFixed(2) + ' F'}
                    </Text>
                    <Text className="text-white text-xs text-center mt-1 opacity-80" numberOfLines={2}>
                      {day.day.condition.text}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View className="items-center px-6 pb-10">
            <Text className="text-white/70 text-xs text-center">
              Last updated: {new Date(weather.current.last_updated).toLocaleTimeString()}
            </Text>
            <Text className="text-white/60 text-[11px] text-center mt-1">
              Pull down to refresh
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;
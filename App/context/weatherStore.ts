import { Alert } from 'react-native'
import { ApikeyWeather } from '../constant/Api'
import { create } from 'zustand'
import axios from 'axios'

const useWeatherStore = create((set) => ({
    weather: null,
    forecast: null,
    getWeather: async (city: string) => {
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${ApikeyWeather}&q=${city}&aqi=yes&days=3`)
            const forecast = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${ApikeyWeather}&q=${city}&aqi=yes&days=5`)
            set({ weather: response.data , forecast: forecast.data })
        } catch (error: any) {
            Alert.alert('Error', error.message)
        }
    }
}))

export default useWeatherStore;

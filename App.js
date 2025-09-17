import { View, Text } from 'react-native'
import React from 'react'
import RootNavigation from './App/navigation/RootNavigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import './global.css'
export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigation />
    </SafeAreaProvider>
  )
}
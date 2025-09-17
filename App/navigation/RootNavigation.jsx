// App.js

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import '../../global.css';

import BottomNavigation from "./BottomNavigation";
const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
  
      <NavigationContainer >
        <Stack.Navigator  initialRouteName="BottomNavigation">
          <Stack.Screen
            name="BottomNavigation"
            component={BottomNavigation}
            options={{ title: "Welcome Home", headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    
  );
}

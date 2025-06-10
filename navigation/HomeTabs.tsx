import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import BackScreen from "./screens/BackScreen";
//import SettingsScreen from "../screens/SettingsScreen";
import PlanDetailsScreen from "./screens/PlanDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Back") iconName = "arrow-back";
          else if (route.name === "Settings") iconName = "settings";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#5e3ea1",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Back" component={BackScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />

      {/* Uncomment the line below to enable Settings tab */}
      {/*<Tab.Screen name="Settings" component={SettingsScreen} />*/}
    </Tab.Navigator>
  );
}

export default function HomeTabs() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PlanDetails" component={PlanDetailsScreen} />
    </Stack.Navigator>
  );
}

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";
import SettingsScreen from "./screens/SettingsScreen";
import PlanDetailsScreen from "./screens/PlanDetailsScreen";
import { Session } from "@supabase/supabase-js";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
type SettingsScreenProps = {
  session: Session;
};

function Tabs({ session }: { session: Session }) {
  const SettingsWrapper = () => <SettingsScreen session={session} />;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Add") iconName = "add-circle";
          else if (route.name === "Settings") iconName = "settings";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#5e3ea1",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Settings" component={SettingsWrapper} />
    </Tab.Navigator>
  );
}

export default function HomeTabs({ session }: { session: Session }) {
  const PlanDetailsWrapper = (props: any) => (
    <PlanDetailsScreen {...props} session={session} />
  );

  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {() => <Tabs session={session} />}
      </Stack.Screen>
      <Stack.Screen name="PlanDetails" component={PlanDetailsWrapper} />
    </Stack.Navigator>
  );
}

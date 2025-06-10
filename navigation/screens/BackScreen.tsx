import React, { useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import { CommonActions } from "@react-navigation/native";

export default function BackScreen() {
  const navigation = useNavigation();
  const state = useNavigationState((state) => state);
  const currentRoute = state.routes[state.index].name;

  useEffect(() => {
    if (currentRoute === "Back") {
      Alert.alert(
        "Sign Out",
        "Do you want to sign out of GoalTracker?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign Out",
            style: "destructive",
            onPress: async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                console.error("Sign out error:", error.message);
              }
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      navigation.goBack();
    }
  }, []);

  return null;
}

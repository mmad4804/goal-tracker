import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Input, Button } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <LinearGradient colors={["#e6e6f7", "#f2f2f7"]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Text style={styles.header}>GoalTracker</Text>
        <View style={styles.card}>
          <Input
            label="Email"
            leftIcon={{
              type: "font-awesome",
              name: "envelope",
              color: "#5e3ea1",
            }}
            onChangeText={setEmail}
            value={email}
            placeholder="email@address.com"
            autoCapitalize="none"
            inputStyle={styles.inputText}
            labelStyle={styles.label}
          />
          <Input
            label="Password"
            leftIcon={{ type: "font-awesome", name: "lock", color: "#5e3ea1" }}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            inputStyle={styles.inputText}
            labelStyle={styles.label}
          />
          <Button
            title="Sign In"
            loading={loading}
            onPress={signInWithEmail}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
          />
          <Button
            title="Sign Up"
            type="outline"
            loading={loading}
            onPress={signUpWithEmail}
            buttonStyle={styles.outlineButton}
            titleStyle={styles.outlineTitle}
            containerStyle={styles.buttonContainer}
          />
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5e3ea1",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    color: "#5e3ea1",
    fontWeight: "600",
  },
  inputText: {
    color: "#333",
  },
  button: {
    backgroundColor: "#5e3ea1",
    borderRadius: 12,
    paddingVertical: 12,
  },
  outlineButton: {
    borderColor: "#5e3ea1",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
  },
  outlineTitle: {
    color: "#5e3ea1",
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 12,
  },
});

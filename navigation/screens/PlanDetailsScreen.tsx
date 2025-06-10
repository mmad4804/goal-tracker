import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function PlanDetailsScreen() {
  const route = useRoute();
  const { planId } = route.params as { planId: string };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan Details</Text>
      <Text style={styles.subtitle}>Plan ID: {planId}</Text>
      {/* You can fetch and display more plan data here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5e3ea1",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
});

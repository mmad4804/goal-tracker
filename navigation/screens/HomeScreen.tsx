import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import { supabase } from "../../lib/supabase";
import { SwipeListView } from "react-native-swipe-list-view";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Tabs">;
type Plan = {
  plan_id: string;
  title: string;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("plans").select("*");
    if (error) {
      console.error("Error fetching plans:", error.message);
    } else {
      setPlans(data);
    }
    setLoading(false);
  };

  const deletePlan = async (planId: string) => {
    const { error } = await supabase
      .from("plans")
      .delete()
      .eq("plan_id", planId);
    if (error) {
      console.error("Error deleting plan:", error.message);
    } else {
      setPlans((prev) => prev.filter((plan) => plan.plan_id !== planId));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlans();
    }, [])
  );

  const renderItem = ({ item }: { item: Plan }) => (
    <TouchableOpacity
      style={styles.planItem}
      onPress={() =>
        navigation.navigate("PlanDetails", { planId: item.plan_id })
      }
    >
      <Text style={styles.planTitle}>{item.title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#5e3ea1" />
    </TouchableOpacity>
  );

  const renderHiddenItem = ({ item }: { item: Plan }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deletePlan(item.plan_id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent Plans</Text>
      <SwipeListView
        data={plans}
        keyExtractor={(item) => item.plan_id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        contentContainerStyle={styles.list}
        disableRightSwipe
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5e3ea1",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  planItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  planTitle: {
    fontSize: 16,
    color: "#333",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
    marginBottom: 12,
    borderRadius: 12,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    width: 75,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

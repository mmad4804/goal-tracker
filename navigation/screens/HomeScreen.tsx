import React, { use } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import { supabase } from "../../lib/supabase";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Tabs">;
type Plan = {
  plan_id: string;
  title: string;
};

const mockPlans = [
  { plan_id: "1", title: "Morning Routine" },
  { plan_id: "2", title: "Workout Plan" },
  { plan_id: "3", title: "Study Schedule" },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase.from("plans").select("*");
      if (error) {
        console.error("Error fetching plans:", error.message);
      } else {
        setPlans(data);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent Plans</Text>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.plan_id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    padding: 20,
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
});

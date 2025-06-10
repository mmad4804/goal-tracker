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

export default function AddScreen() {
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Plan</Text>
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
});

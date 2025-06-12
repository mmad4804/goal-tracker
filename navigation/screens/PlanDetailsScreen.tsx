import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

// Define types
interface Plan {
  plan_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface PlanDay {
  date: string;
  weekIndex: number;
  monthLabel?: string;
}

export default function PlanDetailsScreen({ session }: { session: Session }) {
  const route = useRoute();
  const { planId } = route.params as { planId: string };
  const [plan, setPlan] = useState<Plan | null>(null);
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<PlanDay[][]>([]);
  const userId = session?.user.id;

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const { data, error } = await supabase
          .from("plans")
          .select("*")
          .eq("plan_id", planId)
          .single();

        if (error) {
          console.error("Error fetching plan:", error.message);
          return;
        }

        setPlan(data);

        const days = getPlanDays(data.start_date, data.end_date);
        const grouped = groupDaysByWeek(days);
        setWeeks(grouped);

        const { data: completedData, error: completedError } = await supabase
          .from("completed")
          .select("date")
          .eq("plan_id", planId)
          .eq("user_id", userId);

        if (completedError) {
          console.error(
            "Error fetching completed days:",
            completedError.message
          );
        } else {
          setCompletedDates(completedData.map((entry) => entry.date));
        }
      };

      loadData();
    }, [planId, userId])
  );

  const getStreakStyle = (date: string, index: number, week: PlanDay[]) => {
    const prev = week[index - 1]?.date;
    const next = week[index + 1]?.date;
    const isCurrent = completedDates.includes(date);
    const isPrev = completedDates.includes(prev);
    const isNext = completedDates.includes(next);

    if (!isCurrent) {
      return {
        marginHorizontal: 4,
        borderRadius: 18,
      };
    }

    if (isPrev && isNext) {
      return {
        borderRadius: 0,
        marginHorizontal: 0,
      };
    }

    if (!isPrev && isNext) {
      return {
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        marginRight: 0,
        marginLeft: 0,
      };
    }

    if (isPrev && !isNext) {
      return {
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        marginLeft: 0,
        marginRight: 0,
      };
    }

    return {
      borderRadius: 18,
      marginHorizontal: 0,
    };
  };

  const AnimatedBubble = ({
    day,
    index,
    week,
    isCompleted,
    onToggle,
  }: {
    day: PlanDay;
    index: number;
    week: PlanDay[];
    isCompleted: boolean;
    onToggle: (date: string) => void;
  }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.85,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => onToggle(day.date));
    };

    return (
      <Animated.View
        style={StyleSheet.flatten([
          {
            transform: [{ scale }],
          },
          styles.bubble,
          isCompleted && styles.bubbleCompleted,
          getStreakStyle(day.date, index, week),
        ])}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.bubbleText}>{new Date(day.date).getDate()}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const fetchPlan = async () => {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("plan_id", planId)
      .single();

    if (error) {
      console.error("Error fetching plan:", error.message);
    } else {
      setPlan(data);
    }
  };

  const fetchCompleted = async (dates: string[]) => {
    const { data, error } = await supabase
      .from("completed")
      .select("date")
      .eq("plan_id", planId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching completed days:", error.message);
    } else {
      const completed = data.map((entry) => entry.date);
      setCompletedDates(completed);
    }
  };

  const toggleCompletion = async (date: string) => {
    const isCompleted = completedDates.includes(date);
    const updated = isCompleted
      ? completedDates.filter((d) => d !== date)
      : [...completedDates, date];

    setCompletedDates(updated); // Optimistic update

    if (isCompleted) {
      await supabase
        .from("completed")
        .delete()
        .eq("plan_id", planId)
        .eq("user_id", userId)
        .eq("date", date);
    } else {
      await supabase
        .from("completed")
        .insert([{ plan_id: planId, user_id: userId, date }]);
    }

    // Optional: re-fetch to ensure sync
    // fetchCompleted(weeks.flat().map((d) => d.date));
  };

  const getPlanDays = (start: string, end: string): PlanDay[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days: PlanDay[] = [];

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.warn("Invalid start or end date:", { start, end });
      return [];
    }

    let current = new Date(startDate);
    let weekIndex = 0;
    let lastMonth = "";

    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0];
      const month = current.toLocaleString("default", { month: "long" });

      const day: PlanDay = {
        date: dateStr,
        weekIndex,
        monthLabel: month !== lastMonth ? month : undefined,
      };

      days.push(day);
      lastMonth = month;

      if (current.getDay() === 6) weekIndex++; // Saturday ends the week
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const groupDaysByWeek = (days: PlanDay[]): PlanDay[][] => {
    const grouped: PlanDay[][] = [];
    days.forEach((day) => {
      if (!grouped[day.weekIndex]) grouped[day.weekIndex] = [];
      grouped[day.weekIndex].push(day);
    });
    return grouped;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plan: {plan ? plan.title : "Loading..."}</Text>
      <Text style={styles.subtitle}>
        Description: {plan ? plan.description : "Loading..."}
      </Text>
      <Text style={styles.subtitle}>
        Start: {plan ? plan.start_date : "Loading..."}
      </Text>
      <Text style={styles.subtitle}>
        End: {plan ? plan.end_date : "Loading..."}
      </Text>

      <Text style={styles.progressTitle}>Progress Tracker</Text>

      {weeks.map((week, index) => (
        <View key={index} style={styles.weekRow}>
          {week[0]?.monthLabel && (
            <Text style={styles.monthLabel}>{week[0].monthLabel}</Text>
          )}
          <View style={styles.bubbleRow}>
            {week.map((day, i) => (
              <AnimatedBubble
                key={day.date}
                day={day}
                index={i}
                week={week}
                isCompleted={completedDates.includes(day.date)}
                onToggle={toggleCompletion}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f2f7",
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
    marginBottom: 5,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  weekRow: {
    marginBottom: 15,
    alignItems: "center",
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5e3ea1",
    marginBottom: 5,
  },
  bubbleRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  bubble: {
    width: 36,
    height: 36,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleCompleted: {
    backgroundColor: "#5e3ea1",
  },
  bubbleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bubbleStart: {
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  bubbleMiddle: {
    borderRadius: 6,
  },
  bubbleEnd: {
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
});

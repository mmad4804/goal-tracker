import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../lib/supabase";
import { useNavigation } from "@react-navigation/native";

export default function AddScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [creator_id, setCreatorId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Error", "Unable to retrieve user information.");
      return;
    }

    const { error } = await supabase.from("plans").insert([
      {
        title,
        description,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        creator_id: user.id,
      },
    ]);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Plan created successfully!");
      setTitle("");
      setDescription("");
      setStartDate(new Date());
      setEndDate(new Date());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Plan</Text>

      <TextInput
        style={styles.input}
        placeholder="Plan Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        onPress={() => setShowStartPicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>
          Start Date: {startDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(Platform.OS === "ios");
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowEndPicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>End Date: {endDate.toDateString()}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(Platform.OS === "ios");
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      <Button title="Submit Plan" onPress={handleSubmit} color="#5e3ea1" />
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
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});

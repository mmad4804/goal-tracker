import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";

interface EnrollMFAProps {
  onEnrolled: () => void;
  onCancelled: () => void;
}

export function EnrollMFA({ onEnrolled, onCancelled }: EnrollMFAProps) {
  const [factorId, setFactorId] = useState<string>("");
  const [qr, setQR] = useState<string>(""); // QR code image as data URL
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const onEnableClicked = async () => {
    setError("");
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      const challengeId = challenge.data.id;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      });
      if (verify.error) throw verify.error;

      onEnrolled();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });
      if (error) throw error;

      setFactorId(data.id);
      setQR(`data:image/svg+xml;utf8,${encodeURIComponent(data.totp.qr_code)}`);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {qr ? <Image source={{ uri: qr }} style={styles.qr} /> : null}
      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        value={verifyCode}
        onChangeText={(text) => setVerifyCode(text.trim())}
      />
      <Button title="Enable" onPress={onEnableClicked} />
      <Button title="Cancel" onPress={onCancelled} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  error: { color: "red", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
  },
  qr: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
});

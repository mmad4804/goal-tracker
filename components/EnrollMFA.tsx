import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { supabase } from "../lib/supabase";

interface EnrollMFAProps {
  onEnrolled: () => void;
  onCancelled: () => void;
}

export function EnrollMFA({ onEnrolled, onCancelled }: EnrollMFAProps) {
  const [factorId, setFactorId] = useState<string>("");
  const [qrSvg, setQrSvg] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const { data: factors, error: listError } =
          await supabase.auth.mfa.listFactors();
        if (listError) throw listError;

        const existing = factors?.all?.find((f) => f.factor_type === "totp");

        if (existing) {
          setFactorId(existing.id);
          return;
        }

        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: "totp",
        });
        if (error) throw error;

        setFactorId(data.id);
        setQrSvg(data.totp.qr_code);
      } catch (err: any) {
        console.error("Error during MFA enrollment:", err);
        setError(err.message);
      }
    })();
  }, []);

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
      console.error("Error verifying MFA:", err);
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleDeleteFactor = async () => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;

      setFactorId("");
      setQrSvg("");
      setVerifyCode("");
      setError("MFA factor deleted. You can re-enroll now.");
    } catch (err: any) {
      console.error("Error deleting MFA factor:", err);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {qrSvg ? (
        <SvgXml xml={qrSvg} width="200" height="200" style={styles.qr} />
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        value={verifyCode}
        onChangeText={(text) => setVerifyCode(text.trim())}
        keyboardType="numeric"
      />
      <Button title="Enable" onPress={onEnableClicked} />
      <View style={styles.buttonRow}>
        <Button title="Back" onPress={onCancelled} color="gray" />
        <Button title="Sign Out" onPress={handleSignOut} color="red" />
      </View>
      {factorId ? (
        <Button
          title="Delete MFA Factor"
          onPress={handleDeleteFactor}
          color="orange"
        />
      ) : null}
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
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Clipboard,
  ScrollView,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { supabase } from "../lib/supabase";

interface EnrollMFAProps {
  onEnrolled: () => void;
  onCancelled: () => void;
}

export function EnrollMFA({ onEnrolled, onCancelled }: EnrollMFAProps) {
  const [factorId, setFactorId] = useState<string>("");
  const [qrSvg, setQrSvg] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
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
          setError("MFA is already enrolled. You can verify it or delete it.");
          return;
        }

        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: "totp",
        });
        if (error) throw error;

        setFactorId(data.id);
        setQrSvg(data.totp.qr_code);
        setSecret(data.totp.secret);
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

  const handleDeleteFactor = async () => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;

      setFactorId("");
      setQrSvg("");
      setSecret("");
      setVerifyCode("");
      setError("MFA factor deleted. You can re-enroll now.");
    } catch (err: any) {
      console.error("Error deleting MFA factor:", err);
      setError(err.message);
    }
  };

  const handleCopySecret = () => {
    Clipboard.setString(secret);
    Alert.alert("Copied", "Secret key copied to clipboard.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Multi-Factor Authentication</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {qrSvg ? (
          <SvgXml xml={qrSvg} width="200" height="200" style={styles.qr} />
        ) : null}
        {secret ? (
          <View style={styles.secretContainer}>
            <Text style={styles.secretLabel}>
              Or manually enter this secret key:
            </Text>
            <Text selectable style={styles.secret}>
              {secret}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleCopySecret}>
              <Text style={styles.buttonText}>Copy Secret Key</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Enter verification code"
          value={verifyCode}
          onChangeText={(text) => setVerifyCode(text.trim())}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={onEnableClicked}>
          <Text style={styles.buttonText}>Enable</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.grayButton]}
          onPress={onCancelled}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        {factorId ? (
          <TouchableOpacity
            style={[styles.button, styles.orangeButton]}
            onPress={handleDeleteFactor}
          >
            <Text style={styles.buttonText}>Delete MFA Factor</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f2f2f7",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5e3ea1",
    marginBottom: 20,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  qr: {
    alignSelf: "center",
    marginBottom: 20,
  },
  secretContainer: {
    marginBottom: 20,
  },
  secretLabel: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  secret: {
    fontFamily: "monospace",
    fontSize: 16,
    marginBottom: 10,
    color: "#5e3ea1",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#5e3ea1",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  grayButton: {
    backgroundColor: "#aaa",
  },
  orangeButton: {
    backgroundColor: "#f57c00",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

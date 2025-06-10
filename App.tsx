import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import { EnrollMFA } from "./components/EnrollMFA";
import { View, ActivityIndicator } from "react-native";
import { Session } from "@supabase/supabase-js";
import { NavigationContainer } from "@react-navigation/native";
import HomeTabs from "./navigation/HomeTabs"; // 👈 Your new tab navigator

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [mfaEnrolled, setMfaEnrolled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session?.user) {
        const { data: factors, error } = await supabase.auth.mfa.listFactors();
        if (error) {
          console.error("Error checking MFA factors:", error);
        }
        setMfaEnrolled(
          factors?.all?.some((f) => f.status === "verified") ?? false
        );
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          setMfaEnrolled(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <NavigationContainer>
      {!session ? (
        <Auth />
      ) : !mfaEnrolled ? (
        <EnrollMFA
          onEnrolled={() => setMfaEnrolled(true)}
          onCancelled={() => supabase.auth.signOut()}
        />
      ) : (
        <HomeTabs />
      )}
    </NavigationContainer>
  );
}

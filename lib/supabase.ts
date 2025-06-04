import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kxqpssusswumxjfguhol.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4cXBzc3Vzc3d1bXhqZmd1aG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMDUwNjksImV4cCI6MjA2NDU4MTA2OX0.YH2r3zK8Nf8PKBfV_DTHKI3cMqleca_vFdCFs4OoXl0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

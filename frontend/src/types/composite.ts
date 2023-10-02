import { Database } from "./supabase";

export type Observation = Database['public']['Tables']['observations']['Insert'];
export type Metric = Database['public']['Tables']['metrics']['Row'] & { observations: Observation[] };
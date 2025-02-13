import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please connect to Supabase using the "Connect to Supabase" button.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  updated_at: string;
  dietary_preferences: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
  };
  excluded_ingredients: string[];
  servings: number;
  additional_notes: string;
};

export type WeeklyPlan = {
  id: string;
  created_at: string;
  week_start: string;
  profile_id: string;
  meals: {
    [key: string]: {
      name: string;
      prepTime: string;
      servings: number;
      ingredients: string[];
      steps: string[];
    };
  };
  original_plan: any;
  modifications: {
    requestedChanges: string;
    appliedChanges: string[];
  };
};
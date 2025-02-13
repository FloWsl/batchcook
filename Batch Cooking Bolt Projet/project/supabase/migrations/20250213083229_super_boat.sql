/*
  # Initial Schema for Batch Cooking App

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `updated_at` (timestamp)
      - `dietary_preferences` (jsonb)
      - `excluded_ingredients` (text[])
      - `servings` (integer)
      - `additional_notes` (text)
    
    - `weekly_plans`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `week_start` (date)
      - `profile_id` (uuid, foreign key)
      - `meals` (jsonb)
      - `original_plan` (jsonb)
      - `modifications` (jsonb)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  updated_at timestamptz DEFAULT now(),
  dietary_preferences jsonb DEFAULT '{}'::jsonb,
  excluded_ingredients text[] DEFAULT '{}',
  servings integer DEFAULT 4,
  additional_notes text DEFAULT ''
);

-- Create weekly_plans table
CREATE TABLE IF NOT EXISTS weekly_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  week_start date NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  meals jsonb NOT NULL DEFAULT '{}'::jsonb,
  original_plan jsonb DEFAULT '{}'::jsonb,
  modifications jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Weekly plans policies
CREATE POLICY "Users can read own weekly plans"
  ON weekly_plans
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can update own weekly plans"
  ON weekly_plans
  FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create weekly plans"
  ON weekly_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());
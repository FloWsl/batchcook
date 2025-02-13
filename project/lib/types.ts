export type Ingredient = {
  id: string;
  category: string;
  name: string;
  totalQuantity: string | number;
  unit?: string;
  notes?: string;
  remainingQuantity: string | number;
};

export type Equipment = {
  name: string;
  details: string;
};

export type RecipeIngredient = {
  ingredientId: string;
  proportion: string;
  description: string;
};

export type Recipe = {
  id: string;
  name: string;
  scalingFactor: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
};

export type Task = {
  time: string;
  instruction: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  timerDuration?: number;
  mediaUrl?: string;
  ingredientUsage?: {
    ingredientId: string;
    proportion: string;
    description: string;
  }[];
};

export type Section = {
  sectionName: string;
  tasks: Task[];
};

export type ParallelTask = {
  subPhase: string;
  startTime: string;
  endTime: string;
  tasks: Task[];
};

export type ParallelGroup = {
  groupName: string;
  tasks: ParallelTask[];
};

export type Phase = {
  phaseNumber: string;
  phaseName: string;
  startTime: string;
  endTime: string;
  sections?: Section[];
  parallelGroups?: ParallelGroup[];
};

export type BatchCookingPlan = {
  totalDuration: string;
  phases: Phase[];
};

export type WeeklyPlanExtended = {
  id: string;
  created_at: string;
  week_start: string;
  profile_id: string | null;
  ingredients: Ingredient[];
  equipment: Equipment[];
  recipes: Recipe[];
  batchCookingPlan: BatchCookingPlan;
  original_plan: any;
  modifications: {
    requestedChanges: string;
    appliedChanges: string[];
  };
  is_default: boolean;
};

export type SubscriptionTier = 'free' | 'premium';

export type UserProfile = {
  id: string;
  subscription_tier: SubscriptionTier;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  customizations_remaining: number;
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
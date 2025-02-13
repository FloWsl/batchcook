import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WeeklyPlanExtended, UserProfile } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function WeeklyPlansScreen() {
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlanExtended[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWeeklyPlans();
    fetchUserProfile();
  }, []);

  const fetchWeeklyPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_plans')
        .select('*')
        .order('week_start', { ascending: false });

      if (error) throw error;
      setWeeklyPlans(data || []);
    } catch (error) {
      console.error('Error fetching weekly plans:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handlePlanPress = (plan: WeeklyPlanExtended) => {
    router.push(`/plan/${plan.id}`);
  };

  const renderWeeklyPlanCard = (plan: WeeklyPlanExtended) => (
    <Pressable
      key={plan.id}
      style={styles.planCard}
      onPress={() => handlePlanPress(plan)}
    >
      <LinearGradient
        colors={['#22c55e20', '#22c55e10']}
        style={styles.gradientBackground}
      >
        <View style={styles.planHeader}>
          <Text style={styles.weekStart}>Week of {new Date(plan.week_start).toLocaleDateString()}</Text>
          <Text style={styles.planTitle}>Batch Cooking Plan</Text>
        </View>

        <View style={styles.planInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#64748b" />
            <Text style={styles.infoText}>{plan.batchCookingPlan.totalDuration}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="restaurant-outline" size={16} color="#64748b" />
            <Text style={styles.infoText}>{plan.recipes.length} recipes</Text>
          </View>
        </View>

        <View style={styles.recipesList}>
          {plan.recipes.slice(0, 3).map((recipe) => (
            <Text key={recipe.id} style={styles.recipeItem}>• {recipe.name}</Text>
          ))}
          {plan.recipes.length > 3 && (
            <Text style={styles.moreRecipes}>+{plan.recipes.length - 3} more</Text>
          )}
        </View>

        {userProfile?.subscription_tier === 'premium' && !plan.is_default && (
          <Pressable 
            style={styles.customizeButton}
            onPress={() => router.push(`/customize/${plan.id}`)}
          >
            <Ionicons name="create-outline" size={16} color="#fff" />
            <Text style={styles.customizeButtonText}>Customize Plan</Text>
          </Pressable>
        )}
      </LinearGradient>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Batch Cooking Plans</Text>
        <Text style={styles.subtitle}>Choose a plan to get started</Text>
      </View>

      {userProfile?.subscription_tier === 'premium' && (
        <View style={styles.createPlanSection}>
          <Pressable 
            style={styles.createPlanButton}
            onPress={() => router.push('/create-plan')}
          >
            <LinearGradient
              colors={['#22c55e', '#16a34a']}
              style={styles.createPlanGradient}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.createPlanText}>Create Custom Plan</Text>
              <Text style={styles.remainingText}>
                {userProfile.customizations_remaining} customizations remaining
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

      <View style={styles.plansGrid}>
        {weeklyPlans.map(renderWeeklyPlanCard)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  createPlanSection: {
    padding: 16,
  },
  createPlanButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createPlanGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPlanText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  remainingText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 'auto',
  },
  plansGrid: {
    padding: 16,
  },
  planCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradientBackground: {
    padding: 16,
  },
  planHeader: {
    marginBottom: 12,
  },
  weekStart: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  planInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    color: '#64748b',
  },
  recipesList: {
    marginBottom: 16,
  },
  recipeItem: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
  moreRecipes: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  customizeButton: {
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customizeButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
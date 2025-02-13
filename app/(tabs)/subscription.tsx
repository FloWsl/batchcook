import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function SubscriptionScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

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

  const handleUpgrade = async () => {
    // Implement payment flow
    console.log('Upgrade to premium');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Premium Features</Text>
        <Text style={styles.subtitle}>
          {userProfile?.subscription_tier === 'premium' 
            ? 'You are a premium member'
            : 'Upgrade to access premium features'}
        </Text>
      </View>

      <View style={styles.featuresSection}>
        <View style={styles.featureCard}>
          <Ionicons name="create-outline" size={24} color="#22c55e" />
          <Text style={styles.featureTitle}>Customize Weekly Plans</Text>
          <Text style={styles.featureDescription}>
            Modify existing plans to match your dietary preferences and needs
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="refresh-outline" size={24} color="#22c55e" />
          <Text style={styles.featureTitle}>5 Monthly Customizations</Text>
          <Text style={styles.featureDescription}>
            Get 5 AI-powered plan customizations every month
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="nutrition-outline" size={24} color="#22c55e" />
          <Text style={styles.featureTitle}>Dietary Preferences</Text>
          <Text style={styles.featureDescription}>
            Set your dietary preferences and restrictions for personalized plans
          </Text>
        </View>
      </View>

      {userProfile?.subscription_tier !== 'premium' && (
        <View style={styles.pricingSection}>
          <LinearGradient
            colors={['#22c55e20', '#22c55e10']}
            style={styles.pricingCard}
          >
            <Text style={styles.pricingTitle}>Premium Membership</Text>
            <Text style={styles.price}>$9.99/month</Text>
            <Text style={styles.pricingDescription}>
              Get full access to all premium features and customization options
            </Text>
            
            <Pressable style={styles.upgradeButton} onPress={handleUpgrade}>
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </Pressable>
          </LinearGradient>
        </View>
      )}

      {userProfile?.subscription_tier === 'premium' && (
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Your Premium Status</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Customizations Remaining</Text>
              <Text style={styles.statValue}>{userProfile.customizations_remaining}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Renewal Date</Text>
              <Text style={styles.statValue}>
                {new Date(userProfile.subscription_end_date!).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      )}
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
  featuresSection: {
    padding: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  pricingSection: {
    padding: 16,
  },
  pricingCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#22c55e',
    marginBottom: 12,
  },
  pricingDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsSection: {
    padding: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
});
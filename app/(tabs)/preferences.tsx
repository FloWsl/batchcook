import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Switch } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function PreferencesScreen() {
  const [preferences, setPreferences] = useState({
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isDairyFree: false,
    servings: '4',
    excludedIngredients: '',
    additionalNotes: '',
  });

  const handleSave = () => {
    // TODO: Implement save to Supabase and trigger OpenAI API call
    console.log('Saving preferences:', preferences);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dietary Preferences</Text>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Vegetarian</Text>
          <Switch
            value={preferences.isVegetarian}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, isVegetarian: value }))}
            trackColor={{ false: '#e2e8f0', true: '#22c55e' }}
          />
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Vegan</Text>
          <Switch
            value={preferences.isVegan}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, isVegan: value }))}
            trackColor={{ false: '#e2e8f0', true: '#22c55e' }}
          />
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Gluten Free</Text>
          <Switch
            value={preferences.isGlutenFree}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, isGlutenFree: value }))}
            trackColor={{ false: '#e2e8f0', true: '#22c55e' }}
          />
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Dairy Free</Text>
          <Switch
            value={preferences.isDairyFree}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, isDairyFree: value }))}
            trackColor={{ false: '#e2e8f0', true: '#22c55e' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Servings</Text>
        <TextInput
          style={styles.input}
          value={preferences.servings}
          onChangeText={(value) => setPreferences(prev => ({ ...prev, servings: value }))}
          keyboardType="numeric"
          placeholder="Number of servings"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Excluded Ingredients</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={preferences.excludedIngredients}
          onChangeText={(value) => setPreferences(prev => ({ ...prev, excludedIngredients: value }))}
          placeholder="Enter ingredients to exclude (comma separated)"
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={preferences.additionalNotes}
          onChangeText={(value) => setPreferences(prev => ({ ...prev, additionalNotes: value }))}
          placeholder="Any additional preferences or notes"
          multiline
        />
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#334155',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#334155',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
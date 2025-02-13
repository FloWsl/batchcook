import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Task, Phase } from '@/lib/types';

export default function CookingModeScreen() {
  const { phaseNumber = '0' } = useLocalSearchParams();
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const mockPhase: Phase = {
    phaseNumber: "1",
    phaseName: "Découpage et Préparation des Ingrédients",
    startTime: "00:15",
    endTime: "00:45",
    sections: [
      {
        sectionName: "Découpes Précises",
        tasks: [
          {
            time: "00:20",
            instruction: "Oignons: Éplucher et émincer 3 oignons (≈150g chacun, 2mm d'épaisseur) et répartir (1 pour chaque recette).",
            completed: false,
            priority: "high",
            mediaUrl: "https://example.com/demo/oignons.mp4"
          },
          {
            time: "00:23",
            instruction: "Ail: Éplucher 5 gousses et hacher finement (≈2mm).",
            completed: false,
            priority: "medium"
          }
        ]
      }
    ]
  };

  useEffect(() => {
    // In a real app, fetch the phase data from Supabase
    setCurrentPhase(mockPhase);
  }, [phaseNumber]);

  useEffect(() => {
    if (timer && timer > 0 && isTimerRunning) {
      const interval = setInterval(() => {
        setTimer(prev => (prev ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isTimerRunning]);

  const getCurrentTask = (): Task | null => {
    if (!currentPhase?.sections) return null;
    let taskCount = 0;
    for (const section of currentPhase.sections) {
      if (currentTaskIndex - taskCount < section.tasks.length) {
        return section.tasks[currentTaskIndex - taskCount];
      }
      taskCount += section.tasks.length;
    }
    return null;
  };

  const startTimer = (duration: number) => {
    setTimer(duration);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTask = getCurrentTask();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentPhase?.phaseName}</Text>
        <Text style={styles.subtitle}>
          {currentPhase?.startTime} - {currentPhase?.endTime}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {currentTask && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>
              {currentTask.time} - {currentTask.priority === 'high' ? '⚠️ ' : ''}{currentTask.instruction}
            </Text>
            
            {currentTask.timerDuration && (
              <View style={styles.timerContainer}>
                <Ionicons name="time-outline" size={24} color="#22c55e" />
                <Text style={styles.timeText}>
                  {timer !== null ? formatTime(timer) : formatTime(currentTask.timerDuration)}
                </Text>
                <Pressable
                  style={styles.timerButton}
                  onPress={() => timer === null ? startTimer(currentTask.timerDuration!) : toggleTimer()}
                >
                  <Text style={styles.timerButtonText}>
                    {timer === null ? 'Start Timer' : (isTimerRunning ? 'Pause' : 'Resume')}
                  </Text>
                </Pressable>
              </View>
            )}

            {currentTask.mediaUrl && (
              <View style={styles.mediaContainer}>
                <Text style={styles.mediaLink}>📹 View demonstration</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.navigation}>
        <Pressable
          style={[styles.navButton, currentTaskIndex === 0 && styles.navButtonDisabled]}
          onPress={() => setCurrentTaskIndex(prev => Math.max(0, prev - 1))}
          disabled={currentTaskIndex === 0}
        >
          <Ionicons name="arrow-back" size={24} color={currentTaskIndex === 0 ? '#94a3b8' : '#fff'} />
          <Text style={[styles.navButtonText, currentTaskIndex === 0 && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, !currentTask && styles.navButtonDisabled]}
          onPress={() => setCurrentTaskIndex(prev => prev + 1)}
          disabled={!currentTask}
        >
          <Text style={[styles.navButtonText, !currentTask && styles.navButtonTextDisabled]}>
            Next
          </Text>
          <Ionicons name="arrow-forward" size={24} color={!currentTask ? '#94a3b8' : '#fff'} />
        </Pressable>
      </View>
    </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: '#0f172a',
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  timeText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '600',
    color: '#22c55e',
  },
  timerButton: {
    marginLeft: 'auto',
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  timerButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  mediaContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  mediaLink: {
    color: '#22c55e',
    fontWeight: '500',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#e2e8f0',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginHorizontal: 8,
  },
  navButtonTextDisabled: {
    color: '#94a3b8',
  },
});
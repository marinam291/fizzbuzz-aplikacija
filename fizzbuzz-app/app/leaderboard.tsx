import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getLeaderboard, saveScore } from '../services/api';

interface Player {
  name: string;
  score: number;
  totalTime: number;
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const username = (params.username as string) || 'Anonymous';
  const scoreStr = (params.score as string) || '0';
  const totalTimeStr = (params.totalTime as string) || '0';
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [saved, setSaved] = useState(false);

  const savePlayerScore = useCallback(async () => {
  if (saved) return;
  try {
    await saveScore(username, parseInt(scoreStr), parseInt(totalTimeStr));
    setSaved(true);
    
    setTimeout(() => {
      loadLeaderboard();
    }, 500);
    
  } catch (err) {
    console.log('Error:', err);
    loadLeaderboard();
  }
}, [username, scoreStr, totalTimeStr, saved]);

  useEffect(() => {
    savePlayerScore();
  }, [savePlayerScore]);

  const loadLeaderboard = async () => {
    try {
      const data: Player[] = await getLeaderboard();

      const normalizedData = data.map((item) => ({
        ...item,
        totalTime: Number.isFinite(item.totalTime) ? item.totalTime : parseInt(String(item.totalTime), 10) || 0,
      }));

      const sortedData = [...normalizedData].sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.totalTime - b.totalTime;
      });

      setLeaderboard(sortedData);
    } catch (err) {
      console.log('Error loading leaderboard:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over!</Text>
      
      <View style={styles.currentScoreContainer}>
        <Text style={styles.currentScoreLabel}>Your Score</Text>
        <Text style={styles.currentScoreValue}>{scoreStr}</Text>
        <Text style={styles.currentTimeValue}>Time: {totalTimeStr}s</Text>
        {saved && <Text style={styles.savedText}>✓ Saved</Text>}
      </View>

      <View style={styles.leaderboardContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.sectionTitle, { flex: 1 }]}>Leaderboard</Text>
          <Text style={styles.headerLabel}>Score / Time</Text>
        </View>

        <FlatList
          data={leaderboard}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={[
              styles.playerRow,
              item.name === username && item.score === parseInt(scoreStr, 10) 
                ? styles.highlightedRow 
                : null
            ]}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>

              <View style={styles.scoreInfo}>
                <Text style={styles.scoreText}>{item.score} pts</Text>

                <Text style={styles.timeText}>
                  {item.totalTime ?? 0}s
                  </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No scores yet</Text>
          }
        />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.playAgainButton]} 
          onPress={() => router.push({ pathname: '/game', params: { username } })}
        >
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    color: '#333',
  },
  currentScoreContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#e100ff',
  },
  currentScoreLabel: {
    fontSize: 14,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  currentScoreValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#7700ff',
  },
  currentTimeValue: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
  },
  savedText: {
    marginTop: 5,
    color: '#a72828',
    fontSize: 12,
    fontWeight: 'bold',
  },
  leaderboardContainer: {
    flex: 1,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  highlightedRow: {
    backgroundColor: '#e2dbe2',
    borderWidth: 1.5,
    borderColor: '#9900ff',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff0000',
    width: 35,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  scoreInfo: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e719c5',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#d63070',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  playAgainButton: {
    backgroundColor: '#e73ba5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

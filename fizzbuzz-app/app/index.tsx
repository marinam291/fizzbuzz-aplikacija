import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { getLeaderboard } from '../services/api';

import { Trophy } from 'lucide-react-native';

type Player ={
  name: string;
  score: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTopPlayers();
  }, []);

  const loadTopPlayers = async () => {
    try {
      const data = await getLeaderboard();
      setTopPlayers(data.slice(0, 3));
    } catch (err) {
      console.log('Error loading leaderboard:', err);
    }
  };

  const startGame = () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    router.push({ pathname: '/game', params: { username } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fizz Buzz Game</Text>
      
      <View style={styles.inputSection}>
        <Text style={styles.label}>Enter your name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={username}
          onChangeText={setUsername}
          maxLength={10}
          autoCorrect={false}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>

      <View style={styles.leaderboardPreview}>
        <Text style={styles.sectionTitle}>Top 3 Players</Text>
        {topPlayers.length > 0 ? (
          <FlatList
            data={topPlayers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              let trophyColor = index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32";
              
              return (
                <View style={styles.playerRow}>
                  <Trophy size={20} color={trophyColor} style={{ marginRight: 5 }} />
                  <Text style={[styles.playerRank, { color: trophyColor }]}>#{index + 1}</Text>
                  <Text style={styles.playerName}>{item.name}</Text>
                  <Text style={styles.playerScore}>{item.score}</Text>
                </View>
            );
          }}
          />
        ) : (
          <Text style={styles.noDataText}>No scores yet</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Betania Patmos',
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  inputSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#ff0000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaderboardPreview: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
  playerRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff0000',
    width: 40,
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  playerScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e719c5',
  },
  noDataText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 16,
  },
});

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';

export default function RootLayout() {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.appWrapper}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Fizz Buzz Game' }} />
          <Stack.Screen name="game" options={{ title: 'Play Game' }} />
          <Stack.Screen name="leaderboard" options={{ title: 'Leaderboard' }} />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  appWrapper: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        maxWidth: 450, 
        maxHeight: 850,  
        marginVertical: 20,
        borderRadius: 20,
        overflow: 'hidden', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
      },
    }),
    backgroundColor: '#fff',
  },
});
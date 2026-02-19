import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function GameScreen() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [currentNumber, setCurrentNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const timerRef = useRef<any>(null);

  const getCorrectAnswer = (number: number): string => {
    if (number % 3 === 0 && number % 5 === 0) return "FizzBuzz";
    if (number % 3 === 0) return "Fizz";
    if (number % 5 === 0) return "Buzz";
    return "Next";
  };

  useEffect(() => {
    let interval: any;
    if (!isGameOver) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameOver]);

  const handleGameOver = useCallback(
    (message: string) => {
      setIsGameOver(true);

      Alert.alert(`Game Over`, `${message} Tvoj rezultat: ${score}`);

      setTimeout(() => {
        router.replace({
          pathname: "/leaderboard",
          params: {
            username,
            score: score.toString(),
            totalTime: totalSeconds.toString(),
            achievedAt: new Date().getTime().toString(),
          },
        });
      }, 100);
    },
    [router, score, totalSeconds, username],
  );

  useEffect(() => {
    if (isGameOver) return;

    if (timeLeft === 0) {
      handleGameOver("Vrijeme je isteklo!");
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, isGameOver, handleGameOver]);

  const handleAnswer = (answer: string) => {
    if (isGameOver) return;

    const correctAnswer = getCorrectAnswer(currentNumber);

    if (answer === correctAnswer) {
      if (currentNumber === 100) {
        setScore(score + 1);
        handleGameOver("Čestitamo! Završili ste igru!");
        return;
      }

      setScore(score + 1);
      setCurrentNumber((prev) => prev + 1);
      setTimeLeft(5);
    } else {
      handleGameOver("Krivi odgovor!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.playerText}>Player: {username}</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Time</Text>
          <Text
            style={[styles.timerValue, timeLeft <= 1 && { color: "#e100ff" }]}
          >
            {timeLeft}s
          </Text>
        </View>
      </View>

      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>{currentNumber}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.fizzButton]}
          onPress={() => handleAnswer("Fizz")}
        >
          <Text style={styles.buttonText}>Fizz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buzzButton]}
          onPress={() => handleAnswer("Buzz")}
        >
          <Text style={styles.buttonText}>Buzz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.fizzBuzzButton]}
          onPress={() => handleAnswer("FizzBuzz")}
        >
          <Text style={styles.buttonText}>FizzBuzz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={() => handleAnswer("Next")}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f80808",
  },
  timerContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#f80808",
    minWidth: 80,
  },
  timerLabel: {
    fontSize: 10,
    color: "#555",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  timerValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f80808",
  },
  numberContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  numberText: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#333",
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  button: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  fizzButton: {
    backgroundColor: "#ae00ff",
  },
  buzzButton: {
    backgroundColor: "#ff00aa",
  },
  fizzBuzzButton: {
    backgroundColor: "#e730ff",
  },
  nextButton: {
    backgroundColor: "#c73465",
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

import axios from 'axios';

const API_URL = 'http://10.67.76.65:3000/api';

export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

export const saveScore = async (name, score, totalTime) => {
  try {
    const response = await axios.post(`${API_URL}/scores`, { name: name, score: score, totalTime: totalTime });
    return response.data;
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
};

import fetch from 'node-fetch';

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_URL = 'https://api.daily.co/v1';

export const createRoom = async (sessionId: string) => {
  const response = await fetch(`${DAILY_API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DAILY_API_KEY}`
    },
    body: JSON.stringify({
      name: `interview-${sessionId}`,
      privacy: 'private',
      properties: {
        enable_recording: 'cloud', // Auto-record
        enable_screenshare: false,  // Prevent cheating
        enable_chat: false,         // Focus on interview
        exp: Math.floor(Date.now() / 1000) + 7200, // 2 hour expiry
      }
    })
  });

  const data = await response.json();
  return data.url; // WebRTC room URL
};

export const deleteRoom = async (roomName: string) => {
  await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${DAILY_API_KEY}`
    }
  });
};
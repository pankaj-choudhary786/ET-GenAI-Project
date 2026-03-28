import axios from 'axios';

export async function sendSlackAlert(webhookUrl, message) {
  if (!webhookUrl) return;
  try {
    await axios.post(webhookUrl, {
      text: message,
      username: 'AI Sales Agent',
      icon_emoji: ':robot_face:'
    });
  } catch (error) {
    console.error('Slack alert failed:', error.message);
  }
}

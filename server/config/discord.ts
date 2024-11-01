import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { incrementCurrency } from './db';
import { broadcastCurrencyUpdate } from '../services/websocket';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (!message.author.bot) {
    const discordId = message.author.id;
    const username = message.author.username;
    const currencyIncrease = 1;

    const updatedUser = await incrementCurrency(discordId, currencyIncrease);
    if (updatedUser) {
      broadcastCurrencyUpdate(username, updatedUser.currency)
    }
    console.log(`Added ${currencyIncrease} currency to ${message.author.tag}`)
  }
});

const userCallTimes = new Map<string, number>();

client.on('voiceStateUpdate', async (oldState, newState) => {
  const discordId = newState.member?.user.id;
  const username = newState.member?.user.username;
  if (!discordId || !username || newState.member?.user.bot) return;

  if (!oldState.channel && newState.channel) {
    userCallTimes.set(discordId, Date.now());
  } else if (oldState.channel && !newState.channel) {
    const startTime = userCallTimes.get(discordId);
    if (startTime) {
      const durationMinutes = (Date.now() - startTime) / 60000;
      const currencyIncrease = Math.floor(durationMinutes);

      const updatedUser = await incrementCurrency(discordId, currencyIncrease);
      if (updatedUser) {
        broadcastCurrencyUpdate(username, updatedUser.currency);
      }

      userCallTimes.delete(discordId);
      console.log(`Added ${currencyIncrease} currency to ${newState.member.user.tag}`);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

export default client;

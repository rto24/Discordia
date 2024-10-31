import { Client, GatewayIntentBits } from 'discord.js';
import { incrementCurrency } from './db';
import dotenv from 'dotenv';

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
    const currencyIncrease = 1;
    await incrementCurrency(discordId, currencyIncrease);
    console.log(`Added ${currencyIncrease} currency to ${message.author.tag}`)
  }
});

const userCallTimes = new Map<string, number>();

client.on('voiceStateUpdate', async (oldState, newState) => {
  const discordId = newState.member?.user.id;
  if (!discordId || newState.member?.user.bot) return;

  if (!oldState.channel && newState.channel) {
    userCallTimes.set(discordId, Date.now());
  } else if (oldState.channel && !newState.channel) {
    const startTime = userCallTimes.get(discordId);
    if (startTime) {
      const durationMinutes = (Date.now() - startTime) / 60000;
      const currencyIncrease = Math.floor(durationMinutes);
      await incrementCurrency(discordId, currencyIncrease);
      userCallTimes.delete(discordId);
      console.log(`Added ${currencyIncrease} currency to ${newState.member.user.tag}`);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

export default client;

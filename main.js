const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");
const { DISCORD_BOT_TOKEN } = require("./config.json");

const {
  queueCommand,
  playCommand,
  pauseCommand,
  resumeCommand,
  leaveCommand,
} = require("./commands/AudioCommand.js");

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const prefix = "-";

// When the client is ready, run this code (only once)
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Type "play" to start!');
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return false; // Terminate if the message is from a bot

  messageContent = message.content // clean the message before analysing
    .toLowerCase()
    .replaceAll("!", "")
    .replaceAll("?", "")
    .replaceAll("*", "")
    .replaceAll("#", "");

  if (messageContent.split(" ").includes("okaeri")) {
    ``;

    if (messageContent.split(" ").includes("play")) {
      console.log("triggered play music");
      playCommand(message);
    } else if (messageContent.split(" ").includes("que")) {
      console.log("triggered queue music");
      queueCommand(message);
    } else if (messageContent.split(" ").includes("pause")) {
      console.log("triggered pause music");
      pauseCommand(message);
    } else if (messageContent.split(" ").includes("resume")) {
      console.log("triggered resume music");
      resumeCommand(message);
    } else if (messageContent.split(" ").includes("leave")) {
      console.log("triggered leave vc");
      leaveCommand(message);
    }
  }
});

client.login(DISCORD_BOT_TOKEN);

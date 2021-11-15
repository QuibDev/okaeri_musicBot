const ytdl = require("ytdl-core");
const play = require("play-dl");
const ytSearch = require("yt-search");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  StreamType,
} = require("@discordjs/voice");

const player = createAudioPlayer({
  noSubscriber: NoSubscriberBehavior.Pause,
});

const videoFinder = async (query) => {
  const videoResult = await ytSearch(query);

  return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
};

var playlist = [];

async function playCommand(message) {
  const voiceChannel = message.member.voice.channel;

  messageContent = message.content // clean the message before analysing
    .toLowerCase()
    .replaceAll("!", "")
    .replaceAll("?", "")
    .replaceAll("*", "")
    .replaceAll("#", "");

  title = messageContent
    .match(/"(.*?)"/g)
    .toString()
    .replaceAll('"', "");

  if (!voiceChannel)
    return message.reply(
      `Ummm, ${message.author} You need to be in a voice channel to execute this command!`
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT"))
    return message.channel.send(
      "Aeri sees that You dont have the correct permissions :<"
    );
  if (!permissions.has("SPEAK"))
    return message.channel.send(
      "Aeri sees that You dont have the correct permissions :<"
    );
  if (!title.length)
    return message.channel.send("You need to send the second argument!");

  const channelID = message.member.voice.channel
    .toString()
    .replaceAll("<", "")
    .replaceAll(">", "")
    .replaceAll("#", "");

  console.log(`VoiceChannel ID: ${channelID}`);

  const connection = joinVoiceChannel({
    channelId: channelID,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
  });

  playlist.push(title);

  console.log(`playlist: ${playlist} ${playlist.length}`);

  for (let song = 0; song < playlist.length; song++) {
    if (song) {
      const video = await videoFinder(title);
      console.log("found video on youtube: ", video.title, video.url);

      let stream = await play.stream(video.url);
      let resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });

      connection.subscribe(player);

      await message.reply(`:thumbsup: Now Playing ***${video.title}***`);
      player.play(resource);
    } else {
      message.channel.send(
        "Aeri couldn't find any results for this video :<<<<"
      );
    }
  }
}

async function queueCommand(message) {
  messageContent = message.content // clean the message before analysing
    .toLowerCase()
    .replaceAll("!", "")
    .replaceAll("?", "")
    .replaceAll("*", "")
    .replaceAll("#", "");

  title = messageContent
    .match(/"(.*?)"/g)
    .toString()
    .replaceAll('"', "");

  const video = await videoFinder(title).then((song) => {
    playlist.push(song.title);
    message.reply(`:ok_hand: added to que ***${song.title}***`);
  });
}

async function pauseCommand(message) {
  player.pause();
  message.reply(`:pause_button: now paused`);
}

async function resumeCommand(message) {
  player.unpause();
  message.reply(`:play_pause: now unpaused`);
}

async function leaveCommand(message) {
  const channelID = message.member.voice.channel
    .toString()
    .replaceAll("<", "")
    .replaceAll(">", "")
    .replaceAll("#", "");

  console.log(`VoiceChannel ID: ${channelID}`);

  const connection = joinVoiceChannel({
    channelId: channelID,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
  });

  player.stop();
  connection.disconnect(player);
  playlist = []; // empty the playlist
  message.reply(`:: left voice channel sucessfully`);
}

module.exports = {
  playCommand,
  queueCommand,
  pauseCommand,
  resumeCommand,
  leaveCommand,
};

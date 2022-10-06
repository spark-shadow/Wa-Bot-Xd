const {
        bot,
        getUrl,
        songYT,
        videoYT,
        removebg,
        takeAudio,
        downloadFromURL
      } = require('../lib/')
const config = require('../config')
const { sticker, csticker,
          emix,
             emoji,
                toMp4,
                   toImg,
                      toMp3,
                         toPTT,
                            take } = require('../shadow-xdd/')
let MODE = config.MODE == 'public' ? false : true

bot(
	{
		pattern: 'emix ?(.*)',
		fromMe: MODE,
		desc: 'Mix to emojis',
		type: 'media'
	},
	async (message, match) => {

     if (!match) return await message.reply('Example .emix 🙂❤️')
     await emix(message, match)
   }
)
bot(
	{
		pattern: 'emoji ?(.*)',
		fromMe: MODE,
		desc: 'Creat emoji as sicker',
		type: 'media'
	},
	async (message, match) => {

     if (!match) return await message.reply('Example .emoji 🙃')
     await emoji(message, match)
   }
)
bot(
	{
		pattern: 'sticker ?(.*)',
		fromMe: MODE,
		desc: 'convert image/video to sticker',
		type: 'media'
	},
	async (message, match) => {

       if (!message.reply_message)
             return await message.reply("_Reply to a photo/video!_")
       await sticker(message)
    }
)
bot(
	{
		pattern: 'cs ?(.*)',
		fromMe: MODE,
		desc: 'creat croped sticker',
		type: 'media'
	},
	async (message, match) => {

       if (!message.reply_message)
             return await message.reply("_Reply to a photo/video!_")
       await csticker(message)
    }
)
bot(
	{
		pattern: 'take ?(.*)',
		fromMe: MODE,
		desc: 'change sticker metadata',
		type: 'media'
	},
	async (message, match) => {

       if (!message.reply_message)
             return await message.reply("_Reply to a sticker!_")
       await take(message, match)
    }
)
bot(
	{
		pattern: 'photo ?(.*)',
		fromMe: MODE,
		desc: 'convert sticker to image',
		type: 'media'
	},
	async (message, match) => {

       if (!message.reply_message)
             return await message.reply("_Reply to a sticker!_")
       await toImg(message)
    }
)
bot(
	{
		pattern: 'mp4 ?(.*)',
		fromMe: MODE,
		desc: 'convert sticker to video',
		type: 'media'
	},
	async (message, match) => {

       if (!message.reply_message)
             return await message.reply("_Reply to a sticker!_")
      await toMp4(message)
    }
)
bot(
	{
		pattern: 'mp3 ?(.*)',
		fromMe: MODE,
		desc: 'convert audio from to video',
		type: 'media'
	},
	async (message, match) => {

       if (!message.reply_message)
             return await message.reply("_Reply to a video!_")
       await toMp3(message)
    }
)
bot(
	{
		pattern: 'tovn ?(.*)',
		fromMe: MODE,
		desc: 'convert audio to voice',
		type: 'media'
	},
	async (message, match) => {

       if (!message.reply_message)
             return await message.reply("_Reply to a audio!_")
       await toPTT(message)
    }
)
bot(
	{
		pattern: 'url ?(.*)',
		fromMe: MODE,
		desc: 'get url of replied media',
		type: 'media'
	},
	async (message, match) => {

       if (!message.reply_message)
             return await message.reply("_Reply to an image/video!_")
       await getUrl(message)
    }
)
bot({
        pattern: 'rmbg ?(.*)',
        fromMe: MODE,
        desc: 'Remove background of replied photo',
        type: 'media'
    },
    async (message, match) => {

        if (!message.reply_message || !message.reply_message.image)
            return await message.reply("*Reply to a photo*");

        await removebg(message)
    }
)
bot({
        pattern: 'tts ?(.*)',
        fromMe: MODE,
        desc: 'Convert text to voice',
        type: 'misc'
    },
    async (message, match) => {

        const { shadowTTS } = require('../lib/')
        await shadowTTS(match, message)
    }
)
bot({
        pattern: 'song ?(.*)',
        fromMe: MODE,
        desc: 'Download song from YouTube',
        type: 'download'
    },
    async (message, match) => {

        if (!match)
            return await message.reply('Give me a song name or link');

        await songYT(match, message)
    }
)
bot({
        pattern: 'video ?(.*)',
        fromMe: MODE,
        desc: 'Download video from YouTube',
        type: 'download'
    },
    async (message, match) => {

        if (!match)
            return await message.reply('Give me a video link');

        await videoYT(match, message)
    }
)
bot({
        pattern: 'atake ?(.*)',
        fromMe: MODE,
        desc: 'Change metadata of replied audio',
        type: 'media'
    },
    async (message, match) => {

        const fs = require('fs')

        if (!message.reply_message || !message.reply_message.audio)
            return await message.reply('_Replay to an audio_')

        let audio = await message.reply_message.toFile('audio')
        await takeAudio(match, fs.readFileSync(audio), message)
    }
)
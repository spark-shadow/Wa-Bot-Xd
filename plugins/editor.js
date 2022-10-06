const {
        Shadow,
        mergeVideos,
        toSlowMotion,
        videoToGif,
        changeFps,
        execute
      } = require('../lib/')
const fs = require('fs')
const config = require('../config')
let MODE = config.MODE == 'public' ? false : true

Shadow(
    {
        pattern: 'merge ?(.*)',
        fromMe: MODE,
        desc: 'Merge two videos',
        type: 'editor'
    },
    async (message, match) => {

        if (!fs.existsSync("./media/vmix")) {
            fs.mkdirSync("./media/vmix")
        }
        
        let files = fs.readdirSync("./media/vmix/")
        if ((!message.reply_message && files.length < 2) || (message.reply_message && !message.reply_message.video))
           return await message.reply("Give me videos");
        if (message.reply_message.video && files.length == 1) {
            var savedFile = await message.reply_message.toFile();
            await fs.writeFileSync('./media/vmix/video1.mp4', fs.readFileSync(savedFile));
            return await message.reply(
                "*Added video 2. Type .merge to process!*"
            )
        }
        if (message.reply_message.video && files.length == 0) {
            var savedFile = await message.reply_message.toFile();
            await fs.writeFileSync('./media/vmix/video2.mp4', fs.readFileSync(savedFile));
            return await message.reply("*Added video 1*")
        }
        if (files.length === 2) {
            await message.reply("*Merging videos..*")
            await message.sendMessage(message.jid, { video: 
                await mergeVideos([
                  './media/vmix/video1.mp4',
                  './media/vmix/video2.mp4'
                ],
                  './media', 'merged.mp4') }, { quoted: message.data });
          
            await fs.unlinkSync('./media/vmix/video1.mp4');
            await fs.unlinkSync('./media/vmix/video2.mp4');
            return;
        }
    }
 )
Shadow(
    {
        pattern: 'slowmo ?(.*)',
        fromMe: MODE,
        desc: 'Add slow motion to video',
        type: 'editor'
    },
    async (message, match) => {

        if (
            !message.reply_message ||
            !message.reply_message.video
           )
            return await message.reply(
              "_Reply to a video_"
           )

        await toSlowMotion(message)
    }
)
Shadow(
    {
        pattern: 'togif ?(.*)',
        fromMe: MODE,
        desc: 'Convert video to gif with audio',
        type: 'editor'
    },
    async (message, match) => {

        if (
            !message.reply_message ||
            !message.reply_message.video
           )
            return await message.reply(
              "_Reply to a video_"
           )

        await videoToGif(message)
    }
)
Shadow(
    {
        pattern: 'interp ?(.*)',
        fromMe: MODE,
        desc: 'Change FPS of videos',
        type: 'editor'
    },
    async (message, match) => {

        if (
            !message.reply_message ||
            !message.reply_message.video
           )
            return await message.reply(
              "_Reply to a video_"
           )
          if (match <= 10)
          return await message.reply(
            '*⚠️ FPS Value is low*\n*Minimun = 10*'
          );
          if (match >= 500)
          return await message.reply(
            '*⚠️  FPS Value is high*\n*Maximum = 500*'
          )
         await changeFps(message, match)
    }
)
Shadow(
    {
        pattern: 'bass ?(.*)',
        fromMe: MODE,
        desc: 'Add bass in audio',
        type: 'editor'
    },
    async (message, match) => {

        if (!message.reply_message || !message.reply_message.audio)
            return await message.reply(
                "_Reply to a audio_"
            )
        const media = await message.reply_message.toFile()
        match = match || '15'

        execute('ffmpeg -i ' + media + ' -af equalizer=f=54:width_type=o:width=2:g=' + match + ' bass.mp3', async (e) => {
            if (e) return await message.reply('_Failed to process_')
            await message.send(await fs.readFileSync('bass.mp3'), {
                mimetype: 'audio/mpeg',
                quoted: message.data
            }, 'audio')
            await fs.unlinkSync('bass.mp3')
        })
    }
)
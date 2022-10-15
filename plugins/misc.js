const {
        bot,
        mono,
        mode,
        allFonts,
        toStylish,
        fancyText,
        readmore,
        googleImage,
        toFormart,
        forward,
        toSmall,
        isUrl,
        takeSS,
        takeFullSS,
        attp,
        sendSticker,
        pinterest,
        translator,
        splitJids,
      } = require('../lib/')

bot(
    {
        pattern: 'fancy ?(.*)',
        fromMe: mode,
        desc: 'convert text to stylish text',
        type: 'misc'
    },
    async (message, match) => {

        if (!match)
            return await message.reply(
                '_Give me a Text_'
            )
        let result = await fancyText(match)
        let text = `Orginal Text: *${match}*\n\n❐ Fancy texts:\n\n`
        let no = 1
        for (let i of result) {
            text += `${no++}. ${i.result}\n\n`
        }
        await message.send(text, {
            quoted: message.data
        })
    }
)
bot(
    {
        pattern: 'style ?(.*)',
        fromMe: mode,
        desc: 'convert text to fancy text',
        type: 'misc'
    },
    async (message, match) => {

        if (!match || !message.reply_message)
            return await message.reply('_Give me a text or reply to a text_')
        let text = mono("Fancy text generator\n\nreply to a text with number\n\n");
        allFonts(match || message.reply_message).forEach((txt, num) => {
            text += `${(num++)} ${txt}\n`;
        });
        return await message.reply(text);
    }
)
bot(
    {
        pattern: 'forward ?(.*)',
        fromMe: true,
        desc: 'forward replied message',
        type: 'misc'
    },
    async (message, match) => {

        if (!message.reply_message)
            return await message.reply(`_Replay to any message_\n  _example: .forward jid jid_`)
        const { jids } = await splitJids(match)
        for (let jid of jids) {
            await forward(message, jid)
        }
    }
)
bot(
    {
        pattern: 'save ?(.*)',
        fromMe: true,
        desc: 'your own number will send the repled msg',
        type: 'misc'
    },
    async (message, match) => {

        if (!message.reply_message)
            return await message.reply(`_Replay to any message_`)
        await forward(message, message.client.user.id)
    }
)
bot(
    {
        pattern: 'rdmore ?(.*)',
        fromMe: mode,
        desc: 'add readmore in text',
        type: 'misc'
    },
    async (m, match) => {

        if (!match)
            return await m.reply('_Example: .rdmore Hello #rdmore_')
        await m.reply(match.replaceAll('#rdmore', await readmore()))
    }
)
bot(
    {
        pattern: 'upload ?(.*)',
        fromMe: mode,
        desc: 'Upload the data of url',
        type: 'misc'
    },
    async (message, match) => {

        match = match || message.reply_message
        if (!match)
            return await message.reply(`_Give me a url_`)
        await message.sendFromUrl(match, {
            quoted: message.data
        })
    }
)
bot(
    {
        pattern: 'ss ?(.*)',
        fromMe: mode,
        desc: 'Take screen shot from url',
        type: 'misc'
    },
    async (message, match) => {

        if (!config.SS_API_KEY)
            return await message.reply('Please take api key from.. https://app.screenshotapi.net/dashboard\n & set var SS_API_KEY')

        match = match || message.reply_message.text

        if (!match)
            return await message.reply('Give me a link')

        await message.sendFromUrl(await takeSS(match), {
            quoted: message.data
        })
    }
)
bot(
    {
        pattern: 'fullss ?(.*)',
        fromMe: mode,
        desc: 'Take screen shot from url',
        type: 'misc'
    },
    async (message, match) => {

        if (!config.SS_API_KEY)
            return await message.reply('Please take api key from.. https://app.screenshotapi.net/dashboard\n & set var SS_API_KEY')

        match = match || message.reply_message.text

        if (!match)
            return await message.reply('Give me a link')

        await message.sendFromUrl(await takeFullSS(match), {
            quoted: message.data
        })
    }
)
bot(
    {
        pattern: 'ttp ?(.*)',
        fromMe: mode,
        desc: 'make text to sticker',
        type: 'media'
    },
    async (message, match) => {

        if (!match)
            return await message.reply('Give me a text')

        var text = encodeURI(match)
        await sendSticker(message, `https://api.xteam.xyz/ttp?file&text=${text}`, {
            quoted: message.data
        })
    }
)
bot(
    {
        pattern: 'attp ?(.*)',
        fromMe: mode,
        desc: 'make text to colorfull sticker',
        type: 'media'
    },
    async (message, match) => {

        if (!match)
            return await message.reply('Give me a text')

        await sendSticker(message, await attp(match), {
            quoted: message.data
        })
    }
)
bot(
    {
        pattern: 'img ?(.*)',
        fromMe: mode,
        desc: "Google Image search",
        type: 'download'
    },
    async (message, match) => {

        if (!match)
            return await message.reply("Enter word/amount");
        let [query, amount] = match.split("/");
        let result = await googleImage(query, amount);
        await message.reply(
            `_Downloading ${amount || 5} images for ${query}_`
        );
        for (let i of result) {
            await message.sendFromUrl(i, {
                quoted: message.data
            });
        }
    }
);
bot(
    {
        pattern: 'fetch ?(.*)',
        fromMe: mode,
        desc: "stringyfy replied message",
        type: 'misc'
    },
    async (msg, text) => {

        text = msg.reply_message

        if (!text)
            return await msg.reply('Replay to any Message..')
        const data = await toFormart(text)
        await msg.send(data,
        {
            quoted: msg.data
        }, 'text')
    }
)
bot(
    {
        pattern: 'pinterest ?(.*)',
        fromMe: mode,
        desc: "Downlod image from Pinterest",
        type: 'misc'
    },
    async (message, text) => {

        image = await pinterest(text)
        result = image[Math.floor(Math.random() * image.length)]
        await message.send(result,
        {
            caption: 'Media Url : ' + result,
            quoted: message.data
        }, 'image')
    }
)
bot(
    {
        pattern: 'trt ?(.*)',
        fromMe: mode,
        desc: 'Translate replied text',
        type: 'misc'
    },
    async (message, match) => {

        if (!message.reply_message)
            return await message.reply(
                '_Reply to a text message_\n*Example: .trt ml_'
            )
        const [to, from] = match.split(' ')
        await translator(message, to, from)
    }
)
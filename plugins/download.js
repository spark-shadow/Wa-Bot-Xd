const {
       Shadow,
       yta,
       isUrl,
       ytv,
       ytAudio,
       ytSearch,
       ytDownload,
       Insta,
       MODE
      } = require('../lib/')

Shadow(
    {
        pattern: "yta ?(.*)",
        fromMe: MODE,
        desc: "Downloads Song",
        type: 'download'
    },
    async (message, match) => {

        match = match || message.reply_message.text

        if (!match)
            return await message.reply('Give me a song name or link')

        if (await isUrl(match)) {
            if (ytDownload.test(match)) {
                yta(match.trim()).then(({
                    dl_link,
                    title
                }) => {
                    message.reply(`_Downloading ${title}_`)
                    message.sendFromUrl(dl_link, {
                        filename: title
                    });
                });
            }
        } else {
            let result = await ytSearch(match)
            await ytAudio(result, message)
        }
    }
);
Shadow(
    {
        pattern: "ytv ?(.*)",
        fromMe: MODE,
        desc: "Downloads video",
        type: 'download'
    },
    async (message, match) => {

        match = match || message.reply_message.text

        if (!match)
            return await message.reply('Give me a video name or link')

        if (await isUrl(match)) {
            if (ytDownload.test(match)) {
                ytv(match.trim()).then(({
                    dl_link,
                    title
                }) => {
                    message.reply(`_Downloading ${title}_`)
                    message.sendFromUrl(dl_link, {
                        filename: title
                    });
                });
            }
        } else {
            ytSearch(match + "video").then(async ({
                all
            }) => {
                await message.reply(`_Downloading ${all[0].title}_`);
                ytv(all[0].url).then(({
                    dl_link,
                    title
                }) => {
                    message.sendFromUrl(dl_link, {
                        filename: title,
                        quoted: message.data
                    });
                });
            });
        }
    }
);
Shadow(
    {
        pattern: 'insta ?(.*)',
        fromMe: MODE,
        desc: 'Download from Instagram',
        type: 'download',
    },
    async (message, match) => {

        match = match || message.reply_message.text
        if (!match)
            return await message.reply(
                '_Example : .insta url_'
            )
        const result = await Insta(match)
        if (!result.length)
            return await message.reply('*Not found*')
        for (const url of result) {
            await message.sendFromUrl(url)
        }
    }
)
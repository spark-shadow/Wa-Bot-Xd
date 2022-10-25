const { bot, mode, addCmd } = require('../lib/');

bot({
        pattern: 'ping ?(.*)',
        fromMe: mode,
        desc: 'Check Ping',
        type: 'misc'
    },
    async (message, match) => {

        var start = new Date().getTime();
          await message.reply(
          `*_Ping!_*`
          );
        var end = new Date().getTime();
          await message.reply(
            '*_Pong!_*\n _' + (end - start) + ' ms_'
        );
    }
)
bot({
        pattern: 'qr ?(.*)',
        fromMe: mode,
        desc: 'Convert text to qr & fetch data from qr',
        type: 'misc'
    },
    async (message, match) => {

        const Qr = require('../lib/')
        const jimp = require('jimp')

        if (match)
            return await message.sendFromUrl(
                await Qr.generateQr(match)
            )
        if (!message.reply_message || !message.reply_message.image)
            return await message.reply(
                '_Example : qr text*\n*Reply to a qr code.._'
            )
        const { bitmap } = await jimp.read(
            await message.reply_message.toFile()
        )
        await Qr.readQrCode(message, bitmap)
    }
)
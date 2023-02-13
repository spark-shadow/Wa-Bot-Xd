const { bot, alive_message, prefix, mode } = require('../lib/')

bot(
    {
        pattern: 'alive ?(.*)',
        fromMe: mode,
        desc: 'Alive message',
        type: 'misc'
    },
    async (message, match) => {

        await alive_message(match, message)
    }
);
bot(
    {
        pattern: 'poll ?(.*)',
        fromMe: mode,
        desc: 'Creat poll',
        type: 'misc'
    },
    async (message, match) => {

        if (!match || match.split(":") < 2)
            return await message.reply(
                `_${prefix}poll question:option1,option2..._`
            );
        await message.poll(match)
    }
);
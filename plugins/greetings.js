const {
        bot,prefix,
        setGreetings,
        getGreetings,
        welcomManager,
        deleteGreetings,
      } = require("../lib/");

bot(
    {
        pattern: 'welcome ?(.*)',
        fromMe: true,
        desc: 'Set Welcome Message',
        type: 'user'
    },
    async (message, match) => {

        var welcome = await getGreetings(message.jid)
        if (match == '') {
            if (!welcome) {
                await message.reply('_No Welcome Message Found_');
            } else {
                await message.reply(welcome.message);
            }
        } else if (match == 'delete') {
            await message.reply('_Welcome Deleted_');
            return await deleteGreetings(message.jid, 'welcome');
        } else {
            await setGreetings(message.jid, 'welcome', match.replace(/&/g, '\n'));
            return await message.reply(
                '_Welcome Message Set To:_\n\n' + match
            )
        }
    }
)
bot(
    {
        pattern: 'goodbye ?(.*)',
        fromMe: true,
        desc: 'Set GoodBye Message',
        type: 'user'
    },
    async (message, match) => {

        var goodbye = await getGreetings(message.jid, 'goodbye')
        if (match == '') {
            if (!goodbye) {
                await message.reply('_No GoodBye Message Found_')
            } else {
                await message.reply(goodbye.message);
            }
        } else if (match === 'delete') {
            await message.reply('_GoodBye Deleted_');
            return await deleteGreetings(message.jid, 'goodbye');
        } else {
            await setGreetings(message.jid, 'goodbye', match.replace(/#/g, '\n'));
            return await message.reply(
                '_GoodBye Message Set To:_\n\n' + match
            )
        }
    }
)
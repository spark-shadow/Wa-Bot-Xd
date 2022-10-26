const { bot, isAdmin } = require('../lib/')

bot(
    {
        pattern: 'delt ?(.*)',
        fromMe: true,
        desc: 'Delete replied message for evryone',
        type: 'user'
    },
    async (message, match) => {

        if (!message.reply_message)
            return await message.reply(`_Replay to a message_`)

        let key = {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        }
        return await message.delete(key)
    }
)
bot(
    {
        pattern: 'dlt ?(.*)',
        fromMe: true,
        desc: 'delete msg from group by admin',
        type: 'user'
    },
    async (message, match) => {

        if (!message.reply_message)
            return await message.reply(`_Replay to a message_`)

        let dlt_key = {
            remoteJid: message.jid,
            id: message.reply_message.id,
            fromMe: message.reply_message.id.fromMe,
            participant: message.reply_message.jid
        }
        const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin)
            return await message.reply(`_I'm not an admin._`)
        await message.delete(dlt_key)
    }
);
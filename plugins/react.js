const { bot, sendReact, mode } = require('../lib/')

bot(
	{
		pattern: 'react ?(.*)',
		fromMe: mode,
		desc: 'React to replied msg',
		type: 'misc'
	},
	async (message, match) => {

  if (!match || !message.reply_message) return await message.sendMessage(`_Example: .react 🥰`)
    await message.client.sendMessage(message.jid, await sendReact(message, match));
  }
)
bot(
    {
        pattern: 'google ?(.*)',
        fromMe: mode,
        desc: 'Search on google',
        type: 'misc'
    },
    async (message, match) => {

        const { onGoogle } = require('../lib/')
        if (!match)
            return await message.reply('_Example : .google your query_')
       await onGoogle(match, message)
    }
)
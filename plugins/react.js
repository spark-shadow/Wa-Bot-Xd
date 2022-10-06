const { bot, sendReact } = require('../lib/')
const { MODE } = require('../config');
let MOD = MODE == 'public' ? false : true

bot(
	{
		pattern: 'react ?(.*)',
		fromMe: MOD,
		desc: 'React to replied msg',
		type: 'misc'
	},
	async (message, match) => {

  if (!match || !message.reply_message) return await message.sendMessage(`_Example: .react 🥰`)
    await message.client.sendMessage(message.jid, await sendReact(message, match));
  }
)

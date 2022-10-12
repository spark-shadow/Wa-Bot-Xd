// by @shadow
const { bot, alive_message, prefix } = require('../lib/')
const { MODE } = require('../config');
let MOD = MODE == 'public' ? false : true

bot(
	{
		pattern: 'alive ?(.*)',
		fromMe: MOD,
		desc: 'Alive message',
		type: 'misc'
	},
	async (message, match) => {

     await alive_message(match, message)
   }
 )
bot(
	{
		pattern: 'poll ?(.*)',
		fromMe: MOD,
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
)

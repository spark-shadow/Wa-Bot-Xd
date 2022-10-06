// by @shadow

const { bot, alive_message } = require('../lib/')
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

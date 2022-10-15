const Shadow = require('../lib/bot')
const { VERSION, modeE } = require('../config')
const {
	Bot,
	mono,
	Fancy,
	prefix,
	upTime,
	readmore,
	fetchFonts,
	mode
} = require('../lib/');

Bot({
	pattern: 'menu',
	fromMe: mode,
	type: 'Command list'
}, async (message, match) => {

	const commands = {}
	const Font = fetchFonts()
	Shadow.commands.map(async (command, index) => {
		if (command.dontAddCommandList === false && command.pattern !== undefined) {
			try {
				var match = command.pattern.toString().match(/(\W*)([A-Za-zğüşıiöç1234567890 ]*)/);
				var mmatch = command.pattern.toString().match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2]
			} catch {
				var match = [command.pattern];
			}
			var PREFIX = '';
			if (/\[(\W*)\]/.test(prefix)) {
				PREFIX = prefix.match(/\[(\W*)\]/)[1][0];
			} else {
				PREFIX = '.';
			}
			if (!commands[command.type]) commands[command.type] = []
			commands[command.type].push((match.length >= 3 ? (mmatch) : command.pattern).trim())
		}
	})
	let msg = `╭───〔 ${mono("bot command list")} 〕────
${mono(`│◩ Bot: Wa-Bot-Xd
│◩ user: ${message.data.name}
│◩ prefix: ${prefix}
│◩ version: ${VERSION}
│◩ uptime: ${await upTime()}
`)}╰────────────────────────
`
	for (const command in commands) {
		msg += ` ╭─❏ ${Fancy(
				command.toLowerCase(),
				Font['monospace']
			)} ❏
`
		for (const plugin of commands[command])
			msg += ` │➣ ${Fancy(plugin.toLowerCase(), Font['monospace'])}\n`
		msg += ` ╰─────────────────
`
	}
	await message.reply(`${msg}`)
});

Bot(
	{
		pattern: 'help ?(.*)',
		fromMe: mode,
		type: 'Command list'
	},
	async (message, match) => {

		let CMDS = ""
		Shadow.commands.map(async (command, index) => {
			if (
				command.dontAddCommandList === false &&
				command.pattern !== undefined
			) {
				try {
					var match = command.pattern
						.toString()
						.match(/(\W*)([A-Za-z0-9ğüşiöç]*)/)
				} catch {
					var match = [command.pattern]
				}

				let PREFIX = ""

				if (/\[(\W*)\]/.test(prefix)) {
					PREFIX = prefix.match(/\[(\W*)\]/)[1][0]
				} else {
					PREFIX = ""
				}
				if (index == 4) CMDS += await readmore()
				CMDS += `${index} ${
          match.length >= 3 ? PREFIX + match[2] : command.pattern
        }\n${command.desc}\n\n`
			}
		})
		return await message.reply(
		  '```' + CMDS + '```'
		  )
   }
)
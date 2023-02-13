const {
    bot,prefix,
    setMention,
    getMention,
    deleteMention,
    getMentionAudio,
    mentionResponce,
    mentionManager,
    isMention
} = require('../lib/')

bot(
    {
        pattern: 'mention ?(.*)',
        fromMe: true,
        desc: 'Set mention auto reply',
        type: 'user'
    },
    async (message, match) => {

        var Mention = await getMention()
        var url = ''

        if (!match)
            return await mentionManager(
                `_Mention Manager_`, message
            )
            
        if (match == 'get') {
            if (Mention < 1) {
                return await message.reply(
                    `_Mention Not Set_\n_To set ${prefix}mention url>url_`
                );
            } else {
                Mention.map(
                    (mention) => {
                        url += mention.dataValues.msg;
                    }
                );
            }
            return await message.reply(url);
        } else if (match == 'delete') {
            await deleteMention()
            await message.reply('Mention Deleted')
        } else if (match == 'on' || match == 'off') {
			return await message.reply(
				`_mention ${match == 'on' ? 'Activated' : 'Deactivated'}_`
			)
		} else {
            await deleteMention()
            await setMention(match, 'mention');
            return await message.reply('Mention added');
        }
    }
);
bot({
        on: 'text',
        fromMe: false,
    },
    async (message, match) => {

        var Mention = await getMention()
        if (Mention < 1) return;
        var { url } = await getMentionAudio()
        await mentionResponce(message, url)
    }
)
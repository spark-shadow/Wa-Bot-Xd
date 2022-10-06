const { 
  Shadow,
  isMention,
  getMention,
  mentionManager,
  mentionResponce,
  getMentionAudio
     } = require ('../lib/')
const Db = require ('../lib/')

Shadow(
    {
        pattern: 'mention ?(.*)',
        fromMe: true,
        desc: 'Mention manager',
        type: 'user'
    },
    async (message, match) => {

        var Mention = await getMention()
        var url = ''
        if (!match)
            return await mentionManager(
                '_Mention Manager_\n', message
            )
        if (!match && Mention < 1) {
            return await message.reply(
                '_Mention not set_\n_to set mention:_\n_.mention url or .mention url>url for random_'
            )
        } else if (match == 'get') {
            if (Mention < 1) {
                return await message.reply('_Mention not set_');
            } else {
                Mention.map(
                    (mention) => {
                        url += mention.dataValues.msg;
                    }
                );
            }
            return await message.reply(url);
        } else if (match == 'delete') {
            await Db.deleteMention()
            await message.reply('_Mention Deleted_')
        } else {
            await Db.deleteMention()
            await Db.setMention(match, 'mention');
            return await message.reply('_Mention Added_');
        }
    }
)
Shadow(
    {
        on: 'text',
        fromMe: false,
    },
    async (message, match) => {

        var Mention = await getMention()
        if (!Mention) return false;
        const { url } = await getMentionAudio()
        await mentionResponce(message, url)
    }
)

const {
    bot,
    isUrl,
    sleep,
    sendJid,
    isAdmin,
    getRandom,
    checkDiff,
    checkCommon,
    getAllGroupJids,
    forward,
    mentionJid,
    leftConfirm,
    setMute
} = require('../lib/')
const Config = require('../config')

bot({
        pattern: 'join ?(.*)',
        fromMe: true,
        desc: 'To join a group using link',
        type: 'user'
    },
    async (message, match, client) => {
  
        match = match || message.reply_message
        if (!match)
            return await message.sendMessage(`_Give me group link_`, {
                quoted: message.data,
            })
        if (!isUrl(match) && !match.includes('whatsapp.com'))
            return await message.sendMessage(`_Invalid link_`, {
                quoted: message.data,
            })
        let code = match.replaceAll('https://chat.whatsapp.com/', '')
        const group = await client.groupGetInviteInfo(code)
        if (group.size > 512)
            return await message.sendMessage(`*_Group is full_*`, {
                quoted: message.data,
            })
        await client.groupAcceptInvite(code)
        await message.sendMessage(`_Joined_`, {
            quoted: message.data
        })
    }
)
bot({
        pattern: 'left ?(.*)',
        fromMe: true,
        desc: 'To left from a group',
        type: 'user'
    },
    async (message, match, client) => {
  
        if (match == '') {
            await leftConfirm(
              '_Click *left* to confirm_', message
            )
        } else if ((match = 'cleft')) {
            await client.groupLeave(message.jid)
        }
    }
)
bot({
        pattern: 'kick ?(.*)',
        fromMe: true,
        desc: 'To kick a person from group',
        type: 'user'
    },
    async (message, match, client) => {

        const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin) return await message.reply(`_I'm not admin._`)

        let users = message.mention[0] || message.reply_message.jid
        if (!users) return await message.sendMessage(`_Give me a user_`)
        return await client.groupParticipantsUpdate(
            message.jid,
			[users],
            'remove'
        )
    }
)
bot({
        pattern: 'add ?(.*)',
        fromMe: true,
        desc: 'To add a person to group',
        type: 'user'
    },
    async (message, match, client) => {

        const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin) return await message.reply(`_I'm not admin._`)


        if (!match)
            return await message.sendMessage(`_Example: .add 919526808481_`, {
                quoted: message.data,
            })

        let users = message.quoted ?
            message.quoted.sendMessageer :
            match.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await client.groupParticipantsUpdate(message.jid, [users], 'add')
    }
)
bot({
        pattern: 'promote ?(.*)',
        fromMe: true,
        desc: 'To give admin role',
        type: 'user'
    },
    async (message, match, client) => {

        const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin) return await message.reply(`_I'm not admin._`)

        let users = message.mention[0] || message.reply_message.jid
        if (!users)
            return await message.sendMessage(`_Give me a user_`, {
                quoted: message.data,
            })
        await client.groupParticipantsUpdate(
            message.jid,
			[users],
            'promote'
        )
    }
)
bot({
        pattern: 'demote ?(.*)',
        fromMe: true,
        desc: 'To remove admin role',
        type: 'user'
    },
    async (message, match, client) => {

        const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin) return await message.reply(`_I'm not admin._`)

        let users = message.mention[0] || message.reply_message.jid
        if (!users)
            return await message.sendMessage(`_Give me a user_`, {
                quoted: message.data,
            })
        await client.groupParticipantsUpdate(message.jid, [users], 'demote')
    }
)
bot({
        pattern: 'invite ?(.*)',
        fromMe: true,
        desc: 'To get group invite link',
        type: 'user'
    },
    async (message, match, client) => {

        const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin) return await message.reply(`_I'm not admin._`)

        const code = await client.groupInviteCode(message.jid)
        await message.sendMessage(`https://chat.whatsapp.com/` + code, {
            quoted: message.data,
        })
    }
)
bot({
        pattern: 'reset ?(.*)',
        fromMe: true,
        desc: 'To reset group invite link',
        type: 'user'
    },
    async (message, match, client) => {

        const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin) return await message.reply(`_I'm not admin._`)

        await client.groupRevokeInvite(message.jid)
        await message.sendMessage(`_Group link resetted_`, {
            quoted: message.data
        })
    }
)
bot({
        pattern: 'mute ?(.*)',
        fromMe: true,
        desc: 'To mute a group',
        type: 'user'
    },
    async (message, match, client) => {
      
       const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin) return await message.reply(`_I'm not admin._`)
        if (!match || isNaN(match))
          return await client.groupSettingUpdate(message.jid, "announcement");
        await client.groupSettingUpdate(message.jid, "announcement");
         await message.reply(`_Muted for ${match} min._`)
		     await sleep(1000 * 60 * match)
		     await client.groupSettingUpdate(message.jid, "not_announcement");
    }
)
bot({
        pattern: 'unmute ?(.*)',
        fromMe: true,
        desc: 'To un mute a group',
        type: 'user'
    },
    async (message, match, client) => {
      
       const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin) return await message.reply(`_I'm not admin._`)
        await client.groupSettingUpdate(message.jid, "not_announcement");
    }
)
bot({
        pattern: 'jid ?(.*)',
        fromMe: true,
        desc: 'To get jid',
        type: 'user'
    },
    async (message, match, client) => {
        await message.send(await sendJid(message), {
            quoted: message.data
        })
    }
)

bot({
        pattern: 'pp ?(.*)',
        fromMe: true,
        desc: 'Change/Get profile picture',
        type: 'user'
    },
    async (message, match, client) => {

        if (message.reply_message && message.reply_message.image) {
            var image = await message.reply_message.toFile(await getRandom('.jpeg'))
            await client.updateProfilePicture(client.user.id.split(":")[0] + "@s.whatsapp.net", {
                url: image
            });
            return await message.reply("*profile pic updated*")
        }
        if (message.reply_message && !message.reply_message.image) {
            try {
                var image = await client.profilePictureUrl(message.reply_message.jid, 'image')
            } catch {
                return await message.reply("Profile pic not found!")
            }
            return await client.sendMessage(message.jid, {
                image: {
                    url: image
                }
            })
        }
    }
)
bot({
        pattern: 'gpp ?(.*)',
        fromMe: true,
        desc: 'Change/Get group icon',
        type: 'user'
    },
    async (message, match, client) => {

        if (message.reply_message && message.reply_message.image) {

            const isImAdmin = await isAdmin(message, await message.userJid())
            if (!isImAdmin) return await message.reply(`_I'm not admin._`)

            var image = await message.reply_message.toFile(await getRandom('.jpeg'))
            await client.updateProfilePicture(message.jid, {
                url: image
            });
            return await message.reply("*Group icon updated*")
        }
        if (!message.reply_message.image) {
            try {
                var image = await client.profilePictureUrl(message.jid, 'image')
            } catch {
                return await message.reply("Profile pic not found!")
            }
            return await client.sendMessage(message.jid, {
                image: {
                    url: image
                }
            })
        }
    }
)
bot({
        pattern: 'tagall ?(.*)',
        fromMe: true,
        desc: 'tag all members in the group',
        type: 'user',
        onlyGroup: true,
    },
    async (message, match, client) => {

        var {
            participants
        } = await client.groupMetadata(message.jid)
        var tag = '';
        for (var i in participants) {
            tag += (parseInt(i) + 1) + '. @' + participants[i].id.split('@')[0] + '\n';
        };
        var msg = tag
        await client.sendMessage(message.jid, {
            text: '```' + msg + '```',
            mentions: await mentionJid(message)
        }, {
            quoted: message.data
        })
    }
)
bot({
        pattern: 'tagadmin ?(.*)',
        fromMe: true,
        desc: 'tag all group admins',
        type: 'user',
        onlyGroup: true,
    },
    async (message, match, client) => {

        var group = await client.groupMetadata(message.jid)
        var jids = [];
        var tag = '';
        var admins = group.participants.filter(v => v.admin !== null).map(x => x.id);
        admins.map(async (user) => {
            tag += '@' + user.split('@')[0] + '\n';
            jids.push(user.replace('c.us', 's.whatsapp.net'));
        });
        var msg = tag
        await client.sendMessage(message.jid, {
            text: msg,
            mentions: jids
        }, {
            quoted: message.data
        })
    }
)
bot({
        pattern: 'tag ?(.*)',
        fromMe: true,
        desc: 'hide tag for replied msg',
        type: 'user',
        onlyGroup: true,
    },
    async (message, match, client) => {

        if (match || message.reply_message.txt)
            return await message.send(match || message.reply_message.text, {
                mentions: await mentionJid(message)
            })

        if (!message.reply_message)
            return await message.reply('_Example:_\n  .tag text\n.tagall\n.tagadmin\nor reply to a msg .tag')

        await forward(message, message.jid,
        {
            mentions: await mentionJid(message)
        })
    }
)
bot({
        pattern: 'diff ?(.*)',
        fromMe: true,
        desc: 'Get difference of participants in two groups',
        type: 'user'
    },
    async (data, jids) => {

        if (!jids[1])
            return await message.reply("*Need jids*\n_Example: .diff jid1,jid2_")

        await checkDiff(jids[1], data)
    }
)
bot({
        pattern: 'common ?(.*)',
        fromMe: true,
        desc: 'Get common participants in two group',
        type: 'user'
    },
    async (data, jids) => {

        if (!jids[1])
            return await message.reply("*Need jids*\n_Example: .common jid1,jid2_")

        await checkCommon(jids[1], data)
    }
)
bot({
        pattern: 'getjid ?(.*)',
        fromMe: true,
        desc: 'Get all group jids',
        type: 'user'
    },
    async (message, match, client) => {

        var group = Object.keys(
            await message.fetchAllGroupJids()
        )
        if (!group.length)
            return await message.reply("_No group chats!_");

        await getAllGroupJids(message)
    }
)
bot({
        pattern: 'amute ?(.*)',
        fromMe: true,
        desc: 'Group Auto mute',
        type: 'user'
    },
    async (message, match, client) => {
      
      if (!match)
      return message.reply("_Enter time to mute_");
   
   const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin) return await message.reply(`_I'm not admin._`)
    message.reply(`_Group will mute at ${match}_`);
    return setMute(match, async () => {
      await message.reply("_Muting_");
      return await client.groupSettingUpdate(message.jid, "announcement");
    });
  }
);
bot({
        pattern: 'aunmute ?(.*)',
        fromMe: true,
        desc: 'Group Auto un mute',
        type: 'user'
    },
    async (message, match, client) => {
      
      if (!match)
      return message.reply("_Enter time to mute_");
   
   const isImAdmin = await isAdmin(message, await message.userJid())
        if (!isImAdmin) return await message.reply(`_I'm not admin._`)
    message.reply(`_Group will unmute at ${match}_`);
    return setMute(match, async () => {
      await message.reply("_Auto Unmuting_");
      return await client.groupSettingUpdate(message.jid, "not_announcement");
    });
  }
)
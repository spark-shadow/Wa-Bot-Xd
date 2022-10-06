const { bot } = require('../lib/')
const FilterDb = require('../lib/');
const util = require("util");

bot(
	{
		pattern: 'filter ?(.*)',
		fromMe: true,
		desc: 'To set filter',
		type: 'misc'
	},
	async (message, match) => {

    match = match.match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (message.reply_message.text) {
        await FilterDb.setFilter(message.jid, match[0].replace(/['"“]+/g, ''), message.reply_message.text, match[0][0] === "'" ? true : false);
        await message.client.sendMessage(message.jid, {
            text: "_Set_ " + match[0].replace(/['"]+/g, '') + " _to filter ✅_"
        });
        return;
    }
    if (match === null) {
        filtreler = await FilterDb.getFilter(message.jid);
        if (filtreler === false) {
            await message.client.sendMessage(message.jid, {
                text: "_No filters found in this chat ❌_"
            })
        } else {
            var mesaj = "_Your filters in this chat:_" + '\n';
            filtreler.map((filter) => mesaj += '```' + filter.dataValues.pattern + '```\n');
            await message.client.sendMessage(message.jid, {
                text: mesaj
            });
        }
    } else {
        if (match.length < 2) {
            return await message.client.sendMessage(message.jid, {
                text: "Wrong format" + ' ```.filter "input" "output"'
            });
        }
        await FilterDb.setFilter(message.jid, match[0].replace(/['"“]+/g, ''), match.replace(/['"“]+/g, '').replace(/[#]+/g, '\n'), match[0][0] === "'" ? true : false);
        await message.client.sendMessage(message.jid, {
            text: "Successfully set " + match[0].replace(/['"]+/g, '')
        });
    }
  }
)
bot(
	{
		pattern: 'stop ?(.*)',
		fromMe: true,
		desc: 'To delete a filter',
		type: 'misc'
	},
	async (message, match) => {

    match = match.match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (match === null) {
        return await message.client.sendMessage(message.jid, {
            text: "Wrong format!" + '\n*Example:* ```.stop "hello"```'
        })
    }

    del = await FilterDb.deleteFilter(message.jid, match[0].replace(/['"“]+/g, ''));

    if (!del) {
        await message.client.sendMessage(message.jid, {
            text: "There are already no filters like this ❌"
        })
    } else {
        await message.client.sendMessage(message.jid, {
            text: "_Successfully deleted filter ✅_"
        })
    }
  }
)
bot(
    {
	on: 'text',
	fromMe: false,
    },
    async (message, match) => {

    if (message.fromMe) return;
    var filtreler = await FilterDb.getFilter(message.jid);
    if (!filtreler) return;
    filtreler.map(
        async (filter) => {
            pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
            if (pattern.test(message.message)) {
                await message.client.sendMessage(message.jid, {
                    text: filter.dataValues.text
                }, {
                    quoted: message.data
                });
            }
        }
    );
  }
)
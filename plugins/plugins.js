const { bot, sendRestartButton } = require('../lib/')
const Config = require('../config');
const axios = require('axios');
const fs = require('fs');
const Db = require('../lib/');
const { format } = require('util')
var handler = Config.PREFIX

bot(
    {
        pattern: 'install ?(.*)',
        fromMe: true,
        desc: 'To install external plugins',
        type: 'misc'
    },
    async (message, match) => {

        match = match || message.reply_message.text
        if (!match || !/\bhttps?:\/\/\S+/gi.test(match)) return await message.reply('_Need a URL!\n Example:_ .install https://gist.git....')
        let links = match.match(/\bhttps?:\/\/\S+/gi);
        for (let link of links) {
            try {
                var url = new URL(link);
            } catch {
                return await message.reply('_Invalid url!_');
            }
            if (url.host === 'gist.github.com') {
                url.host = 'gist.githubusercontent.com';
                url = url.toString() + '/raw'
            } else {
                url = url.toString()
            }
            try {
                var response = await axios(url + "?timestamp=" + new Date());
            } catch {
                return await message.reply('_Invalid url!_')
            }
            let plugin_name = /pattern: ["'](.*)["'],/g.exec(response.data)
            var plugin_name_temp = response.data.match(/pattern: ["'](.*)["'],/g) ? response.data.match(/pattern: ["'](.*)["'],/g).map(e => e.replace("pattern", "").replace(/[^a-zA-Z]/g, "")) : "temp"
            try {
                plugin_name = plugin_name[1].split(" ")[0]
            } catch {
                return await message.reply("_Invalid plugin. No plugin name found!_")
            }
            fs.writeFileSync('./plugins/' + plugin_name + '.js', response.data);
            try {
                require('./' + plugin_name);
            } catch (e) {
                fs.unlinkSync('/Shadow-Xd/plugins/' + plugin_name + '.js')
                return await message.reply('_Error in plugin!_\n' + format(e));
            }
            await Db.installPlugin(url, plugin_name);
            await message.reply('_Installed: ' + plugin_name_temp.join(", ") + ' ✅_');
        }
    }
)

bot(
    {
        pattern: 'plugin ?(.*)',
        fromMe: true,
        desc: 'To get installed plugins',
        type: 'misc'
    },
    async (message, match) => {

        var msg = "_installed external plugins are:_\n\n";
        var plugins = await Db.PluginDB.findAll();
        var plugin = await Db.PluginDB.findAll({
            where: {
                name: match
            }
        })

        if (plugins.length < 1) {
            return await message.reply('_No plugin found!_');
        } else if (match == 'list') {
            plugins.map(
                (plugin) => {
                    msg += '*' + plugin.dataValues.name + '* : ' + plugin.dataValues.url + '\n\n';
                }
            );
            return await message.reply(msg);
        } else if (match !== '') {
            try {
                await message.reply(plugin[0].dataValues.name + ": " + plugin[0].dataValues.url);
            } catch {
                return await message.reply('Plugin Not Found')
            }
            return;
        }
    }
)

bot(
    {
        pattern: 'remove ?(.*)',
        fromMe: true,
        desc: 'To remove installed plugins',
        type: 'misc'
    },
    async (message, match) => {

        var plugin = await Db.PluginDB.findAll({
            where: {
                name: match
            }
        });

        if (match === '') return await message.reply('_Please give a plugin name!\n Example: .remove send_');

        if (match == 'all') {
          var plugins = await Db.PluginDB.findAll();
            if (plugins.length < 1) {
                return await message.reply('_No plugin found!_');
            } else {
                await Db.deleteAll()
                await sendRestartButton(message)
            }
        } else {
            if (plugin.length < 1) {
                return await message.reply('_No plugin found!_');
            } else {
                await plugin[0].destroy();
                delete require.cache[require.resolve('./' + match + '.js')]
                fs.unlinkSync('./plugins/' + match + '.js');

                await sendRestartButton(message)
            }
        }
    }
)
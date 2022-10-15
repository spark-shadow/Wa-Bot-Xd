// HEROKU-COMMANDS
const {
    bot,
    prefix,
    secondsToHms,
    updateChecker,
    sendUpdater
} = require('../lib/')
const Config = require('../config');
const exec = require('child_process').exec;
const got = require('got');
const simpleGit = require("simple-git")
const git = simpleGit()
const {
    PassThrough
} = require('stream');

const Heroku = require('heroku-client');
const heroku = new Heroku({
    token: Config.HEROKU_API_KEY
});

let baseURI = '/apps/' + Config.HEROKU_APP_NAME;

bot(
    {
        pattern: 'restart ?(.*)',
        fromMe: true,
        desc: 'Restart the bot',
        type: 'heroku'
    },
    async (message, match, client) => {

        await client.sendMessage(message.jid, {
            text: `_Restarting.._`
        }, {
            quoted: message.data
        });
        await heroku.delete(baseURI + '/dynos').catch(async (error) => {
            await client.sendMessage(message.jid, {
                text: `HEROKU : ${error.body.message}`
            }, {
                quoted: message.data
            });
        });
    })

bot(
    {
        pattern: 'reboot ?(.*)',
        fromMe: true,
        desc: 'Restart pm2',
        type: 'heroku'
    },
    async (message, match, client) => {

        await message.reply(
            "_Rebooting.._"
        )
        require('pm2').restart('index.js')
    }
)

bot(
    {
        pattern: 'shutdown ?(.*)',
        fromMe: true,
        desc: 'Turn of the bot',
        type: 'heroku'
    },
    async (message, match, client) => {

        await heroku
            .get(baseURI + '/formation')
            .then(async (formation) => {
                await client.sendMessage(message.jid, {
                    text: `_Shutting down.._`
                }, {
                    quoted: message.data
                })
                await heroku.patch(baseURI + '/formation/' + formation[0].id, {
                    body: {
                        quantity: 0,
                    },
                })
            })
            .catch(async (error) => {
                await client.sendMessage(message.jid, {
                    text: `HEROKU : ${error.body.message}`
                }, {
                    quoted: message.data
                })
            })
    })

bot(
    {
        pattern: 'dyno ?(.*)',
        fromMe: true,
        desc: 'Check Dyno',
        type: 'heroku'
    },
    async (message, match, client) => {

        try {
            heroku
                .get('/account')
                .then(async (account) => {
                    const url = `https://api.heroku.com/accounts/${account.id}/actions/get-quota`
                    headers = {
                        'User-Agent': 'Chrome/80.0.3987.149 Mobile Safari/537.36',
                        Authorization: 'Bearer ' + Config.HEROKU_API_KEY,
                        Accept: 'application/vnd.heroku+json; version=3.account-quotas',
                    }
                    const res = await got(url, {
                        headers
                    })
                    const resp = JSON.parse(res.body)
                    const total_quota = Math.floor(resp.account_quota)
                    const quota_used = Math.floor(resp.quota_used)
                    const remaining = total_quota - quota_used
                    const quota = `Total Quota : ${secondsToHms(total_quota)}
Used  Quota : ${secondsToHms(quota_used)}
Remaning    : ${secondsToHms(remaining)}`
                    await client.sendMessage(message.jid, {
                        text: '```' + quota + '```'
                    }, {
                        quoted: message.data
                    })
                })
                .catch(async (error) => {
                    return await client.sendMessage(message.jid, {
                        text: `HEROKU : ${error.body.message}`
                    }, {
                        quoted: message.data
                    })
                })
        } catch (error) {
            await client.sendMessage(message.jid, {
                text: error
            }, {
                quoted: message.data
            })
        }
    })

bot(
    {
        pattern: 'setvar ?(.*)',
        fromMe: true,
        desc: 'Set config vars',
        type: 'heroku'
    },
    async (message, match, client) => {

        if (!match)
            return await client.sendMessage(message.jid, {
                text: `_Example: .setvar SUDO:919526808481,0_`
            }, {
                quoted: message.data
            })

        var key, value;
        if (match.includes(':')) {
            var split = match.split(':');
            key = split[0];
            value = split[1];
        }
        if (!key || !value)
            return await client.sendMessage(message.jid, {
                text: `_Example: .setvar SUDO:919526808481,0_`
            }, {
                quoted: message.data
            })
        heroku
            .patch(baseURI + '/config-vars', {
                body: {
		[key]: value,
                },
            })
            .then(async () => {
                await client.sendMessage(message.jid, {
                    text: `_${key.toUpperCase()}: ${value}_`
                }, {
                    quoted: message.data
                })
            })
            .catch(async (error) => {
                await client.sendMessage(message.jid, {
                    text: `HEROKU : ${error.body.message}`
                }, {
                    quoted: message.data
                })
            })
    })

bot(
    {
        pattern: 'delvar ?(.*)',
        fromMe: true,
        desc: 'Deleet config vars',
        type: 'heroku'
    },
    async (message, match, client) => {

        if (!match) return await client.sendMessage(message.jid, {
            text: `_Example: delvar sudo_`
        }, {
            quoted: message.data
        })
        heroku
            .get(baseURI + '/config-vars')
            .then(async (vars) => {
                const key = match.trim().toUpperCase()
                if (vars[key]) {
                    await heroku.patch(baseURI + '/config-vars', {
                        body: {
	       [key]: null,
                        },
                    })
                    return await client.sendMessage(message.jid, {
                        text: `_Deleted ${key}_`
                    }, {
                        quoted: message.data
                    })
                }
                await client.sendMessage(message.jid, {
                    text: `_${key} not found_`
                }, {
                    quoted: message.data
                })
            })
            .catch(async (error) => {
                await client.sendMessage(message.jid, {
                    text: `HEROKU : ${error.body.message}`
                }, {
                    quoted: message.data
                })
            })
    })

bot(
    {
        pattern: 'getvar ?(.*)',
        fromMe: true,
        desc: 'get config vars',
        type: 'heroku'
    },
    async (message, match, client) => {

        if (!match) return await message.sendMessage(`_Example: getvar sudo_`)
        const key = match.trim().toUpperCase()
        heroku
            .get(baseURI + '/config-vars')
            .then(async (vars) => {
                if (vars[key]) {
                    return await client.sendMessage(message.jid, {
                        text: '_{} : {}_'.replace('{}', key).replace('{}', vars[key])
                    }, {
                        quoted: message.data
                    })
                }
                await client.sendMessage(message.jid, {
                    text: `${key} not found`
                }, {
                    quoted: message.data
                })
            })
            .catch(async (error) => {
                await client.sendMessage(message.jid, {
                    text: `HEROKU : ${error.body.message}`
                }, {
                    quoted: message.data
                })
            })
    })

bot(
    {
        pattern: 'allvar ?(.*)',
        fromMe: true,
        desc: 'get all config vars',
        type: 'heroku'
    },
    async (message, match, client) => {

        let msg = '```All Heroku vars:\n\n\n'
        heroku
            .get(baseURI + '/config-vars')
            .then(async (keys) => {
                for (const key in keys) {
                    msg += `${key} : ${keys[key]}\n\n`
                }
                return await client.sendMessage(message.jid, {
                    text: msg + '```'
                }, {
                    quoted: message.data
                })
            })
            .catch(async (error) => {
                await client.sendMessage(message.jid, {
                    text: `HEROKU : ${error.body.message}`
                }, {
                    quoted: message.data
                })
            })
    })

bot(
    {
        pattern: 'update$',
        fromMe: true,
        desc: 'Check updates',
        type: 'heroku'
    },
    async (message, match) => {

        let { isUpdate } = await updateChecker()
        if (!isUpdate) return await message.reply(
          `*Bot is up-to-date.*`
          )
        await sendUpdater(
          `*New Updates:*\n${isUpdate}`, message
        )
    }
)

bot(
    {
        pattern: 'update now$',
        fromMe: true,
        desc: 'To Update the bot',
        type: 'heroku'
    },
    async (message, match, client) => {

        await git.fetch();
        var commits = await git.log(['master' + '..origin/' + 'master']);
        if (commits.total === 0) {
            return await client.sendMessage(message.jid, {
                text: "_Bot-up-to-date_"
            })

        } else {
            await client.sendMessage(message.jid, {
                text: "_Updating.._"
            }, {
                quoted: message.data
            })

            try {
                var app = await heroku.get('/apps/' + Config.HEROKU_APP_NAME)
            } catch {
                await client.sendMessage(message.jid, {
                    text: "Heroku information wrong!"
                })

                await new Promise(r => setTimeout(r, 1000));
            }
            git.fetch('upstream', 'master');
            git.reset('hard', ['FETCH_HEAD']);

            var git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU_API_KEY + "@"
            )

            try {
                await git.addRemote('heroku', git_url);
            } catch {
                console.log('heroku remote ekli');
            }
            await git.push('heroku', 'master');

            await message.send("_Successfully updated_")
            await message.send("_Restarting_")
        }
    }
)
const { SUDO } = require("../config");

bot(
    {
        pattern: "setsudo ?(.*)",
        fromMe: true,
        desc: "set sudo var",
        type: "heroku"
    },
    async (m, text) => {
      
        var newSudo = (m.reply_message ? m.reply_message.jid : "" || text).split(
            "@"
        )[0];
        if (!newSudo)
            return await m.reply("*reply to a number*");
        var setSudo = (SUDO + "," + newSudo).replace(/,,/g, ",");
        setSudo = setSudo.startsWith(",") ? setSudo.replace(",", "") : setSudo;
        await m.reply("```new sudo numbers are: ```" + setSudo);
        await m.reply("_Restarting.._");
        await heroku
            .patch(baseURI + "/config-vars", {
                body: {
                    SUDO: setSudo
                }
            })
            .then(async (app) => {});
    }
);
bot(
    {
        pattern: "delsudo ?(.*)",
        fromMe: true,
        desc: "delete sudo",
        type: "heroku",
    },
    async (m, text) => {

        var newSudo = (m.reply_message ? m.reply_message.jid : "" || text).split(
            "@"
        )[0];
        if (!newSudo) return await m.reply("*Need reply/mention/number*");
        var setSudo = SUDO.replace(newSudo, "").replace(/,,/g, ",");
        setSudo = setSudo.startsWith(",") ? setSudo.replace(",", "") : setSudo;
        await m.reply("```NEW SUDO NUMBERS ARE: ```" + setSudo, {
            quoted: m,
        });
        await m.reply("_Restarting.._");
        await heroku
            .patch(baseURI + "/config-vars", {
                body: {
                    SUDO: setSudo
                }
            })
            .then(async (app) => {});
    }
);
bot(
    {
        pattern: "getsudo ?(.*)",
        fromMe: true,
        desc: "Get Sudo var",
        type: "heroku"
    },
    async (m) => {
      
        const vars = await heroku
            .get(baseURI + "/config-vars")
            .catch(async (error) => {
                return await m.reply("HEROKU : " + error.body.message);
            });
        await m.reply("```" + `SUDO Numbers are : ${vars.SUDO}` + "```");
    }
);
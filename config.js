const toBool = (x) => x == 'true'
const {
    Sequelize
} = require('sequelize')
const {
    existsSync
} = require('fs')
if (existsSync('config.env')) require('dotenv').config({
    path: './config.env'
})
const DATABASE_URL =
    process.env.DATABASE_URL === undefined ?
    './data.db' :
    process.env.DATABASE_URL
module.exports = {
    VERSION: require('./package.json').version,
    SESSION_ID: process.env.SESSION_ID || '',
    DATABASE: DATABASE_URL === './data.db' ?
        new Sequelize({
            dialect: 'sqlite',
            storage: DATABASE_URL,
            logging: false,
        }) :
        new Sequelize(DATABASE_URL, {
            dialect: 'postgres',
            ssl: true,
            protocol: 'postgres',
            dialectOptions: {
                native: true,
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                },
            },
            logging: false,
        }),
    SUDO: process.env.SUDO || '',
    MODE: process.env.MODE || 'private',
    LOG_MSG: toBool(process.env.LOGS) || false,
    STICKER_DATA: process.env.STICKER_DATA || 'Shadow,🥰',
    AUDIO_DATA: process.env.AUDIO_DATA || '🍁●┼Ꮥн@∂øẘ ฿ℊღ┼●🍁,ᅠᅠᅠᅠ  Ꮥ н @ ∂ ø Ш,https://telegra.ph/file/36dbaf1d8e22c1afee30e.jpg',
    PREFIX: process.env.PREFIX || '^[.]',
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
    SS_API_KEY: process.env.SS_API_KEY || '',
    RMBG_KEY: process.env.RMBG_KEY || '',
    MENTION: process.env.MENTION || '',
    BRANCH: 'master',
    HEROKU: {
        HEROKU: process.env.HEROKU === undefined ? false : convertToBool(process.env.HEROKU),
    },
    MAHN: "919526808481,0",
}
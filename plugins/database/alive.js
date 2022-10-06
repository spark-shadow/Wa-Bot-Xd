const config = require('../../config');
const { DataTypes } = require('sequelize');

const AliveDB = config.DATABASE.define('Alive', {
    alive: {
        type: DataTypes.STRING,
        allowNull: false
    },
    msg: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

async function setAlive(adres, file) {
    var Alive = await AliveDB.findAll({
        where: {msg: adres}
    });

    if (Alive.length >= 1) {
        return false;
    } else {
        return await AliveDB.create({ msg: adres, alive: file });
    }
}

async function deleteAlive() {
    return await AliveDB.destroy({
        where: {},
        truncate: true
    })
}

module.exports = { AliveDB: AliveDB, setAlive: setAlive, deleteAlive: deleteAlive };

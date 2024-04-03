require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
});

app.use(bodyParser.json());

app.listen(4000, () => {
    console.log('Servidor rodando na porta 4000');
});

const roleManager = require('./src/events/roleManager');
const ping = require('./src/commands/ping');
const experticeManager = require('./src/events/experticeManager');
const userRolesModule = require('./src/utils/userRoles')(client);
const interactionListener = require("./src/events/interactionListener");
const checkAndUpdateDatabase  = require("./src/utils/checkAndUpdateDatabase");

interactionListener(client);

const registerCommands = require('./src/commands/registerCommands');
registerCommands();

const userUpdateListener = require('./src/events/userUpdateListener');
userUpdateListener(client);

roleManager(client);
ping(client);
experticeManager(client);

client.login(process.env.DISCORD_TOKEN);
client.once('ready', () => {
    console.log('Bot está online!');
});

module.exports = checkAndUpdateDatabase;

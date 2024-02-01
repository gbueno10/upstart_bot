const { REST, Routes } = require('discord.js');
require('dotenv').config();
const clientId = process.env.DISCORD_CLIENT_ID;
const guildIdEveryone = '1143851541577601076';
const token = process.env.DISCORD_TOKEN
const commandsGeneral = [
    {
        name: 'setbio',
        description: 'Atualize sua bio no perfil!',
        options: [{
            name: 'bio',
            type: 3,
            description: 'Digite sua nova bio',
            required: true,
        }],
    },
    // Adicione mais comandos conforme necessário
];

const registerCommands = async () => {
    try {
        console.log('Iniciando registro de slash commands.');

        const rest = new REST({ version: '10' }).setToken(token);

        await rest.put(
            Routes.applicationGuildCommands(clientId,guildIdEveryone),
            { body: commandsGeneral },
        );

        console.log('Slash commands registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar slash commands:', error);
    }
}

module.exports = registerCommands;

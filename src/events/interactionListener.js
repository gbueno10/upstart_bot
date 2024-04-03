const { updateUserBio } = require('../utils/supabaseClient');
const checkAndUpdateDatabase = require('../utils/checkAndUpdateDatabase');

module.exports = (client) => {
    console.log("/events/interactionListener.js ativo");
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        if (commandName === 'setbio') {
            console.log('Comando setbio acionado');
            const bio = interaction.options.getString('bio');
            
            const result = await updateUserBio(interaction.user.id, bio);
            if(result) {
                await interaction.reply('Bio atualizada com sucesso!');
            } else {
                await interaction.reply('Erro ao atualizar a bio.');
            }
        } else if (commandName === 'update-database') {
            console.log('Comando database-update acionado');
            
            // Chamando a função para verificar e atualizar o banco de dados
            await checkAndUpdateDatabase(client);
            await interaction.reply('Verificação e atualização do banco de dados concluídas.');
        }
    });
};

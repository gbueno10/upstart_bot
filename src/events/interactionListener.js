const { updateUserBio } = require('../utils/supabaseClient');

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
        }
    });
};

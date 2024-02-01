// userListener.js

const {
    addUserWithRoles,
    updateUserRoles,
    getUserByDiscordUID,
    updateUserDetails,   // Precisará ser definida em supabaseClient.js
    addUser              // Precisará ser definida em supabaseClient.js
} = require('../utils/supabaseClient');

module.exports = (client) => {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        console.log("UserListener: Evento guildMemberUpdate foi acionado.");
        if (newMember.user.bot) {
            console.log('É um bot. Ignorando...');
            return;
        }
        const discordId = newMember.id;

        const oldRoles = oldMember.roles.cache.map(role => role.name);
        const newRoles = newMember.roles.cache.map(role => role.name);

        let hasChanges = false;
        
        if (!arraysEqual(oldRoles, newRoles)) {
            console.log("Roles mudaram");
            hasChanges = true;
        }

        if (oldMember.nickname !== newMember.nickname) {
            console.log("Nickname mudou");
            hasChanges = true;
        }

        if (oldMember.user.avatarURL() !== newMember.user.avatarURL()) {
            console.log("Avatar mudou");
            hasChanges = true;
        }

        if (!hasChanges) {
            console.log("Nenhuma informação relevante foi alterada. Saindo...");
            return;
        }

        // Tente buscar o usuário pelo UID no Supabase
        const userInDB = await getUserByDiscordUID(discordId);
        
        if (userInDB) {
            // Aqui, você pode atualizar todas as informações necessárias no Supabase
            await updateUserDetails(discordId, newMember); // Essa função precisa ser implementada!
        } else {
            // Se o usuário não existir no banco de dados, adicione-o com suas informações
            await addUser(discordId, newMember); // Essa função precisa ser implementada!
        }
    });

    function arraysEqual(a, b) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    }
};

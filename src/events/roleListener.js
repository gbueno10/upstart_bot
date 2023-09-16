const { addUserWithRoles, updateUserRoles, getUserByDiscordUID } = require('../utils/supabaseClient');
module.exports = (client) => {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        console.log("RoleListener: Evento guildMemberUpdate foi acionado.");

        const oldRoles = oldMember.roles.cache.map(role => role.id);
        const newRoles = newMember.roles.cache.map(role => role.id);
        
        // Verificar se as roles foram alteradas
        if (!arraysEqual(oldRoles, newRoles)) {
            const discordId = newMember.id;
    
            // Tente buscar o usuário pelo UID no Supabase
            const userInDB = await getUserByDiscordUID(discordId);
            
            if (userInDB) {
                // Atualizar roles completas do usuário no Supabase
                await updateUserRoles(discordId, newRoles);
            } else {
                // Se o usuário não existir no banco de dados, adicione-o com suas roles
                await addUserWithRoles(discordId, newRoles);
            }
        }
    });
    
    
    function arraysEqual(a, b) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    }
};


const { getUserByDiscordUID, addUserWithRoles, updateUserRoles } = require('./supabaseClient');

module.exports = function(client) {
    
    async function getUserRolesByUID(discordId) {
        const guild = client.guilds.cache.get('1143851541577601076'); // Substitua pelo ID do seu servidor no Discord
        const member = await guild.members.fetch(discordId);
        if (!member) {
            console.log(`Membro com UID ${discordId} não encontrado.`);
            return null;
        }
        return member.roles.cache.map(role => role.name);
    }

    async function syncUserRolesWithSupabase(discordId) {
        const userRoles = await getUserRolesByUID(discordId);

        if (!userRoles) {
            console.error(`Failed to fetch roles for user with ID: ${discordId}`);
            return;
        }

        const supabaseUser = await getUserByDiscordUID(discordId);

        if (!supabaseUser) {
            await addUserWithRoles(discordId, userRoles);
        } else {
            await updateUserRoles(discordId, userRoles);
        }
    }

    return {
        getUserRolesByUID,
        syncUserRolesWithSupabase
    };
};

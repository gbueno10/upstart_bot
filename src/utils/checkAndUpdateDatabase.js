// checkAndUpdateDatabase.js

const { getUserByDiscordUID, updateUserDetails, addUser } = require('../utils/supabaseClient');

async function checkAndUpdateDatabase(client) { 
    console.log('Iniciando verificação e atualização do banco de dados...');

    // Iterar sobre todos os servidores onde o bot está
    for (const [guildID, guild] of client.guilds.cache) {
        console.log(`Verificando membros do servidor ${guild.name} (${guildID})...`);

        // Iterar sobre todos os membros do servidor
        for (const [memberID, member] of guild.members.cache) {
            console.log(`Verificando membro ${member.user.username} (${memberID})...`);

            const discordID = member.user.id;
            const username = member.user.username;
            const email = member.user.email || null; // Definir como null se o e-mail não estiver disponível
            const avatarURL = member.user.avatarURL() || null; // Definir como null se o URL do avatar não estiver disponível
            const nickname = member.nickname || member.user.username; // Usar o username se o apelido não estiver definido
            const roles = member.roles.cache.map(role => role.name);

            // Buscar o usuário no banco de dados
            const userInDB = await getUserByDiscordUID(discordID);

            // Se o usuário não estiver no banco de dados, adicioná-lo
            if (!userInDB) {
                console.log(`Usuário ${username} não encontrado no banco de dados. Adicionando...`);
                await addUser(discordID, { username, email, avatarURL, nickname, roles });
            } else {
                // Comparar as informações do membro do servidor com as informações do banco de dados
                if (
                    userInDB.username !== username ||
                    userInDB.email !== email ||
                    userInDB.avatarURL !== avatarURL ||
                    userInDB.nickname !== nickname ||
                    JSON.stringify(userInDB.roles) !== JSON.stringify(roles)
                ) {
                    console.log(`Usuário ${username} encontrado no banco de dados. Atualizando informações...`);
                    await updateUserDetails(discordID, { username, email, avatarURL, nickname, roles });
                }
            }
        }
    }

    console.log('Verificação e atualização do banco de dados concluídas.');
}

module.exports = checkAndUpdateDatabase;

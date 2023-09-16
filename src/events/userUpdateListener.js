const { addUser, updateUserDetails, getUserByDiscordUID } =  require('../utils/supabaseClient');

module.exports = (client) => {
    client.on('userUpdate', async (oldUser, newUser) => {
        console.log("userUpdateListener:Evento UserUpdate foi disparado")
        // Verificar se o nome de usuário ou o avatar foi alterado
        if (oldUser.username !== newUser.username || 
            oldUser.avatar !== newUser.avatar ||
            oldUser.discriminator !== newUser.discriminator ||
            oldUser.tag !== newUser.tag) {
            try {
                // Obtenha as informações atualizadas do usuário
                const userData = {
                    username: newUser.username,
                    avatar: newUser.displayAvatarURL({ format: 'png', dynamic: true }),
                    tag: newUser.tag,
                    bio: newUser.bio // Note que esta é uma propriedade fictícia, pois Discord.js não fornece uma bio diretamente.
                };
    
                // Tente buscar o usuário pelo UID no Supabase
                const userInDB = await getUserByDiscordUID(newUser.id);
                
                if (userInDB) {
                    // Atualize os detalhes do usuário no Supabase
                    await updateUserDetails(newUser.id, userData);
                } else {
                    // Se o usuário não estiver no banco de dados, adicione-o
                    await addUser(newUser.id, userData);
                }
            } catch (error) {
                console.error("Erro ao atualizar o usuário no Supabase:", error);
            }
        }
    });
};


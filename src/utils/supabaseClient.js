const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    persistSession: false
});

async function getUserByDiscordUID(discord_uid) {
    const { data, error } = await supabase
        .from('discord_users')
        .select('*')
        .eq('discord_uid', discord_uid);

    if (error) {
        // Caso o código de erro seja "PGRST116", trate como usuário não encontrado
        if (error.code === 'PGRST116') {
            console.warn('User not found:', discord_uid);
            return null;
        } else {
            // Caso contrário, é um erro genuíno e deve ser tratado como tal.
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    // Se data for uma lista vazia, significa que o usuário não foi encontrado.
    if (data.length === 0) {
        return null;
    }

    // Retorne o primeiro item da lista, uma vez que discord_uid deve ser único e só deveria haver um resultado.
    return data[0];
}


async function addUserWithRoles(discord_uid, roles) {
    const { data, error } = await supabase
        .from('discord_users')
        .insert([
            { discord_uid: discord_uid, roles: roles }
        ]);

    if (error) {
        console.error('Error adding user:', error);
    }

    return data;
}

async function updateUserRoles(discordId, roles) {
    try {
        const { data, error } = await supabase
            .from('discord_users')
            .update({ roles: roles })  // A lista completa de roles é fornecida aqui.
            .eq('discord_uid', discordId);

        if (error) throw error;

        console.log(`Roles do usuário ${discordId} foram atualizadas no Supabase.`);

    } catch (error) {
        console.error('Error updating user roles:', error);
    }
}
async function addUser(discordId, userData) {
    try {
        const { data, error } = await supabase
            .from('discord_users')
            .insert([
                { discord_uid: discordId, ...userData }
            ]);

        if (error) throw error;

        console.log(`Usuário ${discordId} foi adicionado ao Supabase.`);

    } catch (error) {
        console.error('Error adding user:', error);
    }
}

async function updateUserDetails(discordId, member) {
    const { data, error } = await supabase
        .from('discord_users')
        .update({
            avatar: member.user.avatarURL(),
            nickname: member.nickname || member.user.username, // se não tiver um apelido, use o nome de usuário
            roles: member.roles.cache.map(role => role.name)
        })
        .eq('discord_uid', discordId);

    if (error) {
        console.error('Error updating user details:', error);
        return null;
    }

    return data;
}
async function updateUserDetails(discordId, member) {
    try {
        const userData = {
            username: member.user.username,
            avatar: member.user.displayAvatarURL({ format: 'png', dynamic: true }),
            nickname: member.nickname,
            roles: member.roles.cache.map(role => role.name)
        };

        const { data, error } = await supabase
            .from('discord_users')
            .update(userData)
            .eq('discord_uid', discordId);

        if (error) throw error;

        console.log(`Detalhes do usuário ${discordId} foram atualizados no Supabase.`);
    } catch (error) {
        console.error('Error updating user details:', error);
    }
}

async function addUser(discordId, member) {
    const userData = {
        discord_uid: discordId,
        username: member.user.username,
        avatar: member.user.displayAvatarURL({ format: 'png', dynamic: true }),
        nickname: member.nickname,
        roles: member.roles.cache.map(role => role.name) // Isto deve pegar o nome da role
    };
    console.log('Dados do usuário antes de adicionar ao Supabase:', userData);


    try {
        const { data, error } = await supabase
            .from('discord_users')
            .insert([userData]);

        if (error) throw error;

        console.log(`Usuário ${discordId} foi adicionado ao Supabase.`);
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

async function updateUserBio(discordId, bio) {
    try {
        const { data, error } = await supabase
            .from('discord_users')
            .update({ bio: bio }) 
            .eq('discord_uid', discordId);

        if (error) throw error;

        console.log(`Bio do usuário ${discordId} foi atualizada no Supabase.`);
        return true;
    } catch (error) {
        console.error('Erro ao atualizar a bio do usuário:', error);
        return false;
    }
}

module.exports = {
    getUserByDiscordUID,
    addUserWithRoles,
    updateUserRoles,
    updateUserDetails,   
    addUser,
    updateUserBio              
};

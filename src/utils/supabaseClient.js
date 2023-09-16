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
        .eq('discord_uid', discord_uid)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    return data;
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

async function updateUserDetails(discordId, userData) {
    try {
        const { data, error } = await supabase
            .from('discord_users')
            .update(userData) 
            .eq('discord_uid', discordId);

        if (error) throw error;

        console.log(`Dados do usuário ${discordId} foram atualizados no Supabase.`);

    } catch (error) {
        console.error('Error updating user details:', error);
    }
}


module.exports = {
    getUserByDiscordUID,
    addUserWithRoles,
    updateUserRoles,
    addUser,
    updateUserDetails
};

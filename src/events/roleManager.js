const rolesPersonalizadas = {
    '💡': '1149368696767266947',
    '🔧': '1149369105296658452',
    '📢': '1149369049470476358',
    '✅': '1149369230408564866',
    '☮️': '1149369001747685478',
    '🔍': '1149369151647928340',
};

module.exports = (client) => {

    let roleMessageId; 

    client.once('ready', async () => {
    
        const roleManagementChannel = client.channels.cache.find(channel => channel.name === 'role-management');
        if (!roleManagementChannel) {
            console.log("Canal 'role-management' não encontrado.");
            return;
        }
    
        const messages = await roleManagementChannel.messages.fetch({ limit: 10 });
        const roleMessage = messages.find(msg => msg.embeds.length && msg.embeds[0].title === 'Atribua Roles!');
    
        if (!roleMessage) {
            const embed = {
                title: 'Atribua Roles!',
                description: 'Reaja a esta mensagem para atribuir-se um role.',
                color: 0x0099ff
            };
            
            const msg = await roleManagementChannel.send({ embeds: [embed] });
            
            for (const emojiID in rolesPersonalizadas) {
                await msg.react(emojiID);
            }
            roleMessageId = msg.id;
        } else {
            roleMessageId = roleMessage.id;
        }
    });
    

    client.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.message.id === roleMessageId && !rolesPersonalizadas[reaction.emoji.name]) {
            try {
                await reaction.users.remove(user.id);
                console.log(`Reação ${reaction.emoji.name} de ${user.tag} foi removida da mensagem de roles.`);
            } catch (error) {
                console.error(`Erro ao remover reação de ${user.tag}:`, error);
            }
            return;
        }

        console.log(`Usuário ${user.tag} adicionou a reação ${reaction.emoji.name}`);
        if (user.bot) return;
        const roleID = rolesPersonalizadas[reaction.emoji.name];
        if (!roleID) return;

        const member = await reaction.message.guild.members.fetch(user.id);
        if (member) {
            if (!member.roles.cache.has(roleID)) {
                try {
                    await member.roles.add(roleID);
                    console.log(`Role ${roleID} foi atribuída a ${user.tag}`);
                } catch (error) {
                    console.error(`Erro ao atribuir role ${roleID} para ${user.tag}:`, error);
                }
            }
        } else {
            console.log(`Membro ${user.tag} não foi encontrado.`);
        }
    });

    client.on('messageReactionRemove', async (reaction, user) => {
        try {
            //console.log(`Usuário ${user.tag} removeu a reação ${reaction.emoji.name}`);
    
            const roleID = rolesPersonalizadas[reaction.emoji.id || reaction.emoji.name];
            if (!roleID) return;
    
            const member = await reaction.message.guild.members.fetch(user.id);
            if (member) {
                if (member.roles.cache.has(roleID)) {
                    await member.roles.remove(roleID);
                    console.log(`Role ${roleID} foi removida de ${user.tag}`);
                }
            } else {
                console.log(`Membro ${user.tag} não foi encontrado.`);
            }
        } catch (error) {
            console.error(`Erro ao remover role pelo emoji ${reaction.emoji.name}:`, error);
        }
    });
};

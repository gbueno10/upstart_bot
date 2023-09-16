const especialidadesRoles = {
    '🎨': '1149463738110451712',
    '💼': '1149463926212395081',
    '🔧': '1149464069225599088',
    '📣': '1149464183943987220',
};

let especialidadeMessageId;

module.exports = (client) => {
    client.once('ready', async () => {
        const roleManagementChannel = client.channels.cache.find(channel => channel.name === 'role-management');
        const messages = await roleManagementChannel.messages.fetch({ limit: 10 });
        const especialidadeMessage = messages.find(msg => msg.embeds.length && msg.embeds[0].title === 'Escolha sua Especialidade!');

        if (!especialidadeMessage) {
            const embed = {
                title: 'Escolha sua Especialidade!',
                description: 'Reaja a esta mensagem para escolher sua área de especialidade.',
                color: 0x00FF00
            };
            
            const msg = await roleManagementChannel.send({ embeds: [embed] });
            
            for (const emojiID in especialidadesRoles) {
                await msg.react(emojiID);
            }
            especialidadeMessageId = msg.id;
        } else {
            especialidadeMessageId = especialidadeMessage.id;
        }
    });

    client.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.message.id === especialidadeMessageId) {
            if (!especialidadesRoles[reaction.emoji.name]) {
                try {
                    await reaction.users.remove(user.id);
                    console.log(`Reação ${reaction.emoji.name} de ${user.tag} foi removida da mensagem de especialidades.`);
                } catch (error) {
                    console.error(`Erro ao remover reação de ${user.tag}:`, error);
                }
            } else {
                const roleID = especialidadesRoles[reaction.emoji.name];
                const member = await reaction.message.guild.members.fetch(user.id);
                if (member && !member.roles.cache.has(roleID)) {
                    try {
                        await member.roles.add(roleID);
                        console.log(`Especialidade ${roleID} foi atribuída a ${user.tag}`);
                    } catch (error) {
                        console.error(`Erro ao atribuir especialidade ${roleID} para ${user.tag}:`, error);
                    }
                }
            }
        }
    });

    client.on('messageReactionRemove', async (reaction, user) => {
        if (reaction.message.id === especialidadeMessageId) {
            const roleID = especialidadesRoles[reaction.emoji.name];
            if (roleID) {
                const member = await reaction.message.guild.members.fetch(user.id);
                if (member && member.roles.cache.has(roleID)) {
                    try {
                        await member.roles.remove(roleID);
                        console.log(`Especialidade ${roleID} foi removida de ${user.tag}`);
                    } catch (error) {
                        console.error(`Erro ao remover especialidade ${roleID} de ${user.tag}:`, error);
                    }
                }
            }
        }
    });
};

const emojis = require('../emojis.json')

module.exports = {
    name: 'ping',
    name2: "latencia",
    name3: "latência",
    name4: "lag",
    name5: "latency",
    type: 'Geral',
    description: 'O ping é utilizado para saber se eu estou na ativa e saber quanto tempo eu demoro para responder minhas solicitações.',
    async execute(message, args, comando, client) {
        const botMembro = message.guild.member(client.user.id)
        const permissoesBot = message.channel.memberPermissions(botMembro)
        const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
        const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
        if(podeEnviarMsg) {
            const m = await message.channel.send("Pong🏓");
            m.edit(`A latência do bot é de ${m.createdTimestamp - message.createdTimestamp}ms.\nA latência da API é de ${Math.round(client.ws.ping)}ms`);
        } else {
            const m = await message.author.send("Pong🏓").then(m => {
                m.edit(`A latência do bot é de ${m.createdTimestamp - message.createdTimestamp}ms.\nA latência da API é de ${Math.round(client.ws.ping)}ms`)
                if(podeAddReactions) {
                    message.react(emojis.send)
                }
            }, () => {
                if(podeAddReactions) {
                    message.react(emojis.slashred)
                }
            })
        }
    }
}
module.exports = {
    name: 'ping',
    type: 'Geral',
    description: 'Ping!',
    async execute(message, args, comando, client) {
        const m = await message.channel.send("Pong🏓");
        m.edit(`A latência do bot é de ${m.createdTimestamp - message.createdTimestamp}ms.\nA latência da API é de ${Math.round(client.ws.ping)}ms`);
    }
}
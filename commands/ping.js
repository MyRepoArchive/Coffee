module.exports = {
    name: 'ping',
    description: 'Ping!',
    async execute(message, args, client) {
        const m = await message.channel.send("Pong🏓");
        m.edit(`A latência do bot é de ${m.createdTimestamp - message.createdTimestamp}ms.\nA latência da API é de ${Math.round(client.ws.ping)}ms`);
    }
}
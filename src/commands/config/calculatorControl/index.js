const client = require('../../..');
const verifyActiveCooldown = require('../../../functions/verifyActiveCooldown');
const { admins } = require('../../../config/default.json');
const unauthorized = require('../setPrefix/src/unauthorized');
const { static: { emoji, eID }, animated: { emoji: { loading2 } } } = require('../../../utils/emojis.json');
const { MessageEmbed } = require('discord.js');
const exec = require('./src/exec');

module.exports = {
  config: require('./src/config'),

  run({ message, args, prefix }) {
    const guildPerms = message.member.permissions;
    const permissions = message.channel.permissionsFor(client.user);

    if (!verifyActiveCooldown(message, this.config)) return;
    if (!guildPerms.has('MANAGE_GUILD') && !guildPerms.has('ADMINISTRATOR') && !admins.includes(message.author.id))
      return unauthorized(message, permissions);

    const param = args.join(' ').toUpperCase();

    if (param === 'ENABLE ALL') return exec(true, true, message, permissions);
    if (param === 'DISABLE ALL') return exec(true, false, message, permissions);
    if (param === 'ENABLE THIS') return exec(false, true, message, permissions);
    if (param === 'DISABLE THIS') return exec(false, false, message, permissions);

    if (admins.includes(message.author.id)) {
      if (param === 'ENABLE ALL GUILDS') return exec(false, true, message, permissions, true);
      if (param === 'DISABLE ALL GUILDS') return exec(false, false, message, permissions, true);
    };

    const allChannels = Object.values(client.db.cache.channels);
    const guildChannels = allChannels.filter(ch => ch.guild_id === message.guild.id);
    const embed = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .addField('Status', 
        `> Canal atual: ${client.db.cache.channels[message.channel.id].calc_perm ? `${emoji.emojicoffeecheck} Ativo` : `${emoji.emojicoffeeerro} Inativo`}\n` +
        `> Servidor (\`Ativos\`/\`Inativos\`): \`${guildChannels.filter(x => x.calc_perm).length}\`/\`${guildChannels.filter(x => !x.calc_perm).length}\`\n` +
        `${admins.includes(message.author.id) ? `> Geral (\`Ativos\`/\`Inativos\`): \`${allChannels.filter(x => x.calc_perm).length}\`/\`${allChannels.filter(x => !x.calc_perm).length}\`` : ''}`
      )
      .setTimestamp();

    if (permissions.has('SEND_MESSAGES')) {
      message.channel.send(`> ${loading2} Configurando...`).then(msg => {
        addPersonReactions(msg).then(async () => {
          setEmbedDesc(true);

          await msg.edit('', embed);
          createCollector(msg);
        }, async () => {
          await msg.react('1️⃣').catch(() => { });
          await msg.react('2️⃣').catch(() => { });
          await msg.react('3️⃣').catch(() => { });
          await msg.react('4️⃣').catch(() => { });
          if (admins.includes(message.author.id)) {
            await msg.react('5️⃣').catch(() => { });
            await msg.react('6️⃣').catch(() => { });
          };

          setEmbedDesc(false);

          await msg.edit('', embed);
          createCollector(msg);
        })
      }, () => message.react(eID.emojicoffeeerro).catch(() => { }));
    };



    const addPersonReactions = (msg) => new Promise(async (resolve, reject) => {
      if (permissions.has('ADD_REACTIONS')) {
        await msg.react(eID.hostingserverperm).catch(() => reject());
        await msg.react(eID.hostingserverblock).catch(() => reject());
        await msg.react(eID.textchannelclaro).catch(() => reject());
        await msg.react(eID.textchannelblockedclaro).catch(() => reject());
        if (admins.includes(message.author.id)) {
          await msg.react(eID.emojicoffeecheck).catch(() => reject());
          await msg.react(eID.emojicoffeeerro).catch(() => reject());
        };

        resolve();
      } else {
        reject();
      };
    });

    function createCollector(msg) {
      let collectorColldown = 0;
      msg.createReactionCollector((r, user) => user.id === message.author.id, { time: 60000 }).on('collect', reaction => {
        if (Date.now() - collectorColldown > 5000 || admins.includes(message.author.id)) {
          if (reaction.emoji.id === eID.hostingserverperm || reaction.emoji.name === '1️⃣') exec(true, true, message, permissions);
          if (reaction.emoji.id === eID.hostingserverblock || reaction.emoji.name === '2️⃣') exec(true, false, message, permissions);
          if (reaction.emoji.id === eID.textchannelclaro || reaction.emoji.name === '3️⃣') exec(false, true, message, permissions);
          if (reaction.emoji.id === eID.textchannelblockedclaro || reaction.emoji.name === '4️⃣') exec(false, false, message, permissions);
          if (reaction.emoji.id === eID.emojicoffeecheck || reaction.emoji.name === '5️⃣') exec(false, true, message, permissions, true);
          if (reaction.emoji.id === eID.emojicoffeeerro || reaction.emoji.name === '6️⃣') exec(false, false, message, permissions, true);

          collectorColldown = Date.now();
        }
      });
    };

    function setEmbedDesc(person = false) {
      embed.setDescription(
        `${person ? emoji.hostingserverperm : '1️⃣'} \`|\` Permitir no servidor\n` +
        `${person ? emoji.hostingserverblock : '2️⃣'} \`|\` Bloquear no servidor\n` +
        `${person ? emoji.textchannelclaro : '3️⃣'} \`|\` Permitir neste canal\n` +
        `${person ? emoji.textchannelblockedclaro : '4️⃣'} \`|\` Bloquear neste canal\n` +
        `${admins.includes(message.author.id) ? (`${person ? emoji.emojicoffeecheck : '5️⃣'} \`|\` Permitir em todos os servidores\n`) : ''}` +
        `${admins.includes(message.author.id) ? (`${person ? emoji.emojicoffeeerro : '6️⃣'} \`|\` Bloquear em todos os servidores\n`) : ''}`
      );
    };
  }
}
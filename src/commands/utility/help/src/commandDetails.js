const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const { static: { emoji } } = require('../../../../utils/emojis.json');
const sendEmbed = require("./sendEmbed");

module.exports = (command, message, permissions) => {
  const momentoCriacao = `${moment(command.created_timestamp).locale('pt-br').format('LLL')} (${moment(command.created_timestamp).locale('pt-br').fromNow()})`;
  const lastUpdateMoment = `${moment(command.updated_timestamp).locale('pt-br').format('LLL')} (${moment(command.updated_timestamp).locale('pt-br').fromNow()})`;

  const embed = new Discord.MessageEmbed()
    .setTitle(`**${command.name}** (${command.aliases.join(', ')})`)
    .setDescription(command.description)
    .addFields(
      { name: 'Tipo', value: command.type },
      { name: 'Como usar', value: command.how_to_use },
      { name: 'Exemplo', value: command.example },
      { name: 'Cooldown', value: `**${ms(command.cooldown)}** com até **${command.times_limit}** vezes seguidas` },
      { 
        name: 'Status', 
        value: command.active ? 
          `${emoji.emojicoffeecheck} Ativo` : 
          `${emoji.emojicoffeeerro} Inativo\n` + 
          `> ${command.reason_inactivity || 'SEM MOTIVO INFORMADO'}`
      },
      { 
        name: 'Datas', 
        value: 
          `> Criado em: ${momentoCriacao}\n` +
          `> Ultima atualização: ${lastUpdateMoment}`
      },
      {
        name: 'Ultimas versões',
        value: command.releases_notes ? Object.values(command.releases_notes)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 3)
          .map((vVersion, i, arr) => {
            const version = vVersion.v;
            const formatedVersion = version.replace(/,/g, '.');
            const formatedVersionTimestamp = moment(vVersion.timestamp).locale('pt-br').format('lll');
            const preResult = genValue(vVersion.description);
           
            if (preResult.length > 1024 / arr.length) {
              const excedente = preResult.length - (1024 / arr.length);
              const desc = vVersion.description.slice(0, vVersion.description.length - excedente - 5) + '`...`';
              
              return genValue(desc);
            } else {
              return preResult;
            };

            function genValue(desc) {
              return (
                `**(${formatedVersion}): ${vVersion.name}** ${version === command.version ? '(Atual)' : ''}\n` +
                `> ${desc}\n` +
                `\`${formatedVersionTimestamp}\``
              );
            };
          }).join('\n\n') : 'SEM NOTAS DE VERSÃO'
      }
    )
    .setImage(command.example_url)
    .setColor(message.member.displayHexColor)
    .setTimestamp()

  sendEmbed(embed, permissions, message);
};
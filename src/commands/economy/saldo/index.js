const puppeteer = require('puppeteer');
const genHTML = require('./src/genHTML');
const client = require('../../..');
const createMember = require('../../../controllers/members/create');
const createUser = require('../../../controllers/users/create');
const error = require('../../../functions/error');
const { static: { emoji }, animated: { emoji: { loading2 } } } = require('../../../utils/emojis.json');
const chatOrDm = require('../../../functions/chatOrDm');

module.exports = {
  config: require('./src/config'),

  async run({ message, permissions, args }) {
    const preMsg = await chatOrDm(`${loading2} Calculando...`, permissions, message).catch(() => {});
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const paramMember = args.join(' ');
    await page.setViewport({ width: 490, height: 250, deviceScaleFactor: 1 });
    let user =
    (message.mentions.users.first() ||
    message.guild.members.cache.find(member => (
      paramMember === member.id ||
      paramMember === member.displayName ||
      paramMember === member.user.username
    )) ? message.mentions.users.first() ||
    message.guild.members.cache.find(member => (
      paramMember === member.id ||
      paramMember === member.displayName ||
      paramMember === member.user.username
    )).user : undefined) || 
    message.author;

    if (user.bot) user = message.author;

    const saldoLocal = client.db.cache.members[`${message.guild.id}-${user.id}`] ? client.db.cache.members[`${message.guild.id}-${user.id}`].money : (() => {
      const obj = {};
      const newMember = {
        created_timestamp: null,
        guild_id: message.guild.id,
        id: `${message.guild.id}-${user.id}`,
        money: null,
        score: null,
        user_id: user.id
      };

      obj[`${message.guild.id}-${user.id}`] = newMember;

      createMember(obj).catch(e => error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        `> Houve um erro ao criar um novo membro no banco de dados!\n` +
        `> Path: "${__filename}"\n` +
        `> Membro: ${JSON.stringify(newMember, null, 2)}\n` +
        `> Erro: ${e}`
      ));

      return 0
    })();

    const saldoGlobal = client.db.cache.users[user.id] ? client.db.cache.users[user.id].money : (() => {
      const obj = {};
      const newUser = {
        admin: null,
        consecutive_days: null,
        created_timestamp: null,
        daily_timestamp: null,
        id: user.id,
        job: null,
        money: null
      };

      obj[user.id] = newUser;

      createUser(obj).catch(e => error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        `> Houve um erro ao criar um novo usuário no banco de dados!\n` +
        `> Path: "${__filename}"\n` +
        `> Usuário: ${JSON.stringify(newUser, null, 2)}\n` +
        `> Erro: ${e}`
      ));

      return 0
    })();

    await page.setContent(genHTML(saldoLocal, saldoGlobal, user.displayAvatarURL({ format: 'png', size: 1024 })), { waitUntil: 'networkidle2' });

    await preMsg ? preMsg.delete() : undefined;

    chatOrDm({ files: [{ name: 'saldo.png', attachment: Buffer.from(await page.screenshot({ encoding: 'base64' }), 'base64') }] }, permissions, message).catch(() => {});
  }
};
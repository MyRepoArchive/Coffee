"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const Event_1 = __importDefault(require("../shared/Event"));
const getLogChannel_1 = __importDefault(require("../utils/getLogChannel"));
const infoTemplate_1 = __importDefault(require("../utils/infoTemplate"));
const errorTemplate_1 = __importDefault(require("../utils/errorTemplate"));
const discord_js_1 = require("discord.js");
const successTemplate_1 = __importDefault(require("../utils/successTemplate"));
const env_1 = require("../utils/env");
exports.default = new Event_1.default('guildDelete', async (bot, guild) => {
    leaveLogs(bot, guild);
    bot.database.guilds
        .delete(guild.id)
        .then(() => onRemoveSuccess(guild, bot))
        .catch((error) => {
        if (error.reason === 'Error')
            onRemoveError(error.mysqlError, guild, error.query, bot);
        else if (error.reason === 'Mais de uma linha afetada')
            onRemoveMoreOfOneRow(guild, bot, error.query, error.results);
        else
            onRemoveNoneRows(guild, bot, error.query, error.results);
    });
});
async function leaveLogs(bot, guild) {
    console.info('\n' + (0, infoTemplate_1.default)(), `Bot acabou de sair do servidor ${chalk_1.default.cyan(guild.name)}!`);
    const logChannel = await (0, getLogChannel_1.default)(bot);
    logChannel?.send({
        embeds: [
            {
                color: '#00FFFF',
                title: `<:out:906245908478455808>  Bot acabou de sair do servidor \`${guild.name}\`!`,
                timestamp: new Date(),
            },
        ],
    });
}
async function onRemoveError(error, guild, query, bot) {
    console.error((0, errorTemplate_1.default)(), chalk_1.default.bold.red(`Erro ao remover o registro do servidor ${chalk_1.default.white(guild.name)} do banco de dados!\nQuery: ${query}\nErro:`, error));
    const logChannel = await (0, getLogChannel_1.default)(bot);
    const errorText = new discord_js_1.MessageAttachment(Buffer.from(error.stack || error.message), 'error.txt');
    const errorJson = new discord_js_1.MessageAttachment(Buffer.from(JSON.stringify(error, null, 2)), 'error.json');
    await logChannel?.send({
        content: env_1.env.OWNERS.map((id) => `<@${id}>`).join(', '),
        embeds: [
            {
                color: '#FC2A2A',
                footer: {
                    text: __filename,
                },
                timestamp: new Date(),
                title: `<:x_:905962263750537257>  Erro ao remover o registro do servidor \`${guild.name}\` do banco de dados!`,
                description: `\`\`\`${query}\`\`\``,
            },
        ],
    });
    await logChannel?.send({ files: [errorText, errorJson] });
}
async function onRemoveSuccess(guild, bot) {
    console.info((0, successTemplate_1.default)(), `Registro do servidor ${chalk_1.default.cyan(guild.name)} (${chalk_1.default.cyan(guild.id)}) removido com sucesso do banco de dados!`);
    const logChannel = await (0, getLogChannel_1.default)(bot);
    logChannel?.send({
        embeds: [
            {
                color: '#00FF75',
                title: `<:check:905952950864715836>  Registro do servidor \`${guild.name}\` (\`${guild.id}\`) removido com sucesso do banco de dados!`,
                timestamp: new Date(),
            },
        ],
    });
}
async function onRemoveMoreOfOneRow(guild, bot, query, results) {
    console.error((0, errorTemplate_1.default)(), chalk_1.default.bold.red(`Mais de um registro foi afetado ao tentar remover o registro do servidor ${chalk_1.default.white(guild.name)} do banco de dados!\nQuery: ${query}\nOkPacket:`, JSON.stringify(results, null, 2)));
    const logChannel = await (0, getLogChannel_1.default)(bot);
    const error = new discord_js_1.MessageAttachment(Buffer.from(JSON.stringify(results, null, 2)), 'ok_packet.json');
    await logChannel?.send({
        content: env_1.env.OWNERS.map((id) => `<@${id}>`).join(', '),
        embeds: [
            {
                color: '#FC2A2A',
                footer: {
                    text: __filename,
                },
                timestamp: new Date(),
                title: `<:x_:905962263750537257>  Mais de um registro foi afetado ao tentar remover o registro do servidor \`${guild.name}\` do banco de dados!`,
                description: `\`\`\`${query}\`\`\``,
            },
        ],
    });
    logChannel?.send({ files: [error] });
}
async function onRemoveNoneRows(guild, bot, query, results) {
    console.error((0, errorTemplate_1.default)(), chalk_1.default.bold.red(`Nenhum registro foi afetado ao tentar remover o registro do servidor ${chalk_1.default.white(guild.name)} do banco de dados!\nQuery: ${query}\nOkPacket:`, JSON.stringify(results, null, 2)));
    const logChannel = await (0, getLogChannel_1.default)(bot);
    const error = new discord_js_1.MessageAttachment(Buffer.from(JSON.stringify(results, null, 2)), 'ok_packet.json');
    await logChannel?.send({
        content: env_1.env.OWNERS.map((id) => `<@${id}>`).join(', '),
        embeds: [
            {
                color: '#FC2A2A',
                footer: {
                    text: __filename,
                },
                timestamp: new Date(),
                title: `<:x_:905962263750537257>  Nenhum registro foi afetado ao tentar remover o registro do servidor \`${guild.name}\` do banco de dados!`,
                description: `\`\`\`${query}\`\`\``,
            },
        ],
    });
    logChannel?.send({ files: [error] });
}

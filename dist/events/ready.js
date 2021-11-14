"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const Event_1 = __importDefault(require("../shared/Event"));
const changeActivity_1 = __importDefault(require("../utils/changeActivity"));
const getLogChannel_1 = __importDefault(require("../utils/getLogChannel"));
const log_1 = __importDefault(require("../utils/log"));
exports.default = new Event_1.default('ready', async (bot) => {
    log_1.default.info(chalk_1.default.bold('INICIANDO...'));
    const guilds = bot.guilds.cache;
    const logChannel = await (0, getLogChannel_1.default)(bot);
    log_1.default.info(chalk_1.default.bold('ESTATÍSTICAS'));
    log_1.default.info(`Usuários: ${chalk_1.default.yellow(bot.users.cache.size)}`);
    log_1.default.info(`Canais: ${chalk_1.default.yellow(bot.channels.cache.size)}`);
    log_1.default.info(`Servidores: ${chalk_1.default.yellow(guilds.size)}`);
    log_1.default.info(chalk_1.default.bold('10 MAIORES SERVIDORES'));
    const top10Guilds = guilds
        .sort((a, b) => b.memberCount - a.memberCount)
        .first(10);
    for (const guild in top10Guilds) {
        log_1.default.info(`[${chalk_1.default.cyan(`${Number(guild) + 1}`.padStart(2, '0'))}/${chalk_1.default.cyan(10)}] ${top10Guilds[guild].name} (${chalk_1.default.yellow(top10Guilds[guild].memberCount)})`);
    }
    logChannel?.send({
        embeds: [
            {
                color: '#00ffff',
                title: `<:onoff:905961889081741382>  Bot \`${bot.user?.username}\` iniciado em ${(bot.readyTimestamp - bot.instanciedTime.getTime()) / 1000} segundos!`,
                timestamp: new Date(),
            },
        ],
    });
    (0, changeActivity_1.default)(bot);
    log_1.default.info(chalk_1.default.bold('SINCRONIZANDO BANCO DE DADOS COM DISCORD...'));
    const dataToSync = [
        { name: 'guilds', promise: bot.database.guilds.syncWithDiscord(bot) },
    ];
    dataToSync.forEach(({ name, promise }, index) => {
        const idx = `${index + 1}`.padStart(`${dataToSync.length}`.length, '0');
        promise
            .then(() => {
            log_1.default.success(`[${chalk_1.default.green(idx)}/${chalk_1.default.greenBright(dataToSync.length)}] Dados de ${chalk_1.default.cyan(name)} sincronizados!`);
        })
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .catch(() => { });
    });
}, 'once');

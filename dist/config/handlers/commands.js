"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const env_1 = require("../../utils/env");
const getFormatedDirname_1 = __importDefault(require("../../utils/getFormatedDirname"));
const getLogChannel_1 = __importDefault(require("../../utils/getLogChannel"));
const log_1 = __importDefault(require("../../utils/log"));
async function setCommandsHandler(bot) {
    log_1.default.info(chalk_1.default.bold('SETANDO COMANDOS...'));
    try {
        const commandFiles = (0, fs_1.readdirSync)((0, getFormatedDirname_1.default)(__dirname) + '../../commands').filter((file) => file.endsWith('.js'));
        for (const file of commandFiles) {
            const idx = `${commandFiles.indexOf(file) + 1}`;
            try {
                const command = require(`../../commands/${file}`)?.default;
                bot.commands.set(command.name, command);
                log_1.default.success(`[${chalk_1.default.green(idx.padStart(`${commandFiles.length}`.length, '0'))}/${chalk_1.default.greenBright(commandFiles.length)}] Comando ${chalk_1.default.cyan(file.slice(0, -3))} setado!`);
            }
            catch (error) {
                log_1.default.error(`Erro ao setar o comando: ${file?.slice(0, -3)}!\nErro:`, error);
                const logChannel = await (0, getLogChannel_1.default)(bot);
                const attachment = new discord_js_1.MessageAttachment(Buffer.from(error.stack || error), 'error.txt');
                logChannel.send({
                    content: env_1.env.OWNERS.map((id) => `<@${id}>`).join(', '),
                    embeds: [
                        {
                            color: '#FC2A2A',
                            title: `<:x_:905962263750537257>  Erro ao setar o comando: **${file?.slice(0, -3)}**!`,
                            footer: {
                                text: __filename,
                            },
                            timestamp: Date.now(),
                        },
                    ],
                });
                logChannel?.send({ files: [attachment] });
            }
        }
    }
    catch (error) {
        log_1.default.error('Erro ao setar os comandos!\nErro:', error);
        const logChannel = await (0, getLogChannel_1.default)(bot);
        const attachment = new discord_js_1.MessageAttachment(Buffer.from(error.stack || error), 'error.txt');
        logChannel?.send({
            content: env_1.env.OWNERS.map((id) => `<@${id}>`).join(', '),
            embeds: [
                {
                    color: '#FC2A2A',
                    title: `<:x_:905962263750537257>  Erro ao setar os comandos!`,
                    footer: {
                        text: __filename,
                    },
                    timestamp: Date.now(),
                },
            ],
        });
        logChannel?.send({ files: [attachment] });
    }
}
exports.default = setCommandsHandler;

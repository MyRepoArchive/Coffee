"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
const Event_1 = __importDefault(require("../shared/Event"));
const env_1 = require("../utils/env");
const errorTemplate_1 = __importDefault(require("../utils/errorTemplate"));
const getLogChannel_1 = __importDefault(require("../utils/getLogChannel"));
exports.default = new Event_1.default('error', async (bot, error) => {
    console.error((0, errorTemplate_1.default)(), chalk_1.default.bold.red('Um erro foi emitido pelo bot!\nErro:'), error);
    const logChannel = await (0, getLogChannel_1.default)(bot);
    const attachment = new discord_js_1.MessageAttachment(Buffer.from(error.stack || error.message), 'error.txt');
    await logChannel.send({
        content: env_1.env.OWNERS.map((id) => `<@${id}>`).join(', '),
        embeds: [
            {
                color: '#FC2A2A',
                footer: {
                    text: __filename,
                },
                timestamp: new Date(),
                title: '<:x_:905962263750537257>  Um erro foi emitido pelo bot!',
            },
        ],
    });
    await logChannel.send({
        files: [attachment],
    });
});

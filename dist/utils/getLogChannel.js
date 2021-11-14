"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
async function getLogChannel(bot) {
    return (await bot.channels.fetch(env_1.env.MAIN_LOG_CHANNEL));
}
exports.default = getLogChannel;

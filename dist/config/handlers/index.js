"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = __importDefault(require("./commands"));
const events_1 = __importDefault(require("./events"));
async function setHandlers(bot) {
    await (0, events_1.default)(bot);
    await (0, commands_1.default)(bot);
    bot.emit('ready', bot);
}
exports.default = setHandlers;

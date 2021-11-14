"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logs = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const handlers_1 = __importDefault(require("./config/handlers"));
const Bot_1 = require("./shared/Bot");
const login_1 = __importDefault(require("./utils/login"));
exports.logs = [];
function hookStream(_stream, fn) {
    const oldWrite = _stream.write;
    _stream.write = (...params) => {
        fn(params);
        return oldWrite.apply(_stream, params);
    };
    return function () {
        _stream.write = oldWrite;
    };
}
hookStream(process.stdout, function (string) {
    exports.logs.push(string[0]);
});
hookStream(process.stderr, function (string) {
    exports.logs.push(string[0]);
});
hookStream(process.stdin, function (string) {
    exports.logs.push(string[0]);
});
async function app() {
    const bot = new Bot_1.Bot({
        intents: [
            'GUILDS',
            'DIRECT_MESSAGES',
            'GUILD_MESSAGES',
            'GUILD_BANS',
            'GUILD_MESSAGE_REACTIONS',
            'GUILD_MESSAGE_TYPING',
            'GUILD_PRESENCES',
            'GUILD_VOICE_STATES',
            'DIRECT_MESSAGE_REACTIONS',
            'DIRECT_MESSAGE_TYPING',
            'GUILD_EMOJIS_AND_STICKERS',
            'GUILD_INTEGRATIONS',
            'GUILD_INVITES',
            'GUILD_MEMBERS',
            'GUILD_WEBHOOKS',
        ],
    }, true);
    dayjs_1.default.locale('pt-br');
    await (0, login_1.default)(bot);
    await (0, handlers_1.default)(bot);
}
app();

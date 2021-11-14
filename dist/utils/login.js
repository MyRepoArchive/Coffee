"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const log_1 = __importDefault(require("./log"));
async function login(bot) {
    log_1.default.info('Logando...');
    await bot
        .login(env_1.env.TOKEN)
        .then(() => log_1.default.success('Logado com sucesso!'))
        .catch((err) => log_1.default.error('Erro ao fazer login!\nErro:', err));
}
exports.default = login;

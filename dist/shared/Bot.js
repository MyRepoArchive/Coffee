"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const database_1 = __importDefault(require("../database"));
class Bot extends discord_js_1.Client {
    constructor(options, makeCache) {
        super(options);
        this.makeCache = makeCache;
        this.instanciedTime = new Date();
        this.commands = options?.commands ?? new discord_js_1.Collection();
        this.database = null;
    }
    async login(token) {
        const logedToken = await super.login(token);
        this.database = (await database_1.default.init(this, this.makeCache));
        return logedToken;
    }
}
exports.Bot = Bot;

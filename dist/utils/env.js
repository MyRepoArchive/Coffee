"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
exports.env = {
    PREFIX: process.env.PREFIX || '!',
    OWNERS: process.env.OWNERS ? process.env.OWNERS.split(',') : [],
    TOKEN: process.env.TOKEN || '',
    MAIN_LOG_CHANNEL: process.env.MAIN_LOG_CHANNEL || '',
    REPORT_CHANNEL: process.env.REPORT_CHANNEL || '',
    SUGGESTIONS_CHANNEL: process.env.SUGGESTIONS_CHANNEL || '',
    COMMANDS_URL: process.env.COMMANDS_URL || '',
    REPOSITORY_URL: process.env.REPOSITORY_URL || '',
    MYSQL_USER: process.env.MYSQL_USER || '',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
    MYSQL_HOST: process.env.MYSQL_HOST || '',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || '',
    MYSQL_PORT: Number(process.env.MYSQL_PORT) || 3306,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
exports.default = {
    database: env_1.env.MYSQL_DATABASE,
    host: env_1.env.MYSQL_HOST,
    user: env_1.env.MYSQL_USER,
    password: env_1.env.MYSQL_PASSWORD,
    port: env_1.env.MYSQL_PORT,
};

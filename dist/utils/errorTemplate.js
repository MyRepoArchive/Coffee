"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const dayjs_1 = __importDefault(require("dayjs"));
function errorTemplate() {
    return `${chalk_1.default.red.bold('✗ ERROR')} ${chalk_1.default.gray((0, dayjs_1.default)().format('hh:mm:ss'))}:`;
}
exports.default = errorTemplate;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFormatedDirname(dirname) {
    return dirname.endsWith('\\')
        ? dirname.replace(/\\/g, '/')
        : dirname.replace(/\\/g, '/') + '/';
}
exports.default = getFormatedDirname;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(name, run, type = 'on') {
        this.name = name;
        this.run = run;
        this.type = type;
    }
}
exports.default = Event;

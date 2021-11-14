"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(options) {
        this.options = options;
        Object.assign(this, {
            aliases: [],
            allowBot: false,
            allowDM: false,
            description: null,
            type: 'miscellany',
            memberNecessaryPermissions: [[]],
            botNecessaryPermissions: [[]],
            ...options,
        });
    }
    async start(data) {
        const isDm = data.message.channel.type === 'DM';
        const isBot = data.message.author.bot;
        (await this.primaryValidation({ ...data, isDm, isBot })) &&
            (await this.memberPermissionsValidation({ ...data, isDm, isBot })) &&
            (await this.botPermissionsValidation({ ...data, isDm, isBot })) &&
            (await this.run({ ...data, isDm, isBot }));
    }
    async primaryValidation({ isDm, isBot }) {
        if (!this.allowBot && isBot)
            return;
        if (!this.allowDM && isDm)
            return;
        return true;
    }
    async memberPermissionsValidation({ message, isDm }) {
        if (isDm)
            return true;
        const channel = message.channel;
        const havePermission = this.memberNecessaryPermissions.some((permissions) => {
            return permissions.every((permission) => message.member.permissions.has(permission) &&
                (channel.permissionsFor?.(message.member).has(permission) ?? true));
        });
        if (!havePermission) {
            const messageContent = `> <:x_:905962263750537257> Você não possui as permissões necessárias para usar este comando!\n\`\`\`\n(${this.memberNecessaryPermissions
                .map((permissions) => permissions.join(' e '))
                .join('), (')})\n\`\`\``;
            if (channel.permissionsFor?.(message.guild.me)?.has('SEND_MESSAGES')) {
                message.channel.send(messageContent);
            }
            else {
                message.author.send(messageContent);
                message.react('905962263750537257');
            }
        }
        return havePermission;
    }
    async botPermissionsValidation({ message, isDm }) {
        if (isDm)
            return true;
        const channel = message.channel;
        const havePermission = this.botNecessaryPermissions.some((permissions) => {
            return permissions.every((permission) => message.guild.me.permissions.has(permission) &&
                (channel.permissionsFor?.(message.guild.me).has(permission) ?? true));
        });
        if (!havePermission) {
            const messageContent = `> <:x_:905962263750537257> Eu não possuo as permissões necessárias para usar este comando!\n\`\`\`\n(${this.botNecessaryPermissions
                .map((permissions) => permissions.join(' e '))
                .join('), (')})\n\`\`\``;
            if (channel.permissionsFor?.(message.guild.me)?.has('SEND_MESSAGES')) {
                message.channel.send(messageContent);
            }
            else {
                message.author.send(messageContent);
                message.react('905962263750537257');
            }
        }
        return havePermission;
    }
}
exports.default = Command;

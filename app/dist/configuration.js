"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    defaultRole: "Unverified Member",
    assignedRole: "Member",
    adminRoles: ["Founder", "Manager"],
    channelId: '_' + '__CHANNEL_ID__',
    token: process.env.TOKEN,
    interval: 1,
    retryTimes: 10
};

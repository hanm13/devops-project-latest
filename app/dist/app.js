"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const util = require("util");
const configuration_1 = require("./configuration");
class Main {
    main() {

        console.log(`token provided: ${configuration_1.config.token}`);

        this.client = new discord_js_1.Client();
        this.client.on('ready', this.ready.bind(this));
        this.client.on('message', this.message.bind(this));
        this.client.login(configuration_1.config.token).then(() => {
            console.log("Login went successful!");
        }, error => {
            console.log("" + error);
            setTimeout(()=>{

                this.main();

            }, 5000);
            // process.exit(1);
        });
    }
    ready() {
        console.log("Ready...");
    }
    message(message) {
        if (message.channel.id === configuration_1.config.channelId) {
            if (message.content === "!verify") {
                if (message.deletable) {
                    message.delete(20);
                    this.verify(message.author, message.member, message.guild);
                }
                else {
                    message.reply("Your message is not deletable.");
                }
            }
            else {
                if (message.deletable) {
                    if (!(message.content.startsWith("_") && !util.isNullOrUndefined(message.member.roles.find((role) => configuration_1.config.adminRoles.indexOf(role.name) != -1)))) {
                        message.delete(20);
                        message.author.send("Your command is invalid.");
                    }
                }
            }
        }
    }
    async verify(user, guildMember, guild) {
        let str = "";
        let num1 = Math.floor(Math.random() * 20 + 1);
        let num2 = Math.floor(Math.random() * 20 + 1);
        str += util.format("%s + %s = ?", num1, num2);
        try {
            await user.send("Hi! I'm the verification bot! Please answer the following question:");
            await user.send(str);
            let retryTimes = 0;
            let interval;
            let handleMessage = async (message) => {
                try {
                    if (message.content != (num1 + num2).toString()) {
                        if (++retryTimes >= configuration_1.config.retryTimes) {
                            await user.send("Verification failed.");
                            clearInterval(interval);
                            if (!util.isNullOrUndefined(guildMember.roles.find(role => role.name === configuration_1.config.defaultRole))) {
                                guildMember.kick("You have kicked due to your failure of passing the verification test.");
                            }
                        }
                    }
                    else {
                        clearInterval(interval);
                        let defaultRole = guildMember.roles.find(role => role.name === configuration_1.config.defaultRole);
                        let assignedRole = guild.roles.find(role => role.name === configuration_1.config.assignedRole);
                        if (assignedRole != null && defaultRole != null) {
                            try {
                                await guildMember.removeRole(defaultRole);
                                await guildMember.addRole(assignedRole);
                                await user.send("Verification is done.");
                            }
                            catch (e) {
                                await user.send("Something went wrong..");
                                console.log(e);
                            }
                        }
                        else {
                            await user.send("Something went wrong.. Are you sure you're supposed to verify yourself?");
                        }
                    }
                }
                catch (e) {
                    if (e instanceof discord_js_1.DiscordAPIError) {
                        if (e.code === 50007) {
                            console.error("Failed to send message to " + user.username);
                        }
                    }
                    console.error("Failure regarding username " + user.username + ":");
                    console.error(e);
                }
            };
            interval = setInterval(() => {
                handleMessage(user.lastMessage);
            }, configuration_1.config.interval * 1000);
        }
        catch (e) {
            if (e instanceof discord_js_1.DiscordAPIError) {
                if (e.code === 50007) {
                    console.error("Failed to send message to " + user.username);
                }
            }
            console.error("Failure regarding username " + user.username + ":");
            console.error(e);
        }
    }
}
let main = new Main();
main.main();
//# sourceMappingURL=app.js.map
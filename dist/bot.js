"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const filters_1 = require("telegraf/filters");
const config_1 = require("./config");
const dialogflow_1 = require("./dialogflow");
const uuid_1 = require("uuid");
const enums_1 = require("./enums");
const bot = new telegraf_1.Telegraf(config_1.BOT_TOKEN);
const sessions = new Map();
const Inlinekeyboard = telegraf_1.Markup.inlineKeyboard([
    telegraf_1.Markup.button.url("❤️", "http://telegraf.js.org"),
    telegraf_1.Markup.button.callback("Test", "test"),
]);
const keyboard = telegraf_1.Markup.keyboard([
    telegraf_1.Markup.button.url("❤️", "http://telegraf.js.org"),
    telegraf_1.Markup.button.callback("Test", "test"),
    telegraf_1.Markup.button.callback("Test2", "test2"),
    telegraf_1.Markup.button.callback("Test3", "test3"),
], { columns: 4 });
bot.start((ctx) => {
    console.log(ctx.from);
    sessions.set(ctx.from.username, (0, uuid_1.v4)());
    ctx.reply("Welcome", Inlinekeyboard);
});
bot.on((0, filters_1.message)("text"), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInput = ctx.message.text;
        console.log(`User input : ${userInput}`);
        let sessionId;
        if (sessions.get(ctx.from.username)) {
            sessionId = sessions.get(ctx.from.username);
        }
        else {
            sessionId = (0, uuid_1.v4)();
            sessions.set(ctx.from.username, sessionId);
        }
        console.log(`Session ID : ${sessionId}`);
        const botmessage = yield (0, dialogflow_1.executeQuery)(userInput, sessionId, enums_1.DlQueryType.Text);
        console.log(botmessage);
        if (botmessage === null || botmessage === void 0 ? void 0 : botmessage.length) {
            for (let message of botmessage) {
                switch (message.type) {
                    case enums_1.TelegramResponseType.Text:
                        ctx.reply(message.message);
                        break;
                    case enums_1.TelegramResponseType.Card:
                        ctx.sendMessage(message.text, message.buttons);
                }
            }
        }
    }
    catch (error) {
        console.log(error);
        ctx.reply("Error occured");
    }
}));
bot.on((0, filters_1.callbackQuery)("data"), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ctx.message);
    const callback = ctx.callbackQuery.data;
    console.log(callback);
}));
exports.default = bot;
//# sourceMappingURL=bot.js.map
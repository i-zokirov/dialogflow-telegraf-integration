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
// const Inlinekeyboard = Markup.inlineKeyboard([
//     Markup.button.url("❤️", "http://telegraf.js.org"),
//     Markup.button.callback("Test", "test"),
// ]);
// const keyboard = Markup.keyboard(
//     [
//         Markup.button.url("❤️", "http://telegraf.js.org"),
//         Markup.button.callback("Test", "test"),
//         Markup.button.callback("Test2", "test2"),
//         Markup.button.callback("Test3", "test3"),
//     ],
//     { columns: 4 }
// );
bot.start((ctx) => {
    console.log(ctx.from);
    sessions.set(ctx.from.username, (0, uuid_1.v4)());
    ctx.reply("Welcome");
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
    var _a, _b, _c;
    const callbackEvent = ctx.callbackQuery.data;
    console.log(`Callback event : ${callbackEvent}`);
    let sessionId;
    if (sessions.get((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.username)) {
        sessionId = sessions.get((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.username);
    }
    else {
        sessionId = (0, uuid_1.v4)();
        sessions.set((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username, sessionId);
    }
    console.log(`Session ID : ${sessionId}`);
    const botmessage = yield (0, dialogflow_1.executeQuery)(callbackEvent, sessionId, enums_1.DlQueryType.Event);
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
}));
exports.default = bot;
//# sourceMappingURL=bot.js.map
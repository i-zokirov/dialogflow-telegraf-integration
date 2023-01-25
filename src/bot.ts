import { Telegraf } from "telegraf";
import { message, callbackQuery } from "telegraf/filters";
import { BOT_TOKEN } from "./config";
import { executeQuery } from "./dialogflow";
import { v4 as uuidv4 } from "uuid";
import { DlQueryType, TelegramResponseType } from "./enums";

const bot = new Telegraf(BOT_TOKEN!);
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
    sessions.set(ctx.from.username, uuidv4());
    ctx.reply("Welcome");
});

bot.on(message("text"), async (ctx) => {
    try {
        const userInput = ctx.message.text;
        console.log(`User input : ${userInput}`);
        let sessionId;

        if (sessions.get(ctx.from.username)) {
            sessionId = sessions.get(ctx.from.username);
        } else {
            sessionId = uuidv4();
            sessions.set(ctx.from.username, sessionId);
        }
        console.log(`Session ID : ${sessionId}`);
        const botmessage = await executeQuery(
            userInput,
            sessionId,
            DlQueryType.Text
        );
        console.log(botmessage);
        if (botmessage?.length) {
            for (let message of botmessage) {
                switch (message.type) {
                    case TelegramResponseType.Text:
                        ctx.reply(message.message);
                        break;
                    case TelegramResponseType.Card:
                        ctx.sendMessage(message.text, message.buttons);
                }
            }
        }
    } catch (error) {
        console.log(error);
        ctx.reply("Error occured");
    }
});

bot.on(callbackQuery("data"), async (ctx) => {
    const callbackEvent = ctx.callbackQuery.data;
    console.log(`Callback event : ${callbackEvent}`);
    let sessionId;

    if (sessions.get(ctx.from?.username)) {
        sessionId = sessions.get(ctx.from?.username);
    } else {
        sessionId = uuidv4();
        sessions.set(ctx.from?.username, sessionId);
    }
    console.log(`Session ID : ${sessionId}`);
    const botmessage = await executeQuery(
        callbackEvent,
        sessionId,
        DlQueryType.Event
    );
    if (botmessage?.length) {
        for (let message of botmessage) {
            switch (message.type) {
                case TelegramResponseType.Text:
                    ctx.reply(message.message);
                    break;
                case TelegramResponseType.Card:
                    ctx.sendMessage(message.text, message.buttons);
            }
        }
    }
});

export default bot;

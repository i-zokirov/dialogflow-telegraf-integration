"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
const telegraf_1 = require("telegraf");
class Parser {
    constructor(messages) {
        this.messages = messages;
    }
    parseText() { }
    parse() {
        var _a, _b, _c, _d, _e, _f;
        this.messages = this.messages.filter((msg) => msg.platform === "TELEGRAM");
        let result = [];
        for (let msg of this.messages) {
            console.log(msg);
            switch (msg.message) {
                case enums_1.TelegramResponseType.Text:
                    (_b = (_a = msg.text) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.forEach((txt) => result.push({
                        type: enums_1.TelegramResponseType.Text,
                        message: txt,
                    }));
                    break;
                case enums_1.TelegramResponseType.Card:
                    let buttons = [];
                    if ((_d = (_c = msg.card) === null || _c === void 0 ? void 0 : _c.buttons) === null || _d === void 0 ? void 0 : _d.length) {
                        for (let btn of msg.card.buttons) {
                            if (btn.text && btn.postback)
                                buttons.push(telegraf_1.Markup.button.callback(btn.text, btn.postback, false));
                        }
                    }
                    const inlineKeyboard = telegraf_1.Markup.inlineKeyboard(buttons);
                    const response = {
                        type: enums_1.TelegramResponseType.Card,
                        text: (_e = msg.card) === null || _e === void 0 ? void 0 : _e.title,
                        image: (_f = msg.card) === null || _f === void 0 ? void 0 : _f.imageUri,
                        buttons: inlineKeyboard,
                    };
                    result.push(response);
                    break;
            }
        }
        return result;
    }
}
exports.default = Parser;
//# sourceMappingURL=Parser.js.map
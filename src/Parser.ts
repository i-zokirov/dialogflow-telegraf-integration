import * as protos from "@google-cloud/dialogflow/build/protos/protos";
import { TelegramResponseType } from "./enums";
import { FulfillmentMessage } from "./interfaces";
import { Markup } from "telegraf";
import * as telegrafTypes from "telegraf/types";
class Parser {
    constructor(public messages: FulfillmentMessage[]) {}

    parseText() {}
    parse() {
        this.messages = this.messages.filter(
            (msg) => msg.platform === "TELEGRAM"
        );
        let result: any[] = [];
        for (let msg of this.messages) {
            console.log(msg);
            switch (msg.message) {
                case TelegramResponseType.Text:
                    msg.text?.text?.forEach((txt) =>
                        result.push({
                            type: TelegramResponseType.Text,
                            message: txt,
                        })
                    );
                    break;
                case TelegramResponseType.Card:
                    let buttons = [];
                    if (msg.card?.buttons?.length) {
                        for (let btn of msg.card.buttons) {
                            if (btn.text && btn.postback)
                                buttons.push(
                                    Markup.button.callback(
                                        btn.text,
                                        btn.postback,
                                        false
                                    )
                                );
                        }
                    }

                    const inlineKeyboard = Markup.inlineKeyboard(buttons);
                    const response = {
                        type: TelegramResponseType.Card,
                        text: msg.card?.title,
                        image: msg.card?.imageUri,
                        buttons: inlineKeyboard,
                    };
                    result.push(response);
                    break;
            }
        }
        return result;
    }
}

export default Parser;

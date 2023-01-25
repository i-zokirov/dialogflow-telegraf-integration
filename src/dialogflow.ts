import dialogflow from "@google-cloud/dialogflow";
import * as protos from "@google-cloud/dialogflow/build/protos/protos";
import { dl_projectId, dl_languageCode, dl_agentId } from "./config";
import { JsonObject, struct } from "pb-util/build";
import { DlQueryType } from "./enums";
import Parser from "./Parser";
import { FulfillmentMessage } from "./interfaces";

const client = new dialogflow.SessionsClient();

const detecIntent = async (sessionId: string, query: string, contexts: any) => {
    // The path to identify the agent that owns the created intent.

    const sessionPath = client.projectAgentSessionPath(
        dl_projectId!,
        sessionId
    );

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: dl_languageCode,
            },
        },
        queryParams: {
            contexts: [],
        },
    };

    if (contexts && contexts.length > 0) {
        request.queryParams = {
            contexts: contexts,
        };
    }

    const responses = await client.detectIntent(request);
    return responses[0];
};

export const executeQuery = async (
    query: string,
    sessionId: string,
    type: DlQueryType
) => {
    try {
        let context: any[] | null | undefined = [];

        let intentResponse = await detecIntent(sessionId, query, context);
        switch (type) {
            case DlQueryType.Text:
                intentResponse = await detecIntent(sessionId, query, context);
                break;
            case DlQueryType.Event:
                break;
        }
        context = intentResponse.queryResult?.outputContexts;
        let messages: FulfillmentMessage[];

        if (intentResponse.queryResult!.fulfillmentMessages) {
            messages = intentResponse.queryResult!.fulfillmentMessages?.filter(
                (msg) => msg.platform === "TELEGRAM"
            );
            const parser = new Parser(messages);
            const botmessage = parser.parse();
            return botmessage;
        }
    } catch (error) {
        console.log(error);
    }
};

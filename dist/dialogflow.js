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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = void 0;
const dialogflow_1 = __importDefault(require("@google-cloud/dialogflow"));
const config_1 = require("./config");
const enums_1 = require("./enums");
const Parser_1 = __importDefault(require("./Parser"));
const client = new dialogflow_1.default.SessionsClient();
const detecIntent = (sessionId, query, contexts) => __awaiter(void 0, void 0, void 0, function* () {
    // The path to identify the agent that owns the created intent.
    const sessionPath = client.projectAgentSessionPath(config_1.dl_projectId, sessionId);
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: config_1.dl_languageCode,
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
    const responses = yield client.detectIntent(request);
    return responses[0];
});
const executeQuery = (query, sessionId, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let context = [];
        let intentResponse = yield detecIntent(sessionId, query, context);
        switch (type) {
            case enums_1.DlQueryType.Text:
                intentResponse = yield detecIntent(sessionId, query, context);
                break;
            case enums_1.DlQueryType.Event:
                break;
        }
        context = (_a = intentResponse.queryResult) === null || _a === void 0 ? void 0 : _a.outputContexts;
        let messages;
        if (intentResponse.queryResult.fulfillmentMessages) {
            messages = (_b = intentResponse.queryResult.fulfillmentMessages) === null || _b === void 0 ? void 0 : _b.filter((msg) => msg.platform === "TELEGRAM");
            const parser = new Parser_1.default(messages);
            const botmessage = parser.parse();
            return botmessage;
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.executeQuery = executeQuery;
//# sourceMappingURL=dialogflow.js.map
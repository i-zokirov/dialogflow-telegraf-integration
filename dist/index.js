"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bot_1 = __importDefault(require("./bot"));
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./src/keys/dialogflow.json";
const app = (0, express_1.default)();
bot_1.default.launch();
// Enable graceful stop
process.once("SIGINT", () => bot_1.default.stop("SIGINT"));
process.once("SIGTERM", () => bot_1.default.stop("SIGTERM"));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port", port));
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dl_agentId = exports.dl_languageCode = exports.dl_projectId = exports.BOT_TOKEN = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production")
    dotenv_1.default.config();
exports.BOT_TOKEN = process.env.BOT_TOKEN;
exports.dl_projectId = process.env.dl_project_id;
exports.dl_languageCode = process.env.dl_lang_code;
exports.dl_agentId = process.env.dl_agent_id;
//# sourceMappingURL=config.js.map
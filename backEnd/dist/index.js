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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./util/app");
const databaseConnection_1 = __importDefault(require("./config/databaseConnection"));
const envConfig_1 = require("./config/envConfig");
const PORT = envConfig_1.envConfig.http.PORT;
const HOST = envConfig_1.envConfig.http.HOST;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, databaseConnection_1.default)();
        app_1.server.listen(PORT, () => {
            console.log(`Server is running at http://${HOST}:${PORT}`);
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            console.log(`Failed to connect to database: ${error.message}`);
        }
        process.exit(1);
    }
}))();
exports.default = app_1.server;

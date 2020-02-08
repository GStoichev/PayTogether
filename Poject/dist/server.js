"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var bodyParser = __importStar(require("body-parser"));
var logger_1 = __importDefault(require("./api/middleware/logger"));
var home_controller_1 = __importDefault(require("./api/controllers/home.controller"));
var user_controller_1 = __importDefault(require("./api/controllers/user.controller"));
var login_controller_1 = __importDefault(require("./api/controllers/login.controller"));
var friends_controller_1 = __importDefault(require("./api/controllers/friends.controller"));
var app = new app_1.default({
    port: 8000,
    controllers: [
        new home_controller_1.default(),
        new user_controller_1.default(),
        new login_controller_1.default(),
        new friends_controller_1.default()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        logger_1.default
    ]
});
app.listen();

"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var user_repository_1 = require("../repositories/user.repository");
var HomeController = /** @class */ (function () {
    function HomeController() {
        this.path = '/home';
        this.router = express.Router();
        this.userProfile = function (req, res) {
            var repo = new user_repository_1.UserRepository();
            repo.readById(req.body.id).then(function (result) {
                console.log(result);
                var usersToJson = JSON.parse(JSON.stringify(result));
                res.render('user/user', { usersToJson: usersToJson });
            });
        };
        this.initRoutes();
    }
    HomeController.prototype.initRoutes = function () {
        this.router.post("" + this.path, this.userProfile);
        //this.router.post('/register', this.register);
        //this.router.post(`/login`, this.login);
    };
    return HomeController;
}());
exports.default = HomeController;

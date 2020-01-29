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
var UserController = /** @class */ (function () {
    function UserController() {
        this.path = '/user';
        this.router = express.Router();
        this.userProfile = function (req, res) {
            var repo = new user_repository_1.UserRepository();
            repo.readById(req.params.id).then(function (user) {
                res.render('user/user', { user: user, err: "" });
            }).catch(function (err) {
                res.send({ err: err });
            });
        };
        this.initRoutes();
    }
    UserController.prototype.initRoutes = function () {
        this.router.get(this.path + "=:id", this.userProfile);
    };
    return UserController;
}());
exports.default = UserController;

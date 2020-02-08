"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var user_model_1 = require("../models/user.model");
var v4_1 = __importDefault(require("uuid/v4"));
var user_repository_1 = require("../repositories/user.repository");
var LoginController = /** @class */ (function () {
    function LoginController() {
        this.path = '/';
        this.router = express.Router();
        this.index = function (req, res) {
            res.render('login/index', { err: "" });
        };
        this.register = function (req, res) {
            var name = req.body.name;
            var password = req.body.password;
            var email = req.body.email;
            var userRepo = new user_repository_1.UserRepository();
            var user = new user_model_1.User(v4_1.default(), name, email);
            user.password = password;
            userRepo.isExisting(name).then(function (isExisting) {
                if (isExisting) {
                    res.render('login/index', { err: "register" });
                    return;
                }
                userRepo.create(user).then(function (user) {
                    res.render('home/home', { user: user });
                });
            });
        };
        this.login = function (req, res) {
            var name = req.body.name;
            var password = req.body.password;
            var userRepo = new user_repository_1.UserRepository();
            userRepo.login(name, password).then(function (user) {
                res.render('home/home', { user: user });
            }).catch(function (err) {
                res.render('login/index', { err: err });
            });
        };
        this.initRoutes();
    }
    LoginController.prototype.initRoutes = function () {
        this.router.get(this.path, this.index);
        this.router.post(this.path + "register", this.register);
        this.router.post(this.path + "login", this.login);
    };
    return LoginController;
}());
exports.default = LoginController;

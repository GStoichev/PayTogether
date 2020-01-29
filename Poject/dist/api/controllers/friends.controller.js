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
var FriendsController = /** @class */ (function () {
    function FriendsController() {
        this.path = '/friends';
        this.router = express.Router();
        this.showAllFriends = function (req, res) {
            var id = req.params.id;
            var userRepo = new user_repository_1.UserRepository();
            console.log("showAllFriends");
            userRepo.getAllFriends(id).then(function (friends) {
                res.render('user/friends', { friends: friends, userId: id });
            }).catch(function (err) {
                res.render('user/friends', { friends: [], err: err, userId: id });
                //res.render("user/user", {err: err});
            });
        };
        this.addFriend = function (req, res) {
            var id = req.body.id;
            var otherId = req.body.other_id;
            console.log("id " + id + " | otherId " + otherId);
            var userRepo = new user_repository_1.UserRepository();
            userRepo.addFriend(id, otherId).then(function (friend) {
                if (friend) {
                    res.send({ new_friend: friend });
                }
                else {
                    console.log("Should not happen");
                    res.send();
                }
            }).catch(function (err) {
                console.log("sadasfa" + err);
                res.send(err);
            });
        };
        this.initRoutes();
    }
    FriendsController.prototype.initRoutes = function () {
        this.router.get(this.path + "/:id", this.showAllFriends);
        this.router.post(this.path + "/add", this.addFriend);
    };
    return FriendsController;
}());
exports.default = FriendsController;

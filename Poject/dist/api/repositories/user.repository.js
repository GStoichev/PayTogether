"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = require("../models/user.model");
var sqlite3_1 = __importDefault(require("sqlite3"));
var crudOperations_1 = require("../../crudOperations");
var UserRepository = /** @class */ (function () {
    function UserRepository() {
        this.db = new sqlite3_1.default.Database('payTogether.db');
    }
    UserRepository.prototype.read = function () {
        return crudOperations_1.getTableData("users", function (err, rows) {
            var users = rows.map(function (row) {
                var id = row.id;
                var name = row.name;
                var email = row.email;
                var user = new user_model_1.User(id, name, email);
                return user;
            });
            return users;
        });
    };
    UserRepository.prototype.readById = function (id) {
        return crudOperations_1.getTableDataById("users", id, function (err, row) {
            var id = row.id;
            var name = row.name;
            var email = row.email;
            var user = new user_model_1.User(id, name, email);
            return user;
        });
    };
    UserRepository.prototype.create = function (user) {
        var tableName = "users";
        var columNames = ["id", "name", "password", "email"];
        var columValues = [user.id, user.name, user.password, user.email];
        return crudOperations_1.insertInTable(tableName, columNames, columValues, function (err, row) {
            var id = row.id;
            var name = row.name;
            var email = row.email;
            var user = new user_model_1.User(id, name, email);
            return user;
        });
    };
    UserRepository.prototype.update = function (user) {
        var tableName = 'users';
        var id = user.id;
        var columNames = ["name", "password", "email"];
        var columValues = [user.name, user.password, user.email];
        return crudOperations_1.updateRecordInTable(tableName, id, columNames, columValues, function (err, row) {
            var id = row.id;
            var name = row.name;
            var email = row.email;
            var user = new user_model_1.User(id, name, email);
            return user;
        });
    };
    UserRepository.prototype.delete = function (user) {
        var tableName = "users";
        var id = user.id;
        return crudOperations_1.deleteTableRow(tableName, id, function (err) {
            return user;
        });
    };
    UserRepository.prototype.isExisting = function (name) {
        var _this = this;
        var tableName = 'users';
        var query = "SELECT * FROM " + tableName + " WHERE name = \"" + name + "\"";
        return new Promise(function (resolve, rejects) {
            _this.db.get(query, function (err, row) {
                row === undefined ? resolve(false) : resolve(true);
            });
        });
    };
    UserRepository.prototype.login = function (name, password) {
        var _this = this;
        var tableName = 'users';
        var query = "SELECT * FROM " + tableName + " WHERE name = \"" + name + "\" and password = \"" + password + "\"";
        return new Promise(function (resolve, reject) {
            _this.db.get(query, function (err, row) {
                if (row === undefined) {
                    reject("You don't have account. Please register.");
                    return;
                }
                var id = row.id;
                var name = row.name;
                var email = row.email;
                var user = new user_model_1.User(id, name, email);
                resolve(user);
            });
        });
    };
    UserRepository.prototype.getAllFriends = function (id) {
        var _this = this;
        var tableName = "friends";
        var query = "SELECT * FROM " + tableName + " WHERE my_id = \"" + id + " OR other_id = \"" + id + "\"\"";
        return new Promise(function (resolve, rejects) {
            new Promise(function (resolve, rejects) {
                _this.db.all(query, function (err, rows) {
                    if (rows === undefined) {
                        rejects("You don't have friends");
                        return;
                    }
                    var friendIds = rows.map(function (row) {
                        var otherId = row.other_id;
                        var myId = row.my_id;
                        if (myId == id) {
                            return otherId;
                        }
                        return myId;
                    });
                    if (friendIds.length) {
                        resolve(friendIds);
                        return;
                    }
                    rejects("You don't have friends");
                });
            }).then(function (friendIds) {
                var users = Array();
                for (var _i = 0, _a = friendIds; _i < _a.length; _i++) {
                    var friendId = _a[_i];
                    _this.readById(friendId).then(function (user) {
                        users.push(user);
                    });
                }
                resolve(users);
            }).catch(function (err) {
                rejects(err);
            });
        });
    };
    UserRepository.prototype.addFriend = function (id, other_id) {
        var _this = this;
        var tableName = "friends";
        console.log("addFriend");
        return new Promise(function (resolve, reject) {
            _this.readById(id).then(function (user) {
                console.log("first");
                console.log(other_id);
                _this.readById(other_id).then(function (user) {
                    console.log("second");
                    _this.areWeFriends(id, other_id).then(function (areWeFriends) {
                        if (areWeFriends) {
                            reject("We are already friends");
                            return;
                        }
                        console.log("table name : " + tableName);
                        crudOperations_1.insertInTableNoResponse(tableName, ["my_id", "other_id"], [, id, other_id], function (err) {
                            console.log("insert");
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(user);
                        });
                    });
                }).catch(function (err) {
                    reject(err);
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    UserRepository.prototype.areWeFriends = function (id, other_id) {
        var _this = this;
        var tableName = "friends";
        var query = "SELECT * FROM " + tableName + " WHERE my_id = " + id + " AND other_id = " + other_id + " OR my_id = " + other_id + " AND other_id = " + id;
        return new Promise(function (resolve, reject) {
            _this.db.get(query, function (err, row) {
                row === undefined ? resolve(false) : resolve(true);
            });
        });
    };
    return UserRepository;
}());
exports.UserRepository = UserRepository;

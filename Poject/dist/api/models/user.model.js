"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(id, name, email) {
        this.id_ = "";
        this.name_ = "";
        this.email_ = "";
        this.password_ = "";
        if (id) {
            this.id_ = id;
        }
        if (name) {
            this.name_ = name;
        }
        if (email) {
            this.email_ = email;
        }
    }
    Object.defineProperty(User.prototype, "id", {
        get: function () {
            return this.id_;
        },
        set: function (id) {
            this.id_ = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "name", {
        get: function () {
            return this.name_;
        },
        set: function (name) {
            this.name_ = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "email", {
        get: function () {
            return this.email_;
        },
        set: function (email) {
            this.email_ = email;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "password", {
        get: function () {
            return this.password_;
        },
        set: function (password) {
            this.password_ = password;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}());
exports.User = User;

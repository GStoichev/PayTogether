"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var v4_1 = __importDefault(require("uuid/v4"));
var sqlite3_1 = __importDefault(require("sqlite3"));
var body_parser_1 = __importDefault(require("body-parser"));
var db = new sqlite3_1.default.Database('testDatabase.db');
var app = express_1.default();
//app.use(bodyParser.json);
// support parsing of application/json type post data
app.use(body_parser_1.default.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(body_parser_1.default.urlencoded({ extended: true }));
//get users
app.get('/table=:tableName', function (req, res) {
    var tableName = req.param('tableName');
    db.all('SELECT * FROM ' + tableName, function (err, rows) {
        var tableData = rows.map(function (row) { return JSON.stringify(row); });
        res.send(JSON.parse(JSON.stringify(tableData)));
    });
});
app.get('/table=:tableName/:id', function (req, res) {
    var tableName = req.param('tableName');
    var id = req.param('id');
    var query = "SELECT * FROM " + tableName + " WHERE id =\"" + id + "\"";
    db.all(query, function (err, rows) {
        var tableData = rows.map(function (row) { return JSON.stringify(row); });
        res.send(JSON.parse(JSON.stringify(tableData)));
    });
});
app.post('/table=:tableName', function (req, res) {
    var tableName = req.param('tableName');
    var name = req.body.name;
    //find a way to fix that
    //columes shoudn't be hardcoded
    var query = "INSERT INTO " + tableName + " (id,name) VALUES(\"" + v4_1.default() + "\",\"" + name + "\")";
    db.run(query, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("data inserted in table " + tableName);
        }
    });
    res.sendStatus(200);
});
app.delete('/table=:tableName', function (req, res) {
    var tableName = req.param('tableName');
    var query = "DELETE FROM " + tableName;
    db.run(query, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("deleted in table " + tableName);
        }
    });
    res.sendStatus(200);
});
app.delete('/table=:tableName/:id', function (req, res) {
    var tableName = req.param('tableName');
    var id = req.param('id');
    console.log(id);
    var query = "DELETE FROM " + tableName + " WHERE id=\"" + id + "\"";
    db.run(query, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("data deleted in table " + tableName);
        }
    });
    res.sendStatus(200);
});
//app.put(`/table=:tableName`);
app.listen(8000, function () { console.log('Server is running'); });

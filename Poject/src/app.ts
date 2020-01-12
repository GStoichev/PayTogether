import express, { Application, Response, Request, NextFunction, RequestHandler } from 'express';
import uuid from 'uuid/v4';
import sqlite from 'sqlite3';

let db = new sqlite.Database('testDatabase.db');

// db.serialize(function () {
//     db.run('CREATE TABLE users (id TEXT, name TEXT)')
//     let id = uuid();
//     var stmt = db.prepare('INSERT INTO users VALUES ("' + id.toString() + '","ivan")');

//     stmt.run();

//     stmt.finalize();
// })

// db.close()
////////////
interface User {
    id: string,
    name: string,
}
let user1: User = { id: uuid(), name: "test name 1" };
let user2: User = { id: uuid(), name: "test name 2" };
let user3: User = { id: uuid(), name: "test name 3" };
let user4: User = { id: uuid(), name: "test name 4" };

let users = [user1, user2, user3, user4]
const app = express();

app.get('/users', (req, res) => {
    let promise = new Promise((resolve, reject) => {

    })
    db.all('SELECT * FROM users', function (err, rows) {
        let testString = rows.map((row) => {return row.id + ': ' + row.name});
    
        res.send(JSON.parse(JSON.stringify(testString)));
    });
});

app.get('/users/:id', (req, res) => {
    let id = req.param('id');
    let responseValue = "";
    users.find((user: User) => {
        if (user.id == id) {
            responseValue += JSON.stringify(user);
        }
    });
    res.send(JSON.parse(responseValue));
});


app.listen(8000, () => { console.log('Server is running') });
import { IReposotory } from "../interfaces/IRepository.interface";
import { User } from "../models/user.model";
import uuid from 'uuid/v4';
import sqlite from 'sqlite3';
import { resolve } from "dns";
import { rejects } from "assert";
import { getTableData, getTableDataById, insertInTable, deleteTableRow, updateRecordInTable, insertInTableWithAutoIncrement } from "../../crudOperations";
import { read } from "fs";
import { isPrimitive } from "util";



export class UserRepository implements IReposotory<User,string> {

    private db = new sqlite.Database('payTogether.db');

    constructor() {

    }

    public read(): Promise<Array<User>> {

    return getTableData(`users`, function (err, rows) {
        if(rows === undefined) {
            return [];
        }
            let users: Array<User> = rows.map((row) => {
                let id = row.id;
                let name = row.name;
                let email = row.email;

                let user = new User(id, name, email);

                return user;
            });
            return users;  
        }); 
    }

    public readById(id: string): Promise<User> {
        return getTableDataById(`users`,id, function(err, row) {
            if(err)
            {
               throw err;
            }
                if(row === undefined) {
                    return null;
                }
                let id = row.id;
                let name = row.name;
                let email = row.email;

                let user = new User(id,name,email);
            return user;
        });
    }

    public create(user: User): Promise<User> {
            let tableName = `users`;

            let columNames = ["id", "name", "password", "email"];
            let columValues = [user.id, user.name, user.password, user.email];
            
            return insertInTable(tableName,columNames, columValues, function(err, row) {
                let id = row.id;
                let name = row.name;
                let email = row.email;

                let user = new User(id,name,email);
                return user;
             });
            
    }

    public update(user: User): Promise<User> {
        let tableName = 'users';
        let id = user.id;

        let columNames = ["name", "password", "email"];
        let columValues = [user.name, user.password, user.email];

        return updateRecordInTable(tableName, id, columNames, columValues, function(err,row) {
            let id = row.id;
            let name = row.name;
            let email = row.email;

            let user = new User(id,name,email);
            return user;
        });
    }

    public delete(user: User): Promise<User> {
        let tableName = `users`;
        let id = user.id;
        
        return deleteTableRow(tableName,id, function(err) {
            return user;
        });
    }

    public isExisting(name: string): Promise<boolean> {
        let tableName = 'users';

        let query = `SELECT * FROM ${tableName} WHERE name = "${name}"`;
        return new Promise((resolve,rejects) => {
            this.db.get(query, (err: any,row: any) => {
                row === undefined ? resolve(false): resolve(true); 
            });
        });
    }

    public login(name: string, password: string): Promise<User> {
        let tableName = 'users';

        let query = `SELECT * FROM ${tableName} WHERE name = "${name}" and password = "${password}"`;
        return new Promise((resolve,reject) => {
            this.db.get(query,(err: any, row: any) => {
                if(row === undefined)
                {
                    reject("You don't have account. Please register.");
                    return;
                }

                let id = row.id;
                let name = row.name;
                let email = row.email;
    
                let user = new User(id,name,email);
                resolve(user);
            });
        });
    }

    public getAllFriends(id: string): Promise<Array<User>> {
        let tableName = "friends";

        let query = `SELECT * FROM ${tableName} WHERE my_id = "${id}" OR other_id = "${id}"`;
        return new Promise((resolve,rejects) => {
        new Promise((resolve,rejects) => {
            this.db.all(query, function (err, rows) {
                if(rows === undefined) {
                    rejects("You don't have friends");
                    return;
                }
                let friendIds: Array<string> = rows.map((row) => {
                    let otherId = row.other_id;
                    let myId = row.my_id;
                    if(myId == id)
                    {
                        return otherId;
                    }

                    return myId;
                });

                if(friendIds.length)
                {
                    resolve(friendIds);  
                    return;
                }
                 rejects("You don't have friends");
            }); 
        }).then((friendIds) => {          
                let users: Array<User> = Array<User>();
                let requests = (friendIds as string[]).reduce((promiseChain, friendId) => {
                    return promiseChain.then(() => new Promise((resolve) => {
                        this.readById(friendId).then((user) => {
                            users.push(user);
                            resolve();
                        }).catch((err) => {
                            rejects(err);
                        });
                    }));
                }, Promise.resolve());

                requests.then(() => {
                    resolve(users);
                }).catch((err) => {
                    rejects(err);
                });
        }).catch((err) => {
            rejects(err);
        }); 
       
        });
         
    }

    public addFriend(id: string, other_id: string): Promise<User> {
        let tableName = "friends";
        return new Promise((resolve, reject) => {
            this.readById(id).then((userOne) => {
                if(!userOne) {
                    reject("user dosn't exist");
                }
                this.readById(other_id).then((user) => {
                    if(!user) {
                        reject("user dosn't exist");
                    }
                    this.areWeFriends(id, other_id).then((areWeFriends) => {
                        if(areWeFriends) {
                            reject("We are already friends");
                            return;
                        }
                        insertInTableWithAutoIncrement(tableName, ["my_id","other_id"],[,id,other_id],(err) => {
                            if(err)
                            {
                                reject(err);
                                return
                            }
                            resolve(user);
                        }).catch((err: any) => {
                            reject(err);
                        });
                    });
                }).catch((err) => {
                    reject(err);
                });

            }).catch((err) => {
                reject(err);
            });
        });   
    }

    public areWeFriends(id: string, other_id: string): Promise<boolean> {
        let tableName = `friends`;

        let query = `SELECT * FROM ${tableName} WHERE (my_id = "${id}" AND other_id = "${other_id}") OR (my_id = "${other_id}" AND other_id = "${id}")`;
        return new Promise((resolve, reject) => {
            this.db.get(query,(err,row) => {
                if(err)
                {
                    reject(err);
                    return;
                }
                row === undefined ? resolve(false): resolve(true); 
            });
        });
    }

    public getFriendshipID(id: string, other_id: string): Promise<number> {
        let tableName = `friends`;

        let query = `SELECT * FROM ${tableName} WHERE (my_id = "${id}" AND other_id = "${other_id}") OR (my_id = "${other_id}" AND other_id = "${id}")`;
        return new Promise((resolve, reject) => {
            this.db.get(query,(err,row) => {
                if(err)
                {
                    reject(err);
                    return;
                }

                row === undefined ? reject("users are not friends") : resolve(row.id); 
            });
        });
    }
}
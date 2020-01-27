import { IReposotory } from "../interfaces/IRepository.interface";
import { User } from "../models/user.model";
import uuid from 'uuid/v4';
import sqlite from 'sqlite3';
import { resolve } from "dns";
import { rejects } from "assert";
import { getTableData, getTableDataById, insertInTable, deleteTableRow, updateRecordInTable } from "../../crudOperations";



export class UserRepository implements IReposotory<User,string> {

    private db = new sqlite.Database('payTogether.db');

    constructor() {

    }

    public read(): Promise<Array<User>> {

    return getTableData(`users`, function (err, rows) {
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

 }
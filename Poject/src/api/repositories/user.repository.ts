import { IReposotory } from "../interfaces/IRepository.interface";
import { User } from "../models/user.model";
import uuid from 'uuid/v4';
import sqlite from 'sqlite3';
import { resolve } from "dns";
import { rejects } from "assert";
import { getTableData, getTableDataById, insertInTable } from "../../crudOperations";



export class UserRepository implements IReposotory<User,string> {

    private db = new sqlite.Database('testDatabase.db');

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
        return new Promise((resolve, rejects) => {
            let tableName = `users`;

            let columNames = ["id", "name", "email"];
            let columValues = [user.id,user.name, user.email];
            

            return insertInTable(tableName,columNames, columValues, function(err, row) {
                let id = row.id;
                let name = row.name;
                let email = row.email;

                let user = new User(id,name,email);
            return user;
            });


            // let query = `INSERT INTO ${tableName} (${columNamesAsString}) VALUES(${valuesAsString})`;
            // this.db.run(query,(err) => {
            //     if(err)
            //     {
            //         console.log(err);
            //     } else {
            //         console.log(`data inserted in table ${tableName}`);
            //         resolve();
            //     }
            // });
        });
    }

    public update(user: User): Promise<User> {
        return {} as any;
    }

    public delete(user: User): Promise<User> {
        return {} as any;
    }
}
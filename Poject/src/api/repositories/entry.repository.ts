import { IReposotory } from "../interfaces/IRepository.interface";
import { Entry } from "../models/entry.model";
import sqlite from 'sqlite3';
import { getTableData, getTableDataById, insertInTable, deleteTableRow, updateRecordInTable, insertInTableNoResponse } from "../../crudOperations";


export class EntryRepository implements IReposotory<Entry,number> {

    private db = new sqlite.Database('payTogether.db');
    private entryTableName = `entry`;

    constructor() {

    }

    public read(): Promise<Array<Entry>> {

    return getTableData(this.entryTableName, function (err, rows) {
        if(rows === undefined) {
            return [];
        }
            let entries: Array<Entry> = rows.map((row) => {
                let id = row.id;
                let name = row.name;
                let desc = row.desc;
                let date = new Date(row.date);

                let entry = new Entry(id, name, desc, date);

                return entry;
            });
            return entries;  
        }); 
    }

     public readById(id: number): Promise<Entry> {
        return getTableDataById(this.entryTableName, id, function(err, row) {
            if(row === undefined) {
                return [];
            }
            let id = row.id;
            let name = row.name;
            let desc = row.desc;
            let date = new Date(row.date);

            let entry = new Entry(id, name, desc, date);

            return entry;
        });
    }

     public create(entry: Entry): Promise<Entry> {
            let columNames = ["id", "name", "desc", "date"];
            let columValues = [entry.id, entry.name, entry.desc, entry.date.toString()];
            
            return insertInTable(this.entryTableName, columNames, columValues, function(err, row) {
                if(row === undefined) {
                    return [];
                }
                let id = row.id;
                let name = row.name;
                let desc = row.desc;
                let date = new Date(row.date);
    
                let entry = new Entry(id, name, desc, date);
    
                return entry;
             });
     }

    public update(user: Entry): Promise<Entry> {
//         let tableName = 'users';
//         let id = user.id;

//         let columNames = ["name", "password", "email"];
//         let columValues = [user.name, user.password, user.email];

         //return updateRecordInTable(tableName, id, columNames, columValues, function(err,row) {
//             let id = row.id;
//             let name = row.name;
//             let email = row.email;

//             let user = new User(id,name,email);
//             return user;
//         });
            return user as any;
     }

     public delete(user: Entry): Promise<Entry> {
//         let tableName = `users`;
//         let id = user.id;
        
//         return deleteTableRow(tableName,id, function(err) {
//             return user;
//         });
        return user as any;
     }

}
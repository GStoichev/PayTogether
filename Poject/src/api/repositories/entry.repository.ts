import { IReposotory } from "../interfaces/IRepository.interface";
import { Entry, Participant } from "../models/entry.model";
import sqlite from 'sqlite3';
import { getTableData, getTableDataById, insertInTable, deleteTableRow, updateRecordInTable, insertInTableWithAutoIncrement } from "../../crudOperations";
import { resolve } from "dns";
import { rejects } from "assert";

interface EntryParticipant {
    friends_pair_id: number,
    money: number
}

export class EntryRepository implements IReposotory<Entry,number> {

    private db = new sqlite.Database('payTogether.db');
    private entryTableName = `entry`;
    private participantsTableName = 'participants';
    private friendsTableName = 'friends';

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
            let columNames = ["name", "desc", "date"];
            let columValues = [entry.name, entry.desc, entry.date.toString()];
            return insertInTableWithAutoIncrement(this.entryTableName, columNames, columValues, function(err, row) {
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

    public update(entry: Entry): Promise<Entry> {
        let columNames = ["name", "desc", "date"];
        let columValues = [entry.name, entry.desc, entry.date.toString()];

         return updateRecordInTable(this.entryTableName, entry.id, columNames, columValues, function(err,row) {
            if(err) {
                return [];
            }
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

     public delete(entry: Entry): Promise<Entry> {
        let id = entry.id;
        
        return deleteTableRow(this.entryTableName,id, function(err) {
            return entry;
        });
     }

    public getParticipants(entry: Entry) {
        let entryId = entry.id;

        let query = `SELECT * FROM ${this.participantsTableName} WHERE entry_id = "${entryId}"`;
        return new Promise((resolve, reject) => {
            new Promise((resolve, reject) => {
                this.db.all(query,(err,rows) => {
                    if(err) {
                        reject(err);
                        return;
                    }
    
                    if(rows == undefined) {
                        resolve([]);
                        return;
                    }

                    let entryParticipants: Array<EntryParticipant> = rows.map((row) => {                
                        let entryParticipant: EntryParticipant = {
                            friends_pair_id: row.friends_pair_id,
                            money: row.money
                        }
                        return entryParticipant;
                    });
                    resolve(entryParticipants);
                });
            }).then((entryParticipants) => {
                let resultParticipants: Array<Participant> = Array<Participant>();
                let requests = (entryParticipants as EntryParticipant[]).reduce((promiseChain, entryParticipant) => {
                    let query = `SELECT * FROM ${this.friendsTableName} WHERE (id = "${entryParticipant.friends_pair_id}")`;

                    return promiseChain.then(() => new Promise((resolve) => {
                        this.db.get(query,(err,row) => {
                            if(err) {
                                reject(err);
                                return;
                            }
            
                            if(row === undefined) {
                                resolve();
                                return;
                            }
                            let participant: Participant = {
                                fr_1_id: row.my_id,
                                fr_2_id: row.other_id,
                                money: entryParticipant.money
                            }
                            //return some participant struct?
                            resolve(participant);
                        });
                    }).then((participant) => {
                        resultParticipants.push((participant as Participant));
                        }).catch((err) => {
                            rejects(err);
                        }));
                }, Promise.resolve()); 

                requests.then(() => {
                    resolve(resultParticipants);
                }).catch((err) => {
                    rejects(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });    
    }
}
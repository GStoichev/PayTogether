import { IReposotory } from "../interfaces/IRepository.interface";
import { Entity, Participant, EntityWithParticipants } from "../models/entity.model";
import sqlite from 'sqlite3';
import { getTableData, getTableDataById, insertInTable, deleteTableRow, updateRecordInTable, insertInTableWithAutoIncrement } from "../../crudOperations";
import { resolve } from "dns";
import { rejects } from "assert";
import { UserRepository } from "./user.repository";

export class EntityRepository implements IReposotory<Entity,number> {

    private db = new sqlite.Database('payTogether.db');
    private entityTableName = `entity`;
    private participantsTableName = 'participants';
    private friendsTableName = 'friends';

    constructor() {

    }

    public read(): Promise<Array<Entity>> {

    return getTableData(this.entityTableName, function (err, rows) {
        if(rows === undefined) {
            return [];
        }
            let entities: Array<Entity> = rows.map((row) => {
                
                let id = row.id;
                let name = row.name;
                let desc = row.desc;
                let date = new Date(row.date);

                let entity = new Entity(id, name, desc, date);

                return entity;
            });
            return entities;  
        }); 
    }

     public readById(id: number): Promise<Entity> {
        return getTableDataById(this.entityTableName, id, function(err, row) {
            if(row === undefined) {
                return [];
            }
            let id = row.id;
            let name = row.name;
            let desc = row.desc;
            let date = new Date(row.date);

            let entity = new Entity(id, name, desc, date);

            return entity;
        });
    }

     public create(entity: Entity): Promise<Entity> {
            let columNames = ["name", "desc", "date"];
            let columValues = [entity.name, entity.desc, entity.date.toString()];
            return insertInTableWithAutoIncrement(this.entityTableName, columNames, columValues, function(err, row) {
                if(row === undefined) {
                    return [];
                }
                let id = row.id;
                let name = row.name;
                let desc = row.desc;
                let date = new Date(row.date);
    
                let entity = new Entity(id, name, desc, date);
    
                return entity;
             });
     }

    public update(entity: Entity): Promise<Entity> {
        let columNames = ["name", "desc", "date"];
        let columValues = [entity.name, entity.desc, entity.date.toString()];

         return updateRecordInTable(this.entityTableName, entity.id, columNames, columValues, function(err,row) {
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

            let entity = new Entity(id, name, desc, date);

            return entity;
        });
     }

     public delete(entity: Entity): Promise<Entity> {
        let id = entity.id;
        
        return deleteTableRow(this.entityTableName,id, function(err) {
            return entity;
        });
     }

    public getParticipants(entity: Entity): Promise<Participant[]> {
        let entityId = entity.id;

        let query = `SELECT * FROM ${this.participantsTableName} WHERE entity_id = "${entityId}"`;
        return new Promise((resolve, reject) => {
                this.db.all(query,(err,rows) => {
                    if(err) {
                        reject(err);
                        return;
                    }
    
                    if(rows == undefined) {
                        resolve([]);
                        return;
                    }

                    let entityParticipants: Array<Participant> = rows.map((row) => {                
                        let entityParticipant: Participant = {
                            fr_1_id: row.friend_1_id,
                            fr_2_id: row.friend_2_id,
                            money: row.money
                        }
                        return entityParticipant;
                    });
                    resolve(entityParticipants);
                });   
        });    
    }

    public addParticipants(entity: Entity, participants: Array<Participant>): Promise<void> {
        let columNames = ["entity_id", "friend_1_id", "friend_2_id", "money"];
        return new Promise((resolve, reject) => {
            let promisedParticipants = participants.reduce((promiseChain,participant) => {
                return promiseChain.then(() => new Promise((resolve) => {
                   let columValues = [entity.id, participant.fr_1_id, participant.fr_2_id, participant.money];
                   insertInTableWithAutoIncrement(this.participantsTableName, columNames, columValues, function(err, row) {
                       if(row === undefined) {
                           reject("Participants are not added");
                           return [];
                       }
                       resolve();
                    });
               }));
           }, Promise.resolve());
              
           promisedParticipants.then(() => {
               resolve();
           }).catch((err) => {
               reject(err);
           })
        });
    }
    
    public readEntitiesWithParticipants(): Promise<Array<EntityWithParticipants>> {
        return new Promise<Array<EntityWithParticipants>>((resolve, reject) => {
            this.read().then((entities) => {
                let entitiesWithParticipants: EntityWithParticipants[] = [];
                let requests = entities.reduce((promiseChain, entity) => {
                     return promiseChain.then(() => new Promise((resolve) => {
                        this.getParticipants(entity).then((participants) => {
                            let entityWithParticipants: EntityWithParticipants = {
                                entity: entity,
                                participants: participants
                            };
                            entitiesWithParticipants.push(entityWithParticipants);
                            resolve();
                        });   
                    })); 
                }, Promise.resolve()); 
               
                requests.then((result) => {
                    resolve(entitiesWithParticipants);
                }).catch((err) => {
                    reject(err);
                });
            });
        });   
    }

    public createEntityWithParticipants(entity: Entity, participants: Array<Participant>) : Promise<void> {
            return new Promise<void>((resolve,reject) => {
                this.create(entity).then((createdEntity) => {
                    resolve(this.addParticipants(createdEntity, participants));
                 }).catch((err) => {
                     console.log(err);
                 });
            });
    }
}
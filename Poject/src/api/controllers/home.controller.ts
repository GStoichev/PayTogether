import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import { UserRepository } from '../repositories/user.repository'
import { EntityRepository } from '../repositories/entity.repository'
import uuid = require('uuid')
import { Entity, Participant, ParticipantsForPreview, EntityForPreview } from '../models/entity.model'
import { rejects } from 'assert'

class HomeController implements IControllerBase {
    public path = '/home';
    public router = express.Router();

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        // this.router.get(`${this.path}`, this.loadEntries);
        this.router.post(`${this.path} `, this.createEntity);
        this.router.post(`${this.path}/checks`, this.getEntitiesForUser)
    }

    loadEntries = (req: Request, res: Response) => {
        console.log("heyy");
    }

    createEntity = (req: Request, res: Response) => {
        let userRepo = new UserRepository();
        let entityRepo = new EntityRepository();

        let checkName = req.body.check_name;
        let checkDesc = req.body.check_description;

        let participantsJSON = req.body.participants;

        let entity = new Entity();
        entity.name = checkName;
        entity.desc = checkDesc;
        entity.date = new Date();

        let participants : Participant[] = [];

        for(let participant of participantsJSON) {
            let tempParticipant : Participant = {
                fr_1_id: participant.friend_1_id,
                fr_2_id: participant.friend_2_id,
                money: participant.money
            }

            participants.push(tempParticipant);
        }
        
        let results = participants.reduce((promiseChain, fr) => {
            return promiseChain.then(() => new Promise((resolve,reject) => {
                userRepo.areWeFriends(fr.fr_1_id, fr.fr_2_id).then((areWeFriends) => {
                    if(!areWeFriends)
                    {
                        reject("We are not friends");
                    }
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            }));
        }, Promise.resolve());
        
        results.then(() => {
            entityRepo.createEntityWithParticipants(entity, participants).then(() => {
                res.send();
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(`${err} | entity not created properly`);
        });
    }

    pay = (req: Request, res: Response) => {
        let userRepo = new UserRepository();
        let entityRepo = new EntityRepository();
        
        entityRepo.updatePayValue(14,"59f1ce52-322e-4df1-aaaf-f16758d35ff4","9f92828a-7493-4f40-8c22-e7c778c0ce32",10).then(() => {
            
            res.send();
        }).catch((err) => {
            console.log(`${err}`);
        });
        
        //user
        //value_money
        //entity
    }

    addMoreDept = (req: Request, res: Response) => {
        let userRepo = new UserRepository();
        let entityRepo = new EntityRepository();
        
        entityRepo.updateDeptValue(14,"59f1ce52-322e-4df1-aaaf-f16758d35ff4","9f92828a-7493-4f40-8c22-e7c778c0ce32",10).then(() => {         
            res.send("updated succes");
        }).catch((err) => {
            console.log(`${err}`);
        });
    }

    deleteEntity = (req: Request, res: Response) => {
        let userRepo = new UserRepository();
        let entityRepo = new EntityRepository();
        
        let entity = new Entity();
        entity.id = 14;

        entityRepo.deleteParticipants(14).then(() => {
            entityRepo.delete(entity).then(() => {
                res.send("deleted succesfuly");
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
            });
    }

    getEntitiesForUser = (req: Request, res: Response) => {
        let userId = req.body.id_;
        let userName = req.body.name_;

        let userRepo = new UserRepository();
        let entityRepo = new EntityRepository();

        entityRepo.readEntitiesWithParticipants().then((entitiesWithParticipants) => {
            
            let entitiesMyData: EntityForPreview[] = [];

            let resultEntitiesWithParticipants = entitiesWithParticipants.reduce((promiseChain, entityWithParticipants) => {
                return promiseChain.then(() => new Promise((resolve) => {
                    let shouldAddEntity = true;
                    let participants = entityWithParticipants.participants.reduce((participantPromiseChain, participant) => {
                        return participantPromiseChain.then(() => new Promise((resolve,reject) => { 
                            if((participant.fr_1_id == userId) || (participant.fr_2_id == userId)) {
                                if(shouldAddEntity) {
                                    let newEntityWithParticipants: EntityForPreview = {
                                        entity: entityWithParticipants.entity,
                                        participants: []
                                    }
                                    entitiesMyData.push(newEntityWithParticipants);
                                    shouldAddEntity = false;
                                }
                                
                                let income = true;
                                let otherId = participant.fr_1_id;
                                if(participant.fr_1_id == userId) {
                                    income = false;
                                    otherId = participant.fr_2_id;
                                }
                                
                                userRepo.readById(otherId).then((otherUser) => {
                                    let participantForPreview: ParticipantsForPreview = {
                                        myName: userName,
                                        otherName: otherUser.name,
                                        money: participant.money,
                                        income: income
                                    }
                                    entitiesMyData[entitiesMyData.length - 1].participants.push(participantForPreview);
                                    resolve();
                                }).catch((err) => {
                                    reject(err);
                                });
                            }
                            else {
                                resolve()
                            }
                        }));
                    },Promise.resolve()); 
                    participants.then(() => {
                        resolve();
                    }).catch((err) => {
                        console.log(err);
                    });
               })); 
           }, Promise.resolve());

           resultEntitiesWithParticipants.then(() => {
            res.status(200);
            res.send(JSON.parse(JSON.stringify(entitiesMyData)));
            }).catch((err) => {    
            res.status(404);
            res.send({ "error": "Checks are not found"});
            });
        }).catch((err) => {
        res.status(404);
        res.send({ "error": "Checks are not found"});
        });
    }
}

export default HomeController
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
        this.router.post(`/create`, this.createEntity);
        this.router.post(`${this.path}/checks`, this.getEntitiesForUser)
        this.router.post(`${this.path}/pay`, this.pay);
        this.router.post(`${this.path}/dept`, this.addMoreDept);
        this.router.delete(`/check`, this.deleteEntity);
    }

    createEntity = (req: Request, res: Response) => {
        let userRepo = new UserRepository();
        let entityRepo = new EntityRepository();

        let entityName = req.body.entity.name;
        let entityDesc = req.body.entity.description;

        let participantsJSON = req.body.participants;

        let entity = new Entity();
        entity.name = entityName;
        entity.desc = entityDesc;
        entity.date = new Date();

        let participants : Participant[] = [];

        for(let participant of participantsJSON) {
            let tempParticipant : Participant = {
                fr_1_id: participant.friend1,
                fr_2_id: participant.friend2,
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
                res.status(200);
                res.send();
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(`${err} | entity not created properly`);
            res.status(404);
            res.send({"error": "Check is not created"});
        });
    }

    pay = (req: Request, res: Response) => {
        console.log(JSON.stringify(req.body));
        let entity_id = req.body.entity_id;
        let friend1_id = req.body.friend_id1;
        let friend2_id = req.body.friend_id2;
        let value = req.body.value;

        let entityRepo = new EntityRepository();
        
        entityRepo.updatePayValue(entity_id, friend1_id, friend2_id, value).then(() => {
            res.status(200);
            res.send();
        }).catch((err) => {
            res.status(404);
            res.send({ "error" : "Action failed"});
            console.log(`${err}`);
        });
    }

    addMoreDept = (req: Request, res: Response) => {
        let entity_id = req.body.entity_id;
        let friend1_id = req.body.friend_id1;
        let friend2_id = req.body.friend_id2;
        let value = req.body.value;

        let entityRepo = new EntityRepository();
        
        entityRepo.updateDeptValue(entity_id,friend1_id,friend2_id,value).then(() => {         
            res.status(200);
            res.send();
        }).catch((err) => {
            res.status(404);
            res.send({ "error" : "Action failed"});
            console.log(`${err}`);
        });
    }

    deleteEntity = (req: Request, res: Response) => {
        let entityRepo = new EntityRepository();
        
        let id = req.body.id;

        let entity = new Entity();
        entity.id = id;

        entityRepo.deleteParticipants(14).then(() => {
            entityRepo.delete(entity).then(() => {
                console.log("heyy");
                res.status(200);
                res.send();
            }).catch((err) => {
                console.log(err);
                res.status(404);
                res.send({"error" : "Can not delete this check"});
            });
        }).catch((err) => {
            console.log(err);
            res.status(404);
            res.send({"error" : "Can not delete this check"});
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
                                        otherId: otherUser.id,
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
import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import { UserRepository } from '../repositories/user.repository'
import { EntityRepository } from '../repositories/entity.repository'
import uuid = require('uuid')
import { Entity, Participant } from '../models/entity.model'
import { rejects } from 'assert'

class HomeController implements IControllerBase {
    public path = '/home';
    public router = express.Router();

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get(`${this.path}`, this.loadEntries);
        this.router.post(`${this.path}`, this.deleteEntity);
        //this.router.post(`${this.path}`, this.pay);
        //this.router.post('/register', this.register);
        //this.router.post(`/login`, this.login);
    }

    loadEntries = (req: Request, res: Response) => {
        console.log("heyy");
    }

    createEntity = (req: Request, res: Response) => {
        let userRepo = new UserRepository();
        let entityRepo = new EntityRepository();

        let entity = new Entity();
        entity.name = "testNameEntity";
        entity.desc = "testDescEntity";
        entity.date = new Date();

        let frs : Participant[] = [];

        let fr1 : Participant = {
            fr_1_id: "0a4fc957-a62a-47e3-8077-ab6255e1c21b",
            fr_2_id: "59f1ce52-322e-4df1-aaaf-f16758d35ff4",
            money: 10
        }

        let fr2 : Participant = {
            fr_1_id: "59f1ce52-322e-4df1-aaaf-f16758d35ff4",
            fr_2_id: "9f92828a-7493-4f40-8c22-e7c778c0ce32",
            money: 12
        }

        frs.push(fr1);
        frs.push(fr2);
        
        let results = frs.reduce((promiseChain, fr) => {
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
            entityRepo.createEntityWithParticipants(entity, frs).then(() => {
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
}

export default HomeController
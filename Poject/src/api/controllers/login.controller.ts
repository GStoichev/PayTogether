import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from '../interfaces/IControllerBase.interface';
import { User } from '../models/user.model';
import uuid from 'uuid/v4';
import { UserRepository } from '../repositories/user.repository';
import { EntityRepository } from '../repositories/entity.repository';
import { Entity, ParticipantsForPreview, EntityForPreview} from '../models/entity.model';
import { rejects } from 'assert';

class LoginController implements IControllerBase {
    public path = '/';
    public router = express.Router();

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get(this.path, this.index);
        this.router.post(this.path + `register`, this.register);
        this.router.post(this.path + `login`, this.login);
    }

    index = (req: Request, res: Response) => {
            res.render('login/index', {err: ""});
    }

    register = (req: Request, res: Response) => {
        let name = req.body.name;
        let password = req.body.password;
        let email = req.body.email;

        let userRepo = new UserRepository();
        let entityRepo = new EntityRepository();

        let user = new User(uuid(),name,email);
        user.password = password;

        userRepo.isExisting(name).then((isExisting) => {
            if(isExisting)
            {
                res.render('login/index', {err: "register"});
                return;
            }
            userRepo.create(user).then((user) => {
                    res.render('home/home', {user: user, entitiesWithParticipants: [], err: ""});
            });
        });
    }

    login = (req: Request, res: Response) => {
        let name = req.body.name;
        let password = req.body.password;

        let userRepo = new UserRepository();
        let entityRepo = new EntityRepository();

        userRepo.login(name,password).then((user) => {
            entityRepo.readEntitiesWithParticipants().then((entitiesWithParticipants) => {
                
                let entitiesMyData: EntityForPreview[] = [];

                let resultEntitiesWithParticipants = entitiesWithParticipants.reduce((promiseChain, entityWithParticipants) => {
                    return promiseChain.then(() => new Promise((resolve) => {
                        let shouldAddEntity = true;
                        let participants = entityWithParticipants.participants.reduce((participantPromiseChain, participant) => {
                            return participantPromiseChain.then(() => new Promise((resolve) => { 
                                if((participant.fr_1_id == user.id) || (participant.fr_2_id == user.id)) {
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
                                    if(participant.fr_1_id == user.id) {
                                        income = false;
                                        otherId = participant.fr_2_id;
                                    }
                                    
                                    userRepo.readById(otherId).then((otherUser) => {
                                        let participantForPreview: ParticipantsForPreview = {
                                            myName: user.name,
                                            otherName: otherUser.name,
                                            money: participant.money,
                                            income: income
                                        }
                                        entitiesMyData[entitiesMyData.length - 1].participants.push(participantForPreview);
                                        resolve();
                                    });
                                }
                                resolve();
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
                    //res.render('home/home', {user: user, entitiesWithParticipants: entitiesMyData, err: ""});
                    res.status(200);
                    res.send(JSON.parse(JSON.stringify(user)));
                }).catch((err) => {
                    res.render('home/home', { user: user, err: err});    
                });
            }).catch((err) => {
                res.render('home/home', { user: user, err: err});    
            });
        }).catch((err) => {
            res.render('login/index', {err: err});
        });     
    }
}

export default LoginController
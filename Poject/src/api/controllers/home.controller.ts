import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import { UserRepository } from '../repositories/user.repository'
import { EntityRepository } from '../repositories/entity.repository'
import uuid = require('uuid')
import { Entity, Participant } from '../models/entity.model'

class HomeController implements IControllerBase {
    public path = '/home';
    public router = express.Router();

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get(`${this.path}`, this.loadEntries);
        this.router.post(`${this.path}`, this.createEntity);
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

        let participants: Participant[] = [];

        // let participant1: Participant = {
        //     fr_1_id: "",
        //     fr_2_id: "",
        //     money: 15
        // }

        // let participant2: Participant = {
        //     fr_1_id: "",
        //     fr_2_id: "",
        //     money: 12
        // }

        // participants.push(participant1);
        // participants.push(participant2);

        entityRepo.createEntityWithParticipants(entity,participants);

    }

    // register = (req: Request, res: Response) => {
    //     res.render('home/home',{test: "register"});
    // }

    // login = (req: Request, res: Response) => {
    //     res.render('home/home',{test: "login"});
    // }
}

export default HomeController
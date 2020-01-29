import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from '../interfaces/IControllerBase.interface';
import { User } from '../models/user.model';
import uuid from 'uuid/v4';
import { UserRepository } from '../repositories/user.repository';
import { EntryRepository } from '../repositories/entry.repository';
import { Entry } from '../models/entry.model';

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
        let entryRepo = new EntryRepository();

        let user = new User(uuid(),name,email);
        user.password = password;

        let entry = new Entry(1,)

        userRepo.isExisting(name).then((isExisting) => {
            if(isExisting)
            {
                res.render('login/index', {err: "register"});
                return;
            }
            userRepo.create(user).then((user) => {
                entryRepo.create(4).then((entries) => {
                    console.log(JSON.stringify(entries));
                    res.render('home/home', {user: user, entries : entries});
                });
            });
        });
    }

    login = (req: Request, res: Response) => {
        let name = req.body.name;
        let password = req.body.password;

        let userRepo = new UserRepository();
        let entryRepo = new EntryRepository();

        userRepo.login(name,password).then((user) => {
            entryRepo.read().then((entries) => {
                console.log(JSON.stringify(entries));
                res.render('home/home', {user: user, entries : entries});
            });
        }).catch((err) => {
            res.render('login/index', {err: err});
        });     
    }
}

export default LoginController
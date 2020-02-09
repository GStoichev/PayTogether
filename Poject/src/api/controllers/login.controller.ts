import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from '../interfaces/IControllerBase.interface';
import { User } from '../models/user.model';
import uuid from 'uuid/v4';
import { UserRepository } from '../repositories/user.repository';
import { EntityRepository } from '../repositories/entity.repository';

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

        let user = new User(uuid(),name,email);
        user.password = password;

        userRepo.isExisting(name).then((isExisting) => {
            if(isExisting)
            {
                res.status(400);
                res.send({ "error": "Account with that name already exist!!!"});
                return;
            }
            userRepo.create(user).then((user) => {
                    res.status(200);
                    res.send(JSON.parse(JSON.stringify(user)));
            });
        });
    }

    login = (req: Request, res: Response) => {
        let name = req.body.name;
        let password = req.body.password;

        let userRepo = new UserRepository();

        userRepo.login(name,password).then((user) => {
            res.status(200);
            res.send(JSON.parse(JSON.stringify(user)));
        }).catch((err) => {
            res.status(404);
            res.send({ "error": "User account Doesn't exist!"});
        });     
    }
}

export default LoginController
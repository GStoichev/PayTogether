import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import { UserRepository } from '../repositories/user.repository'
import { User } from '../models/user.model'

class UserController implements IControllerBase {
    public path = '/user'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get(`${this.path}=:id`, this.userProfile);
    }

    userProfile = (req: Request, res: Response) => {
        let repo = new UserRepository();
        repo.readById(req.params.id).then((user) => {
            res.render('user/user', { user: user , err: "" });
        }).catch((err) => {
            res.send({err: err});
        });
    }
}

export default UserController
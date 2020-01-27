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
        this.router.get('/user', this.userProfile);
    }

    userProfile = (req: Request, res: Response) => {
        let repo = new UserRepository();
        repo.read().then((result) => {
            console.log(result);
            let usersToJson = JSON.parse(JSON.stringify(result));
            res.render('user/user', {  usersToJson });
        });
    }
}

export default UserController
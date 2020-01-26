import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import { UserRepository } from '../repositories/user.repository'
import { User } from '../models/user.model'
import uuid = require('uuid')

class HomeController implements IControllerBase {
    public path = '/'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.post('/', this.index)
    }

    index = (req: Request, res: Response) => {

        let repo = new UserRepository();

        let user = new User(uuid(),"nameTest40", "emailTest40");
        console.log(user.email);
        repo.create(user).then(() => {
            //let usersToJson = JSON.parse(JSON.stringify(result));
            //console.log(usersToJson);
            //res.render('home/index', {  usersToJson });
        });
    }
}

export default HomeController
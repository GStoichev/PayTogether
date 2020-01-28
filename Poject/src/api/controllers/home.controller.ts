import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import { UserRepository } from '../repositories/user.repository'
import uuid = require('uuid')

class HomeController implements IControllerBase {
    public path = '/home';
    public router = express.Router();

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.post(`${this.path}`, this.userProfile);
        //this.router.post('/register', this.register);
        //this.router.post(`/login`, this.login);
    }

    userProfile = (req: Request, res: Response) => {
        let repo = new UserRepository();
        repo.readById(req.body.id).then((result) => {
            console.log(result);
            let usersToJson = JSON.parse(JSON.stringify(result));
            res.render('user/user', {  usersToJson });
        });
    }

    // register = (req: Request, res: Response) => {
    //     res.render('home/home',{test: "register"});
    // }

    // login = (req: Request, res: Response) => {
    //     res.render('home/home',{test: "login"});
    // }
}

export default HomeController
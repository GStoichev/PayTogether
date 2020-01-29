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
        this.router.get(`${this.path}`, this.loadEntries);
        //this.router.post('/register', this.register);
        //this.router.post(`/login`, this.login);
    }

    loadEntries = (req: Request, res: Response) => {
        console.log("heyy");
    }

    // register = (req: Request, res: Response) => {
    //     res.render('home/home',{test: "register"});
    // }

    // login = (req: Request, res: Response) => {
    //     res.render('home/home',{test: "login"});
    // }
}

export default HomeController
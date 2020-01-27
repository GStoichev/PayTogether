import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import uuid = require('uuid')

class HomeController implements IControllerBase {
    public path = '/home';
    public router = express.Router();

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get(this.path, this.index);
        //this.router.post('/register', this.register);
        //this.router.post(`/login`, this.login);
    }

    index = (req: Request, res: Response) => {
            res.render('home/home');
    }

    // register = (req: Request, res: Response) => {
    //     res.render('home/home',{test: "register"});
    // }

    // login = (req: Request, res: Response) => {
    //     res.render('home/home',{test: "login"});
    // }
}

export default HomeController
import express, { Router } from 'express';

export class UserRouter {

    private router: Router = express.Router(); 
    
    constructor() {
        this.OnCreate();
    }

    public OnCreate() {
        this.router.get(`/`, (req, res, next) => {
            res.status(200).json({
                message : `Handling GET request to /user`
            });
        });

        this.router.post(`/`, (req, res, next) => {
            res.status(200).json({
                message : `Handling GET request to /user`
            });
        });
    }

}
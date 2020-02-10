import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from '../interfaces/IControllerBase.interface';
import { User } from '../models/user.model';
import uuid from 'uuid/v4';
import { UserRepository } from '../repositories/user.repository';

class FriendsController implements IControllerBase {
    public path = '/friend';
    public router = express.Router();

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.post(this.path + `/friends`, this.showAllFriends);
        //this.router.post(this.path + `/:id`, this.getFriend);
        this.router.post(this.path + `/add`, this.addFriend);
    }

    showAllFriends = (req: Request, res: Response) => {
        let id = req.body.id_;
        let userRepo = new UserRepository();
        
        userRepo.getAllFriends(id).then((friends) => {
            res.status(200);
            res.send(JSON.parse(JSON.stringify(friends)))

        }).catch((err) => {
            console.log(err);
            res.status(404)
            res.send({ "error" : "You don't have any friends" });
        });
    }

    addFriend = (req: Request, res: Response) => {
        let id = req.body.id;
        let otherId = req.body.other_id;
        console.log(`id ${id} | otherId ${otherId}`);
        let userRepo = new UserRepository();

        userRepo.addFriend(id, otherId).then((friend) => {
            if(friend) {
                res.send({new_friend: friend});
            } else{
                console.log("Should not happen");
                res.send();
            }
        }).catch((err) => {
            res.send(err);
        });

    }
}

export default FriendsController
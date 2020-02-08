import * as express from 'express';
import { Request, Response } from 'express';
import IControllerBase from '../interfaces/IControllerBase.interface';
import { User } from '../models/user.model';
import uuid from 'uuid/v4';
import { UserRepository } from '../repositories/user.repository';

class FriendsController implements IControllerBase {
    public path = '/friends';
    public router = express.Router();

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get(this.path + `/:id`, this.showAllFriends);
        this.router.post(this.path + `/add`, this.addFriend);
    }

    showAllFriends = (req: Request, res: Response) => {
        let id = req.params.id;
        let userRepo = new UserRepository();
        
        userRepo.getAllFriends(id).then((friends) => {
            console.log(friends.length);
            res.render('user/friends', {friends: friends, err: "" , userId: id});
        }).catch((err) => {
            res.render('user/friends', {friends: [], err: err, userId: id});
            //res.render("user/user", {err: err});
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
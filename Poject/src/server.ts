import App from './app'

import * as bodyParser from 'body-parser'
import loggerMiddleware from './api/middleware/logger'

import HomeController from './api/controllers/home.controller'
import UserController from './api/controllers/user.controller'
import LoginController from './api/controllers/login.controller'
import FriendsController from './api/controllers/friends.controller'

const app = new App({
    port: 8000,
    controllers: [
        new HomeController(),
        new UserController(),
        new LoginController(),
        new FriendsController()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware
    ]
})

app.listen();
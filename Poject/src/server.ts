import App from './app'

import * as bodyParser from 'body-parser'
import loggerMiddleware from './api/middleware/logger'
import * as cors from 'cors'

import HomeController from './api/controllers/home.controller'
import UserController from './api/controllers/user.controller'
import LoginController from './api/controllers/login.controller'
import FriendsController from './api/controllers/friends.controller'
const options:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: 'http://localhost:4200'
  };
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
        loggerMiddleware,
        cors.default(options)
    ]
})

app.listen();
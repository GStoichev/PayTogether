import App from './app'

import * as bodyParser from 'body-parser'
import loggerMiddleware from './api/middleware/logger'

//import PostsController from './api/controllers/posts/posts.controller'
import HomeController from './api/controllers/home.controller'
import UserController from './api/controllers/user.controller'
import LoginController from './api/controllers/login.controller'

const app = new App({
    port: 8000,
    controllers: [
        new HomeController(),
        new UserController(),
        new LoginController()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware
    ]
})

app.listen();
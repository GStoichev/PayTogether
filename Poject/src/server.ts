import App from './app'

import * as bodyParser from 'body-parser'
import loggerMiddleware from './api/middleware/logger'

//import PostsController from './api/controllers/posts/posts.controller'
import HomeController from './api/controllers/home.controller'

const app = new App({
    port: 8000,
    controllers: [
        new HomeController()
        //new PostsController()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware
    ]
})

app.listen();
import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { PostController } from './controllers/PostController'

const routes = Router()

routes.post('/user', new UserController().create)
routes.get('/user', new UserController().get)
routes.get('/user/:id', new UserController().show)
routes.put('/user/:id', new UserController().update)
routes.patch('/user/:id/inactive', new UserController().inactive)

routes.post('/post', new PostController().create)
routes.get('/post', new PostController().get)
routes.get('/post/:id', new PostController().show)
routes.patch('/post/:id', new PostController().update)
routes.delete('/post/:id', new PostController().delete)
routes.patch('/post/:id/like', new PostController().likePost)
routes.patch('/post/:id/comment', new PostController().commentPost)

export default routes
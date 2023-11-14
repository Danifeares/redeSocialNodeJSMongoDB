import { Router } from 'express'
import { UserController } from './controllers/UserController'

const routes = Router()

routes.post('/user', new UserController().create)

routes.get('/user', new UserController().get)

routes.get('/user/:id', new UserController().show)

export default routes
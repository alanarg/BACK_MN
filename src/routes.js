const express = require('express')
const cors = require('cors')
const routes = express.Router()

const validate = require('express-validation')
const authMiddleware = require('./app/middlewares/auth')

const controllers = require('./app/controllers')
const validators = require('./app/validators')

const handle = require('express-async-handler')

// routes.use(cors)

routes.post('/users', validate(validators.User), handle(controllers.UserController.store))
routes.post('/session', validate(validators.Session), handle(controllers.SessionController.store))

//iRÃO PASSA PELA AUTENTICAÇÃO ABAIXO TODOS OS MÉTODOS CONSEGUINTES
routes.use(authMiddleware)

routes.get('/ads', handle(controllers.AdController.index))
routes.get('/ads/:id', handle(controllers.AdController.show))
routes.post('/ads', validate(validators.Ad), handle(controllers.AdController.store))
routes.put('/ads/:id', validate(validators.Ad), handle(controllers.AdController.update))
routes.delete('/ads/:id', handle(controllers.AdController.destroy))

module.exports = routes
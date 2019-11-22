const express = require('express')
const mongoose = require('mongoose')
const Youth = require('youch')
const validate = require('express-validation')
const databaseConfig = require('./config/database')

class App {
    constructor() {
        this.express = express()
        this.isDev = process.env.NODE_ENV != 'production'
        this.middlewares()
        this.routes()
        this.database()
        this.exception()
    }
    database() {
        mongoose.connect(databaseConfig.uri, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true 
        })
    }

    middlewares() {
        this.express.use(express.json())

    }

    routes() {
        this.express.use(require('./routes'))

    }
    exception(){
        this.express.use(async(err,req,res,next)=>{
                if(err instanceof validate.ValidationError){
                    return res.status(err.status).json(err)
                }
                if(process.env.NODE_ENV !== 'production'){
                    const youth = new Youth(err)
                    return res.json(await youth.toJSON())
                }
                //Toda vez que tivermos um erro e não for de validação, como especificado acima, retornaremos o codigo abaixo
                return res.status(err.status || 500).json({error: 'Internal Server Error'})
        })
    }
}

module.exports = new App().express
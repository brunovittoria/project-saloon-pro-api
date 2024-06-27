import express, { Request, Response, NextFunction } from 'express'
import { router } from './routes/routes'
import 'express-async-errors'
import cors from 'cors'

//dotenv.config() //DEVE SER CHAMADO PRIMEIRO SEMPRE!

const app = express()

app.use((req, res, next) => {
    if(req.originalUrl === '/webhooks'){
        next()
    }else{
        express.json()(req, res, next)
    }
})

app.use(cors()) //Assim liberamos pra qualquer um fazer e enviar req

app.use(router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof Error){                                                 //Erros do tipo que nos tratamos
        return res.status(400).json({
            error: err.message
        })
    }

    return res.status(500).json({                                            //Erros do tipo que o servidor nos envia
        status: 'error',
        message: 'Internal server error'
    })
})
//Aqui abaixo teremos nosso index.js rotas que se ocupara de todas as rotas:

app.listen(3333 , () => console.log("Server is running") )
import { Request, Response } from 'express'
import { AuthUserService } from '../../services/user/AuthUserService'

class AuthUserController{   //Aqui basicamente pegamos dados do nosso req.body e mandamos pro nosso serviço executar a sessao de login
    async handle(request: Request, response: Response){
        const { email, password } = request.body

        const authUserService = new AuthUserService()

        const session = await authUserService.execute({ 
            email,
            password
        })

        return response.json(session)

    }
}

export { AuthUserController }
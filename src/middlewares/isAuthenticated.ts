import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

//Este Middleware ira verificar e comparar o token fornecido pelo o usuario na sessao de login

interface Payload{
    sub: string;        //E a String que criamos no AuthUserService.ts
}

export function isAuthenticated(request: Request, response: Response, next: NextFunction){
    const authToken = request.headers.authorization //Primeiro começamos pegando nosso token, que recebemos sempre do: authorization

    if(!authToken){
        return response.status(401).end() //Se nao tiver o token "Not Authorized" ja sera a primeira barreira de segurança, o .end() interrompe seguir para outros if
    }

    const [, token] = authToken.split(" ") //Damos o , token pois falamos para ele pegar do front somente o valor do token e nao o bearer

    try{
        const { sub } = verify(           //Com o metodo verify vemos se o token enviado no sub (ID do USER) é igual ao q temos no file .ENV
            token,
            process.env.JWT_SECRET
        )   as Payload

        console.log(sub)
        request.user_id = sub             //Dessa forma ira receber o ID do user logado. (Aqui criamos um type especifico pra esse dado)
        return next()                     //Caso o token esteja correto ele passou pelo nosso middleware

    } catch(err){
        return response.status(401).end()
    }
}
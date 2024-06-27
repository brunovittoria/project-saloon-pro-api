import { Request, Response } from "express";
import { CountWorksService } from "../../services/works/CountWorksService";

class CountWorksController{
    async handle(request: Request, response: Response){
        const user_id = request.user_id //Pegamos dessa forma pois o usuario ja esta logado, ele n precisa mandar no body o ID dele.

        const countWorks = new CountWorksService()

        const count = await countWorks.execute({    //Passamos o user ir para a const count e dentro dela ira retornar a QTD de works
            user_id
        })

        return response.json(count) //Mandamos pro nosso front, podendo exibir na tela.
    }
}

export { CountWorksController }
import { Request, Response } from "express";
import { SubService } from "../../services/subscriptions/SubService";

class SubController{
    async handle(request: Request, response: Response){   
        const user_id = request.user_id                 //Primeira coisa que fazemos é pegar o ID do user, que temos pois pra ele pagar deve estar logado

        const subscriveService = new SubService()

        const subscribe = await subscriveService.execute({
            user_id
        })

        return response.json(subscribe)
    }
}

export { SubController }
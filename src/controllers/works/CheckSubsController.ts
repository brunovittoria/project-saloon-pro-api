import { Request, Response } from "express";
import { CheckSubsService } from "../../services/works/CheckSubsService";

class CheckSubsController{
    async handle(request: Request, response: Response){
        const user_id = request.user_id

        const checkSub = new CheckSubsService()

        const status = await checkSub.execute({     //Checamos o status com base no user_id, entao passamos essa informaçao para nosso services
            user_id
        })

        return response.json(status)
    }
}

export { CheckSubsController }
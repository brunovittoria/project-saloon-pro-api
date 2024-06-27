import { Request, Response } from "express";
import { UpdateWorksService } from "../../services/works/UpdateWorksService";

class UpdateWorksController{
    async handle(request: Request, response: Response){
        const user_id = request.user_id
        const { name, price, status, work_id } = request.body

        const updateWork = new UpdateWorksService()

        const work = await updateWork.execute({ //Passamos os dados do front para nossos servicos e esperamos a resposta dele
            user_id,
            name,
            price,
            status,
            work_id
        })

        return response.json(work)
    }
}

export { UpdateWorksController }
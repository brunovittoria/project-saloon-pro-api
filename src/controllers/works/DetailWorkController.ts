import { Request, Response } from "express";
import { DetailWorkService } from "../../services/works/DetailWorkService";

class DetailWorkController {
    async handle(request: Request, response: Response){
        const work_id = request.query.work_id as string //Pegamos do query params e nao do body, pois é uma listagem de item unico que vamos fazer
        
        const detailWork = new DetailWorkService() //Inicializo nosso serviço

        const work = await detailWork.execute({ //Passamos os dados para o serviço
            work_id,
        })

        return response.json(work)
    }
}

export { DetailWorkController }
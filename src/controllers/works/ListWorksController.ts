import { ListWorksService } from "../../services/works/ListWorksService";
import { Request, Response } from "express";

class ListWorksController{
    async handle(request: Request, response: Response){
        const user_id = request.user_id //Pegamos do front o nosso user logado
        const status = request.query.status as string //Nesse caso n pegamos do body pois Se o status é algo que o usuário pode alterar ou selecionar facilmente em uma interface de usuário, pode ser mais conveniente enviar isso como um parâmetro na URL (query parameter) em vez de exigir que o usuário preencha um campo específico no corpo da solicitação.  
    
        const listWorks = new ListWorksService()

        const works = await listWorks.execute({
            user_id,
            status,
        })

        return response.json(works)
    }
}

export { ListWorksController }
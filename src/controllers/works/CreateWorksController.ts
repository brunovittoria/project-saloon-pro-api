import { Request, Response } from "express";
import { CreateWorksServie } from "../../services/works/CreateWorksService";

class CreateWorksController{
    async handle(request: Request, response: Response){
        const { name, price } = request.body       //Informacoes enviadas pelo user na pagina onde ele seta o servico
        const user_id = request.user_id            //Logicamente pra ele cadastrar um servico ele precisa estar logado, portanto temos acesso ao user_id de todo jeito

        const createWorksService = new CreateWorksServie()

        const work = await createWorksService.execute({     //Mandamos pro service os dados que ele pede
            user_id,
            name,
            price
        })

        return response.json(work)
    }
}

export { CreateWorksController }
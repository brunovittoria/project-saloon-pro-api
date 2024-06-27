import prismaClient from "../../prisma";

interface WorksListRequest{              //Pedimos como obrigatorio ao nosso controller de nos passar esses dados
    user_id: string                      //Precisamos saber do ID pois o tipo de serviço ira pertencer a um usuario em especifico.
    status: boolean | string             //Precisamos saber o status do serviço, pois temos um btn turn on que faz aparecer somente os ativos ou serviços nao ativos.
}

class ListWorksService {
    async execute({ user_id, status } : WorksListRequest){

        const work = await prismaClient.haircut.findMany({
            where:{
                user_id: user_id,
                status: status === "true" ? true : false        //Caso o usuario filtrar por serviços ativos, mostre os ativo, se nao mostre os serviços nao ativos.
            }
        })

        return work
    }
}

export { ListWorksService }
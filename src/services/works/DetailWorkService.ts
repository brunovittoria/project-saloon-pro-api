import prismaClient from "../../prisma";

interface DetailRequest{
    work_id: string         //Pedimos ao user o id do serviço para que possamos buscar no DB todas INFO daquele serviço
}

class DetailWorkService{
    async execute( { work_id}:DetailRequest ){

        const work = await prismaClient.haircut.findFirst({   //Trazemos a primeira ocorrencia do work que contenha o id === work_id (enviado do FE)
            where:{
                id: work_id
            }
        })

        return work
    }
}

export { DetailWorkService }
import prismaClient from "../../prisma";

interface ListScheduleRequest{
    user_id: string                     //Para listarmos basta do ID do usuario pois na tabela services temos a relaçao com o user_id, a coluna user_id esta presente nesta tabela.
}

class ListScheduleService{
    async execute( { user_id } : ListScheduleRequest ){

        const schedule = await prismaClient.service.findMany({
            where:{
                user_id: user_id            //Busque no DB todos os serviços que pertencem ao user_id recebido do front
            },
            select:{                        //Para renderizar os conteudos de nossa tela, precisamos somente dos seguintes dados:
                id: true,
                customer: true,
                haircut: true,
            }
        })

        return schedule
    }
}

export { ListScheduleService }
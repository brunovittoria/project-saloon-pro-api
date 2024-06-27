import prismaClient from "../../prisma";

interface CheckSubRequest{
    user_id: string         //Precisamo somente disso para a checagem
}

class CheckSubsService{
    async execute( {user_id} : CheckSubRequest ) {
        
        const status = await prismaClient.user.findFirst({
            where:{
                id: user_id
            },
            select:{
                subscriptions:{                          //Fazemos um filtro para retornar somente o id e status dentro do subs
                    select:{
                        id: true,
                        status: true,
                    }
                }
            }
        })

        return status
    }
}

export { CheckSubsService }
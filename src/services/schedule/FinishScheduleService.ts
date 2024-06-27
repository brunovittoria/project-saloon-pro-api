import prismaClient from "../../prisma";

interface FinishRequest{
    schedule_id: string
    user_id: string
}

class FinishScheduleService{
    async execute({ schedule_id, user_id }: FinishRequest){

        if(schedule_id === '' || user_id === ''){
            throw new Error('Error.')
        }

        try{
            //Devemos evitar que um dono de barbearia elimine um agendamento de outro dono de barbearia, portanto devemos criar um tratamento de erro
            const belongsToUser = await prismaClient.service.findFirst({ //Busca na table services servicos onde o id e o user id sejam iguais aos recebidos do FE
                where:{
                    id: schedule_id,
                    user_id: user_id
                }
            })
            
            if(!belongsToUser){                     //Se o service nao pertence ao user ele sera barrado
                throw new Error("Not Authorized")
            }

            //Caso nao caia no caso acima faremos o delete do service

            await prismaClient.service.delete({
                where:{
                    id: schedule_id
                }
            })

            return { message: "Deleted with success!" }

        } catch(err){
            console.log(err)
            throw new Error(err)
        }
    }
}

export { FinishScheduleService }
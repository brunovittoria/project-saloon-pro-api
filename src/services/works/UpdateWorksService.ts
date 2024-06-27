import prismaClient from "../../prisma";

interface WorkRequest{
    user_id: string
    work_id: string
    name: string
    price: number
    status: boolean | string
}

class UpdateWorksService {
    async execute({ user_id, work_id, name, price, status = true } : WorkRequest){

        //Primeiramente devemos buscar a SUB do user que esta tentando modificar o work
        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id
            },
            include:{
                subscriptions: true
            }
        })

        if(user?.subscriptions?.status !== 'active'){          //Se n tiver nenhuma assinatura nao vai poder modificar o work
            throw new Error("Not authorized")
        }

        const work = await prismaClient.haircut.update({        //Aqui iremos de fato escrever no DB os valores dos works/haircuts
            where:{
                id: work_id,                                     //Atualizamos somente onde o Id seja igual ao id do serviço 
            },
            data:{
                name: name,
                price: price,
                status: status === true ? true : false,
            }
        }) 

        return work     //Retornamos esse valor pro nosso controller
    }
}

export { UpdateWorksService }
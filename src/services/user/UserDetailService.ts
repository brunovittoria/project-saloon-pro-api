import prismaClient from "../../prisma";

class UserDetailService {
    async execute(user_id: string){                             //Primeiramente pegamos nessa rota o ID do USER

        const user = await prismaClient.user.findFirst({        //Pedimos para o prisma ir buscar no DB o primeiro USER que corresponda com o id que recebemos pelo nosso req.body    
            where: {
                id: user_id
            },
            select:{                                            //Como nao queremos retornar a PWD ao USER, vamos usar o select para filtrar os dados do retorno
                id: true,
                name: true,
                email: true,
                adress: true,
                subscriptions:{                                //Dentro do subscriptions filtramos tb oque queremos enviar
                    select:{
                        id: true,
                        priceId: true,
                        status: true,
                    }
                }
            }
        })

        return user
    }
}

export { UserDetailService }
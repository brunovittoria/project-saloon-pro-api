import prismaClient from "../../prisma";

interface WorksRequest{     //Pedimos como obrigatorio ao nosso controller de nos passar esses dados
    user_id: string         //Precisamos saber do ID pois o tipo de serviço ira pertencer a um usuario em especifico.
    name: string            //Precisamos saber o nome do servico em especifico.
    price: number           //Precisamos saber do preço do servico.

}

//Verificamos qts servicos/modelos esse user tem cadastrado no DB
//Verificamos se o user é premium, caso ele nao seja, limitamos a qtd de serviços q ele pode cadastrar

class CreateWorksServie{
    async execute( {user_id, name, price} : WorksRequest ){

        if(!name || !price){
            throw new Error("Error")
        }

        //Verificamos qts servicos/modelos esse user tem cadastrado no DB
        const myWorks = await prismaClient.haircut.count({
            where:{
                user_id: user_id
            }
        })

        const user = await prismaClient.user.findFirst({
            where:{
                id: user_id,
            },
            include: {                  //Aqui alem de retornar o usuario, incluimos tb as suas infos de assinatura.
                subscriptions: true,
            }
        })

        //Podemos agora criar nosso limite de criaçao de modelos de serviços para usuarios gratuitos
        if(myWorks >= 3 && user?.subscriptions?.status !== 'active'){
            throw new Error("Not Authorized")
        }

        //Abaixo criamos nosso modelo no DB de acordo com os dados que recebemos acima.
        const work = await prismaClient.haircut.create({            //Deixei haircut pois no migrations criei no DB como haircut e nao works, mas blx
            data:{
                name: name,
                price: price,
                user_id: user_id
            }
        })
        
        return work
    }
}

export { CreateWorksServie }
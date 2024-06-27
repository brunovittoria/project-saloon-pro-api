import { stripe } from './stripe'
import prismaClient from '../prisma/index'

export async function manageSubscription(subscriptionId: string, customerId: string, createAction = false, deleteAction = false){
    //Busca por usuarios que tenham o stripeCustomerId que é enviado do controller e verifica no DB e inclui a subscription dele(se tiver)
    const findUser = await prismaClient.user.findFirst({ 
        where:{
            stripe_customer_id: customerId,
        },
        include:{
            subscriptions: true
        }
    })

    //Nessa variavel temos acesso a detalhes da sub do cliente como: produto, tipo de sub, entre outros...
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    //Criamos um objeto com os dados recebidos do stripe e setamos dentro de props com nomes iguais aos do DB
    const subscriptionData = {
        id: subscription.id,
        userId: findUser.id,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id
    }

    //AGORA VAMOS CRIAR AS ACTIONS
    if(createAction){
        console.log(subscriptionData);

        try{
            await prismaClient.subscription.create({ //Estamos criando dentro da nossa tabele subscription e enviando os dados do nosso obj acima
                data: subscriptionData
            })

        }catch(err){
            console.log("CREATE ERROR")
            console.error(err)
        }
    } else{
        //Se nao esta criando vamos apenas atualizar entao os dados da assinatura

        //Se ele fizer uma açao para deletar cai aqui
        if(deleteAction){
            await prismaClient.subscription.delete({
                where: {
                    id: subscriptionId
                }
            })

            return
        }

        //Se nao queremos nem criar e nem deletar, queremos apenas atualizar as informaçoes dessa Subs
        try{
            await prismaClient.subscription.update({
                where:{
                    id: subscriptionId
                },
                data:{
                    status: subscription.status,
                    priceId: subscription.items.data[0].price.id
                }
            })

        }catch(err){
            console.log("ERRO UPDATE HOOK")
            console.log(err)
        }
        
    }
    
}
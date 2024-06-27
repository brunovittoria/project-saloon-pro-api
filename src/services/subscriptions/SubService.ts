import prismaClient from "../../prisma";
import Stripe from "stripe";

interface SubRequest{
    user_id: string
}

class SubService {
    async execute({ user_id }: SubRequest){
        
        const stripe = new Stripe(
            process.env.STRIPE_SECRET_KEY,
            {
                apiVersion: "2024-04-10",
                appInfo:{
                    name: 'saloonpro',
                    version: '1.0'
                }
            }
        )

        // 1° Buscar o usuario e cadastrar ele no stripe caso nao tenha cadastrado
        const findUser = await prismaClient.user.findFirst({
            where:{
                id: user_id
            }
        })

        // 2° Depois de buscar o usuario temos uma coluna dentro a tabela USERS que podemos pegar o stripe_id do usuario
        let stripeCustomerId = findUser.stripe_customer_id

        // 3° Caso nao tenha, criamos como cliente la no STRIPE
        if(!stripeCustomerId){
            const stripeCustomer = await stripe.customers.create({
                email: findUser.email
            })

            //Agora fazemos uma atualizaçao no database com as novas informaçoes que obtemos da criaçao do user no STRIPE
            await prismaClient.user.update({
                where:{
                    id: user_id
                },
                data:{
                    stripe_customer_id: stripeCustomer.id
                }
            })

            stripeCustomerId = stripeCustomer.id //Agora nossa let vai receber o valor do id stripe
        }

        // 4° Vamos inicializar nosso checkout de pagamentos
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            billing_address_collection: "required",         //Info de address do user
            line_items: [                                   //info do nosso product
                { price: process.env.STRIPE_PRICE, quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL       //Pra quando ele nao quer finalizar o PGTO e quer voltar pro nosso app
        })

        return { sessionId: stripeCheckoutSession.id }       //Retornamos pro nosso FE o ID da sessao do CHECKOUT

    }
}

export { SubService }
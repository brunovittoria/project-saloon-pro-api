import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from '../../utils/stripe'

import { manageSubscription } from "../../utils/manageSubs";

class WebhooksController {
    async handle(request: Request, response: Response){
        let event: Stripe.Event = request.body; //Aqui estamos falando que vamos receber do STRIPE essa resposta em nosso BODY
    
        const signature = request.headers['stripe-signature'] //Pegamos a assinatura/retorno do stripe
        let endpointSecret = 'whsec_62144c8284459cedd422e3388c7f7b46263c449f53d10e64bf40c0674eacd201'

        try{
            //Agora mandamos essas informaçoes no body  para o stripe
            event = stripe.webhooks.constructEvent(request.body,signature,endpointSecret)

        }catch(err){
            return response.status(400).send(`Webhook error: ${err.message}`)
        }

        switch(event.type){     //Aqui iremos tratar as varias possibilidades que o STRIPE pode nos retornar, como pgto recusado, pendente e etc...

            case 'customer.subscription.deleted':
                //Caso cancele assinatura do user vamos cancelar-la
                const payment = event.data.object as Stripe.Subscription //Pegamos o pagamento e setamos em uma var e tipamos ele pro TS
                //Agora chamamos nossa funçao "Mae" que gerencia os varios casos do nosso SWITCH

                await manageSubscription(payment.id, payment.customer.toString(), false, true)
                break;

            case 'customer.subscription.updated':
                //Caso tenha alguma atualizaçao de assinatura
                const paymentIntent = event.data.object as Stripe.Subscription //Pegamos o pagamento e setamos em uma var e tipamos ele pro TS

                await manageSubscription(paymentIntent.id, paymentIntent.customer.toString(), false)
                break;

            case 'checkout.session.completed':
                //Criar a assinatura que foi paga com sucesso
                const checkoutSession = event.data.object as Stripe.Checkout.Session //Aqui tipamos de forma diferente

                await manageSubscription(checkoutSession.subscription.toString(), checkoutSession.customer.toString(), true)
                break;

            case 'checkout.session.expired':
                //Caso a sessao do carrinho tenha expirado
                break;
            
            default:
                console.log(`Evento desconhecido ${event.type}`)
        }

        response.send() //Aqui enviamos o retorno pro FE

    }
}

export { WebhooksController }
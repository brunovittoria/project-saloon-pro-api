import prismaClient from "../../prisma";
import Stripe from "stripe";

interface CreatePortalRequest{
    user_id: string;
}

class CreatePortalService{
    async execute({ user_id }: CreatePortalRequest){

        const stripe = new Stripe(
            process.env.STRIPE_SECRET_KEY,
            {
                apiVersion: '2024-04-10',
                appInfo: {
                    name: 'saloonpro',
                    version: '1.0'
                }
            }
        )

        const findUser = await prismaClient.user.findFirst({
            where:{
                id: user_id
            }
        })

        let sessionId = findUser.stripe_customer_id

        if(!sessionId){
            console.log("DOES NOT HAVE AN ID")
            return { message: 'User not found'}
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: sessionId,
            return_url: process.env.STRIPE_SUCESS_URL
        })

        return { sessionId: portalSession.return_url }
    }
}

export { CreatePortalService }
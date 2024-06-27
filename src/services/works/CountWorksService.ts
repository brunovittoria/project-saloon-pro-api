import prismaClient from "../../prisma";

interface CountRequest{
    user_id: string
}

class CountWorksService{
    async execute( { user_id }: CountRequest ){
        
        const count = await prismaClient.haircut.count({        //Iremos contar somente os serviços que o user for proprietario
            where: {
                user_id: user_id
            }
        })

        return count
    }
}

export { CountWorksService }
import prismaClient from "../../prisma";

interface UserRequest{          //Criamos uma interface exigindo que nos seja enviado esses dados pelo controller que ira receber por sua vez do FE
    user_id: string
    name: string
    adress: string
}

class UpdateUserService{
    async execute({user_id, name, adress}:UserRequest ){

        try{
            const userAlreadyExists = await prismaClient.user.findFirst({
                where:{
                    id: user_id
                }
            })

            if(!userAlreadyExists){
                throw new Error("User not exists!")
            }

            const userUpdated = await prismaClient.user.update({
                where:{
                    id: user_id
                },
                data:{
                    name,
                    adress,
                },
                select:{
                    name: true,
                    email: true,
                    adress: true,
                }
            })

            return userUpdated

        } catch(err){
            console.log(err)
            throw new Error("Error on updating user")
        }

    }
}

export { UpdateUserService }
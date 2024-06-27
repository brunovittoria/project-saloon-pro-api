import prismaClient from "../../prisma"
import { hash } from "bcrypt"

// Aqui criamos uma regra que estamos esperando que o user mande as seguintes infos: 

interface UserRequest{
    name: string,
    email: string, 
    password: string
}


class CreateUserService {
    async execute({ name, email, password}: UserRequest){
        
        if(!email){
            throw new Error("Email Incorrect")                               //Primeiramente fazemos essa verificaçao para caso o email esteja incorreto 
        }

        const userAlreadyExists = await prismaClient.user.findFirst({       //Segundamente verificamos se o user email ja existe no DB
            where:{
                email: email
            }
        })

        if(userAlreadyExists){                                             //Armazenamos a var do user existente e jogamos o seguinte erro                                 
            throw new Error("User/Email already exists")
        }

        const passwordHash = await hash(password, 8)                       //8 é a força da criptografia

        const user = await prismaClient.user.create({                     //Aqui criamos o user no DB
            data:{
                name: name,
                email: email,
                password: passwordHash
            },
            select:{                                                     //Com o select escolhemos os dados que iremos retornar para o FE, pra evitar de mandar dados sensiveis
                id: true,                                                //Quando cadastrar nao queremos devolver a senha criptografada para o FE
                name: true,
                email: true
            }
        })

        return user                                                       //Damos como return o user pois quem vai pegar esse valor é o controller e ele vai retornar esse valor pro frontend via res.json
    }
}

export {CreateUserService}
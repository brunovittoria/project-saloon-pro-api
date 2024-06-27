import prismaClient from "../../prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken"

//Usamos o interface com o TS para obrigar que nos seja mandado os dados citados, aqui determinamos um "contrato"
interface AuthUserRequest{
    email: string,
    password: string,
}

class AuthUserService{
    async execute({ email, password }: AuthUserRequest){
        
        const user = await prismaClient.user.findFirst({  //Busca usuarios no nosso DB
            where: {
                email: email                             //Onde o email seja o equivalente ao do DB comparado ao enviado pelo user no FE
            },
            include:{
                subscriptions: true,                     //Inclui a assinatura
            }
        }) 

        if(!user){                                      //Se nao existir um usuario 
            throw new Error("Email/Password Incorrect") //OBS: Colocamos email/senha incorretos por questoes de segurança, afinal nao queremos falar para um hacker q ele acertou o email mas a senha esta errada
        }

        // Verificar se a senha esta correta com a do usuario no DB que tem o mesmo email
        const passwordMatch = await compare(password, user?.password)  //No seu caso, user?.password, se user for nulo ou indefinido, a expressão inteira será avaliada como undefined em vez de causar um erro de "cannot read property 'password' of null". Isso é útil para lidar com objetos aninhados em situações em que nem sempre todas as propriedades são garantidas. 

        if(!passwordMatch){
            throw new Error("Email/Password incorrect")
        }

        //Proximo passo sera gerar um token JWT
        const token = sign(                             // Cria um objeto contendo informações do usuário (payload do token)
            {
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,                       // Gera um token JWT usando a chave secreta do ambiente, com um ID de usuário como assunto e expiração em 30 dias
                expiresIn: '30d'
            }
        )

        return { 
            id: user?.id,
            name: user?.name,
            email: user?.email,
            adress: user?.adress,
            token: token,
            subscriptions: user?.subscriptions ? {          //Fazemos um condicional no caso em que exista uma subscription ativa
                id: user?.subscriptions?.id,
                status: user?.subscriptions?.status
            } : null                                        //Caso nao encontre uma inscriçao ativa, retorna o STATUS NULL, isso ira servir para ALERTS de renovo de assinatura no FE 
        }
    }
}

export { AuthUserService }
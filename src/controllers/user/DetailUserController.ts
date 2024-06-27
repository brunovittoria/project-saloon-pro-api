import { Request, Response, response } from "express";
import { UserDetailService} from "../../services/user/UserDetailService";

class DetailUserController{
    async handle(request: Request, response: Response){

        const user_id = request.user_id //Pegamos do front o dado do ID do user.

        const userDetailService = new UserDetailService()

        const detailUser = await userDetailService.execute(user_id)

        return response.json(detailUser)
    }
}

export { DetailUserController }
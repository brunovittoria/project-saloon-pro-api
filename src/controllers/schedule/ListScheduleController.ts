import { ListScheduleService } from "../../services/schedule/ListScheduleService";
import { Request, Response } from "express";

class ListScheduleController{
    async handle(request: Request, response: Response){
        const user_id = request.user_id

        const listSchedule = new ListScheduleService()

        const schedule = await listSchedule.execute({
            user_id
        })

        return response.json(schedule)
    }
}

export { ListScheduleController }
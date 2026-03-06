import { getDataF, getListUser } from "../models/driver.models.mjs";
import { AppError } from "../utils/AppError.mjs";


export const getDataForm = async(request, response, next) =>{
    try {
        const id = request.auth.id;
        const data = await getDataF(id);
        const info = data[0]
        response.json({ok: true, message: info});
    } catch (error) {
        next(error)
    }
}

export const getListUserReservations = async(request, response, next) =>{
    try {
        const id = request.params.id;
        console.log(id)
        const list = await getListUser(id);
        console.log(list)
        response.json({ok:true, message: "Success", list:list})
    } catch (error) {
        next(error)
    }
}
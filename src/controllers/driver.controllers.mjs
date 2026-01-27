import { getDataF } from "../models/driver.models.mjs";
import { AppError } from "../utils/AppError.mjs";


export const getDataForm = async(request, response) =>{
    try {
        const id = request.auth.id;
        const data = await getDataF(id);
        const info = data[0]
        response.json({ok: true, message: info});
    } catch (error) {
        next(error)
    }
}
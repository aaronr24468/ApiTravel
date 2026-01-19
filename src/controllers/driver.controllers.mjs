import { getDataF } from "../models/driver.models.mjs";


export const getDataForm = async(request, response) =>{
    try {
        const id = request.auth[0].id;
        const data = await getDataF(id);
        response.status(200).json(data[0]);
    } catch (e) {
        console.error(e);
        response.status(500).json({message: "Error de servidor"})
    }
}
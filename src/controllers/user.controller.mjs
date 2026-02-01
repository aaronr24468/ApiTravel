import { getInfo } from "../models/user.models.mjs";
import { AppError } from "../utils/AppError.mjs";

export const getDataUser = async (request, response, next) => {
    try {
        const data = {
            show: request.params.data,
            id: request.auth.id
        }

        if (data.show === "navBar") {
            const users = await getInfo(data);

            if(!users.length) throw new AppError('Credenciales no validas', 401)

            const userInfo = {
                image: users[0].image,
                username: users[0].username,
                rol: request.auth.rol
            }
            
            response.json({ok: true, message: userInfo})
        } else if (data.show === "profile") {

        }
    } catch (error) {
        next(error)
    }
}

export const checkAccount = async (request, response, next) => {
    try {
        const token = request.cookies.travelToken;
        if(!token) throw new AppError('No tienes permisos', 403)
        response.json({ ok: true })
    } catch (error) {
        next(error)
    }
}
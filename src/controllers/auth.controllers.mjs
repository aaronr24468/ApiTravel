import { AppError } from "../utils/AppError.mjs";

export const logOut = (request, response, next) => {
    try {
        response.clearCookie('travelToken', {
            secure: true,
            sameSite: "lax"
        });
        response.json({ok: true,  logout: true });
    } catch (error) {
        next(error)
    }
}

export const checkAccount = async (request, response, next) => {
    try {
        const token = request.cookies.travelToken;
        //console.log(data)
        response.json({ok: true, login: true })
    } catch (error) {
        next(error)
    }
} 



export const verifyU = (request, response, next) => {
    try {
        response.json({ driver: true })
    } catch (error) {
        next(error)
    }
}
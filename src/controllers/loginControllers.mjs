import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { getUser } from '../models/loginModels.mjs';
import { AppError } from '../utils/AppError.mjs';

export const getToken = async(request, response, next) =>{
    try {
        const {username, password} = request.body;
        
        if(!username || !password){
            throw new AppError("Username y password requeridos", 400)
        }

        const users = await getUser(username); //optenemos el usuario por username
    
        if(!users.length){
            throw new AppError('no existe usuario', 401)
        }

        const user = users[0]

        const result = await bcrypt.compare(password, user.password) //comparamos la contra del usuario con la del hash que se tiene en la BD

        if(!result){ //si el result da true es que la contra es igual a la de la BD si no es porque se escribio mal
            throw new AppError('Error de contraseña', 401)
        }

        const payload = {
            id: user.id,
            rol: user.rol
        }

        
        const token = jwt.sign(payload, 'secret',{
            expiresIn: "1d"
        })


        response.cookie('travelToken', token,{
            httpOnly: true,
            secure: true,
            sameSite: "none",
            partitioned: true
        })

        response.json({ok: true, message: "Login exitoso"})

    } catch (error) {
        next(error)
    }
}
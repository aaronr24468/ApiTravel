import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { getUser } from '../models/loginModels.mjs';

export const getToken = async(request, response) =>{
    try {
        const data = {
            username: request.body.username,
            password: request.body.password
        }
        const user = await getUser(data); //optenemos el usuario

        const result = await bcrypt.compare(data.password, user[0].password) //comparamos la contra del usuario con la del hash que se tiene en la BD

        if(result === true){ //si el result da true es que la contra es igual a la de la BD si no es porque se escribio mal
            const payload = {...user};
            delete payload[0].password; //quitamos la contra para no pasarla con el token
            const token = jwt.sign(payload, 'secret'); //creamos el token
            console.log(token)
            response.cookie('token', token,{
                httpOnly: true,
                secure: true,
                sameSite: "none",
                partitioned: true
            })
            const sendData = {username: payload[0].username, image: payload[0].image, status: 'S'} 
            response.status(200).json(sendData) //lo mandamos como respuesta si todo sale bien para guardarlo en localhost
        }else{
            response.status(401).json('Incorrect password');
        }
    } catch (e) {
        console.error(e);
        response.status(401).json('User not found');
    }
}
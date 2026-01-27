
import bcrypt from 'bcrypt';
import cloudinary from '../utils/cloudinary.mjs';
import { getIdUser, getUserId, registerU, setImageD, setImageUser } from '../models/registerModels.mjs';
import { AppError } from '../utils/AppError.mjs';

export const registerUser = async (request, response, next) => {
    try {
        const saltRounds = 10;
        
        const data = {
            name: request.body.name,
            lastname: request.body.lastname,
            age: request.body.age,
            username: request.body.username,
            password: request.body.password,
            image: '',
            phone: request.body.phone,
            rol: 'user'
        }

        if(
            !data.name ||
            !data.lastname ||
            !data.age ||
            !data.username ||
            !data.password ||
            !data.phone
        ){
            throw new AppError("Falta informacion", 400)
        }

        const hashP = await bcrypt.hash(data.password, saltRounds);

        data.password = hashP;

        const res = await registerU(data);
        const id = res[0].insertId;

        if (res === "MATCH") {
            throw new AppError("User already exist", 409)
        } else {
            console.log("entro")
            response.json({ok: true, message: "Se registro con exito", id: id})
        }
    } catch (error) {
        next(error)
    }
}  

export const setImage = async (request, response, next) => {
    try {
        const id = request.params.id;
        console.log(id)

        if(!request.file){
            throw new AppError("No se envio ninguna imagen", 403)
        }

        const result = await new Promise((resolve, reject) =>{
            cloudinary.v2.uploader.upload_stream(
                {
                    folder: 'Viajes/users',
                    overwrite: true,
                    public_id: `user_${id}`
                },
                (err, result) =>{
                    if(err) reject(err);
                    else resolve(result);
                }
            ).end(request.file.buffer)
        })

        const data = {
            id: id,
            url: result.secure_url
        };

        const res = await setImageUser(data)

        if(res.affectedRows === 0 ) throw new AppError("Error de servidor", 403)

        response.json({ok: true, message:"Success"})

    } catch (error) {
        next(error)
    }
}



// falta agregar el registro del conductor////////////////////////////////////////////////////////////////////////


export const registerDriver = async (request, response, next) => {
    try {
        const saltRounds = 10;
        const data = {
            name: request.body.name,
            lastname: request.body.lastname,
            age: request.body.age,
            username: request.body.username,
            password: request.body.password,
            image: '',
            phone: request.body.phone,
            rol: 'driver'
        }
        const hashP = await bcrypt.hash(data.password, saltRounds);
        data.password = hashP;
        await registerU(data);
        response.status(200).json('S')
    } catch (e) {
        console.error(e)
        response.status(401).json('F')
    }
}

export const setImageDriver = async (request, response, next) => {
    try {
        const data = {
            username: request.params.username,
            url: `http://localhost:8080/driversPhotos/${request.file.filename}`
        };
        await setImageD(data);
        response.status(200).json('S')
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}
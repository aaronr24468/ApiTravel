
import bcrypt from 'bcrypt';
import cloudinary from '../methods/cloudinary.mjs';
import { getIdUser, registerU, setImageD, setImageUser } from '../models/registerModels.mjs';

export const registerUser = async (request, response) => {
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
        const hashP = await bcrypt.hash(data.password, saltRounds);
        data.password = hashP;
        const res = await registerU(data);
        if (res === "MATCH") {
            response.status(200).json('M')
        } else {
            response.status(200).json('S')
        }
    } catch (e) {
        console.error(e)
        response.status(401).json('F')
    }
}

export const setImage = async (request, response) => {
    try {
        const username = request.params.username;
        const id = await getIdUser(username)
        if(!id[0].id || id[0].id.length === 0){
            response.status(400).json({message: "User not found"})
        }

        if(!request.file){
            response.status(400).json({message: 'No se envio ninguna imagen'})
        }

        const result = await new Promise((resolve, reject) =>{
            cloudinary.v2.uploader.upload_stream(
                {
                    folder: 'Viajes/users',
                    overwrite: true,
                    public_id: `user_${id[0].id}`
                },
                (err, result) =>{
                    if(err) reject(err);
                    else resolve(result);
                }
            ).end(request.file.buffer)
        })
        const data = {
            username: request.params.username,
            url: result.secure_url
        };

        await setImageUser(data)
        response.status(200).json('S')

    } catch (e) {
        console.error(e)
        response.status(401).json('F')
    }
}


export const registerDriver = async (request, response) => {
    try {
        const saltRounds = 10;
        const data = {
            name: request.body.name,
            lastname: request.body.lastname,
            age: request.body.age,
            username: request.body.username,
            password: request.body.password,
            image: '',
            driver: 'true',
            cars: ''
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

export const setImageDriver = async (request, response) => {
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

import bcrypt from 'bcrypt';
import { registerU, setImageD, setImageUser } from '../models/registerModels.mjs';

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
            phone: request.body.phone
        }
        const hashP = await bcrypt.hash(data.password, saltRounds);
        data.password = hashP;
        const res = await registerU(data);
        if (res === "MATCH") {
            response.status(200).json('M')
        } else {
            response.status(200).json('S')
        }
        response.status(200).json('S')
    } catch (e) {
        console.error(e)
        response.status(401).json('F')
    }
}

export const setImage = async (request, response) => {
    try {
        const data = {
            username: request.params.username,
            url: `http://localhost:8080/profilePhotos/${request.file.filename}`
        }
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
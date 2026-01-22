import { getListCars, getVehicleByIdAndUser, saveCarInfo, uploadCarImage } from "../models/vehicle.models.mjs";
import cloudinary from "../middleware/cloudinary.mjs";

export const registCarInfo = async (request, response) => {
    try {

        const dataCar = {
            driver_id: request.auth[0].id,
            brand: request.body.brand,
            model: request.body.model,
            color: request.body.color,
            plates: request.body.plates,
            insured: request.body.insured,
            year: request.body.year,
            seats: request.body.seats,
            img_Vehicle: ''
        };
        const res = await saveCarInfo(dataCar);
        if (res.affectedRows === 0) {
            return response.status(400).json({ upload: false });
        }
        return response.status(201).json({ vehicule_id: true, "vehicle_id": res[0].insertId });

    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const uploadVehiclePhoto = async (request, response) => {
    try {
        const data = {
            vehicle_id: request.params.idCar,
            url: ''
        }
        const vehicle = await getVehicleByIdAndUser(data.vehicle_id, request.auth[0].id);
        //console.log(vehicle)
        if(vehicle.length === 0){
            return response.status(403).json({message: "Forbidden"})
        }
        const url = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({
                folder: '/Viajes/vehicles',
                public_id: `driver_${data.vehicle_id}_${Date.now()}`
            },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result)
                }
            ).end(request.file.buffer)
        })
        data.url = url.secure_url;
        const res = await uploadCarImage(data)
        if (res.affectedRows === 0) {
            return response.status(500).json({ upload: false })
        }
        response.status(200).json({ upload: true })


    } catch (e) {
        console.error(e);
        response.status(500).json({message: "Error de servidor"})
    }
}

export const listCars = async(request, response) =>{
    try {
        const idDriver = request.auth[0].id;
        const cars = await getListCars(idDriver);
        if(cars.length === 0){
            return response.status(403).json({message: "No cars"})
        }
        response.status(200).json(cars)
    } catch (e) {
        console.error(e);
        response.status(500).json({message: "Error de servidor"})
    }
}
import { getListCars, getVehicleByIdAndUser, saveCarInfo, uploadCarImage } from "../models/vehicle.models.mjs";
import cloudinary from "../utils/cloudinary.mjs";
import { AppError } from "../utils/AppError.mjs";

export const registCarInfo = async (request, response, next) => {
    try {
        const dataCar = {
            driver_id: request.auth.id,
            brand: request.body.brand,
            model: request.body.model,
            color: request.body.color,
            plates: request.body.plates,
            insured: request.body.insured,
            year: request.body.year,
            seats: request.body.seats,
        };
        console.log(dataCar)

        if(
            !dataCar.brand ||
            !dataCar.model ||
            !dataCar.color ||
            !dataCar.plates ||
            !dataCar.insured ||
            !dataCar.year ||
            !dataCar.seats
        ){
            throw new AppError("Faltan datos", 400)
        }

        const res = await saveCarInfo(dataCar);
        
        if (res.affectedRows === 0) {
            return response.status(400).json({ upload: false });
        }
        return response.json({ ok: true, "message": res[0].insertId });

    } catch (error) {
        next(error)
    }
}

export const uploadVehiclePhoto = async (request, response, next) => {
    try {
        const data = {
            vehicle_id: request.params.idCar,
            url: ''
        }
        const vehicle = await getVehicleByIdAndUser(data.vehicle_id, request.auth.id);
        //console.log(vehicle)

        if(!vehicle.length) throw new AppError("Car not found", 400);

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

        if(!url.secure_url.length) throw new AppError('Error al subir imagen', 500)

        data.url = url.secure_url;

        const res = await uploadCarImage(data)

        if (res.affectedRows === 0) {
            throw new AppError('Error de mysql', 500)
        }
        response.json({ok: true, message: true })


    } catch (error) {
        next(error)
    }
}

export const listCars = async(request, response, next) =>{
    try {
        const idDriver = request.auth.id;
        const cars = await getListCars(idDriver);
        if(!cars.length)throw new AppError("Cars not found", 403);
        response.json({ok: true, message: cars})
    } catch (error) {
        next(error)
    }
}
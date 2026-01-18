import { saveCarInfo, uploadCarImage } from "../models/vehicle.models.mjs";

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
            seats: request.body.seats
        };
        const res = await saveCarInfo(dataCar);
        if (res.affectedRows === 0) {
            return response.status(400).json({ upload: false });
        }
        return response.status(201).json({ vehicule_id: true, "vehicle_id": res.insertId });

    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const uploadVehiclePhoto = async (request, response) => {
    try {

        const url = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({
                folder: '/Viajes/vehicles',
                overwrite: true,
                public_id: request.auth[0].id
            },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result)
                }
            ).end(request.file.buffer)
        })
        const data = {
            vehicle_id: request.params.idCar,
            url: url.secure_url
        }
        const res = await uploadCarImage(data)

        if (res.affectedRows === 0) {
            response.status(500).json({ upload: false })
        }
        response.status(200).json({ upload: true })


    } catch (e) {

    }
}
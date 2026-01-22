import cloudinary from "../middleware/cloudinary.mjs";
import { getImageUserT, setImageTrip, setTripDriver } from "../models/trip.models.mjs";


export const setTrip = async (request, response) => {
    try {
        const dataTrip = {
            driver_id: request.auth[0].id,
            vehicule_id: request.body.vehicle_id,
            origin_city: request.body.origin_city,
            destination_city: request.body.destination_city,
            departure_date: request.body.departure_date,
            available_seats: request.body.available_seats,
            price: request.body.price,
            status: true,
            starting_point: request.body.starting_point,
            image_origin: request.body.image_origin,
            image_destination: request.body.image_destination
        }
        const res = await setTripDriver(dataTrip)
        if (res.affectedRows === 0) {
            return response.status(403).json({ message: 'Error de mysql' })
        }
        response.status(200).json({ message: "Success", id_trip: res.insertId})
    } catch (e) {
        console.error(e);
        response.status(500).json({ message: "Error de servidor" })
    }
}

export const uploadTripImages = async (request, response) => {
    try {
        const url = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({
                folder: '/Viajes/trips',
                overwrite: true,
                public_id: `trip_${request.auth[0].id}_${Date.now()}`
            },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result)
                }
            ).end(request.file.buffer)
        })
        const result = await setImageTrip({url: url.secure_url, id_user: request.auth[0].id, city: request.params.city});
        if(result.affectedRows === 0){
            return response.status(403).json({message: 'Error de mysql'})
        }
        response.status(200).json({message: 'Success'})
    } catch (e) {
        console.error(e);
        response.status(500).json({ message: 'Error de servidor' })
    }
}

export const getImageUserTrips = async(request, response) =>{
    try {
        const user_id =  request.auth[0].id;
        const listImg = await getImageUserT(user_id);

        if(listImg.length === 0 ){
            return response.status(403).json({message: 'Not images'})
        }
        response.status(200).json({message: "Success", listImg})
    } catch (e) {
        console.error(e);
        response.status(500).json({message: "Error de servidor"})
    }
}
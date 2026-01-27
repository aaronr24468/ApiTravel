import cloudinary from "../utils/cloudinary.mjs";
import { cityImage, getCityI, getDataT, getImageUserT, getList, setImageTrip, setTripDriver } from "../models/trip.models.mjs";
import { AppError } from "../utils/AppError.mjs";

export const setTrip = async (request, response, next) => {
    try {
        const dataTrip = {
            driver_id: request.auth.id,
            vehicule_id: request.body.vehicle_id,
            origin_city: request.body.origin_city,
            destination_city: request.body.destination_city,
            departure_date: request.body.departure_date,
            available_seats: request.body.available_seats,
            price: request.body.price,
            status: true,
            starting_point: request.body.starting_point,
            image_origin: request.body.image_origin,
            image_destination: request.body.image_destination,
            image_city: request.body.city_image
        }
    

        if(
            !dataTrip.vehicule_id ||
            !dataTrip.origin_city ||
            !dataTrip.destination_city ||
            !dataTrip.departure_date ||
            !dataTrip.available_seats == null ||
            !dataTrip.price ||
            !dataTrip.starting_point ||
            !dataTrip.image_destination ||
            !dataTrip.image_origin ||
            !dataTrip.image_city
        ){
            throw new AppError('Faltan datos', 400)
        }

        const res = await setTripDriver(dataTrip)

        if (res.affectedRows === 0) {
            throw new AppError("Error de mysql", 403)
        }

        response.json({ok: true, message: "Success", id_trip: res.insertId})
    } catch (error) {
        next(error)
    }
}

export const uploadTripImages = async (request, response, next) => {
    try {
        const url = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({
                folder: '/Viajes/trips',
                overwrite: true,
                public_id: `trip_${request.auth.id}_${Date.now()}`
            },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result)
                }
            ).end(request.file.buffer)
        })
        const result = await setImageTrip({url: url.secure_url, id_user: request.auth.id, city: request.params.city});
        
        if(result.affectedRows === 0) throw new AppError("Error mysql");

        response.json({ok: true, message: 'Success'})
    } catch (error) {
        next(error)
    }
}

export const getImageUserTrips = async(request, response, next) =>{
    try {
        const user_id =  request.auth.id;

        const listImg = await getImageUserT(user_id);

        if(listImg.length === 0 ) throw new AppError("Not images", 403)
        
        response.json({ok: true, message: "Success", listImg})
    } catch (error) {
        next(error)
    }
}

export const getListTravel = async(request, response, next) =>{
    try {
        const list = await getList();
        if(list.length === 0){
            return response.status(403).json({message: "no trips"})
        }
        const dataList = [];

        for(let listD of list){
            const arrDate = listD.departure_date.split("T")
            const splitYearData = arrDate[0].split("-")
            dataList.push({
                imageCity: '',
                id: listD.id,
                origin: listD.origin_city,
                destination: listD.destination_city,
                available_seats: listD.available_seats,
                price: listD.price,
                day: splitYearData[2],
                month: splitYearData[1],
                year: splitYearData[0],
                hour: arrDate[1],
                city_image: listD.city_image
            })
        }
        response.json({ok: true, message: "Success", list: dataList})
    } catch (error) {
        next(error)
    }
}

export const uploadCityImage = async(request, response, next) =>{
    try {
        const data = {
            city: request.params.city,
            url: ''
        }

        if(!data.city || !request.file.buffer) throw new AppError("Faltan campos", 403);

        const url = await new Promise((resolve, reject) =>{
            cloudinary.v2.uploader.upload_stream({
                folder: '/Viajes/destination_image',
                overwrite: true,
                public_id: `image_${data.city}`
            },(err, result) =>{
                if(err) reject(err);
                else resolve(result);
            }
            ).end(request.file.buffer)
        })

        if(!url.secure_url) throw new AppError("No se pudo subir la imagen", 401);
        else data.url = url.secure_url;

        const mysqlRes = await cityImage(data);

        if(mysqlRes.affectedRows === 0) throw new AppError('No se pudo subir la informacion', 403)
        
        response.json({ok: true, message: "Success"})

    } catch (error) {
        next(error)
    }
}

export const getCityImages = async(request, response, next) =>{
    try {
        const cityImages = await getCityI();
        
        if(!cityImages.length) throw new AppError('Error de mysql para obtener informacion', 403);

        response.json({ok: true, message: 'Success', cityImages})
    } catch (error) {
        next(error)
    }
}

export const getDataTrip = async(req, res, next) =>{
    try {   
        const {id} = req.params;
        if(!id) throw new AppError('No seleccionaste nada', 403);

        const trip = await getDataT(id)

        const timeArr = trip[0].departure_date.split('T');
        const splitD = timeArr[0].split('-')

        const date = {
            day: splitD[2],
            month: splitD[1],
            year: splitD[0],
            hour: timeArr[1]
        }

        delete trip[0].departure_date
        trip[0].day = date.day
        trip[0].month = date.month
        trip[0].year = date.year
        trip[0].hour = date.hour

        res.json({ok: true, message: "Success", trip})
    } catch (error) {
        next(error)
    }
}   
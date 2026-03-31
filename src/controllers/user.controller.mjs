import { previousReview, setReview, verifyArrivedHour } from "../models/trip.models.mjs";
import { getInfo, getListTravelsDriver, getMyR, getProfileDriverInfo, getProfileUserInfo, setIdS } from "../models/user.models.mjs";
import { AppError } from "../utils/AppError.mjs";

export const getDataUser = async (request, response, next) => {
    try {
        const data = {
            show: request.params.data,
            id: request.auth.id
        }

        if (data.show === "navBar") {

            const users = await getInfo(data);

            if(!users.length) throw new AppError('Credenciales no validas', 401)

            const userInfo = {
                image: users[0].image,
                username: users[0].username,
                rol: request.auth.rol
            }
            response.json({ok: true, message: userInfo})

        } else if (data.show === "profile") {

            const rol = request.auth.rol
            const id = request.auth.id;
            const data = await (rol === "user"? (getProfileUserInfo(id)):(getProfileDriverInfo(id)));
            const info = data[0]
            response.json({ok: true, message: "Success", data:info})

        }
    } catch (error) {
        next(error)
    }
}

export const checkAccount = async (request, response, next) => {
    try {
        const token = request.cookies.travelToken;
        if(!token) throw new AppError('No tienes permisos', 403)
        response.json({ ok: true })
    } catch (error) {
        next(error)
    }
}

export const getMyReservations = async(request, response, next) =>{
    try {
        const {id} = request.auth;
  
        const data = await getMyR(id);

        if(!data.length) throw new AppError('No contienes ningun viaje', 403);

        for(let trip of data){
            const dateArr = trip.departure_date.split('-')

            const day = dateArr[2];
            const month = dateArr[1];
            const year = dateArr[0]

            delete trip.departure_date

            trip.day = day;
            trip.month = month;
            trip.year = year;
        }

        response.json({ok: true, message: 'Success', trips: data.reverse()})
    } catch (error) {
        next(error)
    }
}

export const setIdStripe = async(request, response, next) =>{
    try {
        const id = request.auth.id;
        const stripeId =  request.body.stripeId;

        if(!stripeId) throw new AppError("Necesitas insertar Stripe ID", 401);

        if(!stripeId.startsWith('acct_')) throw new AppError("El id no es valido", 403)

        const resUpdate = await setIdS(id, stripeId)

        if(resUpdate.affectedRows === 0) throw new AppError("No se pudo guardar ID", 400)

        response.json({ok: true, message: "Se guardo ID con exito"})
    } catch (error) {
        next(error)
    }
}

export const driverTravelList = async(request, response, next) =>{
    try {
        const idDriver = request.auth.id;
        const listT = await getListTravelsDriver(idDriver);
        response.json({ok: true, message: 'Success', list: listT})
    } catch (error) {
        next(error)
    }
}

export const setReviewDriver = async(request, response, next) =>{
    try {
        const data = {
            id: request.body.id, //identificador del viaje
            id_user: request.auth.id, //identificador del usuario
            id_driver: '',
            qualification: request.body.qualification, //calificacion del viaje
            msg: request.body.msg //mensaje para el review
        }

        //verificar si tenemos una review de el viaje con el data.id para evitar hacer reviews de mas

        //en progreso

        if(!data.qualification || !data.msg)throw new AppError('Falta informacion', 400);

        const id = data.id;

        const hourVefify = await verifyArrivedHour(id)

        if(!hourVefify.length)throw new AppError('Aun no es la hora de llegada', 401);

        const reviewPre = await previousReview(data);

        if(reviewPre) throw new AppError('Ya comentaste en este viaje', 402);

        data.id_driver = hourVefify[0].driver_id;

        const reviewSet = await setReview(data)

        if(reviewSet.affectedRows === 0) throw new AppError('Error al guardar informacion', 403);

        response.json({ok: true, message: "Calificacion exitosa"})

    } catch (error) {
        
        next(error)
    }
}
import { connectionDB } from '../connectionDB/connection.mjs';

export const saveCarInfo = async(data) =>{
    const query = 'INSERT INTO vehicles(driver_id, brand, model, color, plates, insured, year, seats, img_vehicle)values(?,?,?,?,?,?,?,?,?)';
    const responseDB = await connectionDB.query(query, [data.driver_id, data.brand, data.model, data.color, data.plates, data.insured, data.year, data.seats, '']);
    return(responseDB) 
}

export const uploadCarImage = async(data) =>{
    const query = 'UPDATE vehicles SET img_vehicle=? WHERE id=?';
    const responseDB = await connectionDB.query(query, [data.url, data.vehicle_id])
    return(responseDB)
}

export const getVehicleByIdAndUser = async(vehicle_id, idUser) =>{
    const query = 'SELECT * FROM vehicles WHERE id=? AND driver_id=?';
    const [vehicle] = await connectionDB.query(query, [vehicle_id, idUser])
    return(vehicle)
}

export const getListCars = async(idDriver) =>{
    const query = 'SELECT * FROM vehicles WHERE driver_id=?';
    const [cars] =  await connectionDB.query(query, [idDriver]);
    return(cars)
}
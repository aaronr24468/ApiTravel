import { connectionDB } from '../connectionDB/connection.mjs';

export const saveCarInfo = async(data) =>{
    const query = 'INSERT INTO vehicles(driver_id, brand, model, color, plates, insured, year, seats)values(?,?,?,?,?,?,?,?)';
    const responseDB = await connectionDB.query(query, [data.driver_id, data.brand, data.model, data.color, data.plates, data.insured, data.year, data.seats]);
    return(responseDB) 
}

export const uploadCarImage = async(data) =>{
    const query = 'INSERT INTO vehicles_images(vehicle_id, image_url) values(?,?)';
    const responseDB = await connectionDB.query(query, [data.vehicle_id, data.url])
    return(responseDB)
}
import { connectionDB } from "../connectionDB/connection.mjs";

export const setTripDriver = async (data) => {
    const query = 'INSERT INTO trips(driver_id, vehicule_id, origin_city, destination_city, departure_date, available_seats, price, status, starting_point, image_origin, image_destination) values(?,?,?,?,?,?,?,?,?,?,?)';
    const [res] = await connectionDB.query(query, [data.driver_id, data.vehicule_id, data.origin_city, data.destination_city, data.departure_date, data.available_seats, data.price, data.status, data.starting_point, data.image_origin, data.image_destination]);
    return (res)
}

export const setImageTrip = async (data = {}) => {
    const query = 'INSERT INTO trips_images(id_user, city, image)values(?,?,?)';
    const res = await connectionDB.query(query, [data.id_user, data.city, data.url])
    return (res)
}

export const getImageUserT = async(user_id) =>{
    const query = 'SELECT * FROM trips_images WHERE id_user=?';
    const [listImg] = await connectionDB.query(query, [user_id]) 
    return(listImg)
}
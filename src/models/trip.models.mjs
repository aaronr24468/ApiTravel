import { connectionDB } from "../connectionDB/connection.mjs";

export const setTripDriver = async (data) => {
    const query = `INSERT INTO trips(
    driver_id, 
    vehicule_id, 
    origin_city, 
    destination_city,
    departure_date, 
    available_seats, 
    price, 
    status, 
    starting_point,
    destination_point,
    departure_hour,
    arrived_hour,
    city_image) 
    values(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const [res] = await connectionDB.query(query,
        [data.driver_id,
        data.vehicule_id,
        data.origin_city,
        data.destination_city,
        data.departure_date,
        data.available_seats,
        data.price,
        data.status,
        data.starting_point,
        data.destination_point,
        data.departure_time,
        data.arrived_time,
        data.image_city]
    );
    return (res)
}

export const getList = async () => {
    const query = 'SELECT id, destination_city,origin_city, available_seats, departure_date, price, city_image FROM trips';
    const [trips] = await connectionDB.query(query)
    return (trips)
}

export const cityImage = async (data) => {
    const query = 'INSERT INTO city_images(city, image)values(?,?)';
    const [res] = await connectionDB.query(query, [data.city, data.url])
    return (res)
}

export const getCityI = async () => {
    const query = "Select * from city_images";
    const [city] = await connectionDB.query(query);
    return (city)
}

export const getDataT = async (id) => {
    const query = `
    SELECT trips.id,
    trips.driver_id,
    trips.origin_city,
    trips.destination_city,
    trips.departure_date,
    trips.available_seats,
    trips.price,
    trips.starting_point,
    trips.destination_point,
    trips.departure_hour,
    trips.arrived_hour,
    trips.city_image, 
    users.name, 
    users.age, 
    users.image, 
    vehicles.img_vehicle, 
    vehicles.color,
    vehicles.brand,
    vehicles.model,
    vehicles.plates FROM trips 
    INNER JOIN users ON driver_id = users.id 
    INNER JOIN vehicles ON vehicule_id = vehicles.id where trips.id = ?`;
    const [trip] = await connectionDB.query(query, [id])
    return (trip)
}
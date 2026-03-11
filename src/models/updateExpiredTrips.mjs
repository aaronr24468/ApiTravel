import { connectionDB } from "../connectionDB/connection.mjs";

export const updateExpiredTrips = async() =>{
    const now = new Date();
    const query = 'UPDATE trips SET status=0, status_trip="expired" WHERE TIMESTAMP(departure_date, departure_hour) <= NOW() AND status=?';
    const trips = await connectionDB.query(query, [1]);
    console.log(trips[0].affectedRows)
    console.log("Viajes actualizados")
}

export const getIdListTravel = async() =>{
    const query =  `SELECT id, price FROM trips WHERE TIMESTAMP(departure_date, departure_hour) <= NOW() AND status='1'`;
    const [list] = await connectionDB.query(query)
    return(list)
}

import { connectionDB } from "../connectionDB/connection.mjs";

export const getDataF = async(id) =>{
    const query = 'SELECT users.name, users.image, users.age FROM users WHERE users.id=?';
    const [data] =  await connectionDB.query(query, [id])
    return(data)
}

export const getListUser = async(id) =>{
    const query = `SELECT
    r.user_id,
    u.name, 
    u.lastname,
    u.image
    FROM reservations r 
    INNER JOIN users u ON r.user_id = u.id
    WHERE r.trip_id=? AND r.payment_status="paid"`

    const [list] =  await connectionDB.query(query, [id])
    return(list)
}
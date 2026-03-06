
import { connectionDB } from '../connectionDB/connection.mjs';

export const getInfo = async(data) =>{
    const query = 'SELECT * FROM users WHERE id=?';
    const [user] = await connectionDB.query(query, [data.id]);
    return(user)
}

export const getMyR = async(id) =>{
    const query = `
    SELECT
    r.id,
    r.trip_id,
    r.payment_status, 
    r.total_amount,
    r.seats_reserved,
    r.trip_completed,
    refund_status,
    t.destination_city,
    t.origin_city,
    t.city_image,
    t.departure_hour,
    t.departure_date
    FROM reservations r
    INNER JOIN trips  t ON r.trip_id = t.id
    where user_id=?;`;
    const [data] = await connectionDB.query(query, [id])
    return(data)
}

export const getProfileUserInfo = async(id) =>{
    const query = 'SELECT u.name, u.age, u.image, u.rol, u.email FROM users u WHERE id=?';
    const [data] = await connectionDB.query(query, [id])
    return(data)
}

export const getProfileDriverInfo = async(id) =>{
    const query = 'SELECT u.name, u.age, u.image, u.rol, u.stripe_account_id, u.stripe_onboarded, u.username, u.email, u.stripe_account_id, u.stripe_onboarded FROM users u WHERE id=?';
    const [data] = await connectionDB.query(query, [id])
    return(data)
}

export const setIdS = async(id, stripeId) =>{
    const query = 'UPDATE users SET stripe_account_id=? WHERE id=?';
    const [res] = await connectionDB.query(query, [stripeId, id])
    return(res)
}


export const getListTravelsDriver = async(id) =>{
    const query = 'SELECT t.id, t.origin_city, t.destination_city, t.departure_date, departure_hour, t.available_seats, t.city_image, t.status  from trips t where driver_id=?'
    const [list] = await connectionDB.query(query, [id])
    return(list)
}

export const getIDstripeDriver = async(id) =>{
    const query = `SELECT u.stripe_account_id FROM users u WHERE id=?`;
    const [stripeId] = await connectionDB.query(query, [id])
    return(stripeId)
}

export const tripCompleted = async(idTrip) => {
    const query = 'UPDATE reservations SET trip_completed=? WHERE trip_id=?';
    const [res] =  await connectionDB.query(query, [1, idTrip]);
    return(res)
}

export const getOnBoardStripe  = async(id) =>{
    const query = 'SELECT u.stripe_onboarded FROM users u WHERE id=?';
    const [data] = await connectionDB.query(query, [id])
    return(data[0])
}

export const updateOnboardingState = async(id) =>{
    const query = 'UPDATE users SET stripe_onboarded=? where stripe_account_id=?';
    const [result] = await connectionDB.query(query, [1, id])
    return(result)
}

export const expireBookings = async() =>{
    const query = `
    UPDATE reservations r   
    JOIN trips t 
    ON t.id = r.trip_id
    SET t.available_seats = t.available_seats + 1, r.payment_status="expired"
    WHERE r.payment_status="pending" AND r.created_at < NOW() - INTERVAL 5 MINUTE`
    await connectionDB.query(query);
    
    // const query2 = `delete FROM reservations WHERE payment_status="expired" AND created_at < NOW() - INTERVAL 5 MINUTE`;
    // await connectionDB.query(query2);
} 
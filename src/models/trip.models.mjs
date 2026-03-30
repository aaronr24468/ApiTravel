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
    const query = 'SELECT id, destination_city,origin_city, available_seats, departure_date, price, city_image, status  FROM trips';
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

export const getPriceTripSeats = async(idTrip) =>{
    const query = 'SELECT price, available_seats FROM trips WHERE id=?';
    const [price] = await connectionDB.query(query, idTrip)
    return(price[0])
}

export const updateSeatsStatus = async(data) =>{
    const query = 'UPDATE trips SET available_seats= available_seats-? WHERE id=? AND available_seats > 0';
    const [res] = await connectionDB.query(query, [data.seats_reserved, data.tripId]);
    return(res)
}

export const pendingPaidUser = async(data) =>{
    const query = `INSERT INTO reservations(
    trip_id, 
    user_id,
    driver_id,
    seats_reserved,
    payment_status,
    total_amount,
    platform_fee,
    driver_amount,
    payment_intent_id,
    agreePolicies
    )values(?,?,?,?,?,?,?,?,?,?)`;
    const [res] = await connectionDB.query(query, [
        data.tripId, 
        data.userId, 
        data.driver_id,
        data.seats_reserved,
        data.payment_status,
        data.total_amount,
        data.platform_fee,
        data.driver_amount,
        data.payment_intent_id,
        data.agreePolicies
    ])

    return(res)
}

export const paidSucceededUser = async (data) =>{
    // const query = `INSERT INTO reservations(
    // trip_id, 
    // user_id,
    // driver_id,
    // seats_reserved,
    // payment_status,
    // total_amount,
    // platform_fee,
    // driver_amount,
    // payment_intent_id,
    // agreePolicies
    // )values(?,?,?,?,?,?,?,?,?,?)`;
    // const [res] = await connectionDB.query(query, [
    //     data.trip_id, 
    //     data.user_id, 
    //     data.driver_id,
    //     data.seats,
    //     data.payment_status,
    //     data.total_amount,
    //     data.platform_fee,
    //     data.driver_amount,
    //     data.payment_intent_id,
    //     data.agreePolicies
    // ])

    const query2 = `UPDATE reservations SET payment_status=?, payment_intent_id=? WHERE user_id=? AND trip_id=?`;
    await connectionDB.query(query2, [data.payment_status, data.payment_intent_id, data.user_id, data.trip_id])
}

export const paymentExist = async(paymtentIntentId) =>{
    const query = 'SELECT payment_intent_id from reservations where payment_intent_id=?';
    const [exist] = await connectionDB.query(query, [paymtentIntentId])
    return(exist)
}

export const updateStatusRefound = async(paymentIntenId, refundId) =>{

    const query = 'UPDATE reservations SET refund_status=?, refund_id=? where payment_intent_id=?';
    await connectionDB.query(query, ['refund', refundId, paymentIntenId])

    const query2 = 'SELECT trip_id FROM reservations WHERE payment_intent_id=?';
    const [res] = await connectionDB.query(query2, [paymentIntenId])

    return(res)
}

export const updateDataTrip = async(trip_id) =>{
    const query = 'UPDATE trips SET available_seats=available_seats + ? WHERE id=?';
    await connectionDB.query(query, [1, trip_id])
}

export const refundExist = async(refund_id) =>{
    const query = 'SELECT refund_id FROM reservations WHERE refund_id=?';
    const [res] = await connectionDB.query(query, [refund_id])
    return(res)
}

export const finishTripUpdate = async(idTrip, idPaid) =>{
    const query = 'UPDATE trips SET status=?, payout=?, idPayout=? WHERE id=?';
    const [resUpdate] = await connectionDB.query(query, [0, 'pending', idPaid, idTrip]);
    return(resUpdate)
}

export const getPriceTrip = async(id) =>{
    const query = `SELECT 
    t.price,
    t.available_seats,
    t.departure_date,
    t.arrived_hour,
    t.idPayout,
    t.status,
    t.payout,
    v.seats
    FROM trips t 
    INNER JOIN vehicles v ON t.vehicule_id = v.id
    WHERE t.id=?`;
    const [price] = await connectionDB.query(query, [id]);
    return(price)
}

export const findTripByTransferId = async(idTrip) =>{
    const query = 'SELECT payout FROM trips WHERE id=?';
    const [result] = await connectionDB.query(query, [idTrip]);
    return(result)
}

export const updateWebhookTransferDriver = async(idPayout) =>{
    const query = `UPDATE trips SET payout=?, payoutDate=CURRENT_TIMESTAMP WHERE idPayout=?`;
    const [result] = await connectionDB.query(query, ['paid', idPayout])
    return(result);
}

export const getPaymentsIntents = async(id_trip) =>{
    const query = 'SELECT r.payment_intent_id from reservations r where trip_id=? AND r.payment_intent_id IS NOT NULL AND r.payment_intent_id != "" ';
    const [payment_ids] = await connectionDB.query(query, [id_trip])
    return(payment_ids)
}
export const canceltripUpdate = async(id) =>{
    const query = 'UPDATE trips SET status=? where id=?';
    const [res] = await connectionDB.query(query, [0, id])
    return(res)
}

export const getStatusTrip = async(id) =>{
    const query = 'SELECT t.status, t.driver_id, t.available_seats, t.price from trips t WHERE id=?';
    const [status] = await connectionDB.query(query, [id]);
    return(status)
}

export const reservationStatus = async(data) =>{
    const query = `SELECT 1 FROM reservations WHERE user_id=? AND trip_id=? AND refund_amount=? AND payment_status=?`;
    const [result] = await connectionDB.query(query, [data.userId, data.tripId, "0.00", 'paid'])
    return(result.length > 0)
}

export const getPaymentStatus = async(data) =>{
    const query = `SELECT payment_status FROM reservations WHERE trip_id=?`;
    const [dataR] =  await connectionDB.query(query, [data.trip_id]);
    return(dataR)
}

export const setInprogressTrip = async(id) =>{
    const query =  `UPDATE trips SET status='3' WHERE id=?`;
    const [result] = await connectionDB.query(query, [id]);
    return(result)
}

export const setInProgressReservation = async(id) =>{
    const query = `UPDATE reservations SET trip_completed=3 WHERE trip_id=?`;
    const [result] = await connectionDB.query(query, [id]);
    return(result)
}

export const checkDateTrip = async(id) =>{
    const query = `SELECT origin_city FROM trips WHERE id=? AND timestamp(departure_date, departure_hour) < now() AND status=1;`
    const result = await connectionDB.query(query, [id]);
    return(result)
}

export const verifyArrivedHour = async(id) =>{
    const query =  `SELECT id, driver_id FROM trips t WHERE id=? AND TIMESTAMP(departure_date, arrived_hour) < NOW()`;
    const [res] =  await connectionDB.query(query, [id]);
    return(res)
}

export const setReview = async(data) =>{
    const query = `INSERT INTO reviews(user_id, driver_id, trip_id, message, qualification) values(?,?,?,?,?)`;
    const [result] = await connectionDB.query(query, [data.id_user, data.id_driver, data.id, data.msg, data.qualification]);
    return(data)
}

export const previousReview = async(data) =>{
    const query = 'SELECT 1 FROM reviews WHERE user_id=? AND trip_id=?';
    const [dataRequest] = await connectionDB.query(query, [data.id_user, data.id])
    return(dataRequest.length > 0);
}

export const verifyReviewUsers = async(idTravel) =>{

    const query = `
    SELECT 1 FROM reviews r 
    INNER JOIN trips t
    ON r.trip_id = t.id
    WHERE trip_id=?`;

    const [res] =  await connectionDB.query(query, [idTravel]);

    return(res.length > 0)
}

export const checkIntervalTrip = async(idTravel) =>{
    const query = `select 1 from trips 
    WHERE id=? 
    AND 
    timestamp(departure_date, arrived_hour) <= NOW() - INTERVAL 2 hour;`

    const [res] = await connectionDB.query(query, [idTravel]);

    return(res.length > 0)
}

export const getReviewsRating = async(idDriver) =>{
    const query = `SELECT avg(r.qualification) as rating, count(*) as total_reviews from reviews r WHERE driver_id=?`;
    const [result] = await connectionDB.query(query, [idDriver]);
    return(result);
}

export const getReviews = async(idTrip) =>{
    const query = `SELECT r.message, r.qualification, u.image, u.username FROM reviews r INNER JOIN users u ON r.user_id = u.id WHERE driver_id=?`;
    const [reviews] =  await connectionDB.query(query, [idTrip]);
    return(reviews)
}

import { connectionDB } from "../connectionDB/connection.mjs";

export const getPrice = () =>{

}

export const getIdIntentAndPrice = async(id) =>{
    const query = 'SELECT payment_intent_id, total_amount, user_id, payment_status FROM reservations where id=?';
    const [data] = await connectionDB.query(query, [id])
    return(data)
}

export const updateRefundStatus = async(amountRe, id) =>{
    const query = 'UPDATE reservations SET refund_status=?, refund_created=CURRENT_TIMESTAMP, refund_amount=? WHERE id=?';
    const [res] = await connectionDB.query(query, ['pending', amountRe, id]);
    return(res)
}

export const updateRefundStatusByPaymentId = async(amount, paymentId) =>{
    const query = 'UPDATE reservations SET refund_status=?, refund_created=CURRENT_TIMESTAMP, refund_amount=? WHERE payment_intent_id=?';
    const [res] = await connectionDB.query(query, ['pending', amount, paymentId])
    return(res)
}
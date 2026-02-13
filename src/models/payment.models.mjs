import { connectionDB } from "../connectionDB/connection.mjs";

export const getPrice = () =>{

}

export const getIdIntentAndPrice = async(id) =>{
    const query = 'SELECT payment_intent_id, total_amount, user_id FROM reservations where id=?';
    const [data] = await connectionDB.query(query, [id])
    return(data)
}

export const updateRefundStatus = async(amountRe, id) =>{
    const query = 'UPDATE reservations SET refund_status=?, refund_created=CURRENT_TIMESTAMP, refund_amount=? WHERE id=?';
    const [res] = await connectionDB.query(query, ['pending', amountRe, id]);
    return(res)
}
import mysql from 'mysql2/promise';
import { connectionDB } from '../connectionDB/connection.mjs';

export const getInfo = async(data) =>{
    const query = 'SELECT * FROM users WHERE id=?';
    const [user] = await connectionDB.query(query, [data.id]);
    return(user)
}
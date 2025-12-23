import mysql from 'mysql2/promise';
import { connectionDB } from '../connectionDB/connection.mjs';

export const checkA = async(data) =>{
    const query = 'SELECT * FROM users WHERE username=?';
    const [user] = await connectionDB.query(query, [data.username])
    return(user)
}
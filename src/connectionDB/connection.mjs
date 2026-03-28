import mysql from 'mysql2/promise'
import {config} from 'dotenv';
config();

export const connectionDB = await mysql.createPool({
    host: `${process.env.HOST}`,
    user: `${process.env.USER}`,
    password: `${process.env.PASSWORD}`,
    database: `${process.env.DB}`,

    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 10000
})
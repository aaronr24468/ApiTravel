import mysql from 'mysql2/promise';
import { connectionDB } from '../connectionDB/connection.mjs';

export const registerU = async(data) =>{
    const queryCheckUser = 'SELECT * FROM users WHERE username=?';
    const [userCheck] = await connectionDB.query(queryCheckUser, [data.username]);
    console.log(userCheck)
    if(userCheck.length === 1){
        return('MATCH')
    }else{
        const query = 'INSERT INTO users(name, lastname, age, username, password, image, phone, rol) values(?,?,?,?,?,?,?,?)';
        await connectionDB.query(query, [data.name, data.lastname, data.age, data.username, data.password, data.image, data.phone, data.rol]);
        return('Success')
    }
}

export const setImageUser = async(data) =>{
    const query = 'SELECT * FROM users WHERE username=?'
    const [user] = await connectionDB.query(query, [data.username]) 
    const querySet = 'UPDATE users SET image=? WHERE id=?';
    await connectionDB.query(querySet, [data.url, user[0].id])
}

export const registerD = async(data) =>{
    const query = 'INSERT INTO drivers(name, lastname, age, username, password, image, driver, cars) values(?,?,?,?,?,?,?,?)';
    await connectionDB.query(query, [data.name, data.lastname, data.age, data.username, data.password, data.image, data.driver, data.cars])
}

export const setImageD = async(data) =>{
    const query = 'SELECT * FROM drivers WHERE username=?'
    const [driver] = await connectionDB.query(query, [data.username]);
    const querySet = 'UPDATE drivers SET image=? WHERE id=?';
    await connectionDB.query(querySet, [data.url, driver[0].id]) 
}

export const getIdUser = async(username) =>{
    const query = `SELECT id FROM users WHERE username=?`;
    const [id] = await connectionDB.query(query, [username])
    return(id)
}
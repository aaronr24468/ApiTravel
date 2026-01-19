import { connectionDB } from "../connectionDB/connection.mjs";

export const getDataF = async(id) =>{
    const query = 'SELECT users.name, users.image, users.age FROM users WHERE users.id=?';
    const [data] =  await connectionDB.query(query, [id])
    return(data)
}
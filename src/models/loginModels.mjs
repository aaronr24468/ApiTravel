import { connectionDB } from "../connectionDB/connection.mjs";


export const getUser = async(username) =>{
    const query = `SELECT id, password, rol FROM users WHERE username=?`;
    const [user] = await connectionDB.query(query, [username]);
    //console.log(user)
    return(user)
}
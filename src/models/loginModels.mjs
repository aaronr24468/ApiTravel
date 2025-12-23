import { connectionDB } from "../connectionDB/connection.mjs";


export const getUser = async(data) =>{
    const query = `SELECT * FROM users WHERE username=?`;
    const [user] = await connectionDB.query(query, [data.username]);
    //console.log(user)
    return(user)
}
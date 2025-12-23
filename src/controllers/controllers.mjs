import { checkA } from "../models/models.mjs";

export const checkAccount = async(request, response) =>{
    try {
        const user = request.auth[0];
        const res = await checkA(user);
        if(res[0].username === user.username){
            response.status(200).json('S')
        }else{
            response.status(401).json('F')
        }
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}
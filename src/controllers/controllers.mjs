import { getInfo } from "../models/models.mjs";

export const logOut = (request, response) =>{
    try {
        response.clearCookie('travelToken',{
            secure: true,
            sameSite: "none",
            partitioned: true
        });
        response.status(200).json({logout: true});
    } catch (e) {
        response.status(401).json({logout: false})
    }
}

export const checkAccount = async(request, response) =>{
    try {
        const token = request.cookies.travelToken;
        //console.log(data)
        response.status(200).json({login: true})
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const getDataUser = async(request, response) =>{
    try {
        const data = {
            show: request.params.data,
            id: request.auth[0].id
        }

        if(data.show === "navBar"){
            const user = await getInfo(data);
            //console.log(user)
            const userInfo = {
                image: user[0].image,
                username: user[0].username
            }
            response.status(200).json(userInfo)
        }else if(data.show === "profile"){

        }
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}
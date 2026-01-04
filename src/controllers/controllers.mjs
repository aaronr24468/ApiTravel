
export const checkAccount = async(request, response) =>{
    try {
        const token = request.cookies.travelToken;
        
        response.status({login: true})
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}

export const logOut = (request, response) => {
    try {
        response.clearCookie('travelToken', {
            secure: true,
            sameSite: "none",
            partitioned: true
        });
        response.status(200).json({ logout: true });
    } catch (e) {
        response.status(401).json({ logout: false })
    }
}

export const checkAccount = async (request, response) => {
    try {
        const token = request.cookies.travelToken;
        //console.log(data)
        response.status(200).json({ login: true })
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
} 



export const verifyU = (request, response) => {
    try {
        response.status(200).json({ driver: true })
    } catch (e) {
        console.error(e);
        response.status(401).json('F')
    }
}
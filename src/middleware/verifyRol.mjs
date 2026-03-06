export const verifyUserRol = (roles = []) => (req, res, next) =>{
    
    if(!roles.includes(req.auth.rol)){
        return(res.status(403).json({message: "Forbidden"}))
    }else{
        next();
    }
}
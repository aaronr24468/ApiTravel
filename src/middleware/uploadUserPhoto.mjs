import multer from "multer";

export const uploadUserPhoto = multer({
    storage: multer.memoryStorage(),
    limits: {fieldSize: 5 * 1024 * 1024}, //5MB
    fileFilter: (req, file, cb) =>{
        //console.log(file.mimetype)
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('Solo imagenes'), false);
        }
        cb(null, true)
    }
})
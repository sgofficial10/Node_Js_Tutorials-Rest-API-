const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/')
    },
    filename: (req, file, cb) => {
        
        let filetype='';
        if(file.mimetype === 'image/png') {
            filetype = 'png'
        }
        if(file.mimetype === 'image/jpeg') {
            filetype = 'jpeg'
        }
        cb(null, 'image-' + Date.now() + '.' + filetype)

    }
})

const image_upload = multer({
    storage:storage,
    fileFilter : (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            if(file.size > 4*1024*1024) {
                cb(null, false);
                return cb(new Error('Image must be less than 4MB'))
            } else {
                cb(null, true);
            }
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
        }
    }
})
module.exports = image_upload
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './profilePics')
    },
    filename: (req, file, cb) => {
        cb(null, `Image-${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/heif') {
        cb(null, true)
    } else {
        cb(null, false)
        cb(new Error("Invalid file format..file should be (jpg, png, jpeg or heif)!"))
    }
}

module.exports = multer({
    storage, fileFilter
})
const router = require('express').Router();
const path = require('path');
const cloudinary = require('cloudinary');
// const download = require('download');
const config = require('../config/config')
const fotos = require('../models/foto')
const user = require('../models/usuario')
cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret
});

const fileFilter = (req, file, cb) => {
    //if (file.mimetype.match(/.(jpeg|png|gif)$/))
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false); // false, ignore other files
    }
}
const uploadImage = multer({
    storage,
    fileFilter
})
router.get('/fotos', async (req, res) => {
        if (req.user == undefined) {
            res.status(400).send('Sesion no iniciada');
        } else {
            return await fotos.getPhotosByEmail(req.user.email)
        }
    })
    .post('/fotos', uploadImage.single('image'), async (req, res) => {
        if (req.user == undefined) {
            res.status(400).send('Sesion no iniciada');
        }else {
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path);
            let a = await fotos.addPhoto(result.url, req.body.name, req.user.email)
            user.addPhoto(req.user.email, a.uid)
            res.status(200).send(a)
        }
        
    })

module.exports = router;
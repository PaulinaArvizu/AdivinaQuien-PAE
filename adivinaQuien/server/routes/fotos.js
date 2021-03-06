const router = require('express').Router();
const path = require('path');
const cloudinary = require('cloudinary');
const multer = require('multer');
// const download = require('download');
const config = require('../config/config');
const Foto = require('../models/foto');
const fs = require('fs');
cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret
});

//crear storage
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/img/'), //direccion donde se guardan las imagenes
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
})

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
        let a = await Foto.getPhotos();
        res.status(200).send(a);
    })
    .post('/fotos', uploadImage.single('image'), async (req, res) => {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path);

        if(!result.url || !req.body.name) {
            console.log(result)
            console.log(req.body)
            res.status(400).send("Faltan datos.");
            return;
        }

        let a = await Foto.createPhoto(result.url, req.body.name);
        res.status(201).send(a);
    })
    .get('/fotos/:id', async (req, res) => {
        let a = await Foto.getPhotoById(req.params.id);
        res.status(200).send(a);
    })
    .delete('/fotos/:id', async (req, res) => {
        let a = await Foto.deletePhoto({'_id':req.params.id});
        res.status(200).send(a);
    })

module.exports = router;
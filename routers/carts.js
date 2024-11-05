const express = require('express');
const router = express.Router();

const multer = require('multer');
//Thiết lập nơi lưu trữ và tên file
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
//Kiểm tra file upload
function checkFileUpLoad(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Bạn chỉ được upload file ảnh'));
    }
    cb(null, true);
}
//Upload file
let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });



//import model
const connectDb = require('../models/db')




router.get('/', async (req, res) => {
    const db = await connectDb()
    const cartsCollection = db.collection('carts')
    const carts = await cartsCollection.find().toArray()
    res.render('cart',{carts})
})

// Route lấy giỏ hàng theo userId

// router.get('/userId', async (req, res) => {
//     const db = await connectDb()
//     const cartsCollection = db.collection('carts')
//     const carts = await cartsCollection.find().toArray()
//     res.render('cart',{carts})
// })

module.exports = router;

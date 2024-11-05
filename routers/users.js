const express = require('express')
const router = express.Router()
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


router.get('/',async(req,res)=>{
   const db=await connectDb()
   const usersCollection = db.collection('users')
   const users=await usersCollection.find().toArray()
   res.render('user',{users})
})




router.get('/delete/:id',async(req,res)=>{
    const db=await connectDb()
    const usersCollection = db.collection('users')
    let id = req.params.id
    await usersCollection.deleteOne({id:parseInt(id)})
    res.redirect('/users')
})

// router.get('/edit/:id',async(req,res)=>{
//     const db=await connectDb()
//     const productsCollection = db.collection('products')
//     let id = req.params.id
//     const product= await productsCollection.findOne({id:parseInt(id)})
//     res.render('editPro',{product})
// })

// router.post('/edit',upload.single('img'),async (req,res)=>{
//     const db=await connectDb()
//     const productsCollection = db.collection('products')
//     let{id,name,price,categoryId,description}=req.body
//     let img = req.file ? req.file.originalname : req.body.imgOld
//     let editProduct={name,price,categoryId,img,description}
//     await productsCollection.updateOne({id:parseInt(id)},{$set:editProduct})
//     res.redirect('/products')
// })





module.exports = router;
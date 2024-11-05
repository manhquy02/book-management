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
   const productsCollection = db.collection('products')
   const products=await productsCollection.find().toArray()
   res.render('product',{products})
})
router.get('/add',(req,res,)=>{
    res.render('addPro');
})

router.post('/add',upload.single('img'),async (req,res,)=>{
    let {name,price,categoryId,description}=req.body
    let img = req.file.originalname
    const db=await connectDb()
    const productsCollection = db.collection('products')
    let lastProduct= await productsCollection.find().sort({id:-1}).limit(1).toArray()
    let id= lastProduct[0] ? lastProduct[0].id +1 :1
    let newProduct= {id,name,price,categoryId,img,description}
    await productsCollection.insertOne(newProduct)
    res.redirect('/products')
    })


router.get('/edit/:id',async(req,res)=>{
    const db=await connectDb()
    const productsCollection = db.collection('products')
    let id = req.params.id
    const product= await productsCollection.findOne({id:parseInt(id)})
    res.render('editPro',{product})
})

router.post('/edit',upload.single('img'),async (req,res)=>{
    const db=await connectDb()
    const productsCollection = db.collection('products')
    let{id,name,price,categoryId,description}=req.body
    let img = req.file ? req.file.originalname : req.body.imgOld
    let editProduct={name,price,categoryId,img,description}
    await productsCollection.updateOne({id:parseInt(id)},{$set:editProduct})
    res.redirect('/products')
})

router.get('/delete/:id',async(req,res)=>{
    const db=await connectDb()
    const productsCollection = db.collection('products')
    let id = req.params.id
    await productsCollection.deleteOne({id:parseInt(id)})
    res.redirect('/products')
})

// router.get('/:id',(req,res)=>{
//     let id = req.params.id
//     let product = products.find(p=>p.id ==id)
//     res.send(`
//         <h1> day la trang chi tiet san pham </h1>
//         <h4>${product.name}</h4>
//         <img src="../images/${product.img}">
//          <h4> Gia: ${product.price}</h4>
//         `)
// })

module.exports = router;
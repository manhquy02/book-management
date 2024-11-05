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


//Lấy tất cả sản phẩm bàng json
router.get('/', async (req, res) => {
    const db = await connectDb()
    const categoriesCollection = db.collection('categories')
    const categories = await categoriesCollection.find().toArray()
    res.render('category',{categories})
})


// //them danh muc
router.get('/add',(req,res,)=>{
    res.render('addCate');
})

router.post('/add',upload.single('img'),async (req,res,)=>{
    let {name} =req.body
    let img = req.file.originalname
    const db=await connectDb()
    const categoriesCollection = db.collection('categories')
    let lastCategory= await categoriesCollection.find().sort({id:-1}).limit(1).toArray()
    let id= lastCategory[0] ? lastCategory[0].id +1 :1
    let newCategory= {id,name,img}
    await categoriesCollection.insertOne(newCategory)
    res.redirect('/categories')
    })

// //sua danh muc
router.get('/edit/:id',async(req,res)=>{
    const db=await connectDb()
    const categoriesCollection = db.collection('categories')
    let id = req.params.id
    const category= await categoriesCollection.findOne({id:parseInt(id)})
    res.render('editCate',{category})
})

router.post('/edit',upload.single('img'),async (req,res)=>{
    const db=await connectDb()
    const categoriesCollection = db.collection('categories')
    let{id,name}=req.body
    let img = req.file ? req.file.originalname : req.body.imgCu
    let editCategory={name,img}
    await categoriesCollection.updateOne({id:parseInt(id)},{$set:editCategory})
    res.redirect('/categories')
})

// //xoa danh muc

router.get('/delete/:id',async(req,res)=>{
    const db=await connectDb()
    const categoriesCollection = db.collection('categories')
    let id = req.params.id
    await categoriesCollection.deleteOne({id:parseInt(id)})
    res.redirect('/categories')
})

//lay danh sach san pham theo ma danh muc
// router.get('/products/categoryid/:id', async (req, res) => {
//     let id = req.params.id
//     const db = await connectDb()
//     const productCollection = db.collection('products')
//     const products = await productCollection.find({ categoryId: parseInt(id) }).toArray()
//     if (products) {
//         res.status(200).json(products)
//     } else {
//         res.status(404).json({ message: 'loi' })
//     }
// })

// //lay danh sach san pham theo ten danh muc
// router.get('/products/categoryname/:name', async (req, res) => {
//     let name = req.params.name
//     const db = await connectDb()
//     const categoryCollection = db.collection('categories')
//     const category = await categoryCollection.findOne({name: name})
//     const productCollection = db.collection('products')
//     const products = await productCollection.find({ categoryId: category.id }).toArray()

//     if (products) {
//         res.status(200).json(products)
//     } else {
//         res.status(404).json({ message: 'loi' })
//     }
// })

// //lay danh sach san pham noi bat
// router.get('/products/hot', async (req, res) => {
//     const db = await connectDb()
//     const productCollection = db.collection('products')
//     const products = await productCollection.find({hot: 1}).toArray()
//     if (products) {
//         res.status(200).json(products)
//     } else {
//         res.status(404).json({ message: 'loi' })
//     }
// })


// //tim kiem san pham 
// router.get('/products/search/:name', async (req, res) => {
//     let name = req.params.name
//     const db = await connectDb()
//     const productCollection = db.collection('products')
//     const products = await productCollection.find({name: {$regex:name,$options:'i'}}).toArray()
//     if (products) {
//         res.status(200).json(products)
//     } else {
//         res.status(404).json({ message: 'loi' })
//     }
// })

// //show chi tiết 1 sản phẩm
// router.get('/productdetail/:id', async (req, res) => {
//     let id = req.params.id
//     const db = await connectDb()
//     const productsCollection = db.collection('products')
//     const products = await productsCollection.findOne({ id: parseInt(id) })
//     if (products) {
//         res.status(200).json(products)
//     } else {
//         res.status(404).json({ message: 'khong tim thay' })
//     }
// })
module.exports = router;
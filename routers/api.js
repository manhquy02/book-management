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
router.get('/products', async (req, res) => {
    const db = await connectDb()
    const productsCollection = db.collection('products')
    const products = await productsCollection.find().toArray()
    if (products) {
        res.status(200).json(products)
    } else {
        res.status(404).json({ message: 'khong tim thay' })
    }
})

//Lấy tất cả danh mục bàng json
router.get('/categories',authenToken, async (req, res) => {
    const db = await connectDb()
    const categoriesCollection = db.collection('categories')
    const categories = await categoriesCollection.find().toArray()
    if (categories) {
        res.status(200).json(categories)
    } else {
        res.status(404).json({ message: 'khong tim thay' })
    }
})


//them san pham 
router.post('/products', upload.single('img'), async (req, res,) => {
    let { name, price, categoryId, description } = req.body
    let img = req.file.originalname
    const db = await connectDb()
    const productsCollection = db.collection('products')
    let lastProduct = await productsCollection.find().sort({ id: -1 }).limit(1).toArray()
    let id = lastProduct[0] ? lastProduct[0].id + 1 : 1
    let newProduct = { id, name, price, categoryId, img, description }
    await productsCollection.insertOne(newProduct)
    if (newProduct) {
        res.status(200).json(newProduct)
    } else {
        res.status(404).json({ message: 'khong tim thay' })
    }

})


//them danh muc 
router.post('/categories', upload.single('img'), async (req, res,) => {
    let {name} =req.body    
    let img = req.file.originalname
    const db = await connectDb()
    const categoriesCollection = db.collection('categories')
    let lastCategory = await categoriesCollection.find().sort({ id: -1 }).limit(1).toArray()
    let id = lastCategory[0] ? lastCategory[0].id + 1 : 1
    let newCategory = {id,name,img}
    await categoriesCollection.insertOne(newCategory)
    if (newCategory) {
        res.status(200).json(newCategory)
    } else {
        res.status(404).json({ message: 'khong tim thay' })
    }

})


//sua san pham
router.put('/products/:id', upload.single('img'), async (req, res) => {
    let id = req.params.id
    const db = await connectDb()
    const productsCollection = db.collection('products')
    let { name, price, categoryId, description } = req.body
    if (req.file) {
        var img = req.file.originalname
    } else {
        let product = await productsCollection.findOne({ id: parseInt(id) })
        var img = product.img
    }
    let editProduct = { name, price, categoryId, img, description }
    await productsCollection.updateOne({ id: parseInt(id) }, { $set: editProduct })

    if (editProduct) {
        res.status(200).json(editProduct)
    } else {
        res.status(404).json({ message: 'khong tim thay' })
    }

})

// //sua danh muc
router.put('/categories/:id', upload.single('img'), async (req, res) => {
    let id = req.params.id
    const db = await connectDb()
    const categoriesCollection = db.collection('categories')
    let { name } = req.body
    if (req.file) {
        var img = req.file.originalname
    } else {
        let category = await categoriesCollection.findOne({ id: parseInt(id) })
        var img = category.img
    }
    let editCategory = { name, img }
    await categoriesCollection.updateOne({ id: parseInt(id) }, { $set: editCategory })

    if (editCategory) {
        res.status(200).json(editCategory)
    } else {
        res.status(404).json({ message: 'khong tim thay' })
    }

})

//xoa san pham

router.delete('/products/:id', async (req, res) => {
    const db = await connectDb()
    const productsCollection = db.collection('products')
    let id = req.params.id
    let product = await productsCollection.deleteOne({ id: parseInt(id) })
    if (product) {
        res.status(200).json({ message: 'xoa thanh cong' })
    } else {
        res.status(200).json({ message: 'loi' })
    }
})

//lay danh sach san pham theo ma danh muc
router.get('/products/categoryid/:id', async (req, res) => {
    let id = req.params.id
    const db = await connectDb()
    const productCollection = db.collection('products')
    const products = await productCollection.find({ categoryId: parseInt(id) }).toArray()
    if (products) {
        res.status(200).json(products)
    } else {
        res.status(404).json({ message: 'loi' })
    }
})
//lay danh sach san pham theo hot theo categoryId
router.get('/products/hot/categoryid/:id', async (req, res) => {
    let id = req.params.id
    const db = await connectDb()
    const productCollection = db.collection('products')
    const products = await productCollection.find({ hot:1,categoryId: parseInt(id) }).toArray()
    if (products) {
        res.status(200).json(products)
    } else {
        res.status(404).json({ message: 'loi' })
    }
})

//lay danh sach san pham theo ten danh muc
router.get('/products/categoryname/:name', async (req, res) => {
    let name = req.params.name
    const db = await connectDb()
    const categoryCollection = db.collection('categories')
    const category = await categoryCollection.findOne({name: name})
    const productCollection = db.collection('products')
    const products = await productCollection.find({ categoryId: category.id }).toArray()

    if (products) {
        res.status(200).json(products)
    } else {
        res.status(404).json({ message: 'loi' })
    }
})

//lay danh sach san pham noi bat
router.get('/products/hot', async (req, res) => {
    const db = await connectDb()
    const productCollection = db.collection('products')
    const products = await productCollection.find({hot: 1}).toArray()
    if (products) {
        res.status(200).json(products)
    } else {
        res.status(404).json({ message: 'loi' })
    }
})


//tim kiem san pham 
router.get('/products/search/:name', async (req, res) => {
    let name = req.params.name
    const db = await connectDb()
    const productCollection = db.collection('products')
    const products = await productCollection.find({name: {$regex:name,$options:'i'}}).toArray()
    if (products) {
        res.status(200).json(products)
    } else {
        res.status(404).json({ message: 'loi' })
    }
})

//show chi tiết 1 sản phẩm
router.get('/productdetail/:id', async (req, res) => {
    let id = req.params.id
    const db = await connectDb()
    const productsCollection = db.collection('products')
    const products = await productsCollection.findOne({ id: parseInt(id) })
    if (products) {
        res.status(200).json(products)
    } else {
        res.status(404).json({ message: 'khong tim thay' })
    }
})



//đăng ký
const bcrypt = require('bcryptjs');
router.post('/user/register', upload.single('img'), async(req, res, next)=>{
    let {email, password, fullname} = req.body;
    const db=await connectDb();
    const userCollection=db.collection('users');
    let user=await userCollection.findOne({email: email});
    if(user){
    res.status(409).json({message: "Email đã tồn tại"});
    }else{
    let lastuser= await userCollection.find().sort({id:-1}).limit(1).toArray();
    let id= lastuser[0] ? lastuser[0].id+1 : 1;
    const salt = bcrypt.genSaltSync(10);
    let hashPassword=bcrypt.hashSync(password,salt);
    let newUser={id:id, email, password: hashPassword,fullname, isAdmin: 0};
    try {
    let result =await userCollection.insertOne(newUser);
    console.log(result);
    res.status(200).json({message: "Đăng ký thành công"});
    } catch (error) {
    console.error(error);
    res.status(500).json({message: "Lỗi khi thêm người dùng mới"});
    }
    }

})

//chức năng đăng nhập 
const jwt = require('jsonwebtoken');
router.post('/user/login', upload.single('img'), async(req, res, next)=>{
    const db=await connectDb();
    const userCollection=db.collection('users');
    let {email, password} = req.body;
    let user=await userCollection.findOne({email: email});
    if(user){
        if(bcrypt.compareSync(password,user.password)){
            //res.status(200).json({message:"đăng nhập thành công"})
            const token = jwt.sign({email:user.email,isAdmin:user.isAdmin},
                'secretkey',{expiresIn:'30s'});
                res.status(200).json({token:token});
        }else{
            res.status(403).json({message:"Password không chính xác"})
        }
    }else{
        res.status(403).json({message:"Email không chính xác"})
    }

})

//Xác thực token
function authenToken(req, res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    jwt.verify(req.token, 'secretkey', (err, authData)=>{
    if(err){
    res.status(403).json({message: "Không có quyền truy cập"});
    }else{
    next();
    }
    })
    }else{
    res.status(403).json({message: "Không có quyền truy cập"});
    }
}


//cart
router.post('/cart', async (req, res) => {
    let { productId, quantity } = req.body;
    
    // Kết nối tới cơ sở dữ liệu
    const db = await connectDb();
    const cartsCollection = db.collection('carts');

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let existingCartItem = await cartsCollection.findOne({ productId: productId });

    if (existingCartItem) {
        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        let newQuantity = existingCartItem.quantity + quantity;
        await cartsCollection.updateOne(
            { productId: productId },
            { $set: { quantity: newQuantity } }
        );
        res.status(200).json({ message: 'Cập nhật số lượng thành công', productId, quantity: newQuantity });
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
        let newCartItem = { productId, quantity };
        await cartsCollection.insertOne(newCartItem);
        res.status(201).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công', newCartItem });
    }
});

module.exports = router;
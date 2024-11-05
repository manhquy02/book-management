
const hot = document.querySelector('#hot')
const proCate1 = document.querySelector('#proCate1')
const proCate2 = document.querySelector('#proCate2')


//san pham hot
fetch('http://localhost:1000/api/products/hot')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            hot.innerHTML += `
<div class="colum">
<img src="http://localhost:1000/images/${product.img} ">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
        })
    })
    .catch(err=>console.log(err))

//san pham hot sachthieunhi
fetch('http://localhost:1000/api/products/hot/categoryid/1')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            hotthieunhi.innerHTML += `
<div class="colum">
<img src="http://localhost:1000/images/${product.img} ">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
        })
    })
    .catch(err=>console.log(err))

    //san pham hot sachvanhoc
fetch('http://localhost:1000/api/products/hot/categoryid/2')
.then(response => response.json())
.then(data => {
    data.forEach(product => {
        hotvanhoc.innerHTML += `
<div class="colum">
<img src="http://localhost:1000/images/${product.img} ">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
    })
})
.catch(err=>console.log(err))

    //san pham hot sachtruyencamhung
    fetch('http://localhost:1000/api/products/hot/categoryid/3')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            hottruyencamhung.innerHTML += `
    <div class="colum">
    <img src="http://localhost:1000/images/${product.img} ">
    <h3>${product.name}</h3>
    <p>${product.price}</p>
    <a href="./detail.html?id=${product.id}">Xem chi tiết</a>
    </div>
    `
        })
    })
    .catch(err=>console.log(err))


//san pham dm1
fetch('http://localhost:1000/api/products/categoryname/sachthieunhi')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            proCate1.innerHTML += `
<div class="colum">
<img src="http://localhost:1000/images/${product.img}">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
        })
    })
    .catch(err=>console.log(err))




    
//san pham dm2
fetch('http://localhost:1000/api/products/categoryname/sachvanhoc')
.then(response => response.json())
.then(data => {
    data.forEach(product => {
        proCate2.innerHTML += `
<div class="colum">
<img src="http://localhost:1000/images/${product.img}">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
    })
})
.catch(err=>console.log(err))

//san pham dm3
fetch('http://localhost:1000/api/products/categoryname/sachtruyencamhung')
.then(response => response.json())
.then(data => {
    data.forEach(product => {
        proCate3.innerHTML += `
<div class="colum">
<img src="http://localhost:1000/images/${product.img}"">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
    })
})
.catch(err=>console.log(err))

//hien thi tat ca san pham
fetch('http://localhost:1000/api/products')
.then(response => response.json())
.then(data => {
    data.forEach(product => {
        proAll.innerHTML += `
<div class="colum">
<img src="http://localhost:1000/images/${product.img}" ">
<h3>${product.name}</h3>
<p>${product.price}</p>
<a href="./detail.html?id=${product.id}">Xem chi tiết</a>
</div>
`
    })
})
.catch(err=>console.log(err))



//xem chi tiet san pham
const detail=document.querySelector('#detail')
const id = window.location.href.split('id=')[1];
fetch(`http://localhost:1000/api/productdetail/${id}`)
.then(response => response.json())
.then(product => {
   
        detail.innerHTML += `
      <div class="product-detail-image">  
<img src="http://localhost:1000/images/${product.img} ">
        </div>
<div class="product-detail-info">
<h3>${product.name}</h3>
<p>Giá:${product.price}</p>
<p>Mô tả: ${product.description}</p>
<div class="quantity-selector">
            <label for="quantity">Số lượng:</label>
            <input type="number" id="quantity" name="quantity" value="1" min="1">
        </div>

          <button class="add-to-cart-btn" id="add-to-cart-btn">Thêm vào giỏ hàng</button>
</div>
`
    })

.catch(err=>console.log(err))
// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(item => item.productId === productId);

    if (existingProduct) {
        // Cập nhật số lượng nếu sản phẩm đã có trong giỏ
        existingProduct.quantity += parseInt(quantity);
    } else {
        // Thêm sản phẩm mới vào giỏ
        cart.push({ productId, quantity: parseInt(quantity) });
    }

    // Lưu giỏ hàng vào local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Chuyển hướng đến trang giỏ hàng
    window.location.href = 'cart.html';
}



